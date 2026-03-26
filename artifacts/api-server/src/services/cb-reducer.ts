import { detectAI } from "./zerogpt";
import { paraphraseAcademicSentence, type DocType } from "./cb-rewriter";

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

function applySentenceReplacements(text: string, replacements: Map<string, string>): string {
  let result = text;
  for (const [original, replacement] of replacements) {
    if (result.includes(original)) {
      result = result.split(original).join(replacement);
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

    currentPlainText = applySentenceReplacements(plainText, masterReplacements);

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
