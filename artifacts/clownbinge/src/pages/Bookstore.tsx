import { Layout } from "@/components/Layout";
import { usePageSeoHead } from "@/hooks/use-seo-head";
import { BookOpen, ArrowRight, CheckCircle, Download, Package, Layers } from "lucide-react";

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
}

const BOOKS: FactBook[] = [
  {
    id: 1, vol: "Vol. 01",
    shortTitle: "Black Americans & Violent Crime",
    fullTitle: "No, Black Americans Do Not Commit More Violent Crime: Empirical Data Deconstructs the Racist Narratives",
    tag: "NerdOut / Data",
    bg: "#0F0F0F", fg: "#FFFFFF", accent: "#FF0099", accentFg: "#FFFFFF",
    coverDesign: "stat",
  },
  {
    id: 2, vol: "Vol. 02",
    shortTitle: "Platform Receipts",
    fullTitle: "Facebook, X, YouTube & TikTok as the Largest Disinformation Infrastructure Ever Built",
    tag: "Investigations",
    bg: "#1A3A8F", fg: "#FFFFFF", accent: "#F5C518", accentFg: "#1A1A2E",
    coverDesign: "grid",
  },
  {
    id: 3, vol: "Vol. 03",
    shortTitle: "The 2nd Amendment's Race Problem",
    fullTitle: "The Second Amendment Has a Race Problem: The Constitutional Record",
    tag: "U.S. Constitution",
    bg: "#F8F9FC", fg: "#1A1A2E", accent: "#1A3A8F", accentFg: "#FFFFFF",
    coverDesign: "split",
  },
  {
    id: 4, vol: "Vol. 04",
    shortTitle: "DEI Was a Ruse",
    fullTitle: "Obama vs. Trump Appointee Qualifications: The Attack on DEI Was a Ruse",
    tag: "Primary Source Analytics",
    bg: "#0D3320", fg: "#FFFFFF", accent: "#00D084", accentFg: "#0D3320",
    coverDesign: "bar",
  },
  {
    id: 5, vol: "Vol. 05",
    shortTitle: "CNN. MSNBC. Fox. Confirmed.",
    fullTitle: "CNN. MSNBC. Fox News. The Documents Confirm What They Are.",
    tag: "Media / Investigations",
    bg: "#1A1A2E", fg: "#FFFFFF", accent: "#F5C518", accentFg: "#1A1A2E",
    coverDesign: "slash",
  },
  {
    id: 6, vol: "Vol. 06",
    shortTitle: "Hijacking Voice",
    fullTitle: "Hijacking Voice: The Documented Legality of Gerrymandering",
    tag: "Law & Justice",
    bg: "#2A0A4A", fg: "#FFFFFF", accent: "#C084FC", accentFg: "#1A0A2E",
    coverDesign: "arch",
  },
  {
    id: 7, vol: "Vol. 07",
    shortTitle: "Who Built America",
    fullTitle: "The United States Was Built by Indigenous Nations, Enslaved Africans, and Immigrants",
    tag: "U.S. History",
    bg: "#F5F0E8", fg: "#1A1A2E", accent: "#1A3A8F", accentFg: "#FFFFFF",
    coverDesign: "type",
  },
  {
    id: 8, vol: "Vol. 08",
    shortTitle: "Judaism ≠ Zionism",
    fullTitle: "Judaism Is the Oldest Abrahamic Religion. Zionism Is a Political Idea.",
    tag: "Global South / History",
    bg: "#003366", fg: "#FFFFFF", accent: "#38BDF8", accentFg: "#003366",
    coverDesign: "minimal",
  },
  {
    id: 9, vol: "Vol. 09",
    shortTitle: "Kemet: The African Record",
    fullTitle: "Herodotus Recorded 'Dark-Skinned and Woolly-Haired.' Kemet as Black African Civilization",
    tag: "Global South / Archaeology",
    bg: "#2D1800", fg: "#FFFFFF", accent: "#F5C518", accentFg: "#2D1800",
    coverDesign: "overlap",
  },
  {
    id: 10, vol: "Vol. 10",
    shortTitle: "$2.8 Billion Per Day",
    fullTitle: "The United States Is Paying $2.8 Billion Per Day in Interest on Its Debt",
    tag: "Money & Power",
    bg: "#082010", fg: "#FFFFFF", accent: "#00D084", accentFg: "#082010",
    coverDesign: "circle",
  },
];

function CoverSVG({ book }: { book: FactBook }) {
  const { bg, fg, accent, accentFg, coverDesign, vol, shortTitle } = book;
  const words = shortTitle.split(" ");
  const mid = Math.ceil(words.length / 2);
  const line1 = words.slice(0, mid).join(" ");
  const line2 = words.slice(mid).join(" ");

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

export default function Bookstore() {
  usePageSeoHead({
    title: "Our Books — Knowledge Is Power | ClownBinge FactBook™",
    description: "The ClownBinge FactBook™ series. Primary Source Analytics on the topics that define our era. Evergreen. Documented. Sourced.",
    path: "/bookstore",
    schemaType: "ItemPage",
  });

  return (
    <Layout>

      {/* Page label */}
      <div className="max-w-5xl mx-auto px-6 pt-10 pb-0">
        <h2 className="font-mono text-xs font-bold tracking-[0.2em] uppercase text-muted-foreground">
          Our Books / FactBook™ Series
        </h2>
      </div>

      {/* ── Two-column hero — mirrors Donate Now structure exactly ── */}
      <div className="w-full" style={{ background: "linear-gradient(135deg, #071a0e 0%, #0e3020 55%, #0a2818 100%)" }}>
        <div className="max-w-6xl mx-auto px-6 py-14 grid lg:grid-cols-2 gap-12 items-start">

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

            {/* CARD 1 — Individual volume (blue gradient, yellow border — shown first) */}
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

            {/* CARD 2 — Complete bundle (green gradient) */}
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

            {/* CARD 3 — About the series (white) */}
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
                <div
                  className="w-full aspect-[2/3] rounded-sm overflow-hidden shadow-lg group-hover:shadow-2xl group-hover:-translate-y-2 transition-all duration-300 ease-out"
                  style={{ boxShadow: `0 8px 32px ${book.accent}22, 0 2px 8px rgba(0,0,0,0.18)` }}
                >
                  <CoverSVG book={book} />
                </div>
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
