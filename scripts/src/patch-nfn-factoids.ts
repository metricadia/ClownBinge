import { pool } from "@workspace/db";
import Anthropic from "@anthropic-ai/sdk";

const client = new Anthropic();

interface FactoidDef {
  anchor: string;
  title: string;
  summary: string;
}

function wrapFactoid(body: string, anchor: string, title: string, summary: string): string {
  const idx = body.indexOf(anchor);
  if (idx === -1) {
    console.warn(`  MISS: "${anchor.slice(0, 70)}"`);
    return body;
  }
  const tag = `<a class="cb-factoid" data-title="${title.replace(/"/g, "&quot;")}" data-summary="${summary.replace(/"/g, "&quot;")}">${anchor}</a>`;
  return body.slice(0, idx) + tag + body.slice(idx + anchor.length);
}

async function generateFactoids(caseNumber: string, body: string, verifiedSource: string): Promise<FactoidDef[]> {
  const prompt = `You are generating factoid popup metadata for a journalism platform article.

ARTICLE CASE: ${caseNumber}
VERIFIED SOURCES: ${verifiedSource}

ARTICLE BODY (HTML):
${body.slice(0, 6000)}

---

Your task: identify exactly 4 places in the body where a specific source, author, researcher, institution, legislation, or study is cited or named. For each, generate a factoid popup definition.

STRICT RULES:
1. "anchor" MUST be a verbatim substring that exists in the article body HTML above. Copy it character-for-character.
2. Anchor should be 3-15 words — a specific name, author citation, legislation name, or study reference.
3. Each anchor must be UNIQUE (no duplicates).
4. "title" = short identifier for the source, max 80 chars.
5. "summary" = 2-3 factual sentences explaining what this source is and why it is authoritative. Max 350 chars. No editorializing. No "This source" opener.
6. Prefer anchors that are author names with years (e.g. "Timothy Pauketat"), legislation names, institution names, or specific study/report names.
7. Do NOT anchor generic phrases like "researchers have found" or "studies show".

Return ONLY a JSON array. No markdown. No explanation. Example format:
[
  {
    "anchor": "Timothy Pauketat",
    "title": "Pauketat (2009) -- Cahokia: Ancient America's Great City on the Mississippi",
    "summary": "Archaeologist Timothy Pauketat of the University of Illinois is the leading scholarly authority on Cahokia. His 2009 monograph synthesizes three decades of excavation data documenting population estimates, trade networks, and political organization."
  }
]`;

  const message = await client.messages.create({
    model: "claude-haiku-4-5",
    max_tokens: 1200,
    messages: [{ role: "user", content: prompt }],
  });

  const content = message.content[0];
  if (content.type !== "text") return [];

  try {
    const raw = content.text.trim();
    const jsonStr = raw.startsWith("[") ? raw : raw.slice(raw.indexOf("["), raw.lastIndexOf("]") + 1);
    const defs = JSON.parse(jsonStr) as FactoidDef[];
    return Array.isArray(defs) ? defs : [];
  } catch (err) {
    console.error(`  JSON parse error for ${caseNumber}:`, err);
    return [];
  }
}

async function main() {
  const result = await pool.query<{
    id: number;
    case_number: string;
    body: string;
    verified_source: string;
  }>(
    `SELECT id, case_number, body, verified_source
     FROM posts
     WHERE category = 'native_and_first_nations'
       AND (body NOT LIKE '%cb-factoid%')
     ORDER BY case_number`
  );

  console.log(`Processing ${result.rows.length} articles without factoids...\n`);

  let totalApplied = 0;
  let totalMissed = 0;
  let articlesUpdated = 0;

  for (const row of result.rows) {
    const { case_number, body, verified_source } = row;
    console.log(`\n── ${case_number} ──`);

    let updatedBody = body;
    let applied = 0;

    try {
      const factoids = await generateFactoids(case_number, body, verified_source ?? "");

      if (factoids.length === 0) {
        console.log("  No factoids generated — skipping.");
        continue;
      }

      for (const f of factoids) {
        const before = updatedBody;
        updatedBody = wrapFactoid(updatedBody, f.anchor, f.title, f.summary);
        if (updatedBody !== before) {
          applied++;
          console.log(`  ✓ "${f.anchor.slice(0, 60)}"`);
        } else {
          totalMissed++;
        }
      }

      if (applied === 0) {
        console.log("  No anchors matched — skipping DB write.");
        continue;
      }

      await pool.query(
        "UPDATE posts SET body = $1 WHERE case_number = $2",
        [updatedBody, case_number]
      );

      console.log(`  → ${applied} factoid(s) applied and saved.`);
      totalApplied += applied;
      articlesUpdated++;

    } catch (err) {
      console.error(`  ERROR on ${case_number}:`, err);
    }

    // Brief pause to avoid rate limiting
    await new Promise(r => setTimeout(r, 400));
  }

  console.log(`\n════════════════════════`);
  console.log(`Articles updated: ${articlesUpdated}`);
  console.log(`Total factoids applied: ${totalApplied}`);
  console.log(`Total anchor misses: ${totalMissed}`);
  await pool.end();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
