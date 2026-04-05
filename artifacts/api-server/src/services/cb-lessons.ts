/**
 * cb-lessons.ts — Machine learning feedback loop for the CB generator brain.
 *
 * Errors caught during pipeline auto-repair and quality scanning are recorded
 * here. When a pattern appears enough times across articles, it is "promoted"
 * to a machine-learned rule and injected into the generator SYSTEM_PROMPT at
 * runtime — making the generator progressively smarter with each pipeline run.
 *
 * No human edits required. The lessons file is the persistent memory.
 */

import * as fs from "fs";
import * as path from "path";

// ── Types ──────────────────────────────────────────────────────────────────

export type LessonType =
  | "ordinal_error"
  | "congress_format"
  | "em_dash"
  | "contraction"
  | "entity_correction"
  | "double_word"
  | "redundant_percent"
  | "plural_million"
  | "quality_number_missing"
  | "quality_noun_missing"
  | "quality_quote_missing"
  | "custom";

export interface LessonEntry {
  lessonType: LessonType;
  description: string;
  before: string;
  after: string;
  count: number;
  promoted: boolean;
  promotedToRule?: string;
  firstSeen: string;
  lastSeen: string;
  exampleArticles: string[];
}

export interface LessonsStore {
  version: number;
  lastUpdated: string;
  totalArticlesProcessed: number;
  totalRepairsApplied: number;
  patterns: Record<string, LessonEntry>;
  machineLearnedRules: string[];
}

// ── Promotion threshold — how many times a pattern must appear to become a rule

const PROMOTION_THRESHOLD = 2;

// ── File path ─────────────────────────────────────────────────────────────

const LESSONS_PATH = path.join(__dirname, "../../cb-lessons.json");

// ── Load / Save ───────────────────────────────────────────────────────────

function emptyStore(): LessonsStore {
  return {
    version: 1,
    lastUpdated: new Date().toISOString(),
    totalArticlesProcessed: 0,
    totalRepairsApplied: 0,
    patterns: {},
    machineLearnedRules: [],
  };
}

export function loadLessons(): LessonsStore {
  try {
    if (fs.existsSync(LESSONS_PATH)) {
      return JSON.parse(fs.readFileSync(LESSONS_PATH, "utf8")) as LessonsStore;
    }
  } catch {
    console.warn("[CBLessons] Failed to load lessons file — starting fresh");
  }
  return emptyStore();
}

function saveLessons(store: LessonsStore): void {
  try {
    store.lastUpdated = new Date().toISOString();
    fs.writeFileSync(LESSONS_PATH, JSON.stringify(store, null, 2), "utf8");
  } catch (e) {
    console.error("[CBLessons] Failed to save lessons file:", e);
  }
}

// ── Record a caught error ─────────────────────────────────────────────────

export interface CaughtError {
  lessonType: LessonType;
  before: string;
  after: string;
  description?: string;
  caseNumber: string;
}

export function recordErrors(errors: CaughtError[]): void {
  if (errors.length === 0) return;
  const store = loadLessons();
  const now = new Date().toISOString();

  for (const err of errors) {
    const key = `${err.lessonType}::${err.before}→${err.after}`;
    const existing = store.patterns[key];

    if (existing) {
      existing.count++;
      existing.lastSeen = now;
      if (!existing.exampleArticles.includes(err.caseNumber)) {
        existing.exampleArticles = [...existing.exampleArticles.slice(-4), err.caseNumber];
      }
    } else {
      store.patterns[key] = {
        lessonType: err.lessonType,
        description: err.description ?? `"${err.before}" corrected to "${err.after}"`,
        before: err.before,
        after: err.after,
        count: 1,
        promoted: false,
        firstSeen: now,
        lastSeen: now,
        exampleArticles: [err.caseNumber],
      };
    }

    store.totalRepairsApplied++;
  }

  // ── Promote patterns that cross the threshold ──────────────────────────
  for (const [, entry] of Object.entries(store.patterns)) {
    if (!entry.promoted && entry.count >= PROMOTION_THRESHOLD) {
      entry.promoted = true;
      const rule = deriveRule(entry);
      if (rule && !store.machineLearnedRules.includes(rule)) {
        store.machineLearnedRules.push(rule);
        console.log(`[CBLessons] PROMOTED to machine-learned rule: ${rule}`);
      }
      entry.promotedToRule = rule ?? undefined;
    }
  }

  saveLessons(store);
}

export function incrementArticlesProcessed(): void {
  const store = loadLessons();
  store.totalArticlesProcessed++;
  saveLessons(store);
}

// ── Derive a generator rule from a pattern ────────────────────────────────

function deriveRule(entry: LessonEntry): string | null {
  switch (entry.lessonType) {
    case "ordinal_error": {
      // Extract the number from the "before" field
      const m = entry.before.match(/^(\d+)(st|nd|rd|th)$/);
      if (m) {
        const n = parseInt(m[1], 10);
        const correct = correctOrdinalSuffix(n);
        return `Ordinal rule: ${n} takes suffix -${correct}, never -${m[2]}. Example: "${entry.before}" is always "${entry.after}".`;
      }
      return `Ordinal error: write "${entry.after}" not "${entry.before}".`;
    }
    case "congress_format":
      return `Congress format: Always write "Nth Congress" (e.g., "105th Congress"), never "Congress number N".`;
    case "em_dash":
      return `No em dashes (—) in article body. Use a comma or restructure the sentence.`;
    case "contraction":
      return `No contractions. Write "${entry.after}" not "${entry.before}".`;
    case "entity_correction":
      return `Entity correction: Always write "${entry.after}", never "${entry.before}".`;
    case "double_word":
      return `Double-word error: "${entry.before}" should be "${entry.after}". Proofread for repeated words.`;
    case "redundant_percent":
      return `Do not write "X% percent" — write "X%" or "X percent", not both.`;
    case "plural_million":
      return `Write "$X million" (singular), not "$X millions".`;
    default:
      return `Writing rule: use "${entry.after}" not "${entry.before}".`;
  }
}

// ── Build the machine-learned rules block for injection into SYSTEM_PROMPT ─

export function buildLearnedRulesBlock(): string {
  const store = loadLessons();
  if (store.machineLearnedRules.length === 0) return "";

  const lines = [
    "",
    "MACHINE-LEARNED CORRECTIONS (auto-generated from pipeline error feedback — treat as hard rules):",
  ];

  store.machineLearnedRules.forEach((rule, i) => {
    lines.push(`ML${i + 1}. ${rule}`);
  });

  return lines.join("\n");
}

// ── Utility: correct ordinal suffix (mirrors cb-pipeline) ─────────────────

export function correctOrdinalSuffix(n: number): string {
  const r100 = n % 100;
  const r10 = n % 10;
  if (r100 >= 11 && r100 <= 13) return "th";
  if (r10 === 1) return "st";
  if (r10 === 2) return "nd";
  if (r10 === 3) return "rd";
  return "th";
}

// ── Get a summary for the pipeline status endpoint ────────────────────────

export function getLessonsSummary() {
  const store = loadLessons();
  const promoted = Object.values(store.patterns).filter(p => p.promoted).length;
  const pending = Object.values(store.patterns).filter(p => !p.promoted).length;
  return {
    totalArticlesProcessed: store.totalArticlesProcessed,
    totalRepairsApplied: store.totalRepairsApplied,
    totalPatterns: Object.keys(store.patterns).length,
    promotedPatterns: promoted,
    pendingPatterns: pending,
    machineLearnedRules: store.machineLearnedRules.length,
    lastUpdated: store.lastUpdated,
  };
}
