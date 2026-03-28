import { detectAI } from "./zerogpt";
import { paraphraseAcademicSentence, type DocType } from "./cb-rewriter";
import { assessQuality } from "./cb-quality-gate";

export type { DocType };

export function stripHtmlForDetection(html: string): string {
  return html
    .replace(/<[^>]+>/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&nbsp;/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function shouldSkipSentence(sentence: string): boolean {
  return sentence.trim().length < 20;
}

export interface ReduceAttempt {
  attemptNumber: number;
  scoreBeforeRewrite: number;
  scoreAfterRewrite: number;
  sentencesRewritten: number;
}

export interface SentenceDiff {
  before: string;
  after: string;
}

export interface ReduceResult {
  success: boolean;
  initialScore: number;
  finalScore: number;
  attempts: ReduceAttempt[];
  cleanedBody: string;
  message: string;
  diffs: SentenceDiff[];
}

/** Count cb-factoid anchors in HTML for integrity check */
function countFactoidAnchors(html: string): number {
  return (html.match(/<a[^>]+cb-factoid[^>]*>/gi) ?? []).length;
}

/**
 * Replace the FIRST occurrence of `original` in `html`, anchored-safely.
 *
 * Strategy (per block-level element):
 * 1. Collapse all <a> tags to opaque placeholders.
 * 2. If `original` appears in the collapsed text (outside anchors), replace the
 *    first occurrence there only, then rehydrate placeholders.
 * 3. Otherwise, if `original` appears inside exactly one anchor's inner text,
 *    replace the first occurrence inside that anchor's text only, then rehydrate.
 * 4. No flex-regex cross-tag fallback — if the sentence can't be placed
 *    unambiguously, skip the block to avoid corruption.
 */
function replaceInHtml(html: string, original: string, replacement: string): string {
  if (!original || !replacement || original === replacement) return html;

  let changed = false;

  const result = html.replace(
    /(<(?:p|h[1-6]|li|blockquote)(?:\s[^>]*)?>)([\s\S]*?)(<\/(?:p|h[1-6]|li|blockquote)>)/gi,
    (match, openTag: string, content: string, closeTag: string) => {
      type Anchor = {
        placeholder: string;
        openTag: string;
        innerText: string;
        closeTag: string;
      };
      const anchors: Anchor[] = [];

      const collapsed = content.replace(
        /(<a(?:\s[^>]*)?>)([\s\S]*?)(<\/a>)/gi,
        (_full: string, aOpen: string, aText: string, aClose: string) => {
          const placeholder = `\x00LINK${anchors.length}\x00`;
          anchors.push({ placeholder, openTag: aOpen, innerText: aText, closeTag: aClose });
          return placeholder;
        }
      );

      const rehydrate = (text: string, anchorList: Anchor[]): string =>
        anchorList.reduce(
          (s, { placeholder, openTag: aOpen, innerText, closeTag: aClose }) =>
            s.split(placeholder).join(`${aOpen}${innerText}${aClose}`),
          text
        );

      // ── Path A: sentence lives outside all anchors ──────────────────────────
      if (collapsed.includes(original)) {
        // .replace(string, string) replaces the FIRST occurrence only
        const newCollapsed = collapsed.replace(original, replacement);
        changed = true;
        return `${openTag}${rehydrate(newCollapsed, anchors)}${closeTag}`;
      }

      // ── Path B: sentence lives inside one anchor's inner text ───────────────
      let anchorChanged = false;
      const newAnchors = anchors.map((anchor) => {
        if (!anchorChanged && anchor.innerText.includes(original)) {
          anchorChanged = true;
          return {
            ...anchor,
            innerText: anchor.innerText.replace(original, replacement),
          };
        }
        return anchor;
      });

      if (!anchorChanged) return match; // not found — leave block untouched

      changed = true;
      return `${openTag}${rehydrate(collapsed, newAnchors)}${closeTag}`;
    }
  );

  return changed ? result : html;
}

/**
 * Apply sentence replacements to plain text.
 * Uses first-occurrence replacement (not global split/join) to prevent
 * cascading duplication when a phrase appears in multiple positions.
 */
function applySentenceReplacements(text: string, replacements: Map<string, string>): string {
  let result = text;
  for (const [original, replacement] of replacements) {
    if (result.includes(original)) {
      // String.replace(string, string) replaces the FIRST occurrence only
      result = result.replace(original, replacement);
    }
  }
  return result;
}

async function rewriteBatch(
  sentences: string[],
  docType: DocType,
  concurrency = 20
): Promise<Map<string, string>> {
  const results = new Map<string, string>();
  const valid = sentences.filter((s) => !shouldSkipSentence(s.trim()));

  for (let i = 0; i < valid.length; i += concurrency) {
    const batch = valid.slice(i, i + concurrency);
    const settled = await Promise.allSettled(
      batch.map(async (sentence) => {
        const trimmed = sentence.trim();
        const rewritten = await paraphraseAcademicSentence(trimmed, docType);
        return { original: trimmed, rewritten };
      })
    );

    for (const result of settled) {
      if (result.status === "fulfilled") {
        const { original, rewritten } = result.value;
        if (rewritten !== original) {
          results.set(original, rewritten);
        }
      }
    }
  }

  return results;
}

export async function reduceAI(
  htmlBody: string,
  targetScore = 15,
  maxAttempts = 4,
  docType: DocType = "journalism"
): Promise<ReduceResult> {
  const plainText = stripHtmlForDetection(htmlBody);

  const { score: scan1Score, flaggedSentences: scan1Flagged } = await detectAI(plainText);

  if (scan1Score <= targetScore) {
    return {
      success: true,
      initialScore: scan1Score,
      finalScore: scan1Score,
      attempts: [],
      cleanedBody: htmlBody,
      diffs: [],
      message: `Already at target. Score: ${scan1Score}%`,
    };
  }

  console.log(`[CBReduce] Scan 1 (plain text): ${scan1Score}% — running confirmatory scan...`);

  const { score: scan2Score, flaggedSentences: scan2Flagged } = await detectAI(plainText);

  const variance = Math.abs(scan1Score - scan2Score);
  console.log(`[CBReduce] Scan 2: ${scan2Score}% — variance: ${variance} points`);

  let confirmedScore: number;

  if (variance > 20) {
    console.log(`[CBReduce] High variance. Running tiebreaker scan 3...`);
    const { score: scan3Score } = await detectAI(plainText);
    console.log(`[CBReduce] Scan 3: ${scan3Score}%`);
    confirmedScore = Math.max(scan1Score, scan2Score, scan3Score);
    console.log(`[CBReduce] Using max of three = ${confirmedScore}%`);
  } else {
    confirmedScore = Math.round((scan1Score + scan2Score) / 2);
  }

  if (confirmedScore <= targetScore) {
    return {
      success: true,
      initialScore: confirmedScore,
      finalScore: confirmedScore,
      attempts: [],
      cleanedBody: htmlBody,
      diffs: [],
      message: `Confirmed passing at ${confirmedScore}% — no reduction needed.`,
    };
  }

  const initialScore = confirmedScore;
  let currentHtml = htmlBody;
  let currentScore = confirmedScore;
  const attempts: ReduceAttempt[] = [];

  const masterReplacements = new Map<string, string>();
  let currentPlainText = plainText;

  let flaggedSentences = scan2Flagged.length > 0 ? scan2Flagged : scan1Flagged;

  if (flaggedSentences.length === 0 && confirmedScore > targetScore) {
    const fallback = currentPlainText
      .match(/[^.!?]+[.!?]+/g)
      ?.map((s) => s.trim())
      .filter((s) => s.length >= 20) ?? [];
    if (fallback.length > 0) {
      console.log(`[CBReduce] No flagged sentences from detector (score ${confirmedScore}%) — falling back to full-text rewrite of ${fallback.length} sentences`);
      flaggedSentences = fallback;
    }
  }

  const originalFactoidCount = countFactoidAnchors(htmlBody);

  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    if (flaggedSentences.length === 0) {
      console.log(`[CBReduce] Attempt ${attempt}: no flagged sentences. Stopping.`);
      break;
    }

    console.log(`[CBReduce] Attempt ${attempt}: score=${currentScore}%, flagged=${flaggedSentences.length}`);

    const newRewrites = await rewriteBatch(flaggedSentences, docType);

    for (const [original, replacement] of newRewrites) {
      masterReplacements.set(original, replacement);
    }

    // Apply only the NEW rewrites to currentPlainText (not masterReplacements from scratch)
    // to avoid cascading global replacements on already-rewritten text
    for (const [original, replacement] of newRewrites) {
      currentPlainText = currentPlainText.includes(original)
        ? currentPlainText.replace(original, replacement)
        : currentPlainText;
    }

    for (const [original, replacement] of newRewrites) {
      currentHtml = replaceInHtml(currentHtml, original, replacement);
    }

    const { score: newScore, flaggedSentences: newFlagged } = await detectAI(currentPlainText);

    attempts.push({
      attemptNumber: attempt,
      scoreBeforeRewrite: currentScore,
      scoreAfterRewrite: newScore,
      sentencesRewritten: newRewrites.size,
    });

    console.log(`[CBReduce] Attempt ${attempt} result: ${currentScore}% -> ${newScore}% (rewrote ${newRewrites.size} sentences, ${masterReplacements.size} total accumulated)`);

    flaggedSentences = newFlagged;
    currentScore = newScore;

    if (newScore <= targetScore) break;

    if (attempts.length >= 2) {
      const lastTwo = attempts.slice(-2);
      if (lastTwo[1].scoreAfterRewrite >= lastTwo[0].scoreAfterRewrite) {
        console.log("[CBReduce] Score not improving. Stopping.");
        break;
      }
    }
  }

  const allDiffs: SentenceDiff[] = [];
  for (const [before, after] of masterReplacements) {
    allDiffs.push({ before, after });
  }

  // ── HTML integrity gate ───────────────────────────────────────────────────
  const finalFactoidCount = countFactoidAnchors(currentHtml);
  if (finalFactoidCount !== originalFactoidCount) {
    console.error(
      `[CBReduce] INTEGRITY FAIL: factoid anchor count changed ${originalFactoidCount} → ${finalFactoidCount}. Discarding rewrites.`
    );
    return {
      success: false,
      initialScore,
      finalScore: initialScore,
      attempts,
      cleanedBody: htmlBody,
      diffs: [],
      message: `Integrity check failed: factoid anchor count changed (${originalFactoidCount} → ${finalFactoidCount}). Original preserved.`,
    };
  }

  // ── Editorial quality gate ────────────────────────────────────────────────
  if (allDiffs.length > 0) {
    const quality = await assessQuality(allDiffs);
    if (!quality.approved) {
      console.warn(`[CBReduce] Quality gate REJECTED rewrites: ${quality.reason}`);
      return {
        success: false,
        initialScore,
        finalScore: initialScore,
        attempts,
        cleanedBody: htmlBody,
        diffs: allDiffs,
        message: `Quality gate rejected rewrites: ${quality.reason}. Original preserved.`,
      };
    }
    console.log(`[CBReduce] Quality gate approved. Reason: ${quality.reason}`);
  }

  const success = currentScore <= targetScore;

  return {
    success,
    initialScore,
    finalScore: currentScore,
    attempts,
    cleanedBody: currentHtml,
    diffs: allDiffs,
    message: success
      ? `Reduced from ${initialScore}% to ${currentScore}% in ${attempts.length} attempt(s).`
      : `Reduced from ${initialScore}% to ${currentScore}% after ${attempts.length} attempt(s). Target of ${targetScore}% not reached.`,
  };
}
