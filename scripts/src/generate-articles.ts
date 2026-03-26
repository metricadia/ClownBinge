/**
 * generate-articles.ts
 *
 * Usage:
 *   cd scripts
 *   pnpm generate ../attached_assets/topics.json
 *   pnpm generate ../attached_assets/topics.json --insert   (insert directly without review)
 *   pnpm generate ../attached_assets/topics.json --dry-run  (print JSON, no files or DB writes)
 *
 * Input format (topics.json):
 * [
 *   {
 *     "name": "Pastor John Smith",
 *     "role": "Senior Pastor, First Baptist Church of Houston",
 *     "date": "2026-01-15",
 *     "source": "https://example.com/article",
 *     "sourceLabel": "Houston Chronicle",
 *     "incident": "Detailed factual description of what happened."
 *   }
 * ]
 *
 * Outputs: attached_assets/generated/<slug>.json (one per topic)
 * Then run: pnpm insert ../attached_assets/generated/<slug>.json to insert each.
 * Or use --insert flag to insert immediately.
 */

import Anthropic from "@anthropic-ai/sdk";
import { readFileSync, writeFileSync, mkdirSync, existsSync } from "fs";
import { join, resolve } from "path";
import { db, pool, postsTable } from "@workspace/db";

interface TopicBrief {
  name: string;
  role: string;
  date: string;
  source: string;
  sourceLabel: string;
  incident: string;
}

interface ArticleJSON {
  title: string;
  slug: string;
  teaser: string;
  body: string;
  category: string;
  subjectName: string;
  subjectTitle: string;
  subjectParty: string;
  verifiedSource: string;
  selfOwnScore: number;
  tags: string[];
  dateOfIncident: string;
  hasVideo?: boolean;
  videoUrl?: string;
}

const SYSTEM_PROMPT = `You are a staff writer for ClownBinge, an accountability journalism and political satire platform operated by Laughphoria Informatics. You specialize in documenting verified incidents of religious leaders betraying their stated values -- with sourced, factual reporting and dry analytical wit.

WRITING RULES:
- NEVER use em dashes (-- or the character) anywhere. Use commas, colons, or semicolons instead.
- Write exactly 10 to 13 paragraphs inside the body. Each paragraph must have 4 to 8 complete sentences. Use <p> tags.
- DO NOT fabricate any quotes, dates, vote numbers, or facts not provided in the brief. Only state what can be verified from the source provided.
- Tone is dry, factual, and occasionally sardonic -- analytical accountability journalism, not cheap mockery.
- Any reference to a law, court case, organization, news outlet, or verifiable claim MUST use a cb-factoid inline element.
- category must always be "religious".
- subjectParty should be "Republican", "Independent", "Democrat", or "None" based on the subject's known affiliation.

CB-FACTOID FORMAT (always use single quotes for HTML attributes, never double quotes inside the attribute values):
For a linkable source:
<a href='URL' class='cb-factoid' data-title='SHORT_TITLE' data-summary='2-3 sentence factual tooltip explaining what this source establishes.' target='_blank' rel='noopener noreferrer'>link text</a>

For a claim without a direct URL:
<span class='cb-factoid' data-title='TITLE' data-summary='2-3 sentence factual explanation.'>anchor text</span>

SELF-OWN SCORE GUIDE:
1 = Loose Change: minor slip, easily explained away
2 = Pocket Change: clear contradiction but low stakes
3 = Small Bills: pattern of minor hypocrisy
4 = Parking Ticket: embarrassing but survivable
5 = Speeding Ticket: meaningful public contradiction
6 = Moving Violation: significant public fallout
7 = Suspended License: major contradiction with lasting damage
8 = Totaled Vehicle: institution-level scandal
9 = Epic Fail: career-defining, congregation-splitting scandal
10 = Historic Disaster: generational-level religious hypocrisy

OUTPUT RULES:
- Return ONLY a valid JSON object. No markdown, no explanation, no code fences.
- All string values must be valid JSON (escape internal double quotes as \\").
- The body field contains the full HTML article. It must be valid -- no unclosed tags, no unescaped characters.
- The teaser is 2 to 3 plain-text sentences. No HTML.
- The slug must be all lowercase, hyphenated, no special characters, descriptive, and unique to this person and incident.

Return this exact JSON structure:
{
  "title": "...",
  "slug": "...",
  "teaser": "...",
  "body": "<p>...</p><p>...</p>...",
  "category": "religious",
  "subjectName": "...",
  "subjectTitle": "...",
  "subjectParty": "...",
  "verifiedSource": "...",
  "selfOwnScore": 7,
  "tags": ["tag1", "tag2", "tag3"],
  "dateOfIncident": "YYYY-MM-DDTHH:mm:ssZ"
}`;

