import { Router, type IRouter } from "express";
import { db, postsTable } from "@workspace/db";
import { eq, desc, isNull, asc, sql } from "drizzle-orm";
import { detectAI } from "../services/zerogpt";
import { reduceAI } from "../services/cb-reducer";

const router: IRouter = Router();

router.get("/fixme/articles", async (_req, res) => {
  try {
    const rows = await db
      .select({
        id: postsTable.id,
        caseNumber: postsTable.caseNumber,
        title: postsTable.title,
        slug: postsTable.slug,
        category: postsTable.category,
        status: postsTable.status,
        locked: postsTable.locked,
        aiScore: postsTable.aiScore,
        aiScoreTestedAt: postsTable.aiScoreTestedAt,
        wordCount: sql<number>`array_length(regexp_split_to_array(trim(regexp_replace(body, '<[^>]+>', ' ', 'g')), '\s+'), 1)`.as("word_count"),
      })
      .from(postsTable)
      .orderBy(
        sql`CASE WHEN ai_score IS NULL THEN 0 ELSE 1 END ASC`,
        desc(postsTable.aiScore),
        asc(postsTable.caseNumber)
      );

    res.json(rows);
  } catch (err) {
    console.error("[FixMe] list error:", err);
    res.status(500).json({ error: "Failed to fetch articles" });
  }
});

router.post("/fixme/detect/:slug", async (req, res) => {
  const { slug } = req.params as { slug: string };

  try {
    const [post] = await db
      .select({ id: postsTable.id, body: postsTable.body })
      .from(postsTable)
      .where(eq(postsTable.slug, slug))
      .limit(1);

    if (!post) {
      res.status(404).json({ error: "Article not found" });
      return;
    }

    const { score, flaggedSentences } = await detectAI(post.body);

    await db
      .update(postsTable)
      .set({ aiScore: score, aiScoreTestedAt: new Date() })
      .where(eq(postsTable.id, post.id));

    res.json({ slug, score, flaggedCount: flaggedSentences.length });
  } catch (err: unknown) {
    console.error("[FixMe] detect error:", err);
    const message = err instanceof Error ? err.message : "Detection failed";
    res.status(500).json({ error: message });
  }
});

const activeJobs = new Map<string, { startedAt: Date; initialScore?: number }>();

router.get("/fixme/reduce/status/:slug", (req, res) => {
  const { slug } = req.params as { slug: string };
  const job = activeJobs.get(slug);
  if (job) {
    res.json({ status: "processing", startedAt: job.startedAt, initialScore: job.initialScore });
  } else {
    res.json({ status: "idle" });
  }
});

router.post("/fixme/reduce/:slug", async (req, res) => {
  const { slug } = req.params as { slug: string };
  const targetScore: number = typeof req.body?.targetScore === "number" ? req.body.targetScore : 15;

  if (activeJobs.has(slug)) {
    res.json({ status: "processing", message: "Reduction already in progress." });
    return;
  }

  try {
    const [post] = await db
      .select({ id: postsTable.id, body: postsTable.body, locked: postsTable.locked })
      .from(postsTable)
      .where(eq(postsTable.slug, slug))
      .limit(1);

    if (!post) {
      res.status(404).json({ error: "Article not found" });
      return;
    }

    activeJobs.set(slug, { startedAt: new Date() });
    res.json({ status: "processing", message: "Reduction started. Polling for score updates..." });

    reduceAI(post.body, targetScore)
      .then(async (result) => {
        if (result.finalScore < result.initialScore) {
          await db
            .update(postsTable)
            .set({ body: result.cleanedBody, aiScore: result.finalScore, aiScoreTestedAt: new Date() })
            .where(eq(postsTable.id, post.id));
        } else {
          await db
            .update(postsTable)
            .set({ aiScore: result.initialScore, aiScoreTestedAt: new Date() })
            .where(eq(postsTable.id, post.id));
        }
        console.log(`[CBReduce] Done: ${result.initialScore}% -> ${result.finalScore}% | ${result.message}`);
      })
      .catch((err) => {
        console.error("[CBReduce] Background job failed:", err);
      })
      .finally(() => {
        activeJobs.delete(slug);
      });
  } catch (err: unknown) {
    activeJobs.delete(slug);
    console.error("[FixMe] reduce error:", err);
    const message = err instanceof Error ? err.message : "Reduction failed";
    res.status(500).json({ error: message });
  }
});

export default router;
