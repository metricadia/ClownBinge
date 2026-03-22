# ClownBinge: Google Dating Methodology
### Publication Velocity Management for Domain Protection at Scale

**Version:** 1.0  
**Project:** ClownBinge — Verified Public Accountability Journalism  
**Purpose:** Protect domain authority while publishing 2,000+ records without triggering Google spam detection  
**Classification:** Internal Operations Document — Replit Build Reference

---

## 1. THE CORE PRINCIPLE

Google does not just evaluate individual articles. It evaluates publishing behavior patterns at the domain level. A domain that publishes 2,000 articles in 30 days is algorithmically indistinguishable from a content farm. The penalty for that classification is domain-level suppression — meaning every indexed record, every accumulated authority signal, and every ranking position is wiped simultaneously.

The goal of the dating methodology is to make ClownBinge's publishing pattern look like a small, consistent, professional editorial team operating over time. Because that is exactly what it is.

**The rule is simple: publish like a newsroom, not like a database dump.**

---

## 2. PUBLICATION VELOCITY SCHEDULE

Publishing cadence must ramp gradually. Abrupt high-volume publishing from a new or recently activated domain is a primary spam trigger.

### Phase Schedule

| Phase | Months | Articles Per Week | Articles Per Day Max | Cumulative Total |
|-------|--------|-------------------|----------------------|-----------------|
| Establishment | 1–2 | 2–3 | 1 | ~20 |
| Building | 3–4 | 4–5 | 1 | ~60 |
| Momentum | 5–6 | 5–7 | 2 | ~120 |
| Operation | 7–12 | 7–10 | 2 | ~400 |
| Scale | 13–24 | 10–14 | 2 | ~1,000 |
| Full | 25–42 | 10–14 | 2 | ~2,000 |

### Hard Limits — Never Exceed

```
Maximum articles per day:        2
Maximum articles per week:       14
Minimum gap between any two 
  publications:                  11 hours
Maximum same-day gap floor:      6 hours
```

These limits apply regardless of how many articles are queued and ready to publish.

---

## 3. PUBLICATION TIME DISTRIBUTION

Real newsrooms publish across organic time windows. Mechanical regularity — publishing at exactly 9:00am every day — is itself a spam signal. All publication times must be randomized within defined windows.

### Approved Publishing Windows (Eastern Time)

```
Morning Cycle      07:15 – 09:45     Weight: 20%
Midday Peak        11:00 – 13:30     Weight: 25%
Afternoon Cycle    14:00 – 16:30     Weight: 25%
Evening Readers    19:00 – 21:00     Weight: 20%
Late Night         22:00 – 23:30     Weight: 10%
```

### Prohibited Publishing Windows

```
00:00 – 07:00     (Dead zone — no legitimate small newsroom publishes here)
```

### Randomization Logic for Replit

```javascript
function getPublishTime(window) {
  const [start, end] = window.split(' – ').map(t => parseTime(t));
  const randomOffset = Math.floor(Math.random() * (end - start));
  const minutes = Math.floor(Math.random() * 60);
  return new Date(start + randomOffset).setMinutes(minutes);
}
```

Never publish two articles at the same minute. Never publish on identical timestamps on consecutive days.

---

## 4. THE PUBLICATION QUEUE ARCHITECTURE

All articles enter a managed queue. No article publishes directly from creation to live. Every article passes through the queue with an assigned future publication timestamp.

### Queue Structure

```javascript
const publicationQueue = {

  // Maximum articles held in queue at any time
  maxQueueSize: 500,

  // Daily publish limit — hard ceiling
  dailyLimit: 2,

  // Weekly publish limit — hard ceiling  
  weeklyLimit: 14,

  // Minimum hours between any two publications
  minimumGapHours: 11,

  // Randomize publish minutes within window
  randomizeMinutes: true,

  // Randomize publish seconds (additional organic signal)
  randomizeSeconds: true,

  // Never publish on a weekend at the same rate as weekdays
  weekendReduction: 0.5,

  // Category distribution — avoid publishing same category consecutively
  consecutiveCategoryBlock: true
};
```

### Category Rotation Rule

Never publish two articles from the same category on consecutive days. If Monday publishes a `self_owned` article, Tuesday must publish from a different category. This prevents topical clustering patterns that look like automated batch generation.

```javascript
const categoryRotation = [
  'self_owned',
  'clown_electeds', 
  'political',
  'religious',
  'cultural',
  'anti_racist_hero'
];
// Rotate through categories. Never repeat category on back-to-back days.
```

---

## 5. THE `publishedAt` FIELD PROTOCOL

The `publishedAt` timestamp in every ClownBinge JSON article object is the canonical publication date. It controls three things simultaneously:

1. The date displayed on the article page
2. The date submitted to Google via sitemap
3. The date reported to Google Search Console

### Rules for Setting `publishedAt`

