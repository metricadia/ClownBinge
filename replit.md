# Workspace

## DEPLOYMENT (PERMANENT RULE — NEVER DEVIATE)

**Production runs exclusively on a self-hosted VPS at 1984 Hosting, Reykjavik, Iceland.**
- IP: `93.95.231.150` (Ubuntu 22.04)
- Site: `https://clownbinge.com`
- **GitHub Actions deploys automatically on every push to `main`.** Push code to GitHub — Iceland handles everything after that.
- **Never use Replit hosting, Replit deployment, or any Replit infrastructure for production.**
- Agent's job: write code + push to GitHub via `node scripts/github-push.js <files>`. Done.

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
- **Security headers (NEVER REMOVE):** Helmet middleware in `app.ts` emits `X-Content-Type-Options: nosniff`, `Strict-Transport-Security` (1 year + subdomains), `Referrer-Policy: no-referrer`, `X-XSS-Protection: 0` on every API response. CSP and frameguard are disabled intentionally (Clerk inline scripts + Replit preview iframe). Verified via `curl -sI /api/health`.
- **Trust proxy (NEVER REMOVE):** `app.set("trust proxy", 1)` in `app.ts` — required for rate limiting (accurate IP from X-Forwarded-For) and secure cookies in production behind Replit's load balancer. Removing this breaks rate limiting and `cookie.secure` in production.
- **Session secret:** `SESSION_SECRET` env var is required in production — server throws a fatal error if missing. Dev uses a clearly-labeled fallback. The secret is already set as a Replit secret.
- **Admin rate limit:** `POST /api/admin/clerk-login` is rate-limited to 10 requests per 15 minutes via `express-rate-limit`. Configured in `src/routes/admin.ts`.
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

### Authentication (Self-Hosted JWT — Clerk fully removed)

Site is **public** — no global login wall. Article reading requires member sign-in.

- **Auth provider:** Self-hosted JWT (`bcryptjs` password hashing, `jsonwebtoken` signed tokens in `cb_auth` httpOnly cookie)
- **Clerk:** Fully removed. `@clerk/react` and `@clerk/express` are gone. No Clerk keys needed.
- **Member auth routes:** `POST /api/auth/register`, `POST /api/auth/login`, `POST /api/auth/logout`, `GET /api/auth/me`, `GET /api/auth/verify-email`, `POST /api/auth/resend-verification`
- **Frontend context:** `artifacts/clownbinge/src/context/AuthContext.tsx` — `AuthProvider` + `useAuth()` hook (same API surface: `isLoaded`, `isSignedIn`, `user`, `signOut`, `refresh`)
- **JWT secret:** Uses `JWT_SECRET` env var, falls back to `METRICADIA_TOKEN_SECRET`. No new secret needed in dev.
- **Article gate:** `PostDetail.tsx` — detects `!isSignedIn` via `useAuth()` from AuthContext, shows "Sign In to Read" overlay with bodyBottom hidden
- **Crawler whitelist (NEVER REMOVE):** `PostDetail.tsx` — `isCrawler` flag detects Googlebot, bingbot, DuckDuckBot, Applebot, AhrefsBot, SemrushBot, ia_archiver, MJ12bot by `navigator.userAgent`. When `isCrawler = true`, BOTH `isAuthGated` and `isPremiumGated` are forced to `false` — crawlers always see the full article body. This is legal under Google's Flexible Sampling policy because we declare the paywall in JSON-LD (`isAccessibleForFree: "False"`, `hasPart` with `cssSelector: ".cb-article-body"`). **If this is ever removed, Googlebot will only see 1 paragraph of every article and all SEO value collapses.**
- **Sign-in/up pages:** `/sign-in` (`SignIn.tsx`), `/sign-up` (`SignUp.tsx`) — custom forms, CB-branded, no Clerk
- **Account page:** `/account` (MyAccount.tsx — redirects to `/sign-in` if not authed)
- **Nav:** "My Account" link → `/account` (signed in) or `/sign-in` (signed out) via `useAuth()` in Layout.tsx
- **Email verification:** Nodemailer with Proton SMTP — 24h token sent on registration. `GET /api/auth/verify-email?token=...` verifies and redirects.
- **Kemet8 admin:** Members tab queries `cb_members` table (self-hosted members)
- **Admin auth:** OTP-based via `admin-otp.ts` — no Clerk bridge
- **Middleware:** `cbAuthMiddleware` in `auth-middleware.ts` — reads `cb_auth` cookie, attaches `req.cbUser` to requests

**DB tables:**
- `members` — old Clerk-based table (1 legacy row, preserved, not actively used)
- `cb_members` — self-hosted auth: `id` (serial PK), `email` (unique), `password_hash`, `name`, `avatar_url`, `email_verified`, `email_verify_token`, `verify_token_expires_at`, `created_at`, `last_login_at`

**Iceland production `.env` needed** (replace old Clerk vars):
```
DATABASE_URL=...
SESSION_SECRET=...
METRICADIA_TOKEN_SECRET=...   # also used as JWT_SECRET fallback
METRICADIA_ADMIN_HASH=...
SMTP_HOST=smtp.protonmail.ch
SMTP_PORT=587
SMTP_USER=...
SMTP_PASS=...
SMTP_FROM=noreply@clownbinge.com
CB_DOMAIN=https://clownbinge.com
NODE_ENV=production
```
Remove: `VITE_CLERK_PUBLISHABLE_KEY`, `CLERK_SECRET_KEY`, `VITE_CLERK_PROXY_URL`

### Products

- **ClownCheck** — $1.95/verification
- **Comprehensive Reports** — $24.95/PDF
- **Supporting Member** — $9/mo subscription (manual external merchant)

### Subscription System (Supporting Member)

