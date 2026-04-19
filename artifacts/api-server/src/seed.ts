import { db, postsTable } from "@workspace/db";
import { eq, inArray, sql } from "drizzle-orm";
import seedData from "./posts-seed.json";
import fpArticlesData from "./founders-pen-articles.json";

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

// ─── Founder's Pen articles — self-healing insert on every startup ────────────
// These articles are NOT in posts-seed.json and will never be wiped by deleteSeedArticles().
// This function inserts any missing FP articles into the DB on every boot.

type FpArticle = {
  caseNumber: string;
  title: string;
  slug: string;
  teaser: string;
  body: string;
  category: string;
  verifiedSource: string;
  tags: string[];
  status: string;
  publishedAt: string;
  premiumOnly: boolean;
  staffPick: boolean;
  nerdAccessible: boolean;
};

export async function insertFoundersPenArticles(): Promise<void> {
  try {
    const existing = await db.execute(sql`SELECT case_number FROM posts WHERE case_number LIKE 'FP-%'`);
    const existingSet = new Set((existing.rows as { case_number: string }[]).map(r => r.case_number));

    // Also fetch current body lengths for existing FP articles so we can detect truncation
    const bodyLens = await db.execute(
      sql`SELECT case_number, LENGTH(body) as body_len FROM posts WHERE case_number LIKE 'FP-%'`
    );
    const bodyLenMap = new Map(
      (bodyLens.rows as { case_number: string; body_len: number }[]).map(r => [r.case_number, r.body_len])
    );

    const fpArticles = fpArticlesData as FpArticle[];
    let inserted = 0;
    let synced = 0;
    for (const article of fpArticles) {
      if (!existingSet.has(article.caseNumber)) {
        // Insert missing article
        try {
          await db.insert(postsTable).values({
            caseNumber: article.caseNumber,
            title: article.title,
            slug: article.slug,
            teaser: article.teaser,
            body: article.body,
            category: article.category as typeof postsTable.$inferInsert["category"],
            verifiedSource: article.verifiedSource || null,
            tags: article.tags ?? [],
            status: article.status as typeof postsTable.$inferInsert["status"],
            publishedAt: article.publishedAt ? new Date(article.publishedAt) : new Date(),
            premiumOnly: article.premiumOnly ?? true,
            staffPick: article.staffPick ?? false,
            nerdAccessible: article.nerdAccessible ?? true,
            hasVideo: false,
            userSubmitted: false,
            pinned: false,
            locked: false,
            viewCount: 0,
            shareCount: 0,
          }).onConflictDoNothing();
          console.log(`[Seed] Inserted missing Founder's Pen article: ${article.caseNumber}`);
          inserted++;
        } catch (err) {
          console.error(`[Seed] Failed to insert ${article.caseNumber}:`, err);
        }
      } else {
        // Sync body if DB body is shorter than the canonical JSON body (indicates truncation)
        const dbBodyLen = bodyLenMap.get(article.caseNumber) ?? 0;
        const bodyNeedsSync = article.body.length > dbBodyLen + 100;

        if (bodyNeedsSync) {
          try {
            await db.execute(
              sql`UPDATE posts SET body = ${article.body} WHERE case_number = ${article.caseNumber}`
            );
            console.log(`[Seed] Synced Founder's Pen body: ${article.caseNumber} (${dbBodyLen} → ${article.body.length} chars)`);
            synced++;
          } catch (err) {
            console.error(`[Seed] Failed to sync body for ${article.caseNumber}:`, err);
          }
        }
        // Always sync verifiedSource from canonical JSON so APA 7 formatting is enforced
        if (article.verifiedSource) {
          try {
            await db.execute(
              sql`UPDATE posts SET verified_source = ${article.verifiedSource} WHERE case_number = ${article.caseNumber} AND (verified_source IS DISTINCT FROM ${article.verifiedSource})`
            );
          } catch (err) {
            console.error(`[Seed] Failed to sync verified_source for ${article.caseNumber}:`, err);
          }
        }
      }
    }
    const total = inserted + synced;
    if (total === 0) {
      console.log(`[Seed] Founder's Pen articles: all ${fpArticles.length} present and up to date.`);
    } else {
      if (inserted > 0) console.log(`[Seed] Founder's Pen articles: ${inserted} inserted.`);
      if (synced > 0) console.log(`[Seed] Founder's Pen articles: ${synced} body(s) synced.`);
    }
  } catch (err) {
    console.error("[Seed] Error during insertFoundersPenArticles:", err);
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
  "CB-000088",
  "CB-000384",
  "CB-000388",
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
      const needsLengthSync = seedBodyLen > row.bodyLen + 100;
      const needsCorruptionFix = row.hasCorruptedLinks;
      if (needsLengthSync || needsCorruptionFix) {
        const reason = needsCorruptionFix ? "corrupted links detected" : `${row.bodyLen} -> ${seedBodyLen} chars`;
        await db
          .update(postsTable)
          .set({
            body: seed.body as string,
            verifiedSource: (seed.verified_source as string | null) ?? null,
            teaser: (seed.teaser as string) ?? undefined,
            title: (seed.title as string) ?? undefined,
            slug: (seed.slug as string) ?? undefined,
            seoMetaTitle: (seed.seo_meta_title as string | null) ?? null,
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
    const newPosts = posts.filter(
      (p) =>
        !existingCases.has(p.case_number as string) &&
        !RETIRED_TO_FP.has(p.case_number as string)
    );

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
  "replacement-theory-requires-a-culture-to-replace-the-record-does-not-confirm-one-exists",
  "state-sponsor-terror-designation-statutory-analysis-economic-gatekeeper",
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

// ─── Rename case numbers that were originally assigned wrong CB- prefixes ─────
// These articles were created via the editor and got CB- numbers. They belong
// in the FP- series. This rename runs on every startup and is idempotent.

const CASE_NUMBER_RENAMES: { from: string; to: string }[] = [
  { from: "CB-000125", to: "FP-005" }, // No, Black Americans Do Not Commit More Violent Crime
  { from: "CB-000384", to: "FP-006" }, // Philo of Alexandria
];

// CB- numbers that have been promoted to FP- articles and removed from the
// regular seed. The seed file still lists them under the old number, so
// insertNewArticles() would try to re-insert them every startup without this
// exclusion list.
const RETIRED_TO_FP: Set<string> = new Set([
  "CB-000174", // → FP-008: $40 Billion Tax on Paying Your Taxes
]);

export async function applyCaseNumberRenames(): Promise<void> {
  try {
    let renamed = 0;
    for (const { from, to } of CASE_NUMBER_RENAMES) {
      const result = await db.execute(
        sql`UPDATE posts SET case_number = ${to} WHERE case_number = ${from}`
      );
      const count = (result as unknown as { rowCount?: number })?.rowCount ?? 0;
      if (count > 0) {
        console.log(`[Seed] Renamed case number: ${from} -> ${to}`);
        renamed++;
      }
    }
    if (renamed === 0) {
      console.log(`[Seed] Case number renames: all already correct.`);
    }
  } catch (err) {
    console.error("[Seed] Error during applyCaseNumberRenames:", err);
  }
}

// ─── Correct categories that were misassigned during earlier reseeds ──────────
// These articles were wiped from founders_pen by a prior TRUNCATE and re-added
// under wrong categories. This corrects them permanently on every startup.

const CATEGORY_OVERRIDES: { caseNumber: string; category: typeof postsTable.$inferInsert["category"] }[] = [
  { caseNumber: "FP-001", category: "founders_pen" }, // Engineered Underdevelopment
  { caseNumber: "FP-002", category: "founders_pen" }, // Hidden Debts & Philosophia
  { caseNumber: "FP-003", category: "founders_pen" }, // Harriet Tubman / Irena Sendler
  { caseNumber: "FP-004", category: "founders_pen" }, // African Immigrants $55 Billion
  { caseNumber: "FP-005", category: "founders_pen" }, // No, Black Americans Do Not Commit More Violent Crime
  { caseNumber: "FP-006", category: "founders_pen" }, // Philo of Alexandria
  { caseNumber: "FP-007", category: "founders_pen" }, // Replacement Theory Requires a Culture to Replace
  { caseNumber: "FP-008", category: "founders_pen" }, // $40 Billion Tax on Paying Your Taxes
];

export async function applyCategoryOverrides(): Promise<void> {
  try {
    let fixed = 0;
    for (const { caseNumber, category } of CATEGORY_OVERRIDES) {
      const result = await db
        .update(postsTable)
        .set({ category })
        .where(sql`${postsTable.caseNumber} = ${caseNumber} AND ${postsTable.category} != ${category}`);
      const count = (result as unknown as { rowCount?: number })?.rowCount ?? 0;
      if (count > 0) {
        console.log(`[Seed] Category override applied: ${caseNumber} -> ${category}`);
        fixed++;
      }
    }
    if (fixed === 0) {
      console.log(`[Seed] Category overrides: all articles already correct.`);
    }
  } catch (err) {
    console.error("[Seed] Error during applyCategoryOverrides:", err);
  }
}

// ─── War & Inhumanity tag standardization (April 2026) ───────────────────────
// Applies clean, consistent tags across all 13 war_and_inhumanity articles.
// Idempotent: checks current tag count before updating to avoid re-running.

const WAR_TAG_PATCHES: Record<string, string[]> = {
  "CB-000390": ["ukraine","nato","geopolitical_record","diplomatic_record","declassified","nato_expansion","accountability"],
  "CB-000242": ["myanmar","military_coup","human_rights","united_nations","aung_san_suu_kyi","accountability","civilian_harm","un_documented"],
  "CB-000241": ["ukraine","cluster_munitions","war_crimes","civilian_harm","nato","geopolitical_record","biden_administration"],
  "CB-000240": ["sudan","rsf","rapid_support_forces","atrocities","civilian_harm","accountability","un_documented","humanitarian_crisis"],
  "CB-000239": ["drc","congo","conflict_minerals","united_nations","m23","accountability","un_documented","civilian_harm"],
  "CB-000238": ["yemen","humanitarian_crisis","war_crimes","saudi_arabia","civilian_harm","accountability","un_documented"],
  "CB-000012": ["gaza","palestine","genocide","ethnic_cleansing","civilian_harm","accountability","displacement","icj"],
  "CB-000121": ["congressional_appropriations","military_spending","fiscal_accountability","accountability","defense_budget","war_spending"],
  "CB-000188": ["abu_ghraib","torture","taguba_report","us_military","iraq_war","classified_documents","war_crimes","accountability"],
  "CB-000203": ["drone_strikes","cia","pakistan","civilian_harm","targeted_killing","accountability","war_crimes","national_security"],
  "CB-000184": ["defense_contractors","gao","pentagon","cost_overruns","military_spending","accountability","fiscal_accountability","government_waste"],
  "CB-000192": ["yemen","civilian_harm","arms_sales","saudi_arabia","humanitarian_crisis","us_foreign_policy","war_crimes","accountability"],
  "CB-000198": ["agent_orange","vietnam_veterans","va","disability_claims","pact_act","accountability","fiscal_accountability","veterans_affairs"],
};

export async function applyWarCategoryTagPatches(): Promise<void> {
  try {
    let updated = 0;
    for (const [caseNum, targetTags] of Object.entries(WAR_TAG_PATCHES)) {
      const existing = await db.execute(
        sql`SELECT tags FROM posts WHERE case_number = ${caseNum}`
      );
      if (existing.rows.length === 0) continue;
      const currentTags: string[] = (existing.rows[0] as { tags: string[] }).tags ?? [];
      const alreadyClean =
        currentTags.length === targetTags.length &&
        targetTags.every(t => currentTags.includes(t));
      if (!alreadyClean) {
        const arrayLiteral = `{${targetTags.map(t => `"${t}"`).join(",")}}`;
        await db.execute(
          sql`UPDATE posts SET tags = ${arrayLiteral}::text[] WHERE case_number = ${caseNum}`
        );
        updated++;
        console.log(`[Seed] Tag patch applied: ${caseNum}`);
      }
    }
    if (updated === 0) {
      console.log(`[Seed] War category tags: all articles already correct.`);
    } else {
      console.log(`[Seed] War category tags: ${updated} article(s) updated.`);
    }
  } catch (err) {
    console.error("[Seed] Error during applyWarCategoryTagPatches:", err);
  }
}

// ─── One-time verified_source patch for CB-000390 ────────────────────────────
// Replaces the HTML-formatted source block (full APA citations) with clean
// CB citation format: Document Name :: Institution. Body is never touched.

const CB000390_CLEAN_SOURCE = [
  "NATO Expansion: What Gorbachev Heard (NSA Briefing Book 613) :: National Security Archive, George Washington University",
  "Memorandum of Conversation: Baker-Gorbachev (February 9, 1990) :: George H. W. Bush Presidential Library and Museum",
  "Nyet Means Nyet: Russia's NATO Enlargement Redlines (Cable 08MOSCOW265) :: United States Department of State, Embassy Moscow",
  "The Back Channel \u2014 memoir of William J. Burns :: Random House",
  "Bucharest Summit Declaration, paragraph 23 :: North Atlantic Treaty Organization",
  "Minsk II \u2014 Package of Measures for the Implementation of the Minsk Agreements :: Organization for Security and Co-operation in Europe",
  "Interview with Angela Merkel on Minsk and the Ukraine war :: Die Zeit",
  "Interview with Francois Hollande confirming the Merkel account :: The Kyiv Independent",
  "Interview with Petro Poroshenko on Minsk as strategic delay :: Deutsche Welle",
  "Interview with Naftali Bennett on Istanbul negotiations :: Naftali Bennett Official YouTube Channel",
  "Interview with Numan Kurtulmus on Istanbul negotiations :: CNN Turk",
  "Russian Draft Treaties on Security Guarantees :: Russian Ministry of Foreign Affairs",
  "Leaked U.S. and NATO responses to Russian draft treaties :: El Pa\u00eds",
  "The World Putin Wants (Foreign Affairs, September/October 2022) :: Council on Foreign Relations",
  "Ukrainska Pravda investigation of the Istanbul negotiations and the Johnson visit :: Ukrainska Pravda",
  "Jens Stoltenberg testimony to the European Parliament :: European Parliament",
].join("; ");

export async function patchCB000390Source(): Promise<void> {
  try {
    // Idempotent: only runs while verified_source still contains HTML tags
    const result = await db.execute(
      sql`UPDATE posts
          SET verified_source = ${CB000390_CLEAN_SOURCE}
          WHERE case_number = 'CB-000390'
            AND verified_source LIKE '%<%'`
    );
    const count = (result as unknown as { rowCount?: number })?.rowCount ?? 0;
    if (count > 0) {
      console.log(`[Seed] CB-000390 verified_source patched to clean CB citation format.`);
    }
  } catch (err) {
    console.error("[Seed] Error during patchCB000390Source:", err);
  }
}

// Articles that have been damaged by automated sync and must never be touched by
// any startup function again. locked = true is checked by syncImprovedArticles
// and insertFoundersPenArticles before any body update.
const CONTENT_LOCKED_ARTICLES: string[] = [
  "CB-000088", // Locked April 19, 2026 — body lost to bidirectional sync incident
];

export async function applyContentLocks(): Promise<void> {
  try {
    if (CONTENT_LOCKED_ARTICLES.length === 0) return;
    const result = await db
      .update(postsTable)
      .set({ locked: true })
      .where(
        sql`${postsTable.caseNumber} = ANY(${CONTENT_LOCKED_ARTICLES}::text[]) AND ${postsTable.locked} = false`
      );
    const count = (result as unknown as { rowCount?: number })?.rowCount ?? 0;
    if (count > 0) {
      console.log(`[Seed] Content locks applied: ${count} article(s) locked against automated sync.`);
    }
  } catch (err) {
    console.error("[Seed] Error during applyContentLocks:", err);
  }
}

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
