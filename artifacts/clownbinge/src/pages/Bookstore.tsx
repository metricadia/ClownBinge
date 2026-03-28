import { Layout } from "@/components/Layout";
import { usePageSeoHead } from "@/hooks/use-seo-head";
import { ArrowRight, Download } from "lucide-react";

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
  coverDesign: "split" | "type" | "stat" | "grid" | "minimal" | "bar" | "arch" | "overlap" | "circle" | "slash";
}

const BOOKS: FactBook[] = [
  {
    id: 1,
    vol: "Vol. 01",
    shortTitle: "Black Americans & Violent Crime",
    fullTitle: "No, Black Americans Do Not Commit More Violent Crime: Empirical Data Deconstructs the Racist Narratives",
    tag: "NerdOut / Data",
    bg: "#0F0F0F",
    fg: "#FFFFFF",
    accent: "#FF0099",
    accentFg: "#FFFFFF",
    coverDesign: "stat",
  },
  {
    id: 2,
    vol: "Vol. 02",
    shortTitle: "Platform Receipts",
    fullTitle: "Facebook, X, YouTube & TikTok as the Largest Disinformation Infrastructure Ever Built",
    tag: "Investigations",
    bg: "#1A3A8F",
    fg: "#FFFFFF",
    accent: "#F5C518",
    accentFg: "#1A1A2E",
    coverDesign: "grid",
  },
  {
    id: 3,
    vol: "Vol. 03",
    shortTitle: "The Second Amendment's Race Problem",
    fullTitle: "The Second Amendment Has a Race Problem: The Constitutional Record",
    tag: "U.S. Constitution",
    bg: "#F8F9FC",
    fg: "#1A1A2E",
    accent: "#1A3A8F",
    accentFg: "#FFFFFF",
    coverDesign: "split",
  },
  {
    id: 4,
    vol: "Vol. 04",
    shortTitle: "DEI Was a Ruse",
    fullTitle: "Obama vs. Trump Appointee Qualifications: The Attack on DEI Was a Ruse",
    tag: "Primary Source Analytics",
    bg: "#0D3320",
    fg: "#FFFFFF",
    accent: "#00D084",
    accentFg: "#0D3320",
    coverDesign: "bar",
  },
  {
    id: 5,
    vol: "Vol. 05",
    shortTitle: "CNN. MSNBC. Fox. Confirmed.",
    fullTitle: "CNN. MSNBC. Fox News. The Documents Confirm What They Are.",
    tag: "Media / Investigations",
    bg: "#1A1A2E",
    fg: "#FFFFFF",
    accent: "#F5C518",
    accentFg: "#1A1A2E",
    coverDesign: "slash",
  },
  {
    id: 6,
    vol: "Vol. 06",
    shortTitle: "Hijacking Voice",
    fullTitle: "Hijacking Voice: The Documented Legality of Gerrymandering",
    tag: "Law & Justice",
    bg: "#2A0A4A",
    fg: "#FFFFFF",
    accent: "#C084FC",
    accentFg: "#1A0A2E",
    coverDesign: "arch",
  },
  {
    id: 7,
    vol: "Vol. 07",
    shortTitle: "Who Built America",
    fullTitle: "The United States Was Built by Indigenous Nations, Enslaved Africans, and Immigrants",
    tag: "U.S. History",
    bg: "#F5F0E8",
    fg: "#1A1A2E",
    accent: "#1A3A8F",
    accentFg: "#FFFFFF",
    coverDesign: "type",
  },
  {
    id: 8,
    vol: "Vol. 08",
    shortTitle: "Judaism ≠ Zionism",
    fullTitle: "Judaism Is the Oldest Abrahamic Religion. Zionism Is a Political Idea.",
    tag: "Global South / History",
    bg: "#003366",
    fg: "#FFFFFF",
    accent: "#38BDF8",
    accentFg: "#003366",
    coverDesign: "minimal",
  },
  {
    id: 9,
    vol: "Vol. 09",
    shortTitle: "Kemet: The African Record",
    fullTitle: "Herodotus Recorded 'Dark-Skinned and Woolly-Haired.' Kemet as Black African Civilization",
    tag: "Global South / Archaeology",
    bg: "#2D1800",
    fg: "#FFFFFF",
    accent: "#F5C518",
    accentFg: "#2D1800",
    coverDesign: "overlap",
  },
  {
    id: 10,
    vol: "Vol. 10",
    shortTitle: "$2.8 Billion Per Day",
    fullTitle: "The United States Is Paying $2.8 Billion Per Day in Interest on Its Debt",
    tag: "Money & Power",
    bg: "#082010",
    fg: "#FFFFFF",
    accent: "#00D084",
    accentFg: "#082010",
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
          <rect x="20" y="220" width="100" height="3" fill={accent} opacity="0.5" />
          <rect x="20" y="280" width="60" height="3" fill={accent} opacity="0.3" />
        </>
      )}

      {coverDesign === "grid" && (
        <>
          {Array.from({ length: 7 }).map((_, col) =>
            Array.from({ length: 11 }).map((_, row) => (
              <rect
                key={`${col}-${row}`}
                x={col * 35 + 5}
                y={row * 35 + 5}
                width="28"
                height="28"
                fill="none"
                stroke={accent}
                strokeWidth="0.5"
                opacity={(col + row) % 3 === 0 ? "0.25" : "0.08"}
              />
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
            <rect
              key={i}
              x={i * 30 + 5}
              y={310 - h}
              width="22"
              height={h}
              fill={accent}
              opacity={i === 5 ? "0.9" : "0.2"}
              rx="2"
            />
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
          <ellipse cx="120" cy="360" rx="200" ry="150" fill="none" stroke={accent} strokeWidth="0.5" opacity="0.15" />
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
          <line x1="20" y1="184" x2="220" y2="184" stroke={accent} strokeWidth="0.5" opacity="0.2" />
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

      <text
        x="20"
        y="32"
        fontSize="8"
        fill={fg}
        fontFamily="'JetBrains Mono',monospace"
        opacity="0.45"
        letterSpacing="2"
      >
        {vol.toUpperCase()} · CLOWNBINGE FACTBOOK™
      </text>

      {coverDesign === "split" ? (
        <>
          <text x="20" y="90" fontSize="22" fill={accentFg} fontFamily="'Archivo Black',sans-serif" fontWeight="900" letterSpacing="-0.5">
            {line1}
          </text>
          <text x="20" y="118" fontSize="22" fill={accentFg} fontFamily="'Archivo Black',sans-serif" fontWeight="900" letterSpacing="-0.5">
            {line2}
          </text>
          <text x="20" y="210" fontSize="22" fill={fg} fontFamily="'Archivo Black',sans-serif" fontWeight="900" opacity="0.9">
            {book.tag}
          </text>
        </>
      ) : (
        <>
          <text x="20" y="200" fontSize="24" fill={fg} fontFamily="'Archivo Black',sans-serif" fontWeight="900" letterSpacing="-0.5">
            {line1}
          </text>
          <text x="20" y="230" fontSize="24" fill={fg} fontFamily="'Archivo Black',sans-serif" fontWeight="900" letterSpacing="-0.5">
            {line2}
          </text>
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
      <div className="bg-background">

        <div className="border-b border-border">
          <div className="cb-container py-20 sm:py-28">
            <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-8">
              <div className="max-w-2xl">
                <p className="font-mono text-xs font-bold tracking-[0.2em] uppercase text-primary mb-5">
                  Knowledge Is Power · Primary Source Analytics
                </p>
                <h1 className="font-display font-extrabold text-5xl sm:text-6xl lg:text-7xl text-foreground leading-[0.95] tracking-tight mb-6">
                  The<br />
                  <span className="text-primary">FactBook</span>
                  <span className="text-muted-foreground/40">™</span><br />
                  Series.
                </h1>
                <p className="text-lg text-muted-foreground leading-relaxed max-w-lg">
                  Ten deep-dive research volumes on the topics that define our era — built entirely from court records, federal data, congressional transcripts, and archaeological evidence. No opinion. The receipts.
                </p>
              </div>
              <div className="flex flex-col sm:flex-row lg:flex-col gap-4 lg:text-right shrink-0">
                <div className="border-l-2 border-primary pl-4 lg:border-l-0 lg:border-r-2 lg:pr-4 lg:pl-0">
                  <p className="font-mono text-xs text-muted-foreground tracking-widest uppercase mb-1">Individual</p>
                  <p className="font-display font-extrabold text-3xl text-foreground">$24.95 <span className="text-base font-sans font-medium text-muted-foreground">/ volume</span></p>
                </div>
                <div className="border-l-2 border-secondary pl-4 lg:border-l-0 lg:border-r-2 lg:pr-4 lg:pl-0">
                  <p className="font-mono text-xs text-muted-foreground tracking-widest uppercase mb-1">Bundle All 10</p>
                  <p className="font-display font-extrabold text-3xl text-foreground">$149 <span className="text-base font-sans font-medium text-muted-foreground">/ complete</span></p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="cb-container py-16 sm:py-20">

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-x-5 gap-y-12">
            {BOOKS.map((book) => (
              <div key={book.id} className="group flex flex-col">
                <div className="relative mb-5">
                  <div
                    className="w-full aspect-[2/3] rounded-sm overflow-hidden shadow-lg group-hover:shadow-2xl group-hover:-translate-y-2 transition-all duration-400 ease-out"
                    style={{ boxShadow: `0 8px 32px ${book.accent}22, 0 2px 8px rgba(0,0,0,0.18)` }}
                  >
                    <CoverSVG book={book} />
                  </div>
                  <div className="absolute -bottom-2 left-2 right-2 h-4 rounded-b-sm opacity-20 blur-sm -z-10"
                    style={{ background: book.accent }}
                  />
                </div>

                <p className="font-mono text-[10px] font-bold tracking-[0.18em] uppercase text-muted-foreground mb-1.5">
                  {book.vol} · {book.tag}
                </p>
                <h3 className="font-sans font-bold text-sm text-foreground leading-snug mb-3 flex-1">
                  {book.shortTitle}
                </h3>
                <div className="flex items-center justify-between mt-auto pt-3 border-t border-border">
                  <span className="font-display font-extrabold text-xl text-foreground">$24.95</span>
                  <button
                    className="group/btn flex items-center gap-1 text-xs font-bold uppercase tracking-wider text-primary hover:text-primary/80 transition-colors"
                  >
                    Pre-Order
                    <ArrowRight className="w-3.5 h-3.5 group-hover/btn:translate-x-0.5 transition-transform" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="border-t border-border bg-foreground text-white">
          <div className="cb-container py-16 sm:py-20">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-10">
              <div className="max-w-xl">
                <p className="font-mono text-xs text-secondary font-bold tracking-[0.2em] uppercase mb-4">
                  Complete Library Bundle
                </p>
                <h2 className="font-display font-extrabold text-4xl sm:text-5xl text-white leading-tight mb-4">
                  All 10 Volumes.<br />
                  <span className="text-secondary">One Archive.</span>
                </h2>
                <p className="text-white/60 text-base leading-relaxed">
                  Every primary source. Every receipt. Every documented case. The complete Primary Source Analytics library — yours for life.
                </p>
                <div className="mt-6 flex flex-wrap gap-4 text-sm text-white/50 font-mono">
                  {["100% Primary Sources", "Fully Cited", "Instant PDF", "Evergreen Research"].map(t => (
                    <span key={t} className="flex items-center gap-1.5">
                      <span className="w-1 h-1 rounded-full bg-secondary inline-block" />
                      {t}
                    </span>
                  ))}
                </div>
              </div>
              <div className="shrink-0 flex flex-col items-start md:items-end gap-4">
                <div>
                  <p className="font-mono text-white/30 text-sm line-through mb-1 md:text-right">$249.50 individually</p>
                  <p className="font-display font-extrabold text-6xl text-secondary">$149</p>
                </div>
                <button className="flex items-center gap-2 bg-secondary text-foreground font-bold text-sm px-8 py-4 rounded-xl hover:bg-secondary/90 active:scale-95 transition-all shadow-lg shadow-secondary/20">
                  <Download className="w-4 h-4" />
                  Pre-Order the Full Bundle
                </button>
                <p className="font-mono text-xs text-white/30 tracking-wider">
                  Instant PDF · Secure Checkout
                </p>
              </div>
            </div>
          </div>
        </div>

      </div>
    </Layout>
  );
}