**Architecture:** No Stripe. No payment processor in the app. Payment is handled entirely outside the platform via an external localized merchant account. Admin grants access manually by issuing tokens.

**Token flow:**
1. Admin receives payment confirmation externally
2. Admin opens `/Kemet8` → "Subscribers" tab → issues a token (label + optional email)
3. Admin copies the activation link: `/subscribe?token=<uuid>`
4. Admin sends link to subscriber (email, DM, etc.)
5. Subscriber visits the link → auto-activates → `cb_sub` HttpOnly cookie set for 1 year
6. Subscriber now has access to premium features on all `premiumOnly` articles

**Key files:**
- `lib/db/src/schema/subscriber-tokens.ts` — `subscriber_tokens` table (uuid token, label, email, active, expiresAt)
- `lib/db/src/schema/posts.ts` — `premiumOnly boolean` column on posts
- `artifacts/api-server/src/routes/subscription.ts` — `GET /api/subscription/status`, `POST /api/subscription/activate`, `POST /api/subscription/deactivate`
- `artifacts/api-server/src/editor-routes.ts` — admin token CRUD (`/api/metricadia/subscriber-tokens`) + premium toggle (`PATCH /api/metricadia/posts/:id/premium`)
- `artifacts/clownbinge/src/hooks/use-subscription.ts` — `useSubscription` + `useActivateSubscription` hooks
- `artifacts/clownbinge/src/components/SubscriptionModal.tsx` — gate modal shown to non-subscribers
- `artifacts/clownbinge/src/pages/Subscribe.tsx` — `/subscribe` page (auto-activates from `?token=` URL param)
- `artifacts/clownbinge/src/pages/PostDetail.tsx` — gates MetricadiaID popups + CB Factoid popups on `premiumOnly` articles
- `artifacts/clownbinge/src/pages/AdminEditorPage.tsx` — SubscribersPanel + ⭐ premium toggle per article

**Feature gating (two-tier):**
1. **Auth gate (Clerk):** All articles require social sign-in to read. Signed-out users see the teaser (bodyTop) then a "Sign In to Read" overlay.
2. **Premium gate (subscription):** `premiumOnly` articles require a subscriber token on top of auth. Non-subscribers see the SubscriptionModal when using MetricadiaID or CB Factoid popups, and are blocked from bodyBottom. A "Members Only Tools" amber badge appears in the article header.

**Cookie:** `cb_sub` — HttpOnly, 1-year expiry, set by Express on activation, validated on every status check. No JWT, no session DB lookup — the token table is the source of truth.

### CITATION AUDIT STATUS (March 2026)

**COMPREHENSIVE AUDIT COMPLETED -- March 25, 2026.** All 62 published articles verified against every Cardinal Citation Rule including the new No-Description Rule.

**Final Data Guard Results (definitive individual-pull scan):**
- URL violations: **ZERO** (Rule 1 -- Zero-URL Policy)
- Legacy media sole citations: **ZERO** (Rule 7 -- Primary-Only Data Guard)
- Parenthetical descriptions in citation body: **ZERO** (Rule 9 -- Permanent Citation Only, No Description)
- CB citation format entries (Label :: Body): **58 of 62 articles**
- Plain-text (satirical placeholder): **4 articles** -- CB-000001, CB-000002, CB-000003, CB-000005 are satirical/illustrative articles featuring fictional politicians. Their citations ("Congressional Record", "C-SPAN", "Court Records", "Palmetto County Board Records") are illustrative institutional references, not real events.

**Known Data Guard false positive:**
- CB-000038 will always match `%Fox News%` because the verified_source cites the court case *US Dominion, Inc. et al. v. Fox News Network, LLC et al.* -- Fox News is the DEFENDANT in a court filing, not the source. This is correct primary source usage. The actual source is the Delaware Superior Court record.

**What was fixed across all audit phases:**
- Phase 1: All religion articles (CB-000015 through CB-000034 + CB-000046): Replaced sole newspaper citations with church official statements, arrest records, court filings, ministry fundraising documents
- Phase 2: All 33 plain-text articles upgraded to CB citation format `Label :: CB body` (58 articles total)
- Phase 3: 25 articles had parenthetical description text stripped from citation bodies. Only Author. (Year). Title. Publisher. remains -- no narrative descriptions of what the source says.
- CB-000048: Cherokee Nation v. Georgia (1831) and Worcester v. Georgia (1832) promoted to individual named entries rather than a parenthetical inside a broader case records entry.

**The Data Guard scan command (use individual-pull method for accurate results):**
```sql
SELECT case_number FROM posts WHERE status = 'published' AND (verified_source ILIKE '%http%' OR verified_source ILIKE '%Rolling Stone%' OR verified_source ILIKE '%New York Times%' OR verified_source ILIKE '%Washington Post%' OR verified_source ILIKE '%The Guardian%' OR verified_source ILIKE '%NBC News%' OR verified_source ILIKE '%CNN%' OR verified_source ILIKE '%The Atlantic%' OR verified_source ILIKE '%Chicago Tribune%' OR verified_source ILIKE '%HuffPost%' OR verified_source ILIKE '%BBC%') ORDER BY case_number;
```
**Note:** Multi-line SQL output parsing can miss violations in multi-source citations. Always use individual-pull per article for the description parenthetical check.

---

### Citation Cardinal Rule (LAW -- Google's Protocol. NEVER change without explicit authorization.)

**Source:** Primary Source Analytics / Gemini "Permanent Receipt" Protocol -- Google Algorithm Compliance

---

#### RULE 1 -- ZERO-URL POLICY (Absolute)
No hyperlinks. No URLs. Not even plain-text URLs in `verified_source`. Federal URLs are administration-dependent and subject to link rot. URLs are a liability. Text-based citations are permanent.

