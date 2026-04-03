# ClownBinge — Project Manifest
**Generated:** April 2026
**Purpose:** External AI collaborator handoff document (Gemini)
**Parent Company:** Metricadia Research, LLC (metricadia.com)
**Platform URL:** clownbinge.com
**Jurisdiction of Record:** Federation of Saint Christopher and Nevis

---

## 1. Project Overview

ClownBinge is a primary source accountability journalism platform. Every article is verified against government records, court filings, congressional transcripts, peer-reviewed research, and declassified documents. The platform uses a proprietary citation format: `Label :: Description (Year) :: Publisher` with `;` as the entry separator. No URLs appear in the `verified_source` field.

**Mission:** Replace commentary-based media with a falsifiability standard. Every factual claim must be traceable to a primary source.

**Content Goal:** 400 published articles by May 2026. Current count: 95 articles, 562 citations.

**Progress bar:** 95/400 (displayed live on homepage).

---

## 2. Project Structure

```
/home/runner/workspace/
├── artifacts/
│   ├── api-server/               # Express + Drizzle ORM REST API
│   │   └── src/
│   │       ├── app.ts            # Express app entry
│   │       ├── index.ts          # Server bootstrap
│   │       ├── seed.ts           # DB seed on startup
│   │       ├── posts-seed.json   # Source-of-truth seed data (snake_case keys)
│   │       ├── routes/
│   │       │   ├── posts.ts      # Main feed, article detail, stats, count
│   │       │   ├── books.ts      # FactBook eBook catalog
│   │       │   ├── factoid.ts    # Inline citation popups
│   │       │   ├── verify.ts     # ClownCheck news verification tool
│   │       │   ├── reactions.ts  # Article reaction bar
│   │       │   ├── tips.ts       # Tip submission
│   │       │   ├── sponsors.ts   # Sponsor bar
│   │       │   └── subscribers.ts
│   │       └── services/
│   │           ├── cb-quality-gate.ts  # Editorial quality rules
│   │           ├── cb-reducer.ts       # Article processing
│   │           ├── cb-rewriter.ts      # Article rewriting service
│   │           ├── content-guard.ts    # Content safety
│   │           └── zerogpt.ts          # AI detection integration
│   │
│   └── clownbinge/               # React + Vite frontend (SPA)
│       ├── public/
│       │   ├── covers/           # FactBook cover images (vol01-08)
│       │   ├── images/           # Site assets
│       │   ├── cb-inventory.csv  # Content export
│       │   ├── cb-content-page-01..08.csv  # Paginated content exports
│       │   └── clownbinge-content-export.csv
│       └── src/
│           ├── App.tsx           # Router (wouter) + ScrollToTop
│           ├── pages/
│           │   ├── Home.tsx         # Main feed with filter pills
│           │   ├── PostDetail.tsx   # Article detail page
│           │   ├── Bookstore.tsx    # FactBook eBook store
│           │   ├── ComprehensiveReport.tsx  # Pay-per-report ($4.95 / $24.95)
│           │   ├── VerifyNews.tsx   # ClownCheck AI fact-check tool
│           │   ├── Store.tsx        # Digital products
│           │   ├── Support.tsx      # Donations
│           │   ├── About.tsx        # About page
│           │   ├── Ethics.tsx       # Ethics policy
│           │   ├── Terms.tsx        # Terms of Service (St. Kitts jurisdiction)
│           │   ├── Privacy.tsx      # Privacy / Free Speech policy
│           │   ├── TagIndex.tsx     # Tag archive pages
│           │   ├── SubmitTip.tsx    # Tip submission
│           │   └── not-found.tsx
│           ├── components/
│           │   ├── Layout.tsx           # Sticky nav, category pills, footer
│           │   ├── PostCard.tsx         # Article card (tile)
│           │   ├── FactoidPopup.tsx     # Inline citation tooltip/drawer
│           │   ├── FactBookUpsell.tsx   # FactBook upsell widget
│           │   ├── ShareButtons.tsx     # Social share
│           │   ├── ReactionBar.tsx      # Emoji reactions
│           │   ├── RelatedArticles.tsx  # Cross-article links
│           │   ├── SelfOwnScoreBadge.tsx
│           │   ├── StatWidget.tsx       # 95/400 progress bar
│           │   ├── AdSlot.tsx           # MediaVine ad placeholder
│           │   └── PsaLogo.tsx          # Metricadia text-based logo component
│           ├── hooks/
│           │   ├── use-posts.ts         # TanStack Query: feed + detail
│           │   ├── use-seo-head.ts      # Full Schema.org injection
│           │   ├── use-factoid-popup.ts # Inline citation popup logic
│           │   ├── use-books.ts         # FactBook catalog query
│           │   └── use-reactions.ts
│           ├── lib/
│           │   └── source-abbrev.ts     # Tile source abbreviation engine (44-char cap)
│           └── config/
│               ├── related-articles.ts  # Cross-article link map (slug-based)
│               └── staff-picks.ts       # Editorial staff pick overrides
│
├── CLOWNBINGE_MASTER_BRIEF.md    # 23-section platform reference (internal)
├── METRICADIA_LOGO_CODE.md       # MetricadiaLogo component spec
└── CLOWNBINGE_PROJECT_MANIFEST.md  # This file
```

