/**
 * Verify every external link in every article, then lock articles that pass.
 * Accept: 200, 302, 403, 429  |  Reject: 404, 410, 000 (timeout/no response)
 */

import { pool } from "@workspace/db";
import { execSync } from "child_process";

interface Article {
  slug: string;
  case_number: string;
  title: string;
  verified_source: string | null;
  source_url: string | null;
  body: string;
  locked: boolean;
}

const ACCEPT_CODES = new Set([200, 301, 302, 303, 307, 308, 403, 429]);
const REJECT_CODES = new Set([404, 410]);

function extractUrls(text: string): string[] {
  if (!text) return [];
  const urlRegex = /https?:\/\/[^\s"'<>\)\],;]+/g;
  const matches = text.match(urlRegex) ?? [];
  return matches
    .map((u) => u.replace(/[.,;:]+$/, "").trim())
    .filter((u) => u.length > 10);
}

function verifyUrl(url: string): number {
  try {
    const code = execSync(
      `curl -s -o /dev/null -w "%{http_code}" --max-time 10 -L -A "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36" "${url}"`,
      { timeout: 15000, encoding: "utf8" }
    ).trim();
    return parseInt(code, 10) || 0;
  } catch {
    return 0;
  }
}

async function main() {
  const client = await pool.connect();
  try {
    const { rows: articles } = await client.query<Article>(
      `SELECT slug, case_number, title, verified_source, source_url, body, locked
       FROM posts WHERE status = 'published' ORDER BY case_number`
    );

    console.log(`\nFound ${articles.length} published articles.\n`);
    console.log("=".repeat(80));

    const urlCache = new Map<string, number>(); // url → status code
    const results: Array<{
      article: Article;
      urls: string[];
      failures: Array<{ url: string; code: number }>;
      passed: boolean;
      alreadyLocked: boolean;
    }> = [];

    for (const article of articles) {
      const urlSet = new Set<string>();

      // Extract from verified_source
      if (article.verified_source) {
        for (const u of extractUrls(article.verified_source)) urlSet.add(u);
      }

      // Extract from source_url
      if (article.source_url) {
        for (const u of extractUrls(article.source_url)) urlSet.add(u);
      }

      // Extract from body HTML (href and src attributes)
      if (article.body) {
        for (const u of extractUrls(article.body)) urlSet.add(u);
      }

      const urls = Array.from(urlSet);
      const failures: Array<{ url: string; code: number }> = [];

      if (urls.length === 0) {
        console.log(
          `${article.case_number}  [NO EXTERNAL LINKS] ${article.slug}`
        );
        results.push({
          article,
          urls,
          failures,
          passed: true,
          alreadyLocked: article.locked,
        });
        continue;
      }

      console.log(
        `\n${article.case_number}  ${article.slug}  (${urls.length} links)`
      );

      for (const url of urls) {
        let code: number;
        if (urlCache.has(url)) {
          code = urlCache.get(url)!;
          const symbol = ACCEPT_CODES.has(code) ? "✓" : "✗";
          console.log(`  ${symbol} [cached ${code}] ${url}`);
        } else {
          process.stdout.write(`  ? ${url} ... `);
          code = verifyUrl(url);
          urlCache.set(url, code);
          const symbol = ACCEPT_CODES.has(code) ? "✓" : "✗";
          console.log(`${symbol} [${code}]`);
        }

        if (!ACCEPT_CODES.has(code)) {
          failures.push({ url, code });
        }
      }

      const passed = failures.length === 0;
      results.push({
        article,
        urls,
        failures,
        passed,
        alreadyLocked: article.locked,
      });
    }

    // Summary
    console.log("\n" + "=".repeat(80));
    console.log("RESULTS SUMMARY");
    console.log("=".repeat(80));

    const passed = results.filter((r) => r.passed);
    const failed = results.filter((r) => !r.passed);

    console.log(`\nPASSED (${passed.length} articles):`);
    for (const r of passed) {
      const lockStatus = r.alreadyLocked ? "[already locked]" : "[WILL LOCK]";
      const linkInfo =
        r.urls.length === 0 ? "(no URLs)" : `(${r.urls.length} URLs OK)`;
      console.log(`  ${r.article.case_number}  ${lockStatus}  ${linkInfo}`);
    }

    if (failed.length > 0) {
      console.log(`\nFAILED (${failed.length} articles — NOT locking):`);
      for (const r of failed) {
        console.log(`  ${r.article.case_number}  ${r.article.slug}`);
        for (const f of r.failures) {
          console.log(`    ✗ [${f.code}] ${f.url}`);
        }
      }
    }

    // Lock all passing articles
    const tolock = passed.filter((r) => !r.alreadyLocked);
    if (tolock.length > 0) {
      console.log(`\nLocking ${tolock.length} articles...`);
      const slugs = tolock.map((r) => r.article.slug);
      await client.query(
        `UPDATE posts SET locked = true WHERE slug = ANY($1::text[])`,
        [slugs]
      );
      for (const r of tolock) {
        console.log(`  Locked: ${r.article.case_number}  ${r.article.slug}`);
      }
    } else {
      console.log("\nNo new articles to lock.");
    }

    // Final count
    const { rows: lockRow } = await client.query(
      `SELECT COUNT(*) AS locked_count FROM posts WHERE status = 'published' AND locked = true`
    );
    console.log(
      `\nTotal locked articles: ${lockRow[0].locked_count} / ${articles.length}`
    );
  } finally {
    client.release();
    await pool.end();
  }
}

main().catch((err) => {
  console.error("Fatal error:", err);
  process.exit(1);
});
