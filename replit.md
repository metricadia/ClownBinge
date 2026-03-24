# Workspace

## Overview

pnpm workspace monorepo using TypeScript. Each package manages its own dependencies.

## Stack

- **Monorepo tool**: pnpm workspaces
- **Node.js version**: 24
- **Package manager**: pnpm
- **TypeScript version**: 5.9
- **API framework**: Express 5
- **Database**: PostgreSQL + Drizzle ORM
- **Validation**: Zod (`zod/v4`), `drizzle-zod`
- **API codegen**: Orval (from OpenAPI spec)
- **Build**: esbuild (CJS bundle)

## Structure

```text
artifacts-monorepo/
├── artifacts/              # Deployable applications
│   └── api-server/         # Express API server
├── lib/                    # Shared libraries
│   ├── api-spec/           # OpenAPI spec + Orval codegen config
│   ├── api-client-react/   # Generated React Query hooks
│   ├── api-zod/            # Generated Zod schemas from OpenAPI
│   └── db/                 # Drizzle ORM schema + DB connection
├── scripts/                # Utility scripts (single workspace package)
│   └── src/                # Individual .ts scripts, run via `pnpm --filter @workspace/scripts run <script>`
├── pnpm-workspace.yaml     # pnpm workspace (artifacts/*, lib/*, lib/integrations/*, scripts)
├── tsconfig.base.json      # Shared TS options (composite, bundler resolution, es2022)
├── tsconfig.json           # Root TS project references
└── package.json            # Root package with hoisted devDeps
```

## TypeScript & Composite Projects

Every package extends `tsconfig.base.json` which sets `composite: true`. The root `tsconfig.json` lists all packages as project references. This means:

- **Always typecheck from the root** — run `pnpm run typecheck` (which runs `tsc --build --emitDeclarationOnly`). This builds the full dependency graph so that cross-package imports resolve correctly. Running `tsc` inside a single package will fail if its dependencies haven't been built yet.
- **`emitDeclarationOnly`** — we only emit `.d.ts` files during typecheck; actual JS bundling is handled by esbuild/tsx/vite...etc, not `tsc`.
- **Project references** — when package A depends on package B, A's `tsconfig.json` must list B in its `references` array. `tsc --build` uses this to determine build order and skip up-to-date packages.

## Root Scripts

- `pnpm run build` — runs `typecheck` first, then recursively runs `build` in all packages that define it
- `pnpm run typecheck` — runs `tsc --build --emitDeclarationOnly` using project references

## Packages

### `artifacts/api-server` (`@workspace/api-server`)

Express 5 API server. Routes live in `src/routes/` and use `@workspace/api-zod` for request and response validation and `@workspace/db` for persistence.

- Entry: `src/index.ts` — reads `PORT`, starts Express
- App setup: `src/app.ts` — mounts CORS, JSON/urlencoded parsing, routes at `/api`
- Routes: `src/routes/index.ts` mounts sub-routers; `src/routes/health.ts` exposes `GET /health` (full path: `/api/health`)
- Depends on: `@workspace/db`, `@workspace/api-zod`
- `pnpm --filter @workspace/api-server run dev` — run the dev server
- `pnpm --filter @workspace/api-server run build` — production esbuild bundle (`dist/index.cjs`)
- Build bundles an allowlist of deps (express, cors, pg, drizzle-orm, zod, etc.) and externalizes the rest

### `lib/db` (`@workspace/db`)

Database layer using Drizzle ORM with PostgreSQL. Exports a Drizzle client instance and schema models.

- `src/index.ts` — creates a `Pool` + Drizzle instance, exports schema
- `src/schema/index.ts` — barrel re-export of all models
- `src/schema/<modelname>.ts` — table definitions with `drizzle-zod` insert schemas (no models definitions exist right now)
- `drizzle.config.ts` — Drizzle Kit config (requires `DATABASE_URL`, automatically provided by Replit)
- Exports: `.` (pool, db, schema), `./schema` (schema only)

