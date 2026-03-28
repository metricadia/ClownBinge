import { Layout } from "@/components/Layout";
import { usePageSeoHead } from "@/hooks/use-seo-head";
import { BookOpen, ShieldCheck, Download } from "lucide-react";

interface FactBook {
  id: number;
  coverTitle: string[];
  fullTitle: string;
  description: string;
  slug: string;
  accentColor: string;
  bgColor: string;
  pattern: "grid" | "circles" | "lines" | "cross" | "wave" | "dots" | "diamond" | "arch" | "pyramid" | "bars";
}

const FACTBOOKS: FactBook[] = [
  {
    id: 1,
    coverTitle: ["Black Americans", "& Violent Crime:", "The Data"],
    fullTitle: "No, Black Americans Do Not Commit More Violent Crime: Empirical Data Deconstructs the Racist Narratives",
    description: "A full dataset breakdown of FBI UCR, BJS, and DOJ reports — with the sociological framing the headlines omit. Source-by-source demolition of the most persistently weaponized statistic in American politics.",
    slug: "no-black-americans-violent-crime-racist-narrative-2024",
    accentColor: "#FF0099",
    bgColor: "#0F2060",
    pattern: "bars",
  },
  {
    id: 2,
    coverTitle: ["Platform", "Receipts:", "The Infrastructure"],
    fullTitle: "The Receipts on the Platforms: Facebook, X, YouTube & TikTok as the Largest Disinformation Infrastructure Ever Built",
    description: "Congressional records, internal leaks, FTC filings, and advertiser documents. A full Primary Source Analytics audit of how four platforms became the world's largest publishers of organized disinformation.",
    slug: "the-receipts-on-the-platforms-disinformation-infrastructure",
    accentColor: "#F5C518",
    bgColor: "#1A3A8F",
    pattern: "grid",
  },
  {
    id: 3,
    coverTitle: ["The Second", "Amendment's", "Race Problem"],
    fullTitle: "The Second Amendment Has a Race Problem: The Documented Record",
    description: "Constitutional law meets documented racial enforcement disparity. Court records, state statutes, and case chronology from Reconstruction to Philando Castile — the primary sources that reframe the entire debate.",
    slug: "second-amendment-racial-disparity-philando-castile",
    accentColor: "#FF6B35",
    bgColor: "#1C1060",
    pattern: "cross",
  },
  {
    id: 4,
    coverTitle: ["DEI Was", "a Ruse:", "The Proof"],
    fullTitle: "The Attack on DEI Was a Ruse: Obama vs. Trump Administration Appointee Qualifications Compared",
    description: "Complete qualification matrices and sourced credentials for hundreds of appointees across two administrations. The data tells a story that no talking point survives.",
    slug: "dei-ruse-obama-trump-appointee-qualifications",
    accentColor: "#00D084",
    bgColor: "#0D3320",
    pattern: "lines",
  },
  {
    id: 5,
    coverTitle: ["CNN. MSNBC.", "Fox News.", "Confirmed."],
    fullTitle: "CNN. MSNBC. Fox News. The Documents Confirm What They Are.",
    description: "Ownership structures, advertiser dependencies, documented bias events, and editorial pattern analysis. A media literacy reference document built from primary sources — not opinion.",
    slug: "cable-news-binary-media-bias-cnn-msnbc-fox-documented-record-2026",
    accentColor: "#F5C518",
    bgColor: "#2C1810",
    pattern: "wave",
  },
  {
    id: 6,
    coverTitle: ["Hijacking", "Voice:", "Gerrymandering"],
    fullTitle: "Hijacking Voice: The Documented Legality of Gerrymandering",
    description: "Supreme Court history, district maps, and voting suppression data — every election cycle, every decade. The legal architecture of silencing by map, sourced from court filings and federal election records.",
    slug: "gerrymandering-legality-supreme-court-history",
    accentColor: "#A855F7",
    bgColor: "#1A0A3A",
    pattern: "diamond",
  },
  {
    id: 7,
    coverTitle: ["Who Built", "America:", "The Record"],
    fullTitle: "The United States Was Built by Indigenous Nations, Enslaved Africans, and Immigrants: Primary Source Documentation",
    description: "No narrative. No opinion. Land seizure treaties, labor records, congressional acts, and census data — the documented foundation of American wealth and infrastructure, source by source.",
    slug: "us-built-by-indigenous-enslaved-immigrants-primary-source",
    accentColor: "#F5C518",
    bgColor: "#1A3A8F",
    pattern: "dots",
  },
  {
    id: 8,
    coverTitle: ["Judaism", "Is Not", "Zionism"],
    fullTitle: "Judaism Is the Oldest Abrahamic Religion. Zionism Is a Political Idea.",
    description: "The distinction being deliberately collapsed in public discourse. Rabbinic texts, historical chronology, and the documented 19th-century origins of political Zionism — sourced from scholars, historians, and primary religious records.",
    slug: "judaism-zionism-distinction-documented-record-2026",
    accentColor: "#38BDF8",
    bgColor: "#0A1A40",
    pattern: "arch",
  },
  {
    id: 9,
    coverTitle: ["Kemet:", "Black African", "Civilization"],
    fullTitle: "Herodotus Recorded 'Dark-Skinned and Woolly-Haired.' Kemet as Black African Civilization: The Primary Source Record",
    description: "Archaeological evidence, Greek primary texts, and Egyptological scholarship — the 200-year argument ended by the sources themselves. What Herodotus, Diodorus Siculus, and modern DNA research actually document.",
    slug: "kemet-black-african-civilization-herodotus-primary-source",
    accentColor: "#F5C518",
    bgColor: "#2D1A00",
    pattern: "pyramid",
  },
  {
    id: 10,
    coverTitle: ["$2.8 Billion", "Per Day:", "The Debt Clock"],
    fullTitle: "The United States Is Paying $2.8 Billion Per Day in Interest on Its Debt: Generational Cost Analysis",
    description: "Treasury Department records, OMB projections, and military spending comparisons. The compounding cost of the national debt laid out in full — what every generation will inherit, and how we got here.",
    slug: "national-debt-military-spending-interest-payments-generational-cost",
    accentColor: "#00D084",
    bgColor: "#0A2010",
    pattern: "lines",
  },
];