```
NEVER set publishedAt to the date the article was written.
ALWAYS set publishedAt to the queue-assigned future publication date.
NEVER backdate articles to dates before the domain was active.
NEVER bulk-assign the same publishedAt timestamp to multiple articles.
ALWAYS ensure publishedAt reflects the actual live publication moment.
```

### Timestamp Format

All timestamps must follow ISO 8601 with timezone:

```
YYYY-MM-DDTHH:MM:SS.000Z

Example: 2024-03-15T14:23:47.000Z
```

Never use date-only format (`2024-03-15`) in the `publishedAt` field. Google's crawlers read time precision as an authenticity signal for news content.

---

## 6. SITEMAP MANAGEMENT

The sitemap must update automatically every time a new article is published. It must not update in anticipation of future publications.

### Sitemap Update Rules

```
Update sitemap:      Only when article goes live
Never include:       Future-dated unpublished articles
Resubmit to GSC:     Within 30 minutes of each publication
Maximum sitemap size: 50,000 URLs per sitemap file
Split strategy:      Use sitemap index file when approaching 1,000 articles
```

### Sitemap Index Structure (for scale)

```xml
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <sitemap>
    <loc>https://clownbinge.com/sitemap-articles-1.xml</loc>
    <lastmod>2024-03-15</lastmod>
  </sitemap>
  <sitemap>
    <loc>https://clownbinge.com/sitemap-articles-2.xml</loc>
    <lastmod>2024-03-15</lastmod>
  </sitemap>
</sitemapindex>
```

---

## 7. GOOGLE INDEXING API PROTOCOL

Every new publication triggers a direct Google Indexing API call. Do not rely on passive crawl discovery for a domain building toward 2,000 records. Active submission ensures 24–48 hour indexing versus the weeks passive discovery can take.

### Indexing API Call Structure

```javascript
async function submitToGoogle(slug) {
  const response = await fetch(
    'https://indexing.googleapis.com/v3/urlNotifications:publish',
    {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${googleAuthToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        url: `https://clownbinge.com/${slug}`,
        type: 'URL_UPDATED'
      })
    }
  );
  return response.json();
}
```

### Indexing API Rate Limits

```
Google allows: 200 URL submissions per day
ClownBinge publishes: Maximum 2 per day
Buffer available: 198 calls per day for resubmissions
```

The daily publication limit is well within the Indexing API quota. No throttling issues at the planned cadence.

---

## 8. THE MODIFIED DATE PROTOCOL

When the weekly SEO brain automation fixes a non-performing article — updating title tags, adding factoid anchors, strengthening meta descriptions — the `dateModified` schema field must update. The `datePublished` field must never change.

```json
{
  "@type": "NewsArticle",
  "datePublished": "2024-03-15T14:23:47.000Z",
  "dateModified": "2024-04-22T09:15:33.000Z"
}
```

Google reads `dateModified` updates as a signal that the content is actively maintained. This is a positive ranking signal. It also triggers recrawling, giving fixed articles a second opportunity to rank.

### Modified Date Rules

```
NEVER change datePublished after initial publication
ALWAYS update dateModified when substantive changes are made
Substantive changes include: new factoid tags, updated sources, 
  title revisions, meta description changes, body additions
