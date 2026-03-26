import { anthropic } from "@workspace/integrations-anthropic-ai";

function buildCBPrompt(sentence: string): string {
  const wordCount = sentence.split(/\s+/).length;
  const isFragment = !sentence.trim().match(/[.!?]$/);

  return `You are rewriting a single sentence from a primary-source accountability journalism article to reduce AI detection. The article is built from government records, congressional transcripts, court filings, and official databases. The voice is direct, documented, and sardonic.

YOUR ONLY JOB: Make this sentence sound more human. Change sentence structure, rhythm, syntax. Nothing else.

=== ABSOLUTE PROHIBITIONS — YOU WILL BE CHECKED ===

1. QUALIFIER WORDS: Every qualifier must be CHARACTER-FOR-CHARACTER identical.
   - "approximately" stays "approximately" — NOT "about" / "roughly" / "around"
   - "nearly" stays "nearly" — NOT "almost"
   - "over" stays "over" — NOT "more than"
   - "more than" stays "more than" — NOT "over"
   - "under" stays "under" — NOT "fewer than"
   - "mainly" stays "mainly" — NOT "mostly"

2. PROPER NOUNS AND ORG NAMES: Copy every name exactly. No abbreviations, no capitalization changes.
   - Never shorten, paraphrase, or alter any organization name, person name, or case name
   - Capitalization must be identical to the original

3. FRAGMENTS STAY FRAGMENTS: If input has no period/question mark/exclamation at the end — it is a fragment. Output must also be a fragment. Do NOT turn it into a complete sentence.

4. NEGATIVE CONSTRUCTIONS STAY NEGATIVE: If original uses "not," "never," or "no" — output must also use a negative construction. Do not convert to a positive equivalent.
   - "not fringe" → must stay negative. "was mainstream" is WRONG.

5. NUMBERS: Copy every number character for character.
   - "15,000" stays "15,000" — not "fifteen thousand"
   - "66%" stays "66%"

6. NO HEDGING: Do not add "Sure," "Notably," "Of course," "It's worth noting," etc. if not in the original.

7. NO SOFTENING: Do not weaken claims. "Won't" is stronger than "doesn't." Keep the original strength.

=== WHAT YOU SHOULD CHANGE ===

- Uniform sentence length — vary it
- Passive voice — make active when it does not change meaning
- Generic transition phrases — cut them
- Overly smooth parallel lists — break the pattern
- Bureaucratic filler — cut it

=== FORMAT RULES ===
- Output must be ${Math.max(wordCount - 2, 1)}–${wordCount + 4} words
- ${isFragment ? "Input is a FRAGMENT. Output must also be a fragment (no terminal punctuation)." : "Input is a complete sentence. Output must also be a complete sentence."}
- No em dashes. Use periods, commas, colons, or semicolons instead.
- Return ONLY the rewritten sentence. No explanation. No quotes around it. Just the sentence.

=== INPUT ===
${sentence}`;
}

const QUALIFIER_WORDS = [
  "approximately", "nearly", "roughly", "about", "over", "under",
  "more than", "fewer than", "less than", "mainly", "mostly",
  "largely", "primarily", "virtually", "essentially",
];

function jsGate(original: string, rewritten: string): { pass: boolean; reason?: string } {
  if (!rewritten || rewritten.length < 5) return { pass: false, reason: "empty output" };

  const origFrag = !original.trim().match(/[.!?]["']?$/);
  const rewFrag = !rewritten.trim().match(/[.!?]["']?$/);
  if (origFrag !== rewFrag) {
    return { pass: false, reason: `fragment mismatch: orig=${origFrag} rew=${rewFrag}` };
  }

  const numRegex = /\b\d[\d,]*\.?\d*%?\b/g;
  const origNums = original.match(numRegex) ?? [];
  const rewNums = rewritten.match(numRegex) ?? [];
  for (const n of origNums) {
    if (!rewNums.includes(n)) return { pass: false, reason: `number missing: ${n}` };
  }

  for (const q of QUALIFIER_WORDS) {
    const origHas = new RegExp(`\\b${q}\\b`, "i").test(original);
    const rewHas = new RegExp(`\\b${q}\\b`, "i").test(rewritten);
    if (origHas && !rewHas) return { pass: false, reason: `qualifier removed: "${q}"` };
  }

  return { pass: true };
}

export async function rewriteSentence(sentence: string): Promise<string> {
  const trimmed = sentence.trim();
  if (!trimmed || trimmed.length < 20) return trimmed;

  const prompt = buildCBPrompt(trimmed);

  for (let attempt = 1; attempt <= 2; attempt++) {
    try {
      const response = await anthropic.messages.create({
        model: "claude-sonnet-4-5",
        max_tokens: 500,
        temperature: 0.85,
        messages: [{ role: "user", content: prompt }],
      });

      const content = response.content[0];
      if (content.type !== "text") continue;

      const rewritten = content.text.trim().replace(/^["']|["']$/g, "");
      if (!rewritten || rewritten.length < 10) continue;

      const gate = jsGate(trimmed, rewritten);
      if (gate.pass) return rewritten;

      console.log(`[CBRewrite] JS gate fail attempt ${attempt}: ${gate.reason}`);
    } catch {
      console.log(`[CBRewrite] Error on attempt ${attempt}`);
    }
  }

  return trimmed;
}
