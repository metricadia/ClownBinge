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

export default router;
