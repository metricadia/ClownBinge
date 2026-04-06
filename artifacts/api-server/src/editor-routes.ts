import { Express, Request, Response, NextFunction } from "express";
import multer from "multer";
import crypto from "crypto";
import path from "path";
import fs from "fs";
import { db, postsTable } from "@workspace/db";
import { eq, desc } from "drizzle-orm";
import { anthropic } from "@workspace/integrations-anthropic-ai";

const ADMIN_PASSWORD = process.env.METRICADIA_ADMIN_PASSWORD || "KoGAlpha#7";

function generateToken(): string {
  return crypto.randomBytes(32).toString("hex");
}

const validTokens = new Set<string>();

declare module "express-session" {
  interface SessionData {
    metricadiaAdmin?: boolean;
  }
}

function isAdminAuthenticated(req: Request): boolean {
  if ((req.session as any)?.metricadiaAdmin === true) return true;
  const token =
    req.headers["x-metricadia-token"] as string ||
    req.headers["x-admin-token"] as string;
  if (token && validTokens.has(token)) return true;
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

  app.post("/api/metricadia/login", (req: Request, res: Response) => {
    const { password } = req.body as { password?: string };
    if (!password) return res.status(400).json({ message: "Password required" });

    if (password !== ADMIN_PASSWORD) {
      return setTimeout(() => {
        res.status(401).json({ message: "Incorrect password" });
      }, 400) as unknown as void;
    }

    (req.session as any).metricadiaAdmin = true;
    const token = generateToken();
    validTokens.add(token);
    setTimeout(() => validTokens.delete(token), 24 * 60 * 60 * 1000);
    return res.json({ success: true, token });
  });

  app.post("/api/metricadia/logout", (req: Request, res: Response) => {
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

  app.post("/api/metricadia/posts", requireMetricadiaAuth, async (req: Request, res: Response) => {
    const {
      caseNumber, title, slug, teaser, body, category,
      seoMetaTitle, verifiedSource, tags,
      status, subjectName, subjectTitle, subjectParty,
    } = req.body as Record<string, any>;

    if (!caseNumber || !title || !slug || !body || !category) {
      return res.status(400).json({ message: "caseNumber, title, slug, body, category are required" });
    }

    try {
      const [inserted] = await db
        .insert(postsTable)
        .values({
          caseNumber,
          title,
          slug,
          teaser: teaser || "",
          body,
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
    const { title, content, excerpt } = req.body as {
      title: string;
      content: string;
      excerpt: string;
    };

    if (!title || content === undefined) {
      return res.status(400).json({ message: "title and content are required" });
    }

    try {
      await db
        .update(postsTable)
        .set({
          title,
          body: content,
          teaser: excerpt || "",
          updatedAt: new Date(),
        })
        .where(eq(postsTable.id, id));

      console.log(`[Metricadia] Post updated: ${id}`);
      return res.json({ success: true, id, title, excerpt });
    } catch (err) {
      console.error("[Metricadia] Error updating post:", err);
      return res.status(500).json({ message: "Failed to update post" });
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

      const results = await Promise.allSettled(
        uniqueNames.map(async (name) => {
          try {
            const encoded = encodeURIComponent(name.replace(/ /g, "_"));
            const wikiRes = await fetch(`https://en.wikipedia.org/api/rest_v1/page/summary/${encoded}`, {
              headers: { "User-Agent": "ClownBinge/1.0 (metricadiaresearch.com)" }
            });
            if (!wikiRes.ok) return { name, imageUrl: null, description: null, found: false };

            const data = await wikiRes.json() as any;
            if (data.type === "disambiguation" || !data.extract) {
              return { name, imageUrl: null, description: null, found: false };
            }

            const rawExtract: string = data.extract || "";
            const sentences = rawExtract.match(/[^.!?]+[.!?]+(?:\s|$)/g) || [];
            const bio = sentences.slice(0, 3).join("").trim() || rawExtract.slice(0, 260).trim();

            return {
              name: data.title || name,
              imageUrl: data.thumbnail?.source || null,
              description: bio || null,
              wikiUrl: data.content_urls?.desktop?.page || null,
              found: !!(data.thumbnail?.source),
            };
          } catch {
            return { name, imageUrl: null, description: null, found: false };
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

  console.log("[Metricadia] Editor routes registered ✓");
}
