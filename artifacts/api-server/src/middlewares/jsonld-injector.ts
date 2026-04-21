/**
 * JSON-LD Server Injection Middleware — Article Pages (Phase 1)
 *
 * Production-only. Intercepts /article/:slug requests, looks up the article
 * in the DB, builds NewsArticle + BreadcrumbList JSON-LD, injects it into
 * <head> of index.html, and serves the enriched HTML.
 *
 * Googlebot and SGE extraction pipelines receive structured data at first byte,
 * before any JavaScript executes.
 *
 * Falls through to next() on any error — the SPA still works as fallback.
 */

import { type Request, type Response, type NextFunction } from "express";
import fs from "fs";
import path from "path";
import { sql } from "drizzle-orm";
import { db } from "@workspace/db";
import { postsTable } from "@workspace/db/schema";

const ARTICLE_PATH_RE = /^\/article\/([^/?#]+)\/?$/;

const CATEGORY_LABELS: Record<string, string> = {
  self_owned:              "Self-Owned",
  law_and_justice:         "Law & Justice Files",
  money_and_power:         "Money & Power",
  us_constitution:         "U.S. Constitution",
  women_and_girls:         "Women & Girls",
  anti_racist_heroes:      "Anti-Racist Heroes",
  us_history:              "U.S. History",
  religion:                "Religion",
  investigations:          "Investigations",
  war_and_inhumanity:      "War & Inhumanity",
  health_and_healing:      "Health & Healing",
  technology:              "Technology",
  censorship:              "Censorship",
  global_south:            "Global South",
  how_it_works:            "How It Works",
  nerd_out:                "NerdOut / Academic",
  native_and_first_nations:"Native & First Nations",
  disarming_hate:          "Disarming Hate",
  reasons_pen:             "Reason's Pen",
};

const PUBLISHER_BLOCK = {
  "@type": ["NewsMediaOrganization", "ResearchOrganization"],
  name: "ClownBinge",
  url: "https://clownbinge.com",
  logo: {
    "@type": "ImageObject",
    url: "https://clownbinge.com/cb-og-image.png",
    width: 1200,
    height: 630,
  },
  parentOrganization: {
    "@type": "Organization",
    name: "Laughphoria Informatics LLC",
  },
};

function buildSchemas(post: {
  title: string;
  slug: string;
  teaser: string;
  category: string;
  tags: string[] | null;
  publishedAt: Date | null;
}): object[] {
  const canonical = `https://clownbinge.com/article/${post.slug}`;
  const categoryLabel = CATEGORY_LABELS[post.category] ?? post.category;
  const isScholarlyType = post.category === "reasons_pen" || post.category === "nerd_out";
  const articleType = isScholarlyType
    ? ["NewsArticle", "ScholarlyArticle"]
    : "NewsArticle";
  const iso = post.publishedAt ? new Date(post.publishedAt).toISOString() : undefined;

  const article: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": articleType,
    headline: post.title,
    description: post.teaser,
    articleSection: categoryLabel,
    keywords: Array.isArray(post.tags) ? post.tags.join(", ") : "",
    isAccessibleForFree: "False",
    hasPart: {
      "@type": "WebPageElement",
      isAccessibleForFree: "False",
      cssSelector: ".cb-article-body",
    },
    mainEntityOfPage: { "@type": "WebPage", "@id": canonical },
    author: PUBLISHER_BLOCK,
    publisher: PUBLISHER_BLOCK,
  };

  if (iso) {
    article.datePublished = iso;
    article.dateModified = iso;
  }

  const breadcrumb = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: "https://clownbinge.com" },
      { "@type": "ListItem", position: 2, name: categoryLabel, item: `https://clownbinge.com/category/${post.category}` },
      { "@type": "ListItem", position: 3, name: post.title, item: canonical },
    ],
  };

  return [article, breadcrumb];
}

let cachedIndexHtml: string | null = null;

function getIndexHtml(distPath: string): string | null {
  if (cachedIndexHtml) return cachedIndexHtml;
  const indexPath = path.join(distPath, "index.html");
  if (!fs.existsSync(indexPath)) return null;
  cachedIndexHtml = fs.readFileSync(indexPath, "utf8");
  return cachedIndexHtml;
}

export function jsonLdInjector(distPath: string) {
  return async function (req: Request, res: Response, next: NextFunction): Promise<void> {
    const match = req.path.match(ARTICLE_PATH_RE);
    if (!match) return next();

    const slug = match[1];

    try {
      const rows = await db
        .select({
          title:       postsTable.title,
          slug:        postsTable.slug,
          teaser:      postsTable.teaser,
          category:    postsTable.category,
          tags:        postsTable.tags,
          publishedAt: postsTable.publishedAt,
        })
        .from(postsTable)
        .where(sql`${postsTable.slug} = ${slug}`)
        .limit(1);

      const indexHtml = getIndexHtml(distPath);
      if (!indexHtml) return next();

      if (rows.length === 0) {
        res.setHeader("Content-Type", "text/html; charset=utf-8");
        res.send(indexHtml);
        return;
      }

      const post = rows[0];
      const schemas = buildSchemas(post);
      const scriptTags = schemas
        .map((s) => `<script type="application/ld+json">${JSON.stringify(s)}</script>`)
        .join("\n");

      const enriched = indexHtml.replace("</head>", `${scriptTags}\n</head>`);
      res.setHeader("Content-Type", "text/html; charset=utf-8");
      res.send(enriched);
    } catch {
      next();
    }
  };
}
