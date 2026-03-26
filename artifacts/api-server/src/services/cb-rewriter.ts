import { anthropic } from "@workspace/integrations-anthropic-ai";

const CB_KILL_WORDS = [
  "particularly", "notably", "essentially", "effectively", "significantly",
  "comprehensive", "robust", "furthermore", "moreover",
  "it is important to note", "it is worth noting", "it should be noted",
  "increasingly", "this underscores", "this highlights", "this demonstrates",
  "it is clear that", "it becomes apparent", "needless to say",
  "as a result of this", "in light of this", "to this end",
  "plays a crucial role", "plays an important role", "serves as a reminder",
  "has long been", "have long been", "a wide range of", "a variety of",
].join(", ");

function buildCBPrompt(sentence: string, wordCount: number): string {
  return `You are editing a sentence for ClownBinge.com — a PRIMARY SOURCE accountability journalism platform run by Primary Source Analytics, LLC. Tagline: "INDEPENDENT. VERIFIED. THE PRIMARY SOURCE."

WHAT THIS PLATFORM DOES:
ClownBinge publishes documented evidence journalism. Every article is built from government records, congressional transcripts, court filings, census data, USCIS records, C-SPAN footage, immigration databases, and other official primary sources. Writers are researchers reading actual documents — not reporters paraphrasing what someone said about a document.

THE HUMAN VOICE IN PRIMARY SOURCE JOURNALISM:
This is NOT conversational writing. It IS direct, documented, and slightly sardonic. The voice is a researcher who has the file open on their desk and is telling you exactly what it says. Human markers in this genre are:
- Observational asides ("The record does not explain why. It just logs that it happened.")
- The researcher's reaction to what they found ("That is the record. It does not offer an opinion.")
- Varied sentence rhythm — short declarative, then the longer implication
- Concrete specificity — not "immigration records" but "a displaced persons visa filed in November 1951"
- Editorial discipline — state the fact, then let one sentence land the punch

WHAT TRIGGERS AI DETECTION IN THIS GENRE:
- Perfectly smooth sequential fact-listing with no human texture between items
- Generic transition phrases between facts ("Furthermore," "Additionally," "It is worth noting")
- Passive constructions that distance the writer from the record ("It was documented that...")
- Parallel sentence structures of identical length (three 18-word sentences in a row)
- Abstract category nouns instead of specific named things

WHAT SOUNDS HUMAN HERE:
- Short sentence. Then a slightly longer one that draws the implication.
- Active, direct: "The record shows X" not "X was shown by the record"
- The researcher's dry observation: "They did not respond." or "The document is still public."
- Sentence length variation — punchy then expansive, not lockstep
- Named specifics over categories: "Nogales, Arizona" not "the border crossing"

KILL THESE WORDS/PHRASES: ${CB_KILL_WORDS}

NON-NEGOTIABLE RULES:
1. PRESERVE ALL PROPER NOUNS EXACTLY: names, titles, agency names, legislation names, case names, locations
2. PRESERVE ALL NUMBERS EXACTLY: vote counts, dollar amounts, dates, years, percentages, case numbers, membership counts — if the number is there, it stays
3. PRESERVE QUALIFIER WORDS EXACTLY: "approximately", "about", "roughly", "nearly", "almost", "over", "under", "more than", "fewer than", "less than" are factual precision markers — do NOT swap one for another. "approximately 15,000" must stay "approximately 15,000" not "about 15,000"
4. PRESERVE ALL QUOTED TEXT EXACTLY: any content inside quotation marks stays verbatim
5. PRESERVE APPROXIMATE WORD COUNT: original is ~${wordCount} words; stay within ${wordCount - 3} to ${wordCount + 5} words
6. FRAGMENTS STAY FRAGMENTS: if the original is an incomplete sentence or noun phrase ("about 15,000 members"), rewrite it as a fragment too — do NOT expand it into a full sentence
7. NO EM DASHES: use periods, commas, colons, or semicolons
8. NO HEDGING: if a government record documents it, state it as fact, not as possibility
9. NO NEW FACTS: never add information not present in the original sentence
10. NO SOFTENING: do not reduce specificity to make the sentence sound gentler
11. NO CLAIM INVERSION: "not fringe" means NOT fringe — do not rewrite it as "was mainstream" or any positive framing that changes the logical structure

Original sentence (flagged as AI-generated):
"${sentence}"

Rewrite this so it sounds like a ClownBinge researcher who just pulled up the source document and is telling the reader exactly what it says — dry, documented, slightly sardonic, with natural human rhythm.

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
      temperature: 0.6,
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
