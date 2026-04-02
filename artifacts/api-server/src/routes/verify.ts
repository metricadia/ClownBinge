import { Router } from "express";
import { anthropic } from "@workspace/integrations-anthropic-ai";

const router = Router();

const GUARDIAN_API_KEY = process.env.GUARDIAN_API_KEY ?? "39d21f15-929a-4fe5-ae75-2db74a7c0726";
const FEC_API_KEY = process.env.FEC_API_KEY ?? "DEMO_KEY";
const CONGRESS_API_KEY = process.env.CONGRESS_API_KEY ?? "DEMO_KEY";

// ── Axis 1: US/Global News (GDELT) ────────────────────────────────────────────

interface GDELTArticle {
  title: string;
  url: string;
  domain: string;
  seendate: string;
  sourcecountry?: string;
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

// ── Axis 2: Western European Press (The Guardian) ─────────────────────────────

interface GuardianArticle {
  webTitle: string;
  webUrl: string;
  webPublicationDate: string;
  fields?: { trailText?: string };
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

// ── Axis 3: Biomedical/Scientific Record (PubMed/NCBI) ───────────────────────

interface PubMedArticle {
  uid: string;
  title: string;
  source: string;
  pubdate: string;
  authors: string;
}

async function searchPubMed(query: string): Promise<PubMedArticle[]> {
  try {
    const searchUrl =
      `https://eutils.ncbi.nlm.nih.gov/entrez/eutils/esearch.fcgi` +
      `?db=pubmed&term=${encodeURIComponent(query)}&retmax=5&retmode=json`;
    const searchRes = await fetch(searchUrl, { signal: AbortSignal.timeout(8000) });
    if (!searchRes.ok) return [];
    const searchData = (await searchRes.json()) as {
      esearchresult?: { idlist?: string[] };
    };
    const ids = searchData.esearchresult?.idlist ?? [];
    if (ids.length === 0) return [];

    const summaryUrl =
      `https://eutils.ncbi.nlm.nih.gov/entrez/eutils/esummary.fcgi` +
      `?db=pubmed&id=${ids.join(",")}&retmode=json`;
    const summaryRes = await fetch(summaryUrl, { signal: AbortSignal.timeout(8000) });
    if (!summaryRes.ok) return [];
    const summaryData = (await summaryRes.json()) as {
      result?: { uids?: string[]; [key: string]: unknown };
    };
    const uids = summaryData.result?.uids ?? [];

    return uids
      .slice(0, 5)
      .map((uid) => {
        const rec = summaryData.result?.[uid] as {
          title?: string;
          source?: string;
          pubdate?: string;
          authors?: Array<{ name: string }>;
        } | undefined;
        return {
          uid,
          title: rec?.title ?? "",
          source: rec?.source ?? "PubMed",
          pubdate: rec?.pubdate ?? "",
          authors: (rec?.authors ?? [])
            .slice(0, 3)
            .map((a) => a.name)
            .join(", "),
        };
      })
      .filter((a) => a.title.length > 0);
  } catch {
    return [];
  }
}

// ── Axis 4: Federal Campaign Finance (FEC) ────────────────────────────────────

interface FECResult {
  name: string;
  office: string;
  party: string;
  state: string;
  election_years: number[];
}

async function searchFEC(query: string): Promise<FECResult[]> {
  try {
    const url =
      `https://api.open.fec.gov/v1/names/candidates/` +
      `?q=${encodeURIComponent(query)}&api_key=${FEC_API_KEY}`;
    const res = await fetch(url, { signal: AbortSignal.timeout(8000) });
    if (!res.ok) return [];
    const data = (await res.json()) as {
      results?: Array<{
        name?: string;
        office_full?: string;
        party_full?: string;
        state?: string;
        election_years?: number[];
      }>;
    };
    return (data.results ?? []).slice(0, 5).map((r) => ({
      name: r.name ?? "",
      office: r.office_full ?? "",
      party: r.party_full ?? "",
      state: r.state ?? "",
      election_years: r.election_years ?? [],
    }));
  } catch {
    return [];
  }
}

// ── Axis 5: Congressional Record (Congress.gov) ───────────────────────────────

interface CongressBill {
  title: string;
  number: string;
  type: string;
  congress: number;
  latestAction?: { text?: string; actionDate?: string };
}

async function searchCongress(query: string): Promise<CongressBill[]> {
  try {
    const url =
      `https://api.congress.gov/v3/bill` +
      `?format=json&limit=5&query=${encodeURIComponent(query)}&api_key=${CONGRESS_API_KEY}`;
    const res = await fetch(url, { signal: AbortSignal.timeout(8000) });
    if (!res.ok) return [];
    const data = (await res.json()) as {
      bills?: Array<{
        title?: string;
        number?: string;
        type?: string;
        congress?: number;
        latestAction?: { text?: string; actionDate?: string };
      }>;
    };
    return (data.bills ?? []).slice(0, 5).map((b) => ({
      title: b.title ?? "",
      number: b.number ?? "",
      type: b.type ?? "",
      congress: b.congress ?? 0,
      latestAction: b.latestAction,
    }));
  } catch {
    return [];
  }
}

// ── PST Prompt Builder (5 axes) ───────────────────────────────────────────────

function buildPSTPrompt(
  query: string,
  gdelt: GDELTArticle[],
  guardian: GuardianArticle[],
  pubmed: PubMedArticle[],
  fec: FECResult[],
  congress: CongressBill[]
): string {
  const gdeltBlock =
    gdelt.length > 0
      ? gdelt
          .map(
            (a, i) =>
              `[${i + 1}] "${a.title}" — ${a.domain} (${a.sourcecountry ?? "US"}) — ${a.url}`
          )
          .join("\n")
      : "No results returned from global news index.";

  const guardianBlock =
    guardian.length > 0
      ? guardian
          .map(
            (a, i) =>
              `[${i + 1}] "${a.webTitle}" — theguardian.com — ${a.webUrl}` +
              (a.fields?.trailText ? `\nSummary: ${a.fields.trailText}` : "")
          )
          .join("\n")
      : "No results returned from Western European press.";

  const pubmedBlock =
    pubmed.length > 0
      ? pubmed
          .map(
            (a, i) =>
              `[${i + 1}] "${a.title}" — ${a.source} (${a.pubdate})` +
              (a.authors ? ` — Authors: ${a.authors}` : "") +
              ` — https://pubmed.ncbi.nlm.nih.gov/${a.uid}/`
          )
          .join("\n")
      : "No peer-reviewed research indexed on this query.";

  const fecBlock =
    fec.length > 0
      ? fec
          .map(
            (f, i) =>
              `[${i + 1}] ${f.name} — ${f.office}, ${f.state} (${f.party}) — Election years: ${f.election_years.join(", ")}`
          )
          .join("\n")
      : "No federal campaign finance records matched this query.";

  const congressBlock =
    congress.length > 0
      ? congress
          .map(
            (b, i) =>
              `[${i + 1}] ${b.type} ${b.number} (${b.congress}th Congress): "${b.title}"` +
              (b.latestAction?.text ? ` — Latest action (${b.latestAction.actionDate}): ${b.latestAction.text}` : "")
          )
          .join("\n")
      : "No congressional legislation matched this query.";

  return `You are the Primary Source Triangulation (PST) engine for ClownBinge.com, a verified accountability journalism platform.

QUERY: "${query}"

AXIS 1 — US/GLOBAL NEWS COVERAGE:
${gdeltBlock}

AXIS 2 — WESTERN EUROPEAN PRESS:
${guardianBlock}

AXIS 3 — PEER-REVIEWED SCIENTIFIC/BIOMEDICAL RECORD (PubMed/NCBI):
${pubmedBlock}

AXIS 4 — FEDERAL CAMPAIGN FINANCE RECORD (FEC):
${fecBlock}

AXIS 5 — CONGRESSIONAL LEGISLATIVE RECORD:
${congressBlock}

Based ONLY on the records provided above, produce a PST verification report as a JSON object with this exact structure:
{
  "verdict": "<one of: CONFIRMED | US_SUPPRESSED | WESTERN_COORDINATED_BLACKOUT | CONTESTED | UNVERIFIABLE>",
  "verdictExplanation": "<one sentence explaining why this verdict was reached>",
  "axis1": {
    "label": "US/Global News Record",
    "finding": "<2-3 sentences summarizing what US/global coverage shows, or note absence>",
    "sources": [{"title": "<title>", "url": "<url>", "domain": "<domain>"}]
  },
  "axis2": {
    "label": "Western European Press",
    "finding": "<2-3 sentences summarizing what Western European press shows, or note absence>",
    "sources": [{"title": "<title>", "url": "<url>", "domain": "<domain>"}]
  },
  "axis3": {
    "label": "Peer-Reviewed Scientific Record",
    "finding": "<2-3 sentences summarizing what biomedical/scientific literature shows, or note absence>",
    "sources": [{"title": "<title>", "url": "<url>", "domain": "<domain>"}]
  },
  "axis4": {
    "label": "Federal Campaign Finance Record",
    "finding": "<1-2 sentences on what FEC records show, or note no relevant records>",
    "sources": []
  },
  "axis5": {
    "label": "Congressional Legislative Record",
    "finding": "<1-2 sentences on what congressional legislation shows, or note no relevant legislation>",
    "sources": []
  },
  "whatTheRecordShows": "<a concise paragraph of what can be confirmed from the available record>",
  "whatIsNotConfirmed": "<what cannot be confirmed, is being suppressed, or is actively inaccessible — be honest>",
  "suppressionFlag": <true if US/global coverage is silent while European press has it, or if both axes are silent on a widely-discussed claim>
}

Verdict definitions:
- CONFIRMED: Multiple axes cover the topic consistently
- US_SUPPRESSED: Western European press has coverage but US/global has none or minimal
- WESTERN_COORDINATED_BLACKOUT: Both news axes have little or no coverage of a claim that appears significant
- CONTESTED: Axes present contradictory information
- UNVERIFIABLE: Insufficient information across axes to reach any conclusion

Rules:
- Cite only sources actually listed above. Never invent sources.
- Do NOT mention the names of any data platforms, APIs, or services in your findings. Refer only to axis labels.
- If an axis returns no data, report that as "no coverage indexed" — do not fabricate coverage.
- Return ONLY the JSON object. No preamble, no markdown, no explanation outside the JSON.
- Limit each axis sources array to 3 items maximum.`;
}

// ── Route ─────────────────────────────────────────────────────────────────────

router.post("/verify", async (req, res) => {
  const { query } = req.body as { query?: string };
  if (!query || typeof query !== "string" || query.trim().length < 5) {
    res.status(400).json({ error: "Query must be at least 5 characters." });
    return;
  }

  try {
    const [gdeltArticles, guardianArticles, pubmedArticles, fecResults, congressBills] =
      await Promise.all([
        searchGDELT(query.trim()),
        searchGuardian(query.trim()),
        searchPubMed(query.trim()),
        searchFEC(query.trim()),
        searchCongress(query.trim()),
      ]);

    const prompt = buildPSTPrompt(
      query.trim(),
      gdeltArticles,
      guardianArticles,
      pubmedArticles,
      fecResults,
      congressBills
    );

    const response = await anthropic.messages.create({
      model: "claude-haiku-4-5",
      max_tokens: 3000,
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
      pstAxesUsed: 5,
      ...(report as object),
    });
  } catch (err) {
    console.error("PST verify error:", err);
    res.status(500).json({ error: "Verification failed. Please try again." });
  }
});

export default router;
