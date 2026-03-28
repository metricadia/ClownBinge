import { readFileSync, writeFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import {
  Document, Packer, Paragraph, TextRun,
  HeadingLevel, AlignmentType, PageBreak,
  convertInchesToTwip, BorderStyle,
} from 'docx';

const __dirname = dirname(fileURLToPath(import.meta.url));

// ── 1. Parse chapter data from Bookstore.tsx ────────────────────────────────
const src = readFileSync(
  join(__dirname, 'src/pages/Bookstore.tsx'),
  'utf8'
);

// Strip characters that are invalid in XML 1.0
function sanitizeXml(str) {
  return str.replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\uFFFE\uFFFF]/g, '');
}

function extractStringArray(block) {
  const result = [];
  const re = /"((?:[^"\\]|\\.)*)"/g;
  let m;
  while ((m = re.exec(block)) !== null) {
    const val = m[1]
      .replace(/\\"/g, '"')
      .replace(/\\n/g, '\n')
      .replace(/\\t/g, '\t')
      .replace(/\\\\/g, '\\');
    result.push(sanitizeXml(val));
  }
  return result;
}

function parseChapters() {
  const chapters = [];
  const chapterRe = /\{\s*(?:isPreface:[^,]+,\s*)?title:\s*"([^"]+)"[\s\S]*?content:\s*\[([\s\S]*?)\],\s*sources:\s*\[([\s\S]*?)\],\s*\}/g;
  let m;
  while ((m = chapterRe.exec(src)) !== null) {
    const title = m[1];
    const content = extractStringArray(m[2]);
    const sources = extractStringArray(m[3]);
    const isPreface = m[0].includes('isPreface: true') || m[0].includes('isPreface:true');
    chapters.push({ title, content, sources, isPreface });
  }
  return chapters;
}

const chapters = parseChapters();
console.log(`Parsed ${chapters.length} chapters (incl. preface)`);


// ── 3. Colour palette ────────────────────────────────────────────────────────
const GOLD       = 'C9A227';
const CHOCOLATE  = '6B3520';
const DARK_BG    = '0D0500';
const NEAR_BLACK = '1A1A1A';
const MID_GREY   = '5A5A5A';
const LIGHT_GREY = 'E8E3DC';
const WHITE      = 'FFFFFF';

// ── 4. Helper paragraph builders ────────────────────────────────────────────
const SECTION_RE = /^SECTION \d+\.\d+:/;
const QUOTE_RE   = /^[""\u201C]/;

function makePageBreak() {
  return new Paragraph({ children: [new PageBreak()] });
}

function makeCoverPage() {
  return [
    new Paragraph({ text: '', spacing: { before: convertInchesToTwip(3) } }),
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { before: 0, after: 200 },
      children: [
        new TextRun({ text: 'VOLUME 08', bold: true, size: 24, color: GOLD, font: 'Georgia', allCaps: true }),
      ],
    }),
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { before: 0, after: 160 },
      children: [
        new TextRun({ text: 'Ancient Faith, Modern Politics', bold: true, size: 52, color: NEAR_BLACK, font: 'Georgia' }),
      ],
    }),
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { before: 0, after: 400 },
      children: [
        new TextRun({ text: 'Judaism Is Not Zionism', size: 32, color: CHOCOLATE, font: 'Georgia', italics: true }),
      ],
    }),
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { before: 0, after: 0 },
      children: [
        new TextRun({ text: 'ClownBinge FactBook Series', size: 22, color: MID_GREY, font: 'Georgia' }),
      ],
    }),
    makePageBreak(),
  ];
}

function makeTitlePage() {
  return [
    new Paragraph({ text: '', spacing: { before: convertInchesToTwip(2) } }),
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { before: 0, after: 200 },
      children: [
        new TextRun({
          text: 'ANCIENT FAITH, MODERN POLITICS',
          bold: true,
          size: 36,
          color: NEAR_BLACK,
          font: 'Georgia',
        }),
      ],
    }),
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { before: 0, after: 120 },
      children: [
        new TextRun({
          text: 'Judaism Is Not Zionism',
          italics: true,
          size: 28,
          color: CHOCOLATE,
          font: 'Georgia',
        }),
      ],
    }),
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { before: 200, after: 100 },
      children: [
        new TextRun({
          text: 'FactBook™ Series · Vol. 08',
          size: 20,
          color: MID_GREY,
          font: 'Georgia',
        }),
      ],
    }),
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { before: 0, after: 600 },
      children: [
        new TextRun({
          text: 'Primary Source Analytics, LLC · ClownBinge.com',
          size: 18,
          color: MID_GREY,
          font: 'Georgia',
        }),
      ],
    }),
    new Paragraph({
      border: {
        top: { style: BorderStyle.SINGLE, size: 6, color: CHOCOLATE, space: 10 },
      },
      spacing: { before: convertInchesToTwip(2), after: 200 },
      alignment: AlignmentType.CENTER,
      children: [
        new TextRun({
          text: '"The receipts do not have a political agenda. They have dates."',
          italics: true,
          size: 22,
          color: CHOCOLATE,
          font: 'Georgia',
        }),
      ],
    }),
    makePageBreak(),
  ];
}