Production migrations are handled by Replit when publishing. In development, we just use `pnpm --filter @workspace/db run push`, and we fallback to `pnpm --filter @workspace/db run push-force`.

### `lib/api-spec` (`@workspace/api-spec`)

Owns the OpenAPI 3.1 spec (`openapi.yaml`) and the Orval config (`orval.config.ts`). Running codegen produces output into two sibling packages:

1. `lib/api-client-react/src/generated/` — React Query hooks + fetch client
2. `lib/api-zod/src/generated/` — Zod schemas

Run codegen: `pnpm --filter @workspace/api-spec run codegen`

### `lib/api-zod` (`@workspace/api-zod`)

Generated Zod schemas from the OpenAPI spec (e.g. `HealthCheckResponse`). Used by `api-server` for response validation.

### `lib/api-client-react` (`@workspace/api-client-react`)

Generated React Query hooks and fetch client from the OpenAPI spec (e.g. `useHealthCheck`, `healthCheck`).

### `scripts` (`@workspace/scripts`)

Utility scripts package. Each script is a `.ts` file in `src/` with a corresponding npm script in `package.json`. Run scripts via `pnpm --filter @workspace/scripts run <script>`. Scripts can import any workspace package (e.g., `@workspace/db`) by adding it as a dependency in `scripts/package.json`.

---

## ClownBinge Project

**Company:** Laughphoria Informatics, Wyoming Corporation
**Tagline:** "Verified. Primary Sources. Clowned."
**Mission:** Verified accountability journalism and political satire. Real, verifiable incidents of politicians and religious leaders betraying constituents.

### Products

- **ClownCheck** — $1.95/verification
- **Comprehensive Reports** — $24.95/PDF

### Article Workflow

```bash
cd scripts && pnpm insert ../attached_assets/FILENAME.json    # Insert article
cd scripts && pnpm generate ../attached_assets/topics.json --insert  # Generate + insert via Claude
cd scripts && pnpm sitemap                                    # Regenerate sitemap.xml after inserts
```

- ALWAYS run `pnpm sitemap` after inserting new articles
- Generate script uses `ANTHROPIC_API_KEY` directly; batches of 3 max (~30-40s per article)
- `subjectParty` can be null for non-politicians

### Article Database (articles in DB)

- CB-000001 through CB-000014 published
- CB-000010: Brian Carn (self_owned, score 10) -- "Prophet Brian Carn's Betrayal..."
- CB-000011: Robert Morris (religious, score 9) -- indictment (DUPLICATE of 000012, recommend delete)
- CB-000012: Robert Morris (religious, score 9) -- guilty plea (KEEP)
- CB-000013: Mitchell Summerfield (religious, score 8)
- CB-000014: Paul Mitchell (religious, score 8)
- 21 more religious topics queued in `attached_assets/rbatch-*.json`

### Main Feed Curation Rules

- Religion articles only appear on main feed if `selfOwnScore >= 10` (perfect score)
- Explicitly selecting the Religion category tab shows all religion articles
- 15 categories (DB enum `category`): `self_owned`, `law_and_justice`, `money_and_power`, `us_constitution`, `women_and_girls`, `anti_racist_heroes`, `us_history`, `religion`, `investigations`, `war_and_inhumanity`, `health_and_healing`, `technology`, `censorship`, `global_south`, `how_it_works`
- Categories where subjectName/subjectTitle NOT required: `us_history`, `us_constitution`, `investigations`, `how_it_works`, `war_and_inhumanity`, `health_and_healing`, `technology`, `censorship`, `global_south`, `women_and_girls`
- NOTE: `anti_racist_heroes` is PLURAL (not `anti_racist_hero`)

### Design System

- Blue-deep: `#1A3A8F`
- Yellow/Gold: `#F5C518`
- Pink (VERIFIED badge): `#FF0099`
- Green: `#16A34A`

