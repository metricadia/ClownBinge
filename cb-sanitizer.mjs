/**
 * ╔══════════════════════════════════════════════════════════════════╗
 * ║               CB SANITIZER — ClownBinge Intra-Project Brain     ║
 * ║                                                                  ║
 * ║  Final scan agent. Knows every rule. Runs against the live DB.  ║
 * ║  Exit 0 = all clear. Exit 1 = violations found.                 ║
 * ║                                                                  ║
 * ║  Usage:  node cb-sanitizer.mjs                                  ║
 * ║          node cb-sanitizer.mjs --fix-hints   (show SQL hints)   ║
 * ╚══════════════════════════════════════════════════════════════════╝
 */

import { createRequire } from 'module';
import { fileURLToPath } from 'url';
import { join, dirname } from 'path';

// Resolve pg from the lib/db package where it is explicitly installed
const __dirname = dirname(fileURLToPath(import.meta.url));
const require = createRequire(join(__dirname, 'lib/db/package.json'));
const pg = require('pg');

const { Client } = pg;

// ── Terminal colours ─────────────────────────────────────────────────────────
const C = {
  reset:  '\x1b[0m',
  bold:   '\x1b[1m',
  dim:    '\x1b[2m',
  red:    '\x1b[31m',
  yellow: '\x1b[33m',
  green:  '\x1b[32m',
  cyan:   '\x1b[36m',
  white:  '\x1b[37m',
  bgRed:  '\x1b[41m',
};

const SHOW_FIX_HINTS = process.argv.includes('--fix-hints');

// ══════════════════════════════════════════════════════════════════════════════
// RULE DEFINITIONS
// ══════════════════════════════════════════════════════════════════════════════

/**
 * CATEGORY 1 — Template Openers
 * Checked only against the first 400 plain-text characters.
 * These are the AI article-opening templates we burned out of the corpus.
 */
const OPENER_PATTERNS = [
  { re: /there is a (particular|certain) (kind|species|variety|genre|type) of/i,       label: 'template opener — "There is a particular/certain kind of..."' },
  { re: /there is a certain theological (clarity|irony|tension|confidence)/i,           label: 'template opener — "There is a certain theological [noun]..."' },
  { re: /there is a particular (theological|institutional|historical|political)/i,      label: 'template opener — "There is a particular [adj]..."' },
];

/**
 * CATEGORY 2 — Banned Body Phrases
 * Checked against the full plain-text body.
 * Every phrase here has been surgically removed from the live corpus.
 * The guard in cb-rewriter.ts + fixme.ts prevents re-introduction via AI.
 */
