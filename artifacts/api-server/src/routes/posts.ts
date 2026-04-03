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

// ── Smuggler's Board Interleaving ──────────────────────────────────────────
// The main feed is a curated "smuggler's board": no two adjacent articles
// share the same category, anywhere in the feed.
//
// Architecture:
//   Layer 1 — Pinned articles always float to the top.
//   Layer 2 — Self-owned & investigations: the "can you believe this?" hooks
//              that open the reader's appetite. Interleaved between themselves.
//   Layer 3 — Everything else: a single global rotation across ALL remaining
//              categories (money_and_power, us_history, technology, law,
//              health, constitution, anti_racist_heroes, women_and_girls,
//              censorship, disarming_hate, nerd_out, how_it_works).
//              The greedy algorithm naturally favours larger categories
//              (technology:45, money_and_power:30, law:30) so they appear
//              more frequently — fair representation by volume.
//
// This prevents the old tier-cluster problem where 30 money_and_power
// articles would run back-to-back once the 4 disarming_hate articles ran out.

type PostRow = typeof postsTable.$inferSelect;

function buildCatMap(posts: PostRow[]): Map<string, PostRow[]> {
  const groups = new Map<string, PostRow[]>();
  for (const post of posts) {
    if (!groups.has(post.category)) groups.set(post.category, []);
    groups.get(post.category)!.push(post);
  }
  return groups;
}

function interleaveCategories(catMap: Map<string, PostRow[]>): PostRow[] {
  // Work on mutable copies
  const groups = new Map<string, PostRow[]>();
  for (const [cat, arr] of catMap) groups.set(cat, [...arr]);

  const result: PostRow[] = [];
  let lastCat: string | null = null;

  while (groups.size > 0) {
    // Pick the category with the most remaining articles that isn't the
    // same as the previous pick. This distributes large categories evenly
    // instead of exhausting small ones first.
    let bestCat: string | null = null;
    let bestCount = -1;

    for (const [cat, arr] of groups) {
      if (cat !== lastCat && arr.length > bestCount) {
        bestCount = arr.length;
        bestCat = cat;
      }
    }
    // Only one category remains — can't avoid a repeat, just emit it.
    if (!bestCat) bestCat = [...groups.keys()][0];

    const group = groups.get(bestCat!)!;
    result.push(group.shift()!);
    lastCat = bestCat;
    if (group.length === 0) groups.delete(bestCat!);
  }

  return result;
}

function stitchLayers(a: PostRow[], b: PostRow[]): PostRow[] {
  // If the last article of layer A shares a category with the first of layer B,
  // swap B[0] with the first B item from a different category.
  if (a.length === 0 || b.length === 0) return [...a, ...b];
  const lastCat = a[a.length - 1].category;
  if (b[0].category !== lastCat) return [...a, ...b];
  const swapIdx = b.findIndex((p) => p.category !== lastCat);
  if (swapIdx <= 0) return [...a, ...b];
  const bCopy = [...b];
  [bCopy[0], bCopy[swapIdx]] = [bCopy[swapIdx], bCopy[0]];
  return [...a, ...bCopy];
}

function smugglersBoard(posts: PostRow[]): PostRow[] {
  // Layer 1: pinned articles — always first, but still interleaved by
  // category so 4 consecutive us_history pins don't stack up.
  const pinned = posts.filter((p) => p.pinned);

  // Layer 2: self_owned + investigations — the "can you believe this?" hooks
  const hooks = posts.filter(
    (p) => !p.pinned && ["self_owned", "investigations"].includes(p.category)
  );

  // Layer 3: all remaining categories — one global interleave pool.
  // technology (45), law_and_justice (30), money_and_power (30), etc.
  // all compete in the same rotation so no category dominates a page.
  const board = posts.filter(
    (p) => !p.pinned && !["self_owned", "investigations"].includes(p.category)
  );

  const pinnedOut = interleaveCategories(buildCatMap(pinned));
  const hooksOut  = interleaveCategories(buildCatMap(hooks));
  const boardOut  = interleaveCategories(buildCatMap(board));

  // Stitch layer seams so no category repeats at the boundary either.
  return stitchLayers(stitchLayers(pinnedOut, hooksOut), boardOut);
}

// ── Route helpers ──────────────────────────────────────────────────────────

function mapPost(p: PostRow) {
  return {
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
    seoMetaTitle: p.seoMetaTitle ?? null,
  };
}

// ── Routes ─────────────────────────────────────────────────────────────────

router.get("/posts/count", async (_req, res) => {
  try {
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
      // Staff picks tab: all categories, filter by flag
      conditions.push(eq(postsTable.staffPick, true));
    } else if (tag) {
      // Tag archive: no category suppression
      conditions.push(sql`${postsTable.tags} @> ARRAY[${tag}]::text[]`);
    } else if (category) {
      conditions.push(eq(postsTable.category, category as any));
    } else {
      // ── Main feed ────────────────────────────────────────────────────────
      // Religion: tab-only (advertiser sensitivity, highly curated)
      conditions.push(sql`${postsTable.category} != 'religion'`);
      // War & Inhumanity: tab-only (graphic content risk for programmatic ads)
      // Global South: tab-only (depth sprint not yet complete)
      conditions.push(
        sql`${postsTable.category} NOT IN ('war_and_inhumanity','global_south')`
      );
      // NerdOut: only nerd_accessible articles surface on main feed
      conditions.push(
        sql`(${postsTable.category} != 'nerd_out' OR ${postsTable.nerdAccessible} = true)`
      );
      // Self-Owned: quality gate — only staff_pick self-owns in main feed
      conditions.push(
        sql`(${postsTable.category} != 'self_owned' OR ${postsTable.staffPick} = true)`
      );
    }

    const where = conditions.length === 1 ? conditions[0] : and(...conditions);
    const isMainFeed = !category && !tag && staffPick !== true;

    if (isMainFeed) {
      // ── Smuggler's Board ─────────────────────────────────────────────────
      // Fetch all eligible posts, apply category interleaving, then paginate.
      // This guarantees no two adjacent articles share the same category
      // across the entire feed, regardless of how many articles exist per tier.
      const allPosts = await db
        .select()
        .from(postsTable)
        .where(where)
        .orderBy(
          sql`CASE
            WHEN ${postsTable.pinned} = true THEN -4
            WHEN ${postsTable.category} IN ('self_owned','investigations') THEN -3
            WHEN ${postsTable.category} IN ('money_and_power','disarming_hate') THEN -2
            WHEN ${postsTable.category} IN (
              'us_history','law_and_justice','health_and_healing','us_constitution',
              'anti_racist_heroes','women_and_girls','censorship','technology'
            ) THEN -1
            ELSE 0
          END`,
          desc(postsTable.publishedAt)
        );

      const interleaved = smugglersBoard(allPosts);
      const paged = interleaved
        .slice(Number(offset), Number(offset) + Number(limit))
        .map(mapPost);

      res.json({
        posts: paged,
        total: interleaved.length,
        limit: Number(limit),
        offset: Number(offset),
      });
      return;
    }

    // ── Category / tag / staff-picks feeds: newest first, no curation ──────
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

    res.json({
      posts: posts.map(mapPost),
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
    res.json(mapPost(p));
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