---

## 2. Database Schema

**Host:** Replit PostgreSQL (managed, persistent)
**ORM:** Drizzle ORM (TypeScript)
**5 Tables:** `posts`, `books`, `reactions`, `subscribers`, `tips`

### Table: `posts` (primary content table)

| Column | Type | Notes |
|--------|------|-------|
| `id` | uuid (PK) | auto gen_random_uuid() |
| `case_number` | text (UNIQUE) | Format: CB-000001 through CB-000099+. Next: CB-000099. Do not fill gaps CB-000027, CB-000067, CB-000069. |
| `title` | text | Full article title |
| `slug` | text (UNIQUE) | URL slug: `/case/:slug` |
| `teaser` | text | 1-2 sentence summary for cards |
| `body` | text NOT NULL | Full HTML article body |
| `category` | enum `category` | See category enum below |
| `subject_name` | text | Primary person covered (nullable) |
| `subject_title` | text | Their title/role (nullable) |
| `subject_party` | text | Political party if applicable (nullable) |
| `verified_source` | text | CB citation format: `Label :: Desc (Year) :: Publisher` joined by `;` |
| `source_url` | text | Optional canonical source URL |
| `has_video` | boolean | Default false |
| `video_url` | text | Nullable |
| `video_thumbnail` | text | Nullable |
| `transcript` | text | Video transcript (nullable) |
| `self_own_score` | integer | 1-10 self-own severity (nullable; used for Self-Owned category) |
| `tags` | text[] | Array of keyword tags |
| `schema_markup` | jsonb | Custom Schema.org override (nullable) |
| `status` | enum `status` | `published` or `draft` |
| `date_of_incident` | date | Date the documented event occurred (nullable) |
| `published_at` | timestamp | Publication timestamp |
| `created_at` | timestamp | Auto now() |
| `updated_at` | timestamp | Auto now() |
| `view_count` | integer | Default 0 |
| `share_count` | integer | Default 0 |
| `user_submitted` | boolean | Default false |
| `pinned` | boolean | Default false. Pinned = editorial top-of-feed. Currently 10 articles pinned. |
| `locked` | boolean | Default false. Locked = paywalled/access-controlled. Currently 81 articles locked. |
| `staff_pick` | boolean | Default false. Currently 4 articles. |
| `nerd_accessible` | boolean | Default true. When false AND category=nerd_out, article is excluded from default feed. |
| `ai_score` | integer | AI detection score (nullable) |
| `ai_score_tested_at` | timestamp | When AI test was run (nullable) |

**Indexes:** PRIMARY KEY on `id`, UNIQUE on `case_number`, UNIQUE on `slug`
**FK:** `reactions.post_id` references `posts.id` ON DELETE CASCADE

### Category Enum (17 values)

```
anti_racist_heroes | censorship | disarming_hate | global_south
health_and_healing | how_it_works | investigations | law_and_justice
money_and_power | nerd_out | religion | self_owned | technology
us_constitution | us_history | war_and_inhumanity | women_and_girls
```

**Important:** `religion` is excluded from the default "All" feed. It is only accessible via the Religion filter pill.

### Table: `books`

