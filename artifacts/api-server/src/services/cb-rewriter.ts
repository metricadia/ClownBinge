import { anthropic } from "@workspace/integrations-anthropic-ai";

const CB_KILL_WORDS = [
  "particularly", "notably", "essentially", "effectively", "significantly",
  "comprehensive", "robust", "furthermore", "moreover",
  "it is important to note", "it is worth noting", "it should be noted",
  "increasingly", "this underscores", "this highlights", "this demonstrates",
  "it is clear that", "it becomes apparent", "needless to say",
  "as a result of this", "in light of this", "to this end",
].join(", ");

function buildCBPrompt(sentence: string, wordCount: number): string {
  return `You are rewriting a sentence for ClownBinge.com, an independent verified accountability journalism platform.

PLATFORM VOICE: ClownBinge is punchy and direct. We state documented facts without hedging. The register is sardonic but precise — think investigative journalism, not cable news commentary.

WHAT TRIGGERS AI DETECTION:
- Overly smooth, predictable sentence flow
- Generic transitions ("Furthermore," "Moreover," "It is important to note that")
- Perfect parallel structures with no variation
- Passive voice constructions that could be active
- Abstract filler phrases that add no concrete information

WHAT SOUNDS HUMAN IN ACCOUNTABILITY JOURNALISM:
- Short declarative sentences mixed with longer analytical ones
- Active voice: "He voted against it" not "A vote against it was cast"
- Specific names, titles, vote numbers, dollar amounts — never abstracted away
- Varied rhythm: a punchy short sentence, then one that unpacks what just happened
- Rhetorical confidence without editorial embellishment
- Natural imperfections in flow — not every sentence needs a perfect segue

KILL THESE WORDS/PHRASES: ${CB_KILL_WORDS}

CRITICAL RULES — NON-NEGOTIABLE:
1. PRESERVE ALL PROPER NOUNS EXACTLY: politician names, titles, party affiliations, agency names, case names
2. PRESERVE ALL NUMBERS EXACTLY: vote tallies, dollar amounts, dates, percentages, case numbers
3. PRESERVE ALL QUOTED TEXT EXACTLY: any content inside quotation marks must remain verbatim
4. PRESERVE APPROXIMATE WORD COUNT: original is ~${wordCount} words; output must be within ${wordCount - 3} to ${wordCount + 5} words
5. NO EM DASHES: use periods, commas, colons, or semicolons instead
6. NO HEDGING: if the record documents it, state it directly
7. NO NEW FACTS: do not add information not present in the original sentence

Original sentence (flagged as AI-generated):
"${sentence}"

Rewrite to sound like a ClownBinge journalist who has the primary source documents in front of them. Direct. Documented. Slightly sardonic.

Return ONLY the rewritten sentence. No explanation, no quotation marks around the output.`;
}

export async function rewriteSentence(sentence: string): Promise<string> {
  const trimmed = sentence.trim();
  if (!trimmed || trimmed.length < 20) return trimmed;

  const wordCount = trimmed.split(/\s+/).length;
  const prompt = buildCBPrompt(trimmed, wordCount);

  try {
    const response = await anthropic.messages.create({
      model: "claude-sonnet-4-5",
      max_tokens: 500,
      temperature: 0.85,
      messages: [{ role: "user", content: prompt }],
    });

    const content = response.content[0];
    if (content.type !== "text") return trimmed;

    const result = content.text.trim().replace(/^["']|["']$/g, "");
    if (!result || result.length < 10) return trimmed;

    return result;
  } catch {
    return trimmed;
  }
}
