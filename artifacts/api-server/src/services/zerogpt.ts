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

export interface ZeroGPTResult {
  score: number;
  flaggedSentences: string[];
}

export async function detectAI(htmlBody: string): Promise<ZeroGPTResult> {
  const RAPIDAPI_KEY = process.env["RAPIDAPI_KEY"];
  if (!RAPIDAPI_KEY) throw new Error("RAPIDAPI_KEY not configured");

  const plainText = stripHtmlForDetection(htmlBody);
  if (plainText.length < 100) return { score: 0, flaggedSentences: [] };

  const chunks = splitIntoChunks(plainText);
  const chunkResults: Array<{ score: number; wordCount: number; sentences: string[] }> = [];

  for (const chunk of chunks) {
    const res = await fetch("https://zerogpt.p.rapidapi.com/api/v1/detectText", {
      method: "POST",
      headers: {
        "content-type": "application/json",
        "X-RapidAPI-Key": RAPIDAPI_KEY,
        "X-RapidAPI-Host": "zerogpt.p.rapidapi.com",
      },
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
        is_gpt_generated?: number;
        words_count?: number;
        gpt_generated_sentences?: string[];
      };
    };

    const score = data?.data?.is_gpt_generated ?? 0;
    const wordCount = data?.data?.words_count ?? chunk.split(/\s+/).length;
    const sentences = data?.data?.gpt_generated_sentences ?? [];

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
