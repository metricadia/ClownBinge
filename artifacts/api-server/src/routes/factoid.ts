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

Write a comprehensive 3-5 sentence educational explanation that:
1. Defines or explains what this concept, law, court case, statistic, organization, or event actually IS — its origin, scope, or mechanics
2. Provides historical context or key facts that go meaningfully beyond what the article says
3. Explains why it matters, what its real-world consequences are, or what most people get wrong about it
4. If relevant, includes a specific, striking, or lesser-known detail that deepens understanding

Be direct and substantive. Write like a knowledgeable journalist briefing a skeptical reader. Do NOT start with "This refers to", "This is", or "This source".`;

    const message = await anthropic.messages.create({
      model: "claude-haiku-4-5",
      max_tokens: 350,
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
