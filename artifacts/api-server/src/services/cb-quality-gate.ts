import { anthropic } from "@workspace/integrations-anthropic-ai";

export interface SentenceDiff {
  before: string;
  after: string;
}

export interface QualityGateResult {
  approved: boolean;
  failingIndices: number[];
  reason: string;
}

export async function assessQuality(
  diffs: SentenceDiff[]
): Promise<QualityGateResult> {
  if (diffs.length === 0) {
    return { approved: true, failingIndices: [], reason: "No sentences were rewritten." };
  }

  const diffBlock = diffs
    .map((d, i) => `[${i + 1}]\nBEFORE: ${d.before}\nAFTER:  ${d.after}`)
    .join("\n\n");

  const prompt = `You are an editorial quality reviewer for ClownBinge.com, a PRIMARY SOURCE accountability journalism platform. Review these sentence rewrites against strict integrity standards.

FAIL a rewrite if it violates ANY of these rules:

1. STATISTICS AND NUMBERS — Every number, percentage, dollar amount, vote count, date, year, and census figure must be identical to the original. No rounding, no paraphrasing.

2. PROPER NOUNS — Every person's name, case name, organization name, legislation name, and location must appear exactly as in the original. No abbreviation, no substitution.

3. INSTITUTIONAL SOURCES — Every named institution, agency, court, publication, or research body must be named exactly as in the original.

4. SENTENCE FRAGMENTS AND DECLARATIVE COMPRESSION — If the original used a sentence fragment or abrupt declarative ("They did not respond." / "The record is clear."), the rewrite must preserve that compression. Do not expand fragments into full sentences.

5. NO ADDED HEDGING — The rewrite must not introduce words like "allegedly," "reportedly," "appears to," "may have," "seems," "suggests," or any qualifier not present in the original.

6. NO SOFTENING OF CLAIMS — If the original states a fact directly, the rewrite must state it equally directly. Do not reduce specificity or certainty.

7. PRIMARY SOURCE ATTRIBUTION — If the original names a specific source document, record, or primary source, the rewrite must preserve that attribution verbatim.

8. DIRECT QUOTES — Any text inside quotation marks in the original is a verbatim primary source quotation. It must appear character-for-character in the rewrite, with its surrounding quotation marks. The words inside the quotes may NOT be paraphrased, shortened, rearranged, or altered in any way. If the rewrite omits or changes any quoted text, FAIL immediately.

9. ATTRIBUTION VERBS — The specific verb used to introduce a quotation or claim carries legal and evidentiary weight. If the original uses "testified," "alleged," "declared," "confirmed," "acknowledged," "stated," "wrote," or any other attribution verb, the rewrite must use that same verb. Substituting "said" for "testified" or "noted" for "stated" is a factual error. FAIL if any attribution verb is substituted or dropped.

10. CITATION LINES — Any sentence containing "::" separators or a URL (https://...) is a primary source citation record. It must not be altered in any way. FAIL if any citation line is rewritten.

SENTENCE DIFFS TO REVIEW:
${diffBlock}

Respond with EXACTLY this format — nothing else:
APPROVED: YES or NO
FAILED_REWRITES: comma-separated rewrite numbers that failed (e.g. "3,17,42") or "none"
REASON: one sentence identifying the first violation found (or "All rewrites passed." if approved)`;

  try {
    const response = await anthropic.messages.create({
      model: "claude-sonnet-4-5",
      max_tokens: 200,
      temperature: 0,
      messages: [{ role: "user", content: prompt }],
    });

    const content = response.content[0];
    if (content.type !== "text") {
      return { approved: false, failingIndices: [], reason: "Quality gate returned non-text response." };
    }

    const text = content.text.trim();
    const approvedLine = text.match(/^APPROVED:\s*(YES|NO)/im);
    const failedLine = text.match(/^FAILED_REWRITES:\s*(.+)/im);
    const reasonLine = text.match(/^REASON:\s*(.+)/im);

    const approved = approvedLine?.[1]?.toUpperCase() === "YES";
    const reason = reasonLine?.[1]?.trim() ?? text;

    const failedRaw = failedLine?.[1]?.trim() ?? "none";
    const failingIndices: number[] = failedRaw.toLowerCase() === "none"
      ? []
      : failedRaw.split(",").map(s => parseInt(s.trim(), 10)).filter(n => !isNaN(n));

    return { approved, failingIndices, reason };
  } catch (err) {
    console.error("[QualityGate] Assessment failed:", err);
    return { approved: false, failingIndices: [], reason: "Quality gate check failed — keeping original to be safe." };
  }
}
