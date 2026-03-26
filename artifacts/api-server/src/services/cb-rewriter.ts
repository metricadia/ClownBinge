import { anthropic } from "@workspace/integrations-anthropic-ai";

function buildCBPrompt(sentence: string): string {
  const wordCount = sentence.split(/\s+/).length;
  const isFragment = !sentence.trim().match(/[.!?]$/);

  return `You are rewriting a single sentence from a primary-source accountability journalism article to reduce AI detection. The article is built from government records, congressional transcripts, court filings, and official databases. The voice is direct, documented, and sardonic.

YOUR ONLY JOB: Make this sentence sound more human. Change sentence structure, rhythm, syntax. Nothing else.

=== ABSOLUTE PROHIBITIONS — WILL CAUSE REJECTION ===

1. QUALIFIER WORDS: Do not change any qualifier word to a synonym.
   - "approximately" must stay "approximately" — NOT "about" / "roughly" / "around"
   - "nearly" stays "nearly" — NOT "almost"
   - "over" stays "over" — NOT "more than"
   - "under" stays "under" — NOT "fewer than"
   The qualifier word must be IDENTICAL to the original. Copy it character for character.

2. PROPER NOUNS AND ORG NAMES: Copy every name exactly as written. No abbreviations.
   - If the original says "International Holocaust Remembrance Alliance" — output must say "International Holocaust Remembrance Alliance"
   - If the original says "Jewish Voice for Peace" — output must say "Jewish Voice for Peace"
   - Never abbreviate to initials (IHRA, JVP, etc.) even if that is standard journalistic practice
   - Never shorten, paraphrase, or alter any organization name, person name, or case name

3. FRAGMENTS STAY FRAGMENTS: If the input has no period/question mark/exclamation at the end, it is a fragment. Output must also be a fragment. Do NOT turn it into a complete sentence.
   - Input: "About 15,000 members" means output must also be a fragment, not "Peak membership hit 15,000."

4. NEGATIVE CONSTRUCTIONS STAY NEGATIVE: If the original uses "not" or "never" or "no," the output must also use a negative construction. Do not convert to a positive equivalent.
   - "not fringe" must stay "not fringe" — NOT "was mainstream"
   - "not a religious text" must stay structured as a negative — NOT "is a secular document"

5. NUMBERS AND STATISTICS: Copy every number character for character.
   - "15,000" stays "15,000" — not "fifteen thousand"
   - "127 years ago" stays "127 years ago"
   - "66%" stays "66%"

=== WHAT YOU SHOULD CHANGE ===

These AI detection patterns are what you are fixing:
- Uniform sentence length — vary it
- Passive voice constructions — make active when it does not change meaning
- Generic transition phrases ("Furthermore," "Additionally," "It is worth noting") — cut them
- Abstract category nouns — concrete specifics
- Overly smooth, parallel list structures — break the pattern
- Bureaucratic filler that adds no information — cut it

=== FORMAT RULES ===
- Output must be ${Math.max(wordCount - 2, 1)}–${wordCount + 4} words
- ${isFragment ? "Input is a FRAGMENT. Output must also be a fragment (no terminal punctuation)." : "Input is a complete sentence. Output must also be a complete sentence."}
- No em dashes. Use periods, commas, colons, or semicolons instead.
- Return ONLY the rewritten sentence. No explanation. No quotes around it. Just the sentence.

=== INPUT ===
${sentence}`;
}

async function qualityGateSentence(
  original: string,
  rewritten: string
): Promise<{ pass: boolean; violations: string[] }> {
  try {
    const response = await anthropic.messages.create({
      model: "claude-sonnet-4-20250514",
      max_tokens: 400,
      temperature: 0,
      messages: [{
        role: "user",
        content: `Compare these two sentences and check for violations. Return JSON only.

ORIGINAL: ${original}
REWRITTEN: ${rewritten}

Check each rule. Return: {"pass": true/false, "violations": ["list of violations or empty array"]}

Rules:
1. Every number in original must appear identically in rewritten
2. Every proper noun and org name must appear identically — no abbreviations allowed
3. If original is a fragment (no terminal punctuation), rewritten must also be a fragment
4. Every qualifier word (approximately, nearly, roughly, about, over, under, more than, fewer than, less than) must be identical — no synonym swaps
5. If original uses a negative construction (not, never, no), rewritten must also use a negative construction
6. No hedging language added that was not in original
7. No softening of claims or reduction in specificity

Return only valid JSON. No explanation.`,
      }],
    });

    const text = response.content[0].type === "text"
      ? response.content[0].text.trim()
      : '{"pass":false,"violations":["parse error"]}';

    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) return { pass: false, violations: ["JSON parse error from gate"] };
    return JSON.parse(jsonMatch[0]);
  } catch {
    return { pass: false, violations: ["gate error"] };
  }
}

export async function rewriteSentence(sentence: string): Promise<string> {
  const trimmed = sentence.trim();
  if (!trimmed || trimmed.length < 20) return trimmed;

  const prompt = buildCBPrompt(trimmed);
  const maxRetries = 3;

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      const response = await anthropic.messages.create({
        model: "claude-sonnet-4-20250514",
        max_tokens: 500,
        temperature: 0.85,
        messages: [{ role: "user", content: prompt }],
      });

      const content = response.content[0];
      if (content.type !== "text") continue;

      const rewritten = content.text.trim().replace(/^["']|["']$/g, "");
      if (!rewritten || rewritten.length < 10) continue;

      const gate = await qualityGateSentence(trimmed, rewritten);

      if (gate.pass) {
        if (attempt > 1) console.log(`[CBRewrite] Gate PASS on attempt ${attempt}`);
        return rewritten;
      } else {
        console.log(`[CBRewrite] Gate FAIL attempt ${attempt}: ${gate.violations.join("; ")}`);
      }
    } catch {
      console.log(`[CBRewrite] Error on attempt ${attempt}`);
    }
  }

  console.log(`[CBRewrite] All ${maxRetries} attempts failed gate. Preserving original.`);
  return trimmed;
}
