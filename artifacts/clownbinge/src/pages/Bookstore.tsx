import { useState } from "react";
import { Layout } from "@/components/Layout";
import { usePageSeoHead } from "@/hooks/use-seo-head";
import { BookOpen, ArrowRight, CheckCircle, Download, Package, Layers, X } from "lucide-react";

interface FactBook {
  id: number;
  vol: string;
  shortTitle: string;
  fullTitle: string;
  tag: string;
  bg: string;
  fg: string;
  accent: string;
  accentFg: string;
  coverDesign: "stat" | "grid" | "split" | "bar" | "slash" | "arch" | "type" | "minimal" | "overlap" | "circle";
  subtitle?: string;
  coverImage?: string;
  summary: string;
  bullets: string[];
}

const BOOKS: FactBook[] = [
  {
    id: 1, vol: "Vol. 01",
    shortTitle: "The Manufactured Threat",
    fullTitle: "The Manufactured Threat: How America Criminalized Blackness With Fabricated Data",
    tag: "NerdOut / Data",
    bg: "#0F0F0F", fg: "#FFFFFF", accent: "#FF0099", accentFg: "#FFFFFF",
    coverDesign: "stat",
    summary: "The narrative that Black Americans are inherently more violent is one of the most durable lies in American public life — repeated by politicians, amplified by media, and almost never challenged with actual data. This FactBook goes straight to the source: FBI crime statistics, peer-reviewed criminology, and federal data that dismantles the myth completely and traces its deliberate political origins.",
    bullets: [
      "FBI UCR and BJS data show violent crime tracks poverty and disinvestment — not race",
      "Peer-reviewed criminology finds race disappears as a variable when income is controlled",
      "The CDC links 'race and crime' framing to deliberate policy narratives dating to the 1960s",
      "97% of Black homicide victimization is driven by economic circumstance, per DOJ data",
      "The myth serves documented political purposes — this FactBook names them, with receipts",
    ],
  },
  {
    id: 2, vol: "Vol. 02",
    shortTitle: "Merchants of Chaos",
    fullTitle: "Merchants of Chaos: Facebook, X, YouTube & TikTok as the World's Largest Disinformation Infrastructure",
    tag: "Investigations",
    bg: "#1A3A8F", fg: "#FFFFFF", accent: "#F5C518", accentFg: "#1A1A2E",
    coverDesign: "grid",
    summary: "Congress has the documents. Senate intelligence committees have done the investigations. Internal communications have been leaked. Facebook, YouTube, X, and TikTok have been caught — not accused — of algorithmically amplifying disinformation for engagement revenue. This FactBook assembles the receipts from congressional testimony, whistleblower documents, and regulatory filings.",
    bullets: [
      "Facebook's own internal research showed the algorithm amplified outrage content by 5x",
      "Senate Intelligence Committee reports document coordinated inauthentic behavior tolerated for profit",
      "YouTube's recommendation engine drove radicalization at scale — per their own engineers",
      "TikTok congressional testimony revealed state-level data access they denied existed",
      "Every claim traces to congressional records, SEC filings, or published whistleblower testimony",
    ],
  },
  {
    id: 3, vol: "Vol. 03",
    shortTitle: "A Well-Regulated Exclusion",
    fullTitle: "A Well-Regulated Exclusion: The Second Amendment's Race Problem on the Constitutional Record",
    tag: "U.S. Constitution",
    bg: "#F8F9FC", fg: "#1A1A2E", accent: "#1A3A8F", accentFg: "#FFFFFF",
    coverDesign: "split",
    summary: "The Second Amendment was debated, drafted, and ratified when 'the people' had a specific racial definition — and state militia laws at the time made that explicit. This FactBook doesn't argue gun policy. It reads the constitutional record, the Founders' own words, and the Supreme Court's historical analysis to surface what was actually being protected and who was being excluded.",
    bullets: [
      "Founders' militia writings explicitly tied gun rights to slave patrol and anti-insurrection control",
      "State constitutional records from 1789 reveal racial exclusions baked into 'the people'",
      "Dred Scott explicitly denied Black Americans 2nd Amendment rights — in the Court's own words",
      "Reconstruction-era gun seizures targeting Black communities are documented in congressional testimony",
      "Heller and Bruen's 'historical tradition' argument collapses when applied to non-white Americans",
    ],
  },
  {
    id: 4, vol: "Vol. 04",
    shortTitle: "The Great Grift",
    fullTitle: "The Great Grift: The Attack on DEI Was a Ruse — Obama vs. Trump Appointees, Side by Side",
    tag: "Primary Source Analytics",
    bg: "#0D3320", fg: "#FFFFFF", accent: "#00D084", accentFg: "#0D3320",
    coverDesign: "bar",
    summary: "When the Trump administration dismantled DEI programs, it framed the move as restoring merit. This FactBook compares the actual credentials — education, professional background, prior experience — of Obama-era versus Trump-era appointees across 40 agency positions, using Senate confirmation records, federal disclosures, and official biographies. The data tells a specific story.",
    bullets: [
      "Side-by-side credential comparisons of 40 agency appointments across both administrations",
      "Obama appointees averaged significantly more relevant professional experience per position",
      "Several Trump appointees had zero prior experience in the agencies they were appointed to lead",
      "Senate confirmation transcripts reveal credential gaps that went largely unchallenged",
      "The data shows DEI opponents installed the least credentialed appointee class in modern history",
    ],
  },
  {
    id: 5, vol: "Vol. 05",
    shortTitle: "All Propaganda, All the Time",
    fullTitle: "All Propaganda, All the Time: CNN, MSNBC, and Fox News — What the Documents Confirm",
    tag: "Media / Investigations",
    bg: "#1A1A2E", fg: "#FFFFFF", accent: "#F5C518", accentFg: "#1A1A2E",
    coverDesign: "slash",
    summary: "It is no longer a matter of opinion that American cable news operates as political infrastructure. Their own internal documents, regulatory filings, and court-disclosed communications make the case. This FactBook doesn't pick a side — it applies the same evidentiary standard to CNN, MSNBC, and Fox News and lets the documents speak for themselves.",
    bullets: [
      "Fox News internal texts show hosts knew the 2020 election claims were false while broadcasting them",
      "CNN's leaked 2021 editorial strategy documents show narrative shaping over news gathering",
      "MSNBC parent NBCUniversal's FEC filings reveal systematic partisan donation patterns",
      "Dominion v. Fox depositions are the most damning primary-source document in cable news history",
      "All three networks have settled or faced regulatory findings — this book catalogs every one",
    ],
  },
  {
    id: 6, vol: "Vol. 06",
    shortTitle: "Stolen Maps",
    fullTitle: "Stolen Maps: The Documented Legality of Gerrymandering and Who It Was Designed to Silence",
    tag: "Law & Justice",
    bg: "#2A0A4A", fg: "#FFFFFF", accent: "#C084FC", accentFg: "#1A0A2E",
    coverDesign: "arch",
    summary: "Gerrymandering has been declared constitutional by the Supreme Court — meaning politicians can now legally choose their voters. This FactBook documents how that legal framework was constructed, who built it, and what the district maps actually look like when overlaid with Census Bureau demographic data. The system is working exactly as designed.",
    bullets: [
      "Rucho v. Common Cause (2019) explicitly legalized partisan gerrymandering at the federal level",
      "Census Bureau overlays show Black and Latino communities are most consistently packed or cracked",
      "State redistricting documents reveal explicit partisan intent behind ostensibly neutral criteria",
      "The same 3 redistricting law firms shaped maps across 12 states — documented by name",
      "Voting Rights Act Section 2 cases catalog the legal challenge record, ruling by ruling",
    ],
  },
  {
    id: 7, vol: "Vol. 07",
    shortTitle: "The Uncredited Builders",
    fullTitle: "The Uncredited Builders: Indigenous Nations, Enslaved Africans, and Immigrants Who Made America",
    tag: "U.S. History",
    bg: "#F5F0E8", fg: "#1A1A2E", accent: "#1A3A8F", accentFg: "#FFFFFF",
    coverDesign: "type",
    summary: "The wealth, infrastructure, and institutional foundation of the United States was created through systematic extraction of labor and land from three groups who received none of the ownership: Indigenous nations, enslaved Africans, and immigrant workers. This FactBook uses property records, census data, congressional land grants, and economic scholarship to quantify what was taken.",
    bullets: [
      "Federal land grant records document 270 million acres taken from Indigenous sovereignty",
      "Enslaved labor's economic contribution has been estimated at $14 trillion in 2023 dollars",
      "Chinese, Irish, and Eastern European workers built the transcontinental railroad under contract fraud",
      "Congressional records show these groups were systematically excluded from New Deal wealth programs",
      "Property deed research traces redlining's direct lineage from slaveholder land concentration",
    ],
  },
  {
    id: 8, vol: "Vol. 08",
    shortTitle: "Ancient Faith, Modern Politics",
    fullTitle: "Ancient Faith, Modern Politics: The Documented Separation of Judaism and Zionism",
    tag: "Global South / History",
    bg: "#003366", fg: "#FFFFFF", accent: "#38BDF8", accentFg: "#003366",
    coverDesign: "minimal",
    subtitle: "Judaism ≠ Zionism",
    coverImage: "/covers/vol08-cover.png",
    summary: "Judaism is a 3,500-year-old religious and cultural tradition. Zionism is a 19th-century political movement founded in Vienna in 1897. They share some overlapping adherents and some contested historical claims — but they are not the same thing. This FactBook traces each to its founding documents and lets the historical record speak without editorializing.",
    bullets: [
      "Theodor Herzl's founding documents describe Zionism explicitly as a political, not religious, project",
      "Anti-Zionist Jewish movements have existed continuously since 1897, documented in their own records",
      "UN Resolution 3379 and its reversal represent a documented political — not theological — debate",
      "Palestinian pre-1948 land records and British Mandate censuses document the demographic reality",
      "The conflation of antisemitism and anti-Zionism is itself a documented political strategy",
    ],
  },
  {
    id: 9, vol: "Vol. 09",
    shortTitle: "What Herodotus Saw",
    fullTitle: "What Herodotus Saw: The Primary Source Record of Kemet as Black African Civilization",
    tag: "Global South / Archaeology",
    bg: "#2D1800", fg: "#FFFFFF", accent: "#F5C518", accentFg: "#2D1800",
    coverDesign: "overlap",
    summary: "Herodotus — the Greek historian — wrote that the Egyptians were 'dark-skinned and woolly-haired.' He wrote this in the 5th century BCE, 2,500 years before it became politically convenient to deny. This FactBook assembles the archaeological, genetic, and written record that existed long before the politics — and has never actually been refuted.",
    bullets: [
      "Herodotus's original Greek texts describing Egyptian appearance have been in the record since 450 BCE",
      "DNA studies of pre-dynastic remains (Nature, 2017) show genetic proximity to sub-Saharan populations",
      "Ancient Egyptian art — much of it in color — depicts skin tones across the full range of African peoples",
      "Hieroglyphic records include pharaohs' explicit self-identification with African neighbors and kin",
      "The 'Egypt was not Black' argument emerged in 19th-century European colonial historiography, documented",
    ],
  },
  {
    id: 10, vol: "Vol. 10",
    shortTitle: "The Debt Clock",
    fullTitle: "The Debt Clock: $2.8 Billion Per Day and the Votes That Got Us Here",
    tag: "Money & Power",
    bg: "#082010", fg: "#FFFFFF", accent: "#00D084", accentFg: "#082010",
    coverDesign: "circle",
    summary: "The United States currently pays $2.8 billion every single day in interest on the national debt — more than the entire discretionary budget of most federal agencies, and more than it spends on education per day. This FactBook uses Treasury Department data, CBO projections, and Federal Reserve reports to trace exactly how this happened, who benefits, and what it forecloses.",
    bullets: [
      "Treasury data confirms daily interest payments now exceed the daily cost of Medicaid",
      "Top holders of U.S. debt include American pension funds, foreign governments, and the Fed itself",
      "CBO projections show interest payments becoming the single largest federal expense by 2030",
      "Reagan-era tax cuts and Bush-era wars are the two largest documented contributors to current debt",
      "The $2.8 billion figure is not partisan — it comes directly from the U.S. Department of the Treasury",
    ],
  },
];

