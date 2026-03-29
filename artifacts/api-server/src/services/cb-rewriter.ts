import { anthropic } from "@workspace/integrations-anthropic-ai";
import { checkContentGuard } from "./content-guard";

export type DocType = "journalism" | "academic" | "undergrad";

const QUALIFIER_WORDS = [
  "approximately", "nearly", "roughly", "about", "over", "under",
  "more than", "fewer than", "less than", "mainly", "mostly",
  "largely", "primarily", "virtually", "essentially",
];

function extractProtectedTerms(text: string): string[] {
  const terms = new Set<string>();

  const multiWord = text.match(/\b[A-Z][a-zA-Z\-]+(?:\s+[A-Z][a-zA-Z\-]+)+\b/g) ?? [];
  for (const t of multiWord) {
    const stripped = t.replace(/^(?:The|A|An)\s+/, "");
    if (stripped.includes(" ")) {
      terms.add(stripped);
    } else if (stripped !== t) {
    } else {
      terms.add(t);
    }
  }

  const acronyms = text.match(/\b[A-Z]{3,}\b/g) ?? [];
  for (const a of acronyms) terms.add(a);

  return [...terms];
}

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

  const protectedTerms = extractProtectedTerms(original);
  for (const term of protectedTerms) {
    if (!rewritten.includes(term)) {
      return { pass: false, reason: `protected term missing: "${term}"` };
    }
  }

  const guard = checkContentGuard(rewritten);
  if (!guard.clean) {
    const phrases = guard.violations.map((v) => `"${v.phrase}"`).join(", ");
    return { pass: false, reason: `banned phrase in rewrite: ${phrases}` };
  }

  return { pass: true };
}

function buildParaphrasePrompt(sentence: string, docType: DocType): string {
  const wordCount = sentence.split(/\s+/).length;
  const isFragment = !sentence.trim().match(/[.!?]$/);

  const docContext = {
    journalism: "accountability journalism — primary-source, sardonic, direct. Short declarative sentences. No bureaucratic smoothing.",
    academic: "academic writing — authoritative but varied. Technical terms stay exact. Sentence rhythm should vary.",
    undergrad: "undergraduate academic writing — clear, informative, varied cadence. Avoid stiff formal transitions.",
  }[docType];

  const protectedTerms = extractProtectedTerms(sentence);
  const protectedBlock = protectedTerms.length > 0
    ? `\nPROTECTED TERMS — copy these character-for-character into your output, no substitutions:\n${protectedTerms.map(t => `• "${t}"`).join("\n")}\n`
    : "";

  return `You are an expert at paraphrasing ${docContext}

Your task: Rewrite this single sentence so ZeroGPT no longer flags it as AI-generated, while keeping every fact, number, and technical term identical.

WHAT ACTUALLY CAUSES AI FLAGS — fix these:
- Uniform sentence length across a document (vary the rhythm)
- Passive voice where active is natural
- Smooth, parallel list structures (break them up)
- Generic academic transitions — these are ABSOLUTELY FORBIDDEN and will cause hard rejection:
  "It is worth noting", "It's worth noting", "It is important to note", "Needless to say",
  "It goes without saying", "To summarize", "In summary", "In conclusion", "Delve into",
  "Shed light on", "In today's world", "In the realm of", "The tapestry of",
  "As we navigate", "The landscape of", "Complex and multifaceted", "Nuanced issue",
  "Furthermore, it is", "Moreover, it is", "Notably,", "Of course,"
- Subject-verb-object uniformity — try leading with a clause, a qualifier, or the object
- Overly formal register that never relaxes
- Hollow transitions with no informational content — ABSOLUTELY FORBIDDEN:
  "With that in mind,", "With this in mind,", "Having said that,", "That being said,", "That said,",
  "Having established", "Building on this,", "In light of this,", "Moving forward,", "Going forward,",
  "All things considered,", "By the same token,", "Suffice it to say,", "For all intents and purposes,"
- Passive or impersonal scholarly hedges — ABSOLUTELY FORBIDDEN:
  "It has been argued", "It has been suggested", "It has been noted", "It is believed",
  "It is clear that", "It is evident that", "It is obvious that", "It cannot be denied",
  "There is no denying", "It bears noting", "It bears mentioning", "The fact of the matter is",
  "One must", "One might argue", "One could argue", "May perhaps", "Might possibly", "Could potentially"
- Faux profundity closers — ABSOLUTELY FORBIDDEN:
  "History will judge", "Time will tell", "Only time will tell"
- Meta-document references — ABSOLUTELY FORBIDDEN:
  "In this article", "In this piece", "In this section", "In this chapter", "The reader"
- Back-reference phrases that signal conceptual looping — ABSOLUTELY FORBIDDEN:
  "As previously mentioned", "As noted earlier", "As mentioned earlier", "As discussed earlier",
  "As stated earlier", "As mentioned above", "As noted above", "As stated above",
  "As we discussed", "As mentioned previously", "Recall that", "As you may recall",
  "As I mentioned", "As we have seen", "Returning to"
${protectedBlock}
HARD RULES — these will be checked and will cause rejection:
1. Every number must appear identically: "15,000" stays "15,000", "66%" stays "66%"
2. Every proper noun, person name, org name, journal name, study name, historical document name stays character-for-character identical — do not paraphrase, abbreviate, or substitute
3. All technical/scientific terms stay identical (thymoquinone, NF-kB, MRSA, etc.)
4. If input has no terminal punctuation (fragment) — output must also be a fragment
5. If input uses "not" / "never" / "no" — output must also use a negative construction
6. Every qualifier word stays identical: "approximately" ≠ "about", "mainly" ≠ "mostly", "over" ≠ "more than"
7. No em dashes. Use commas, colons, semicolons, or periods instead.
8. No hedging added: no "Sure," "Notably," "Of course," "Worth mentioning"

OUTPUT RULES:
- ${Math.max(wordCount - 3, 1)}–${wordCount + 5} words
- ${isFragment ? "Input is a FRAGMENT (no terminal punctuation). Output must also be a fragment." : "Input is a complete sentence. Output must end with terminal punctuation."}
- Return ONLY the rewritten sentence. No explanation. No surrounding quotes.

SENTENCE TO REWRITE:
${sentence}`;
}

export async function paraphraseAcademicSentence(
  sentence: string,
  docType: DocType = "journalism"
): Promise<string> {
  const trimmed = sentence.trim();
  if (!trimmed || trimmed.length < 20) return trimmed;

  const prompt = buildParaphrasePrompt(trimmed, docType);

  for (let attempt = 1; attempt <= 2; attempt++) {
    try {
      const response = await anthropic.messages.create({
        model: "claude-sonnet-4-5",
        max_tokens: 500,
        temperature: 0.9,
        messages: [{ role: "user", content: prompt }],
      });

      const content = response.content[0];
      if (content.type !== "text") continue;

      const rewritten = content.text.trim().replace(/^["']|["']$/g, "");
      if (!rewritten || rewritten.length < 10) continue;

      const gate = jsGate(trimmed, rewritten);
      if (gate.pass) return rewritten;

      if (attempt === 1) {
        console.log(`[CBRewrite] JS gate fail attempt 1: ${gate.reason} — retrying`);
      }
    } catch {
      console.log(`[CBRewrite] Error on attempt ${attempt}`);
    }
  }

  return trimmed;
}