| Column | Type | Notes |
|--------|------|-------|
| `id` | uuid (PK) | |
| `title` | text | |
| `slug` | text (UNIQUE) | |
| `description` | text | |
| `price_usd` | numeric(10,2) | |
| `stripe_id` | text | Stripe price ID (nullable — see Monetization) |
| `pdf_url` | text | Download URL (nullable) |
| `language` | text | Default 'en' |
| `cover_url` | text | Nullable |
| `active` | boolean | Default true |
| `created_at` | timestamp | |

### Other Tables (minimal schema)

- **`reactions`** — post_id (FK), emoji type, count. Supports reaction bar on article pages.
- **`subscribers`** — email capture for newsletter.
- **`tips`** — user-submitted tip form entries.

---

## 3. Content Audit (Published, CB-prefixed articles only)

**Total Articles:** 95
**Total Citations:** 562
**Staff Picks:** 4
**Pinned (editorial top):** 10
**Locked (access-controlled):** 81
**Progress to goal:** 178 / 400

### Articles Per Category

| Category | Count |
|----------|-------|
| us_history | 26 |
| religion | 25 ✓ CLOSED |
| health_and_healing | 25 ✓ CLOSED |
| self_owned | 25 ✓ CLOSED |
| money_and_power | 25 ✓ CLOSED |
| law_and_justice | 7 |
| nerd_out | 6 |
| disarming_hate | 4 |
| us_constitution | 4 |
| global_south | 15 ✓ CLOSED |
| censorship | 3 |
| women_and_girls | 3 |
| investigations | 3 |
| how_it_works | 3 |
| war_and_inhumanity | 2 |
| anti_racist_heroes | 1 |
| technology | 1 |
| **TOTAL** | **166** |

### Known Case Number Gaps (Do Not Auto-Fill)

CB-000027, CB-000067, CB-000069

### Next Case Number

CB-000169

---

## 4. Monetization Status

### Revenue Streams (Planned / Partial)

| Stream | Status | Details |
|--------|--------|---------|
| MediaVine Display Ads | Placeholder | `AdSlot.tsx` component exists. MediaVine requires 50k sessions/month minimum. Not yet activated. |
| Donations | UI Live | `/invest-in-us` route + `Support.tsx` page. Payment processor not yet wired (no Stripe key). |
| Pay-Per Report — Quick Verify | UI Live | $4.95 per quick fact-check. Page: `/reports` (`ComprehensiveReport.tsx`). Backend processor not wired. |
| Pay-Per Report — Full Dossier | UI Live | $24.95 per comprehensive report on a public figure. Same page. Not wired. |
| FactBook eBooks | UI Live | Bookstore at `/bookstore`. Two titles in DB. Stripe `stripe_id` field exists but is NULL on all books — payment not wired. |
| Library Bundle | Planned | $149 institutional bundle. Referenced in brief. Not yet built. |

### FactBook Catalog (Current DB State)

| Title | Price | Stripe ID | Active |
|-------|-------|-----------|--------|
| ClownBinge Greatest Hits Vol. 1 | $9.00 | NULL | Yes |
| Illegal, Who? | $21.95 | NULL | Yes |

**NOTE:** Stripe is not yet integrated. The `books` table has a `stripe_id` column ready for Stripe Price IDs. The `books.ts` API route exists. Payment flow requires: Stripe account, Price ID per book, checkout session creation, webhook for delivery.

### Paid Report Pricing

- Quick Verify: $4.95 (summary of public record on a claim)
- Full Report: $24.95 (comprehensive dossier on a public figure)
- Library Bundle: $149 (planned — bulk institutional access)

---

## 5. Technical Stack

### Frontend

| Layer | Technology |
|-------|-----------|
| Framework | React 18 (via Vite, NOT Next.js) — SPA architecture |
| Build Tool | Vite 7 |
| Routing | Wouter (lightweight client-side router) |
| Styling | Tailwind CSS v4 + `@tailwindcss/typography` |
| UI Components | Radix UI primitives (full suite) + shadcn/ui pattern |
| Data Fetching | TanStack Query (React Query) |
| Animations | Framer Motion |
| Forms | React Hook Form + Zod |
| Charts | Recharts |
| Date Handling | date-fns |
| Icons | Lucide React + React Icons |
| Carousel | Embla Carousel |

