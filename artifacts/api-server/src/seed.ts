import { db, postsTable } from "@workspace/db";
import { sql } from "drizzle-orm";
import seedData from "./posts-seed.json";

export async function seedIfEmpty(): Promise<void> {
  try {
    const result = await db.execute(sql`SELECT COUNT(*)::int as count FROM posts`);
    const count = (result.rows[0] as { count: number }).count;

    if (count > 0) {
      console.log(`[Seed] Database has ${count} posts. Skipping seed.`);
      return;
    }

    const posts = seedData as Record<string, unknown>[];
    console.log(`[Seed] Database is empty. Inserting ${posts.length} posts...`);

    for (const post of posts) {
      await db.insert(postsTable).values({
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
        locked: (post.locked as boolean) ?? true,
        aiScore: post.ai_score as number | null,
        aiScoreTestedAt: post.ai_score_tested_at ? new Date(post.ai_score_tested_at as string) : null,
      }).onConflictDoNothing();
    }

    console.log(`[Seed] Done. ${posts.length} posts inserted.`);
  } catch (err) {
    console.error("[Seed] Error during seed:", err);
  }
}
