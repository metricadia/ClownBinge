import { detectAI } from "./zerogpt";
import { paraphraseAcademicSentence, type DocType } from "./cb-rewriter";
import { assessQuality } from "./cb-quality-gate";

export type { DocType };

export function stripHtmlForDetection(html: string): string {
  return html
    // Remove heading elements entirely — headings are structural, not prose to be rewritten
    .replace(/<h[1-6][^>]*>.*?<\/h[1-6]>/gis, ". ")
    // Remove citation <p> blocks — any paragraph containing :: (APA separator) or a bare URL
    // Citations must never be rewritten; they are primary source records
    .replace(/<p[^>]*>[^<]*::[^<]*<\/p>/gi, ". ")
    .replace(/<p[^>]*>[^<]*https?:\/\/[^<]*<\/p>/gi, ". ")
    // Block-level closing tags → period + space so paragraphs become sentence boundaries
    .replace(/<\/(p|li|blockquote|div|section|tr|dt|dd)>/gi, ". ")
    // Block-level opening tags and <br> → space
    .replace(/<(p|br|li|blockquote|div|section|tr|dt|dd)[^>]*>/gi, " ")
    // Strip remaining tags
    .replace(/<[^>]+>/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&nbsp;/g, " ")
    // Collapse multiple periods/spaces that may appear at block boundaries
    .replace(/\.(\s*\.)+/g, ".")
    .replace(/\s+/g, " ")
    .trim();
}