function CoverSVG({ book }: { book: FactBook }) {
  const { bg, fg, accent, accentFg, coverDesign, vol, shortTitle } = book;
  const words = shortTitle.split(" ");
  const mid = Math.ceil(words.length / 2);
  const line1 = words.slice(0, mid).join(" ");
  const line2 = words.slice(mid).join(" ");

  if (book.coverImage) {
    return (
      <svg viewBox="0 0 240 360" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
        <defs>
          <clipPath id={`photo-clip-${book.id}`}>
            <rect x="14" y="42" width="212" height="172" />
          </clipPath>
        </defs>
        {/* Solid bg — same as other covers */}
        <rect width="240" height="360" fill={bg} />
        {/* Top accent stripe */}
        <rect x="0" y="0" width="240" height="4" fill={accent} />
        {/* VOL label */}
        <text x="20" y="32" fontSize="8" fill={fg} fontFamily="'JetBrains Mono',monospace" opacity="0.55" letterSpacing="2">
          {vol.toUpperCase()} · CLOWNBINGE FACTBOOK™
        </text>
        {/* Photo panel — contained, not full-bleed */}
        <image href={book.coverImage} x="14" y="42" width="212" height="172"
          preserveAspectRatio="xMidYMid slice" clipPath={`url(#photo-clip-${book.id})`} />
        {/* Thin accent border around photo */}
        <rect x="14" y="42" width="212" height="172" fill="none" stroke={accent} strokeWidth="1.5" opacity="0.6" />
        {/* Title block on solid bg */}
        <text x="20" y="244" fontSize="21" fill={fg} fontFamily="'Libre Franklin',sans-serif" fontWeight="700" letterSpacing="-0.2">{line1}</text>
        <text x="20" y="270" fontSize="21" fill={fg} fontFamily="'Libre Franklin',sans-serif" fontWeight="700" letterSpacing="-0.2">{line2}</text>
        {book.subtitle && (
          <text x="20" y="294" fontSize="12" fill="#F5C518" fontFamily="'Libre Franklin',sans-serif" fontWeight="700" letterSpacing="0.5">{book.subtitle}</text>
        )}
        {/* Footer bar */}
        <rect x="0" y="326" width="240" height="34" fill={accent} />
        <text x="20" y="347" fontSize="8.5" fill={accentFg} fontFamily="'JetBrains Mono',monospace" letterSpacing="1.5" fontWeight="700">
          PRIMARY SOURCE ANALYTICS
        </text>
        <text x="220" y="347" fontSize="9" fill={accentFg} fontFamily="'Archivo Black',sans-serif" textAnchor="end" fontWeight="900">
          $24.95
        </text>
      </svg>
    );
  }

  return (
    <svg viewBox="0 0 240 360" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
      <rect width="240" height="360" fill={bg} />

      {coverDesign === "stat" && (
        <>
          <rect x="0" y="0" width="240" height="4" fill={accent} />
          <text x="20" y="100" fontSize="72" fill={accent} fontFamily="'Archivo Black',sans-serif" opacity="0.12" fontWeight="900">%</text>
          <text x="20" y="160" fontSize="64" fill={accent} fontFamily="'Archivo Black',sans-serif" opacity="0.15" fontWeight="900">DATA</text>
        </>
      )}
      {coverDesign === "grid" && (
        <>
          {Array.from({ length: 7 }).map((_, col) =>
            Array.from({ length: 11 }).map((_, row) => (
              <rect key={`${col}-${row}`} x={col * 35 + 5} y={row * 35 + 5} width="28" height="28"
                fill="none" stroke={accent} strokeWidth="0.5"
                opacity={(col + row) % 3 === 0 ? "0.25" : "0.08"} />
            ))
          )}
        </>
      )}
      {coverDesign === "split" && (
        <>
          <rect x="0" y="0" width="240" height="180" fill={accent} />
          <rect x="0" y="180" width="240" height="180" fill={bg} />
        </>
      )}
      {coverDesign === "bar" && (
        <>
          {[110, 160, 85, 140, 95, 175, 120, 65].map((h, i) => (
            <rect key={i} x={i * 30 + 5} y={310 - h} width="22" height={h}
              fill={accent} opacity={i === 5 ? "0.9" : "0.2"} rx="2" />
          ))}
        </>
      )}
      {coverDesign === "slash" && (
        <>
          <line x1="-20" y1="120" x2="260" y2="20" stroke={accent} strokeWidth="40" opacity="0.12" />
          <line x1="-20" y1="200" x2="260" y2="100" stroke={accent} strokeWidth="40" opacity="0.09" />
          <line x1="-20" y1="290" x2="260" y2="190" stroke={accent} strokeWidth="40" opacity="0.06" />
        </>
      )}
      {coverDesign === "arch" && (
        <>
          <ellipse cx="120" cy="360" rx="160" ry="120" fill="none" stroke={accent} strokeWidth="1" opacity="0.3" />
          <ellipse cx="120" cy="360" rx="120" ry="90" fill="none" stroke={accent} strokeWidth="1" opacity="0.2" />
          <ellipse cx="120" cy="360" rx="80" ry="60" fill="none" stroke={accent} strokeWidth="1" opacity="0.15" />
        </>
      )}
      {coverDesign === "type" && (
        <>
          <text x="-5" y="180" fontSize="140" fill={accent} fontFamily="'Archivo Black',sans-serif" opacity="0.06" fontWeight="900">WHO</text>
          <text x="-5" y="290" fontSize="140" fill={accent} fontFamily="'Archivo Black',sans-serif" opacity="0.06" fontWeight="900">BUILT</text>
        </>
      )}
      {coverDesign === "minimal" && (
        <>
          <line x1="20" y1="180" x2="220" y2="180" stroke={accent} strokeWidth="1" opacity="0.4" />
          <circle cx="120" cy="120" r="60" fill="none" stroke={accent} strokeWidth="0.8" opacity="0.25" />
          <circle cx="120" cy="120" r="40" fill="none" stroke={accent} strokeWidth="0.5" opacity="0.15" />
        </>
      )}
      {coverDesign === "overlap" && (
        <>
          <rect x="40" y="40" width="160" height="160" fill={accent} opacity="0.12" rx="2" />
          <rect x="20" y="60" width="160" height="160" fill={accent} opacity="0.08" rx="2" />
          <rect x="60" y="20" width="160" height="160" fill={accent} opacity="0.06" rx="2" />
        </>
      )}
      {coverDesign === "circle" && (
        <>
          <circle cx="120" cy="150" r="130" fill={accent} opacity="0.08" />
          <circle cx="120" cy="150" r="95" fill={accent} opacity="0.07" />
          <circle cx="120" cy="150" r="60" fill={accent} opacity="0.1" />
          <circle cx="120" cy="150" r="30" fill={accent} opacity="0.15" />
        </>
      )}

      <text x="20" y="32" fontSize="8" fill={fg} fontFamily="'JetBrains Mono',monospace" opacity="0.45" letterSpacing="2">
        {vol.toUpperCase()} · CLOWNBINGE FACTBOOK™
      </text>

      {coverDesign === "split" ? (
        <>
          <text x="20" y="90" fontSize="20" fill={accentFg} fontFamily="'Libre Franklin',sans-serif" fontWeight="700" letterSpacing="-0.2">{line1}</text>
          <text x="20" y="114" fontSize="20" fill={accentFg} fontFamily="'Libre Franklin',sans-serif" fontWeight="700" letterSpacing="-0.2">{line2}</text>
          <text x="20" y="210" fontSize="17" fill={fg} fontFamily="'Libre Franklin',sans-serif" fontWeight="600" opacity="0.85">{book.tag}</text>
        </>
      ) : (
        <>
          <text x="20" y="200" fontSize="21" fill={fg} fontFamily="'Libre Franklin',sans-serif" fontWeight="700" letterSpacing="-0.2">{line1}</text>
          <text x="20" y="226" fontSize="21" fill={fg} fontFamily="'Libre Franklin',sans-serif" fontWeight="700" letterSpacing="-0.2">{line2}</text>
          {book.subtitle && (
            <text x="20" y="254" fontSize="13" fill="#B8860B" fontFamily="'Libre Franklin',sans-serif" fontWeight="700" letterSpacing="0.3">{book.subtitle}</text>
          )}
        </>
      )}

      <rect x="0" y="326" width="240" height="34" fill={accent} />
      <text x="20" y="347" fontSize="8.5" fill={accentFg} fontFamily="'JetBrains Mono',monospace" letterSpacing="1.5" fontWeight="700">
        PRIMARY SOURCE ANALYTICS
      </text>
      <text x="220" y="347" fontSize="9" fill={accentFg} fontFamily="'Archivo Black',sans-serif" textAnchor="end" fontWeight="900">
        $24.95
      </text>
    </svg>
  );
}

