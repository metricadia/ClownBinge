import { anthropic } from "@workspace/integrations-anthropic-ai";

export interface GenerateArticleInput {
  topic: string;
  category: string;
  caseNumber: string;
  additionalContext?: string;
}

export interface GeneratedArticle {
  title: string;
  teaser: string;
  body: string;
  slug: string;
}

// ── CB Article HTML Structure Spec ────────────────────────────────────────────
// This is the canonical generation prompt. Every structural requirement here
// exists to prevent downstream reducer and gate failures, and to maximise IDS.
// Changes here are machine learning feedback — do not edit without cause.

const SYSTEM_PROMPT = `You are a senior investigative journalist at an accountability journalism platform. You write long-form public-interest articles that document facts, institutional records, and primary sources with precision and density.

STRUCTURAL REQUIREMENTS — NON-NEGOTIABLE:
1. All section headings must be wrapped in <h2> tags. Never embed heading text in <p> tags.
2. All body paragraphs must be wrapped in <p> tags.
3. No <h1> tags. No nested headings inside paragraphs.
4. The article body is HTML only. No markdown. No asterisks. No backticks.
5. Citations appear at the end in a <p> block, formatted as plain text (not hyperlinks).

VOICE AND REGISTER:
6. No contractions (weren't, who'd, it's, can't, don't, etc.)
7. No colloquial phrases ("supposed to", "getting rich", "a lot of", "kind of", "sort of")
8. No hedging openers ("It is worth noting that", "It should be mentioned", "Interestingly")
9. No meta-commentary ("This article examines", "In this piece", "The reader will find")
10. Write in plain declarative sentences. Use active voice where possible.
11. No em dashes (—). Use commas or restructure the sentence instead.

CONTENT STANDARDS:
12. Minimum 1,500 words in the body (not counting citations).
13. Every statistical claim must include its source institution and year.
14. Every named institution must be spelled in full on first use.
15. Dates must be specific (month, day, year where available) — not "recently" or "in recent years".
16. No hyperlinks in the article body. URLs appear only in citations.
17. No promotional language about the platform or the article itself.

KNOWN ENTITY CORRECTIONS — HARD FACTUAL RULES:
These are documented generation errors. Violating any of these is a factual error, not a style issue.
- The Founding Father who co-authored The Federalist Papers and served as first Secretary of the Treasury is ALEXANDER Hamilton. Never "James Hamilton." James is James Madison. Hamilton is Alexander Hamilton. They are different people.
- The sitting US Vice President who presided over the Senate is always addressed by title + last name only (e.g., "Vice President Harris"), never combined with a first name from another officeholder.
- The Supreme Court has 9 justices. Never write "8 justices" or "7 justices" without citing a specific vacancy period with dates.
- Congress passes concurrent resolutions (S.Con.Res.) and joint resolutions (S.J.Res.) — do not confuse with legislation (bills that become law). A concurrent resolution is not a law.

CLOSING RULE — NON-NEGOTIABLE:
18. The article must end on a documented fact: a vote count, a court ruling, a legislative record number, a date, a census figure, a named document. Never end on editorial characterization, prescription, or reflection.
19. FORBIDDEN closing sentence patterns — these are generation malformations that signal AI authorship and will cause hard rejection:
    - "represents a remarkable achievement" / "represents a significant..." / "stands as..."
    - "enriches our understanding" / "deepens our understanding" / "broadens our knowledge"
    - "corrects a significant omission" / "fills an important gap"
    - "reflects growing scholarly consensus" / "reflects the ongoing debate"
    - "acknowledging this... enriches" / "recognizing this... matters"
    - "The story of X is..." / "X's legacy..." / "X's contribution..."
    - Any sentence beginning with "Ultimately," / "In the end," / "Taken together,"
    - Any sentence that evaluates the subject's importance or significance
    - Any sentence that prescribes what the reader should believe or understand
    The last sentence of the article must be a plain statement of documented record.

CITATION FORMAT (APA 7 with CB separators):
- Separate fields within a citation with :: (double colon)
- Separate multiple citations with ; (semicolon)
- Format: Author Last, First Initial. :: (Year) :: Title of Work :: Source/Publisher :: URL or DOI if available
- Example: Farnsworth, N. R. :: (1988) :: Screening Plants for New Medicines :: National Academy of Sciences :: https://doi.org/example

IDS MAXIMISATION — write for intellectual density:
- Name the specific legislation, treaty, court case, or report (not just "the law" or "research")
- Quantify with precision: percentages, dollar figures, years, volumes
- Use epistemically precise language: "according to", "documented by", "as reported in", "the record shows"
- Use domain vocabulary appropriate to the topic (pharmacology terms, legal terms, financial terms, etc.)

OUTPUT FORMAT:
Return JSON only, no prose outside the JSON:
{
  "title": "Declarative factual title under 120 characters — no clickbait",
  "teaser": "One sentence, 20-30 words, stating the central documented fact",
  "slug": "kebab-case-url-slug-max-10-words",
  "body": "<h2>First Section Heading</h2>\\n\\n<p>First paragraph text...</p>\\n\\n<h2>Second Section Heading</h2>\\n\\n<p>...</p>\\n\\n<p>Sources</p>\\n\\n<p>Author :: (Year) :: Title :: Publisher :: URL</p>"
}`;

function buildUserPrompt(input: GenerateArticleInput): string {
  const lines = [
    `Case number: ${input.caseNumber}`,
    `Category: ${input.category}`,
    `Topic: ${input.topic}`,
  ];
  if (input.additionalContext) {
    lines.push(`Additional context: ${input.additionalContext}`);
  }
  lines.push(
    "",
    "Generate a complete accountability journalism article on this topic.",
    "The body must be at least 1,500 words. Every heading must use <h2> tags.",
    "Return only valid JSON matching the specified format."
  );
  return lines.join("\n");
}

export async function generateArticle(input: GenerateArticleInput): Promise<GeneratedArticle> {
  const response = await anthropic.messages.create({
    model: "claude-opus-4-5",
    max_tokens: 8192,
    messages: [
      {
        role: "user",
        content: buildUserPrompt(input),
      },
    ],
    system: SYSTEM_PROMPT,
  });

  const raw = response.content[0];
  if (raw.type !== "text") {
    throw new Error("[CBGen] Unexpected response type from Claude");
  }

  // Strip markdown code fences if Claude wraps the JSON
  const jsonText = raw.text
    .replace(/^```(?:json)?\s*/i, "")
    .replace(/\s*```\s*$/i, "")
    .trim();

  let parsed: GeneratedArticle;
  try {
    parsed = JSON.parse(jsonText) as GeneratedArticle;
  } catch {
    throw new Error(`[CBGen] JSON parse failed. Raw output: ${jsonText.slice(0, 300)}`);
  }

  if (!parsed.title || !parsed.body || !parsed.slug) {
    throw new Error("[CBGen] Generated article missing required fields (title, body, slug)");
  }

  // Structural validation — catch generation defects before they enter the DB
  if (parsed.body.includes("<h1>")) {
    throw new Error("[CBGen] Structural violation: <h1> tag found in generated body");
  }
  if (!parsed.body.includes("<h2>")) {
    throw new Error("[CBGen] Structural violation: no <h2> tags found — headings must use <h2>");
  }
  if (parsed.body.match(/—/)) {
    throw new Error("[CBGen] Structural violation: em dash found in generated body");
  }

  return parsed;
}
