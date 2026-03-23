import { readFileSync } from "fs";
import { db, pool, postsTable } from "@workspace/db";

interface ArticleInput {
  title: string;
  slug: string;
  teaser: string;
  body: string;
  category: string;
  subjectName: string | null;
  subjectTitle: string | null;
  subjectParty: string | null;
  verifiedSource: string;
  selfOwnScore: number | null;
  tags: string[];
  dateOfIncident: string;
  publishedAt?: string;
  hasVideo?: boolean;
  videoUrl?: string;
}

async function getNextCaseNumber(): Promise<string> {
  const result = await pool.query(
    "SELECT case_number FROM posts ORDER BY case_number DESC LIMIT 1"
  );
  if (result.rows.length === 0) return "CB-000001";

  const last: string = result.rows[0].case_number;
  const match = last.match(/CB-(\d+)/);
  if (!match) return "CB-000001";

  const next = parseInt(match[1], 10) + 1;
  return `CB-${String(next).padStart(6, "0")}`;
}

async function main() {
  const filePath = process.argv[2];

  if (!filePath) {
    console.error("Usage: pnpm tsx src/insert-article.ts <path-to-json>");
    console.error("Example: pnpm tsx src/insert-article.ts ../../attached_assets/my-article.json");
    process.exit(1);
  }

  let raw: string;
  try {
    raw = readFileSync(filePath, "utf8");
  } catch {
    console.error(`Cannot read file: ${filePath}`);
    process.exit(1);
  }

  let article: ArticleInput;
  try {
    article = JSON.parse(raw);
  } catch {
    console.error("Invalid JSON in file.");
    process.exit(1);
  }

  const alwaysRequired = ["title", "slug", "teaser", "body", "category", "verifiedSource"];
  const noSubjectCategories = [
    "the_record_confirms_it",
    "constitutional_record",
    "the_receipts",
    "how_it_works",
    "cb_exclusive",
  ];
  const subjectRequired = noSubjectCategories.includes(article.category) ? [] : ["subjectName", "subjectTitle"];
  const required = [...alwaysRequired, ...subjectRequired];
  const missing = required.filter(k => !(article as any)[k]);
  if (missing.length > 0) {
    console.error(`Missing required fields: ${missing.join(", ")}`);
    process.exit(1);
  }

  const existing = await db.query.postsTable.findFirst({
    where: (p, { eq }) => eq(p.slug, article.slug),
  });

  if (existing) {
    console.log(`Already exists: ${existing.caseNumber} — ${existing.slug}`);
    process.exit(0);
  }

  const caseNumber = await getNextCaseNumber();

  const [inserted] = await db.insert(postsTable).values({
    caseNumber,
    title: article.title,
    slug: article.slug,
    teaser: article.teaser,
    body: article.body,
    category: article.category as any,
    subjectName: article.subjectName,
    subjectTitle: article.subjectTitle,
    subjectParty: article.subjectParty,
    verifiedSource: article.verifiedSource,
    hasVideo: article.hasVideo ?? false,
    videoUrl: article.videoUrl ?? null,
    selfOwnScore: article.selfOwnScore ?? null,
    tags: article.tags ?? [],
    status: "published",
    dateOfIncident: article.dateOfIncident,
    publishedAt: article.publishedAt ? new Date(article.publishedAt) : new Date(),
  }).returning();

  console.log(`\nInserted: ${inserted.caseNumber}`);
  console.log(`Slug:     ${inserted.slug}`);
  console.log(`URL:      /case/${inserted.slug}`);
  process.exit(0);
}

main().catch(e => {
  console.error(e);
  process.exit(1);
});
