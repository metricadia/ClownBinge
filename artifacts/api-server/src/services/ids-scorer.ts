/**
 * Intellectual Density Score (IDS)
 *
 * Measures five orthogonal dimensions of intellectual rigor:
 *   1. Citation density     — named authors, publications, years, datasets
 *   2. Proper noun density  — institutions, legislation, treaties, cases, places
 *   3. Quantitative specificity — precise figures with context
 *   4. Vocabulary register  — domain jargon across CB's topic areas
 *   5. Epistemic precision  — sourced hedges, methodology language
 *
 * Output: 0–100. Higher = more intellectually dense.
 * Designed to correlate POSITIVELY with ZeroGPT score for legit CB content.
 */

function stripHtml(html: string): string {
  return html
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function wordCount(text: string): number {
  return text.split(/\s+/).filter(Boolean).length;
}

// ── Dimension 1: Citation Density ─────────────────────────────────────────────
// Looks for: "Author Name (YEAR)", "Author Name's [work]", quoted publication titles,
// UNAIDS/WHO/MSF/UN data attributions, APA-style references.

const CITATION_PATTERNS: RegExp[] = [
  /\b[A-Z][a-z]+(?:\s+[A-Z]\.?)?\s+[A-Z][a-z]+\s*\(\d{4}\)/g,  // Author Name (2004)
  /\b[A-Z][a-z]+(?:\s+[A-Z]\.?)?\s+[A-Z][a-z]+['']s\b/g,        // Madley's / Prucha's
  /\b(?:according to|documented by|reported by|per|as cited in)\s+[A-Z]/gi,
  /\b(?:UNAIDS|WHO|MSF|CDC|OHCHR|UNHCR|GAO|CBO|IPCC|USAID|IMF|World Bank)\b/g,
  /\b(?:data|statistics|figures|report|study|analysis|research|findings)\s+(?:from|by|in)\b/gi,
  /\b\d{4}\)\./g,                                                  // trailing "(YEAR)."
  /"[A-Z][^"]{10,60}"\s*\(\d{4}\)/g,                              // "Publication Title" (YEAR)
];

function citationDensity(text: string, words: number): number {
  let hits = 0;
  for (const pat of CITATION_PATTERNS) {
    const matches = text.match(new RegExp(pat.source, pat.flags)) ?? [];
    hits += matches.length;
  }
  return hits / (words / 1000); // hits per 1,000 words
}

// ── Dimension 2: Proper Noun Density ──────────────────────────────────────────
// Institutional names, legislation, treaties, court cases, named laws, agencies.

const INSTITUTION_PATTERNS: RegExp[] = [
  /\b(?:Congress|Senate|House|Supreme Court|Department of|Bureau of|Office of|Agency|Commission|Committee|Administration|Legislature|Parliament)\b/g,
  /\b(?:Act|Amendment|Treaty|Convention|Agreement|Resolution|Directive|Statute|Code|Charter|Protocol)\b/g,
  /\b[A-Z]{2,}\b/g,   // Acronyms: TRIPS, WTO, NATO, UNAIDS, MSF, etc.
  /\b(?:Section|Article|Clause|Title)\s+\d+\b/gi,
  /\b(?:v\.|vs\.)\s+[A-Z]/g,  // Legal case citations: Smith v. Jones
];

function properNounDensity(text: string, words: number): number {
  // Count all-caps words (acronyms) minus common ones
  const COMMON_CAPS = new Set(["I", "A", "OK", "US", "UK", "EU", "UN", "AM", "PM", "BC", "AD", "TV", "FBI", "CIA", "DNA", "HIV", "AIDS"]);
  let hits = 0;
  for (const pat of INSTITUTION_PATTERNS) {
    const matches = text.match(new RegExp(pat.source, pat.flags)) ?? [];
    // For acronym pattern, filter common ones
    if (pat.source === "\\b[A-Z]{2,}\\b") {
      hits += matches.filter(m => !COMMON_CAPS.has(m) && m.length >= 3).length;
    } else {
      hits += matches.length;
    }
  }
  return hits / (words / 1000);
}