#### RULE 2 -- LABEL FORMAT (Exact)
Each label uses a **colon** between Subject and Role:
```
Subject: Role
```
Examples:
- `Nobel Prize in Physics (1997): Steven Chu`
- `Dr. Ernest Moniz: 13th Secretary of Energy`
- `Rick Perry: Energy Secretary Confirmation`

NOT a comma. A colon. This is Google's "entity relationship" signal.

#### RULE 3 -- ENTRY STRUCTURE (Exact)
Each citation entry = `Label :: CB citation body`
Multiple entries separated by `; ` (semicolon + space).

```
Subject: Role :: Publisher. (Year). Full document title (S. Hrg. NNN-NN). U.S. Government Publishing Office.; Subject: Role :: Next citation.
```

#### RULE 4 -- S. Hrg. NUMBERS MUST BE VISIBLE ON FRONT END (Critical for Google)
The S. Hrg. number (e.g., `S. Hrg. 115-32`) must appear in the rendered APA citation body. The PostDetail renderer displays the italic APA body text below each bold label. This is non-negotiable. The S. Hrg. number is the "Sovereign's native language" -- the exact string Google's Knowledge Graph uses to index U.S. Congressional history. Displaying it makes ClownBinge an Academic Repository in Google's classification.

#### RULE 5 -- CB CITATION MANDATORY ELEMENTS (Congressional Documents)
1. Full committee name (never an acronym in the citation body)
2. Year in parentheses
3. Full document title as it appears in the GPO record
4. S. Hrg. number in parentheses
5. Publisher: `U.S. Government Publishing Office.`

**For non-Congressional sources:** Publisher. (Year). Title. Institution/Archive.

#### RULE 6 -- THE "UN-UNRAVELABLE" PRINCIPLE
When text-based S. Hrg. citations are on the page, any attack on ClownBinge's credibility is an attack on the U.S. Government's own archived records. That is a fight attackers will lose. This is why we do not link -- links can be disputed; government hearing numbers cannot.

---

**CANONICAL EXAMPLE — CB-000061 (DEI Ruse, 9 citations). This is the CB citation standard. Not APA 7:**
```
Nobel Prize in Physics (1997): Steven Chu :: Nobel Prize Outreach AB. (1997). Steven Chu: Biographical. Official Nobel Prize Archives.; Dr. Ernest Moniz: 13th Secretary of Energy :: U.S. Senate Committee on Energy and Natural Resources. (2013). Nomination of Dr. Ernest Moniz to be Secretary of Energy (S. Hrg. 113-52). U.S. Government Publishing Office.; Rick Perry: Energy Secretary Confirmation :: U.S. Senate Committee on Energy and Natural Resources. (2017). Nomination of the Honorable Rick Perry to be Secretary of Energy (S. Hrg. 115-32). U.S. Government Publishing Office.
```

**FACT CHECK RULE:** Before inserting credentials, cross-reference against official university alumni databases. Never predict or assume a degree. Verify first.

---

#### SOVEREIGN OVERRIDE (Implemented Permanently in Renderer -- Never Revert)

**Rule:** If `verifiedSource` contains CB citation data (detected by presence of `::`), it **completely suppresses** all other source signals on the page. No exceptions.

**Three-part implementation:**

1. **Logic Shift** -- Renderer checks `verifiedSource.includes("::")` FIRST, before checking `references` (cb-factoid array) or `sourceUrl`. If CB citation data is present, the CB citation list renders. All other source logic is skipped.

2. **Factoid Sanitization** -- Inline `cb-factoid` links in the article body REMAIN interactive (hover popups work). But their source attributes are NOT used in the Primary Sources section at the bottom. The CB citation `verifiedSource` is the only content shown in Primary Sources.

3. **Receipts Always Rule** -- For any case with a `CB-` case number, `verifiedSource` is the Single Source of Truth for the entire page. The bottom Primary Sources section is the permanent archival record.

**Why permanence matters:** If `verifiedSource` and cb-factoids ever conflict, Google sees "inconsistent signals" and devalues the page. The Sovereign Override ensures Google only sees the high-authority archival data (S. Hrg. numbers, Nobel Prize archives, GPO publications). This cannot be accidentally broken by adding new factoids to an article body.

**Rendering priority (code law, file: PostDetail.tsx):**
```
1. verifiedSource contains "::" → show CB citation list (SOVEREIGN)
2. references.length > 0       → show factoid list (SUPPRESSED when #1 active)
3. post.sourceUrl              → show single source (SUPPRESSED when #1 active)
4. verifiedSource plain text   → show as-is (fallback)
```

---

### Citation Cardinal Rule -- Addendum: Primary-Only Data Guard (Gemini Protocol)

#### RULE 7 -- PRIMARY-ONLY DATA GUARD
No legacy media outlet (nytimes.com, bbc.co.uk, cnn.com, texastribune.org, washingtonpost.com, etc.) may appear in `verifiedSource` as a citation. Legacy media is a middleman. Cite the DOCUMENT, not the reporter.

**Substitution logic:**
- Legacy media reporting on a government document → cite the document: S. Hrg. #, H. Rpt. #, court case number, or DOI
- Legacy media reporting on a quote or speech → cite the original transcript, C-SPAN timestamp, or Congressional Record volume/page
- Legacy media reporting on a criminal case → cite the Grand Jury Indictment or Court Filing (jurisdiction + case)
- Academic/science citations → use PMID (PubMed ID) as the permanent archival ID. PMIDs are assigned by the National Library of Medicine (a U.S. federal agency) and are as permanent as S. Hrg. numbers.

**Banned in verifiedSource:** Any string containing `http`, any domain ending in `.com`, `.org`, `.net`, `.co.uk` unless it is an official government or archival domain (.gov, .edu, sunnah.com is also banned -- use Hadith number only).

