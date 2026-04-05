/**
 * CB PRODUCTION GATE — PRIME DIRECTIVE CHECKLIST
 *
 * This is the ONLY gate that determines whether an article is done.
 * It must pass completely — every block, every check — before any article
 * or category is declared finished. No partial passes. No exceptions.
 *
 * Six blocks are checked:
 *   BLOCK 1 — CB Dry Rationalism (forbidden words, phrases, structures)
 *   BLOCK 2 — Structural Minimums (words, H2s, factoids)
 *   BLOCK 3 — SEO Requirements (seo_meta_title)
 *   BLOCK 4 — Publication State (status, locked)
 *   BLOCK 5 — Source Quality (CB citation format, no URLs, no legacy media)
 *   BLOCK 6 — Title Quality (no em dashes in public title)
 *
 * Usage:
 *   pnpm --filter @workspace/scripts run scan <category>
 *   pnpm --filter @workspace/scripts run scan ALL
 *   pnpm --filter @workspace/scripts run scan CB-000370   (single article)
 */

import { pool } from "@workspace/db";

const target = process.argv[2];

if (!target) {
  console.error("Usage: pnpm --filter @workspace/scripts run scan <category|ALL|CB-XXXXXX>");
  process.exit(1);
}

const WORD_FLOOR = 1380;
const H2_MINIMUM = 5;
const FACTOID_MINIMUM = 3;
const SEO_TITLE_MIN = 52;
const SEO_TITLE_MAX = 70;

const LEGACY_MEDIA = [
  "New York Times", "Washington Post", "The Guardian", "CNN", "Fox News",
  "NBC News", "BBC", "Rolling Stone", "HuffPost", "The Atlantic",
  "Chicago Tribune", "texastribune", "politico", "thehill", "axios"
];