function PatternBg({ pattern, color }: { pattern: FactBook["pattern"]; color: string }) {
  const c = color + "28";
  if (pattern === "grid") {
    return (
      <g opacity="0.35">
        {Array.from({ length: 12 }).map((_, i) => (
          <line key={`v${i}`} x1={i * 20} y1="0" x2={i * 20} y2="300" stroke={color} strokeWidth="0.5" />
        ))}
        {Array.from({ length: 18 }).map((_, i) => (
          <line key={`h${i}`} x1="0" y1={i * 17} x2="200" y2={i * 17} stroke={color} strokeWidth="0.5" />
        ))}
      </g>
    );
  }
  if (pattern === "circles") {
    return (
      <g opacity="0.2">
        {[60, 90, 120, 150].map((r, i) => (
          <circle key={i} cx="100" cy="150" r={r} stroke={color} strokeWidth="1.5" fill="none" />
        ))}
      </g>
    );
  }
  if (pattern === "lines") {
    return (
      <g opacity="0.25">
        {Array.from({ length: 20 }).map((_, i) => (
          <line key={i} x1="0" y1={i * 16} x2="200" y2={i * 16} stroke={color} strokeWidth="0.8" />
        ))}
      </g>
    );
  }
  if (pattern === "cross") {
    return (
      <g opacity="0.15">
        {Array.from({ length: 6 }).map((_, col) =>
          Array.from({ length: 9 }).map((_, row) => (
            <g key={`${col}-${row}`}>
              <line x1={col * 35 + 17} y1={row * 35} x2={col * 35 + 17} y2={row * 35 + 25} stroke={color} strokeWidth="1" />
              <line x1={col * 35} y1={row * 35 + 17} x2={col * 35 + 25} y2={row * 35 + 17} stroke={color} strokeWidth="1" />
            </g>
          ))
        )}
      </g>
    );
  }
  if (pattern === "wave") {
    const paths = Array.from({ length: 8 }).map((_, i) => {
      const y = i * 40;
      return `M0,${y} Q50,${y - 15} 100,${y} Q150,${y + 15} 200,${y}`;
    });
    return (
      <g opacity="0.2">
        {paths.map((d, i) => (
          <path key={i} d={d} stroke={color} strokeWidth="1" fill="none" />
        ))}
      </g>
    );
  }
  if (pattern === "dots") {
    return (
      <g opacity="0.25">
        {Array.from({ length: 10 }).map((_, col) =>
          Array.from({ length: 15 }).map((_, row) => (
            <circle key={`${col}-${row}`} cx={col * 22 + 5} cy={row * 22 + 5} r="2" fill={color} />
          ))
        )}
      </g>
    );
  }
  if (pattern === "diamond") {
    return (
      <g opacity="0.18">
        {Array.from({ length: 5 }).map((_, col) =>
          Array.from({ length: 8 }).map((_, row) => (
            <polygon
              key={`${col}-${row}`}
              points={`${col * 40 + 20},${row * 40} ${col * 40 + 35},${row * 40 + 20} ${col * 40 + 20},${row * 40 + 40} ${col * 40 + 5},${row * 40 + 20}`}
              stroke={color}
              strokeWidth="0.8"
              fill="none"
            />
          ))
        )}
      </g>
    );
  }
  if (pattern === "arch") {
    return (
      <g opacity="0.2">
        {Array.from({ length: 5 }).map((_, i) => (
          <path key={i} d={`M${i * 50},300 Q${i * 50 + 25},${200 - i * 30} ${i * 50 + 50},300`} stroke={color} strokeWidth="1" fill={c} />
        ))}
        {Array.from({ length: 5 }).map((_, i) => (
          <path key={`b${i}`} d={`M${i * 50},0 Q${i * 50 + 25},${100 + i * 20} ${i * 50 + 50},0`} stroke={color} strokeWidth="1" fill={c} />
        ))}
      </g>
    );
  }
  if (pattern === "pyramid") {
    return (
      <g opacity="0.2">
        <polygon points="100,60 20,220 180,220" stroke={color} strokeWidth="1.5" fill={c} />
        <polygon points="100,90 40,220 160,220" stroke={color} strokeWidth="1" fill={c} />
        <polygon points="100,120 60,220 140,220" stroke={color} strokeWidth="1" fill={c} />
        <line x1="20" y1="220" x2="180" y2="220" stroke={color} strokeWidth="1.5" />
      </g>
    );
  }
  if (pattern === "bars") {
    const heights = [80, 130, 60, 110, 90, 145, 70];
    return (
      <g opacity="0.25">
        {heights.map((h, i) => (
          <rect key={i} x={i * 28 + 8} y={260 - h} width="18" height={h} fill={color} rx="2" />
        ))}
      </g>
    );
  }
  return null;
}