// ── Dimension 3: Quantitative Specificity ─────────────────────────────────────
// Precise figures: percentages, dollar amounts, population counts, dates with month+year.

const QUANT_PATTERNS: RegExp[] = [
  /\b\d{1,3}(?:,\d{3})*(?:\.\d+)?\s*(?:million|billion|thousand|percent|%|acres|km|miles|deaths|people|patients|cases)\b/gi,
  /\$\s*\d[\d.,]*/g,
  /\b(?:January|February|March|April|May|June|July|August|September|October|November|December)\s+\d{1,2},?\s+\d{4}\b/gi,
  /\b\d{1,2}\/\d{1,2}\/\d{2,4}\b/g,
  /\bapproximately\s+\d[\d,.]*/gi,
  /\ban estimated\s+\d[\d,.]*/gi,
  /\broughly\s+\d[\d,.]*/gi,
  /\b\d+(?:\.\d+)?\s*(?:to|-)\s*\d+(?:\.\d+)?\s*(?:percent|%|million|billion|years|months|days)\b/gi,
];

function quantSpecificity(text: string, words: number): number {
  let hits = 0;
  for (const pat of QUANT_PATTERNS) {
    const matches = text.match(new RegExp(pat.source, pat.flags)) ?? [];
    hits += matches.length;
  }
  return hits / (words / 1000);
}

// ── Dimension 4: Vocabulary Register ──────────────────────────────────────────
// Domain jargon curated across CB's topic areas.

const DOMAIN_JARGON = new Set([
  // Legal / constitutional
  "ratification", "ratified", "ratify", "injunction", "jurisdiction", "sovereignty",
  "sovereignty", "jurisprudence", "precedent", "adjudication", "standing", "peonage",
  "compulsory", "statutory", "litigation", "plaintiff", "defendant", "appellate",
  "indictment", "subpoena", "legislative", "appropriation", "emolument", "habeas",
  "extradition", "mandamus", "certiorari", "abrogation", "promulgation", "rescission",

  // Academic / scholarly
  "dispossession", "marginalization", "contextualizes", "contextualize", "historiography",
  "epistemological", "epistemology", "hegemony", "hegemonic", "dialectical", "ideological",
  "normative", "paradigm", "discourse", "neoliberal", "neoliberalism", "praxis",
  "intersectionality", "methodology", "empirical", "qualitative", "quantitative",
  "longitudinal", "systematic", "corollary", "bifurcation", "proliferation",

  // Health / policy
  "antiretroviral", "epidemiological", "epidemiology", "morbidity", "mortality",
  "comorbidity", "pathogen", "seroprevalence", "transmission", "prophylaxis",
  "immunocompromised", "pharmaceutical", "pharmacokinetics", "contraindicated",
  "etiology", "nosocomial", "therapeutic", "bioavailability", "generic",

  // Economics / trade
  "intellectual property", "protectionism", "tariff", "subsidy", "compulsory licensing",
  "arbitrage", "monetization", "financialization", "oligopoly", "monopoly",
  "remuneration", "indemnification", "securitization", "collateralization",

  // Political / historical
  "disenfranchisement", "suppression", "propaganda", "authoritarian", "autocratic",
  "geopolitical", "colonialism", "imperialism", "annexation", "dispossession",
  "federalism", "bicameral", "promulgate", "mandate", "ratification",
  "enfranchisement", "suffrage", "insurrection", "sedition", "conscription",

  // CB-specific accountability
  "accountability", "transparency", "whistleblower", "surveillance",
  "systemic", "institutional", "documented", "corroborated", "substantiated",
  "redacted", "declassified", "expungement", "subpoena", "deposition",
]);

function vocabularyRegister(text: string, words: number): number {
  const textLower = text.toLowerCase();
  let hits = 0;
  for (const term of DOMAIN_JARGON) {
    if (textLower.includes(term)) {
      // Weight multi-word terms higher
      const weight = term.includes(" ") ? 2 : 1;
      // Count occurrences (rough)
      const count = (textLower.match(new RegExp(term.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "g")) ?? []).length;
      hits += count * weight;
    }
  }
  return hits / (words / 1000);
}

