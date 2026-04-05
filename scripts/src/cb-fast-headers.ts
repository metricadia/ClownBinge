/**
 * cb-fast-headers.ts
 * Fast H2 header insertion using haiku (5-10x faster than restructure-headers).
 * Splits body into paragraph groups, generates 5 H2 titles in ONE haiku call,
 * and inserts them programmatically without rewriting content.
 *
 * Usage:
 *   pnpm --filter @workspace/scripts run fast-headers self_owned
 *   pnpm --filter @workspace/scripts run fast-headers ALL
 */

import Anthropic from "@anthropic-ai/sdk";
import { pool } from "@workspace/db";

const H2_MINIMUM = 5;
const WORD_FLOOR = 1380;
const client = new Anthropic();

const FORBIDDEN = /legacy|significance|conclusion|remarkable|impact/i;

function countH2(html: string): number {
  return (html.match(/<h2/gi) ?? []).length;
}

function countWords(html: string): number {
  return html
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .split(" ")
    .filter(Boolean).length;
}

function stripHtml(html: string): string {
  return html
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function sleep(ms: number) {
  return new Promise<void>((r) => setTimeout(r, ms));
}

function splitIntoParagraphs(body: string): string[] {
  return body.split(/(?=<(?:p|h[2-6]|ul|ol|blockquote)[^>]*>)/i).filter(Boolean);
}

interface Article {
  id: number;
  case_number: string;
  title: string;
  category: string;
  body: string;
}

async function generateH2Titles(
  article: Article,
  sections: string[],
  needed: number
): Promise<string[] | null> {
  const sectionPreviews = sections
    .slice(0, needed)
    .map((s, i) => `Section ${i + 1}: ${stripHtml(s).slice(0, 80)}`)
    .join("\n");

  const prompt = `Generate exactly ${needed} H2 section titles for a ClownBinge accountability journalism article.

Article title: ${article.title}

Section previews (insert H2 BEFORE each one):
${sectionPreviews}

Rules:
- Each title: 3-7 plain words, factual, no em dashes
- NO words: Legacy, Significance, Conclusion, Remarkable, Impact, Notable, Important
- Return ONLY ${needed} titles, one per line, no numbers or bullets

Titles:`;

  try {
    const response = await client.messages.create({
      model: "claude-haiku-4-5",
      max_tokens: 200,
      messages: [{ role: "user", content: prompt }],
    });

    const raw = (response.content[0] as { type: string; text: string }).text.trim();
    const titles = raw
      .split("\n")
      .map((t) => t.trim())
      .filter((t) => t.length > 0 && t.length < 80);

    if (titles.length < needed) {
      console.warn(`    [WARN] Got ${titles.length} titles, needed ${needed}`);
      return null;
    }

    const invalidTitles = titles.filter((t) => FORBIDDEN.test(t));
    if (invalidTitles.length > 0) {
      console.warn(`    [WARN] Forbidden words in titles: ${invalidTitles.join(", ")}`);
      return null;
    }

    return titles.slice(0, needed);
  } catch (err) {
    console.error(`    [ERROR] AI call failed:`, (err as Error).message);
    return null;
  }
}

async function insertHeaders(article: Article): Promise<string | null> {
  const needed = H2_MINIMUM - countH2(article.body);
  if (needed <= 0) return article.body;

  const paragraphs = splitIntoParagraphs(article.body);
  const totalParagraphs = paragraphs.length;

  if (totalParagraphs < needed) {
    console.warn(`    [WARN] ${article.case_number}: Only ${totalParagraphs} paragraphs, need ${needed} sections`);
    return null;
  }

  const step = Math.floor(totalParagraphs / (needed + 1));
  const insertionIndices = Array.from({ length: needed }, (_, i) => (i + 1) * step);

  const sectionContents = insertionIndices.map((idx) => paragraphs[idx]);
  const titles = await generateH2Titles(article, sectionContents, needed);
  if (!titles) return null;

  let result = [...paragraphs];
  for (let i = titles.length - 1; i >= 0; i--) {
    const idx = insertionIndices[i];
    result.splice(idx, 0, `<h2>${titles[i]}</h2>`);
  }

  const newBody = result.join("");
  const newH2Count = countH2(newBody);
  const newWordCount = countWords(newBody);

  if (newH2Count < H2_MINIMUM) {
    console.warn(`    [WARN] ${article.case_number}: Only ${newH2Count} H2s after insertion`);
    return null;
  }

  if (newWordCount < countWords(article.body) - 30) {
    console.warn(`    [WARN] ${article.case_number}: Word count dropped unexpectedly`);
    return null;
  }

  return newBody;
}

async function main() {
  const arg = process.argv[2] ?? "ALL";
  const categoryFilter = arg === "ALL" ? "" : `AND p.category = '${arg}'`;

  const { rows } = await pool.query<Article>(`
    SELECT p.id, p.case_number, p.title, p.category, p.body
    FROM posts p
    WHERE p.status = 'published'
      ${categoryFilter}
      AND (
        array_length(regexp_split_to_array(regexp_replace(p.body, '<[^>]+>', ' ', 'g'), '\\s+'), 1) >= ${WORD_FLOOR}
        AND (array_length(regexp_split_to_array(p.body, '<h2'), 1) - 1) < ${H2_MINIMUM}
      )
    ORDER BY p.category, p.case_number
  `);

  console.log(`\n[Fast-Headers] ${rows.length} articles need H2 headers${arg !== "ALL" ? ` in '${arg}'` : ""}.\n`);

  if (rows.length === 0) {
    console.log("Nothing to do.");
    await pool.end();
    return;
  }

  let done = 0;
  let failed = 0;

  for (let i = 0; i < rows.length; i++) {
    const article = rows[i];
    const currentH2 = countH2(article.body);
    console.log(`  [${i + 1}/${rows.length}] ${article.case_number} [${article.category}] — h2:${currentH2}→${H2_MINIMUM}`);

    const newBody = await insertHeaders(article);

    if (newBody) {
      const finalH2 = countH2(newBody);
      await pool.query(
        `UPDATE posts SET body = $1, updated_at = now() WHERE id = $2`,
        [newBody, article.id]
      );
      console.log(`    ✓ h2:${currentH2}→${finalH2}`);
      done++;
    } else {
      console.log(`    ✗ FAILED`);
      failed++;
    }

    if (i < rows.length - 1) {
      await sleep(500);
    }
  }

  console.log(`\n[Fast-Headers] Done. Fixed: ${done} | Failed: ${failed}`);
  await pool.end();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
