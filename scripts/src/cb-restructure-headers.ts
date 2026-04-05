/**
 * cb-restructure-headers.ts
 * Add H2 section headers to article bodies that have fewer than 5.
 * For articles with enough words but no section structure.
 * Does NOT add new content — only inserts <h2> headers at natural section breaks.
 *
 * Usage:
 *   pnpm --filter @workspace/scripts run restructure-headers anti_racist_heroes
 *   pnpm --filter @workspace/scripts run restructure-headers ALL
 */

import Anthropic from "@anthropic-ai/sdk";
import { pool } from "@workspace/db";

const H2_MINIMUM = 5;
const WORD_FLOOR = 1380;
const client = new Anthropic();

function countWords(html: string): number {
  return html
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .split(" ")
    .filter(Boolean).length;
}

function countH2(html: string): number {
  return (html.match(/<h2/gi) ?? []).length;
}

function sleep(ms: number) {
  return new Promise<void>((r) => setTimeout(r, ms));
}

interface Article {
  id: number;
  case_number: string;
  title: string;
  category: string;
  body: string;
  word_count: number;
  h2_count: number;
}

async function addHeaders(article: Article): Promise<string | null> {
  const needed = H2_MINIMUM - article.h2_count;

  const prompt = `You are restructuring a ClownBinge accountability journalism article.
The article has ${article.h2_count} H2 section headers but needs at least ${H2_MINIMUM}.
Add ${needed} MORE <h2> section headers by inserting them at natural paragraph breaks in the existing content.

RULES:
- Do NOT change any factual content or words — only add <h2> tags
- Do NOT remove or alter existing text
- Each <h2> must be followed by at least 2 <p> paragraphs
- <h2> text must be plain, factual, 3-7 words, no em dashes
- Spread the new headers evenly through the article
- Return the COMPLETE ARTICLE BODY with the new headers inserted

Article title: ${article.title}

EXISTING BODY:
${article.body}

Return ONLY the complete HTML body with <h2> headers inserted. No explanatory text before or after.`;

  try {
    const response = await client.messages.create({
      model: "claude-sonnet-4-5",
      max_tokens: 4000,
      messages: [{ role: "user", content: prompt }],
    });

    const raw = (response.content[0] as { type: string; text: string }).text.trim();

    const newH2Count = countH2(raw);
    const newWordCount = countWords(raw);

    if (newH2Count < H2_MINIMUM) {
      console.warn(
        `    [WARN] ${article.case_number}: Only ${newH2Count} H2s after restructure — expected ${H2_MINIMUM}+`
      );
    }
    if (newWordCount < article.word_count - 50) {
      console.warn(
        `    [WARN] ${article.case_number}: Word count dropped from ${article.word_count} → ${newWordCount} — possible content loss`
      );
      return null;
    }

    return raw;
  } catch (err) {
    console.error(`    [ERROR] ${article.case_number}:`, (err as Error).message);
    return null;
  }
}

async function main() {
  const arg = process.argv[2] ?? "ALL";
  const categoryFilter = arg === "ALL" ? "" : `AND p.category = '${arg}'`;

  const { rows } = await pool.query<Article>(`
    SELECT
      p.id,
      p.case_number,
      p.title,
      p.category,
      p.body,
      array_length(
        regexp_split_to_array(regexp_replace(p.body, '<[^>]+>', ' ', 'g'), '\\s+'), 1
      ) AS word_count,
      (array_length(regexp_split_to_array(p.body, '<h2'), 1) - 1) AS h2_count
    FROM posts p
    WHERE p.status = 'published'
      ${categoryFilter}
    ORDER BY p.case_number
  `);

  const needsHeaders = rows.filter(
    (r) => r.h2_count < H2_MINIMUM && r.word_count >= WORD_FLOOR
  );

  console.log(
    `\n[Restructure-Headers] ${needsHeaders.length} articles need H2 headers added${
      arg !== "ALL" ? ` in '${arg}'` : ""
    } (have enough words but < ${H2_MINIMUM} H2s).\n`
  );

  if (needsHeaders.length === 0) {
    console.log("Nothing to do.");
    await pool.end();
    return;
  }

  let done = 0;
  let failed = 0;

  for (let i = 0; i < needsHeaders.length; i++) {
    const article = needsHeaders[i];
    console.log(
      `  [${i + 1}/${needsHeaders.length}] ${article.case_number} — words:${article.word_count}, h2:${article.h2_count}→${H2_MINIMUM}`
    );

    const newBody = await addHeaders(article);

    if (newBody) {
      const finalH2 = countH2(newBody);
      const finalWords = countWords(newBody);

      await pool.query(
        `UPDATE posts SET body = $1, updated_at = now() WHERE id = $2`,
        [newBody, article.id]
      );
      console.log(`    ✓ h2:${article.h2_count}→${finalH2} | words:${article.word_count}→${finalWords}`);
      done++;
    } else {
      console.log(`    ✗ FAILED`);
      failed++;
    }

    if (i < needsHeaders.length - 1) {
      await sleep(2000);
    }
  }

  console.log(`\n[Restructure-Headers] Done. Fixed: ${done} | Failed: ${failed}`);
  await pool.end();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