function BookCover({ book }: { book: FactBook }) {
  const lines = book.coverTitle;
  return (
    <svg
      viewBox="0 0 200 300"
      xmlns="http://www.w3.org/2000/svg"
      className="w-full h-full"
      style={{ fontFamily: "'Archivo Black', 'Libre Franklin', sans-serif" }}
    >
      <rect width="200" height="300" fill={book.bgColor} rx="3" />

      <PatternBg pattern={book.pattern} color={book.accentColor} />

      <rect x="0" y="0" width="200" height="6" fill={book.accentColor} />
      <rect x="0" y="294" width="200" height="6" fill={book.accentColor} />

      <rect x="0" y="6" width="5" height="288" fill={book.accentColor + "60"} />

      <text x="12" y="24" fontSize="5.5" fill={book.accentColor} fontFamily="'JetBrains Mono', monospace" letterSpacing="1.5" textAnchor="start" fontWeight="700">
        CLOWNBINGE EXCLUSIVE · FACTBOOK™
      </text>

      {lines.map((line, i) => (
        <text
          key={i}
          x="12"
          y={100 + i * 24}
          fontSize={lines.length > 2 ? "18" : "20"}
          fill="#FFFFFF"
          fontFamily="'Archivo Black', sans-serif"
          fontWeight="900"
          letterSpacing="-0.3"
        >
          {line}
        </text>
      ))}

      <rect x="12" y="158" width="44" height="3" fill={book.accentColor} rx="1.5" />

      <text x="12" y="178" fontSize="5" fill="rgba(255,255,255,0.55)" fontFamily="'JetBrains Mono', monospace" letterSpacing="1">
        PRIMARY SOURCE ANALYTICS
      </text>
      <text x="12" y="188" fontSize="5" fill="rgba(255,255,255,0.55)" fontFamily="'JetBrains Mono', monospace" letterSpacing="1">
        KNOWLEDGE IS POWER
      </text>

      <rect x="0" y="274" width="200" height="20" fill="rgba(0,0,0,0.4)" />
      <text x="12" y="287" fontSize="5.5" fill={book.accentColor} fontFamily="'JetBrains Mono', monospace" letterSpacing="1" fontWeight="700">
        CLOWNBINGE.COM
      </text>
      <text x="188" y="287" fontSize="5.5" fill="rgba(255,255,255,0.6)" fontFamily="'JetBrains Mono', monospace" letterSpacing="0.5" textAnchor="end">
        $24.95
      </text>
    </svg>
  );
}

