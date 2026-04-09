import { Router, type IRouter } from "express";
import { anthropic } from "@workspace/integrations-anthropic-ai";

const router: IRouter = Router();

router.post("/factoid-context", async (req, res) => {
  try {
    const { href, linkText, surroundingText, articleTitle } = req.body as {
      href?: string;
      linkText?: string;
      surroundingText?: string;
      articleTitle?: string;
    };

    if (!linkText && !href) {
      res.status(400).json({ error: "linkText or href required" });
      return;
    }

    let domain = "";
    try {
      domain = href ? new URL(href).hostname.replace(/^www\./, "") : "";
    } catch {}

    const prompt = `You are an educational companion for ClownBinge, a public accountability journalism platform.

A reader clicked a factoid link in an article. Your job is to EDUCATE them — give them context and knowledge they do NOT already have from the article. Do not repeat what the article already says.

Article title: "${articleTitle || "Accountability journalism"}"
Clicked term: "${linkText || domain}"
What the article says near this term: "${(surroundingText || "").slice(0, 600)}"
Source domain: "${domain}"

Write a 2-paragraph educational explanation. Separate the two paragraphs with the exact token: ||

Paragraph 1 (2-3 sentences): Define or explain what this concept, law, statistic, organization, or event actually IS — its origin, scope, or mechanics. Include key historical context.
Paragraph 2 (2-3 sentences): Why it matters. Real-world consequences, what most people get wrong, or a specific lesser-known detail that deepens understanding.

Be direct and substantive. Write like a knowledgeable journalist briefing a skeptical reader. Do NOT start with "This refers to", "This is", or "This source". Do NOT include any label or heading before the paragraphs — output only the two paragraphs separated by ||.`;

    const message = await anthropic.messages.create({
      model: "claude-haiku-4-5",
      max_tokens: 450,
      messages: [{ role: "user", content: prompt }],
    });

    const content = message.content[0];
    const summary = content.type === "text" ? content.text.trim() : "";

    const title = linkText
      ? linkText.length > 80
        ? linkText.slice(0, 77) + "…"
        : linkText
      : domain;

    res.json({ title, summary, domain });
  } catch (err) {
    console.error("factoid-context error:", err);
    res.status(500).json({ error: "Failed to generate factoid context" });
  }
});

// ── Author-side: generate factoid markup for the editor ──────────────────────
router.post("/factoid/generate", async (req, res) => {
  try {
    const { term, articleContext } = req.body as {
      term?: string;
      articleContext?: string;
    };

    if (!term) {
      res.status(400).json({ error: "term is required" });
      return;
    }

    const prompt = `You are assisting a journalist at ClownBinge, a public accountability journalism platform. The journalist has selected the term "${term}" in an article and wants to add a CB Factoid — a short educational tooltip that gives readers context they may not have.

Article context: "${(articleContext || "").slice(0, 400)}"

Write a CB Factoid for this term. Return ONLY a JSON object with this exact shape:
{
  "title": "A short, factual label for this term (max 80 characters)",
  "summary": "Two to three sentences of educational context. Define what this is, when/where it originated or applies, and one specific detail that deepens understanding. Write like a knowledgeable journalist briefing a skeptical reader. No fluff, no motivational framing."
}

Do not include any text outside the JSON object.`;

    const message = await anthropic.messages.create({
      model: "claude-haiku-4-5",
      max_tokens: 400,
      messages: [{ role: "user", content: prompt }],
    });

    const content = message.content[0];
    if (content.type !== "text") {
      res.status(500).json({ error: "Unexpected response from Claude" });
      return;
    }

    const jsonMatch = content.text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      res.status(500).json({ error: "Could not parse Claude response" });
      return;
    }

    const parsed = JSON.parse(jsonMatch[0]) as { title: string; summary: string };
    res.json({ title: parsed.title, summary: parsed.summary });
  } catch (err) {
    console.error("factoid/generate error:", err);
    res.status(500).json({ error: "Failed to generate factoid" });
  }
});

// ── Deep Factoid Scan: analyze entire article in one call ────────────────────
// Assigns factoids to theme turns (first occurrence of each concept), not to
// authors or subjects. Selective by design — 3-7 max per article.
router.post("/factoid/deep-scan", async (req, res) => {
  try {
    const { articleTitle, bodyText } = req.body as {
      articleTitle?: string;
      bodyText?: string;
    };

    if (!bodyText || bodyText.trim().length < 100) {
      res.status(400).json({ error: "bodyText is required (min 100 chars)" });
      return;
    }

    // Trim to ~4000 chars for cost control — enough for full context
    const truncatedBody = bodyText.slice(0, 4000);

    const prompt = `You are an expert research editor at ClownBinge, a public accountability journalism platform. Your job is to perform a Deep Factoid Scan on the article below.

Article title: "${articleTitle || "Accountability article"}"

Article text:
"""
${truncatedBody}
"""

Your task: Identify exactly 4–6 key terms or phrases in this article that a general reader would genuinely benefit from having explained. These must be INSTITUTIONAL or CONCEPTUAL terms — laws, government agencies, acronyms, historical events, legal concepts, financial instruments, regulatory bodies, or policy mechanisms.

STRICT RULES:
- Do NOT select person names (individuals are handled separately)
- Do NOT select the article's main subject
- Do NOT select obvious common words
- DO select: agency acronyms, legal case names, policy programs, legislative acts, financial terms, regulatory frameworks
- Pick the MOST IMPORTANT terms — ones where background context directly changes how the reader understands the article's stakes
- Each phrase must appear EXACTLY as written in the article text above
- Prefer shorter, precise phrases (2-5 words) over long ones
- Maximum 6 factoids — quality over quantity

Return ONLY a JSON array with this exact shape (no other text):
[
  {
    "phrase": "exact phrase from article text",
    "title": "short factual label (max 70 chars)",
    "summary": "Two sentences. First: what this IS — its origin, scope, or mechanics. Second: why it matters to the reader of this article."
  }
]`;

    const message = await anthropic.messages.create({
      model: "claude-sonnet-4-5",
      max_tokens: 1200,
      messages: [{ role: "user", content: prompt }],
    });

    const content = message.content[0];
    if (content.type !== "text") {
      res.status(500).json({ error: "Unexpected response from Claude" });
      return;
    }

    const jsonMatch = content.text.match(/\[[\s\S]*\]/);
    if (!jsonMatch) {
      res.status(500).json({ error: "Could not parse Claude response as JSON array" });
      return;
    }

    const parsed = JSON.parse(jsonMatch[0]) as {
      phrase: string;
      title: string;
      summary: string;
    }[];

    // Validate and cap at 6
    const factoids = parsed
      .filter((f) => f.phrase && f.title && f.summary)
      .slice(0, 6);

    res.json({ factoids });
  } catch (err) {
    console.error("factoid/deep-scan error:", err);
    res.status(500).json({ error: "Failed to run Deep Factoid Scan" });
  }
});

export default router;
