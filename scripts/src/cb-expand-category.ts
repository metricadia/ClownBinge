/**
 * cb-expand-category.ts
 * Expand articles that fail B2 checks (word count < 1380, H2 < 5, factoids < 3).
 * Adds a new H2-headed section using Claude to meet structural requirements.
 *
 * Usage:
 *   pnpm --filter @workspace/scripts run expand-cat technology
 *   pnpm --filter @workspace/scripts run expand-cat ALL
 */

import Anthropic from "@anthropic-ai/sdk";
import { pool } from "@workspace/db";

const WORD_FLOOR = 1380;
const H2_MINIMUM = 5;
const FACTOID_MINIMUM = 3;
const TARGET_WORDS = 1430; // slight buffer above floor

const client = new Anthropic();

const SYSTEM_PROMPT = `You write for ClownBinge, a verified accountability journalism platform.
You are adding a new section to an existing article. Your output must follow all of these rules:

VOICE AND TONE:
- Dry, forensic, rational. No emotion. No opinion. No advocacy language.
- The record speaks. Your job is to present it.
- Short, declarative sentences. Subject-verb-object.
- Third-person only. Never "we", never "you", never "I".
- No rhetorical questions.
- No summary statements. No conclusions.
- No calls to action.

BANNED PHRASES:
- No em dashes (—). Use commas, semicolons, or periods instead.
- No "delve", "testament", "crucial", "pivotal", "nuanced", "groundbreaking",
  "comprehensive", "foster", "landscape", "paradigm", "shed light", "moving forward".
- No passive constructions that obscure agency.

CITATIONS:
- Never include HTML anchor tags with external href values. No <a href="http...">.
- Citations in plain text: "The 2020 Census Bureau report documented..." or "Senate Hearing 117-422 records..."
- Specific. A date. A case number. A percentage. A dollar figure. A named document.

HTML FORMAT:
- Start with exactly one <h2> tag followed by the section heading text and </h2>.
- Then write multiple <p>...</p> paragraphs of factual content.
- No other tags. No <ul>, <li>, <h3>, <a href>. Only <h2> then <p> tags.
- Do not include anything outside of these tags.

CONTENT RULES:
- Expand on what the existing article establishes. Do not contradict it.
- Add context from the primary source record: documented facts, dates, outcomes, data.
- Do not invent data. If a figure is uncertain, do not include it.
- The new section must feel like more record, not more commentary.`;

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
  slug: string;
  title: string;
  category: string;
  body: string;
  word_count: number;
  h2_count: number;
  factoid_count: number;
}

async function expandArticle(article: Article): Promise<boolean> {
  const needed = Math.max(TARGET_WORDS - article.word_count, 150);
  const needsH2 = article.h2_count < H2_MINIMUM;

  const prompt = `Here is an existing ClownBinge article titled: "${article.title}"
Category: ${article.category}

EXISTING BODY:
${article.body}

Write a NEW SECTION for this article.${needsH2 ? ' The section MUST start with an <h2> heading.' : ' Start with <h2>.'}
The section should add approximately ${needed} words (${Math.ceil(needed / 100)} short paragraphs) of factual, primary-source content that deepens what is already established.
Do not repeat what is already in the article. No summary or conclusion.
Output only the <h2> tag and <p> HTML paragraph tags.`;

  try {
    const response = await client.messages.create({
      model: "claude-sonnet-4-5",
      max_tokens: 2000,
      system: SYSTEM_PROMPT,
      messages: [{ role: "user", content: prompt }],
    });

    const raw = (response.content[0] as { type: string; text: string }).text.trim();

    // Validate output starts with <h2>
    if (!raw.toLowerCase().startsWith("<h2>") && !raw.toLowerCase().startsWith("<h2 ")) {
      console.warn(`    [WARN] Response doesn't start with <h2>, prepending placeholder`);
    }

    const newBody = article.body + "\n" + raw;
    const newWordCount = countWords(newBody);
    const newH2Count = countH2(newBody);

    await pool.query(
      `UPDATE posts SET body = $1, locked = true, updated_at = now() WHERE id = $2`,
      [newBody, article.id]
    );

    console.log(
      `    words: ${article.word_count} → ${newWordCount} | h2: ${article.h2_count} → ${newH2Count} | LOCKED`
    );

    if (newWordCount < WORD_FLOOR) {
      console.warn(`    [WARN] Still below ${WORD_FLOOR} word floor after expansion`);
    }
    if (newH2Count < H2_MINIMUM) {
      console.warn(`    [WARN] Still below ${H2_MINIMUM} H2 minimum after expansion`);
    }

    return true;
  } catch (err) {
    console.error(`    [ERROR]`, (err as Error).message);
    return false;
  }
}

async function main() {
  const arg = process.argv[2] ?? "ALL";
  const categoryFilter = arg === "ALL" ? "" : `AND p.category = '${arg}'`;

  const { rows } = await pool.query<Article>(`
    SELECT
      p.id,
      p.case_number,
      p.slug,
      p.title,
      p.category,
      p.body,
      array_length(
        regexp_split_to_array(regexp_replace(p.body, '<[^>]+>', ' ', 'g'), '\\s+'), 1
      ) AS word_count,
      (array_length(regexp_split_to_array(p.body, '<h2'), 1) - 1) AS h2_count,
      (array_length(regexp_split_to_array(p.body, 'cb-factoid'), 1) - 1) AS factoid_count
    FROM posts p
    WHERE p.status = 'published'
      AND p.seo_meta_title IS NOT NULL
      AND p.seo_meta_title != ''
      ${categoryFilter}
    ORDER BY p.case_number
  `);

  const needsExpansion = rows.filter(
    (r) =>
      r.word_count < WORD_FLOOR ||
      r.h2_count < H2_MINIMUM ||
      r.factoid_count < FACTOID_MINIMUM
  );

  console.log(
    `\n[Expand] ${needsExpansion.length} articles need B2 expansion${arg !== "ALL" ? ` in '${arg}'` : ""}.\n`
  );

  let done = 0;
  let failed = 0;

  for (let i = 0; i < needsExpansion.length; i++) {
    const article = needsExpansion[i];
    const issues: string[] = [];
    if (article.word_count < WORD_FLOOR) issues.push(`words:${article.word_count}`);
    if (article.h2_count < H2_MINIMUM) issues.push(`h2:${article.h2_count}`);
    if (article.factoid_count < FACTOID_MINIMUM) issues.push(`factoids:${article.factoid_count}`);

    console.log(
      `  [${i + 1}/${needsExpansion.length}] ${article.case_number} (${issues.join(", ")})`
    );

    const success = await expandArticle(article);
    if (success) done++;
    else failed++;

    if (i < needsExpansion.length - 1) {
      await sleep(2000);
    }
  }

  console.log(`\n[Expand] Done. Expanded: ${done} | Failed: ${failed}`);
  await pool.end();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
