/**
 * generate-sitemap.ts
 *
 * Generates a static sitemap.xml into artifacts/clownbinge/public/sitemap.xml.
 * Run after inserting new articles:
 *   cd scripts && pnpm sitemap
 */
import { writeFileSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";
import { pool } from "@workspace/db";

const DOMAIN = "https://clownbinge.com";
const OUT_PATH = resolve(
  dirname(fileURLToPath(import.meta.url)),
  "../../artifacts/clownbinge/public/sitemap.xml"
);

const TODAY = new Date().toISOString().split("T")[0];

const STATIC_PAGES = [
  { loc: "/",          priority: "1.0", changefreq: "daily",   lastmod: TODAY },
  { loc: "/about",     priority: "0.7", changefreq: "monthly", lastmod: TODAY },
  { loc: "/ethics",    priority: "0.8", changefreq: "monthly", lastmod: TODAY },
  { loc: "/store",     priority: "0.7", changefreq: "weekly",  lastmod: TODAY },
  { loc: "/clowncheck",priority: "0.8", changefreq: "weekly",  lastmod: TODAY },
  { loc: "/reports",   priority: "0.7", changefreq: "weekly",  lastmod: TODAY },
  { loc: "/contact",   priority: "0.5", changefreq: "monthly", lastmod: TODAY },
  { loc: "/privacy",   priority: "0.3", changefreq: "yearly",  lastmod: TODAY },
  { loc: "/terms",     priority: "0.3", changefreq: "yearly",  lastmod: TODAY },
];

function esc(s: string) {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

async function main() {
  const result = await pool.query(
    `SELECT slug, published_at, created_at
     FROM posts
     WHERE status = 'published'
     ORDER BY published_at DESC NULLS LAST, created_at DESC`
  );

  const articleUrls = result.rows.map((row) => {
    const lastmod = (row.published_at ?? row.created_at).toISOString().split("T")[0];
    return `  <url>
    <loc>${esc(DOMAIN)}/case/${esc(row.slug)}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>`;
  });

  const staticUrls = STATIC_PAGES.map((p) => `  <url>
    <loc>${esc(DOMAIN)}${p.loc}</loc>
    <lastmod>${p.lastmod}</lastmod>
    <changefreq>${p.changefreq}</changefreq>
    <priority>${p.priority}</priority>
  </url>`);

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${staticUrls.join("\n")}
${articleUrls.join("\n")}
</urlset>`;

  writeFileSync(OUT_PATH, xml, "utf8");
  console.log(`Sitemap written: ${OUT_PATH}`);
  console.log(`  Static pages: ${staticUrls.length}`);
  console.log(`  Article URLs: ${articleUrls.length}`);
  console.log(`  Total: ${staticUrls.length + articleUrls.length} URLs`);

  await pool.end();
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
