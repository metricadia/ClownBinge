import { Router, type IRouter } from "express";
import { db, postsTable } from "@workspace/db";
import { eq, desc, asc, sql } from "drizzle-orm";
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

type JobStatus =
  | { phase: "processing"; startedAt: Date; currentAttempt?: number; currentScore?: number }
  | {
      phase: "done";
      initialScore: number;
      finalScore: number;
      diffsCount: number;
      saved: boolean;
      message: string;
    };

const jobs = new Map<string, JobStatus>();

router.get("/fixme/reduce/status/:slug", (req, res) => {
  const { slug } = req.params as { slug: string };
  const job = jobs.get(slug);
  if (!job) {
    res.json({ status: "idle" });
    return;
  }
  if (job.phase === "processing") {
    res.json({
      status: "processing",
      startedAt: job.startedAt,
      currentAttempt: job.currentAttempt,
      currentScore: job.currentScore,
    });
    return;
  }
  res.json({ status: "done", ...job });
});

router.post("/fixme/reduce/:slug", async (req, res) => {
  const { slug } = req.params as { slug: string };
  const targetScore: number =
    typeof req.body?.targetScore === "number" ? req.body.targetScore : 15;

  const existing = jobs.get(slug);
  if (existing?.phase === "processing") {
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

    if (post.locked) {
      res.status(403).json({ error: "Article is locked. Unlock it before reducing." });
      return;
    }

    jobs.set(slug, { phase: "processing", startedAt: new Date() });
    res.json({ status: "processing", message: "Reduction started. Polling for updates..." });

    (async () => {
      try {
        const result = await reduceAI(post.body, targetScore);

        const scoreImproved = result.finalScore < result.initialScore;
        let saved = false;

        if (scoreImproved && result.diffs.length > 0) {
          await db
            .update(postsTable)
            .set({ body: result.cleanedBody, aiScore: result.finalScore, aiScoreTestedAt: new Date() })
            .where(eq(postsTable.id, post.id));
          saved = true;
          console.log(`[CBReduce] Saved. ${result.initialScore}% -> ${result.finalScore}%. ${result.diffs.length} rewrites.`);
        } else {
          await db
            .update(postsTable)
            .set({ aiScore: result.finalScore, aiScoreTestedAt: new Date() })
            .where(eq(postsTable.id, post.id));
          console.log(`[CBReduce] No save. ${result.initialScore}% -> ${result.finalScore}%. Score did not improve.`);
        }

        jobs.set(slug, {
          phase: "done",
          initialScore: result.initialScore,
          finalScore: result.finalScore,
          diffsCount: result.diffs.length,
          saved,
          message: result.message,
        });
      } catch (err) {
        console.error("[CBReduce] Background job failed:", err);
        jobs.delete(slug);
      }
    })();
  } catch (err: unknown) {
    jobs.delete(slug);
    console.error("[FixMe] reduce error:", err);
    const message = err instanceof Error ? err.message : "Reduction failed";
    res.status(500).json({ error: message });
  }
});

router.post("/fixme/lock/:slug", async (req, res) => {
  const { slug } = req.params as { slug: string };
  const { locked } = req.body as { locked: boolean };

  if (typeof locked !== "boolean") {
    res.status(400).json({ error: "locked must be a boolean" });
    return;
  }

  try {
    const [post] = await db
      .select({ id: postsTable.id })
      .from(postsTable)
      .where(eq(postsTable.slug, slug))
      .limit(1);

    if (!post) {
      res.status(404).json({ error: "Article not found" });
      return;
    }

    await db.update(postsTable).set({ locked }).where(eq(postsTable.id, post.id));
    res.json({ slug, locked });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Lock toggle failed";
    res.status(500).json({ error: message });
  }
});

export default router;