Do NOT update dateModified for: typo fixes, formatting corrections
```

---

## 9. THIN CONTENT RATIO PROTECTION

Google measures the ratio of substantive content to total domain pages. If this ratio degrades, the entire domain is penalized.

### Minimum Content Requirements Per Article

```
Body word count:          600 words minimum (enforced at queue entry)
Factoid anchor tags:      Minimum 3 per article
External source links:    Minimum 2 per article
Internal links:           Minimum 1 per article
Meta description length:  120–160 characters
Title tag length:         50–65 characters
```

### Pages That Dilute the Ratio (Replit Must Address)

```
Category index pages:     Must have 200+ words of unique descriptive content
Tag index pages:          Must have 150+ words of unique descriptive content  
Author/about pages:       Must have 300+ words
404 page:                 Must have navigation links back to live content
```

A category index page that is just a list of article titles with no surrounding content counts as thin. Replit must build category pages with genuine descriptive content blocks.

---

## 10. DOMAIN HEALTH WEEKLY CHECKLIST

The automated weekly health check runs parallel to the SEO brain every Sunday at 2:00am ET.

### Automated Checks

```javascript
const weeklyHealthCheck = {

  // Content quality
  minimumWordCount: 600,
  factoidTagMinimum: 3,
  
  // Technical integrity
  canonicalTagPresent: true,
  schemaMarkupValid: true,
  metaDescriptionPresent: true,
  titleTagLength: { min: 50, max: 65 },
  
  // Link health
  internalLinkValidation: true,
  externalLinkStatusCheck: true,  // Flag broken source links
  
  // Performance
  coreWebVitalsCheck: true,
  httpsEnforcement: true,
  
  // Publication pattern
  velocityAnomalyDetection: true,  // Flag if >2 articles published same day
  
  // Alert threshold
  alertThreshold: 0.02  // Email alert if >2% of pages fail any check
};
```

### Core Web Vitals Targets

```
Largest Contentful Paint (LCP):    Under 2.5 seconds
First Input Delay (FID):           Under 100 milliseconds
Cumulative Layout Shift (CLS):     Under 0.1
Time to First Byte (TTFB):         Under 800 milliseconds
```

---

## 11. PRE-LAUNCH STAGING PROTOCOL

Before the production domain goes live, the first 50 articles must be validated on a staging environment.

### Staging Validation Checklist

```
[ ] Schema markup passes Google Rich Results Test
[ ] All 50 articles pass Core Web Vitals
[ ] Sitemap generates and validates correctly
[ ] Indexing API authentication confirmed
[ ] robots.txt allows all crawlers
[ ] Canonical tags present on all pages
[ ] Category index pages have substantive content
[ ] No duplicate meta descriptions across any two articles
[ ] No duplicate title tags across any two articles
[ ] All factoid anchor tags render as interactive tooltips
[ ] Mobile rendering passes Google Mobile-Friendly Test
[ ] HTTPS enforced on all pages
[ ] 404 page returns proper HTTP 404 status code
```

Only after all 50 items pass does the production domain go live.

---

## 12. WHAT NEVER TO DO

These actions risk domain-level penalties from which recovery takes 6–18 months.

```
NEVER purchase backlinks from any source
NEVER publish more than 2 articles in a single calendar day
NEVER set identical publishedAt timestamps on any two articles
NEVER backdate articles to before domain activation date
NEVER publish stub or placeholder articles to hold slugs
NEVER use spun, paraphrased, or AI-bulk-generated content
  without full editorial voice standards applied
NEVER submit the same URL to the Indexing API more than 
  once per 24-hour period
NEVER create tag or category pages with no substantive content
NEVER allow broken external links to primary sources to persist 
  beyond 30 days without resolution
NEVER change a slug after an article has been indexed
  (this creates a 404 and loses all accumulated ranking signals)
```

---

## 13. SLUG PERMANENCE PROTOCOL

Once an article is published and indexed, its slug is permanent. A changed slug is a new URL. The old URL becomes a 404. All accumulated ranking signals, inbound links, and domain authority attached to the old URL are lost.

### Slug Construction Rules

```
Format:     /[category]/[subject-lastname]-[topic-keyword]-[year]
Example:    /self-owned/tuberville-broadband-infrastructure-2021

Rules:
- Lowercase only
- Hyphens only, no underscores
- No special characters
- No stop words (the, a, an, of, for)
- Maximum 75 characters
- Must include subject last name
- Must include primary topic keyword
- Must include year of incident
```

If a slug must be changed after indexing (rare, edge case only), implement a 301 permanent redirect from the old URL to the new URL immediately, and resubmit both URLs to the Indexing API.

---

## 14. GOOGLE SEARCH CONSOLE SUBMISSION PROTOCOL

### Initial Domain Setup

```
Day 1:   Verify domain ownership in Google Search Console
Day 1:   Submit sitemap.xml
Day 1:   Confirm Indexing API credentials active
Day 2:   Publish first article
Day 2:   Submit first article URL via Indexing API
Day 3:   Confirm first article appears in GSC Coverage report
Day 7:   Confirm first article indexed in Google (site:clownbinge.com)
```

### Ongoing GSC Monitoring

```
Weekly:   Pull performance data via Search Console API (Sunday 2am)
Weekly:   Review Coverage report for any indexing errors
Weekly:   Check for manual action notifications
Monthly:  Review Core Web Vitals report in GSC
Monthly:  Review Mobile Usability report in GSC
```

---

## 15. THE COMPOUND TIMELINE

At the planned cadence, here is the projected domain authority development:

```
Months 1–3:    Indexing and baseline establishment
               Expected traffic: minimal
               Goal: clean crawl record, zero penalties

Months 4–6:    Named-entity searches begin surfacing ClownBinge
               Expected traffic: early growth signal
               Goal: first page-2 rankings for subject-name queries

Months 7–12:   Domain authority threshold crossed
               Expected traffic: measurable organic sessions weekly
               Goal: first page-1 rankings for primary queries

Months 13–24:  Scale phase, 1,000 records approaching
               Expected traffic: compounding weekly growth
               Goal: ClownBinge appears in subject-name search clusters

Months 25–42:  2,000 records, full operation
               Expected traffic: primary acquisition channel
               Goal: topical authority domain, citation source for press
```

---

## DOCUMENT CONTROL

```
Created:      March 2026
Owner:        ClownBinge Editorial Operations
Replit Ref:   Build reference for publication queue and SEO automation
Review cycle: Quarterly or when Google algorithm updates affect methodology
```

---

*The domain is the bank. Every article is a deposit. The dating methodology is the vault.*