export default function Bookstore() {
  usePageSeoHead({
    title: "FactBook™ Bookstore — Knowledge Is Power | ClownBinge",
    description: "ClownBinge Exclusive FactBook™ series. Primary Source Analytics on the topics that matter most. Evergreen. Documented. Sourced.",
    path: "/bookstore",
    schemaType: "ItemPage",
  });

  return (
    <Layout>
      <div className="bg-header text-white py-16 sm:py-24 relative overflow-hidden">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-0 right-0 w-2/3 h-full opacity-10"
            style={{ background: "repeating-linear-gradient(90deg, #F5C518 0px, #F5C518 1px, transparent 1px, transparent 32px)" }}
          />
          <div className="absolute top-0 right-0 w-2/3 h-full opacity-10"
            style={{ background: "repeating-linear-gradient(0deg, #F5C518 0px, #F5C518 1px, transparent 1px, transparent 32px)" }}
          />
        </div>
        <div className="cb-container relative z-10">
          <span className="font-mono text-secondary font-bold tracking-widest uppercase mb-3 block text-sm">
            ClownBinge Exclusive · Primary Source Analytics
          </span>
          <h1 className="font-display font-extrabold text-4xl sm:text-5xl lg:text-6xl mb-4 leading-tight">
            Knowledge Is Power.
          </h1>
          <p className="text-xl text-white/70 font-medium leading-relaxed max-w-2xl mb-6">
            Ten FactBooks™ on the topics that define our era — built entirely from primary sources. Court records. Federal data. Archaeological evidence. Congressional transcripts. No opinion. Just the receipts.
          </p>
          <div className="inline-flex items-center gap-2 bg-secondary/10 border border-secondary/30 text-secondary px-4 py-2 rounded-full text-sm font-bold font-mono tracking-wider uppercase">
            <BookOpen className="w-4 h-4" />
            10 Volumes · $24.95 Each · Digital PDF
          </div>
        </div>
      </div>

      <div className="bg-muted border-b border-border py-4">
        <div className="cb-container flex flex-wrap items-center gap-6">
          {[
            "100% Primary Sources",
            "Fully Cited with URLs",
            "Instant PDF Delivery",
            "Evergreen Research",
          ].map((item) => (
            <div key={item} className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
              <ShieldCheck className="w-4 h-4 text-primary" />
              {item}
            </div>
          ))}
        </div>
      </div>

      <div className="cb-container py-14 sm:py-20">
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 sm:gap-8">
          {FACTBOOKS.map((book) => (
            <div
              key={book.id}
              className="group flex flex-col bg-white border-2 border-border rounded-2xl overflow-hidden shadow-md hover:shadow-2xl hover:-translate-y-1 transition-all duration-300"
            >
              <div className="relative aspect-[2/3] bg-muted overflow-hidden">
                <div className="absolute inset-0 group-hover:scale-105 transition-transform duration-500">
                  <BookCover book={book} />
                </div>
              </div>

              <div className="p-4 flex flex-col flex-1">
                <p className="font-mono text-[9px] font-bold tracking-widest uppercase text-secondary mb-1">
                  FactBook™ Vol. {book.id}
                </p>
                <h3 className="font-sans font-bold text-foreground text-sm leading-snug mb-2 flex-1">
                  {book.fullTitle}
                </h3>
                <p className="text-xs text-muted-foreground leading-relaxed mb-4 line-clamp-3">
                  {book.description}
                </p>
                <div className="flex items-center justify-between mt-auto">
                  <span className="font-display font-extrabold text-2xl text-foreground">$24.95</span>
                  <button className="flex items-center gap-1.5 bg-primary text-white text-xs font-bold px-3 py-2 rounded-lg hover:bg-primary/90 active:scale-95 transition-all">
                    <Download className="w-3.5 h-3.5" />
                    Pre-Order
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-20 bg-header rounded-3xl p-10 sm:p-14 text-white relative overflow-hidden">
          <div className="absolute inset-0 opacity-10"
            style={{ background: "repeating-linear-gradient(-45deg, #F5C518 0px, #F5C518 1px, transparent 1px, transparent 20px)" }}
          />
          <div className="relative z-10 flex flex-col sm:flex-row items-center justify-between gap-8">
            <div>
              <p className="font-mono text-secondary text-xs font-bold tracking-widest uppercase mb-2">Bundle Deal</p>
              <h2 className="font-display font-extrabold text-3xl sm:text-4xl mb-3">All 10 FactBooks™</h2>
              <p className="text-white/70 text-lg max-w-md">
                The complete Primary Source Analytics library. Every volume. Every receipt. One archive.
              </p>
            </div>
            <div className="shrink-0 text-center">
              <p className="font-mono text-white/50 text-sm line-through mb-1">$249.50</p>
              <p className="font-display font-extrabold text-5xl text-secondary mb-4">$149</p>
              <button className="bg-secondary text-header font-bold text-lg px-10 py-4 rounded-xl hover:bg-white transition-colors shadow-lg shadow-secondary/30">
                Pre-Order Bundle
              </button>
            </div>
          </div>
        </div>

        <div className="mt-10 flex items-center justify-center gap-3 text-muted-foreground">
          <ShieldCheck className="w-5 h-5" />
          <span className="font-medium text-sm">Secure checkout · Instant PDF delivery · 100% primary sourced</span>
        </div>
      </div>
    </Layout>
  );
}
