import { Router, type IRouter } from "express";
import { db, postsTable } from "@workspace/db";
import { eq, desc, asc, sql } from "drizzle-orm";
import { detectAI } from "../services/zerogpt";
import { reduceAI } from "../services/cb-reducer";
import { scoreIntellectualDensity } from "../services/ids-scorer";
import { anthropic } from "@workspace/integrations-anthropic-ai";
import { checkContentGuard, formatViolations } from "../services/content-guard";
import { generateArticle } from "../services/cb-generator";
import {
  runCategory,
  stopPipeline,
  getPipelineState,
  getCategoryMap,
  CATEGORY_ORDER,
  checkAndFixClosingMalformation,
  runClosingScan,
  runAllRemaining,
  getFullRunState,
} from "../services/cb-pipeline";
import { getLessonsSummary, loadLessons, recordErrors } from "../services/cb-lessons";

const router: IRouter = Router();

router.get("/fixme/articles", async (_req, res) => {
  res.setHeader("Cache-Control", "no-store");
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
        idsScore: postsTable.idsScore,
        wordCount: sql<number>`array_length(regexp_split_to_array(trim(regexp_replace(body, '<[^>]+>', ' ', 'g')), '[[:space:]]+'), 1)`.as("word_count"),
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

// ── Article Generation ─────────────────────────────────────────────────────────

router.post("/fixme/generate", async (req, res) => {
  const { topic, category, caseNumber, additionalContext } = req.body as {
    topic: string;
    category: string;
    caseNumber: string;
    additionalContext?: string;
  };

  if (!topic || !category || !caseNumber) {
    res.status(400).json({ error: "topic, category, and caseNumber are required" });
    return;
  }

  if (!/^CB-\d{6}$/.test(caseNumber)) {
    res.status(400).json({ error: "caseNumber must match CB-XXXXXX format" });
    return;
  }

  try {
    console.log(`[CBGen] Generating article for ${caseNumber}: ${topic}`);
    const article = await generateArticle({ topic, category, caseNumber, additionalContext });

    // Score IDS immediately after generation
    const ids = scoreIntellectualDensity(article.body);

    const [existing] = await db
      .select({ id: postsTable.id })
      .from(postsTable)
      .where(eq(postsTable.caseNumber, caseNumber))
      .limit(1);

    if (existing) {
      res.status(409).json({ error: `Case number ${caseNumber} already exists in the database` });
      return;
    }

    const [inserted] = await db
      .insert(postsTable)
      .values({
        caseNumber,
        title: article.title,
        slug: article.slug,
        teaser: article.teaser,
        body: article.body,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        category: category as any,
        status: "draft",
        idsScore: ids.score,
      })
      .returning({ id: postsTable.id, slug: postsTable.slug });

    console.log(`[CBGen] Saved ${caseNumber} (IDS=${ids.score}, contentType=${ids.contentType})`);

    res.json({
      caseNumber,
      slug: inserted.slug,
      title: article.title,
      idsScore: ids.score,
      idsContentType: ids.contentType,
      idsBaseline: ids.baseline,
      idsBreakdown: ids.breakdown,
      wordCountApprox: ids.wordCount,
    });
  } catch (err: unknown) {
    console.error("[CBGen] generation error:", err);
    const message = err instanceof Error ? err.message : "Generation failed";
    res.status(500).json({ error: message });
  }
});

router.post("/fixme/detect/:slug", async (req, res) => {
  const { slug } = req.params as { slug: string };

  try {
    const [post] = await db
      .select({ id: postsTable.id, body: postsTable.body, locked: postsTable.locked, aiScore: postsTable.aiScore })
      .from(postsTable)
      .where(eq(postsTable.slug, slug))
      .limit(1);

    if (!post) {
      res.status(404).json({ error: "Article not found" });
      return;
    }

    const [{ score, flaggedSentences }, ids] = await Promise.all([
      detectAI(post.body),
      Promise.resolve(scoreIntellectualDensity(post.body)),
    ]);

    // Never inflate a locked article's saved score — ZeroGPT is non-deterministic.
    // If the article is locked and the new scan is higher than what was already saved,
    // preserve the saved (lower) score. Only write if the new score is lower or article is unlocked.
    const existingScore = post.aiScore ?? Infinity;
    const scoreToSave = (post.locked && score > existingScore) ? existingScore : score;
    const scoreChanged = scoreToSave !== existingScore || !post.aiScore;

    if (scoreChanged) {
      await db
        .update(postsTable)
        .set({ aiScore: scoreToSave, aiScoreTestedAt: new Date(), idsScore: ids.score })
        .where(eq(postsTable.id, post.id));
    } else {
      // Still update IDS even if score is protected
      await db
        .update(postsTable)
        .set({ aiScoreTestedAt: new Date(), idsScore: ids.score })
        .where(eq(postsTable.id, post.id));
    }

    res.json({ slug, score: scoreToSave, rawScore: score, flaggedCount: flaggedSentences.length, idsScore: ids.score, idsContentType: ids.contentType, idsBaseline: ids.baseline, idsBreakdown: ids.breakdown });
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
    typeof req.body?.targetScore === "number" ? req.body.targetScore : 20;

  const existing = jobs.get(slug);
  if (existing?.phase === "processing") {
    res.json({ status: "processing", message: "Reduction already in progress." });
    return;
  }

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

    jobs.set(slug, { phase: "processing", startedAt: new Date() });
    res.json({ status: "processing", message: "Reduction started. Polling for updates..." });

    (async () => {
      try {
        let totalSaved = 0;

        const result = await reduceAI(
          post.body,
          targetScore,
          4,
          "journalism",
          async (body: string, score: number) => {
            const guard = checkContentGuard(body, true);
            if (!guard.clean) {
              console.warn(`[CBReduce] Blocked save — banned phrases in body: ${formatViolations(guard.violations)}`);
              return;
            }
            await db
              .update(postsTable)
              .set({ body, aiScore: score, aiScoreTestedAt: new Date() })
              .where(eq(postsTable.id, post.id));
            totalSaved++;
          }
        );

        const scoreImproved = result.finalScore < result.initialScore;

        if (!scoreImproved) {
          await db
            .update(postsTable)
            .set({ aiScore: result.finalScore, aiScoreTestedAt: new Date() })
            .where(eq(postsTable.id, post.id));
        }

        await db
          .update(postsTable)
          .set({ locked: true })
          .where(eq(postsTable.id, post.id));

        console.log(`[CBReduce] Complete. ${result.initialScore}% → ${result.finalScore}%. Saves: ${totalSaved}. Auto-locked.`);

        jobs.set(slug, {
          phase: "done",
          initialScore: result.initialScore,
          finalScore: result.finalScore,
          diffsCount: result.diffs.length,
          saved: scoreImproved,
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

const CATEGORY_CONTEXT: Record<string, string> = {
  self_owned:                "Self-Owned — politician/leader publicly contradicting their own documented record",
  law_and_justice:           "Law & Justice — courts, policing, criminal justice, legal accountability",
  money_and_power:           "Money & Power — financial misconduct, lobbying, corporate corruption",
  us_constitution:           "U.S. Constitution — constitutional law, rights, amendments, Supreme Court",
  women_and_girls:           "Women & Girls — gender equity, women in public life, reproductive rights",
  anti_racist_heroes:        "Anti-Racist Heroes — documented record of courage against racial injustice",
  us_history:                "U.S. History — documented American historical record",
  religion:                  "Religion — pastor/church misconduct, financial fraud, sexual abuse, hypocrisy",
  investigations:            "Investigations — original document-based investigative reporting",
  war_and_inhumanity:        "War & Inhumanity — documented atrocities, military conduct, war crimes",
  health_and_healing:        "Health & Healing — peer-reviewed health research, medical facts",
  technology:                "Technology — tech industry, algorithms, surveillance, platform accountability",
  censorship:                "Censorship — documented suppression of speech, press freedom",
  global_south:              "Global South — documented history and knowledge of the Global South",
  how_it_works:              "How It Works — explainer on institutions, systems, documented processes",
  nerd_out:                  "NerdOut — deep academic analysis with scholarly primary sources",
  disarming_hate:            "Disarming Hate — primary-source debunking of racist or extremist narratives",
  native_and_first_nations:  "Native & First Nations — documented Indigenous history, sovereignty, law, science, and culture from primary sources",
};

// ── Detect All ───────────────────────────────────────────────────────────────

type DetectAllStatus =
  | { phase: "idle" }
  | { phase: "running"; total: number; done: number; failed: number; current: string }
  | { phase: "done"; total: number; done: number; failed: number; durationSec: number };

let detectAllStatus: DetectAllStatus = { phase: "idle" };

router.get("/fixme/detect-all/status", (_req, res) => {
  res.json(detectAllStatus);
});

router.post("/fixme/detect-all", async (_req, res) => {
  if (detectAllStatus.phase === "running") {
    res.json({ status: "already_running", message: "Detection already in progress." });
    return;
  }

  res.json({ status: "started", message: "Bulk detection started." });

  (async () => {
    const startedAt = Date.now();
    try {
      const articles = await db
        .select({ id: postsTable.id, slug: postsTable.slug, body: postsTable.body, caseNumber: postsTable.caseNumber })
        .from(postsTable)
        .where(sql`ai_score IS NULL`)
        .orderBy(asc(postsTable.caseNumber));

      const total = articles.length;
      let done = 0;
      let failed = 0;

      detectAllStatus = { phase: "running", total, done, failed, current: "" };
      console.log(`[DetectAll] Starting bulk detection for ${total} untested articles`);

      for (let i = 0; i < articles.length; i++) {
        const article = articles[i];
        detectAllStatus = { phase: "running", total, done, failed, current: article.caseNumber };

        // Attempt with exponential backoff (up to 3 retries)
        let scored = false;
        for (let attempt = 1; attempt <= 3; attempt++) {
          try {
            const { score } = await detectAI(article.body);
            await db
              .update(postsTable)
              .set({ aiScore: score, aiScoreTestedAt: new Date() })
              .where(eq(postsTable.id, article.id));
            done++;
            scored = true;
            console.log(`[DetectAll] ${article.caseNumber}: ${score}% (${done}/${total})`);
            break;
          } catch (err) {
            const backoff = attempt * 15_000; // 15s, 30s, 45s
            console.warn(`[DetectAll] ${article.caseNumber} attempt ${attempt} failed — waiting ${backoff / 1000}s before retry:`, err);
            if (attempt < 3) await new Promise(r => setTimeout(r, backoff));
          }
        }

        if (!scored) {
          failed++;
          console.error(`[DetectAll] ${article.caseNumber} failed after 3 attempts — skipping`);
        }

        // 5-second base delay between every article
        await new Promise(r => setTimeout(r, 5000));

        // Every 20 articles, take a 45-second cooldown
        if ((i + 1) % 20 === 0 && i + 1 < articles.length) {
          console.log(`[DetectAll] Cooldown after ${i + 1} articles — pausing 45s`);
          detectAllStatus = { phase: "running", total, done, failed, current: "cooldown…" };
          await new Promise(r => setTimeout(r, 45_000));
        }
      }

      const durationSec = Math.round((Date.now() - startedAt) / 1000);
      detectAllStatus = { phase: "done", total, done, failed, durationSec };
      console.log(`[DetectAll] Complete. ${done} scored, ${failed} failed. ${durationSec}s`);
    } catch (err) {
      console.error("[DetectAll] Fatal error:", err);
      detectAllStatus = { phase: "idle" };
    }
  })();
});

let tagGenRunning = false;

router.post("/fixme/tags/generate-all", async (_req, res) => {
  if (tagGenRunning) {
    res.json({ status: "already_running", message: "Tag generation already in progress." });
    return;
  }

  res.json({ status: "started", message: "Tag generation running. Watch server logs for progress." });

  tagGenRunning = true;
  (async () => {
    try {
      const articles = await db
        .select({
          id: postsTable.id,
          caseNumber: postsTable.caseNumber,
          title: postsTable.title,
          teaser: postsTable.teaser,
          category: postsTable.category,
          subjectName: postsTable.subjectName,
          subjectTitle: postsTable.subjectTitle,
          subjectParty: postsTable.subjectParty,
        })
        .from(postsTable)
        .orderBy(asc(postsTable.caseNumber));

      console.log(`[TagGen] Starting tag generation for ${articles.length} articles`);

      const BATCH_SIZE = 5;
      let updated = 0;
      let failed = 0;

      for (let i = 0; i < articles.length; i += BATCH_SIZE) {
        const batch = articles.slice(i, i + BATCH_SIZE);
        const batchNums = batch.map(a => a.caseNumber).join(", ");

        try {
          const articlesText = batch.map(a => {
            const subjectLine = a.subjectName
              ? `Subject: ${a.subjectName}${a.subjectTitle ? `, ${a.subjectTitle}` : ""}${a.subjectParty && a.subjectParty !== "None" ? ` (${a.subjectParty})` : ""}`
              : "";
            return [
              `ARTICLE [${a.caseNumber}]:`,
              `Title: ${a.title}`,
              `Teaser: ${a.teaser ?? ""}`,
              `Category: ${CATEGORY_CONTEXT[a.category] ?? a.category}`,
              subjectLine,
            ].filter(Boolean).join("\n");
          }).join("\n\n---\n\n");

          const prompt = `You are an SEO strategist for an accountability journalism platform. Generate exactly 12-15 search-targeted keyword tags for each article.

Rules:
- Tags must match how real people search: specific names, events, years, searchable phrases
- For religion articles: include church name, pastor name, specific misconduct type (fraud, sex abuse, etc)
- For politician self-own articles: include politician name, party, the specific contradiction documented
- For debunking articles: include the false claim being debunked as a searchable phrase
- For historical articles: include specific people, events, dates
- For academic/NerdOut articles: include the academic concepts and primary sources
- Always include the subject's full name if one is named
- Mix short tags (person name) with longer specific phrases (what they did)
- Avoid purely generic tags like "news", "politics", "journalism", "article" alone
- Return ONLY valid JSON, no other text

${articlesText}

Return format:
{
  "CB-000XXX": ["tag1", "tag2", "tag3", ...],
  "CB-000YYY": ["tag1", "tag2", "tag3", ...]
}`;

          const response = await anthropic.messages.create({
            model: "claude-sonnet-4-5",
            max_tokens: 2048,
            messages: [{ role: "user", content: prompt }],
          });

          const text = (response.content[0] as { text: string }).text.trim();
          const jsonMatch = text.match(/\{[\s\S]*\}/);
          if (!jsonMatch) throw new Error(`No JSON in response for batch ${batchNums}`);

          const tagMap = JSON.parse(jsonMatch[0]) as Record<string, string[]>;

          for (const article of batch) {
            const tags = tagMap[article.caseNumber];
            if (!Array.isArray(tags) || tags.length === 0) {
              console.warn(`[TagGen] No tags returned for ${article.caseNumber}`);
              failed++;
              continue;
            }
            await db
              .update(postsTable)
              .set({ tags })
              .where(eq(postsTable.id, article.id));
            updated++;
          }

          console.log(`[TagGen] Batch ${Math.floor(i / BATCH_SIZE) + 1}/${Math.ceil(articles.length / BATCH_SIZE)} complete — ${batchNums} — ${updated} updated so far`);

          // Rate-limit pause between batches
          if (i + BATCH_SIZE < articles.length) {
            await new Promise(r => setTimeout(r, 1000));
          }
        } catch (batchErr) {
          console.error(`[TagGen] Batch ${batchNums} failed:`, batchErr);
          failed += batch.length;
        }
      }

      console.log(`[TagGen] Complete. ${updated} articles updated, ${failed} failed.`);
    } catch (err) {
      console.error("[TagGen] Fatal error:", err);
    } finally {
      tagGenRunning = false;
    }
  })();
});

// ═══════════════════════════════════════════════════════════════════════════
// CB PIPELINE — Category-by-category AI reduction with ML feedback loop
// ═══════════════════════════════════════════════════════════════════════════

// GET /api/fixme/pipeline/map — live article counts per category
router.get("/fixme/pipeline/map", async (_req, res) => {
  res.setHeader("Cache-Control", "no-store");
  try {
    const target = 49;
    const map = await getCategoryMap(target);
    const total = map.reduce((s, c) => s + c.articlesNeedingReduction, 0);
    res.json({
      target,
      totalArticlesNeedingReduction: total,
      categoryOrder: map,
    });
  } catch (err) {
    res.status(500).json({ error: String(err) });
  }
});

// GET /api/fixme/pipeline/status — current run state + last category report
router.get("/fixme/pipeline/status", (_req, res) => {
  res.setHeader("Cache-Control", "no-store");
  const state = getPipelineState();
  const lessons = getLessonsSummary();
  res.json({ pipeline: state, lessons });
});

// GET /api/fixme/pipeline/lessons — full lessons store
router.get("/fixme/pipeline/lessons", (_req, res) => {
  res.setHeader("Cache-Control", "no-store");
  res.json(loadLessons());
});

// GET /api/fixme/pipeline/categories — list valid category slugs
router.get("/fixme/pipeline/categories", (_req, res) => {
  res.json({ categories: CATEGORY_ORDER });
});

// POST /api/fixme/pipeline/stop — stop after current article
router.post("/fixme/pipeline/stop", (_req, res) => {
  stopPipeline();
  res.json({ message: "Stop requested. Pipeline will halt after the current article." });
});

// POST /api/fixme/pipeline/scan-closing/:category
// Retroactive closing malformation scan — runs on ALL articles in a category
// (including already-locked ones). Uses the shared service function.
router.post("/fixme/pipeline/scan-closing/:category", async (req, res) => {
  const { category } = req.params as { category: string };
  res.json({
    message: `Retroactive closing scan started for category: ${category}`,
    note: "Check server logs for per-article results.",
  });
  runClosingScan(category).catch(err => console.error(`[ClosingScan] Error:`, err));
});

// GET /api/fixme/pipeline/fullrun-status — status of the all-categories run
router.get("/fixme/pipeline/fullrun-status", (_req, res) => {
  res.setHeader("Cache-Control", "no-store");
  res.json(getFullRunState());
});

// POST /api/fixme/pipeline/run-all — run ALL remaining categories (closing scan + pipeline each)
// Optional body: { startFrom: "category_slug", target: 49 }
router.post("/fixme/pipeline/run-all", async (req, res) => {
  const startFrom: string | null = req.body?.startFrom ?? null;
  const target: number = typeof req.body?.target === "number" ? req.body.target : 49;

  const fullState = getFullRunState();
  if (fullState.active) {
    res.status(409).json({
      error: "Full run already active",
      categories: fullState.categories.map(c => `${c.category}: ${c.status}`),
    });
    return;
  }

  const pipeState = getPipelineState();
  if (pipeState.running) {
    res.status(409).json({
      error: "Single-category pipeline is running. Stop it first or wait for it to finish.",
      currentCategory: pipeState.currentCategory,
    });
    return;
  }

  res.json({
    message: `Full auto-chain started. Each category: closing scan → pipeline → ML update.`,
    startFrom: startFrom ?? "native_and_first_nations (first in order)",
    target,
    note: "Poll GET /api/fixme/pipeline/fullrun-status for progress.",
  });

  runAllRemaining(startFrom, target).catch(err => {
    console.error("[RunAll] Fatal error:", err);
  });
});

// POST /api/fixme/pipeline/run/:category — run ONE category then stop
router.post("/fixme/pipeline/run/:category", async (req, res) => {
  const { category } = req.params as { category: string };
  const target: number = typeof req.body?.target === "number" ? req.body.target : 49;

  const validCategories: readonly string[] = CATEGORY_ORDER;
  if (!validCategories.includes(category)) {
    res.status(400).json({
      error: `Unknown category "${category}"`,
      validCategories,
    });
    return;
  }

  const state = getPipelineState();
  if (state.running) {
    res.status(409).json({
      error: "Pipeline already running",
      currentCategory: state.currentCategory,
      processedInCategory: state.processedInCategory,
      totalInCategory: state.totalInCategory,
    });
    return;
  }

  // Respond immediately — pipeline runs in background
  res.json({
    message: `Pipeline started for category: ${category} | target: ≤${target}%`,
    category,
    target,
    note: "Poll GET /api/fixme/pipeline/status for progress. Pipeline stops after this category.",
  });

  // Fire and forget — do not await
  runCategory(category, target).catch(err => {
    console.error(`[Pipeline] Unhandled error in category ${category}:`, err);
  });
});

export default router;