function makeCopyrightPage() {
  const lines = [
    'Ancient Faith, Modern Politics: Judaism Is Not Zionism',
    'FactBook™ Series, Volume 8',
    '',
    'Published by Primary Source Analytics, LLC',
    'ClownBinge.com',
    '',
    'Digital Edition · 2026',
    '',
    'All primary sources cited in this volume are publicly accessible.',
    'Every URL, docket number, resolution number, vote tally, and statutory',
    'citation has been verified against the original institutional record.',
    'APA 7 citations throughout.',
    '',
    'Price: $39.95 · Digital PDF / DOCX · Instant Delivery',
    '',
    '© 2026 Primary Source Analytics, LLC. All rights reserved.',
  ];
  const paras = lines.map(line =>
    new Paragraph({
      alignment: line === '' ? AlignmentType.LEFT : AlignmentType.LEFT,
      spacing: { before: line === '' ? 100 : 0, after: 0 },
      children: [
        new TextRun({
          text: line,
          size: line.startsWith('Ancient') ? 24 : 18,
          bold: line.startsWith('Ancient'),
          color: NEAR_BLACK,
          font: 'Georgia',
        }),
      ],
    })
  );
  return [...paras, makePageBreak()];
}

function makeChapterTitle(ch, index) {
  const label = ch.isPreface ? 'PREFACE' : `CHAPTER ${index}`;
  return [
    new Paragraph({
      spacing: { before: 0, after: 80 },
      children: [
        new TextRun({
          text: label,
          bold: true,
          size: 20,
          color: GOLD,
          font: 'Georgia',
          allCaps: true,
          characterSpacing: 160,
        }),
      ],
    }),
    new Paragraph({
      heading: HeadingLevel.HEADING_1,
      spacing: { before: 0, after: 200 },
      children: [
        new TextRun({
          text: ch.title,
          bold: true,
          size: 36,
          color: NEAR_BLACK,
          font: 'Georgia',
        }),
      ],
    }),
  ];
}

function makeSectionHeader(text) {
  return new Paragraph({
    heading: HeadingLevel.HEADING_2,
    spacing: { before: 400, after: 160 },
    border: {
      bottom: { style: BorderStyle.SINGLE, size: 4, color: CHOCOLATE, space: 4 },
    },
    children: [
      new TextRun({
        text: text,
        bold: true,
        size: 22,
        color: CHOCOLATE,
        font: 'Georgia',
        allCaps: true,
        characterSpacing: 60,
      }),
    ],
  });
}

function makeBlockQuote(text) {
  return new Paragraph({
    indent: { left: convertInchesToTwip(0.4), right: convertInchesToTwip(0.4) },
    spacing: { before: 160, after: 160 },
    border: {
      left: { style: BorderStyle.THICK, size: 12, color: GOLD, space: 12 },
    },
    children: [
      new TextRun({
        text: text,
        italics: true,
        size: 20,
        color: NEAR_BLACK,
        font: 'Georgia',
      }),
    ],
  });
}

function makeBodyParagraph(text) {
  return new Paragraph({
    spacing: { before: 0, after: 200 },
    indent: { firstLine: convertInchesToTwip(0.25) },
    children: [
      new TextRun({
        text: text,
        size: 22,
        color: NEAR_BLACK,
        font: 'Georgia',
      }),
    ],
  });
}

function makeCitationsHeader() {
  return [
    new Paragraph({
      spacing: { before: 560, after: 0 },
      border: {
        top: { style: BorderStyle.SINGLE, size: 4, color: LIGHT_GREY, space: 8 },
      },
      children: [],
    }),
    new Paragraph({
      heading: HeadingLevel.HEADING_3,
      spacing: { before: 0, after: 160 },
      children: [
        new TextRun({
          text: 'APA 7 Primary Sources',
          bold: true,
          size: 20,
          color: CHOCOLATE,
          font: 'Georgia',
          allCaps: true,
          characterSpacing: 80,
        }),
      ],
    }),
  ];
}

