import { Router } from "express";
import { anthropic } from "@workspace/integrations-anthropic-ai";

const router = Router();

const GUARDIAN_API_KEY = process.env.GUARDIAN_API_KEY ?? "39d21f15-929a-4fe5-ae75-2db74a7c0726";

interface GDELTArticle {
  title: string;
  url: string;
  domain: string;
  seendate: string;
  sourcecountry?: string;
}

interface GuardianArticle {
  webTitle: string;
  webUrl: string;
  webPublicationDate: string;
  fields?: { trailText?: string };
}

async function searchGDELT(query: string): Promise<GDELTArticle[]> {
  try {
    const url =
      `https://api.gdeltproject.org/api/v2/doc/doc?` +
      `query=${encodeURIComponent(query)}&mode=artlist&maxrecords=10` +
      `&format=json&sourcelang=english&sort=date`;
    const res = await fetch(url, { signal: AbortSignal.timeout(8000) });
    if (!res.ok) return [];
    const data = (await res.json()) as { articles?: GDELTArticle[] };
    return (data.articles ?? []).slice(0, 8);
  } catch {
    return [];
  }
}

async function searchGuardian(query: string): Promise<GuardianArticle[]> {
  try {
    const url =
      `https://content.guardianapis.com/search?` +
      `q=${encodeURIComponent(query)}&api-key=${GUARDIAN_API_KEY}` +
      `&show-fields=trailText&page-size=6&order-by=relevance`;
    const res = await fetch(url, { signal: AbortSignal.timeout(8000) });
    if (!res.ok) return [];
    const data = (await res.json()) as {
      response?: { results?: GuardianArticle[] };
    };
    return (data.response?.results ?? []).slice(0, 5);
  } catch {
    return [];
  }
}

function buildPSTPrompt(
  query: string,
  gdelt: GDELTArticle[],
  guardian: GuardianArticle[]
): string {
  const gdeltBlock =
    gdelt.length > 0
      ? gdelt
          .map(
            (a, i) =>
              `[${i + 1}] "${a.title}" — ${a.domain} (${a.sourcecountry ?? "US"}) — ${a.url}`
          )
          .join("\n")
      : "No results returned from GDELT index.";

  const guardianBlock =
    guardian.length > 0
      ? guardian
          .map(
            (a, i) =>
              `[${i + 1}] "${a.webTitle}" — theguardian.com — ${a.webUrl}` +
              (a.fields?.trailText ? `\nSummary: ${a.fields.trailText}` : "")
          )
          .join("\n")
      : "No results returned from The Guardian.";

  return `You are the Primary Source Triangulation (PST) engine for ClownBinge.com, a verified accountability journalism platform.

QUERY: "${query}"

AXIS 1 — US/GLOBAL COVERAGE (GDELT global news index):
${gdeltBlock}

AXIS 2 — EUROPEAN PRESS (The Guardian):
${guardianBlock}

Based ONLY on the articles provided above, produce a PST verification report as a JSON object with this exact structure:
{
  "verdict": "<one of: CONFIRMED | US_SUPPRESSED | WESTERN_COORDINATED_BLACKOUT | CONTESTED | UNVERIFIABLE>",
  "verdictExplanation": "<one sentence explaining why this verdict was reached>",
  "axis1": {
    "label": "US/Global Record",
    "finding": "<2-3 sentences summarizing what US/global coverage shows, or note absence of coverage>",
    "sources": [{"title": "<title>", "url": "<url>", "domain": "<domain>"}]
  },
  "axis2": {
    "label": "Western European Press",
    "finding": "<2-3 sentences summarizing what Western European press shows, or note absence of coverage>",
    "sources": [{"title": "<title>", "url": "<url>", "domain": "<domain>"}]
  },
  "whatTheRecordShows": "<a concise paragraph of what can be confirmed from the available record>",
  "whatIsNotConfirmed": "<what cannot be confirmed, is being suppressed, or is actively inaccessible — be honest>",
  "suppressionFlag": <true if US/global coverage is silent while European press has it, or if both axes are silent on a widely-discussed claim>
}

Verdict definitions:
- CONFIRMED: Both axes cover the topic consistently
- US_SUPPRESSED: Western European press has coverage but US/global has none or minimal
- WESTERN_COORDINATED_BLACKOUT: Both axes have little or no coverage of a claim that appears significant
- CONTESTED: The two axes present contradictory information
- UNVERIFIABLE: Insufficient information across both axes to reach any conclusion

Rules:
- Cite only sources actually listed above. Never invent sources.
- Do NOT mention the names of any data platforms, APIs, or news services in your findings or explanations. Refer only to "US/global coverage" and "Western European press."
- Return ONLY the JSON object. No preamble, no markdown, no explanation outside the JSON.
- Limit axis sources arrays to 3 items maximum.`;
}

router.post("/verify", async (req, res) => {
  const { query } = req.body as { query?: string };
  if (!query || typeof query !== "string" || query.trim().length < 5) {
    res.status(400).json({ error: "Query must be at least 5 characters." });
    return;
  }

  try {
    const [gdeltArticles, guardianArticles] = await Promise.all([
      searchGDELT(query.trim()),
      searchGuardian(query.trim()),
    ]);

    const prompt = buildPSTPrompt(query.trim(), gdeltArticles, guardianArticles);

    const response = await anthropic.messages.create({
      model: "claude-haiku-4-5",
      max_tokens: 2048,
      messages: [{ role: "user", content: prompt }],
    });

    const content = response.content[0];
    if (content.type !== "text") throw new Error("Unexpected AI response type");

    let report: unknown;
    try {
      const cleaned = content.text.trim().replace(/^```json\n?/, "").replace(/\n?```$/, "");
      report = JSON.parse(cleaned);
    } catch {
      throw new Error("AI returned invalid JSON");
    }

    res.json({
      query: query.trim(),
      timestamp: new Date().toISOString(),
      pstAxesUsed: 2,
      ...(report as object),
    });
  } catch (err) {
    console.error("PST verify error:", err);
    res.status(500).json({ error: "Verification failed. Please try again." });
  }
});

export default router;
