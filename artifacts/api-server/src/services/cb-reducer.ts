import { detectAI, stripHtmlForDetection } from "./zerogpt";
import { rewriteSentence } from "./cb-rewriter";

export interface ReduceAttempt {
  attemptNumber: number;
  scoreBeforeRewrite: number;
  scoreAfterRewrite: number;
  sentencesRewritten: number;
}

export interface ReduceResult {
  success: boolean;
  initialScore: number;
  finalScore: number;
  attempts: ReduceAttempt[];
  cleanedBody: string;
  message: string;
}

function replaceInHtml(html: string, original: string, replacement: string): string {
  if (!original || !replacement || original === replacement) return html;

  const escaped = original.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

  if (new RegExp(escaped).test(html)) {
    return html.replace(new RegExp(escaped, "g"), replacement);
  }

  return html.replace(/<p>([\s\S]*?)<\/p>/gi, (match, content) => {
    const anchors: Array<{ placeholder: string; full: string; text: string }> = [];
    const collapsed = content.replace(/(<a[^>]*?>)([\s\S]*?)(<\/a>)/gi, (full: string, _open: string, text: string) => {
      const placeholder = `\x00LINK${anchors.length}\x00`;
      anchors.push({ placeholder, full, text });
      return placeholder;
    });

    const plainVersion = anchors.reduce(
      (s, { placeholder, text }) => s.replace(placeholder, text),
      collapsed
    );

    if (!plainVersion.includes(original)) return match;

    let newPlain = plainVersion.replace(original, replacement);

    anchors.forEach(({ full, text }) => {
      if (newPlain.includes(text)) {
        newPlain = newPlain.replace(text, full);
      }
    });

    return `<p>${newPlain}</p>`;
  });
}

export async function reduceAI(
  htmlBody: string,
  targetScore = 15,
  maxAttempts = 8
): Promise<ReduceResult> {
  const { score: initialScore, flaggedSentences: initialFlagged } = await detectAI(htmlBody);

  if (initialScore <= targetScore) {
    return {
      success: true,
      initialScore,
      finalScore: initialScore,
      attempts: [],
      cleanedBody: htmlBody,
      message: `Already at target. Score: ${initialScore}%`,
    };
  }

  let currentBody = htmlBody;
  let currentScore = initialScore;
  const attempts: ReduceAttempt[] = [];

  let flaggedSentences = initialFlagged;

  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    if (flaggedSentences.length === 0) {
      console.log(`[CBReduce] Attempt ${attempt}: no flagged sentences. Stopping.`);
      break;
    }

    console.log(`[CBReduce] Attempt ${attempt}: score=${currentScore}%, flagged=${flaggedSentences.length}`);

    let rewriteCount = 0;
    for (const sentence of flaggedSentences) {
      const trimmed = sentence.trim();
      if (!trimmed || trimmed.length < 20) continue;

      const rewritten = await rewriteSentence(trimmed);
      if (rewritten !== trimmed) {
        currentBody = replaceInHtml(currentBody, trimmed, rewritten);
        rewriteCount++;
      }
    }

    const { score: newScore, flaggedSentences: newFlagged } = await detectAI(currentBody);

    attempts.push({
      attemptNumber: attempt,
      scoreBeforeRewrite: currentScore,
      scoreAfterRewrite: newScore,
      sentencesRewritten: rewriteCount,
    });

    console.log(`[CBReduce] Attempt ${attempt} result: ${currentScore}% -> ${newScore}%`);

    flaggedSentences = newFlagged;

    if (newScore <= targetScore) {
      currentScore = newScore;
      break;
    }

    if (attempts.length >= 2) {
      const lastTwo = attempts.slice(-2);
      if (lastTwo[1].scoreAfterRewrite >= lastTwo[0].scoreAfterRewrite) {
        console.log("[CBReduce] Score not improving. Stopping.");
        break;
      }
    }

    currentScore = newScore;
    await new Promise((r) => setTimeout(r, 500));
  }

  const success = currentScore <= targetScore;

  return {
    success,
    initialScore,
    finalScore: currentScore,
    attempts,
    cleanedBody: currentBody,
    message: success
      ? `Reduced from ${initialScore}% to ${currentScore}% in ${attempts.length} attempt(s).`
      : `Reduced from ${initialScore}% to ${currentScore}% after ${attempts.length} attempt(s). Target of ${targetScore}% not reached.`,
  };
}
