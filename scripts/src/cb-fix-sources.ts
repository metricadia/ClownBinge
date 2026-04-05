/**
 * cb-fix-sources.ts
 * Reformat verified_source to use CB citation format with '::' separators.
 * For articles where verified_source has no '::' (raw text only).
 *
 * CB citation format:
 *   Author/Org :: Document Title (Year) :: Repository/Publisher
 *
 * Usage:
 *   pnpm --filter @workspace/scripts run fix-sources anti_racist_heroes
 *   pnpm --filter @workspace/scripts run fix-sources ALL
 */

import Anthropic from "@anthropic-ai/sdk";
import { pool } from "@workspace/db";

const client = new Anthropic();

function sleep(ms: number) {
  return new Promise<void>((r) => setTimeout(r, ms));
}

interface Article {
  id: number;
  case_number: string;
  title: string;
  category: string;
  verified_source: string;
}

async function reformatSource(article: Article): Promise<string | null> {
  const prompt = `You are a citation editor for ClownBinge, an accountability journalism platform.
Reformat the following raw source list into CB citation format.

CB citation format rules:
- Each source on a separate line OR separated by semicolons within the same string
- Each source: "Organization/Author :: Document Title (Year) :: Repository"
- Use "::" to separate the three parts
- Keep all factual information intact — just restructure the format
- Do NOT add or remove sources
- Do NOT add external URLs or hyperlinks
- Use the information that is already in the raw text

Article title: ${article.title}

Raw sources:
${article.verified_source}

Output ONLY the reformatted sources in CB format, nothing else.
Example output format:
National Archives :: March on Washington Planning Files (1963) :: National Archives and Records Administration; Bayard Rustin Papers :: Correspondence and Organizational Files (1963) :: Library of Congress Manuscript Division`;

  try {
    const response = await client.messages.create({
      model: "claude-haiku-4-5",
      max_tokens: 500,
      messages: [{ role: "user", content: prompt }],
    });

    const raw = (response.content[0] as { type: string; text: string }).text.trim();

    if (!raw.includes("::")) {
      console.warn(`  [WARN] ${article.case_number}: Response missing '::' — skipping`);
      return null;
    }

    return raw;
  } catch (err) {
    console.error(`  [ERROR] ${article.case_number}:`, (err as Error).message);
    return null;
  }
}

async function main() {
  const arg = process.argv[2] ?? "ALL";
  const categoryFilter =
    arg === "ALL" ? "" : `AND p.category = '${arg}'`;

  const { rows } = await pool.query<Article>(`
    SELECT p.id, p.case_number, p.title, p.category, p.verified_source
    FROM posts p
    WHERE p.status = 'published'
      AND (p.verified_source NOT LIKE '%::%' OR p.verified_source IS NULL)
      AND p.verified_source IS NOT NULL
      AND p.verified_source != ''
      ${categoryFilter}
    ORDER BY p.case_number
  `);

  console.log(
    `\n[Fix-Sources] ${rows.length} articles need verified_source reformatting${
      arg !== "ALL" ? ` in '${arg}'` : ""
    }.\n`
  );

  let done = 0;
  let failed = 0;

  for (const article of rows) {
    process.stdout.write(`  ${article.case_number} — reformatting... `);
    const reformatted = await reformatSource(article);

    if (reformatted) {
      await pool.query(
        `UPDATE posts SET verified_source = $1, updated_at = now() WHERE id = $2`,
        [reformatted, article.id]
      );
      console.log(`OK (${reformatted.length} chars)`);
      done++;
    } else {
      console.log("FAILED");
      failed++;
    }

    if (article !== rows[rows.length - 1]) {
      await sleep(800);
    }
  }

  console.log(`\n[Fix-Sources] Done. Fixed: ${done} | Failed: ${failed}`);
  await pool.end();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