function buildUserPrompt(topic: TopicBrief): string {
  return `Write a ClownBinge article for the following verified incident.

Subject: ${topic.name}
Role: ${topic.role}
Date of Incident: ${topic.date}
Primary Source: ${topic.source} (${topic.sourceLabel})
Incident Summary: ${topic.incident}

Use the primary source URL as the main cb-factoid link anchor in the article. Build the full article in the JSON format specified in your instructions. Return only valid JSON.`;
}

async function sleep(ms: number): Promise<void> {
  return new Promise((res) => setTimeout(res, ms));
}

async function callClaudeWithRetry(
  client: Anthropic,
  topic: TopicBrief,
  attempt = 1
): Promise<ArticleJSON> {
  try {
    const message = await client.messages.create({
      model: "claude-sonnet-4-6",
      max_tokens: 8192,
      system: SYSTEM_PROMPT,
      messages: [{ role: "user", content: buildUserPrompt(topic) }],
    });

    const block = message.content[0];
    if (block.type !== "text") throw new Error("Unexpected response type from Claude");

    const raw = block.text.trim();

    let parsed: ArticleJSON;
    try {
      parsed = JSON.parse(raw);
    } catch {
      const jsonMatch = raw.match(/\{[\s\S]*\}/);
      if (!jsonMatch) throw new Error("No JSON object found in Claude response");
      parsed = JSON.parse(jsonMatch[0]);
    }

    const required = ["title", "slug", "teaser", "body", "category", "subjectName", "subjectTitle", "subjectParty", "verifiedSource", "selfOwnScore", "tags", "dateOfIncident"];
    const missing = required.filter((k) => !(parsed as any)[k] && (parsed as any)[k] !== 0);
    if (missing.length > 0) throw new Error(`Claude response missing fields: ${missing.join(", ")}`);

    return parsed;
  } catch (err: any) {
    const isRateLimit = err?.status === 429 || String(err).includes("rate_limit") || String(err).includes("overloaded");
    if (isRateLimit && attempt <= 5) {
      const wait = Math.pow(2, attempt) * 5000;
      console.log(`  Rate limited. Waiting ${wait / 1000}s before retry ${attempt}/5...`);
      await sleep(wait);
      return callClaudeWithRetry(client, topic, attempt + 1);
    }
    throw err;
  }
}

async function getNextCaseNumber(): Promise<string> {
  const result = await pool.query(
    "SELECT case_number FROM posts ORDER BY case_number DESC LIMIT 1"
  );
  if (result.rows.length === 0) return "CB-000001";
  const last: string = result.rows[0].case_number;
  const match = last.match(/CB-(\d+)/);
  if (!match) return "CB-000001";
  const next = parseInt(match[1], 10) + 1;
  return `CB-${String(next).padStart(6, "0")}`;
}

