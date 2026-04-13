import { Router, type Request, type Response } from "express";
import { db, postsTable } from "@workspace/db";
import { eq, sql } from "drizzle-orm";
import { requireMetricadiaAuth } from "./editor-routes";
import fs from "fs";
import path from "path";

const router = Router();

// ── Case number generator ──────────────────────────────────────────────────────

async function nextCaseNumber(): Promise<string> {
  const rows = await db
    .select({ caseNumber: postsTable.caseNumber })
    .from(postsTable)
    .where(sql`${postsTable.caseNumber} ~ '^CB-[0-9]{6}$'`);

  let max = 0;
  for (const row of rows) {
    const num = parseInt(row.caseNumber.replace("CB-", ""), 10);
    if (!isNaN(num) && num > max) max = num;
  }
  return `CB-${String(max + 1).padStart(6, "0")}`;
}

// ── Sitemap update ─────────────────────────────────────────────────────────────

function updateSitemap(slug: string, category: string, lastVerified: string): void {
  const sitemapDir = process.env.SITEMAP_DIR;
  if (!sitemapDir) return;

  const entry = `  <url>\n    <loc>https://clownbinge.com/articles/${slug}</loc>\n    <lastmod>${lastVerified}</lastmod>\n    <changefreq>monthly</changefreq>\n    <priority>0.8</priority>\n  </url>`;
  const catFile = path.join(sitemapDir, `sitemap-${category.replace(/_/g, "-")}.xml`);
  const masterFile = path.join(sitemapDir, "sitemap.xml");

  try {
    if (fs.existsSync(catFile)) {
      let xml = fs.readFileSync(catFile, "utf8");
      xml = xml.replace("</urlset>", `${entry}\n</urlset>`);
      fs.writeFileSync(catFile, xml, "utf8");
    } else {
      const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${entry}\n</urlset>`;
      fs.writeFileSync(catFile, xml, "utf8");
    }

    if (fs.existsSync(masterFile)) {
      const now = new Date().toISOString().split("T")[0];
      let xml = fs.readFileSync(masterFile, "utf8");
      const catRelative = `sitemap-${category.replace(/_/g, "-")}.xml`;
      const re = new RegExp(`(<loc>[^<]*${catRelative}</loc>\\s*<lastmod>)[^<]*(</lastmod>)`);
      if (re.test(xml)) {
        xml = xml.replace(re, `$1${now}$2`);
      }
      fs.writeFileSync(masterFile, xml, "utf8");
    }
  } catch {
    // Sitemap update is best-effort — do not fail the publish
  }
}

// ── POST /wizard/publish ───────────────────────────────────────────────────────

router.post("/wizard/publish", requireMetricadiaAuth, async (req: Request, res: Response) => {
  try {
    const data = req.body as Record<string, unknown>;

    if (!data.title || !data.slug || !data.body || !data.category) {
      return res.status(400).json({ ok: false, error: "Missing required fields: title, slug, body, category." });
    }

    // Slug uniqueness
    const existing = await db
      .select({ id: postsTable.id })
      .from(postsTable)
      .where(eq(postsTable.slug, data.slug as string))
      .limit(1);

    if (existing.length > 0) {
      return res.status(409).json({ ok: false, error: `Slug "${data.slug}" already exists.` });
    }

    const caseNumber = await nextCaseNumber();
    const canonicalUrl = (data.canonicalUrl as string) || `https://clownbinge.com/articles/${data.slug}`;
    const ogTitle = (data.ogTitle as string) || (data.metaTitle as string) || (data.title as string);
    const ogDescription = (data.ogDescription as string) || (data.metaDescription as string) || "";
    const twitterCard = (data.twitterCard as string) || "summary_large_image";
    const authorName = (data.authorName as string) || "ClownBinge Staff";
    const schemaType = (data.schemaType as string) || "NewsArticle";
    const lastVerified = (data.lastVerified as string) || new Date().toISOString().split("T")[0];

    const schemaMarkup = (data.schemaMarkup && typeof data.schemaMarkup === "object")
      ? data.schemaMarkup
      : {
          "@context": "https://schema.org",
          "@type": schemaType,
          headline: data.metaTitle || data.title,
          description: data.metaDescription || "",
          author: { "@type": "Organization", name: authorName, url: "https://clownbinge.com" },
          publisher: {
            "@type": "Organization",
            name: "ClownBinge",
            url: "https://clownbinge.com",
            logo: { "@type": "ImageObject", url: "https://clownbinge.com/logo.png" },
          },
          datePublished: data.publishedAt,
          dateModified: lastVerified,
          mainEntityOfPage: { "@type": "WebPage", "@id": canonicalUrl },
          keywords: Array.isArray(data.keywords) ? (data.keywords as string[]).join(", ") : "",
          articleSection: data.category,
          ...(data.ogImage ? { image: { "@type": "ImageObject", url: data.ogImage } } : {}),
        };

    const [inserted] = await db.insert(postsTable).values({
      caseNumber,
      title: data.title as string,
      slug: data.slug as string,
      teaser: (data.teaser as string) || "",
      body: data.body as string,
      category: data.category as any,
      subjectName: (data.subjectName as string) || null,
      subjectTitle: (data.subjectTitle as string) || null,
      subjectParty: (data.subjectParty as string) || null,
      verifiedSource: (data.verifiedSource as string) || null,
      selfOwnScore: (data.selfOwnScore as number) || null,
      tags: Array.isArray(data.tags) ? (data.tags as string[]) : [],
      schemaMarkup,
      status: "published",
      dateOfIncident: (data.dateOfIncident as string) || null,
      publishedAt: data.publishedAt ? new Date(data.publishedAt as string) : new Date(),
      nerdAccessible: true,
      seoMetaTitle: (data.metaTitle as string) || null,
      seoMetaDescription: (data.metaDescription as string) || null,
      canonicalUrl,
      ogTitle,
      ogDescription,
      ogImage: (data.ogImage as string) || null,
      twitterCard,
      wordCount: (data.wordCount as number) || null,
      readingTimeMinutes: (data.readingTimeMinutes as number) || null,
      keywords: Array.isArray(data.keywords) ? (data.keywords as string[]) : [],
      primarySources: (data.apaReferences as any) || null,
      seriesName: (data.seriesName as string) || null,
      seriesSequence: (data.seriesSequence as string) || null,
      seriesThesis: (data.seriesThesis as string) || null,
    }).returning({ id: postsTable.id, caseNumber: postsTable.caseNumber, slug: postsTable.slug });

    updateSitemap(inserted.slug, data.category as string, lastVerified);

    return res.json({
      ok: true,
      caseNumber: inserted.caseNumber,
      url: `https://clownbinge.com/case/${inserted.slug}`,
    });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    console.error("[publish-routes] Publish failed:", msg);
    return res.status(500).json({ ok: false, error: msg });
  }
});

export default router;
