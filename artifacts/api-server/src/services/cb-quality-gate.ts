import { anthropic } from "@workspace/integrations-anthropic-ai";

export interface SentenceDiff {
  before: string;
  after: string;
}

export interface QualityGateResult {
  approved: boolean;
  reason: string;
}

export async function assessQuality(
  diffs: SentenceDiff[]
): Promise<QualityGateResult> {
  if (diffs.length === 0) {
    return { approved: true, reason: "No sentences were rewritten." };
  }

  const diffBlock = diffs
    .map((d, i) => `[${i + 1}]\nBEFORE: ${d.before}\nAFTER:  ${d.after}`)
    .join("\n\n");

  const prompt = `You are an editorial quality reviewer for ClownBinge.com, a PRIMARY SOURCE accountability journalism platform. Review these sentence rewrites against strict integrity standards.

FAIL immediately if ANY rewrite violates ANY of these rules:

1. STATISTICS AND NUMBERS — Every number, percentage, dollar amount, vote count, date, year, and census figure must be identical to the original. No rounding, no paraphrasing.

2. PROPER NOUNS — Every person's name, case name, organization name, legislation name, and location must appear exactly as in the original. No abbreviation, no substitution.

3. INSTITUTIONAL SOURCES — Every named institution, agency, court, publication, or research body must be named exactly as in the original.

4. SENTENCE FRAGMENTS AND DECLARATIVE COMPRESSION — If the original used a sentence fragment or abrupt declarative ("They did not respond." / "The record is clear."), the rewrite must preserve that compression. Do not expand fragments into full sentences.

5. NO ADDED HEDGING — The rewrite must not introduce words like "allegedly," "reportedly," "appears to," "may have," "seems," "suggests," or any qualifier not present in the original.

6. NO SOFTENING OF CLAIMS — If the original states a fact directly, the rewrite must state it equally directly. Do not reduce specificity or certainty.

7. PRIMARY SOURCE ATTRIBUTION — If the original names a specific source document, record, or primary source, the rewrite must preserve that attribution verbatim.

SENTENCE DIFFS TO REVIEW:
${diffBlock}

Respond with EXACTLY this format — nothing else:
APPROVED: YES or NO
REASON: one sentence (if NO, name the specific rule number and rewrite number that failed)`;

  try {
    const response = await anthropic.messages.create({
      model: "claude-sonnet-4-5",
      max_tokens: 150,
      temperature: 0,
      messages: [{ role: "user", content: prompt }],
    });

    const content = response.content[0];
    if (content.type !== "text") {
      return { approved: false, reason: "Quality gate returned non-text response." };
    }

    const text = content.text.trim();
    const approvedLine = text.match(/^APPROVED:\s*(YES|NO)/im);
    const reasonLine = text.match(/^REASON:\s*(.+)/im);

    const approved = approvedLine?.[1]?.toUpperCase() === "YES";
    const reason = reasonLine?.[1]?.trim() ?? text;

    return { approved, reason };
  } catch (err) {
    console.error("[QualityGate] Assessment failed:", err);
    return { approved: false, reason: "Quality gate check failed — keeping original to be safe." };
  }
}
