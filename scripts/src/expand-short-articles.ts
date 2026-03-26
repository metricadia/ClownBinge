import { pool } from "@workspace/db";

const ARTICLES = [
  { slug: "afroman-sued-harassers-into-museum-exhibit",               currentWords: 547,  needed: 480 },
  { slug: "cnn-vanishing-act-wbd-debt-eeoc-audit",                   currentWords: 709,  needed: 320 },
  { slug: "second-amendment-racial-disparity-philando-castile",       currentWords: 855,  needed: 170 },
  { slug: "first-nations-survival-census-record-us-history",          currentWords: 873,  needed: 150 },
  { slug: "first-nations-knowledge-inventory-medicine-ecology-engineering", currentWords: 927, needed: 100 },
];

const SYSTEM_PROMPT = `You write for ClownBinge, a verified accountability journalism platform. 
You are expanding existing articles. Your output must follow all of these rules without exception:

VOICE AND TONE:
- Dry, forensic, rational. No emotion. No opinion. No advocacy language.
- The record speaks. Your job is to present it.
- Short, declarative sentences. Subject-verb-object.
- Third-person only. Never "we", never "you", never "I".
- No rhetorical questions.
- No summary statements. No conclusions. No "in conclusion". No "ultimately".
- No calls to action.

BANNED PHRASES AND CONSTRUCTIONS:
- No em dashes. Use commas, semicolons, or periods instead.
- No "delve", "testament", "crucial", "pivotal", "nuanced", "groundbreaking", "comprehensive", "foster", "landscape", "paradigm", "it is worth noting", "shed light", "moving forward", "at the end of the day", "it's important to", "one cannot ignore", "this is significant because"
- No passive constructions that obscure agency ("mistakes were made" instead name who made them)
- No generalizations without a specific number, date, or record attached

CITATIONS AND LINKS:
- Never include HTML anchor tags with external href values. No <a href="http..."> anywhere.
- Citations are referenced in plain text: "The 2020 Census Bureau report documented..." or "Senate Hearing 117-422 records..."
- Specific. A date. A case number. A percentage. A dollar figure. A named document.

HTML FORMAT:
- Output only <p> tags. No headers. No lists. No <h2>, <h3>, <ul>, <li>.
- Multiple paragraph blocks, each in its own <p>...</p>.
- Do not include anything outside of paragraph tags. No explanatory text before or after.

CONTENT RULES:
- Expand on what the existing article already establishes. Do not contradict it.
- Add context from the primary source record: specific data, additional documented facts, dates, outcomes, statistical context.
- Do not invent data. If a specific figure is uncertain, do not include it.
- The expansion should feel like more record, not more commentary.`;

function countWords(html: string): number {
  const text = html.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
  return text.split(" ").filter(Boolean).length;
}

async function callClaude(body: string, title: string, needed: number): Promise<string> {
  const prompt = `Here is an existing ClownBinge article titled: "${title}"

EXISTING BODY:
${body}

Write approximately ${needed} additional words of expansion in the exact same CB forensic voice. 
Add more primary source context, documented facts, specific data, and additional record entries that deepen what is already established.
Do not repeat what is already in the article. 
Do not write a summary or conclusion.
Output only <p> HTML paragraph tags with no other markup.`;

  const resp = await fetch(
    `${process.env.AI_INTEGRATIONS_ANTHROPIC_BASE_URL}/v1/messages`,
    {
      method: "POST",
      headers: {
        "x-api-key": process.env.AI_INTEGRATIONS_ANTHROPIC_API_KEY ?? "",
        "anthropic-version": "2023-06-01",
        "content-type": "application/json",
      },
      body: JSON.stringify({
        model: "claude-sonnet-4-6",
        max_tokens: 8192,
        system: SYSTEM_PROMPT,
        messages: [{ role: "user", content: prompt }],
      }),
    }
  );

  if (!resp.ok) {
    const err = await resp.text();
    throw new Error(`Claude API error ${resp.status}: ${err}`);
  }

  const data = (await resp.json()) as { content: { type: string; text: string }[] };
  const block = data.content.find((b) => b.type === "text");
  if (!block) throw new Error("No text block in Claude response");
  return block.text.trim();
}

async function main() {
  console.log("Fetching articles...");

  for (const article of ARTICLES) {
    console.log(`\nProcessing: ${article.slug}`);

    const res = await pool.query(
      "SELECT slug, title, body, locked FROM posts WHERE slug = $1",
      [article.slug]
    );
    if (res.rows.length === 0) {
      console.log(`  NOT FOUND — skipping`);
      continue;
    }

    const row = res.rows[0];
    const currentCount = countWords(row.body);
    console.log(`  Current word count: ${currentCount}`);

    if (currentCount >= 1000) {
      console.log(`  Already at 1000+ words — skipping`);
      continue;
    }

    // Unlock if locked
    if (row.locked) {
      await pool.query("UPDATE posts SET locked = false WHERE slug = $1", [article.slug]);
      console.log(`  Unlocked`);
    }

    try {
      const expansion = await callClaude(row.body, row.title, article.needed);
      const newBody = row.body + "\n" + expansion;
      const newCount = countWords(newBody);
      console.log(`  Expansion generated: ${expansion.length} chars, ~${newCount} total words`);

      await pool.query("UPDATE posts SET body = $1, locked = true WHERE slug = $2", [
        newBody,
        article.slug,
      ]);
      console.log(`  Updated and re-locked. Final word count: ~${newCount}`);
    } catch (err) {
      console.error(`  ERROR on ${article.slug}:`, err);
      // Re-lock regardless
      await pool.query("UPDATE posts SET locked = true WHERE slug = $1", [article.slug]);
    }

    // Pause between calls to respect rate limits
    await new Promise((r) => setTimeout(r, 2000));
  }

  await pool.end();
  console.log("\nDone.");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
