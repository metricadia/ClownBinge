import { pool } from "@workspace/db";
import Anthropic from "@anthropic-ai/sdk";

const client = new Anthropic();

// Articles with violations and what they are
const VIOLATIONS: Record<string, string[]> = {
  "CB-000326": ["remarkable"],
  "CB-000332": ["remarkable", "stands as"],
  "CB-000333": ["remarkable (x4)", "stands as", "em dash in body text", "H2: contains 'Remarkable Impact'", "H2: contains 'Significance'"],
  "CB-000334": ["remarkable", "H2: contains 'Significance'"],
  "CB-000335": ["remarkable", "H2: contains 'Legacy'"],
  "CB-000337": ["remarkable", "stands as", "H2: contains 'Impact'"],
  "CB-000338": ["remarkable", "stands as"],
  "CB-000340": ["remarkable (x3)", "H2: contains 'Legacy'"],
  "CB-000341": ["remarkable (x4)", "stands as", "H2: contains 'Significance'"],
  "CB-000344": ["remarkable", "em dash in body text (advocacy—each)"],
  "CB-000345": ["remarkable", "H2: contains 'Legacy'"],
  "CB-000346": ["H2: contains 'Significance'"],
  "CB-000349": ["H2: contains 'Legacy'", "H2: contains 'Significance'"],
  "CB-000350": ["H2: contains 'Impact'", "H2: contains 'Legacy'"],
  "CB-000351": [],  // em dashes only in data-summary attributes — skip
  "CB-000353": ["H2: contains 'Legacy'", "H2: contains 'Significance'"],
  "CB-000354": ["cannot be overstated", "stands as"],
  "CB-000355": ["stands as"],
  "CB-000356": ["em dash in body text (trial — United States v.)", "H2: contains 'Legacy'"],
  "CB-000357": ["H2: contains 'Significance'"],
  "CB-000360": ["remarkable"],
  "CB-000361": ["remarkable (x3)", "H2: contains 'Legacy'"],
  "CB-000362": ["remarkable", "H2: contains 'Legacy'"],
  "CB-000364": ["remarkable"],
  "CB-000365": ["remarkable (x2)", "cannot be overstated", "stands as", "H2: contains 'Impact'"],
  "CB-000366": ["remarkable (x4)"],
  "CB-000368": ["remarkable (x4)"],
  "CB-000369": ["stands as", "H2: contains 'Legacy'"],
  "CB-000373": ["H2: contains 'Impact'"],
  "CB-000374": ["em dash in body text (multiple)", "H2: contains 'Significance'"],
  "CB-000378": ["H2: contains 'Legacy'", "H2: contains 'Impact'"],
  "CB-000381": ["remarkable"],
  "CB-000382": ["em dash in body text (15 percent — approximately)"],
  "CB-000383": ["em dash in body text", "only 2 H2 headers (needs 4-5 H2s)"],
};

const SYSTEM_PROMPT = `You are a copy editor for ClownBinge, an accountability journalism platform governed by CB Dry Rationalism editorial rules.

CB DRY RATIONALISM — FORBIDDEN ELEMENTS:
1. "remarkable" — forbidden. Replace with factual rewrite. Instead of "remarkable precision," write "precision documented at X tolerance level" or remove the adjective entirely.
2. "significant/significance/significantly" — forbidden.
3. "extraordinary" — forbidden.
4. "legacy" — forbidden as a word anywhere in visible text (including H2 headers).
5. "transformative" — forbidden.
6. "stands as" — forbidden. Delete and restructure the sentence.
7. "cannot be overstated" — forbidden. Replace with the actual documented fact the phrase was trying to convey.
8. "far beyond mere" — forbidden.
9. "profound/profoundly" — forbidden.
10. Em dashes (—) in visible article body text — forbidden. Replace with: comma, colon, semicolon, or restructure the sentence. Exception: em dashes inside HTML data-summary or data-title attributes are NOT visible body text and do NOT need to be changed.
11. H2 headers containing "Legacy", "Significance", "Impact", "Conclusion", "Remarkable" — forbidden. Replace with factual, date-anchored, or subject-specific alternatives. Examples: "Sequoyah's Syllabary After 1825" instead of "Legacy", "The Cahokia Road Network in the Archaeological Record" instead of "Significance".
12. Interpretation verbs as final word before </p>: reflects, indicates, suggests, portrays — forbidden as terminal.

CRITICAL RULES:
- Do NOT add H1 tags. Ever.
- Do NOT add new claims or facts not already in the article.
- Do NOT change factoid anchor tags: <a class="cb-factoid" ...> — leave them exactly as-is.
- Do NOT change text inside data-summary="..." or data-title="..." attributes.
- ONLY fix the listed violations. Do not rewrite passages that aren't violations.
- Return the COMPLETE corrected HTML body. No truncation. No ellipsis. Full body.
- Return ONLY the HTML. No explanation, no markdown fences.`;