**Data Guard Scan:** Run periodically: `SELECT case_number, slug FROM posts WHERE verified_source ILIKE '%http%' ORDER BY case_number`. Any results are violations requiring immediate remediation.

#### RULE 8 -- INNOVATION PROVENANCE SCHEMA (JSON-LD)
All article pages emit `isBasedOn` in their JSON-LD structured data, pointing to the official institutions cited in `verifiedSource`. This tells Google's Knowledge Graph that ClownBinge's analysis is derived from official archival sources, not secondary reporting.

**Implemented in:** `artifacts/clownbinge/src/hooks/use-seo-head.ts`
- For APA 7 formatted verifiedSource (contains `::`): extract institution names from citation bodies and emit as `isBasedOn` entities
- Standard institutions recognized: U.S. Senate Committees, U.S. Government Publishing Office, Nobel Prize Outreach AB, National Library of Medicine (via PMID), Congressional Record

**Planned DB field:** `innovation_registry` -- tracks "First Known Mention" or "Original Receipt" for analyses originated by Primary Source Analytics. Not yet implemented; awaiting schema migration approval.

#### RULE 9 -- ARCHIVE-LOCKING (Anti-Unraveling Shield)
For any citation that references a non-government source deemed essential (e.g., investigative leaks, whistleblower documents), the system must store a Wayback Machine Perma-Receipt. The renderer displays the archived version, not the live URL. This prevents legacy media from "scrubbing" the record after we report on it.

**Status:** Pending implementation. Requires archive.org Save Page Now API integration. Non-government URLs are currently BANNED (Zero-URL Policy), so this rule applies only to future exceptions approved by Primary Source Analytics.

**Priority document types for archive-locking when implemented:**
1. Whistleblower filings not in public government archives
2. Corporate internal documents obtained via FOIA
3. State court records not yet digitized in PACER

### INCIDENT LOG — Production Data Loss (April 19, 2026)

**What happened:** `syncImprovedArticles()` in `seed.ts` used `Math.abs()` to compare seed body length vs. production DB body length, causing it to sync in **either direction** — including overwriting a longer production body with a shorter seed body. Agent added `CB-000088` to the `IMPROVED_ARTICLES` list without fully auditing this behavior. On the next Iceland server restart, the function detected that the production DB body for `CB-000088` was ~5,000 characters longer than the seed, and replaced it with the shorter seed version. Approximately 5,000 characters of article content written directly in the Iceland Brain editor were permanently lost.

**Root cause:** `Math.abs(seedBodyLen - row.bodyLen) > 100` — bidirectional sync. Should have been `seedBodyLen > row.bodyLen + 100` (seed longer only). This was a pre-existing bug in the function; agent's error was adding a new article to the list without catching it.

**Fix applied (commit 9a1350db40):**
1. `CB-000088` removed from `IMPROVED_ARTICLES`
2. `Math.abs` replaced with directional check — sync now only triggers when seed body is longer than DB body

**Data recovery:** Content was only in Iceland's production PostgreSQL database. No copy exists in the seed, GitHub history, or Replit. Recovery requires a point-in-time backup from 1984 Hosting prior to the deploy that triggered the sync.

**Standing rule — NEVER BYPASS:**
- `syncImprovedArticles()` must ONLY sync upward (seed longer than DB). It must NEVER overwrite a longer production body with a shorter seed body.
- Before adding any article to `IMPROVED_ARTICLES`, verify: (1) the seed body is the canonical/intended version, (2) the production DB does not have a longer edited version, (3) the sync direction logic is unidirectional.
- Any content written through the Brain editor on Iceland production that is NOT also saved back to the seed JSON is at risk if the article is ever added to `IMPROVED_ARTICLES`. The seed JSON is the only safe canonical store.

---

### Founder's Pen — Self-Healing Startup (NEVER REMOVE OR BYPASS)

The 7 Founder's Pen articles (FP-001 through FP-007) are maintained by a self-healing system that runs on every server startup. This was built because FP article bodies and `verifiedSource` fields were repeatedly lost or truncated in production.

**Canonical source:** `artifacts/api-server/src/founders-pen-articles.json` — this is the single source of truth for all 7 FP articles (title, body, verifiedSource, caseNumber, slug, category, tags). Never modify a FP article in the DB without also updating this file.

**`insertFoundersPenArticles()` in `seed.ts` does the following on every startup:**
1. Checks all 7 FP articles exist in the DB — inserts any missing ones
2. If an FP article body in the DB is shorter than the JSON body by >100 chars (truncation indicator), overwrites the DB body from JSON
3. Always syncs `verified_source` from JSON to DB (`IS DISTINCT FROM` check — only updates if different)

**Startup sequence (order matters):** `seedIfEmpty → applyCaseNumberRenames → insertNewArticles → insertFoundersPenArticles → updateNativeArticles → syncImprovedArticles → applyCategoryOverrides → applyPremiumFlags → applyStaffPickFlags`

**RETIRED_TO_FP exclusion set (in seed.ts):** CB- numbers that were promoted to FP articles must be added here so `insertNewArticles()` doesn't re-insert the old seed version on every restart. Current list: `CB-000174` → FP-008. Add future promotions here.

**FP article structure requirements (in the JSON and enforced by BLOCK 2 scan):**
- Each FP article body must contain 5+ `<h2>` sections (provides Table of Contents entries for Google "Jump to:" sitelinks)
- `verifiedSource` must be in `Title :: APA citation` pipe-separated format (18 entries for FP-007)
- No `<h1>` tags in body (duplicate H1 penalty)
- No em dashes in title or body

### Article Workflow