// ── Dimension 5: Epistemic Precision ──────────────────────────────────────────
// Sourced hedges, methodology signals, primary source language.

const EPISTEMIC_PATTERNS: RegExp[] = [
  /\baccording to\s+[A-Z]/g,
  /\bdocument(?:s|ed|ing)\b/gi,
  /\brecord(?:s|ed|ing)\b/gi,
  /\bsubstantiate(?:s|d)?\b/gi,
  /\bcorroborate(?:s|d)?\b/gi,
  /\bverif(?:y|ied|ies|iable)\b/gi,
  /\barchival?\b/gi,
  /\bprimary source\b/gi,
  /\bdeclassified\b/gi,
  /\bpeer.reviewed\b/gi,
  /\bpublished\s+(?:in|by)\b/gi,
  /\bdata\s+(?:shows?|indicates?|suggests?|reveals?)\b/gi,
  /\bresearch(?:ers?)?\s+(?:found|documented|identified|concluded)\b/gi,
  /\b(?:congressional|senate|house)\s+record\b/gi,
  /\bofficial\s+(?:record|document|report|data|figure)\b/gi,
  /\bgovernment\s+(?:data|document|record|report)\b/gi,
];

function epistemicPrecision(text: string, words: number): number {
  let hits = 0;
  for (const pat of EPISTEMIC_PATTERNS) {
    const matches = text.match(new RegExp(pat.source, pat.flags)) ?? [];
    hits += matches.length;
  }
  return hits / (words / 1000);
}

// ── Composite Scorer ───────────────────────────────────────────────────────────

export interface IDSResult {
  score: number; // 0–100
  breakdown: {
    citationDensity: number;
    properNounDensity: number;
    quantSpecificity: number;
    vocabularyRegister: number;
    epistemicPrecision: number;
  };
  wordCount: number;
}

// Empirically tuned weights and normalisation caps per dimension.
// These were calibrated so that a heavily-cited, jargon-dense CB article
// scores ~75–90 and a thin opinion piece scores ~10–25.
const DIM_WEIGHTS = {
  citationDensity:    0.28,
  properNounDensity:  0.20,
  quantSpecificity:   0.22,
  vocabularyRegister: 0.18,
  epistemicPrecision: 0.12,
};

// Soft-cap values (raw rate that maps to score of 100 for that dimension).
// Values above the cap are clamped to the cap before normalising.
const DIM_CAPS = {
  citationDensity:    12,   // 12 citation hits per 1k words = 100
  properNounDensity:  30,   // 30 proper-noun hits per 1k words = 100
  quantSpecificity:   18,   // 18 quant hits per 1k words = 100
  vocabularyRegister: 25,   // 25 jargon hits per 1k words = 100
  epistemicPrecision: 10,   // 10 epistemic hits per 1k words = 100
};

export function scoreIntellectualDensity(htmlBody: string): IDSResult {
  const plain = stripHtml(htmlBody);
  const words = wordCount(plain);

  if (words < 50) {
    return { score: 0, breakdown: { citationDensity: 0, properNounDensity: 0, quantSpecificity: 0, vocabularyRegister: 0, epistemicPrecision: 0 }, wordCount: words };
  }

  const raw = {
    citationDensity:    citationDensity(plain, words),
    properNounDensity:  properNounDensity(plain, words),
    quantSpecificity:   quantSpecificity(plain, words),
    vocabularyRegister: vocabularyRegister(plain, words),
    epistemicPrecision: epistemicPrecision(plain, words),
  };

  // Normalise each dimension 0–100 using its cap, then weight and sum
  let composite = 0;
  for (const dim of Object.keys(DIM_WEIGHTS) as (keyof typeof DIM_WEIGHTS)[]) {
    const normalised = Math.min(raw[dim] / DIM_CAPS[dim], 1) * 100;
    composite += normalised * DIM_WEIGHTS[dim];
  }

  return {
    score: Math.round(composite),
    breakdown: raw,
    wordCount: words,
  };
}
