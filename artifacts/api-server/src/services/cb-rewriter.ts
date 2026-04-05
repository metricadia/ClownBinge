import { anthropic } from "@workspace/integrations-anthropic-ai";
import { checkContentGuard } from "./content-guard";

export type DocType = "journalism" | "academic" | "undergrad";

const QUALIFIER_WORDS = [
  "approximately", "nearly", "roughly", "about", "over", "under",
  "more than", "fewer than", "less than", "mainly", "mostly",
  "largely", "primarily", "virtually", "essentially",
];

// Attribution verbs: the journalist's evidentiary link between a source and their words.
// If the original uses one of these, the rewrite must preserve it — paraphrasing
// "testified" as "said" or "stated" as "noted" changes the legal/factual register.
const ATTRIBUTION_VERBS = [
  "said", "stated", "wrote", "testified", "declared", "confirmed",
  "acknowledged", "explained", "described", "reported", "noted",
  "announced", "alleged", "claimed", "argued", "contended", "insisted",
  "maintained", "emphasized", "stressed", "asserted",
];

function containsDirectQuote(text: string): boolean {
  return /"[^"]{5,}"/.test(text) || /\u201c[^\u201d]{5,}\u201d/.test(text);
}

function containsCitationMarker(text: string): boolean {
  return /::/.test(text) || /https?:\/\//.test(text);
}

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