function makeCitation(text) {
  return new Paragraph({
    spacing: { before: 0, after: 120 },
    indent: {
      left: convertInchesToTwip(0.5),
      hanging: convertInchesToTwip(0.5),
    },
    children: [
      new TextRun({
        text: text,
        size: 18,
        color: MID_GREY,
        font: 'Georgia',
      }),
    ],
  });
}

// ── 5. Assemble document ─────────────────────────────────────────────────────
const allChildren = [
  ...makeCoverPage(),
  ...makeTitlePage(),
  ...makeCopyrightPage(),
];

// Table of contents page
allChildren.push(
  new Paragraph({
    spacing: { before: 0, after: 400 },
    children: [
      new TextRun({
        text: 'CONTENTS',
        bold: true,
        size: 30,
        color: NEAR_BLACK,
        font: 'Georgia',
        allCaps: true,
        characterSpacing: 200,
      }),
    ],
  })
);

chapters.forEach((ch, i) => {
  const label = ch.isPreface ? 'Preface' : `Chapter ${i}`;
  allChildren.push(
    new Paragraph({
      spacing: { before: 80, after: 0 },
      children: [
        new TextRun({
          text: `${label}  `,
          size: 20,
          color: MID_GREY,
          font: 'Georgia',
        }),
        new TextRun({
          text: ch.title,
          size: 20,
          color: NEAR_BLACK,
          font: 'Georgia',
        }),
      ],
    })
  );
});
allChildren.push(makePageBreak());

// Chapter pages
let chapterNum = 0;
chapters.forEach((ch, idx) => {
  if (!ch.isPreface) chapterNum++;
  const num = ch.isPreface ? idx : chapterNum;

  allChildren.push(...makeChapterTitle(ch, num));

  ch.content.forEach(para => {
    if (SECTION_RE.test(para)) {
      allChildren.push(makeSectionHeader(para));
    } else if (QUOTE_RE.test(para)) {
      allChildren.push(makeBlockQuote(para));
    } else {
      allChildren.push(makeBodyParagraph(para));
    }
  });

  if (ch.sources && ch.sources.length > 0) {
    allChildren.push(...makeCitationsHeader());
    ch.sources.forEach(src => allChildren.push(makeCitation(src)));
  }

  allChildren.push(makePageBreak());
});

// ── 6. Build and write document ──────────────────────────────────────────────
const doc = new Document({
  styles: {
    default: {
      document: {
        run: { font: 'Georgia', size: 22, color: NEAR_BLACK },
        paragraph: { spacing: { line: 276 } },
      },
    },
    paragraphStyles: [
      {
        id: 'Heading1',
        name: 'Heading 1',
        basedOn: 'Normal',
        next: 'Normal',
        run: { bold: true, size: 36, color: NEAR_BLACK, font: 'Georgia' },
        paragraph: { spacing: { before: 0, after: 200 } },
      },
      {
        id: 'Heading2',
        name: 'Heading 2',
        basedOn: 'Normal',
        next: 'Normal',
        run: { bold: true, size: 22, color: CHOCOLATE, font: 'Georgia' },
        paragraph: { spacing: { before: 400, after: 160 } },
      },
      {
        id: 'Heading3',
        name: 'Heading 3',
        basedOn: 'Normal',
        next: 'Normal',
        run: { bold: true, size: 20, color: CHOCOLATE, font: 'Georgia' },
        paragraph: { spacing: { before: 0, after: 160 } },
      },
    ],
  },
  sections: [
    {
      properties: {
        page: {
          margin: {
            top:    convertInchesToTwip(1.0),
            bottom: convertInchesToTwip(1.0),
            left:   convertInchesToTwip(1.25),
            right:  convertInchesToTwip(1.25),
          },
        },
      },
      children: allChildren,
    },
  ],
});

const buffer = await Packer.toBuffer(doc);
const outPath = join(__dirname, 'public/Vol08-AncientFaith-ModernPolitics.docx');
writeFileSync(outPath, buffer);
console.log(`\n✓ Written: ${outPath}`);
console.log(`  Size: ${(buffer.length / 1024).toFixed(1)} KB`);
