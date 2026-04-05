/**
 * cb-seo-titles.ts
 * Generate seo_meta_title for articles missing it.
 * Format: "[Keyword-first phrase] | CB-XXXXXX"  (52-70 chars total)
 *
 * Usage:
 *   pnpm --filter @workspace/scripts run seo-titles technology
 *   pnpm --filter @workspace/scripts run seo-titles ALL
 */

import Anthropic from "@anthropic-ai/sdk";
import { pool } from "@workspace/db";

const SEO_MIN = 52;
const SEO_MAX = 70;

const client = new Anthropic();

interface Article {
  id: number;
  case_number: string;
  title: string;
  category: string;
  body: string | null;
}

function sleep(ms: number) {
  return new Promise<void>((r) => setTimeout(r, ms));
}

function stripHtml(html: string): string {
  return html.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
}

async function generateSeoTitle(article: Article): Promise<string | null> {
  const excerpt = article.body
    ? stripHtml(article.body).slice(0, 300)
    : "";

  const suffixLen = " | ".length + article.case_number.length; // e.g. " | CB-000289" = 13
  const keywordMin = SEO_MIN - suffixLen;
  const keywordMax = SEO_MAX - suffixLen;

  const prompt = `You are an SEO writer for an accountability journalism platform.
Generate a keyword-first SEO meta title phrase for the article below.
Rules:
- EXACTLY ${keywordMin} to ${keywordMax} characters (count carefully)
- Keyword-first: lead with the most searchable noun or fact
- Plain prose, no em dashes (—), no quotation marks, no clickbait
- Must reflect the article's central factual claim
- Do NOT include "| CB-XXXXXX" — I will append it

Article title: ${article.title}
Category: ${article.category}
Opening text: ${excerpt}

Reply with ONLY the keyword phrase, nothing else.`;

  try {
    const response = await client.messages.create({
      model: "claude-haiku-4-5",
      max_tokens: 60,
      messages: [{ role: "user", content: prompt }],
    });

    const raw = (response.content[0] as { type: string; text: string }).text
      .trim()
      .replace(/^["'`]+|["'`]+$/g, "")
      .replace(/—/g, "-")
      .replace(/\s+/g, " ");

    const full = `${raw} | ${article.case_number}`;
    if (full.length < SEO_MIN || full.length > SEO_MAX) {
      console.warn(
        `  [WARN] ${article.case_number}: "${full}" is ${full.length} chars — outside ${SEO_MIN}-${SEO_MAX}`
      );
    }
    return full;
  } catch (err) {
    console.error(`  [ERROR] ${article.case_number}: AI call failed —`, (err as Error).message);
    return null;
  }
}

async function main() {
  const arg = process.argv[2] ?? "ALL";
  const db = await pool.connect();

  try {
    let query: string;
    let params: unknown[];

    if (arg === "ALL") {
      query = `
        SELECT id, case_number, title, category, body
        FROM posts
        WHERE status = 'published'
          AND (seo_meta_title IS NULL OR seo_meta_title = '' OR LENGTH(seo_meta_title) < ${SEO_MIN} OR LENGTH(seo_meta_title) > ${SEO_MAX})
        ORDER BY case_number
      `;
      params = [];
    } else {
      query = `
        SELECT id, case_number, title, category, body
        FROM posts
        WHERE status = 'published'
          AND category = $1
          AND (seo_meta_title IS NULL OR seo_meta_title = '' OR LENGTH(seo_meta_title) < ${SEO_MIN} OR LENGTH(seo_meta_title) > ${SEO_MAX})
        ORDER BY case_number
      `;
      params = [arg];
    }

    const { rows } = await db.query<Article>(query, params);
    console.log(`\n[SEO Titles] ${rows.length} articles need seo_meta_title${arg !== "ALL" ? ` in '${arg}'` : ""}.\n`);

    let done = 0;
    let failed = 0;

    for (const article of rows) {
      process.stdout.write(`  ${article.case_number} — generating... `);
      const seoTitle = await generateSeoTitle(article);

      if (seoTitle) {
        await db.query(
          `UPDATE posts SET seo_meta_title = $1, updated_at = now() WHERE id = $2`,
          [seoTitle, article.id]
        );
        console.log(`"${seoTitle}" (${seoTitle.length})`);
        done++;
      } else {
        console.log("FAILED");
        failed++;
      }

      if (article !== rows[rows.length - 1]) {
        await sleep(300);
      }
    }

    console.log(`\n[SEO Titles] Done. Generated: ${done} | Failed: ${failed}`);
  } finally {
    db.release();
    await pool.end();
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