function extractQuotedPassages(text: string): string[] {
  const passages: string[] = [];
  // Match straight double quotes "..." and curly double quotes \u201c...\u201d
  const patterns = [
    /"([^"]{10,})"/g,
    /\u201c([^\u201d]{10,})\u201d/g,
  ];
  for (const re of patterns) {
    let m: RegExpExecArray | null;
    while ((m = re.exec(text)) !== null) {
      passages.push(m[1].trim());
    }
  }
  return passages;
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

  // Quoted passages must be reproduced verbatim
  const quotedPassages = extractQuotedPassages(original);
  for (const passage of quotedPassages) {
    if (!rewritten.includes(passage)) {
      return { pass: false, reason: `quoted passage altered or removed: "${passage.slice(0, 60)}..."` };
    }
  }

  // Attribution verbs are evidentiary — "testified" ≠ "said", "alleged" ≠ "claimed".
  // If the original uses one, the rewrite must use the same one.
  for (const verb of ATTRIBUTION_VERBS) {
    const origHas = new RegExp(`\\b${verb}\\b`, "i").test(original);
    const rewHas = new RegExp(`\\b${verb}\\b`, "i").test(rewritten);
    if (origHas && !rewHas) {
      return { pass: false, reason: `attribution verb removed or substituted: "${verb}"` };
    }
  }

  const guard = checkContentGuard(rewritten);
  if (!guard.clean) {
    const phrases = guard.violations.map((v) => `"${v.phrase}"`).join(", ");
    return { pass: false, reason: `banned phrase in rewrite: ${phrases}` };
  }

  // Rule 10: no contractions, no colloquial register
  const contractionPattern = /\b(?:aren't|can't|couldn't|didn't|doesn't|don't|hadn't|hasn't|haven't|he'd|he'll|he's|here's|i'd|i'll|i'm|i've|isn't|it'd|it'll|it's|let's|mustn't|needn't|shan't|she'd|she'll|she's|shouldn't|that's|there's|they'd|they'll|they're|they've|wasn't|we'd|we'll|we're|we've|weren't|what'll|what's|who'd|who'll|who's|who've|won't|wouldn't|you'd|you'll|you're|you've)\b/i;
  const contractionMatch = rewritten.match(contractionPattern);
  if (contractionMatch) {
    return { pass: false, reason: `contraction in rewrite: "${contractionMatch[0]}"` };
  }

  // Rule 10b: colloquial register markers
  const colloquialPattern = /\b(?:supposed to|getting rich|sort of|kind of|a lot of|lots of|pretty much|ended up|figure out|turns out|wrapped up|made up of|came up with|set up to|going to have|got to|got the|had to go|taken care of)\b/i;
  const colloquialMatch = rewritten.match(colloquialPattern);
  if (colloquialMatch) {
    return { pass: false, reason: `colloquial phrase in rewrite: "${colloquialMatch[0]}"` };
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

  const quotedPassages = extractQuotedPassages(sentence);
  const quotedBlock = quotedPassages.length > 0
    ? `\nDIRECT QUOTES — these are verbatim quotations and MUST appear in your output exactly as shown, including surrounding quotation marks. Do NOT paraphrase, rephrase, or alter them in any way:\n${quotedPassages.map(p => `• "${p}"`).join("\n")}\n`
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
${protectedBlock}${quotedBlock}
HARD RULES — these will be checked and will cause rejection:
1. Every number must appear identically: "15,000" stays "15,000", "66%" stays "66%"
2. Every proper noun, person name, org name, journal name, study name, historical document name stays character-for-character identical — do not paraphrase, abbreviate, or substitute
3. All technical/scientific terms stay identical (thymoquinone, NF-kB, MRSA, etc.)
4. If input has no terminal punctuation (fragment) — output must also be a fragment
5. If input uses "not" / "never" / "no" — output must also use a negative construction
6. Every qualifier word stays identical: "approximately" ≠ "about", "mainly" ≠ "mostly", "over" ≠ "more than"
7. No em dashes. Use commas, colons, semicolons, or periods instead.
8. No hedging added: no "Sure," "Notably," "Of course," "Worth mentioning"
9. Text inside quotation marks is a direct quote — reproduce it verbatim, character-for-character, with its surrounding quotation marks. Do NOT paraphrase any part of it.
10. No contractions of any kind: "weren't" → "were not", "didn't" → "did not", "couldn't" → "could not", "it's" → "it is", "who'd" → "who had/would", etc. This is formal accountability journalism — contractions are categorically prohibited.
11. No colloquial or informal register: avoid "supposed to", "getting rich", "sort of", "kind of", "a lot of", "pretty much", "ended up", "figure out", "turns out", "got to", "had to go". Use formal equivalents at all times.

OUTPUT RULES:
- ${Math.max(wordCount - 3, 1)}–${wordCount + 5} words
- ${isFragment ? "Input is a FRAGMENT (no terminal punctuation). Output must also be a fragment." : "Input is a complete sentence. Output must end with terminal punctuation."}
- Return ONLY the rewritten sentence. No explanation. No surrounding quotes.

SENTENCE TO REWRITE:
${sentence}`;
}

const MAX_ATTEMPTS = 3;

export async function paraphraseAcademicSentence(
  sentence: string,
  docType: DocType = "journalism"
): Promise<string> {
  const trimmed = sentence.trim();
  if (!trimmed || trimmed.length < 20) return trimmed;

  // HARDLOCK — these sentence types must never be paraphrased regardless of AI flags:
  // 1. Sentences containing direct quotes — primary-source testimony is untouchable.
  // 2. Citation lines — source records cannot be altered.
  if (containsDirectQuote(trimmed) || containsCitationMarker(trimmed)) {
    console.log(`[CBRewrite][Hardlock] Sentence contains quote or citation — returning original.`);
    return trimmed;
  }

  const basePrompt = buildParaphrasePrompt(trimmed, docType);
  let lastReason: string | undefined;

  for (let attempt = 1; attempt <= MAX_ATTEMPTS; attempt++) {
    // On retries, prepend a correction addendum so the model knows what it did wrong
    let prompt = basePrompt;
    if (attempt > 1 && lastReason) {
      const correction = `\n\n⛔ YOUR PREVIOUS ATTEMPT WAS REJECTED — reason: ${lastReason}\nDo NOT repeat the same mistake. Try a completely different syntactic structure.\n`;
      prompt = basePrompt + correction;
    }

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

      lastReason = gate.reason;
      console.log(`[CBRewrite][GateFail] attempt=${attempt}/${MAX_ATTEMPTS} reason="${gate.reason}" sentence="${trimmed.slice(0, 80)}..."`);
    } catch (err) {
      console.log(`[CBRewrite][Error] attempt=${attempt}/${MAX_ATTEMPTS} err="${err instanceof Error ? err.message : String(err)}"`);
    }
  }

  console.log(`[CBRewrite][Fallback] all ${MAX_ATTEMPTS} attempts failed — returning original. Last reason: "${lastReason}". Sentence: "${trimmed.slice(0, 80)}..."`);


  return trimmed;
}
