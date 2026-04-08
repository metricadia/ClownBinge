import { db, postsTable } from "@workspace/db";
import { eq, inArray, sql } from "drizzle-orm";
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

// ─── Safe delete: only removes articles that came from the seed file ──────────
// Admin-created articles (e.g. FP-001, FP-002) are NOT in the seed and will
// NOT be deleted. Only articles whose case_number appears in the seed are removed.

async function deleteSeedArticles(): Promise<void> {
  const seedCaseNumbers = (seedData as Record<string, unknown>[]).map(
    (p) => p.case_number as string
  );
  // Delete in chunks to avoid hitting postgres parameter limits
  const chunkSize = 100;
  let deleted = 0;
  for (let i = 0; i < seedCaseNumbers.length; i += chunkSize) {
    const chunk = seedCaseNumbers.slice(i, i + chunkSize);
    const result = await db.execute(
      sql`DELETE FROM posts WHERE case_number = ANY(${chunk}::text[])`
    );
    deleted += (result as unknown as { rowCount?: number })?.rowCount ?? 0;
  }
  console.log(`[Seed] Deleted ${deleted} old seed articles (admin-created articles preserved).`);
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
        `Removing old seed articles and reseeding from scratch (admin-created articles preserved)...`
      );
      await deleteSeedArticles();
    } else if (forceReseed && count > 0) {
      console.log(
        `[Seed] FORCE_POSTS_RESEED=1 detected. ` +
        `Removing old seed articles and reseeding from scratch (admin-created articles preserved)...`
      );
      await deleteSeedArticles();
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
      // Exclude articles that have been detected (ai_score IS NOT NULL) or locked —
      // those bodies are owned by the reducer and must never be overwritten by the seed.
      sql`SELECT case_number, LENGTH(body) as body_len FROM posts
          WHERE category = 'native_and_first_nations'
            AND ai_score IS NULL
            AND locked = false`
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

// ─── Sync improved article content from seed to DB ───────────────────────────
// When an article's body or citations are improved in the editor and re-exported
// to the seed, this function pushes those improvements to the DB on startup.
// Only articles explicitly listed here are touched. Never overwrites locked articles.

const IMPROVED_ARTICLES: string[] = [
  "CB-000384",
];

export async function syncImprovedArticles(): Promise<void> {
  try {
    const seedMap = new Map(
      (seedData as Record<string, unknown>[])
        .filter((p) => IMPROVED_ARTICLES.includes(p.case_number as string))
        .map((p) => [p.case_number as string, p])
    );

    const existing = await db
      .select({
        caseNumber: postsTable.caseNumber,
        bodyLen: sql<number>`LENGTH(body)`,
        hasCorruptedLinks: sql<boolean>`body LIKE '%&lt;a href%'`,
      })
      .from(postsTable)
      .where(
        inArray(postsTable.caseNumber, IMPROVED_ARTICLES)
      );

    let updated = 0;
    for (const row of existing as { caseNumber: string; bodyLen: number; hasCorruptedLinks: boolean }[]) {
      const seed = seedMap.get(row.caseNumber);
      if (!seed) continue;
      const seedBodyLen = (seed.body as string).length;
      const needsLengthSync = seedBodyLen > row.bodyLen + 200;
      const needsCorruptionFix = row.hasCorruptedLinks;
      if (needsLengthSync || needsCorruptionFix) {
        const reason = needsCorruptionFix ? "corrupted links detected" : `${row.bodyLen} -> ${seedBodyLen} chars`;
        await db
          .update(postsTable)
          .set({
            body: seed.body as string,
            verifiedSource: (seed.verified_source as string | null) ?? null,
            teaser: (seed.teaser as string) ?? undefined,
          })
          .where(eq(postsTable.caseNumber, row.caseNumber));
        updated++;
        console.log(`[Seed] Synced improved article ${row.caseNumber} (${reason})`);
      }
    }

    if (updated === 0) {
      console.log(`[Seed] No improved articles needed syncing.`);
    } else {
      console.log(`[Seed] Synced ${updated} improved article(s).`);
    }
  } catch (err) {
    console.error("[Seed] Error during syncImprovedArticles:", err);
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

// ─── Ensure premium-flagged articles are marked in the DB ────────────────────
// SAFE BY DESIGN: only sets premiumOnly = true for known slugs. Never clears
// the flag from any article — admin can still toggle articles individually.

const PREMIUM_SLUGS: string[] = [
  "social-media-disinformation-platforms-facebook-x-youtube-tiktok-receipts",
  "meta-anti-palestine-investigation-documents-bsr-hrw-drop-site",
  "monks-kept-western-civilization-books-faith-custodian-knowledge",
  "no-black-americans-violent-crime-racist-narrative-2024",
  "eddie-long-new-birth-missionary-baptist-same-sex-marriage-lawsuits-2010",
  "bob-corker-tax-cuts-jobs-act-deficit-vote-flip",
  "judaism-zionism-distinction-documented-record-2026",
  "brian-carn-false-prophecy-irs-guilty-plea-sexual-misconduct",
  "the-strongest-thing-research-love-healing-long-life",
  "cnn-vanishing-act-wbd-debt-eeoc-audit",
  "second-amendment-racial-disparity-philando-castile",
  "give-me-your-tired-us-foreign-policy-immigration-global-south",
  "dei-label-clinical-cost-documented-inventory",
  "dei-ruse-obama-trump-appointee-qualifications",
  "white-women-primary-beneficiaries-affirmative-action-federal-record",
  "america-resource-wars-iraq-iran-libya-petrodollar-race",
  "white-dei-wdei-discrimination-exclusion-ignorance-republican-merit",
  "gaza-riviera-trump-kushner-beachfront-real-estate-plan",
  "COINTELPRO-fred-hampton-FBI-assassination-Black-Panther-1969",
  "sundown-towns-racial-exclusion-redlining-wealth-gap-American-history",
  "indian-adoption-project-Native-children-removal-CWLA-BIA-history",
  "American-eugenics-Nazi-Germany-forced-sterilization-Buck-v-Bell",
  "disclose-act-blocked-501c4-dark-money-irs-architecture-senate-roll-call",
  "billionaire-donor-concentration-fec-2024-cycle-300-families-19-percent",
  "fairshake-crypto-super-pac-221-million-coinbase-ripple-fec-regulatory-exposure",
  "haiti-indemnity-france-21-billion-reparations-slave-owners-documented",
  "cia-declassified-latin-america-coups-seven-governments-1953-1989",
  "wto-trips-pharmaceutical-patents-generic-drugs-hiv-aids-msf-developing-nations",
  "britain-extracted-45-trillion-india-colonial-trade-records-patnaik-calculation",
  "civil-asset-forfeiture-states-no-conviction-required-documented-record",
  "philo-of-alexandria-logos-gospel-john-nicene-creed-definition",
  "european-renaissance-islamic-scholarship-primary-source-record",
];

export async function applyPremiumFlags(): Promise<void> {
  try {
    const result = await db
      .update(postsTable)
      .set({ premiumOnly: true })
      .where(inArray(postsTable.slug, PREMIUM_SLUGS));
    const count = (result as unknown as { rowCount?: number })?.rowCount ?? 0;
    console.log(`[Seed] Premium flags applied: ${count} articles marked premiumOnly.`);
  } catch (err) {
    console.error("[Seed] Error during applyPremiumFlags:", err);
  }
}

const STAFF_PICK_SLUGS: string[] = [
  "American-eugenics-Nazi-Germany-forced-sterilization-Buck-v-Bell",
  "COINTELPRO-fred-hampton-FBI-assassination-Black-Panther-1969",
  "Freedmens-Bureau-reconstruction-1865-records-national-archives-Black-history",
  "afroman-sued-harassers-into-museum-exhibit",
  "ai-data-center-cooling-cost-water-electricity-hyperscale-bill",
  "black-native-mexican-history-is-us-history",
  "bonus-army-1932-MacArthur-veterans-hoover-Anacostia",
  "bracero-program-stolen-wages-mexico-farmworkers-labor-history",
  "britain-extracted-45-trillion-india-colonial-trade-records-patnaik-calculation",
  "cash-bail-reform-states-recidivism-data-documented-record",
  "civil-asset-forfeiture-states-no-conviction-required-documented-record",
  "dawes-act-1887-90-million-acres-2025-cost",
  "faith-communities-built-abolition-religion-anti-slavery",
  "generative-ai-copyright-lawsuits-settlements-authors-guild-openai-2024",
  "great-dismal-swamp-maroon-nation-freedom-slavery-archaeology",
  "gut-brain-axis-second-brain-microbiome-serotonin-mental-health",
  "haiti-indemnity-france-21-billion-reparations-slave-owners-documented",
  "india-upi-unified-payments-interface-131-billion-transactions-2023",
  "irs-free-file-intuit-turbotax-lobbying-direct-file-2024",
  "loneliness-lethal-smoking-15-cigarettes-social-connection-science",
  "manila-men-Louisiana-Filipino-first-Asian-Americans-St-Malo-1763",
  "national-registry-exonerations-wrongful-conviction-race-data-documented",
  "patricia-holden-diversity-book-ban-daughter-dei-university",
  "prosperity-gospel-bible-wealth-new-testament",
  "quantum-computing-break-encryption-nist-post-quantum-standards",
  "rick-donahue-texas-ag-suing-companies-own-law-firm-did",
  "science-of-grief-mourning-prolonged-grief-resilience-brain",
  "semiconductor-supply-chain-single-points-failure-sia-bcg-analysis",
  "sit-with-grandma-grandpa-intergenerational-wisdom-healing-elders",
  "smart-tv-surveillance-data-collection-ftc-acr-privacy-samsung-lg",
  "strength-differences-men-women-research",
  "submarine-cables-internet-infrastructure-1-3-million-miles-four-companies",
  "sundown-towns-racial-exclusion-redlining-wealth-gap-American-history",
  "tommy-tuberville-broadband-infrastructure-vote-biden-mockery",
  "trickledown-economic-religion-jim-jones-republican-democratic-economic-record",
  "tsmc-taiwan-advanced-chips-92-percent-geopolitical-risk-pentagon",
  "women-build-too-50-business-women-changed-world",
];

export async function applyStaffPickFlags(): Promise<void> {
  try {
    const result = await db
      .update(postsTable)
      .set({ staffPick: true })
      .where(inArray(postsTable.slug, STAFF_PICK_SLUGS));
    const count = (result as unknown as { rowCount?: number })?.rowCount ?? 0;
    console.log(`[Seed] Staff pick flags applied: ${count} articles marked staffPick.`);
  } catch (err) {
    console.error("[Seed] Error during applyStaffPickFlags:", err);
  }
}
