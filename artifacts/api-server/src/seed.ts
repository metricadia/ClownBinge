import { db, postsTable } from "@workspace/db";
import { sql } from "drizzle-orm";
import seedData from "./posts-seed.json";

// The slug of the first article in the seed — used to detect stale/old data in production
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

export async function upsertMissingPosts(): Promise<void> {
  const posts = seedData as Record<string, unknown>[];
  let inserted = 0;
  let updated = 0;
  let failed = 0;

  for (const post of posts) {
    try {
      const values = buildValues(post);
      await db.insert(postsTable).values(values).onConflictDoUpdate({
        target: postsTable.caseNumber,
        set: {
          // ── Slug is intentionally excluded — it is the URL and must never change ──
          // ── Title and teaser are excluded — DB is source of truth after first insert ──
          category: values.category,
          subjectName: values.subjectName,
          subjectTitle: values.subjectTitle,
          subjectParty: values.subjectParty,
          verifiedSource: values.verifiedSource,
          sourceUrl: values.sourceUrl,
          hasVideo: values.hasVideo,
          videoUrl: values.videoUrl,
          videoThumbnail: values.videoThumbnail,
          transcript: values.transcript,
          selfOwnScore: values.selfOwnScore,
          tags: values.tags,
          schemaMarkup: values.schemaMarkup,
          status: values.status,
          dateOfIncident: values.dateOfIncident,
          publishedAt: values.publishedAt,
          userSubmitted: values.userSubmitted,
          pinned: values.pinned,
          locked: values.locked,
          seoMetaTitle: values.seoMetaTitle,
          // ── NEVER overwrite on restart ──────────────────────────────────────────
          // body:             CBReduce rewrites the body; seed is only the starting point
          // aiScore:          CBReduce owns this after first reduction
          // aiScoreTestedAt:  CBReduce owns this timestamp
          // viewCount:        live engagement data — never reset from seed
          // shareCount:       live engagement data — never reset from seed
        },
      });
      // No way to distinguish insert vs update from drizzle here without an extra query,
      // so we count them all as synced
      updated++;
    } catch (err) {
      failed++;
      const cause = (err as { cause?: { message?: string; code?: string; detail?: string } })?.cause;
      const msg = cause
        ? `code=${cause.code} msg=${cause.message} detail=${cause.detail}`
        : String(err).slice(0, 300);
      console.error(`[Seed] UPSERT FAIL ${post.case_number as string}: ${msg}`);
    }
  }

  console.log(`[Seed] upsertMissingPosts complete: ${updated} synced, ${failed} failed.`);
}

export async function seedIfEmpty(): Promise<void> {
  try {
    const countResult = await db.execute(sql`SELECT COUNT(*)::int as count FROM posts`);
    const count = (countResult.rows[0] as { count: number }).count;

    if (count > 0) {
      // Stale-data check: if the anchor article exists but has the wrong slug,
      // the DB was seeded with old test data and must be replaced entirely.
      const anchorResult = await db.execute(
        sql`SELECT slug FROM posts WHERE case_number = ${SEED_ANCHOR_CASE} LIMIT 1`
      );
      const actualSlug = (anchorResult.rows[0] as { slug: string } | undefined)?.slug;

      if (actualSlug === SEED_ANCHOR_SLUG) {
        console.log(`[Seed] Database has ${count} posts with current seed. Skipping full seed.`);
        return;
      }

      console.log(
        `[Seed] Stale seed detected (anchor slug mismatch). ` +
        `Expected: "${SEED_ANCHOR_SLUG}", found: "${actualSlug ?? "missing"}". ` +
        `Truncating ${count} old articles and reseeding...`
      );
      await db.execute(sql`TRUNCATE TABLE posts CASCADE`);
    }

    const posts = seedData as Record<string, unknown>[];
    console.log(`[Seed] Inserting ${posts.length} posts...`);

    let inserted = 0;
    let failed = 0;
    for (const post of posts) {
      try {
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

    console.log(`[Seed] Done. ${inserted} inserted, ${failed} failed.`);
  } catch (err) {
    console.error("[Seed] Error during seedIfEmpty:", err);
  }
}