async function fixArticle(caseNumber: string, body: string, violations: string[]): Promise<string> {
  if (violations.length === 0) return body;

  const prompt = `Fix the following CB Dry Rationalism violations in this article body. Return the complete corrected HTML.

CASE: ${caseNumber}
VIOLATIONS TO FIX:
${violations.map((v, i) => `${i + 1}. ${v}`).join("\n")}

ARTICLE BODY:
${body}`;

  const message = await client.messages.create({
    model: "claude-opus-4-5",
    max_tokens: 8000,
    system: SYSTEM_PROMPT,
    messages: [{ role: "user", content: prompt }],
  });

  const content = message.content[0];
  if (content.type !== "text") return body;

  let fixed = content.text.trim();
  // Strip any markdown code fences if present
  if (fixed.startsWith("```")) {
    fixed = fixed.replace(/^```[a-z]*\n?/, "").replace(/\n?```$/, "").trim();
  }
  return fixed;
}

function detectRemainingViolations(body: string): string[] {
  const issues: string[] = [];
  if (/\bremarkable\b/i.test(body)) issues.push("remarkable still present");
  if (/\bstands as\b/i.test(body)) issues.push("stands as still present");
  if (/cannot be overstated/i.test(body)) issues.push("cannot be overstated still present");
  // Only check em dashes in visible text, not inside attributes
  const bodyWithoutAttrs = body.replace(/data-[a-z]+="[^"]*"/g, '');
  if (bodyWithoutAttrs.includes("—")) issues.push("em dash still in visible text");
  if (/<h2>[^<]*(legacy|significance|impact|conclusion|remarkable)[^<]*<\/h2>/i.test(body)) issues.push("forbidden H2 header still present");
  if (/<h1/i.test(body)) issues.push("H1 found in body");
  return issues;
}

async function main() {
  const cases = Object.keys(VIOLATIONS).filter(k => VIOLATIONS[k].length > 0);
  console.log(`Fixing ${cases.length} articles with CB violations...\n`);

  let fixed = 0;
  let skipped = 0;

  for (const caseNumber of cases) {
    const violations = VIOLATIONS[caseNumber];
    console.log(`\n── ${caseNumber} (${violations.length} violation type(s)) ──`);
    violations.forEach(v => console.log(`   • ${v}`));

    const result = await pool.query<{ body: string }>(
      "SELECT body FROM posts WHERE case_number = $1",
      [caseNumber]
    );

    if (result.rows.length === 0) {
      console.log(`  NOT FOUND — skipping`);
      skipped++;
      continue;
    }

    const originalBody = result.rows[0].body ?? "";

    try {
      const correctedBody = await fixArticle(caseNumber, originalBody, violations);

      if (correctedBody.length < originalBody.length * 0.8) {
        console.log(`  REJECTED: output too short (${correctedBody.length} vs ${originalBody.length}) — skipping`);
        skipped++;
        continue;
      }

      const remaining = detectRemainingViolations(correctedBody);
      if (remaining.length > 0) {
        console.log(`  WARNING: ${remaining.join("; ")}`);
      }

      await pool.query(
        "UPDATE posts SET body = $1 WHERE case_number = $2",
        [correctedBody, caseNumber]
      );

      console.log(`  ✓ Fixed and saved (${originalBody.length} → ${correctedBody.length} chars)`);
      fixed++;
    } catch (err) {
      console.error(`  ERROR:`, err);
      skipped++;
    }

    await new Promise(r => setTimeout(r, 500));
  }

  console.log(`\n════════════════════════`);
  console.log(`Fixed: ${fixed} | Skipped: ${skipped}`);
  await pool.end();
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
