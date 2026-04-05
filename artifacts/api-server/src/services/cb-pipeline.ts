/**
 * cb-pipeline.ts — Category-based AI-reduction pipeline.
 *
 * Processes ONE category at a time. After each category completes:
 *   1. Auto-repairs are applied (ordinals, em-dashes, contractions, etc.)
 *   2. Quality scan runs against seed originals
 *   3. Machine-learning updates fire — new patterns promote to generator rules
 *   4. Pipeline STOPS — user manually triggers the next category
 *
 * Errors caught here make CB smarter for future article generation.
 */

import { db, postsTable } from "@workspace/db";
import { eq, and, gt, isNull, or, asc } from "drizzle-orm";
import { reduceAI } from "./cb-reducer";
import { recordErrors, incrementArticlesProcessed, correctOrdinalSuffix, type CaughtError } from "./cb-lessons";
import * as path from "path";
import * as fs from "fs";

// ── Category execution order (largest batch first, then descending) ────────

export const CATEGORY_ORDER = [
  "native_and_first_nations",  // 48 articles
  "anti_racist_heroes",        // 26
  "technology",                // 18
  "health_and_healing",        // 14
  "money_and_power",           // 12
  "global_south",              // 11
  "us_history",                // 9
  "women_and_girls",           // 6
  "war_and_inhumanity",        // 5
  "censorship",                // 5
  "law_and_justice",           // 4
  "self_owned",                // 3
  "nerd_out",                  // 2
  "religion",                  // 1
] as const;

export type PipelineCategory = typeof CATEGORY_ORDER[number];

// ── Types ──────────────────────────────────────────────────────────────────

export interface Repair {
  type: string;
  before: string;
  after: string;
}

export interface QualityIssue {
  type: "number_missing" | "proper_noun_missing" | "quote_missing";
  detail: string;
}

export interface ArticleResult {
  caseNumber: string;
  title: string;
  initialScore: number;
  finalScore: number;
  reachedTarget: boolean;
  repairs: Repair[];
  qualityIssues: QualityIssue[];
  skipped: boolean;
  skipReason?: string;
  error?: string;
}

export interface CategoryReport {
  category: string;
  target: number;
  startedAt: string;
  completedAt: string;
  totalArticles: number;
  reached: number;
  failed: number;
  skipped: number;
  totalRepairs: number;
  totalQualityIssues: number;
  newLearnedRules: string[];
  articles: ArticleResult[];
}

export interface PipelineState {
  running: boolean;
  currentCategory: string | null;
  currentArticle: string | null;
  processedInCategory: number;
  totalInCategory: number;
  target: number;
  lastReport: CategoryReport | null;
  startedAt: string | null;
  stoppedAt: string | null;
}

// ── State ──────────────────────────────────────────────────────────────────

const state: PipelineState = {
  running: false,
  currentCategory: null,
  currentArticle: null,
  processedInCategory: 0,
  totalInCategory: 0,
  target: 49,
  lastReport: null,
  startedAt: null,
  stoppedAt: null,
};

let _stopRequested = false;

export function getPipelineState(): PipelineState {
  return { ...state };
}

export function stopPipeline(): void {
  _stopRequested = true;
  console.log("[Pipeline] Stop requested — will halt after current article finishes.");
}

function sleep(ms: number): Promise<void> {
  return new Promise(r => setTimeout(r, ms));
}

// ── Seed originals cache ───────────────────────────────────────────────────

let _seedCache: Map<string, string> | null = null;

function seedOriginals(): Map<string, string> {
  if (_seedCache) return _seedCache;
  // Try multiple candidate paths — the compiled bundle lands in dist/ so __dirname
  // shifts one level. process.cwd() is always the project root (artifacts/api-server/).
  const candidates = [
    path.join(process.cwd(), "src/posts-seed.json"),
    path.join(__dirname, "../src/posts-seed.json"),
    path.join(__dirname, "../../src/posts-seed.json"),
    path.join(__dirname, "../posts-seed.json"),
  ];
  for (const p of candidates) {
    try {
      if (fs.existsSync(p)) {
        const raw = JSON.parse(fs.readFileSync(p, "utf8")) as Array<{ case_number: string; body: string }>;
        _seedCache = new Map(raw.map(r => [r.case_number, r.body]));
        console.log(`[Pipeline] Loaded ${_seedCache.size} seed originals from ${p}`);
        return _seedCache;
      }
    } catch {
      // try next candidate
    }
  }
  console.warn("[Pipeline] Could not load posts-seed.json — quality scan will compare against pre-reduction body");
  _seedCache = new Map();
  return _seedCache;
}

