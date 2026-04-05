import { Express, Request, Response, NextFunction } from "express";
import multer from "multer";
import crypto from "crypto";
import path from "path";
import fs from "fs";
import { db, postsTable } from "@workspace/db";
import { eq, desc } from "drizzle-orm";

const ADMIN_PASSWORD_HASH = hashPassword("KoGAlpha#7");
const TOKEN_SECRET = process.env.METRICADIA_TOKEN_SECRET || "metricadia-token-secret-change-me";

function hashPassword(plain: string): string {
  return crypto.createHash("sha256").update(plain + TOKEN_SECRET).digest("hex");
}

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

    const hash = hashPassword(password);
    const expectedHash = process.env.METRICADIA_ADMIN_HASH || ADMIN_PASSWORD_HASH;

    if (hash !== expectedHash) {
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
