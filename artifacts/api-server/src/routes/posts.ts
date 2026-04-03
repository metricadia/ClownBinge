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
    // Count only CB-prefixed journalism articles (excludes CBR founding/record docs)
    // so the widget numerator aligns with the highest CB case number in the archive.
    const result = await db
      .select({ count: count() })
      .from(postsTable)
      .where(
        and(
          eq(postsTable.status, "published"),
          sql`${postsTable.caseNumber} LIKE 'CB-%'`
        )
      );
    res.setHeader("Cache-Control", "no-store, no-cache, must-revalidate");
    res.setHeader("Pragma", "no-cache");
    res.json({ count: Number(result[0]?.count ?? 0) });
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch count" });
  }
});

router.get("/posts/stats", async (_req, res) => {
  try {
    const [articlesResult, citationsResult] = await Promise.all([
      db.select({ count: count() }).from(postsTable).where(
        and(
          eq(postsTable.status, "published"),
          sql`${postsTable.caseNumber} LIKE 'CB-%'`
        )
      ),
      db.execute(
        sql`SELECT (
          COALESCE(SUM(array_length(string_to_array(verified_source, ';'), 1)), 0)
          +
          COALESCE(SUM((length(body) - length(replace(body, 'cb-factoid', ''))) / 10), 0)
        )::int AS total_citations
        FROM posts
        WHERE status = 'published' AND case_number LIKE 'CB-%'`
      ),
    ]);

    res.setHeader("Cache-Control", "no-store, no-cache, must-revalidate");
    res.setHeader("Pragma", "no-cache");
    res.json({
      totalArticles: Number(articlesResult[0]?.count ?? 0),
      totalCitations: Number((citationsResult.rows[0] as any)?.total_citations ?? 0),
      retractionsIssued: 0,
      darkMoneyAccepted: 0,
    });
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch stats" });
  }
});

router.get("/posts", async (req, res) => {
  try {
    const query = ListPostsQueryParams.safeParse(req.query);
    if (!query.success) {
      res.status(400).json({ error: "Invalid query parameters" });
      return;
    }

    const { category, tag, staffPick, limit = 20, offset = 0 } = query.data;

    const conditions = [eq(postsTable.status, "published")];
    if (staffPick === true) {
      // Staff picks: all categories allowed (incl. religion), filter by flag
      conditions.push(eq(postsTable.staffPick, true));
    } else if (tag) {
      // Tag archive: show all matching posts, no category suppression
      conditions.push(sql`${postsTable.tags} @> ARRAY[${tag}]::text[]`);
    } else if (category) {
      conditions.push(eq(postsTable.category, category as any));
    } else {
      // Main feed: religion excluded entirely (religion tab only)
      conditions.push(sql`${postsTable.category} != 'religion'`);
      // Main feed: floor-cleanup sprint categories are tab-only until front-page redesign is complete
      // (global_south, censorship, women_and_girls, war_and_inhumanity, anti_racist_heroes, technology)
      conditions.push(sql`${postsTable.category} NOT IN ('global_south','censorship','women_and_girls','war_and_inhumanity','anti_racist_heroes','technology')`);
      // Main feed: nerd_out articles only appear if nerd_accessible = true
      conditions.push(sql`(${postsTable.category} != 'nerd_out' OR ${postsTable.nerdAccessible} = true)`);
      // Main feed: self_owned articles only appear if staff_pick = true (WOW + INSIGHTFUL + share-worthy)
      conditions.push(sql`(${postsTable.category} != 'self_owned' OR ${postsTable.staffPick} = true)`);
    }

    const where = conditions.length === 1 ? conditions[0] : and(...conditions);

    const [posts, totalResult] = await Promise.all([
      db
        .select()
        .from(postsTable)
        .where(where)
        .orderBy(
          // Category and tag feeds: newest first, no curation weighting
          // Main feed: 5-tier editorial order designed for maximum utility
          //   Tier -4: pinned (always top)
          //   Tier -3: self_owned, investigations (hooks — "can you believe this")
          //   Tier -2: money_and_power, war_and_inhumanity, disarming_hate (controversy + emotional weight)
          //   Tier -1: us_history, women_and_girls, us_constitution, law_and_justice,
          //            anti_racist_heroes, global_south, censorship, health_and_healing
          //            (WOW + love/healing mixed — interleaves naturally by publish date)
          //   Tier  0: nerd_out, how_it_works, technology (deep readers)
          ...(category || tag
            ? [desc(postsTable.publishedAt)]
            : [
                sql`CASE
                  WHEN ${postsTable.pinned} = true THEN -4
                  WHEN ${postsTable.category} IN ('self_owned','investigations') THEN -3
                  WHEN ${postsTable.category} IN ('money_and_power','war_and_inhumanity','disarming_hate') THEN -2
                  WHEN ${postsTable.category} IN ('us_history','women_and_girls','us_constitution','law_and_justice','anti_racist_heroes','global_south','censorship','health_and_healing') THEN -1
                  ELSE 0
                END`,
                desc(postsTable.publishedAt),
              ]
          )
        )
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
      sourceUrl: p.sourceUrl,
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
      userSubmitted: p.userSubmitted,
      pinned: p.pinned,
      locked: p.locked,
      staffPick: p.staffPick,
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
    res.setHeader("Cache-Control", "no-store, no-cache, must-revalidate");
    res.setHeader("Pragma", "no-cache");
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
      sourceUrl: p.sourceUrl,
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
      userSubmitted: p.userSubmitted,
      pinned: p.pinned,
      locked: p.locked,
      staffPick: p.staffPick,
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
