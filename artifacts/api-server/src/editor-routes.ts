import { Express, Request, Response, NextFunction } from "express";
import multer from "multer";
import crypto from "crypto";
import path from "path";
import fs from "fs";
import rateLimit from "express-rate-limit";
import { db, postsTable, subscriberTokensTable } from "@workspace/db";
import { eq, desc, sql } from "drizzle-orm";
import { anthropic } from "@workspace/integrations-anthropic-ai";

if (!process.env.METRICADIA_ADMIN_PASSWORD) {
  console.error(
    "[Metricadia] WARNING: METRICADIA_ADMIN_PASSWORD env var is not set. " +
    "Using insecure fallback — set this secret immediately in production.",
  );
}
const ADMIN_PASSWORD = process.env.METRICADIA_ADMIN_PASSWORD || "KoGAlpha#7";

function generateToken(): string {
  return crypto.randomBytes(32).toString("hex");
}

// Map from token → session ID so logout can revoke only the caller's token
const tokenToSessionId = new Map<string, string>();

// Rate limiter: max 6 login attempts per 15 minutes per IP
const loginRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 6,
  standardHeaders: true,
  legacyHeaders: false,
  message: { message: "Too many login attempts, please try again later." },
  skipSuccessfulRequests: true,
});

declare module "express-session" {
  interface SessionData {
    metricadiaAdmin?: boolean;
  }
}

function isAdminAuthenticated(req: Request): boolean {
  if ((req.session as any)?.metricadiaAdmin === true) return true;
  const token =
    (req.headers["x-metricadia-token"] as string) ||
    (req.headers["x-admin-token"] as string);
  if (token && tokenToSessionId.has(token)) return true;
  return false;
}

export function requireMetricadiaAuth(req: Request, res: Response, next: NextFunction) {
  if (isAdminAuthenticated(req)) return next();
  res.status(401).json({ message: "Unauthorized - Metricadia admin access required" });
}

const UPLOAD_DIR = process.env.UPLOAD_DIR || path.join(process.cwd(), "public", "uploads");
if (!fs.existsSync(UPLOAD_DIR)) fs.mkdirSync(UPLOAD_DIR, { recursive: true });

const imageStorage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, UPLOAD_DIR),
  filename: (_req, file, cb) => {
    const timestamp = Date.now();
    const safe = file.originalname.replace(/\s+/g, "-").replace(/[^a-zA-Z0-9.\-_]/g, "");
    cb(null, `img-${timestamp}-${safe}`);
  },
});

const imageUpload = multer({
  storage: imageStorage,
  limits: { fileSize: 10 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    if (file.mimetype.startsWith("image/")) cb(null, true);
    else cb(new Error("Only image files are allowed"));
  },
});