### Key Files

- `artifacts/clownbinge/src/components/PostCard.tsx`
- `artifacts/clownbinge/src/pages/PostDetail.tsx`
- `artifacts/clownbinge/src/lib/source-abbrev.ts` (add new source outlets here only)
- `artifacts/clownbinge/src/App.tsx`
- `artifacts/api-server/src/routes/posts.ts`
- `artifacts/api-server/src/app.ts`
- `scripts/src/generate-articles.ts`
- `scripts/src/insert-article.ts`
- `scripts/src/generate-sitemap.ts`

### SEO Implementation (completed)

- `use-seo-head.ts` hook: title, canonical, OG, Twitter Card, JSON-LD NewsArticle + Person schema
- `public/robots.txt`: static, points to `/sitemap.xml`
- `public/sitemap.xml`: statically generated; run `pnpm sitemap` to regenerate
- `/tags/:tag` route: tag index pages with clickable tag pills on article pages
- selfOwnScore badge: shows on ALL article categories (not just self_owned)

### Editorial Rules

- NEVER use em dashes anywhere in this project
- Source abbreviations: add to `src/lib/source-abbrev.ts` only (single source of truth)

---

## SEO Publication Methodology (Google Dating -- NOT YET IMPLEMENTED)

**Reference doc:** `attached_assets/clownbinge-google-dating-methodology_1774148234634.md`
**Status:** Future implementation -- do not build yet

### Publication Velocity Schedule

| Phase | Months | Articles/Week | Articles/Day Max | Cumulative |
|-------|--------|---------------|------------------|-----------|
| Establishment | 1-2 | 2-3 | 1 | ~20 |
| Building | 3-4 | 4-5 | 1 | ~60 |
| Momentum | 5-6 | 5-7 | 2 | ~120 |
| Operation | 7-12 | 7-10 | 2 | ~400 |
| Scale | 13-24 | 10-14 | 2 | ~1,000 |
| Full | 25-42 | 10-14 | 2 | ~2,000 |

**Hard limits:** Max 2 articles/day, max 14/week, min 11-hour gap between any two publications.

### Publishing Windows (Eastern Time)

- Morning: 07:15-09:45 (20%)
- Midday: 11:00-13:30 (25%)
- Afternoon: 14:00-16:30 (25%)
- Evening: 19:00-21:00 (20%)
- Late: 22:00-23:30 (10%)
- PROHIBITED: 00:00-07:00

### Publication Queue Architecture (future build)

- All articles enter a managed queue with assigned future `publishedAt` timestamps
- Max queue size: 500 articles
- Category rotation: never publish same category on consecutive days
- Weekend publishing rate reduced 50% vs weekdays
- `consecutiveCategoryBlock: true`

### `publishedAt` Field Rules

- NEVER set to the date the article was written
- ALWAYS set to the queue-assigned future publication date
- NEVER backdate to before domain activation
- NEVER bulk-assign the same timestamp to multiple articles
- Format: ISO 8601 with time and timezone (`YYYY-MM-DDTHH:MM:SS.000Z`) -- never date-only

### Sitemap Management Rules

- Update sitemap ONLY when an article goes live (never pre-publish future articles)
- Resubmit to Google Search Console within 30 minutes of each publication
- Use sitemap index file when approaching 1,000 articles
- Max 50,000 URLs per sitemap file

### Google Indexing API (future)

- Submit every new URL via Indexing API immediately on publication
- 200 URL/day quota; ClownBinge uses max 2/day -- well within limits
- Endpoint: `POST https://indexing.googleapis.com/v3/urlNotifications:publish`
- Type: `URL_UPDATED`

### `dateModified` Protocol

- Update `dateModified` in JSON-LD when: new factoid tags, updated sources, title revisions, meta description changes, body additions
- Do NOT update for: typo fixes, formatting corrections
- NEVER change `datePublished` after initial publication