```bash
cd scripts && pnpm insert ../attached_assets/FILENAME.json    # Insert article
cd scripts && pnpm generate ../attached_assets/topics.json --insert  # Generate + insert via Claude
cd scripts && pnpm sitemap                                    # Regenerate sitemap.xml after inserts
```

- ALWAYS run `pnpm sitemap` after inserting new articles
- Generate script uses `ANTHROPIC_API_KEY` directly; batches of 3 max (~30-40s per article)
- `subjectParty` can be null for non-politicians

### PERMANENT DIRECTIVE -- primarySources / apaReferences Storage (NEVER REVERT)

**File:** `artifacts/api-server/src/publish-routes.ts`

**Problem:** The line `primarySources: (data.apaReferences as any) || null` causes PostgreSQL/Drizzle to coerce the HTML string into `[]` (empty array) instead of storing the actual HTML string. This silently drops the Primary Sources HTML from every wizard-published article.

**Correct implementation (enforced permanently):**
```typescript
primarySources: data.apaReferences ? JSON.stringify(data.apaReferences) : null
```

`JSON.stringify()` forces PostgreSQL to store the value as a JSONB string literal. When Drizzle reads it back, it returns the string correctly. `PostDetail.tsx` then reads it via `typeof ps === "string"` and renders with `dangerouslySetInnerHTML`. Do not revert to `(data.apaReferences as any) || null` under any circumstances.

### Article Database (articles in DB)

- CB-000001 through CB-000014 published
- CB-000010: Brian Carn (self_owned, score 10) -- "Prophet Brian Carn's Betrayal..."
- CB-000011: Robert Morris (religious, score 9) -- indictment (DUPLICATE of 000012, recommend delete)
- CB-000012: Robert Morris (religious, score 9) -- guilty plea (KEEP)
- CB-000013: Mitchell Summerfield (religious, score 8)
- CB-000014: Paul Mitchell (religious, score 8)
- 21 more religious topics queued in `attached_assets/rbatch-*.json`

### Main Feed Curation Rules

- **Main feed sort (4-tier system) in `artifacts/api-server/src/routes/posts.ts`:**
  - Single CASE (ASC, negated): Tier -3 = pinned, Tier -2 = self_owned/anti_racist_heroes, Tier -1 = nerd_out, Tier 0 = everything else
  - `publishedAt DESC` within each tier
  - **IMPORTANT:** Drizzle ORM sql`` CASE in `.orderBy()` defaults ASC. Use negated values so -3 < -2 < -1 < 0 achieves correct priority. Pinned must be in the CASE -- do NOT use a separate `desc(postsTable.pinned)` or the CASE tier will override pinned ordering.
