import { Router, type IRouter } from "express";
import { db, tipsTable } from "@workspace/db";
import { z } from "zod";
import { anthropic } from "@workspace/integrations-anthropic-ai";
import crypto from "node:crypto";

const router: IRouter = Router();

const TURNSTILE_SECRET = process.env.TURNSTILE_SECRET_KEY ?? "1x0000000000000000000000000000000AA";
const TURNSTILE_VERIFY_URL = "https://challenges.cloudflare.com/turnstile/v0/siteverify";

const TipBody = z.object({
  captchaToken: z.string().min(1),
  submitterName: z.string().optional(),
  submitterEmail: z.string().optional(),
  subjectName: z.string().min(2).max(200),
  subjectTitle: z.string().optional(),
  category: z.enum(["political", "religious", "cultural", "other"]).optional(),
  incidentDescription: z.string().min(50).max(5000),
  sourceUrl: z.string().optional(),
});

async function verifyCaptcha(token: string, ip: string): Promise<boolean> {
  try {
    const resp = await fetch(TURNSTILE_VERIFY_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ secret: TURNSTILE_SECRET, response: token, remoteip: ip }),
    });
    const data = await resp.json() as { success: boolean };
    return data.success;
  } catch {
    return false;
  }
}

async function assessWithClaude(tip: {
  subjectName: string;
  subjectTitle?: string;
  category?: string;
  incidentDescription: string;
  sourceUrl?: string;
}): Promise<{ score: number; assessment: string; recommendation: string }> {
  const message = await anthropic.messages.create({
    model: "claude-haiku-4-5",
    max_tokens: 8192,
    messages: [
      {
        role: "user",
        content: `You are a senior news editor for ClownBinge, a verified accountability journalism platform documenting real incidents where politicians and religious leaders contradict their own words and votes.

Assess this public tip submission for editorial merit. Be strict -- only verifiable incidents involving named public figures qualify.

Subject Name: ${tip.subjectName}
Subject Title/Role: ${tip.subjectTitle ?? "Not provided"}
Category: ${tip.category ?? "Not specified"}
Incident Description: ${tip.incidentDescription}
Source URL: ${tip.sourceUrl ?? "None provided"}

Respond ONLY with valid JSON -- no other text -- in this exact format:
{
  "score": <integer 1-10>,
  "is_public_figure": <boolean>,
  "has_verifiable_incident": <boolean>,
  "has_source": <boolean>,
  "assessment": "<editorial notes under 200 chars -- what makes this strong or weak>",
  "recommendation": "<one of: publish, needs_work, reject, spam>"
}

Scoring:
1-3: Vague, no named public figure, unverifiable, or spam
4-6: Real incident but needs more detail or a primary source
7-8: Strong -- named figure, specific incident, has or could find a source
9-10: Exceptional -- documented hypocrisy, primary source URL confirmed

Recommendation:
- publish: score 7+, confirmed public figure, has source
- needs_work: score 4-6, real but incomplete
- reject: score 1-3, unverifiable or not a public figure
- spam: obvious bot or bad-faith submission`,
      },
    ],
  });

  const block = message.content[0];
  if (block.type !== "text") {
    return { score: 0, assessment: "Unable to assess", recommendation: "needs_work" };
  }

  try {
    const text = block.text.trim();
    const jsonStart = text.indexOf("{");
    const jsonEnd = text.lastIndexOf("}");
    const jsonStr = jsonStart >= 0 && jsonEnd > jsonStart ? text.slice(jsonStart, jsonEnd + 1) : text;
    const parsed = JSON.parse(jsonStr) as {
      score: number;
      assessment: string;
      recommendation: string;
    };
    return {
      score: parsed.score ?? 0,
      assessment: parsed.assessment ?? "",
      recommendation: parsed.recommendation ?? "needs_work",
    };
  } catch {
    return { score: 0, assessment: "Parse error", recommendation: "needs_work" };
  }
}

router.post("/tips", async (req, res) => {
  const body = TipBody.safeParse(req.body);
  if (!body.success) {
    res.status(400).json({ error: "Invalid submission", details: body.error.issues });
    return;
  }

  const ip = (req.headers["x-forwarded-for"] as string)?.split(",")[0]?.trim() ?? req.ip ?? "unknown";
  const ipHash = crypto.createHash("sha256").update(ip).digest("hex");

  const captchaOk = await verifyCaptcha(body.data.captchaToken, ip);
  if (!captchaOk) {
    res.status(400).json({ error: "CAPTCHA verification failed. Please try again." });
    return;
  }

  let claudeResult = { score: 0, assessment: "Not assessed", recommendation: "needs_work" };
  try {
    claudeResult = await assessWithClaude({
      subjectName: body.data.subjectName,
      subjectTitle: body.data.subjectTitle,
      category: body.data.category,
      incidentDescription: body.data.incidentDescription,
      sourceUrl: body.data.sourceUrl,
    });
  } catch (err) {
    req.log.error({ err }, "Claude assessment failed");
  }

  const status =
    claudeResult.recommendation === "spam"
      ? "spam"
      : claudeResult.recommendation === "reject"
        ? "rejected"
        : "pending_review";

  try {
    await db.insert(tipsTable).values({
      submitterName: body.data.submitterName,
      submitterEmail: body.data.submitterEmail,
      subjectName: body.data.subjectName,
      subjectTitle: body.data.subjectTitle,
      category: body.data.category,
      incidentDescription: body.data.incidentDescription,
      sourceUrl: body.data.sourceUrl,
      claudeScore: claudeResult.score,
      claudeAssessment: claudeResult.assessment,
      claudeRecommendation: claudeResult.recommendation,
      status,
      ipHash,
    });
  } catch (err) {
    req.log.error({ err }, "Error saving tip");
    res.status(500).json({ error: "Failed to save your tip. Please try again." });
    return;
  }

  if (status === "spam") {
    res.json({ success: true, message: "Thank you for your submission." });
    return;
  }

  res.json({
    success: true,
    message:
      claudeResult.recommendation === "reject"
        ? "Thank you for your submission. After review, it did not meet our sourcing standards, but we appreciate you reaching out."
        : "Thank you -- your tip has been received and is under editorial review. We will follow up if we need more information.",
    status,
  });
});

export default router;
