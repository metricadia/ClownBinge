/**
 * CB VIOLATION SCAN — MANDATORY FINAL STEP
 *
 * Run this against every category before it is considered done.
 * Zero violations required. No exceptions.
 *
 * Usage:
 *   cd scripts && npx tsx src/cb-scan.ts <category>
 *   cd scripts && npx tsx src/cb-scan.ts native_and_first_nations
 *   cd scripts && npx tsx src/cb-scan.ts ALL
 */

import { pool } from "@workspace/db";

const category = process.argv[2];

if (!category) {
  console.error("Usage: npx tsx src/cb-scan.ts <category|ALL>");
  process.exit(1);
}

async function main() {
  const whereClause =
    category.toUpperCase() === "ALL"
      ? ""
      : `WHERE category = '${category.replace(/'/g, "''")}'`;

  const result = await pool.query(`
    SELECT
      case_number,
      category,
      -- Forbidden words
      (body ~* '\\yremarkable\\y')                                        AS has_remarkable,
      (body ~* '\\bsignificant(ly)?\\b|\\bsignificance\\b')               AS has_significant,
      (body ~* '\\bextraordinary\\b')                                      AS has_extraordinary,
      (body ~* '\\blegacy\\b')                                             AS has_legacy_word,
      (body ~* '\\btransformative\\b')                                     AS has_transformative,
      (body ~* '\\bstands as\\b')                                          AS has_stands_as,
      (body ~* 'cannot be overstated')                                     AS has_overstated,
      (body ~* 'far beyond mere')                                          AS has_far_beyond,
      (body ~* '\\bprofound(ly)?\\b')                                      AS has_profound,
      (body ~* '\\bmonumental\\b')                                         AS has_monumental,
      (body ~* '\\bgroundbreaking\\b')                                     AS has_groundbreaking,
      -- Forbidden H2 headers
      (body ~* '<h2>[^<]*(legacy|significance|conclusion|remarkable)[^<]*</h2>') AS has_bad_h2,
      -- H1 in body (duplicate — always forbidden)
      (body ~* '<h1')                                                      AS has_body_h1,
      -- Em dashes in visible text (exclude data attributes)
      (regexp_replace(body, 'data-[a-z]+="[^"]*"', '', 'g') LIKE '%—%')  AS has_em_dash,
      -- Terminal interpretation verbs
      (body ~* '(reflects|indicates|suggests|portrays)\\.</p>')            AS has_terminal_interp,
      -- Word floor
      array_length(string_to_array(
        regexp_replace(body, '<[^>]+>', ' ', 'g'), ' '), 1)               AS word_count
    FROM posts
    ${whereClause}
    ORDER BY category, case_number
  `);

  type Row = {
    case_number: string;
    category: string;
    has_remarkable: boolean;
    has_significant: boolean;
    has_extraordinary: boolean;
    has_legacy_word: boolean;
    has_transformative: boolean;
    has_stands_as: boolean;
    has_overstated: boolean;
    has_far_beyond: boolean;
    has_profound: boolean;
    has_monumental: boolean;
    has_groundbreaking: boolean;
    has_bad_h2: boolean;
    has_body_h1: boolean;
    has_em_dash: boolean;
    has_terminal_interp: boolean;
    word_count: number;
  };

  const violations: { case_number: string; category: string; issues: string[] }[] = [];

  for (const row of result.rows as Row[]) {
    const issues: string[] = [];

    if (row.has_remarkable)    issues.push("'remarkable'");
    if (row.has_significant)   issues.push("'significant/significance'");
    if (row.has_extraordinary) issues.push("'extraordinary'");
    if (row.has_legacy_word)   issues.push("'legacy' in body text");
    if (row.has_transformative) issues.push("'transformative'");
    if (row.has_stands_as)     issues.push("'stands as'");
    if (row.has_overstated)    issues.push("'cannot be overstated'");
    if (row.has_far_beyond)    issues.push("'far beyond mere'");
    if (row.has_profound)      issues.push("'profound/profoundly'");
    if (row.has_monumental)    issues.push("'monumental'");
    if (row.has_groundbreaking) issues.push("'groundbreaking'");
    if (row.has_bad_h2)        issues.push("Forbidden H2 (Legacy/Significance/Conclusion/Remarkable)");
    if (row.has_body_h1)       issues.push("H1 IN BODY — DUPLICATE H1 — SEO VIOLATION");
    if (row.has_em_dash)       issues.push("Em dash (—) in visible body text");
    if (row.has_terminal_interp) issues.push("Terminal interpretation verb (reflects/indicates/suggests/portrays)");
    if (row.word_count < 1380) issues.push(`Word count ${row.word_count} is below 1,380 floor`);

    if (issues.length > 0) {
      violations.push({ case_number: row.case_number, category: row.category, issues });
    }
  }

  const total = result.rows.length;

  console.log(`\nCB VIOLATION SCAN — ${category.toUpperCase()}`);
  console.log(`${"═".repeat(60)}`);
  console.log(`Articles scanned: ${total}`);
  console.log(`Articles with violations: ${violations.length}`);
  console.log(`${"═".repeat(60)}\n`);

  if (violations.length === 0) {
    console.log("✓ CLEAN — zero CB violations found.\n");
    await pool.end();
    process.exit(0);
  }

  for (const v of violations) {
    console.log(`✗ ${v.case_number} [${v.category}]`);
    for (const issue of v.issues) {
      console.log(`    • ${issue}`);
    }
  }

  console.log(`\n${"═".repeat(60)}`);
  console.log(`FAIL — ${violations.length} article(s) have CB violations.`);
  console.log(`Fix all violations before marking this category done.\n`);

  await pool.end();
  process.exit(1);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