**Deployment:** Replit hosted, path-based proxy. Preview at root `/`.

### Backend / API

| Layer | Technology |
|-------|-----------|
| Runtime | Node.js |
| Framework | Express.js |
| ORM | Drizzle ORM |
| Database | PostgreSQL (Replit managed) |
| Logging | Pino + pino-http |
| AI Integration | Anthropic Claude (via `@workspace/integrations-anthropic-ai`) |
| Validation | Zod |
| Auth | Cookie-based session (`lib/auth.ts`) |

**API Base:** `/api/` — same-origin, path-proxied

### Key API Endpoints

```
GET  /api/posts                   Main feed (supports ?category=, ?tag=, ?limit=, ?offset=)
GET  /api/posts/:slug             Article detail
GET  /api/posts/count             CB-prefixed published count (for progress bar)
GET  /api/posts/stats             Aggregate stats
GET  /api/books                   FactBook catalog
GET  /api/factoid/:slug           Inline citation popup data
POST /api/tips                    Tip submission
POST /api/reactions/:id           Reaction bar
GET  /api/verify                  ClownCheck news verification
GET  /api/sponsors                Sponsor bar data
```

### SEO and Schema.org Implementation

All Schema.org injection is handled in `src/hooks/use-seo-head.ts`. This hook:

1. **NewsArticle Schema** — injected on every article detail page (`/case/:slug`). Includes `author`, `publisher`, `datePublished`, `headline`, `image`, and `keywords`.
2. **ClaimReview Schema** — injected on accountability articles covering named public figures. Fields: `claimReviewed` (article title), `ratingValue` (derived from `self_own_score` or category), `author` block, `publisher` block.
3. **AnalysisNewsArticle / ScholarlyArticle** — applied to `nerd_out` and `investigations` categories.
4. **WebPage / ItemPage / AboutPage / ContactPage** — applied to static pages via `schemaType` prop.
5. **NewsMediaOrganization** — publisher block used consistently across all schemas. `@id` is the canonical organization URL.
6. **Open Graph + Twitter Card** — full meta tag suite on all pages.
7. **Wikidata sameAs** — institutional authority links on select articles.

**ClaimReview rating logic:**
- `self_owned` with score: `min(5, round(score / 2))`
- Verified true claim: `ratingValue = 5`
- All other categories: `ratingValue = 4`

### Source Abbreviation Engine

`src/lib/source-abbrev.ts` — shared between PostCard (tile) and PostDetail.

- **Tile mode** (`prefix=true`): Extracts label (text before first `::`), applies ~60 regex abbreviation patterns (DOJ, FBI, NIH, PNAS, Cong. Record, etc.), accumulates top labels joined by `"; "` with a hard 44-character cap. No ellipsis. Falls back to hard-sliced first label.
- **Detail mode**: Up to 2 segments, abbreviated, joined with ` / `.
- **CB citation format required:** `Label :: Description (Year) :: Publisher` — entries separated by `;`.

### Feed Ordering (Main Feed, No Filter)

5-tier editorial system applied only when no `category` or `tag` filter is active:

```
Tier -4: pinned = true                          (10 articles, diverse editorial picks)
Tier -3: self_owned, investigations             (hooks — "can you believe this")
Tier -2: money_and_power, war_and_inhumanity, disarming_hate
Tier -1: us_history, women_and_girls, us_constitution, law_and_justice,
         anti_racist_heroes, global_south, censorship, health_and_healing
Tier  0: nerd_out, how_it_works, technology
```

Within each tier: `published_at DESC NULLS LAST`.
Category/tag feeds: `published_at DESC` only (no curation weighting).
`religion` excluded from all-feed (accessible via filter pill only).
`nerd_out` filtered to `nerd_accessible = true` only in all-feed.

---

## 6. Brand and Identity