// ── Auto-repair ────────────────────────────────────────────────────────────
// These are purely computational fixes the AI quality gate cannot catch.
// Every fix here is unambiguously wrong regardless of context.

export function autoRepair(html: string): { html: string; repairs: Repair[] } {
  const repairs: Repair[] = [];
  let fixed = html;

  // 1. Wrong ordinal suffixes
  //    Rule: numbers ending in 11/12/13 (and N11/N12/N13) always use -th
  //    e.g. 112nd → 112th, 11st → 11th, 113rd → 113th, 12nd → 12th
  fixed = fixed.replace(/\b(\d+)(st|nd|rd|th)\b/gi, (match, numStr: string, suffix: string) => {
    const n = parseInt(numStr, 10);
    const correct = correctOrdinalSuffix(n);
    if (suffix.toLowerCase() !== correct) {
      const after = `${numStr}${correct}`;
      repairs.push({ type: "ordinal_error", before: match, after });
      return after;
    }
    return match;
  });

  // 2. "Congress number N" format → "Nth Congress"
  fixed = fixed.replace(/Congress number (\d+)/gi, (_match, numStr: string) => {
    const n = parseInt(numStr, 10);
    const after = `${n}${correctOrdinalSuffix(n)} Congress`;
    repairs.push({ type: "congress_format", before: _match, after });
    return after;
  });

  // 3. Em dashes — → comma (belt and suspenders; generator already blocks them)
  fixed = fixed.replace(/\s*\u2014\s*/g, (match) => {
    repairs.push({ type: "em_dash", before: match.trim() || "—", after: "," });
    return ", ";
  });
  // En dash used as em dash
  fixed = fixed.replace(/\s*\u2013\s*/g, (match) => {
    repairs.push({ type: "em_dash", before: match.trim() || "–", after: "," });
    return ", ";
  });

  // 4. Contractions (survive reduction when the original sentence wasn't rewritten)
  const contractions: Array<[RegExp, string, string]> = [
    [/\bweren't\b/g, "weren't", "were not"],
    [/\bwasn't\b/g, "wasn't", "was not"],
    [/\bdidn't\b/g, "didn't", "did not"],
    [/\bdon't\b/g, "don't", "do not"],
    [/\bdoesn't\b/g, "doesn't", "does not"],
    [/\bcan't\b/g, "can't", "cannot"],
    [/\bcouldn't\b/g, "couldn't", "could not"],
    [/\bwouldn't\b/g, "wouldn't", "would not"],
    [/\bshouldn't\b/g, "shouldn't", "should not"],
    [/\bisn't\b/g, "isn't", "is not"],
    [/\baren't\b/g, "aren't", "are not"],
    [/\bhasn't\b/g, "hasn't", "has not"],
    [/\bhaven't\b/g, "haven't", "have not"],
    [/\bhadn't\b/g, "hadn't", "had not"],
    [/\bwon't\b/g, "won't", "will not"],
    [/\bwouldn't\b/g, "wouldn't", "would not"],
    [/\bit's\b/g, "it's", "it is"],
    [/\bthat's\b/g, "that's", "that is"],
    [/\bthere's\b/g, "there's", "there is"],
    [/\bthey're\b/g, "they're", "they are"],
    [/\bthey've\b/g, "they've", "they have"],
    [/\bthey'd\b/g, "they'd", "they had"],
    [/\bwe're\b/g, "we're", "we are"],
    [/\bwe've\b/g, "we've", "we have"],
    [/\bwe'd\b/g, "we'd", "we had"],
    [/\bwho's\b/g, "who's", "who is"],
    [/\bwho'd\b/g, "who'd", "who had"],
    [/\bhe's\b/g, "he's", "he is"],
    [/\bshe's\b/g, "she's", "she is"],
    [/\bI'm\b/g, "I'm", "I am"],
    [/\bI've\b/g, "I've", "I have"],
    [/\bI'd\b/g, "I'd", "I had"],
    [/\bI'll\b/g, "I'll", "I will"],
    [/\byou're\b/g, "you're", "you are"],
    [/\byou've\b/g, "you've", "you have"],
    [/\byou'd\b/g, "you'd", "you had"],
    [/\byou'll\b/g, "you'll", "you will"],
  ];

  for (const [re, before, after] of contractions) {
    fixed = fixed.replace(re, () => {
      repairs.push({ type: "contraction", before, after });
      return after;
    });
  }

  // 5. "$X millions" → "$X million" (pluralization error)
  fixed = fixed.replace(/\$[\d,.]+ millions\b/gi, (match) => {
    const after = match.replace(/millions/i, "million");
    repairs.push({ type: "plural_million", before: match, after });
    return after;
  });
  fixed = fixed.replace(/\b(\d[\d,.]*)\s+millions\b/gi, (_match, num: string) => {
    const after = `${num} million`;
    repairs.push({ type: "plural_million", before: _match, after });
    return after;
  });

  // 6. "X% percent" → "X percent" (redundant unit)
  fixed = fixed.replace(/(\d[\d.]*%)\s+percent\b/gi, (match, pct: string) => {
    const after = pct;
    repairs.push({ type: "redundant_percent", before: match, after });
    return after;
  });

  // 7. Known entity corrections — factual errors caught in prior articles
  const entityFixes: Array<[RegExp, string, string]> = [
    [/\bJames Hamilton\b/g, "James Hamilton", "Alexander Hamilton"],
  ];
  for (const [re, before, after] of entityFixes) {
    fixed = fixed.replace(re, () => {
      repairs.push({ type: "entity_correction", before, after });
      return after;
    });
  }

  // 8. Double words ("the the", "of of", "in in", etc.)
  fixed = fixed.replace(/\b(\w+)\s+\1\b/gi, (match, word: string) => {
    const after = word;
    repairs.push({ type: "double_word", before: match, after });
    return after;
  });

  return { html: fixed, repairs };
}

// ── Quality scan — compare reduced vs seed original ────────────────────────
// Flags potential factual losses. These are WARNINGS, not automatic fixes.

export function qualityScan(originalHtml: string, reducedHtml: string): QualityIssue[] {
  const issues: QualityIssue[] = [];

  const strip = (h: string) =>
    h.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();

  const orig = strip(originalHtml);
  const red = strip(reducedHtml);

  // 1. Numbers — every multi-digit number in the original must survive
  const numRe = /\b\d[\d,]*\.?\d*%?\b/g;
  const origNums = [...new Set(orig.match(numRe) ?? [])].filter(n => n.length >= 2);
  for (const num of origNums) {
    // Skip years within a likely citation block (4-digit numbers near "::")
    if (!red.includes(num)) {
      issues.push({ type: "number_missing", detail: `"${num}" not found in reduced body` });
    }
  }

  // 2. Multi-word proper nouns (2+ capitalised words, 8+ total chars)
  const properRe = /\b[A-Z][a-z]{1,}(?:\s+[A-Z][a-z]{1,})+\b/g;
  const origProper = [...new Set(orig.match(properRe) ?? [])]
    .filter(t => t.split(" ").length >= 2 && t.length >= 8);
  for (const term of origProper) {
    if (!red.includes(term)) {
      issues.push({ type: "proper_noun_missing", detail: `"${term}" not found in reduced body` });
    }
  }

  // 3. Direct quotes (10+ chars between quotes) must survive verbatim
  const quoteRe = /"([^"]{10,})"/g;
  let m: RegExpExecArray | null;
  while ((m = quoteRe.exec(orig)) !== null) {
    if (!red.includes(m[1])) {
      issues.push({ type: "quote_missing", detail: `Quote removed: "${m[1].slice(0, 80)}"` });
    }
  }

  return issues;
}

// ── Main category runner ───────────────────────────────────────────────────

export async function runCategory(category: string, target = 49): Promise<CategoryReport> {
  if (state.running) {
    throw new Error("Pipeline is already running. Stop the current run first.");
  }

  _stopRequested = false;
  state.running = true;
  state.currentCategory = category;
  state.currentArticle = null;
  state.processedInCategory = 0;
  state.target = target;
  state.startedAt = new Date().toISOString();
  state.stoppedAt = null;

  const startedAt = state.startedAt;

  console.log(`\n${"=".repeat(60)}`);
  console.log(`[Pipeline] Starting category: ${category} | target: ≤${target}%`);
  console.log(`${"=".repeat(60)}`);

  // Fetch articles needing reduction in this category
  const articles = await db
    .select({
      id: postsTable.id,
      caseNumber: postsTable.caseNumber,
      title: postsTable.title,
      aiScore: postsTable.aiScore,
      body: postsTable.body,
    })
    .from(postsTable)
    .where(
      and(
        eq(postsTable.category, category as any),
        eq(postsTable.locked, false),
        or(gt(postsTable.aiScore, target), isNull(postsTable.aiScore))
      )
    )
    .orderBy(asc(postsTable.aiScore)); // lowest score last = save easiest wins for momentum

  state.totalInCategory = articles.length;
  console.log(`[Pipeline] ${articles.length} articles need reduction in ${category}`);

  if (articles.length === 0) {
    const report: CategoryReport = {
      category,
      target,
      startedAt,
      completedAt: new Date().toISOString(),
      totalArticles: 0,
      reached: 0,
      failed: 0,
      skipped: 0,
      totalRepairs: 0,
      totalQualityIssues: 0,
      newLearnedRules: [],
      articles: [],
    };
    state.running = false;
    state.lastReport = report;
    return report;
  }

  const seeds = seedOriginals();
  const results: ArticleResult[] = [];
  const allErrors: CaughtError[] = [];

  for (let i = 0; i < articles.length; i++) {
    if (_stopRequested) {
      console.log("[Pipeline] Stop requested — halting before next article.");
      break;
    }

    const article = articles[i]!;
    state.currentArticle = article.caseNumber;
    state.processedInCategory = i + 1;

    console.log(`\n[Pipeline] [${i + 1}/${articles.length}] ${article.caseNumber} — score=${article.aiScore ?? "unscored"}`);

    const initialScore = article.aiScore ?? -1;
    const articleErrors: CaughtError[] = [];

    try {
      // Fetch the word count — skip articles under 800 words (can't reduce safely)
      const plain = article.body.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
      const wordCount = plain.split(/\s+/).filter(Boolean).length;

      if (wordCount < 800) {
        console.log(`[Pipeline] ${article.caseNumber}: SKIP — too short (${wordCount} words)`);
        results.push({
          caseNumber: article.caseNumber,
          title: article.title,
          initialScore,
          finalScore: initialScore,
          reachedTarget: false,
          repairs: [],
          qualityIssues: [],
          skipped: true,
          skipReason: `Body too short to reduce safely (${wordCount} words)`,
        });
        continue;
      }

      // ── Run reduction ────────────────────────────────────────────────────
      let latestBody = article.body;

      const result = await reduceAI(
        article.body,
        target,
        4,
        "journalism",
        async (savedBody: string, score: number) => {
          // Min-score protection: never inflate a score on a re-detection
          const currentScore = (
            await db
              .select({ aiScore: postsTable.aiScore })
              .from(postsTable)
              .where(eq(postsTable.id, article.id))
              .limit(1)
          )[0]?.aiScore;

          const scoreToSave =
            currentScore !== null && currentScore !== undefined && score > currentScore
              ? currentScore
              : score;

          await db
            .update(postsTable)
            .set({
              body: savedBody,
              aiScore: scoreToSave,
              aiScoreTestedAt: new Date(),
            })
            .where(eq(postsTable.id, article.id));

          latestBody = savedBody;
          console.log(`[Pipeline] ${article.caseNumber}: interim save at ${scoreToSave}%`);
        }
      );

      // Lock if target reached
      if (result.finalScore <= target) {
        await db
          .update(postsTable)
          .set({ locked: true, aiScore: result.finalScore, aiScoreTestedAt: new Date() })
          .where(eq(postsTable.id, article.id));
        console.log(`[Pipeline] ${article.caseNumber}: LOCKED at ${result.finalScore}%`);
      } else {
        // Still save the final score even if not at target
        await db
          .update(postsTable)
          .set({ aiScore: result.finalScore, aiScoreTestedAt: new Date() })
          .where(eq(postsTable.id, article.id));
        console.log(`[Pipeline] ${article.caseNumber}: Not at target — final score ${result.finalScore}%`);
      }

      // Re-fetch saved body (may differ from result.cleanedBody due to onSave calls)
      const [saved] = await db
        .select({ body: postsTable.body })
        .from(postsTable)
        .where(eq(postsTable.id, article.id))
        .limit(1);

      const bodyToRepair = saved?.body ?? latestBody;

      // ── Post-reduction auto-repair ───────────────────────────────────────
      const { html: repairedBody, repairs } = autoRepair(bodyToRepair);

      if (repairs.length > 0) {
        await db
          .update(postsTable)
          .set({ body: repairedBody })
          .where(eq(postsTable.id, article.id));

        for (const r of repairs) {
          console.log(`  [Repair] ${r.type}: "${r.before}" → "${r.after}"`);
          articleErrors.push({
            lessonType: r.type as any,
            before: r.before,
            after: r.after,
            caseNumber: article.caseNumber,
          });
        }
      }

      // ── Quality scan vs seed original ────────────────────────────────────
      const seedBody = seeds.get(article.caseNumber) ?? article.body;
      const qualityIssues = qualityScan(seedBody, repairedBody);

      if (qualityIssues.length > 0) {
        console.log(`  [QualityScan] ${qualityIssues.length} issues:`);
        for (const issue of qualityIssues) {
          console.log(`    ${issue.type}: ${issue.detail}`);
          articleErrors.push({
            lessonType: `quality_${issue.type}` as any,
            before: issue.detail,
            after: "(flagged for review)",
            caseNumber: article.caseNumber,
          });
        }
      }

      allErrors.push(...articleErrors);
      incrementArticlesProcessed();

      results.push({
        caseNumber: article.caseNumber,
        title: article.title,
        initialScore,
        finalScore: result.finalScore,
        reachedTarget: result.finalScore <= target,
        repairs,
        qualityIssues,
        skipped: false,
      });

      console.log(
        `[Pipeline] ${article.caseNumber}: ${initialScore}% → ${result.finalScore}% | ` +
        `repairs=${repairs.length} | issues=${qualityIssues.length} | ` +
        `reached=${result.finalScore <= target}`
      );

    } catch (err) {
      const errMsg = err instanceof Error ? err.message : String(err);
      console.error(`[Pipeline] ${article.caseNumber} ERROR:`, errMsg);
      results.push({
        caseNumber: article.caseNumber,
        title: article.title,
        initialScore,
        finalScore: initialScore,
        reachedTarget: false,
        repairs: [],
        qualityIssues: [],
        skipped: false,
        error: errMsg,
      });
    }

    // Rate limit: 30s between articles (except after the last one)
    if (!_stopRequested && i < articles.length - 1) {
      console.log(`[Pipeline] Waiting 30s before next article...`);
      await sleep(30_000);
    }
  }

  // ── Machine learning update ────────────────────────────────────────────
  console.log(`\n[Pipeline] Running machine-learning update for ${category}...`);
  const rulesBefore = (await import("./cb-lessons")).loadLessons().machineLearnedRules.slice();
  recordErrors(allErrors);
  const rulesAfter = (await import("./cb-lessons")).loadLessons().machineLearnedRules;
  const newLearnedRules = rulesAfter.filter(r => !rulesBefore.includes(r));

  if (newLearnedRules.length > 0) {
    console.log(`[Pipeline] ${newLearnedRules.length} new machine-learned rules promoted:`);
    for (const rule of newLearnedRules) {
      console.log(`  → ${rule}`);
    }
  } else {
    console.log("[Pipeline] No new rules promoted this run.");
  }

  // ── Category report ────────────────────────────────────────────────────
  const report: CategoryReport = {
    category,
    target,
    startedAt,
    completedAt: new Date().toISOString(),
    totalArticles: results.length,
    reached: results.filter(r => r.reachedTarget).length,
    failed: results.filter(r => !r.reachedTarget && !r.skipped && !r.error).length,
    skipped: results.filter(r => r.skipped).length,
    totalRepairs: results.reduce((s, r) => s + r.repairs.length, 0),
    totalQualityIssues: results.reduce((s, r) => s + r.qualityIssues.length, 0),
    newLearnedRules,
    articles: results,
  };

  console.log(`\n${"=".repeat(60)}`);
  console.log(`[Pipeline] CATEGORY COMPLETE: ${category}`);
  console.log(`  Articles: ${report.totalArticles} | Reached target: ${report.reached} | Failed: ${report.failed} | Skipped: ${report.skipped}`);
  console.log(`  Auto-repairs applied: ${report.totalRepairs}`);
  console.log(`  Quality issues flagged: ${report.totalQualityIssues}`);
  console.log(`  New ML rules: ${report.newLearnedRules.length}`);
  console.log(`  Pipeline STOPPED — ready for next category.`);
  console.log(`${"=".repeat(60)}\n`);

  state.running = false;
  state.currentCategory = null;
  state.currentArticle = null;
  state.lastReport = report;
  state.stoppedAt = new Date().toISOString();

  return report;
}

// ── Category map (live article counts from DB) ─────────────────────────────

export async function getCategoryMap(target = 49) {
  const rows = await db
    .select({
      category: postsTable.category,
    })
    .from(postsTable)
    .where(
      and(
        eq(postsTable.locked, false),
        or(gt(postsTable.aiScore, target), isNull(postsTable.aiScore))
      )
    );

  const counts: Record<string, number> = {};
  for (const row of rows) {
    counts[row.category] = (counts[row.category] ?? 0) + 1;
  }

  return CATEGORY_ORDER.map((cat, idx) => ({
    order: idx + 1,
    category: cat,
    articlesNeedingReduction: counts[cat] ?? 0,
  }));
}