export function registerMetricadiaRoutes(app: Express) {

  app.post("/api/metricadia/login", loginRateLimiter, (req: Request, res: Response) => {
    const { password } = req.body as { password?: string };
    if (!password) return res.status(400).json({ message: "Password required" });

    // Constant-time comparison to prevent timing attacks
    const provided = Buffer.from(password);
    const expected = Buffer.from(ADMIN_PASSWORD);
    const match =
      provided.length === expected.length &&
      crypto.timingSafeEqual(provided, expected);

    if (!match) {
      // Uniform delay on failure to frustrate timing analysis
      return setTimeout(() => {
        res.status(401).json({ message: "Incorrect password" });
      }, 400 + Math.random() * 200) as unknown as void;
    }

    // Regenerate session on successful login to prevent session fixation
    req.session.regenerate((err) => {
      if (err) {
        console.error("[Metricadia] session regenerate error:", err);
        return res.status(500).json({ message: "Session error" });
      }
      (req.session as any).metricadiaAdmin = true;

      const token = generateToken();
      const sessionId = req.session.id;
      tokenToSessionId.set(token, sessionId);
      // Auto-expire token after 24 h
      setTimeout(() => tokenToSessionId.delete(token), 24 * 60 * 60 * 1000);

      // Store token in session so logout can revoke it
      (req.session as any).adminToken = token;

      return res.json({ success: true, token });
    });
  });

  app.post("/api/metricadia/logout", (req: Request, res: Response) => {
    // Revoke only this session's bearer token
    const token = (req.session as any).adminToken as string | undefined;
    if (token) tokenToSessionId.delete(token);
    req.session.destroy(() => {});
    res.json({ success: true });
  });

  app.get("/api/metricadia/auth-status", (req: Request, res: Response) => {
    res.json({ authenticated: isAdminAuthenticated(req) });
  });

  app.post(
    "/api/upload-image",
    requireMetricadiaAuth,
    imageUpload.single("image"),
    (req: Request, res: Response) => {
      if (!req.file) return res.status(400).json({ message: "No image file provided" });
      const url = `/uploads/${req.file.filename}`;
      console.log(`[Metricadia] Image uploaded: ${req.file.filename}`);
      return res.json({ success: true, url, filename: req.file.filename });
    }
  );

  app.get("/api/metricadia/posts", requireMetricadiaAuth, async (_req: Request, res: Response) => {
    try {
      const posts = await db
        .select({
          id: postsTable.id,
          title: postsTable.title,
          slug: postsTable.slug,
          excerpt: postsTable.teaser,
          content: postsTable.body,
          publishedAt: postsTable.publishedAt,
          caseNumber: postsTable.caseNumber,
          premiumOnly: postsTable.premiumOnly,
          status: postsTable.status,
          category: postsTable.category,
          primarySources: postsTable.primarySources,
        })
        .from(postsTable)
        .orderBy(desc(postsTable.publishedAt))
        .limit(500);
      return res.json({ posts, total: posts.length });
    } catch (err) {
      console.error("[Metricadia] Error fetching posts:", err);
      return res.status(500).json({ message: "Failed to fetch posts" });
    }
  });

  app.get("/api/metricadia/next-case-number", requireMetricadiaAuth, async (_req: Request, res: Response) => {
    try {
      const rows = await db
        .select({ caseNumber: postsTable.caseNumber })
        .from(postsTable)
        .where(sql`${postsTable.caseNumber} ~ '^CB-[0-9]{6}$'`);

      let max = 0;
      for (const row of rows) {
        const num = parseInt(row.caseNumber.replace("CB-", ""), 10);
        if (!isNaN(num) && num > max) max = num;
      }
      const next = `CB-${String(max + 1).padStart(6, "0")}`;
      return res.json({ caseNumber: next });
    } catch (err) {
      console.error("[Metricadia] Error computing next case number:", err);
      return res.status(500).json({ message: "Failed to compute next case number" });
    }
  });

  app.post("/api/metricadia/posts", requireMetricadiaAuth, async (req: Request, res: Response) => {
    const {
      caseNumber, title, slug, teaser, body, category,
      seoMetaTitle, verifiedSource, tags,
      status, subjectName, subjectTitle, subjectParty,
    } = req.body as Record<string, any>;

    const isDraft = status === "draft";
    if (!caseNumber || !title || !slug || !category || (!isDraft && !body)) {
      return res.status(400).json({ message: "caseNumber, title, slug, category are required (body required unless draft)" });
    }

    try {
      const [inserted] = await db
        .insert(postsTable)
        .values({
          caseNumber,
          title,
          slug,
          teaser: teaser || "",
          body: body || "",
          category,
          seoMetaTitle: seoMetaTitle || null,
          verifiedSource: verifiedSource || null,
          tags: Array.isArray(tags) ? tags : [],
          status: status || "published",
          publishedAt: new Date(),
          subjectName: subjectName || null,
          subjectTitle: subjectTitle || null,
          subjectParty: subjectParty || null,
          nerdAccessible: true,
          locked: false,
        })
        .returning({ id: postsTable.id, caseNumber: postsTable.caseNumber, slug: postsTable.slug });

      console.log(`[Metricadia] Post created: ${inserted.caseNumber}`);
      return res.status(201).json({ success: true, ...inserted });
    } catch (err: any) {
      console.error("[Metricadia] Error creating post:", err);
      if (err.code === "23505") {
        return res.status(409).json({ message: "Duplicate case_number or slug" });
      }
      return res.status(500).json({ message: "Failed to create post" });
    }
  });

  app.put("/api/posts/:id", requireMetricadiaAuth, async (req: Request, res: Response) => {
    const { id } = req.params;
    const { title, content, excerpt, primarySources } = req.body as {
      title: string;
      content: string;
      excerpt: string;
      primarySources?: any[];
    };

    if (!title || content === undefined) {
      return res.status(400).json({ message: "title and content are required" });
    }

    try {
      const updateData: any = {
        title,
        body: content,
        teaser: excerpt || "",
        updatedAt: new Date(),
      };
      if (Array.isArray(primarySources)) {
        updateData.primarySources = primarySources;
      }

      await db
        .update(postsTable)
        .set(updateData)
        .where(eq(postsTable.id, id));

      console.log(`[Metricadia] Post updated: ${id}`);
      return res.json({ success: true, id, title, excerpt });
    } catch (err) {
      console.error("[Metricadia] Error updating post:", err);
      return res.status(500).json({ message: "Failed to update post" });
    }
  });

  // ── Delete post ──────────────────────────────────────────────────────────
  app.delete("/api/metricadia/posts/:id", requireMetricadiaAuth, async (req: Request, res: Response) => {
    const { id } = req.params;
    try {
      const rows = await db
        .delete(postsTable)
        .where(eq(postsTable.id, id))
        .returning({ id: postsTable.id, title: postsTable.title });
      if (!rows.length) return res.status(404).json({ message: "Post not found" });
      console.log(`[Metricadia] Post deleted: ${id}`);
      return res.json({ success: true, deleted: rows[0] });
    } catch (err) {
      console.error("[Metricadia] post delete error:", err);
      return res.status(500).json({ message: "Failed to delete post" });
    }
  });

  // ── Status toggle (draft ↔ published) ────────────────────────────────────
  app.patch("/api/metricadia/posts/:id/status", requireMetricadiaAuth, async (req: Request, res: Response) => {
    const { id } = req.params;
    const { status } = req.body as { status?: string };
    if (!status || !["draft", "review", "published"].includes(status)) {
      return res.status(400).json({ message: "status must be 'draft', 'review', or 'published'" });
    }
    try {
      const updateData: any = { status, updatedAt: new Date() };
      if (status === "published") updateData.publishedAt = new Date();
      const rows = await db
        .update(postsTable)
        .set(updateData)
        .where(eq(postsTable.id, id))
        .returning({ id: postsTable.id, slug: postsTable.slug, status: postsTable.status });
      if (!rows.length) return res.status(404).json({ message: "Post not found" });
      console.log(`[Metricadia] Post status updated: ${id} → ${status}`);
      return res.json(rows[0]);
    } catch (err) {
      console.error("[Metricadia] status update error:", err);
      return res.status(500).json({ message: "Failed to update status" });
    }
  });

  // ── Auto-detect people in article content ────────────────────────────────
  app.post("/api/metricadia/detect-people", requireMetricadiaAuth, async (req: Request, res: Response) => {
    const { content } = req.body as { content?: string };
    if (!content) return res.status(400).json({ message: "content is required" });

    const text = content.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
    if (text.length < 50) return res.json({ people: [] });

    try {
      const message = await anthropic.messages.create({
        model: "claude-haiku-4-5",
        max_tokens: 1024,
        messages: [{
          role: "user",
          content: `List all real people (not fictional characters) mentioned by name in this article. Return ONLY a valid JSON array of full name strings, nothing else. Example: ["John Smith","Jane Doe"]. If none, return [].\n\nArticle:\n${text.slice(0, 5000)}`
        }]
      });

      const block = message.content[0];
      if (block.type !== "text") return res.json({ people: [] });

      const jsonMatch = block.text.match(/\[[\s\S]*?\]/);
      if (!jsonMatch) return res.json({ people: [] });

      let names: string[] = [];
      try { names = JSON.parse(jsonMatch[0]); } catch { return res.json({ people: [] }); }
      if (!Array.isArray(names) || names.length === 0) return res.json({ people: [] });

      const uniqueNames = [...new Set(names.map(n => String(n).trim()).filter(Boolean))].slice(0, 15);

      // ── Image search helpers ────────────────────────────────────────────────
      const UA = "ClownBinge/1.0 (metricadiaresearch.com; contact@clownbinge.com)";
      const BAD_FILE = /logo|map|chart|diagram|flag|coat.of.arms|emblem|seal|icon|symbol|signature|autograph/i;

      async function commonsImage(name: string): Promise<{ imageUrl: string; attribution: string } | null> {
        try {
          const q = encodeURIComponent(`${name} portrait photograph`);
          const url = `https://commons.wikimedia.org/w/api.php?action=query&generator=search&gsrnamespace=6&gsrsearch=${q}&gsrlimit=8&prop=imageinfo&iiprop=url|extmetadata&iiurlwidth=500&format=json&origin=*`;
          const res = await fetch(url, { headers: { "User-Agent": UA }, signal: AbortSignal.timeout(5000) });
          if (!res.ok) return null;
          const d = await res.json() as any;
          const pages: any[] = Object.values(d?.query?.pages || {});
          for (const page of pages) {
            const info = page.imageinfo?.[0];
            if (!info?.url) continue;
            const fname = (page.title || "").toLowerCase();
            if (BAD_FILE.test(fname)) continue;
            if (!/\.(jpe?g|png|webp)/i.test(info.url)) continue;
            const meta = info.extmetadata || {};
            const license = meta.LicenseShortName?.value || meta.License?.value || "Wikimedia Commons";
            const rawAuthor = meta.Artist?.value || meta.Credit?.value || "";
            const author = rawAuthor.replace(/<[^>]+>/g, "").trim().slice(0, 60);
            const attribution = `Wikimedia Commons${author ? ` · ${author}` : ""} · ${license}`;
            return { imageUrl: info.url, attribution };
          }
          return null;
        } catch { return null; }
      }

      async function locImage(name: string): Promise<{ imageUrl: string; attribution: string } | null> {
        try {
          const q = encodeURIComponent(name);
          const url = `https://www.loc.gov/search/?q=${q}&fo=json&c=5&at=results&fa=online-format:image|access-restricted:false`;
          const res = await fetch(url, { headers: { "User-Agent": UA }, signal: AbortSignal.timeout(5000) });
          if (!res.ok) return null;
          const d = await res.json() as any;
          const results: any[] = d?.results || [];
          for (const item of results) {
            const imgs: string[] = item.image_url || [];
            const img = imgs.find((u: string) => /\.(jpe?g|png)/i.test(u)) || imgs[0];
            if (img) {
              const safe = img.startsWith("//") ? `https:${img}` : img;
              return { imageUrl: safe, attribution: "Library of Congress · Public Domain" };
            }
          }
          return null;
        } catch { return null; }
      }

      // ── Per-name lookup ─────────────────────────────────────────────────────
      const results = await Promise.allSettled(
        uniqueNames.map(async (name) => {
          try {
            // 1. Wikipedia summary
            const encoded = encodeURIComponent(name.replace(/ /g, "_"));
            const wikiRes = await fetch(`https://en.wikipedia.org/api/rest_v1/page/summary/${encoded}`, {
              headers: { "User-Agent": UA }, signal: AbortSignal.timeout(5000)
            });
            if (!wikiRes.ok) return { name, imageUrl: null, imageAttribution: null, description: null, found: false };

            const data = await wikiRes.json() as any;
            if (data.type === "disambiguation" || !data.extract) {
              return { name, imageUrl: null, imageAttribution: null, description: null, found: false };
            }

            const rawExtract: string = data.extract || "";
            const sentences = rawExtract.match(/[^.!?]+[.!?]+(?:\s|$)/g) || [];
            const bio = sentences.slice(0, 3).join("").trim() || rawExtract.slice(0, 260).trim();
            const canonicalName = data.title || name;

            // 2. If Wikipedia has a thumbnail, use it
            if (data.thumbnail?.source) {
              return {
                name: canonicalName,
                imageUrl: data.thumbnail.source,
                imageAttribution: "Wikipedia / Wikimedia Commons",
                description: bio || null,
                wikiUrl: data.content_urls?.desktop?.page || null,
                found: true,
              };
            }

            // 3. No thumbnail — search Wikimedia Commons
            const commons = await commonsImage(canonicalName);
            if (commons) {
              return {
                name: canonicalName,
                imageUrl: commons.imageUrl,
                imageAttribution: commons.attribution,
                description: bio || null,
                wikiUrl: data.content_urls?.desktop?.page || null,
                found: true,
              };
            }

            // 4. Try Library of Congress
            const loc = await locImage(canonicalName);
            if (loc) {
              return {
                name: canonicalName,
                imageUrl: loc.imageUrl,
                imageAttribution: loc.attribution,
                description: bio || null,
                wikiUrl: data.content_urls?.desktop?.page || null,
                found: true,
              };
            }

            // 5. Found on Wikipedia but no image anywhere
            return {
              name: canonicalName,
              imageUrl: null,
              imageAttribution: null,
              description: bio || null,
              wikiUrl: data.content_urls?.desktop?.page || null,
              found: true,
            };
          } catch {
            return { name, imageUrl: null, imageAttribution: null, description: null, found: false };
          }
        })
      );

      const people = results
        .filter((r): r is PromiseFulfilledResult<any> => r.status === "fulfilled" && r.value !== null)
        .map(r => r.value);

      console.log(`[Metricadia] Detected ${people.length} people (${people.filter((p: any) => p.found).length} with images)`);
      return res.json({ people });

    } catch (err) {
      console.error("[Metricadia] detect-people error:", err);
      return res.status(500).json({ message: "Detection failed" });
    }
  });

  app.get("/api/metricadiaid/:slug", async (req: Request, res: Response) => {
    const { slug } = req.params;
    try {
      return res.status(404).json({ message: "Profile not found" });
    } catch (err) {
      console.error("[Metricadia] Metricadia ID lookup error:", err);
      return res.status(500).json({ message: "Server error" });
    }
  });

  app.get("/api/metricadiaids", async (_req: Request, res: Response) => {
    try {
      return res.json([]);
    } catch (err) {
      console.error("[Metricadia] Metricadia IDs list error:", err);
      return res.status(500).json({ message: "Server error" });
    }
  });

  // ── Premium article toggle ────────────────────────────────────────────────

  app.patch("/api/metricadia/posts/:id/premium", requireMetricadiaAuth, async (req: Request, res: Response) => {
    const { id } = req.params;
    const { premiumOnly } = req.body as { premiumOnly?: boolean };
    if (typeof premiumOnly !== "boolean") {
      return res.status(400).json({ message: "premiumOnly must be a boolean" });
    }
    try {
      const rows = await db
        .update(postsTable)
        .set({ premiumOnly })
        .where(eq(postsTable.id, id))
        .returning({ id: postsTable.id, slug: postsTable.slug, premiumOnly: postsTable.premiumOnly });
      if (!rows.length) return res.status(404).json({ message: "Post not found" });
      return res.json(rows[0]);
    } catch (err) {
      console.error("[Metricadia] premium toggle error:", err);
      return res.status(500).json({ message: "Failed to update premium status" });
    }
  });

  // ── Subscriber token management ───────────────────────────────────────────

  app.get("/api/metricadia/subscriber-tokens", requireMetricadiaAuth, async (_req: Request, res: Response) => {
    try {
      const tokens = await db
        .select()
        .from(subscriberTokensTable)
        .orderBy(desc(subscriberTokensTable.createdAt));
      return res.json(tokens);
    } catch (err) {
      console.error("[Metricadia] token list error:", err);
      return res.status(500).json({ message: "Failed to fetch tokens" });
    }
  });

  app.post("/api/metricadia/subscriber-tokens", requireMetricadiaAuth, async (req: Request, res: Response) => {
    const { label, email, expiresAt } = req.body as { label?: string; email?: string; expiresAt?: string };
    if (!label || typeof label !== "string" || !label.trim()) {
      return res.status(400).json({ message: "label is required" });
    }
    const token = crypto.randomUUID();
    try {
      const [row] = await db
        .insert(subscriberTokensTable)
        .values({
          token,
          label: label.trim(),
          email: email?.trim() || null,
          expiresAt: expiresAt ? new Date(expiresAt) : null,
        })
        .returning();
      return res.status(201).json(row);
    } catch (err) {
      console.error("[Metricadia] token create error:", err);
      return res.status(500).json({ message: "Failed to create token" });
    }
  });

  app.patch("/api/metricadia/subscriber-tokens/:token/active", requireMetricadiaAuth, async (req: Request, res: Response) => {
    const { token } = req.params;
    const { active } = req.body as { active?: boolean };
    if (typeof active !== "boolean") {
      return res.status(400).json({ message: "active must be a boolean" });
    }
    try {
      const rows = await db
        .update(subscriberTokensTable)
        .set({ active })
        .where(eq(subscriberTokensTable.token, token))
        .returning();
      if (!rows.length) return res.status(404).json({ message: "Token not found" });
      return res.json(rows[0]);
    } catch (err) {
      console.error("[Metricadia] token toggle error:", err);
      return res.status(500).json({ message: "Failed to update token" });
    }
  });

  app.delete("/api/metricadia/subscriber-tokens/:token", requireMetricadiaAuth, async (req: Request, res: Response) => {
    const { token } = req.params;
    try {
      await db.delete(subscriberTokensTable).where(eq(subscriberTokensTable.token, token));
      return res.json({ success: true });
    } catch (err) {
      console.error("[Metricadia] token delete error:", err);
      return res.status(500).json({ message: "Failed to delete token" });
    }
  });

  console.log("[Metricadia] Editor routes registered ✓");
}