| Element | Value |
|---------|-------|
| Primary Brand | ClownBinge |
| Parent Company | Metricadia Research, LLC |
| Parent URL | metricadia.com (planned launch simultaneous with ClownBinge) |
| Jurisdiction | Federation of Saint Christopher and Nevis |
| Legal email | legal@clownbinge.com |
| Brand Gold | `#C9A227` |
| Chocolate Brown | `#6B3520` |
| Near Black | `#1A1A2E` |
| Mid Grey | `#5A5A5A` |
| Navy | `#1A3A8F` |
| Tagline | "A Public Accountability News Platform by Metricadia Research LLC." |
| Sub-tagline | "Independent. Verified. The Primary Source." |
| Methodology tagline | "Next Generation Verified Research." |

### MetricadiaLogo Component

Text-based logo: `METRICADIA [gold bar] RESEARCH LLC`
- Gold bar is a styled `<span>` with `display:inline-block`, `position:relative`, `top:-0.28em` — NOT a dash character
- All sizing uses `em` units relative to `fontSize` prop
- Component: `src/components/PsaLogo.tsx` (following PsaLogo pattern)

---

## 7. Content Rules and Constraints (For AI Collaborators)

### Writing Rules (Firm)
- No em dashes (—) and no double hyphens (--)
- Sentences under 55 words
- No ellipsis in source tile display
- **CB Sanitizer Rule — Paragraph Length:** No short paragraphs. Every paragraph must be a substantive block of text. A 1-2 sentence paragraph is only permitted when it is artistically intentional (a closing rhetorical beat, a deliberate punch line). Even then, use sparingly. Default behavior: merge adjacent short paragraphs into one cohesive block before inserting into the database. This rule is enforced at write time, not retroactively.

### Citation Standard
```
Label :: Description (Year) :: Publisher.
```
- Separator between fields: ` :: `
- Separator between entries: `; `
- No URLs in `verified_source` field
- All data written to DB `verified_source` column

### Database Write Rule
- Never use `executeSql` tool for DB writes
- Use psql dollar-quoting or Node script with direct pg path
- Tags column is `text[]` type
- Always update `artifacts/api-server/src/posts-seed.json` after DB insertions

### Case Number Rules
- Format: CB-000001 (6-digit zero-padded)
- Next available: CB-000099
- Do NOT auto-fill gaps: CB-000027, CB-000067, CB-000069

### Cross-Article Links
- Use plain `<a href="/case/[slug]">` with keyword-rich anchor text
- Managed via `src/config/related-articles.ts` (slug-based map)

---

## 8. Metricadia White Papers (Planned — 9 Topics)

To substantiate the brand's novel journalism methodology:

1. The Trust Collapse — why institutional media credibility collapsed
2. Engagement Economics of Misinformation — how false content monetizes
3. The Falsifiability Standard — proposed replacement for "objectivity"
4. Institutional Capture — documented pattern across regulatory bodies
5. First Amendment Architecture — structural analysis of press protections
6. Disinformation Infrastructure — mapping of coordinated inauthentic networks
7. The Civics Gap — primary source illiteracy as a systemic vulnerability
8. The AI Authentication Crisis — how LLMs threaten evidentiary journalism
9. The Verification Framework — ClownBinge's proposed primary source standard

---

## Floor Cleanup Sprint — Six Category Jobs (April 2026)

**Objective:** Eliminate orphan cluster signals. Bring all thin categories to minimum 10–15 articles. No article in this sprint gets staff_pick=true or pinned=true. These populate category feeds only. Front page layout optimization happens AFTER all six jobs are complete.

| Job | Category | From | To | Articles Needed | Status |
|-----|----------|------|----|-----------------|--------|
| Job 1 | global_south | 3 | 15 | 12 | COMPLETE ✓ (CB-000169 to CB-000180) |
| Job 2 | censorship | 3 | 15 | 12 | PENDING |
| Job 3 | women_and_girls | 3 | 15 | 12 | PENDING |
| Job 4 | war_and_inhumanity | 2 | 15 | 13 | PENDING |
| Job 5 | anti_racist_heroes | 1 | 10 | 9 | PENDING |
| Job 6 | technology | 1 | 10 | 9 | PENDING |

**Total articles this sprint:** 67
**Case numbers:** CB-000169 through CB-000235 (estimated)
**Next sprint after completion:** Front page SEO layout analysis, then Law & Justice depth sprint (7 → 50).

---

*End of Manifest — ClownBinge / Metricadia Research, LLC — April 2026*