const BANNED_PHRASES = [

  // ── AI filler / hedge phrases ────────────────────────────────────────────
  { phrase: 'it is worth noting',         cat: 'AI filler' },
  { phrase: "it's worth noting",          cat: 'AI filler' },
  { phrase: 'it is important to note',    cat: 'AI filler' },
  { phrase: "it's important to note",     cat: 'AI filler' },
  { phrase: 'needless to say',            cat: 'AI filler' },
  { phrase: 'it goes without saying',     cat: 'AI filler' },
  { phrase: 'to summarize',              cat: 'AI filler' },
  { phrase: 'in summary',               cat: 'AI filler' },
  { phrase: 'in conclusion',            cat: 'AI filler' },
  { phrase: 'delve into',               cat: 'AI filler' },
  { phrase: 'dive deep into',           cat: 'AI filler' },
  { phrase: 'shed light on',            cat: 'AI filler' },
  { phrase: "in today's world",         cat: 'AI filler' },
  { phrase: "in today's society",       cat: 'AI filler' },
  { phrase: 'in the realm of',          cat: 'AI filler' },
  { phrase: 'the tapestry of',          cat: 'AI filler' },
  { phrase: 'as we navigate',           cat: 'AI filler' },
  { phrase: 'the landscape of',         cat: 'AI filler' },
  { phrase: 'complex and multifaceted', cat: 'AI filler' },
  { phrase: 'nuanced issue',            cat: 'AI filler' },
  { phrase: 'it is crucial to note',    cat: 'AI filler' },
  { phrase: 'it is essential to note',  cat: 'AI filler' },
  { phrase: 'at the end of the day',    cat: 'AI filler' },
  { phrase: 'fascinating topic',        cat: 'AI filler' },
  { phrase: 'furthermore, it is',       cat: 'AI filler' },
  { phrase: 'moreover, it is',          cat: 'AI filler' },
  { phrase: 'notably,',                 cat: 'AI filler' },
  { phrase: 'of course,',               cat: 'AI filler' },

  // ── Hollow transitions ───────────────────────────────────────────────────
  { phrase: 'with that in mind',              cat: 'hollow transition' },
  { phrase: 'with this in mind',              cat: 'hollow transition' },
  { phrase: 'having said that',               cat: 'hollow transition' },
  { phrase: 'that being said',                cat: 'hollow transition' },
  { phrase: 'that said,',                     cat: 'hollow transition' },
  { phrase: 'having established',             cat: 'hollow transition' },
  { phrase: 'building on this',               cat: 'hollow transition' },
  { phrase: 'in light of this',               cat: 'hollow transition' },
  { phrase: 'in light of the above',          cat: 'hollow transition' },
  { phrase: 'moving forward,',                cat: 'hollow transition' },
  { phrase: 'going forward,',                 cat: 'hollow transition' },
  { phrase: 'all things considered',          cat: 'hollow transition' },
  { phrase: 'when all is said and done',      cat: 'hollow transition' },
  { phrase: 'by the same token',              cat: 'hollow transition' },
  { phrase: 'for all intents and purposes',   cat: 'hollow transition' },
  { phrase: 'suffice it to say',              cat: 'hollow transition' },

  // ── Passive / impersonal scholarly hedges ────────────────────────────────
  { phrase: 'it has been argued',             cat: 'passive hedge' },
  { phrase: 'it has been suggested',          cat: 'passive hedge' },
  { phrase: 'it has been noted',              cat: 'passive hedge' },
  { phrase: 'it is believed',                 cat: 'passive hedge' },
  { phrase: 'it is clear that',               cat: 'passive hedge' },
  { phrase: 'it is evident that',             cat: 'passive hedge' },
  { phrase: 'it is obvious that',             cat: 'passive hedge' },
  { phrase: 'it cannot be denied',            cat: 'passive hedge' },
  { phrase: 'there is no denying',            cat: 'passive hedge' },
  { phrase: 'it bears mentioning',            cat: 'passive hedge' },
  { phrase: 'it bears noting',               cat: 'passive hedge' },
  { phrase: 'the fact of the matter is',      cat: 'passive hedge' },
  { phrase: 'one must',                       cat: 'passive hedge' },
  { phrase: 'one might argue',                cat: 'passive hedge' },
  { phrase: 'one could argue',                cat: 'passive hedge' },
  { phrase: 'may perhaps',                    cat: 'passive hedge' },
  { phrase: 'might possibly',                 cat: 'passive hedge' },
  { phrase: 'could potentially',              cat: 'passive hedge' },

  // ── Faux profundity closers ───────────────────────────────────────────────
  { phrase: 'history will judge',   cat: 'faux profundity' },
  { phrase: 'time will tell',       cat: 'faux profundity' },
  { phrase: 'only time will tell',  cat: 'faux profundity' },

  // ── Meta-document references ─────────────────────────────────────────────
  { phrase: 'in this article',         cat: 'meta-document' },
  { phrase: 'in this piece',           cat: 'meta-document' },
  { phrase: 'in this chapter',         cat: 'meta-document' },
  { phrase: 'in this section',         cat: 'meta-document' },
  { phrase: 'throughout this article', cat: 'meta-document' },
  { phrase: 'the reader',              cat: 'meta-document' },

  // ── Typography tells (dead giveaway for AI authorship) ───────────────────
  { phrase: '\u2014',  cat: 'em dash — AI typography tell. Use comma, period, or parentheses.' },
  { phrase: '--',      cat: 'double hyphen — AI typography tell. Use comma, period, or parentheses.' },

  // ── Conceptual looping / back-reference phrases ──────────────────────────
  { phrase: 'as previously mentioned',  cat: 'conceptual loop' },
  { phrase: 'as previously noted',      cat: 'conceptual loop' },
  { phrase: 'as noted earlier',         cat: 'conceptual loop' },
  { phrase: 'as mentioned earlier',     cat: 'conceptual loop' },
  { phrase: 'as discussed earlier',     cat: 'conceptual loop' },
  { phrase: 'as stated earlier',        cat: 'conceptual loop' },
  { phrase: 'as mentioned above',       cat: 'conceptual loop' },
  { phrase: 'as noted above',           cat: 'conceptual loop' },
  { phrase: 'as stated above',          cat: 'conceptual loop' },
  { phrase: 'as we discussed',          cat: 'conceptual loop' },
  { phrase: 'as mentioned previously',  cat: 'conceptual loop' },
  { phrase: 'as discussed previously',  cat: 'conceptual loop' },
  { phrase: 'recall that',              cat: 'conceptual loop' },
  { phrase: 'as you may recall',        cat: 'conceptual loop' },
  { phrase: 'returning to this',        cat: 'conceptual loop' },
  { phrase: 'returning to our',         cat: 'conceptual loop' },
  { phrase: 'returning to the question',cat: 'conceptual loop' },
  { phrase: 'returning to the topic',   cat: 'conceptual loop' },
  { phrase: 'returning to the point',   cat: 'conceptual loop' },
  { phrase: 'as i mentioned',           cat: 'conceptual loop' },
  { phrase: 'as we have seen',          cat: 'conceptual loop' },
];

