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

    const prompt = `You are a primary source citation assistant for ClownBinge, a public accountability journalism platform.

A reader clicked a link in an article. Explain what this source is and why it's relevant to what the article is talking about.

Article title: "${articleTitle || "Accountability journalism"}"
Link text: "${linkText || domain}"
Source domain: "${domain}"
Surrounding article text: "${(surroundingText || "").slice(0, 600)}"

Write a 2-3 sentence explanation that:
1. Identifies what this source/organization is
2. Explains its relevance to the specific claim or topic in the surrounding text
3. States why it counts as a primary source or authoritative reference

Keep it factual, direct, and under 80 words. Do not start with "This source" or "This link". Write as if briefing a skeptical reader who wants to know exactly what they would find there.`;

    const message = await anthropic.messages.create({
      model: "claude-haiku-4-5",
      max_tokens: 200,
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
