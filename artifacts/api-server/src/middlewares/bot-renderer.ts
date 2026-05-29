import { type Request, type Response, type NextFunction } from "express";
import { db, postsTable } from "@workspace/db";
import { eq, and } from "drizzle-orm";

const BOT_UA_PATTERNS = [
  "googlebot", "bingbot", "duckduckbot", "slurp", "yandexbot",
  "ahrefsbot", "semrushbot", "mj12bot", "ia_archiver",
  "twitterbot", "facebookexternalhit", "linkedinbot",
  "whatsapp", "telegrambot", "applebot",
  "gptbot", "chatgpt-user", "ccbot", "anthropic-ai", "claude-web",
  "perplexitybot", "oai-searchbot", "bytespider",
];

function isBot(ua: string): boolean {
  const lower = ua.toLowerCase();
  return BOT_UA_PATTERNS.some((p) => lower.includes(p));
}

const ARTICLE_PATH = /^\/articles\/([a-z0-9]+(?:-[a-z0-9]+)*)$/i;

function esc(s: string | null | undefined): string {
  if (!s) return "";
  return s
    .replace(/&/g, "&amp;")
    .replace(/"/g, "&quot;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

function renderCitations(verifiedSource: string | null | undefined): string {
  if (!verifiedSource) return "";
  if (!verifiedSource.includes("::")) {
    return `<p>${esc(verifiedSource)}</p>`;
  }
  return verifiedSource
    .split(";")
    .map((e) => e.trim())
    .filter(Boolean)
    .map((entry) => {
      const sep = entry.indexOf("::");
      const label = entry.slice(0, sep).trim();
      const body = entry.slice(sep + 2).trim();
      return `<div><strong>${esc(label)}</strong> — <span>${esc(body)}</span></div>`;
    })
    .join("\n");
}

function buildHtml(post: typeof postsTable.$inferSelect): string {
  const title = post.seoMetaTitle || post.title || "";
  const description = post.seoMetaDescription || post.teaser || "";
  const canonical =
    post.canonicalUrl || `https://clownbinge.com/articles/${post.slug}`;
  const ogImage = post.ogImage || "https://clownbinge.com/opengraph.jpg";

  const pubDate = post.publishedAt
    ? new Date(post.publishedAt).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : "";

  const jsonLd = post.schemaMarkup
    ? JSON.stringify(post.schemaMarkup)
    : JSON.stringify({
        "@context": "https://schema.org",
        "@type": "NewsArticle",
        headline: title,
        description: description,
        datePublished: post.publishedAt,
        author: {
          "@type": "Organization",
          name: "ClownBinge Staff",
          url: "https://clownbinge.com",
        },
        publisher: {
          "@type": "Organization",
          name: "ClownBinge",
          url: "https://clownbinge.com",
          logo: {
            "@type": "ImageObject",
            url: "https://clownbinge.com/logo.png",
          },
        },
        mainEntityOfPage: { "@type": "WebPage", "@id": canonical },
        isAccessibleForFree: "False",
        hasPart: {
          "@type": "WebPageElement",
          isAccessibleForFree: "False",
          cssSelector: ".cb-article-body",
        },
      });

  const citations = renderCitations(post.verifiedSource);

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${esc(title)}</title>
  <meta name="description" content="${esc(description)}" />
  <meta name="robots" content="index, follow" />
  <link rel="canonical" href="${esc(canonical)}" />
  <meta property="og:type" content="article" />
  <meta property="og:title" content="${esc(post.ogTitle || title)}" />
  <meta property="og:description" content="${esc(post.ogDescription || description)}" />
  <meta property="og:image" content="${esc(ogImage)}" />
  <meta property="og:url" content="${esc(canonical)}" />
  <meta property="og:site_name" content="ClownBinge" />
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content="${esc(post.ogTitle || title)}" />
  <meta name="twitter:description" content="${esc(post.ogDescription || description)}" />
  <meta name="twitter:image" content="${esc(ogImage)}" />
  <script type="application/ld+json">${jsonLd}</script>
</head>
<body>
  <header>
    <p><a href="https://clownbinge.com">ClownBinge</a> — Independent. Verified. The Primary Source.</p>
  </header>
  <main>
    <article>
      <nav><a href="https://clownbinge.com">Home</a> › <a href="https://clownbinge.com/category/${esc(post.category || "")}">${esc(post.category || "")}</a></nav>
      <h1>${esc(post.title || "")}</h1>
      <p><strong>Case ${esc(post.caseNumber || "")}</strong>${pubDate ? ` &middot; ${pubDate}` : ""}</p>
      ${post.subjectName ? `<p><strong>Subject:</strong> ${esc(post.subjectName)}${post.subjectTitle ? `, ${esc(post.subjectTitle)}` : ""}${post.subjectParty ? ` (${esc(post.subjectParty)})` : ""}</p>` : ""}
      ${post.verifiedSource ? `<p><strong>Verified Source:</strong> ${esc(post.verifiedSource.split("::")[0].split(";")[0].trim())}</p>` : ""}
      ${post.dateOfIncident ? `<p><strong>Date of Incident:</strong> ${esc(post.dateOfIncident)}</p>` : ""}
      <p><em>${esc(post.teaser || "")}</em></p>
      <div class="cb-article-body">
        ${post.body || ""}
      </div>
      ${citations ? `<section><h2>Primary Sources</h2>${citations}</section>` : ""}
      ${post.seriesName ? `<aside><p>Part of the <strong>${esc(post.seriesName)}</strong> series.</p></aside>` : ""}
    </article>
  </main>
  <footer>
    <p>Published by ClownBinge &mdash; <a href="https://clownbinge.com/methodology">Methodology</a> &middot; <a href="https://clownbinge.com/ethics">Ethics Policy</a></p>
  </footer>
</body>
</html>`;
}

export function botRenderer() {
  return async (req: Request, res: Response, next: NextFunction) => {
    if (req.method !== "GET") return next();

    const match = req.path.match(ARTICLE_PATH);
    if (!match) return next();

    const ua = req.headers["user-agent"] || "";
    if (!isBot(ua)) return next();

    const slug = match[1];

    try {
      const [post] = await db
        .select()
        .from(postsTable)
        .where(
          and(
            eq(postsTable.slug, slug),
            eq(postsTable.status, "published")
          )
        )
        .limit(1);

      if (!post) return next();

      res.setHeader("Content-Type", "text/html; charset=utf-8");
      res.setHeader("X-Renderer", "cb-bot");
      res.setHeader("Cache-Control", "public, max-age=3600");
      return res.status(200).send(buildHtml(post));
    } catch (err) {
      console.error("[bot-renderer] error:", err);
      return next();
    }
  };
}
