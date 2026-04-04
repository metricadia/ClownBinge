import { db, postsTable } from "@workspace/db";
import { eq, sql } from "drizzle-orm";
import seedData from "./posts-seed.json";

const SEED_EXPECTED_COUNT = (seedData as Record<string, unknown>[]).length;

// Fingerprint: CB-000001's slug identifies the current seed version.
// If production has a different slug here, the DB has old data and must be wiped.
const SEED_ANCHOR_CASE = "CB-000001";
const SEED_ANCHOR_SLUG = (seedData as Record<string, unknown>[])[0]?.slug as string;

function buildValues(post: Record<string, unknown>) {
  return {
    caseNumber: post.case_number as string,
    title: post.title as string,
    slug: post.slug as string,
    teaser: (post.teaser as string) ?? "",
    body: post.body as string,
    category: post.category as typeof postsTable.$inferInsert["category"],
    subjectName: post.subject_name as string | null,
    subjectTitle: post.subject_title as string | null,
    subjectParty: post.subject_party as string | null,
    verifiedSource: post.verified_source as string | null,
    sourceUrl: post.source_url as string | null,
    hasVideo: (post.has_video as boolean) ?? false,
    videoUrl: post.video_url as string | null,
    videoThumbnail: post.video_thumbnail as string | null,
    transcript: post.transcript as string | null,
    selfOwnScore: post.self_own_score as number | null,
    tags: (post.tags as string[]) ?? [],
    schemaMarkup: post.schema_markup as Record<string, unknown> | null,
    status: (post.status as typeof postsTable.$inferInsert["status"]) ?? "published",
    dateOfIncident: post.date_of_incident as string | null,
    publishedAt: post.published_at ? new Date(post.published_at as string) : new Date(),
    viewCount: (post.view_count as number) ?? 0,
    shareCount: (post.share_count as number) ?? 0,
    userSubmitted: (post.user_submitted as boolean) ?? false,
    pinned: (post.pinned as boolean) ?? false,
    locked: (post.locked as boolean) ?? false,
    aiScore: post.ai_score as number | null,
    aiScoreTestedAt: post.ai_score_tested_at ? new Date(post.ai_score_tested_at as string) : null,
    seoMetaTitle: post.seo_meta_title as string | null,
  };
}

async function insertAllPosts(): Promise<{ inserted: number; failed: number }> {
  const posts = seedData as Record<string, unknown>[];
  let inserted = 0;
  let failed = 0;
  for (const post of posts) {
    try {
      // onConflictDoNothing() with no target = ON CONFLICT DO NOTHING,
      // which silently skips on ANY unique constraint violation (case_number OR slug).
      await db.insert(postsTable).values(buildValues(post)).onConflictDoNothing();
      inserted++;
    } catch (err) {
      failed++;
      const cause = (err as { cause?: { message?: string; code?: string; detail?: string } })?.cause;
      const msg = cause
        ? `code=${cause.code} msg=${cause.message} detail=${cause.detail}`
        : String(err).slice(0, 300);
      console.error(`[Seed] INSERT FAIL ${post.case_number as string}: ${msg}`);
    }
  }
  return { inserted, failed };
}

async function verifyIntegrity(): Promise<void> {
  const result = await db.execute(sql`SELECT COUNT(*)::int as count FROM posts`);
  const count = (result.rows[0] as { count: number }).count;
  if (count === SEED_EXPECTED_COUNT) {
    console.log(`[Seed] INTEGRITY OK — ${count}/${SEED_EXPECTED_COUNT} articles in production.`);
  } else {
    console.error(
      `[Seed] INTEGRITY FAIL — expected ${SEED_EXPECTED_COUNT} articles, found ${count}. ` +
      `Check logs above for INSERT FAIL entries.`
    );
  }
}

// ─── Main entry point ────────────────────────────────────────────────────────

