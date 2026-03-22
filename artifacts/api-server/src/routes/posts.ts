import { Router, type IRouter } from "express";
import { db, postsTable, reactionsTable } from "@workspace/db";
import { eq, desc, and, sql, count } from "drizzle-orm";
import {
  ListPostsQueryParams,
  GetPostParams,
  IncrementViewParams,
} from "@workspace/api-zod";
import crypto from "crypto";

const router: IRouter = Router();

router.get("/posts/count", async (_req, res) => {
  try {
    const result = await db
      .select({ count: count() })
      .from(postsTable)
      .where(eq(postsTable.status, "published"));
    res.json({ count: Number(result[0]?.count ?? 0) });
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch count" });
  }
});

router.get("/posts", async (req, res) => {
  try {
    const query = ListPostsQueryParams.safeParse(req.query);
    if (!query.success) {
      res.status(400).json({ error: "Invalid query parameters" });
      return;
    }

    const { category, limit = 20, offset = 0 } = query.data;

    const conditions = [eq(postsTable.status, "published")];
    if (category) {
      conditions.push(eq(postsTable.category, category as any));
    }

    const where = conditions.length === 1 ? conditions[0] : and(...conditions);

    const [posts, totalResult] = await Promise.all([
      db
        .select()
        .from(postsTable)
        .where(where)
        .orderBy(desc(postsTable.publishedAt))
        .limit(Number(limit))
        .offset(Number(offset)),
      db.select({ count: count() }).from(postsTable).where(where),
    ]);

    const mapped = posts.map((p) => ({
      id: p.id,
      caseNumber: p.caseNumber,
      title: p.title,
      slug: p.slug,
      teaser: p.teaser,
      body: p.body,
      category: p.category,
      subjectName: p.subjectName,
      subjectTitle: p.subjectTitle,
      subjectParty: p.subjectParty,
      verifiedSource: p.verifiedSource,
      hasVideo: p.hasVideo,
      videoUrl: p.videoUrl,
      videoThumbnail: p.videoThumbnail,
      selfOwnScore: p.selfOwnScore,
      tags: p.tags,
      status: p.status,
      dateOfIncident: p.dateOfIncident,
      publishedAt: p.publishedAt?.toISOString() ?? null,
      createdAt: p.createdAt.toISOString(),
      viewCount: p.viewCount,
      shareCount: p.shareCount,
    }));

    res.json({
      posts: mapped,
      total: Number(totalResult[0]?.count ?? 0),
      limit: Number(limit),
      offset: Number(offset),
    });
  } catch (err) {
    req.log.error({ err }, "Error listing posts");
    res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/posts/:slug", async (req, res) => {
  try {
    const params = GetPostParams.safeParse(req.params);
    if (!params.success) {
      res.status(400).json({ error: "Invalid parameters" });
      return;
    }

    const post = await db
      .select()
      .from(postsTable)
      .where(
        and(
          eq(postsTable.slug, params.data.slug),
          eq(postsTable.status, "published")
        )
      )
      .limit(1);

    if (!post[0]) {
      res.status(404).json({ error: "Post not found" });
      return;
    }

    const p = post[0];
    res.json({
      id: p.id,
      caseNumber: p.caseNumber,
      title: p.title,
      slug: p.slug,
      teaser: p.teaser,
      body: p.body,
      category: p.category,
      subjectName: p.subjectName,
      subjectTitle: p.subjectTitle,
      subjectParty: p.subjectParty,
      verifiedSource: p.verifiedSource,
      hasVideo: p.hasVideo,
      videoUrl: p.videoUrl,
      videoThumbnail: p.videoThumbnail,
      selfOwnScore: p.selfOwnScore,
      tags: p.tags,
      status: p.status,
      dateOfIncident: p.dateOfIncident,
      publishedAt: p.publishedAt?.toISOString() ?? null,
      createdAt: p.createdAt.toISOString(),
      viewCount: p.viewCount,
      shareCount: p.shareCount,
    });
  } catch (err) {
    req.log.error({ err }, "Error fetching post");
    res.status(500).json({ error: "Internal server error" });
  }
});

router.post("/posts/:slug/view", async (req, res) => {
  try {
    const params = IncrementViewParams.safeParse(req.params);
    if (!params.success) {
      res.status(400).json({ error: "Invalid parameters" });
      return;
    }

    await db
      .update(postsTable)
      .set({ viewCount: sql`${postsTable.viewCount} + 1` })
      .where(eq(postsTable.slug, params.data.slug));

    res.json({ success: true });
  } catch (err) {
    req.log.error({ err }, "Error incrementing view");
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