// ══════════════════════════════════════════════════════════════════════════════
// HELPERS
// ══════════════════════════════════════════════════════════════════════════════

function stripHtml(html) {
  return html
    .replace(/<[^>]+>/g, ' ')
    .replace(/&amp;/g,  '&')
    .replace(/&lt;/g,   '<')
    .replace(/&gt;/g,   '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g,  "'")
    .replace(/&nbsp;/g, ' ')
    .replace(/&ldquo;/g, '"')
    .replace(/&rdquo;/g, '"')
    .replace(/&mdash;/g, '—')
    .replace(/&ndash;/g, '–')
    .replace(/\s+/g, ' ')
    .trim();
}

function getParas(html) {
  return (html.match(/<p[^>]*>([\s\S]*?)<\/p>/gi) || [])
    .map(p => stripHtml(p).trim())
    .filter(p => p.length > 30);
}

function getSentences(text) {
  return text
    .split(/(?<=[.!?])\s+(?=[A-Z"'])/)
    .map(s => s.trim())
    .filter(s => s.length > 40);
}

function excerpt(plain, phrase, pad = 120) {
  const idx = plain.toLowerCase().indexOf(phrase.toLowerCase());
  if (idx < 0) return '';
  const start = Math.max(0, idx - pad);
  const end   = Math.min(plain.length, idx + phrase.length + pad);
  const pre   = start > 0 ? '…' : '';
  const post  = end < plain.length ? '…' : '';
  return pre + plain.slice(start, end) + post;
}

function banner(title) {
  const line = '═'.repeat(68);
  console.log(`\n${C.cyan}${C.bold}╔${line}╗${C.reset}`);
  console.log(`${C.cyan}${C.bold}║  ${title.padEnd(66)}║${C.reset}`);
  console.log(`${C.cyan}${C.bold}╚${line}╝${C.reset}`);
}

function section(title, count) {
  const status = count === 0
    ? `${C.green}✓ CLEAN${C.reset}`
    : `${C.red}${C.bold}✗ ${count} violation(s)${C.reset}`;
  console.log(`\n${C.bold}── ${title} ──${C.reset}  ${status}`);
}

function violation(slug, label, context) {
  console.log(`\n  ${C.yellow}${C.bold}[${slug}]${C.reset}`);
  console.log(`  ${C.red}▸ ${label}${C.reset}`);
  if (context) {
    // highlight the matched phrase inside the excerpt
    console.log(`  ${C.dim}"${context}"${C.reset}`);
  }
}

// ══════════════════════════════════════════════════════════════════════════════
// MAIN
// ══════════════════════════════════════════════════════════════════════════════

async function main() {
  banner('CB SANITIZER  —  ClownBinge Intra-Project Brain');

  // ── Connect ────────────────────────────────────────────────────────────────
  const client = new Client({ connectionString: process.env.DATABASE_URL });
  await client.connect();

  const { rows } = await client.query(
    `SELECT slug, body, verified_source, case_number FROM posts WHERE status = 'published' ORDER BY slug`
  );

  console.log(`\n${C.dim}Loaded ${rows.length} published articles from database.${C.reset}`);

  const totals = {};
  let grandTotal = 0;

  // ══════════════════════════════════════════════════════════════════════════
  // CHECK 1 — Template Openers
  // ══════════════════════════════════════════════════════════════════════════
  {
    const hits = [];
    for (const { slug, body } of rows) {
      const plain = stripHtml(body);
      const opening = plain.slice(0, 400);
      for (const { re, label } of OPENER_PATTERNS) {
        if (re.test(opening)) hits.push({ slug, label, ctx: excerpt(opening, opening.match(re)?.[0] ?? '', 80) });
      }
    }
    section('TEMPLATE OPENERS', hits.length);
    hits.forEach(h => violation(h.slug, h.label, h.ctx));
    totals['Template Openers'] = hits.length;
    grandTotal += hits.length;
  }

  // ══════════════════════════════════════════════════════════════════════════
  // CHECK 2 — Banned Body Phrases
  // ══════════════════════════════════════════════════════════════════════════
  {
    // Group by category for reporting
    const catHits = {};
    for (const { slug, body } of rows) {
      const plain = stripHtml(body).toLowerCase();
      for (const { phrase, cat } of BANNED_PHRASES) {
        if (plain.includes(phrase)) {
          if (!catHits[cat]) catHits[cat] = [];
          catHits[cat].push({ slug, phrase, ctx: excerpt(stripHtml(body), phrase) });
        }
      }
    }

    let total = 0;
    for (const hits of Object.values(catHits)) total += hits.length;
    section('BANNED PHRASES', total);

    for (const [cat, hits] of Object.entries(catHits)) {
      console.log(`\n  ${C.cyan}▸ ${cat.toUpperCase()}${C.reset}`);
      for (const h of hits) {
        violation(h.slug, `"${h.phrase}"`, h.ctx);
        if (SHOW_FIX_HINTS) {
          console.log(`  ${C.dim}  SQL: UPDATE posts SET body = REPLACE(body, '${h.phrase}', '???') WHERE slug = '${h.slug}';${C.reset}`);
        }
      }
    }

    totals['Banned Phrases'] = total;
    grandTotal += total;
  }

  // ══════════════════════════════════════════════════════════════════════════
  // CHECK 3 — Duplicate Sentences
  // ══════════════════════════════════════════════════════════════════════════
  {
    const hits = [];
    for (const { slug, body } of rows) {
      const paras = getParas(body);
      const seen  = new Map();
      for (let i = 0; i < paras.length; i++) {
        for (const s of getSentences(paras[i])) {
          const key = s.toLowerCase().replace(/\s+/g, ' ');
          if (seen.has(key)) {
            hits.push({ slug, sentence: s, firstPara: seen.get(key) + 1, dupePara: i + 1 });
          } else {
            seen.set(key, i);
          }
        }
      }
    }
    section('DUPLICATE SENTENCES', hits.length);
    hits.forEach(h =>
      violation(
        h.slug,
        `Duplicate sentence (first in ¶${h.firstPara}, repeated in ¶${h.dupePara})`,
        h.sentence.slice(0, 160)
      )
    );
    totals['Duplicate Sentences'] = hits.length;
    grandTotal += hits.length;
  }

  // ══════════════════════════════════════════════════════════════════════════
  // CHECK 4 — Duplicate Paragraphs
  // ══════════════════════════════════════════════════════════════════════════
  {
    const hits = [];
    for (const { slug, body } of rows) {
      const paras = getParas(body);
      const seen  = new Map();
      for (let i = 0; i < paras.length; i++) {
        const key = paras[i].toLowerCase().replace(/\s+/g, ' ');
        if (seen.has(key)) {
          hits.push({ slug, para: paras[i], firstIdx: seen.get(key) + 1, dupeIdx: i + 1 });
        } else {
          seen.set(key, i);
        }
      }
    }
    section('DUPLICATE PARAGRAPHS', hits.length);
    hits.forEach(h =>
      violation(
        h.slug,
        `Duplicate paragraph (first ¶${h.firstIdx}, repeated ¶${h.dupeIdx})`,
        h.para.slice(0, 160)
      )
    );
    totals['Duplicate Paragraphs'] = hits.length;
    grandTotal += hits.length;
  }

  // ══════════════════════════════════════════════════════════════════════════
  // CHECK 5 — Conceptual Looping (specific data-point repetition)
  //
  // Flags a token when ALL of these are true:
  //   • It is a specific number (3+ digits, not a 4-digit calendar year)
  //     OR a quoted phrase (4+ chars inside curly/straight quotes)
  //   • It appears in ¶1 (the intro)
  //   • It appears in the body (¶2 … ¶(n-2)), meaning it was detailed there
  //   • It reappears in the last two paragraphs (the outro)
  //   • It does NOT appear in more than 40% of all paragraphs
  //     (if it's that ubiquitous it's a topic word, not a looping signal)
  // ══════════════════════════════════════════════════════════════════════════
  {
    const hits = [];
    // Specific numbers: 3+ digit sequences, optional comma-thousands, optional %
    // Excludes 4-digit calendar years (1000–2099)
    const numRe  = /\b(?!(?:1[0-9]{3}|20[0-9]{2})\b)\d{3}[\d,]*\.?\d*%?\b/g;
    const quotRe = /[""][^""]{4,}[""]/g;

    for (const { slug, body } of rows) {
      const paras = getParas(body);
      if (paras.length < 5) continue;

      const introPara  = paras[0];
      const outroPara1 = paras[paras.length - 1];
      const outroPara2 = paras[paras.length - 2];
      const bodyParas  = paras.slice(1, -2);
      const bodyText   = bodyParas.join(' ');

      const introTokens = new Set([
        ...(introPara.match(numRe) || []),
        ...(introPara.match(quotRe) || []),
      ]);

      for (const token of introTokens) {
        // Must appear in body (i.e. was detailed there, not just in intro)
        if (!bodyText.includes(token)) continue;

        // Must reappear in outro
        if (!outroPara1.includes(token) && !outroPara2.includes(token)) continue;

        // Skip if too ubiquitous — appears in >40% of paragraphs
        const paraMatchCount = paras.filter(p => p.includes(token)).length;
        if (paraMatchCount > paras.length * 0.4) continue;

        hits.push({ slug, token, ctx: excerpt(outroPara1 + ' ' + outroPara2, token, 100) });
      }
    }
    section('CONCEPTUAL LOOPING (specific data-point in intro + body + outro)', hits.length);
    hits.forEach(h =>
      violation(
        h.slug,
        `"${h.token}" — introduced in ¶1, detailed in body, repeated in outro`,
        h.ctx
      )
    );
    totals['Conceptual Looping'] = hits.length;
    grandTotal += hits.length;
  }

  // ══════════════════════════════════════════════════════════════════════════
  // CHECK 6 — Zero Factoid Citations
  // ClownBinge standard: every article must have at least one cb-factoid
  // anchor. An article with no receipts violates the platform's core rule.
  // ══════════════════════════════════════════════════════════════════════════
  {
    const hits = [];
    for (const { slug, body } of rows) {
      const count = (body.match(/cb-factoid/g) || []).length;
      if (count === 0) hits.push({ slug });
    }
    section('ZERO FACTOID CITATIONS (no receipts)', hits.length);
    hits.forEach(h =>
      violation(h.slug, 'Article has no cb-factoid citation anchors — receipts required', '')
    );
    totals['Zero Factoid Citations'] = hits.length;
    grandTotal += hits.length;
  }

  // ══════════════════════════════════════════════════════════════════════════
  // CHECK 7 — Overlong Sentences (AI text walls)
  // Sentences over 55 words are a reliable AI generation signature.
  // Human journalists break long thoughts into shorter declarative units.
  // Source citations (bibliography paragraphs) are excluded.
  // ══════════════════════════════════════════════════════════════════════════
  {
    const hits = [];
    // Split on terminal punctuation followed by whitespace + capital letter
    const sentSplit = /(?<=[.!?])\s+(?=[A-Z"'])/;
    const sourceRe  = /^(Sources?:|References?:|Bibliography:|Works Cited)/i;

    for (const { slug, body } of rows) {
      const paras = getParas(body);
      const longOnes = [];

      for (const para of paras) {
        if (sourceRe.test(para.trim())) continue; // skip bibliography blobs
        const sentences = para.split(sentSplit).map(s => s.trim()).filter(Boolean);
        for (const s of sentences) {
          const wordCount = s.split(/\s+/).length;
          if (wordCount > 55) longOnes.push({ text: s, words: wordCount });
        }
      }

      if (longOnes.length > 0) {
        const worst = longOnes.sort((a, b) => b.words - a.words)[0];
        hits.push({ slug, count: longOnes.length, worst });
      }
    }

    section(`OVERLONG SENTENCES (>55 words — AI text wall)`, hits.length);
    hits.forEach(h =>
      violation(
        h.slug,
        `${h.count} sentence(s) over 55 words — worst is ${h.worst.words} words`,
        h.worst.text.slice(0, 160)
      )
    );
    totals['Overlong Sentences'] = hits.length;
    grandTotal += hits.length;
  }

  // ══════════════════════════════════════════════════════════════════════════
  // CHECK 8 — Citation Format (CB Standard)
  //
  // Every published article must have verified_source entries in the form:
  //   Label :: CB citation body
  // Separated by "; "
  //
  // Violations:
  //   a) verified_source is non-empty but contains no "::" at all
  //   b) Any individual entry is missing "::" (malformed / descriptive style)
  //   c) Any entry contains a URL (http) — Zero-URL Policy
  //
  // Exempt: satirical placeholder articles (CB-000001, CB-000002, CB-000003,
  //         CB-000005) which use institutional reference names only.
  // ══════════════════════════════════════════════════════════════════════════
  {
    const SATIRICAL_EXEMPT = new Set(['CB-000001', 'CB-000002', 'CB-000003', 'CB-000005']);
    const hits = [];

    for (const { slug, verified_source, case_number } of rows) {
      if (!verified_source || !verified_source.trim()) continue;
      if (SATIRICAL_EXEMPT.has(case_number)) continue;

      const vs = verified_source.trim();
      const entries = vs.split(/;\s+/);

      // (a) No :: anywhere in the entire field
      if (!vs.includes('::')) {
        hits.push({ slug, reason: 'verified_source has no :: separator — not in CB citation format', ctx: vs.slice(0, 120) });
        continue;
      }

      for (const entry of entries) {
        const e = entry.trim();
        if (!e) continue;

        // (b) Individual entry missing ::
        if (!e.includes('::')) {
          hits.push({ slug, reason: `Entry missing :: separator`, ctx: e.slice(0, 120) });
        }

        // (c) URL in citation (Zero-URL Policy)
        if (/https?:\/\//i.test(e)) {
          hits.push({ slug, reason: `URL found in citation — Zero-URL Policy violation`, ctx: e.slice(0, 120) });
        }
      }
    }

    section('CITATION FORMAT (CB Standard: Label :: Body, no URLs)', hits.length);
    hits.forEach(h => violation(h.slug, h.reason, h.ctx));
    totals['Citation Format'] = hits.length;
    grandTotal += hits.length;
  }

  // ══════════════════════════════════════════════════════════════════════════
  // SUMMARY
  // ══════════════════════════════════════════════════════════════════════════
  banner('SUMMARY');
  console.log();
  const colW = 38;
  for (const [check, count] of Object.entries(totals)) {
    const status = count === 0
      ? `${C.green}✓ CLEAN${C.reset}`
      : `${C.red}${C.bold}✗ ${count}${C.reset}`;
    console.log(`  ${check.padEnd(colW)} ${status}`);
  }
  console.log();

  if (grandTotal === 0) {
    console.log(`${C.green}${C.bold}  ALL CLEAR — ${rows.length} articles passed every check.${C.reset}\n`);
  } else {
    console.log(`${C.red}${C.bold}  ${grandTotal} total violation(s) across ${rows.length} articles.${C.reset}`);
    console.log(`${C.dim}  Run with --fix-hints to see SQL REPLACE stubs for each violation.${C.reset}\n`);
  }

  await client.end();
  process.exit(grandTotal === 0 ? 0 : 1);
}

main().catch(err => {
  console.error(`${C.bgRed}${C.bold} FATAL ${C.reset} ${err.message}`);
  process.exit(1);
});
