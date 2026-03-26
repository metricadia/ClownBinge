export function stripHtmlForDetection(html: string): string {
  return html
    .replace(/<\/p>/gi, "</p>\n\n")
    .replace(/<br\s*\/?>/gi, "\n")
    .replace(/<\/h[1-6]>/gi, "\n\n")
    .replace(/<\/div>/gi, "\n\n")
    .replace(/<[^>]*>/g, " ")
    .replace(/[ \t]+/g, " ")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

function splitIntoChunks(text: string, maxChars = 45000): string[] {
  if (text.length <= maxChars) return [text];
  const chunks: string[] = [];
  const paragraphs = text.split(/\n\n+/);
  let currentChunk = "";
  for (const para of paragraphs) {
    if (para.length > maxChars) {
      if (currentChunk) { chunks.push(currentChunk.trim()); currentChunk = ""; }
      const sentences = para.match(/[^.!?]+[.!?]+/g) || [para];
      for (const sentence of sentences) {
        if (currentChunk.length + sentence.length > maxChars) {
          if (currentChunk) chunks.push(currentChunk.trim());
          currentChunk = sentence;
        } else {
          currentChunk += sentence;
        }
      }
      continue;
    }
    if (currentChunk.length + para.length + 2 > maxChars) {
      chunks.push(currentChunk.trim());
      currentChunk = para;
    } else {
      currentChunk += (currentChunk ? "\n\n" : "") + para;
    }
  }
  if (currentChunk) chunks.push(currentChunk.trim());
  return chunks;
}

const ZEROGPT_HEADERS = {
  "content-type": "application/json",
  "Origin": "https://www.zerogpt.com",
  "Referer": "https://www.zerogpt.com/",
  "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
};

export interface ZeroGPTResult {
  score: number;
  flaggedSentences: string[];
}

export async function detectAI(htmlBody: string): Promise<ZeroGPTResult> {
  const plainText = stripHtmlForDetection(htmlBody);
  if (plainText.length < 100) return { score: 0, flaggedSentences: [] };

  const chunks = splitIntoChunks(plainText);
  const chunkResults: Array<{ score: number; wordCount: number; sentences: string[] }> = [];

  for (const chunk of chunks) {
    const res = await fetch("https://api.zerogpt.com/api/detect/detectText", {
      method: "POST",
      headers: ZEROGPT_HEADERS,
      body: JSON.stringify({ input_text: chunk }),
      signal: AbortSignal.timeout(30000),
    });

    if (!res.ok) {
      const body = await res.text();
      throw new Error(`ZeroGPT API error ${res.status}: ${body}`);
    }

    const data = (await res.json()) as {
      success?: boolean;
      data?: {
        fakePercentage?: number;
        textWords?: number;
        sentences?: string[];
        h?: string[];
      };
    };

    const score = data?.data?.fakePercentage ?? 0;
    const wordCount = data?.data?.textWords ?? chunk.split(/\s+/).length;
    const sentences = data?.data?.h ?? data?.data?.sentences ?? [];

    chunkResults.push({ score, wordCount, sentences });

    if (chunks.length > 1) {
      await new Promise((r) => setTimeout(r, 1000));
    }
  }

  if (chunkResults.length === 0) return { score: 0, flaggedSentences: [] };

  const totalWords = chunkResults.reduce((s, r) => s + r.wordCount, 0);
  const weightedScore = chunkResults.reduce((s, r) => s + r.score * r.wordCount, 0) / totalWords;

  const allFlagged = chunkResults.flatMap((r) => r.sentences);

  return {
    score: Math.round(weightedScore),
    flaggedSentences: allFlagged,
  };
}
