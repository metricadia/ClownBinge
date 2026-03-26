import { detectAI } from "./zerogpt";
import { rewriteSentence } from "./cb-rewriter";

function shouldSkipSentence(sentence: string): boolean {
  if (sentence.length < 20) return true;

  if (/[""]/.test(sentence)) return true;

  if (/\b\d{4}\b/.test(sentence)) return true;

  if (/\d+%/.test(sentence)) return true;

  if (/\$[\d,]+/.test(sentence)) return true;

  if (/\b\d[\d,]*\s*(people|men|women|workers|cases|votes|seats|years|months|days|miles|acres|dollars|million|billion|trillion)\b/i.test(sentence)) return true;

  if (/\b(v\.|vs\.|U\.S\.\s+\d|P\.L\.|S\.\s+Hrg|No\.\s+\d|§\s*\d)/i.test(sentence)) return true;

  if (/\b(January|February|March|April|May|June|July|August|September|October|November|December)\s+\d/i.test(sentence)) return true;

  if (/\b(Section|Article|Amendment|Act|Resolution|Statute|Code|Title)\s+\d/i.test(sentence)) return true;

  return false;
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

function replaceInHtml(html: string, original: string, replacement: string): string {
  if (!original || !replacement || original === replacement) return html;

  let changed = false;

  const result = html.replace(
    /(<(?:p|h[1-6]|li|blockquote)(?:\s[^>]*)?>)([\s\S]*?)(<\/(?:p|h[1-6]|li|blockquote)>)/gi,
    (match, openTag: string, content: string, closeTag: string) => {
      type Anchor = { placeholder: string; openTag: string; innerText: string; closeTag: string };
      const anchors: Anchor[] = [];

      const collapsed = content.replace(
        /(<a(?:\s[^>]*)?>)([\s\S]*?)(<\/a>)/gi,
        (_full: string, aOpen: string, aText: string, aClose: string) => {
          const placeholder = `\x00LINK${anchors.length}\x00`;
          anchors.push({ placeholder, openTag: aOpen, innerText: aText, closeTag: aClose });
          return placeholder;
        }
      );

      const plainVersion = anchors.reduce(
        (s, { placeholder, innerText }) => s.replace(placeholder, innerText),
        collapsed
      );

      if (!plainVersion.includes(original)) return match;

      let newPlain = plainVersion.replace(original, replacement);
      changed = true;

      for (const anchor of anchors) {
        const wasAnchorText = anchor.innerText === original || anchor.innerText.includes(original);
        if (wasAnchorText) {
          const newAnchorText = anchor.innerText.replace(original, replacement);
          newPlain = newPlain.replace(replacement, `${anchor.openTag}${newAnchorText}${anchor.closeTag}`);
        } else if (newPlain.includes(anchor.innerText)) {
          newPlain = newPlain.replace(
            anchor.innerText,
            `${anchor.openTag}${anchor.innerText}${anchor.closeTag}`
          );
        }
      }

      return `${openTag}${newPlain}${closeTag}`;
    }
  );

  if (!changed) return html;
  return result;
}

async function rewriteBatch(
  sentences: string[],
  concurrency = 8
): Promise<Map<string, string>> {
  const results = new Map<string, string>();
  const skipped = sentences.filter((s) => shouldSkipSentence(s.trim()));
  if (skipped.length > 0) {
    console.log(`[CBReduce] Pre-filter skipping ${skipped.length} high-risk sentences (numbers/quotes/dates/legal).`);
  }
  const valid = sentences.filter((s) => !shouldSkipSentence(s.trim()) && s.trim().length >= 20);

  for (let i = 0; i < valid.length; i += concurrency) {
    const batch = valid.slice(i, i + concurrency);
    const settled = await Promise.allSettled(
      batch.map(async (sentence) => {
        const trimmed = sentence.trim();
        const rewritten = await rewriteSentence(trimmed);
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
  maxAttempts = 4
): Promise<ReduceResult> {
  const { score: scan1Score, flaggedSentences: scan1Flagged } = await detectAI(htmlBody);

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

  console.log(`[CBReduce] Scan 1: ${scan1Score}% — waiting 2s for confirmatory scan...`);
  await new Promise((r) => setTimeout(r, 2000));

  const { score: scan2Score, flaggedSentences: scan2Flagged } = await detectAI(htmlBody);

  const confirmedScore = Math.round((scan1Score + scan2Score) / 2);
  console.log(`[CBReduce] Scan 2: ${scan2Score}% — confirmed average: ${confirmedScore}%`);

  if (scan2Score <= targetScore) {
    return {
      success: true,
      initialScore: confirmedScore,
      finalScore: scan2Score,
      attempts: [],
      cleanedBody: htmlBody,
      diffs: [],
      message: `Variance check passed. Scan 1: ${scan1Score}%, Scan 2: ${scan2Score}% — no reduction needed.`,
    };
  }

  const initialScore = confirmedScore;
  let currentBody = htmlBody;
  let currentScore = confirmedScore;
  const attempts: ReduceAttempt[] = [];
  const allDiffs: SentenceDiff[] = [];

  let flaggedSentences = scan2Flagged.length > 0 ? scan2Flagged : scan1Flagged;

  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    if (flaggedSentences.length === 0) {
      console.log(`[CBReduce] Attempt ${attempt}: no flagged sentences. Stopping.`);
      break;
    }

    console.log(`[CBReduce] Attempt ${attempt}: score=${currentScore}%, flagged=${flaggedSentences.length}`);

    const rewrites = await rewriteBatch(flaggedSentences);

    for (const [original, replacement] of rewrites) {
      if (original !== replacement) {
        allDiffs.push({ before: original, after: replacement });
      }
      currentBody = replaceInHtml(currentBody, original, replacement);
    }

    const { score: newScore, flaggedSentences: newFlagged } = await detectAI(currentBody);

    attempts.push({
      attemptNumber: attempt,
      scoreBeforeRewrite: currentScore,
      scoreAfterRewrite: newScore,
      sentencesRewritten: rewrites.size,
    });

    console.log(`[CBReduce] Attempt ${attempt} result: ${currentScore}% -> ${newScore}% (rewrote ${rewrites.size} sentences)`);

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

    await new Promise((r) => setTimeout(r, 300));
  }

  const success = currentScore <= targetScore;

  return {
    success,
    initialScore,
    finalScore: currentScore,
    attempts,
    cleanedBody: currentBody,
    diffs: allDiffs,
    message: success
      ? `Reduced from ${initialScore}% to ${currentScore}% in ${attempts.length} attempt(s).`
      : `Reduced from ${initialScore}% to ${currentScore}% after ${attempts.length} attempt(s). Target of ${targetScore}% not reached.`,
  };
}
