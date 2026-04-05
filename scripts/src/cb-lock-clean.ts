/**
 * cb-lock-clean.ts
 * Lock articles that pass B2 (word count, H2, factoids) + B3 (seo_meta_title)
 * + B6 (no em dash in title) but are not yet locked (B4 only failure).
 *
 * Usage:
 *   pnpm --filter @workspace/scripts run lock-clean technology
 *   pnpm --filter @workspace/scripts run lock-clean ALL
 */

import { pool } from "@workspace/db";

const WORD_FLOOR = 1380;
const H2_MINIMUM = 5;
const FACTOID_MINIMUM = 3;

async function main() {
  const arg = process.argv[2] ?? "ALL";
  const db = await pool.connect();

  try {
    const categoryFilter = arg === "ALL" ? "" : `AND p.category = '${arg}'`;

    const { rows } = await db.query(`
      SELECT
        p.id,
        p.case_number,
        p.title,
        p.category,
        array_length(
          regexp_split_to_array(regexp_replace(p.body, '<[^>]+>', ' ', 'g'), '\\s+'), 1
        ) AS word_count,
        (array_length(regexp_split_to_array(p.body, '<h2'), 1) - 1) AS h2_count,
        (array_length(regexp_split_to_array(p.body, 'cb-factoid'), 1) - 1) AS factoid_count
      FROM posts p
      WHERE p.status = 'published'
        AND p.locked = false
        AND p.seo_meta_title IS NOT NULL
        AND p.seo_meta_title != ''
        AND length(p.seo_meta_title) >= 52
        AND length(p.seo_meta_title) <= 70
        AND p.title NOT LIKE '%—%'
        ${categoryFilter}
      ORDER BY p.case_number
    `);

    const candidates = rows.filter(
      (r) =>
        r.word_count >= WORD_FLOOR &&
        r.h2_count >= H2_MINIMUM &&
        r.factoid_count >= FACTOID_MINIMUM
    );

    console.log(
      `\n[Lock-Clean] ${rows.length} unlocked articles with seo_meta_title${arg !== "ALL" ? ` in '${arg}'` : ""}.`
    );
    console.log(
      `[Lock-Clean] ${candidates.length} pass B2 structure checks — locking now.\n`
    );

    if (candidates.length === 0) {
      console.log("Nothing to lock.");
      return;
    }

    const ids = candidates.map((r) => r.id);
    const { rowCount } = await db.query(
      `UPDATE posts SET locked = true, updated_at = now() WHERE id = ANY($1)`,
      [ids]
    );

    for (const r of candidates) {
      console.log(
        `  LOCKED ${r.case_number} — words:${r.word_count} h2:${r.h2_count} factoids:${r.factoid_count}`
      );
    }

    console.log(`\n[Lock-Clean] Locked ${rowCount} articles.`);

    // Report articles that still need structure fixes
    const skipped = rows.filter(
      (r) =>
        r.word_count < WORD_FLOOR ||
        r.h2_count < H2_MINIMUM ||
        r.factoid_count < FACTOID_MINIMUM
    );

    if (skipped.length > 0) {
      console.log(
        `\n[Lock-Clean] ${skipped.length} articles still need B2 fixes:`
      );
      for (const r of skipped) {
        const issues = [];
        if (r.word_count < WORD_FLOOR) issues.push(`words:${r.word_count}<${WORD_FLOOR}`);
        if (r.h2_count < H2_MINIMUM) issues.push(`h2:${r.h2_count}<${H2_MINIMUM}`);
        if (r.factoid_count < FACTOID_MINIMUM) issues.push(`factoids:${r.factoid_count}<${FACTOID_MINIMUM}`);
        console.log(`  ${r.case_number} [${r.category}] — ${issues.join(", ")}`);
      }
    }
  } finally {
    db.release();
    await pool.end();
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