function BookModal({ book, onClose }: { book: FactBook; onClose: () => void }) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: "rgba(0,0,0,0.72)", backdropFilter: "blur(4px)" }}
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-xl rounded-xl overflow-hidden shadow-2xl"
        style={{ background: "#ffffff" }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header strip using book accent color */}
        <div className="flex gap-4 p-4" style={{ background: book.bg }}>
          <div className="w-16 shrink-0 rounded overflow-hidden shadow-md" style={{ aspectRatio: "2/3" }}>
            <CoverSVG book={book} />
          </div>
          <div className="flex flex-col justify-between min-w-0">
            <div>
              <p className="font-mono text-[10px] font-bold tracking-[0.18em] uppercase mb-1" style={{ color: book.accent }}>
                {book.vol} · {book.tag}
              </p>
              <h2 className="font-sans font-extrabold text-base leading-snug" style={{ color: book.fg }}>
                {book.shortTitle}
              </h2>
              {book.subtitle && (
                <p className="font-sans font-bold text-xs mt-0.5" style={{ color: "#B8860B" }}>
                  {book.subtitle}
                </p>
              )}
            </div>
            <div className="flex items-center gap-2.5 mt-3">
              <span className="font-extrabold text-lg" style={{ color: book.fg }}>$24.95</span>
              <button
                className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full font-extrabold text-xs transition-opacity hover:opacity-85"
                style={{ background: book.accent, color: book.accentFg }}
              >
                Pre-Order
                <ArrowRight className="w-3 h-3" />
              </button>
            </div>
          </div>
          <button
            onClick={onClose}
            className="absolute top-3 right-3 w-7 h-7 rounded-full flex items-center justify-center transition-opacity hover:opacity-70"
            style={{ background: "rgba(255,255,255,0.15)" }}
            aria-label="Close"
          >
            <X className="w-3.5 h-3.5" style={{ color: book.fg }} />
          </button>
        </div>

        {/* Body */}
        <div className="px-5 py-4">
          <p className="text-sm text-gray-700 leading-relaxed mb-4">
            {book.summary}
          </p>

          <div className="border-t border-gray-100 pt-3">
            <p className="font-mono text-[10px] font-bold tracking-[0.18em] uppercase text-gray-400 mb-3">
              Why This Book Matters
            </p>
            <ul className="space-y-2">
              {book.bullets.map((bullet, i) => (
                <li key={i} className="flex gap-2.5 text-xs text-gray-700 leading-relaxed">
                  <span
                    className="mt-0.5 w-4 h-4 rounded-full flex items-center justify-center shrink-0 font-bold text-[10px]"
                    style={{ background: book.accent + "22", color: book.accent }}
                  >
                    {i + 1}
                  </span>
                  {bullet}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Bookstore() {
  usePageSeoHead({
    title: "Our Books — Knowledge Is Power | ClownBinge FactBook™",
    description: "The ClownBinge FactBook™ series. Primary Source Analytics on the topics that define our era. Evergreen. Documented. Sourced.",
    path: "/bookstore",
    schemaType: "ItemPage",
  });

  const [selectedBook, setSelectedBook] = useState<FactBook | null>(null);

  return (
    <Layout>

      {selectedBook && (
        <BookModal book={selectedBook} onClose={() => setSelectedBook(null)} />
      )}

      {/* ── Two-column hero ── */}
      <div className="w-full" style={{ background: "linear-gradient(135deg, #071a0e 0%, #0e3020 55%, #0a2818 100%)" }}>
        <div className="max-w-6xl mx-auto px-6 pt-5 pb-14 grid lg:grid-cols-2 gap-12 items-start">
          <div className="lg:col-span-2 mb-2">
            <h2 className="font-mono text-xs font-bold tracking-[0.2em] uppercase" style={{ color: "rgba(255,255,255,0.35)" }}>
              Our Books / FactBook™ Series
            </h2>
          </div>

          {/* LEFT — brand statement */}
          <div>
            <div
              className="inline-flex items-center gap-2 rounded-full px-4 py-1.5 mb-8 text-xs font-bold tracking-widest uppercase"
              style={{ background: "#F5C518", color: "#1A3A8F" }}
            >
              <BookOpen className="w-3 h-3" />
              Primary Source Analytics
            </div>

            <h1 className="font-sans font-extrabold text-4xl sm:text-5xl text-white leading-tight mb-6">
              FactBooks:<br />
              <span style={{ color: "#F5C518" }}>Deeper Dives Into Our Most Important Stories.</span>
            </h1>

            <p className="text-white/75 text-lg leading-relaxed mb-4">
              Ten deep-dive research volumes on the topics that define our era. Built entirely
              from court records, federal data, congressional transcripts, and archaeological
              evidence. No opinion. No narrative. The primary source, documented.
            </p>

            <p className="text-white/75 text-lg leading-relaxed mb-8">
              These are not books written about history. They are the history — sourced, cited,
              and organized so the argument ends where the evidence begins.
            </p>

            <div className="grid grid-cols-3 gap-6 border-t pt-8" style={{ borderColor: "rgba(255,255,255,0.15)" }}>
              <div>
                <div className="font-extrabold text-lg text-white mb-1">Primary Source.</div>
                <p className="text-white/50 text-xs leading-relaxed">Every claim traces to the original document — court filings, census records, peer-reviewed research.</p>
              </div>
              <div>
                <div className="font-extrabold text-lg mb-1" style={{ color: "#F5C518" }}>Evergreen.</div>
                <p className="text-white/50 text-xs leading-relaxed">These topics will not age out. This is the record that exists whether the news cycle covers it or not.</p>
              </div>
              <div>
                <div className="font-extrabold text-lg text-white mb-1">Documented.</div>
                <p className="text-white/50 text-xs leading-relaxed">APA 7 citations throughout. Every URL. Every docket number. Every source verifiable by anyone.</p>
              </div>
            </div>
          </div>

          {/* RIGHT — action cards */}
          <div className="flex flex-col gap-4">

            {/* CARD 1 — Individual volume */}
            <div className="rounded-2xl overflow-hidden" style={{ border: "2px solid #F5C518" }}>
              <div className="p-6" style={{ background: "linear-gradient(135deg, #0a1a4a 0%, #1A3A8F 100%)" }}>
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <div className="text-xs font-bold tracking-widest uppercase mb-1" style={{ color: "#F5C518" }}>
                      Individual Volume
                    </div>
                    <div className="font-extrabold text-3xl text-white">Any FactBook™</div>
                  </div>
                  <div
                    className="w-12 h-12 rounded-full flex items-center justify-center shrink-0"
                    style={{ background: "#F5C518" }}
                  >
                    <BookOpen className="w-6 h-6" style={{ color: "#0a1a4a" }} />
                  </div>
                </div>
                <p className="text-white/65 text-sm leading-relaxed mb-4">
                  Pick the topic that matters most to you. Each volume stands completely alone —
                  fully cited, primary sourced, and delivered instantly as a digital PDF.
                </p>
                <div className="flex flex-wrap gap-x-4 gap-y-1 mb-2">
                  {["100% primary sourced", "Instant PDF delivery", "APA 7 citations", "Evergreen research"].map((item) => (
                    <div key={item} className="flex items-center gap-1.5 text-xs" style={{ color: "#F5C518" }}>
                      <CheckCircle className="w-3 h-3 shrink-0" />
                      {item}
                    </div>
                  ))}
                </div>
                <div className="flex items-baseline gap-3 mb-5 mt-4">
                  <span className="font-extrabold text-4xl text-white">$24.95</span>
                  <span className="text-white/50 text-sm">per volume</span>
                </div>
                <button
                  className="w-full inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full font-extrabold text-sm transition-opacity hover:opacity-90"
                  style={{ background: "#F5C518", color: "#0a1a4a" }}
                  onClick={() => document.getElementById("all-volumes")?.scrollIntoView({ behavior: "smooth" })}
                >
                  Browse All 10 Volumes
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* CARD 2 — Complete bundle */}
            <div className="rounded-2xl overflow-hidden bg-white border border-gray-200 p-6 flex flex-col sm:flex-row gap-5 items-start">
              <div className="w-11 h-11 rounded-full flex items-center justify-center shrink-0" style={{ background: "#0e3020" }}>
                <Package className="w-5 h-5 text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-3 mb-1 flex-wrap">
                  <div className="text-xs font-bold tracking-widest uppercase text-muted-foreground">Complete Library</div>
                  <div className="font-extrabold text-2xl" style={{ color: "#0e3020" }}>$149</div>
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed mb-1">
                  All 10 FactBooks™ in one archive. Save $100 off individual pricing.
                </p>
                <p className="text-xs text-muted-foreground mb-4">Instant PDF · 100% primary sourced · APA 7 citations throughout</p>
                <button
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full font-extrabold text-sm text-white transition-opacity hover:opacity-90"
                  style={{ background: "#0e3020" }}
                >
                  Pre-Order the Complete Bundle
                  <Download className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* CARD 3 — About the series */}
            <div className="rounded-2xl overflow-hidden bg-white border border-gray-200 p-6 flex flex-col sm:flex-row gap-5 items-start">
              <div className="w-11 h-11 rounded-full flex items-center justify-center shrink-0" style={{ background: "#0e3020" }}>
                <Layers className="w-5 h-5 text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-xs font-bold tracking-widest uppercase text-muted-foreground mb-2">About the Series</div>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  The FactBook™ series is produced by the same PhD researchers behind ClownBinge's
                  documented journalism — expanded into full research volumes with extended sourcing,
                  data tables, and complete citation indexes.
                </p>
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* ── All 10 volumes grid ── */}
      <div id="all-volumes" className="max-w-6xl mx-auto px-6 py-16 sm:py-20">

        <div className="flex items-baseline justify-between mb-10 border-b border-border pb-6">
          <h2 className="font-sans font-extrabold text-2xl text-foreground">All 10 Volumes</h2>
          <span className="font-mono text-xs text-muted-foreground tracking-widest uppercase">$24.95 each · Digital PDF</span>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-x-5 gap-y-12">
          {BOOKS.map((book) => (
            <div key={book.id} className="group flex flex-col">
              <div className="relative mb-5">
                <button
                  className="w-full text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 rounded-sm"
                  style={{ "--tw-ring-color": book.accent } as React.CSSProperties}
                  onClick={() => setSelectedBook(book)}
                  aria-label={`Learn more about ${book.shortTitle}`}
                >
                  <div
                    className="w-full aspect-[2/3] rounded-sm overflow-hidden shadow-lg group-hover:shadow-2xl group-hover:-translate-y-2 transition-all duration-300 ease-out cursor-pointer"
                    style={{ boxShadow: `0 8px 32px ${book.accent}22, 0 2px 8px rgba(0,0,0,0.18)` }}
                  >
                    <CoverSVG book={book} />
                  </div>
                  {/* Hover hint */}
                  <div className="absolute inset-0 rounded-sm flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none"
                    style={{ background: "rgba(0,0,0,0.45)" }}>
                    <span className="text-white text-xs font-bold tracking-widest uppercase px-3 py-1.5 rounded-full border border-white/40">
                      Learn More
                    </span>
                  </div>
                </button>
              </div>

              <p className="font-mono text-[10px] font-bold tracking-[0.18em] uppercase text-muted-foreground mb-1.5">
                {book.vol} · {book.tag}
              </p>
              <h3 className="font-sans font-bold text-sm text-foreground leading-snug mb-3 flex-1">
                {book.shortTitle}
              </h3>
              <div className="flex items-center justify-between mt-auto pt-3 border-t border-border">
                <span className="font-display font-extrabold text-xl text-foreground">$24.95</span>
                <button className="flex items-center gap-1 text-xs font-bold uppercase tracking-wider text-primary hover:text-primary/70 transition-colors">
                  Pre-Order
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

    </Layout>
  );
}
