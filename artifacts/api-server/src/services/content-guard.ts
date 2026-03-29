/**
 * content-guard.ts
 *
 * Hard-blocks formulaic AI phrases from ever being saved to the database.
 * Applied in the AI rewriter gate (cb-rewriter.ts) and the fixme save path.
 *
 * TWO categories:
 *   OPENER_PATTERNS — template sentences that open articles (checked against first 400 chars)
 *   BODY_PHRASES    — lazy filler phrases banned anywhere in the body
 */

export interface GuardViolation {
  phrase: string;
  category: "opener" | "body";
}

export interface GuardResult {
  clean: boolean;
  violations: GuardViolation[];
}

// ── Opener templates ──────────────────────────────────────────────────────────
// "There is a particular/certain kind/species/variety/genre of..."
const OPENER_PATTERNS: RegExp[] = [
  /there is a (particular|certain) (kind|species|variety|genre|type) of/i,
  /there is a certain theological (clarity|irony|tension|confidence)/i,
  /there is a particular (theological|institutional|historical|political)/i,
];

// ── Body-level banned phrases ─────────────────────────────────────────────────
const BODY_PHRASES: string[] = [
  "it is worth noting",
  "it's worth noting",
  "it is important to note",
  "it's important to note",
  "needless to say",
  "it goes without saying",
  "to summarize",
  "in summary",
  "in conclusion",
  "delve into",
  "dive deep into",
  "shed light on",
  "in today's world",
  "in today's society",
  "in the realm of",
  "the tapestry of",
  "as we navigate",
  "the landscape of",
  "complex and multifaceted",
  "nuanced issue",
  "it is crucial to note",
  "it is essential to note",
  "at the end of the day",
  "fascinating topic",
  "furthermore, it is",
  "moreover, it is",
  "notably,",
  "of course,",
  // Conceptual looping / back-reference phrases
  "as previously mentioned",
  "as previously noted",
  "as noted earlier",
  "as mentioned earlier",
  "as discussed earlier",
  "as stated earlier",
  "as mentioned above",
  "as noted above",
  "as stated above",
  "as we discussed",
  "as mentioned previously",
  "as discussed previously",
  "recall that",
  "as you may recall",
  "returning to",
  "as I mentioned",
  "as we have seen",
];

const BODY_PHRASE_REGEXES: RegExp[] = BODY_PHRASES.map(
  (p) => new RegExp(`\\b${p.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}\\b`, "i")
);

/**
 * Strip HTML tags for plain-text phrase matching.
 */
export function stripHtmlGuard(html: string): string {
  return html.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
}

/**
 * Check a piece of content (HTML or plain text) for banned phrases.
 * Pass `checkOpener: true` to also check the first 400 characters for opener templates.
 */
export function checkContentGuard(
  content: string,
  checkOpener = false
): GuardResult {
  const plain = stripHtmlGuard(content);
  const violations: GuardViolation[] = [];

  if (checkOpener) {
    const opening = plain.slice(0, 400);
    for (const re of OPENER_PATTERNS) {
      if (re.test(opening)) {
        violations.push({ phrase: re.source, category: "opener" });
      }
    }
  }

  for (let i = 0; i < BODY_PHRASES.length; i++) {
    if (BODY_PHRASE_REGEXES[i].test(plain)) {
      violations.push({ phrase: BODY_PHRASES[i], category: "body" });
    }
  }

  return { clean: violations.length === 0, violations };
}

/**
 * Convenience: returns true if the content is clean.
 */
export function isContentClean(content: string, checkOpener = false): boolean {
  return checkContentGuard(content, checkOpener).clean;
}

/**
 * Format violations into a human-readable list for logs / error responses.
 */
export function formatViolations(violations: GuardViolation[]): string {
  return violations
    .map((v) => `[${v.category}] "${v.phrase}"`)
    .join(", ");
}