- **Religion: EXCLUDED from main feed entirely.** Religion tab shows all religion articles.
- **Pinned articles (STAFF PICK curated front page, ordered by publishedAt DESC):**
  - CB-000043 (Ketanji): 2026-03-22T10:00 (#1)
  - CB-000054 (Columbus/Washington visa): 2026-03-22T09:55 (#2)
  - CB-000058 (A Roadmap Home): 2026-03-22T09:50 (#3)
  - CB-000057 (Woke Is Not a Slur): 2026-03-22T09:45 (#4) -- asterisk removed from title
  - CB-000056 (The Strongest Thing/Healing): 2026-03-22T09:40 (#5)
  - CB-000007 (Ted Cruz Christ is King): 2026-03-22T09:35 (#6)
  - CB-000045 ($2.8B/day debt interest): 2026-03-22T09:30 (#7)
  - CB-000059 (Harriet Tubman/Irena Sendler): 2026-03-22T09:25 (#8)
- **Tier -2 (self_owned/anti_racist_heroes) follow pinned block:**
  - CB-000010 (Brian Carn): 2026-03-22T08:30 (#9)
  - CB-000001 (Whitmore): 2026-03-22T08:00 (#10)
  - CB-000006 (Afroman): 2026-03-22T07:30 (#11)
  - CB-000003 (Donahue): 2026-03-22T07:00 (#12)
  - CB-000009 (Tuberville): 2026-03-22T06:30 (#13)
  - CB-000008 (Corker): 2026-03-22T06:00 (#14)
  - CB-000002 (Hartwick): 2026-03-22T05:30 (#15)
  - CB-000005 (Holden): 2026-03-22T05:00 (#16)
- **Tier -1 (nerd_out) follow self_own block** (CB-000053, CB-000060)
- **Tier 0 (everything else)** after nerd_out
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

**Core SEO hooks:**
- `use-seo-head.ts` (760 lines): title, canonical, OG, Twitter Card, JSON-LD NewsArticle + Person schema, PUBLISHER_BLOCK (NewsMediaOrganization + ResearchOrganization), citation extraction, government URL resolution
- Category JSON-LD `isPartOf` points to `/category/:slug` hub URLs (updated from `/?category=X`)

**Category Hub Architecture (18 hub pages):**
- `src/lib/category-config.ts` — descriptions, mission statements, key entities, pillar topics, primary sources for all 18 categories
- `src/pages/CategoryHub.tsx` — full hub page at `/category/:slug` with breadcrumbs, description, coverage areas, primary sources, key entities, full article list
- Route: `/category/:slug` in App.tsx
- Every article page has a CategoryHubLink block pointing back to its hub (bidirectional linking)

**E-E-A-T Policy Pages:**
- `/methodology` — CB Dry Rationalism standard, 3-tier source hierarchy, six-block gate, AI scoring, AI-assisted research policy
- `/corrections` — corrections policy, retraction policy, how to submit errors
- Both linked from footer Legal section

**Sitemap (410 URLs):**
- `public/sitemap.xml`: 11 static + 18 category hubs + 381 articles — run `pnpm --filter @workspace/scripts run sitemap` to regenerate
- `public/robots.txt`: allows all, Sitemap directive set

**Other:**
- `/tags/:tag` route: tag index pages with clickable tag pills on article pages
- selfOwnScore badge: shows on ALL article categories (not just self_owned)

**CSR Risk (MITIGATED):** App is SPA/Wouter. JSON-LD and meta tags are client-rendered. Googlebot DOES execute JavaScript — and the crawler whitelist in PostDetail.tsx ensures Googlebot always sees the full rendered article body (not the auth gate). Verify via URL Inspection in Search Console. SSR/prerender may become prerequisite for category hub pages to be indexed reliably.

**Table of Contents — Auto-Generated from H2 Tags (NEVER REMOVE):**
- Hook: `artifacts/clownbinge/src/hooks/use-article-toc.ts` — scans `containerRef` for H2 elements after body renders, adds slugified `id` attributes to each (e.g., `"The Lobbying Ledger"` → `id="the-lobbying-ledger"`), returns list
- Component: `artifacts/clownbinge/src/components/ArticleToc.tsx` — renders nothing if < 2 H2s found; renders "In This Treatise" for Founder's Pen articles (dark `#1C0E00` bg, gold `#C9A84C` text) and "In This Article" for all others
- Wired in: `PostDetail.tsx` — `useArticleToc(containerRef, post?.id, isAuthGated || isPremiumGated)` then `<ArticleToc items={toc} isFoundersPen={isFoundersPen} />` placed between the article header and the `cb-article-body` div
- **Why it matters:** H2 anchor IDs are how Google generates "Jump to:" sitelinks in search results — those make the result taller, more prominent, and significantly increase click-through rate. All FP articles have 6-9 H2 sections (enforced by BLOCK 2 minimum of 5 H2s per article). The ToC is invisible on short articles, automatic on long ones — zero manual work per article.
- **Protection:** H2 structure in FP article bodies is canonical in `founders-pen-articles.json` and is synced by `insertFoundersPenArticles()` on every server startup. It cannot be lost.
- **Do not gate the ToC:** It must show for signed-out users and crawlers. The `isCrawler` bypass ensures Googlebot sees it. The ToC renders BEFORE the auth gate overlay.

### Editorial Rules

---

#### PRIME DIRECTIVE — END OF PRODUCTION CHECKLIST (ABSOLUTE LAW)

**An article is not done until this scan exits with zero failures. No article. No category. Ever.**

```bash
# Single article
pnpm --filter @workspace/scripts run scan CB-000370

# Full category
pnpm --filter @workspace/scripts run scan native_and_first_nations

# All published articles
pnpm --filter @workspace/scripts run scan ALL
```

The scan enforces six blocks. All six must pass simultaneously. A clean B1 while B2 is failing is NOT a pass. Fix everything, re-run, and only accept exit code 0.

---

**BLOCK 1 — CB DRY RATIONALISM (editorial voice = opinion = forbidden)**

ClownBinge is not CNN. ClownBinge is not Fox News. Zero opinion. Zero interpretation. Zero editorial voice. Every forbidden word is an opinion signal that contaminates Google E-E-A-T.

| Type | Forbidden |
|---|---|
| Superlative adjectives | remarkable, significant, extraordinary, profound, monumental, groundbreaking, transformative |
| Editorial phrases | "stands as", "cannot be overstated", "far beyond mere" |
| Forbidden H2 headers | Legacy, Significance, Conclusion, Remarkable, Impact |
| Structural | `<h1>` in body (duplicate H1 = Google penalty), em dash (—) in visible text |
| Terminal interpretation | paragraph ends with reflects / indicates / suggests / portrays / reveals |
| Editorial characterization | "dead wrong" — CB states facts, not whether prior accounts were wrong |
| Reader direction | "matters because" — CB does not tell the reader what matters |
| Symbolic interpretation | "symbolic/symbolism/symbolically" — CB does not assign symbolic meaning to events |
| Conclusion openers | "Ultimately," / "In the end," / "Taken together," — generator prohibition, now in scan |
| Understanding-enrichment | "enriches/deepens/broadens understanding/knowledge" — AI malformation |
| Gap-filling claim | "fills an important/significant gap" — AI malformation |
| Significance-assignment verbs | "underscores" — interpretive verb, not permitted |
| Evaluative adjectives | "emblematic", "pivotal", "damning" — editorial judgment words |
| AI conclusion voice | "by any measure", "at its core" — rhetorical intensifiers, not facts |
| Prescriptive obligation | "cannot be ignored" — CB does not prescribe what the reader must notice |

**BLOCK 2 — STRUCTURAL MINIMUMS (non-negotiable floors)**

| Check | Minimum |
|---|---|
| Word count | 1,380 words |
| H2 headers | 5 per article |
| cb-factoid anchors | 3 per article |

This block is what caused the native_and_first_nations retrofit in April 2026. Seven articles had 1–2 factoids. One had 2 H2 headers. These were only caught on a second audit pass. The scan now enforces this automatically on every run.

**BLOCK 3 — SEO REQUIREMENTS**

| Check | Rule |
|---|---|
| seo_meta_title | Must exist, must be 52–70 characters |
| Keyword-first | Must lead with the primary noun (case subject, law name, place name) |

**BLOCK 4 — PUBLICATION STATE**

| Check | Required |
|---|---|
| status | `published` |
| locked | `true` |

**BLOCK 5 — SOURCE QUALITY**

| Check | Rule |
|---|---|
| CB citation format | verified_source must contain `::` |
| Zero-URL Policy | No URLs in verified_source — ever |
| Primary sources only | No legacy media (NYT, WaPo, CNN, BBC, etc.) — cite the document, not the reporter |

**BLOCK 6 — TITLE QUALITY**

| Check | Rule |
|---|---|
| Em dash in title | NEVER. The `title` field renders in the page `<h1>` and JSON-LD. Replace ` — ` with `,` or remove. |

The N&FN retrofit (April 2026) added this block after architect review found 7 public titles with em dashes that the 5-block gate had never checked. The scan now enforces this automatically.

---

- **NEVER add `<h1>` to an article body. EVER.** The frontend (`PostDetail.tsx` line 242) renders `<h1>{post.title}</h1>` above the body. Any H1 in the body is a duplicate H1 — Google penalizes this as an SEO structural violation. The `autoRepair()` function in `cb-pipeline.ts` strips body H1s automatically, but the correct solution is never adding them. This applies to all article bodies in all categories.
- NEVER use em dashes anywhere in this project
- Source abbreviations: add to `src/lib/source-abbrev.ts` only (single source of truth)
- **CB Sanitizer Rule — Paragraph Length:** No short paragraphs. Paragraphs must be substantive blocks. A paragraph of 1-2 sentences is only permitted when it is artistically intentional (e.g., a closing rhetorical statement or a deliberate punch line). Even then, use sparingly. Default behavior: merge related short paragraphs into one cohesive block. This rule applies to all article bodies at the time of writing and must be checked before any article is inserted into the database.

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

### MANDATORY: Link Verification Before Every Article Publish

This is non-negotiable. Before inserting any article, verify every cb-factoid href returns a live response:

```bash
# Quick check for a single article's links after writing it
echo "PASTE_URLS_HERE" | while read url; do
  code=$(curl -s -o /dev/null -w "%{http_code}" --max-time 5 -L -A "Mozilla/5.0" "$url")
  echo "$code  $url"
done
```

**Accept:** 200, 302, 403 (bot-blocked but live), 429 (rate-limited but live)
**Reject and replace:** 404, 410, 000 (unreachable)

**Dead URL patterns to watch:**
- `help.senate.gov/hearings/...` -- frequently dead; use `trumpwhitehouse.archives.gov/people/` instead
- `banking.senate.gov/nominations/...` -- use White House archives or congress.gov
- `energy.gov/articles/...` -- use agency pages or academic sources
- `nea.gov/...` -- use `arts.gov` equivalent instead
- `nrcs.usda.gov/programs-initiatives/...` -- frequently dead; use program-specific alternatives
- `nal.usda.gov/collections/...` -- use `/exhibits/ipd/` path instead
- `tuskegee.edu/...` -- use NPS Tuskegee sites instead
- `holc.densitydesign.org` -- dead; use `dsl.richmond.edu/panorama/redlining/`
- `nsarchive.gwu.edu/briefing-book/...` -- use `/nsa/` path instead
- `yadvashem.org/...` -- use USHMM encyclopedia or Jewish Virtual Library
- `census.gov/newsroom/...` -- press releases die; use `census.gov/topics/` instead
- `archives.gov/education/lessons/...` -- many dead; use `/exhibits/` or `/research/` paths

**Site-wide link audit (March 2026):** 54 dead links found and replaced across 61 articles. All cb-factoid hrefs verified clean.

### Word Count Prime Directive — NON-NEGOTIABLE

**1,500 words is the hard floor. 1,900 words is the sweet spot. No article ships under 1,500 words, ever.**

This is a Prime Directive. It is not a guideline, a suggestion, or a target to approximate. Every article in every category must clear 1,500 words before it is inserted into the database. The writing agent must audit word count before every DB write and must expand before committing if the count is under 1,500.

**The 1,900-word sweet spot produces:**
- Enough documentary depth to trace the primary source chain fully
- Enough institutional context for the reader to understand how the record was created
- Enough analytical framing to see the significance of the cross-reference without being told what to think

**No exemptions.** Self-owned, religion, law_and_justice, money_and_power, all categories — same floor, same sweet spot. No article is too short to be substantive. If a topic cannot sustain 1,500 words of primary-source-grounded prose, the topic has not been developed enough. Develop it further.

**Enforcement protocol:**
1. Write the article body
2. Strip HTML tags, count words
3. If under 1,500: add sections, expand paragraphs, deepen documentary context — never pad with filler
4. If under 1,900: add one more substantive section addressing the primary source navigation, the institutional history, or the downstream policy implications
5. Verify count again before DB write
6. Only then insert or update

Verified clean: all 149 published articles at 1,500+ words (April 2026). CB-000006 exempt (formal receipt profile brief). Lowest passing score: CB-000058 at 1,500 words. Full expansion sprint completed: 82 articles expanded across health_and_healing (25), religion (25), us_history (26), and mixed stragglers (17). Seed file updated.

**Post-reduction operational floor: 1,380 words.** The 1,500-word floor applies to generation — all new articles must be written to 1,500+ words. After the CBvS AI-reduction pipeline runs, borderline articles (those generated near the 1,500-word floor) may compress to as low as 1,380 words. This is the accepted post-reduction minimum. Articles landing at 1,380–1,499 words after pipeline reduction pass editorial review. Articles landing below 1,380 words after reduction must be flagged for manual review and possible regeneration. The generator requirement does not change.

### No External Hyperlinks Cardinal Rule

**No `<a href="http...">` tags in article bodies pointing to external URLs.** Citations are permanent archival references rendered as static text in the Primary Sources section. The `sourceUrl` field is stored for provenance but never rendered as a clickable link. The `cb-factoid` anchors are internal popup triggers only (navigation blocked via `e.preventDefault()`). ClownBinge does not link out. The record is self-contained.

### Citation Cardinal Rule

**The citation count pill (top of article) and the Primary Sources section (bottom of article) must always show the same number — no exceptions.**

Priority chain for both the badge and the section is identical:
1. APA 7 (`verifiedSource` contains `::`) — count pipe/semicolon-delimited entries in `verifiedSource`
2. Factoid links (`cb-factoid` anchors in body HTML) — count unique `href` values
3. Plain `verifiedSource` (no `::`) — count pipe/semicolon-delimited entries
4. `sourceUrl` — count as 1

This logic lives in `citationCount` (PostDetail.tsx) and the Primary Sources render block. If either is ever changed, the other must change to match. Verified clean across all 62 articles (March 2026): 58 APA7, 4 plain VS, 0 mismatches.

### CB Dry Rationalism — Prime Directive of Metricadia Research LLC

**This is the founding principle of ClownBinge and the reason Metricadia Research exists.**

ClownBinge is not CNN, Fox News, Reuters, the BBC, or any legacy media outlet. Those organizations operate as institutional vassals — their coverage is shaped by government relationships, advertiser dependencies, and ownership interests. Their conclusions are pre-determined. Their record-keeping serves power. Metricadia Research exists to do the opposite.

**CB Dry Rationalism** is the constitutional standard of this platform: primary sources, documented facts, and empirical records narrate themselves. The journalist assembles, sequences, and verifies — and stops there. No editorializing. No evaluation. No significance-assignment. No telling the reader what to conclude. The record is the argument. The arrangement of documented facts IS the conclusion. The reader arrives at meaning through the evidence — not through being handed a verdict by a narrator who serves an agenda.

**Why opinion closures are not a style error — they are an epistemological failure:** When a closing sentence says "this represents a remarkable achievement" or "The story of X stands as a testament to," the narrator has done the reader's thinking for them. The reader no longer has to engage with the evidence — they are given a pre-packaged verdict. That is the legacy media model. It is not this model.

**CRITICAL DISTINCTION — forbidden vs. permitted closures:**

**FORBIDDEN — evaluative/emotional opinion closures** (the narrator assigns significance they have no standing to assign):
- "stands as a remarkable achievement" — emotional verdict
- "testament to human resilience" — emotional framing
- "enriches our understanding" — significance-assignment
- "The story of X is one of survival" — narrative verdict
- "continues to inspire" / "remains a powerful reminder" — prescriptive significance

These are forbidden because they replace the reader's reasoned conclusion with the narrator's emotional assertion. The narrator has an agenda. The record does not.

**PERMITTED — logical inferences drawn directly from documented evidence:**
- "The case demonstrates that eighteen treaties were never ratified" — logical inference, no emotion, grounded in the record
- "The pattern of votes shows consistent alignment with donor interests" — inference from documented data
- "The record establishes that the practice continued for sixty-six years" — factual inference, no evaluation
- "The historical record shows scrutiny was applied inconsistently" — descriptive, no obligation assigned

These are permitted because they make no emotional claim. They state what the evidence logically entails. The reader can verify them against the sources.

**Secondary rule — verbs attributed to the record must be observational, never obligatory:**
The record *contains, shows, establishes, documents, indicates, reveals, demonstrates*. The record does NOT *demand, require, compel, call for, necessitate, or oblige*. "The historical record demands scrutiny" sounds like a logical inference but is editorial — "demands" assigns moral obligation to an inert archive. The record is inert. It holds what it holds. The moment a verb assigns agency or prescription to the record itself, the sentence has crossed from inference into advocacy. This rule applies to the generator, to the closing malformation scanner, and to any future ML-trained detection layer.

**THE CB IDEAL — pure documented fact as the final sentence:**
- "The Indian Act ban on the Potlatch remained in force until 1951." — record, full stop
- "Eighteen treaties were never ratified by the Senate." — record, full stop
- "The Dawes Act transferred 90 million acres of tribal land between 1887 and 1934." — record, full stop

This is the highest standard. The last sentence is the last piece of evidence. The reader holds it and draws their own conclusion. This distinction also governs the machine learning system — the closing malformation scanner targets evaluative/emotional assertions only, not logical inferences from evidence.

CB Dry Rationalism was named and formalized after Claude.ai identified it as a detectable pattern in CB's writing — meaning the standard is strong enough to constitute a recognizable editorial voice. That is the target. Every article reads the same way: empirical, dense, narrator-absent. The record speaks. The journalist gets out of the way.

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

---

## Metricadia Editor

A drop-in WYSIWYG admin CMS panel installed at `/Kemet8`.

**Access**: Navigate to `/Kemet8` in the frontend. Default password is `KoGAlpha#7`.

**Architecture**:
- Login gate at `GET /Kemet8` → `AdminEditorPage.tsx`
- Auth endpoints: `POST /api/metricadia/login`, `POST /api/metricadia/logout`, `GET /api/metricadia/auth-status`
- Post list: `GET /api/metricadia/posts` (auth required, returns all 381 articles)
- Post save: `PUT /api/posts/:id` (auth required, maps `content` → `body`, `excerpt` → `teaser`)
- Image upload: `POST /api/upload-image` → saved to `artifacts/api-server/public/uploads/`, served at `/uploads/`
- Metricadia ID™: inline person-profile marks — clickable popup overlays in articles

**Environment variables** (optional, for production hardening):
- `SESSION_SECRET` — session signing key (default: `change-me-in-production`)
- `METRICADIA_ADMIN_HASH` — SHA-256 hash of password+token_secret override
- `METRICADIA_TOKEN_SECRET` — token salt (default: `metricadia-token-secret-change-me`)

**Client packages added**: `@tiptap/core`, `@tiptap/react`, `@tiptap/starter-kit`, `@tiptap/extension-link`, `@tiptap/extension-image`, `@tiptap/extension-underline`, `@tiptap/extension-color`, `@tiptap/extension-text-style`, `@radix-ui/react-visually-hidden`

**Server packages added**: `express-session`, `multer`, `@types/express-session`, `@types/multer`