export async function seedIfEmpty(): Promise<void> {
  try {
    const forceReseed = process.env["FORCE_POSTS_RESEED"] === "1";

    const countResult = await db.execute(sql`SELECT COUNT(*)::int as count FROM posts`);
    const count = (countResult.rows[0] as { count: number }).count;

    if (count > 0 && !forceReseed) {
      // Check if the anchor article's slug matches the current seed.
      // A mismatch means the DB was seeded from an old/different seed file.
      const anchorResult = await db.execute(
        sql`SELECT slug FROM posts WHERE case_number = ${SEED_ANCHOR_CASE} LIMIT 1`
      );
      const actualSlug = (anchorResult.rows[0] as { slug: string } | undefined)?.slug;

      if (actualSlug === SEED_ANCHOR_SLUG) {
        console.log(`[Seed] Database has ${count} posts with current seed. Skipping full seed.`);
        await verifyIntegrity();
        return;
      }

      console.log(
        `[Seed] Stale seed detected. ` +
        `Expected anchor slug: "${SEED_ANCHOR_SLUG}", found: "${actualSlug ?? "missing"}". ` +
        `Truncating ${count} old articles and reseeding from scratch...`
      );
      await db.execute(sql`TRUNCATE TABLE posts CASCADE`);
    } else if (forceReseed && count > 0) {
      console.log(
        `[Seed] FORCE_POSTS_RESEED=1 detected. ` +
        `Truncating ${count} existing articles and reseeding from scratch...`
      );
      await db.execute(sql`TRUNCATE TABLE posts CASCADE`);
    }

    const posts = seedData as Record<string, unknown>[];
    console.log(`[Seed] Inserting ${posts.length} posts...`);
    const { inserted, failed } = await insertAllPosts();
    console.log(`[Seed] Done. ${inserted} inserted, ${failed} failed.`);
    await verifyIntegrity();
  } catch (err) {
    console.error("[Seed] CRITICAL ERROR during seedIfEmpty:", err);
  }
}

// ─── Update native articles that are under 1500 words in the DB ──────────────
// SAFE: only updates body for native_and_first_nations articles where the
// production body is shorter than the seed body. Never touches other categories.

export async function updateNativeArticles(): Promise<void> {
  try {
    const nativeSeedPosts = (seedData as Record<string, unknown>[]).filter(
      (p) => p.category === "native_and_first_nations"
    );
    const seedBodyMap = new Map(
      nativeSeedPosts.map((p) => [p.case_number as string, p.body as string])
    );

    const existing = await db.execute(
      sql`SELECT case_number, LENGTH(body) as body_len FROM posts WHERE category = 'native_and_first_nations'`
    );

    let updated = 0;
    for (const row of existing.rows as { case_number: string; body_len: number }[]) {
      const seedBody = seedBodyMap.get(row.case_number);
      if (!seedBody) continue;
      const seedBodyLen = seedBody.length;
      if (seedBodyLen > row.body_len + 500) {
        await db
          .update(postsTable)
          .set({ body: seedBody })
          .where(eq(postsTable.caseNumber, row.case_number));
        updated++;
        console.log(`[Seed] Updated body for ${row.case_number} (${row.body_len} -> ${seedBodyLen} chars)`);
      }
    }

    if (updated === 0) {
      console.log(`[Seed] All native articles already have full-length bodies.`);
    } else {
      console.log(`[Seed] Updated ${updated} native article bodies.`);
    }
  } catch (err) {
    console.error("[Seed] Error during updateNativeArticles:", err);
  }
}

// ─── Insert any articles added to the seed since last deploy ─────────────────
// SAFE BY DESIGN: this function ONLY inserts. It NEVER updates any existing
// article — not its category, title, slug, body, or any other field.
// Existing articles are owned by the database after first insert.

export async function insertNewArticles(): Promise<void> {
  try {
    const existing = await db.execute(sql`SELECT case_number FROM posts`);
    const existingCases = new Set(
      (existing.rows as { case_number: string }[]).map((r) => r.case_number)
    );

    const posts = seedData as Record<string, unknown>[];
    const newPosts = posts.filter((p) => !existingCases.has(p.case_number as string));

    if (newPosts.length === 0) {
      console.log(`[Seed] No new articles to insert.`);
      return;
    }

    console.log(`[Seed] Found ${newPosts.length} new articles not yet in DB. Inserting...`);
    let inserted = 0;
    let failed = 0;
    for (const post of newPosts) {
      try {
        await db.insert(postsTable).values(buildValues(post)).onConflictDoNothing();
        inserted++;
        console.log(`[Seed] Inserted new article: ${post.case_number as string}`);
      } catch (err) {
        failed++;
        const cause = (err as { cause?: { message?: string; code?: string; detail?: string } })?.cause;
        const msg = cause
          ? `code=${cause.code} msg=${cause.message} detail=${cause.detail}`
          : String(err).slice(0, 300);
        console.error(`[Seed] INSERT FAIL ${post.case_number as string}: ${msg}`);
      }
    }
    console.log(`[Seed] New articles: ${inserted} inserted, ${failed} failed.`);
  } catch (err) {
    console.error("[Seed] Error during insertNewArticles:", err);
  }
}