async function main() {
  let whereClause: string;

  if (target.toUpperCase() === "ALL") {
    whereClause = "WHERE status = 'published'";
  } else if (target.startsWith("CB-")) {
    whereClause = `WHERE case_number = '${target.replace(/'/g, "''")}'`;
  } else {
    whereClause = `WHERE category = '${target.replace(/'/g, "''")}'`;
  }

  const result = await pool.query(`
    SELECT
      case_number,
      category,
      status,
      locked,
      seo_meta_title,
      verified_source,

      -- BLOCK 1: CB Dry Rationalism
      (body ~* '\\yremarkable\\y')                                            AS b1_remarkable,
      (body ~* '\\bsignificant(ly)?\\b|\\bsignificance\\b')                   AS b1_significant,
      (body ~* '\\bextraordinary\\b')                                          AS b1_extraordinary,
      (body ~* '\\blegacy\\b')                                                 AS b1_legacy_word,
      (body ~* '\\btransformative\\b')                                         AS b1_transformative,
      (body ~* '\\bstands as\\b')                                              AS b1_stands_as,
      (body ~* 'cannot be overstated')                                         AS b1_overstated,
      (body ~* 'far beyond mere')                                              AS b1_far_beyond,
      (body ~* '\\bprofound(ly)?\\b')                                          AS b1_profound,
      (body ~* '\\bmonumental\\b')                                             AS b1_monumental,
      (body ~* '\\bgroundbreaking\\b')                                         AS b1_groundbreaking,
      (body ~* '<h2>[^<]*(legacy|significance|conclusion|remarkable|impact)[^<]*</h2>') AS b1_bad_h2,
      (body ~* '<h1')                                                          AS b1_body_h1,
      (regexp_replace(body, 'data-[a-z]+="[^"]*"', '', 'g') LIKE '%—%')      AS b1_em_dash,
      (body ~* '(reflects|indicates|suggests|portrays|reveals)\\.</p>')       AS b1_terminal_interp,

      -- BLOCK 2: Structural Minimums
      array_length(string_to_array(
        regexp_replace(body, '<[^>]+>', ' ', 'g'), ' '), 1)                   AS b2_word_count,
      (array_length(regexp_split_to_array(body, '<h2'), 1) - 1)              AS b2_h2_count,
      (array_length(regexp_split_to_array(body, 'cb-factoid'), 1) - 1)       AS b2_factoid_count,

      -- BLOCK 3: SEO
      seo_meta_title IS NULL OR seo_meta_title = ''                           AS b3_seo_missing,
      length(seo_meta_title)                                                   AS b3_seo_len,

      -- BLOCK 4: Publication State
      status != 'published'                                                    AS b4_not_published,
      locked = false                                                           AS b4_not_locked,

      -- BLOCK 5: Source Quality
      (verified_source NOT LIKE '%::%' OR verified_source IS NULL)            AS b5_no_citations,
      (verified_source ILIKE '%http%')                                         AS b5_has_url,
      verified_source                                                          AS b5_source_text,

      -- BLOCK 6: Title Quality
      title,
      (title LIKE '%—%')                                                       AS b6_title_em_dash

    FROM posts
    ${whereClause}
    ORDER BY category, case_number
  `);

  type Row = {
    case_number: string;
    category: string;
    status: string;
    locked: boolean;
    seo_meta_title: string | null;
    verified_source: string | null;
    b1_remarkable: boolean;
    b1_significant: boolean;
    b1_extraordinary: boolean;
    b1_legacy_word: boolean;
    b1_transformative: boolean;
    b1_stands_as: boolean;
    b1_overstated: boolean;
    b1_far_beyond: boolean;
    b1_profound: boolean;
    b1_monumental: boolean;
    b1_groundbreaking: boolean;
    b1_bad_h2: boolean;
    b1_body_h1: boolean;
    b1_em_dash: boolean;
    b1_terminal_interp: boolean;
    b2_word_count: number;
    b2_h2_count: number;
    b2_factoid_count: number;
    b3_seo_missing: boolean;
    b3_seo_len: number;
    b4_not_published: boolean;
    b4_not_locked: boolean;
    b5_no_citations: boolean;
    b5_has_url: boolean;
    b5_source_text: string | null;
    title: string;
    b6_title_em_dash: boolean;
  };

  type Violation = {
    case_number: string;
    category: string;
    block: string;
    issues: string[];
  };

  const violations: Violation[] = [];

  for (const row of result.rows as Row[]) {
    const b1: string[] = [];
    const b2: string[] = [];
    const b3: string[] = [];
    const b4: string[] = [];
    const b5: string[] = [];
    const b6: string[] = [];

    // BLOCK 1 — CB Dry Rationalism
    if (row.b1_remarkable)     b1.push("'remarkable'");
    if (row.b1_significant)    b1.push("'significant/significance/significantly'");
    if (row.b1_extraordinary)  b1.push("'extraordinary'");
    if (row.b1_legacy_word)    b1.push("'legacy' in body text");
    if (row.b1_transformative) b1.push("'transformative'");
    if (row.b1_stands_as)      b1.push("'stands as'");
    if (row.b1_overstated)     b1.push("'cannot be overstated'");
    if (row.b1_far_beyond)     b1.push("'far beyond mere'");
    if (row.b1_profound)       b1.push("'profound/profoundly'");
    if (row.b1_monumental)     b1.push("'monumental'");
    if (row.b1_groundbreaking) b1.push("'groundbreaking'");
    if (row.b1_bad_h2)         b1.push("Forbidden H2 header (Legacy/Significance/Conclusion/Remarkable/Impact)");
    if (row.b1_body_h1)        b1.push("H1 IN BODY — duplicate H1 — Google SEO penalty");
    if (row.b1_em_dash)        b1.push("Em dash (—) in visible body text");
    if (row.b1_terminal_interp) b1.push("Terminal interpretation verb (reflects/indicates/suggests/portrays)");

    // BLOCK 2 — Structural Minimums
    if (row.b2_word_count < WORD_FLOOR)
      b2.push(`Word count ${row.b2_word_count} is below ${WORD_FLOOR} floor`);
    if (row.b2_h2_count < H2_MINIMUM)
      b2.push(`Only ${row.b2_h2_count} H2 header(s) — minimum is ${H2_MINIMUM}`);
    if (row.b2_factoid_count < FACTOID_MINIMUM)
      b2.push(`Only ${row.b2_factoid_count} cb-factoid anchor(s) — minimum is ${FACTOID_MINIMUM}`);

    // BLOCK 3 — SEO
    if (row.b3_seo_missing)
      b3.push("seo_meta_title is missing or empty");
    else if (row.b3_seo_len < SEO_TITLE_MIN)
      b3.push(`seo_meta_title is ${row.b3_seo_len} chars — minimum is ${SEO_TITLE_MIN}`);
    else if (row.b3_seo_len > SEO_TITLE_MAX)
      b3.push(`seo_meta_title is ${row.b3_seo_len} chars — maximum is ${SEO_TITLE_MAX}`);

    // BLOCK 4 — Publication State
    if (row.b4_not_published)  b4.push(`Status is '${row.status}' — must be 'published'`);
    if (row.b4_not_locked)     b4.push("Article is not locked — run pipeline or lock manually");

    // BLOCK 5 — Source Quality
    if (row.b5_no_citations)
      b5.push("verified_source has no CB citations (missing '::') — raw text only");
    if (row.b5_has_url)
      b5.push("verified_source contains a URL — Zero-URL Policy violation");
    if (row.b5_source_text) {
      for (const outlet of LEGACY_MEDIA) {
        if (row.b5_source_text.toLowerCase().includes(outlet.toLowerCase())) {
          b5.push(`verified_source cites legacy media: "${outlet}" — cite the primary document instead`);
          break;
        }
      }
    }

    // BLOCK 6 — Title Quality
    if (row.b6_title_em_dash)
      b6.push(`Em dash (—) in public title: "${row.title.substring(0, 80)}..."`);

    const allIssues = [
      ...b1.map(i => `  [B1-EDITORIAL]    ${i}`),
      ...b2.map(i => `  [B2-STRUCTURE]    ${i}`),
      ...b3.map(i => `  [B3-SEO]          ${i}`),
      ...b4.map(i => `  [B4-STATE]        ${i}`),
      ...b5.map(i => `  [B5-SOURCES]      ${i}`),
      ...b6.map(i => `  [B6-TITLE]        ${i}`),
    ];

    if (allIssues.length > 0) {
      violations.push({
        case_number: row.case_number,
        category: row.category,
        block: [
          b1.length ? "B1" : "",
          b2.length ? "B2" : "",
          b3.length ? "B3" : "",
          b4.length ? "B4" : "",
          b5.length ? "B5" : "",
          b6.length ? "B6" : "",
        ].filter(Boolean).join("+"),
        issues: allIssues,
      });
    }
  }

  const total = result.rows.length;
  const line = "═".repeat(70);

  console.log(`\nCB PRODUCTION GATE — ${target.toUpperCase()}`);
  console.log(line);
  console.log(`Articles scanned:     ${total}`);
  console.log(`Articles with issues: ${violations.length}`);
  console.log(line);

  if (violations.length === 0) {
    console.log(`
  ✓  BLOCK 1 — CB Dry Rationalism     PASS
  ✓  BLOCK 2 — Structural Minimums    PASS
  ✓  BLOCK 3 — SEO Requirements       PASS
  ✓  BLOCK 4 — Publication State      PASS
  ✓  BLOCK 5 — Source Quality         PASS
  ✓  BLOCK 6 — Title Quality          PASS

  ALL CLEAR — ${total} article(s) ready for production.
`);
    await pool.end();
    process.exit(0);
  }

  console.log("");
  for (const v of violations) {
    console.log(`✗ ${v.case_number} [${v.category}] — blocks failing: ${v.block}`);
    for (const issue of v.issues) {
      console.log(issue);
    }
    console.log("");
  }

  console.log(line);
  console.log(`FAIL — ${violations.length} article(s) did not pass the production gate.`);
  console.log(`Fix every issue above, then re-run this scan.`);
  console.log(`An article is not done until this scan exits 0.\n`);

  await pool.end();
  process.exit(1);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