### Thin Content Ratio Protection

- Body word count: 600 words minimum
- Factoid anchor tags: minimum 3 per article
- External source links: minimum 2 per article
- Internal links: minimum 1 per article
- Meta description: 120-160 characters
- Title tag: 50-65 characters
- Category index pages: 200+ words of unique descriptive content (NOT YET BUILT)
- Tag index pages: 150+ words of unique descriptive content (currently thin -- needs body copy)

### Slug Construction Rules (permanent after indexing)

```
Format:  /[subject-lastname]-[topic-keyword]-[year]
Rules:   lowercase, hyphens only, no stop words, max 75 chars
         must include subject last name + primary topic keyword + year of incident
```
- NEVER change a slug after an article is indexed (creates 404, loses all ranking signals)
- If slug must change: implement 301 redirect immediately and resubmit both URLs

### Domain Authority Timeline

- Months 1-3: Indexing establishment, minimal traffic
- Months 4-6: Named-entity searches surface ClownBinge, early growth signal
- Months 7-12: First page-1 rankings for primary queries
- Months 13-24: Compounding weekly growth, 1,000 records
- Months 25-42: 2,000 records, topical authority, citation source for press

### Weekly Automated Health Checks (future -- runs Sunday 2am ET)

- Minimum 600-word body count on all articles
- Canonical tag, schema markup, meta description present on all pages
- Internal + external link validation (flag broken source links)
- Core Web Vitals: LCP < 2.5s, FID < 100ms, CLS < 0.1, TTFB < 800ms
- Publication velocity anomaly detection (alert if > 2 articles same day)

### NerdOut Academic Category -- Systemic SEO Treatment (REQUIRED)

Every article with `category = "nerd_out"` automatically receives the following treatment via code. This is NOT per-article config -- it is enforced at the component and hook level. No manual action needed on insert. Confirm these are in place if any refactor touches the components below.

**PostCard.tsx** (feed tile):
- Grey "Academic" pill badge (slate-500, rounded-full) in the badge row
- "Scholarly Read" pill label next to the source in the footer
- "Academic" pill has a tooltip: "Academic-level analysis for researchers, educators, and the deeply curious. Longer read. Heavier sourcing. Worth it."

**PostDetail.tsx** (article page):
- Descriptor line immediately below the H1: `NERDOUT ACADEMIC ANALYSIS -- PRIMARY SOURCES -- SCHOLARLY READ` (visible in DOM, read by crawlers)

**use-seo-head.ts** (metadata):
- `<title>` tag: `[Article Title] | NerdOut Academic Analysis | ClownBinge`
- `og:image:alt`: `[Article Title] -- NerdOut Academic Analysis | ClownBinge`
- JSON-LD `@type`: `["NewsArticle", "ScholarlyArticle"]` (dual type)
- JSON-LD `articleSection`: `"NerdOut Academic Analysis"`
- JSON-LD `genre`: `"Academic Analysis"`
- JSON-LD `educationalLevel`: `"advanced"`

**Redundant Truth principle:** The phrase "NerdOut Academic Analysis" must appear in the title tag, image alt, JSON-LD schema, AND the rendered page DOM. All four simultaneously. This is intentional SEO architecture.

**Current NerdOut articles (as of March 2026):** CB-000053 (Foucault/Durkheim/Trump), CB-000060 (Black Americans/Crime/Racist Narrative)

### What to Never Do

- Never publish > 2 articles in a calendar day
- Never set identical `publishedAt` on any two articles
- Never backdate articles before domain activation
- Never publish stub/placeholder articles
- Never use AI-bulk-generated content without editorial voice standards applied
- Never purchase backlinks
- Never submit same URL to Indexing API more than once per 24 hours
- Never create tag/category pages with no substantive content
- Never allow broken external links to primary sources beyond 30 days
- Never change a slug after indexing