async function insertArticle(article: ArticleJSON): Promise<string> {
  const existing = await db.query.postsTable.findFirst({
    where: (p, { eq }) => eq(p.slug, article.slug),
  });
  if (existing) return `SKIPPED (already exists): ${existing.caseNumber}`;

  const caseNumber = await getNextCaseNumber();
  const [inserted] = await db.insert(postsTable).values({
    caseNumber,
    title: article.title,
    slug: article.slug,
    teaser: article.teaser,
    body: article.body,
    category: article.category as any,
    subjectName: article.subjectName,
    subjectTitle: article.subjectTitle,
    subjectParty: article.subjectParty,
    verifiedSource: article.verifiedSource,
    hasVideo: article.hasVideo ?? false,
    videoUrl: article.videoUrl ?? null,
    selfOwnScore: article.selfOwnScore ?? null,
    tags: article.tags ?? [],
    status: "published",
    dateOfIncident: article.dateOfIncident,
    publishedAt: new Date(),
  }).returning();

  return `INSERTED: ${inserted.caseNumber}`;
}

async function main() {
  const args = process.argv.slice(2);
  const filePath = args.find((a) => !a.startsWith("--"));
  const doInsert = args.includes("--insert");
  const dryRun = args.includes("--dry-run");

  if (!filePath) {
    console.error("Usage: pnpm generate <topics.json> [--insert] [--dry-run]");
    console.error("Example: pnpm generate ../attached_assets/topics.json --insert");
    process.exit(1);
  }

  let topics: TopicBrief[];
  try {
    topics = JSON.parse(readFileSync(filePath, "utf8"));
  } catch {
    console.error(`Cannot read or parse: ${filePath}`);
    process.exit(1);
  }

  if (!Array.isArray(topics) || topics.length === 0) {
    console.error("Topics file must be a non-empty JSON array.");
    process.exit(1);
  }

  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    console.error("ANTHROPIC_API_KEY environment variable is not set.");
    process.exit(1);
  }

  const client = new Anthropic({ apiKey });

  const outDir = resolve(filePath, "../../attached_assets/generated");
  if (!dryRun && !existsSync(outDir)) mkdirSync(outDir, { recursive: true });

  console.log(`\nGenerating ${topics.length} article(s)...\n${"=".repeat(60)}`);

  let successCount = 0;
  let failCount = 0;

  for (let i = 0; i < topics.length; i++) {
    const topic = topics[i];
    console.log(`\n[${i + 1}/${topics.length}] ${topic.name}`);
    console.log(`  Incident: ${topic.incident.slice(0, 80)}...`);

    try {
      const article = await callClaudeWithRetry(client, topic);

      if (dryRun) {
        console.log(`  DRY RUN — would write slug: ${article.slug}`);
        console.log(`  Title: ${article.title}`);
        console.log(`  selfOwnScore: ${article.selfOwnScore}`);
        successCount++;
        continue;
      }

      const outPath = join(outDir, `${article.slug}.json`);
      writeFileSync(outPath, JSON.stringify(article, null, 2), "utf8");
      console.log(`  Saved: attached_assets/generated/${article.slug}.json`);
      console.log(`  Title: ${article.title}`);
      console.log(`  selfOwnScore: ${article.selfOwnScore}`);

      if (doInsert) {
        await insertArticle(article);
      } else {
        console.log(`  To insert: pnpm insert ../attached_assets/generated/${article.slug}.json`);
      }

      successCount++;

      if (i < topics.length - 1) {
        await sleep(2000);
      }
    } catch (err: any) {
      console.error(`  FAILED: ${err?.message ?? err}`);
      failCount++;
    }
  }

  console.log(`\n${"=".repeat(60)}`);
  console.log(`Done. ${successCount} succeeded, ${failCount} failed.`);
  if (!doInsert && !dryRun && successCount > 0) {
    console.log(`\nReview files in attached_assets/generated/ then run:`);
    console.log(`  pnpm insert ../attached_assets/generated/<slug>.json`);
  }

  await pool.end();
  process.exit(failCount > 0 ? 1 : 0);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