function shouldSkipSentence(sentence: string): boolean {
  if (sentence.trim().length < 20) return true;
  // Hardlock: sentences containing direct quotes are primary-source testimony — never paraphrase
  if (/"[^"]{5,}"/.test(sentence) || /\u201c[^\u201d]{5,}\u201d/.test(sentence)) return true;
  // Hardlock: citation markers — already stripped from detection input but skip as a belt-and-suspenders guard
  if (/::/.test(sentence) || /https?:\/\//.test(sentence)) return true;
  return false;
}

export interface ReduceAttempt {
  attemptNumber: number;
  scoreBeforeRewrite: number;
  scoreAfterRewrite: number;
  sentencesRewritten: number;
  sentencesRejected: number;
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

function countFactoidAnchors(html: string): number {
  return (html.match(/<a[^>]+cb-factoid[^>]*>/gi) ?? []).length;
}

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

      if (collapsed.includes(original)) {
        const newCollapsed = collapsed.replace(original, replacement);
        changed = true;
        return `${openTag}${rehydrate(newCollapsed, anchors)}${closeTag}`;
      }

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

      if (!anchorChanged) return match;

      changed = true;
      return `${openTag}${rehydrate(collapsed, newAnchors)}${closeTag}`;
    }
  );

  return changed ? result : html;
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
  docType: DocType = "journalism",
  onSave?: (body: string, score: number) => Promise<void>
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
  const originalFactoidCount = countFactoidAnchors(htmlBody);

  let bestHtml = htmlBody;
  let bestScore = confirmedScore;
  const allSavedDiffs: SentenceDiff[] = [];
  const attempts: ReduceAttempt[] = [];

  let flaggedSentences = scan2Flagged.length > 0 ? scan2Flagged : scan1Flagged;

  if (flaggedSentences.length === 0 && confirmedScore > targetScore) {
    const fallback = plainText
      .match(/[^.!?]+[.!?]+/g)
      ?.map((s) => s.trim())
      .filter((s) => s.length >= 20) ?? [];
    if (fallback.length > 0) {
      console.log(`[CBReduce] No flagged sentences — falling back to full-text rewrite of ${fallback.length} sentences`);
      flaggedSentences = fallback;
    }
  }

  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    if (flaggedSentences.length === 0) {
      console.log(`[CBReduce] Attempt ${attempt}: no flagged sentences. Stopping.`);
      break;
    }

    console.log(`[CBReduce] Attempt ${attempt}: score=${bestScore}%, flagged=${flaggedSentences.length}`);

    const newRewrites = await rewriteBatch(flaggedSentences, docType);
    if (newRewrites.size === 0) {
      console.log(`[CBReduce] Attempt ${attempt}: no rewrites produced. Stopping.`);
      break;
    }

    // ── Surgical quality gate ─────────────────────────────────────────────────
    const diffs: SentenceDiff[] = [...newRewrites.entries()].map(([before, after]) => ({ before, after }));
    const quality = await assessQuality(diffs);

    const goodRewrites = new Map(newRewrites);
    let rejected = 0;

    if (quality.failingIndices.length > 0) {
      // Reason is batch-level from the quality gate — log it once, not per-rejection
      console.log(`[CBReduce] Quality gate reason: ${quality.reason}`);
      for (const idx of quality.failingIndices) {
        const diff = diffs[idx - 1];
        if (diff) {
          goodRewrites.delete(diff.before);
          rejected++;
          console.log(`[CBReduce] Rejected rewrite [${idx}]: "${diff.before.slice(0, 60)}..."`);
        }
      }
      console.log(`[CBReduce] Quality gate: ${rejected} rejected, ${goodRewrites.size} accepted`);
    } else {
      console.log(`[CBReduce] Quality gate: all ${goodRewrites.size} rewrites accepted`);
    }

    if (goodRewrites.size === 0) {
      console.log(`[CBReduce] Attempt ${attempt}: all rewrites rejected. Skipping.`);
      attempts.push({
        attemptNumber: attempt,
        scoreBeforeRewrite: bestScore,
        scoreAfterRewrite: bestScore,
        sentencesRewritten: 0,
        sentencesRejected: rejected,
      });
      continue;
    }

    // ── Apply good rewrites to a working copy ─────────────────────────────────
    let workingHtml = bestHtml;
    let workingText = stripHtmlForDetection(bestHtml);

    for (const [original, replacement] of goodRewrites) {
      workingHtml = replaceInHtml(workingHtml, original, replacement);
      if (workingText.includes(original)) {
        workingText = workingText.replace(original, replacement);
      }
    }

    // ── Factoid integrity check ───────────────────────────────────────────────
    const newFactoidCount = countFactoidAnchors(workingHtml);
    if (newFactoidCount !== originalFactoidCount) {
      console.error(`[CBReduce] Integrity fail attempt ${attempt}: factoid count ${originalFactoidCount} → ${newFactoidCount}. Discarding.`);
      attempts.push({
        attemptNumber: attempt,
        scoreBeforeRewrite: bestScore,
        scoreAfterRewrite: bestScore,
        sentencesRewritten: 0,
        sentencesRejected: rejected,
      });
      continue;
    }

    // ── Re-detect ─────────────────────────────────────────────────────────────
    const { score: newScore, flaggedSentences: newFlagged } = await detectAI(workingText);

    attempts.push({
      attemptNumber: attempt,
      scoreBeforeRewrite: bestScore,
      scoreAfterRewrite: newScore,
      sentencesRewritten: goodRewrites.size,
      sentencesRejected: rejected,
    });

    console.log(`[CBReduce] Attempt ${attempt}: ${bestScore}% → ${newScore}% (${goodRewrites.size} saved, ${rejected} rejected)`);

    if (newScore < bestScore) {
      // Score improved — commit this attempt
      bestHtml = workingHtml;
      bestScore = newScore;
      flaggedSentences = newFlagged;

      for (const [before, after] of goodRewrites) {
        allSavedDiffs.push({ before, after });
      }

      if (onSave) {
        await onSave(workingHtml, newScore);
        console.log(`[CBReduce] Saved to DB: ${newScore}%`);
      }

      if (newScore <= targetScore) {
        console.log(`[CBReduce] Target reached at ${newScore}%.`);
        break;
      }
    } else {
      console.log(`[CBReduce] Score didn't improve (${bestScore}% → ${newScore}%). Discarding attempt.`);
      flaggedSentences = newFlagged.length > 0 ? newFlagged : flaggedSentences;

      if (attempts.length >= 2) {
        const lastTwo = attempts.slice(-2);
        if (lastTwo[1].scoreAfterRewrite >= lastTwo[0].scoreBeforeRewrite) {
          console.log("[CBReduce] No progress trend. Stopping.");
          break;
        }
      }
    }
  }

  const success = bestScore <= targetScore;

  return {
    success,
    initialScore,
    finalScore: bestScore,
    attempts,
    cleanedBody: bestHtml,
    diffs: allSavedDiffs,
    message: bestScore < initialScore
      ? `Reduced from ${initialScore}% to ${bestScore}% in ${attempts.length} attempt(s).`
      : `No improvement after ${attempts.length} attempt(s). Score remains ${initialScore}%.`,
  };
}
