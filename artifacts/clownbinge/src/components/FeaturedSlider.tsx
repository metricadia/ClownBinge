import { useState, useEffect, useCallback } from "react";
import { Link } from "wouter";
import { ArrowRight } from "lucide-react";
import { usePostDetail } from "@/hooks/use-posts";

// Five categories, five unmistakable "I had no idea" moments.
// Rotates every 7 seconds. No two adjacent slides share a category.
const FEATURED_SLUGS = [
  "tsmc-taiwan-advanced-chips-92-percent-geopolitical-risk-pentagon",       // Technology
  "loneliness-lethal-smoking-15-cigarettes-social-connection-science",       // Health & Healing
  "national-registry-exonerations-wrongful-conviction-race-data-documented", // Law & Justice
  "great-dismal-swamp-maroon-nation-freedom-slavery-archaeology",            // U.S. History
  "irs-free-file-intuit-turbotax-lobbying-direct-file-2024",                 // Money & Power
];

const SLIDE_BG     = ["#E8EDF5", "#FEFAE8", "#E8F0EC", "#FEFAE8", "#E8EDF5"];
const SLIDE_BORDER = ["#B8C8DC", "#D4C070", "#A8C8B8", "#D4C070", "#B8C8DC"];
const SLIDE_ACCENT = ["#1A3A8F", "#96720A", "#1A6B4A", "#96720A", "#1A3A8F"];

const CATEGORY_LABELS: Record<string, string> = {
  self_owned:         "Self-Owned",
  us_history:         "U.S. History",
  money_and_power:    "Money & Power",
  law_and_justice:    "Law & Justice",
  health_and_healing: "Health & Healing",
  religion:           "Religion",
  technology:         "Technology",
  war_and_inhumanity: "War & Inhumanity",
  anti_racist_heroes: "Anti-Racist Heroes",
  censorship:         "Censorship",
  global_south:       "Global South",
  women_and_girls:    "Women & Girls",
  nerd_out:           "NerdOut / Academic",
  investigations:     "Investigations",
  us_constitution:    "U.S. Constitution",
  disarming_hate:     "Disarming Hate",
  how_it_works:       "How It Works",
};

export function FeaturedSlider() {
  const [current, setCurrent] = useState(0);
  const [prev, setPrev]       = useState<number | null>(null);
  const [hovering, setHovering] = useState(false);

  const r0 = usePostDetail(FEATURED_SLUGS[0]);
  const r1 = usePostDetail(FEATURED_SLUGS[1]);
  const r2 = usePostDetail(FEATURED_SLUGS[2]);
  const r3 = usePostDetail(FEATURED_SLUGS[3]);
  const r4 = usePostDetail(FEATURED_SLUGS[4]);
  const posts = [r0.data, r1.data, r2.data, r3.data, r4.data];

  const advance = useCallback(() => {
    setCurrent(c => {
      const next = (c + 1) % 5;
      setPrev(c);
      return next;
    });
  }, []);

  useEffect(() => {
    if (hovering) return;
    const id = setInterval(advance, 7000);
    return () => clearInterval(id);
  }, [hovering, advance]);

  function goTo(i: number) {
    setCurrent(c => {
      if (i === c) return c;
      setPrev(c);
      return i;
    });
  }

  const bg     = SLIDE_BG[current];
  const border = SLIDE_BORDER[current];
  const accent = SLIDE_ACCENT[current];

  return (
    <>
      <style>{`
        @keyframes cb-slide-progress {
          from { transform: scaleX(0); }
          to   { transform: scaleX(1); }
        }
      `}</style>

      <div
        className="mb-8 rounded-2xl overflow-hidden"
        style={{
          border: `1px solid ${border}`,
          boxShadow: `0 4px 32px ${accent}14, 0 1px 6px ${accent}0C`,
          transition: "border-color 0.7s ease, box-shadow 0.7s ease",
        }}
        onMouseEnter={() => setHovering(true)}
        onMouseLeave={() => setHovering(false)}
      >

        {/* ── Header ── */}
        <div
          className="px-5 pt-4 pb-3 flex items-center justify-between gap-3"
          style={{ background: bg, transition: "background 0.7s ease" }}
        >
          <div className="flex items-center gap-2.5">
            <div
              className="flex items-center gap-1 px-2.5 py-1 rounded-full"
              style={{ background: accent, transition: "background 0.7s ease" }}
            >
              <span className="text-[10px] font-black uppercase tracking-widest text-white leading-none">
                ★ Feature
              </span>
            </div>
            <span
              className="text-[11px] font-bold tabular-nums"
              style={{ color: `${accent}70`, transition: "color 0.7s ease" }}
            >
              {current + 1} / 5
            </span>
          </div>

          {/* Category chip + case number */}
          {posts[current] && (
            <div className="flex items-center gap-2 min-w-0">
              <span
                className="hidden sm:inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wide whitespace-nowrap"
                style={{
                  background: `${accent}16`,
                  color: accent,
                  transition: "background 0.7s ease, color 0.7s ease",
                }}
              >
                {CATEGORY_LABELS[posts[current].category] ?? posts[current].category}
              </span>
              <span
                className="text-[10px] font-mono font-bold tracking-widest shrink-0"
                style={{ color: `${accent}55`, transition: "color 0.7s ease" }}
              >
                {posts[current].caseNumber}
              </span>
            </div>
          )}
        </div>

        {/* ── Slides ── */}
        <div
          className="relative overflow-hidden"
          style={{ background: bg, transition: "background 0.7s ease", minHeight: "168px" }}
        >
          {FEATURED_SLUGS.map((slug, i) => {
            const post      = posts[i];
            const isCurrent = i === current;
            const isPrev    = i === prev;
            const isVisible = isCurrent || isPrev;

            const tx      = isCurrent ? "translateX(0%)" : isPrev ? "translateX(-110%)" : "translateX(110%)";
            const opacity = isCurrent ? 1 : 0;

            return (
              <div
                key={slug}
                aria-hidden={!isCurrent}
                style={{
                  position: "absolute",
                  top: 0, left: 0, right: 0,
                  display: "flex",
                  alignItems: "stretch",
                  transform: tx,
                  opacity,
                  transition: "transform 0.65s cubic-bezier(0.4,0,0.2,1), opacity 0.55s ease",
                  visibility: isVisible ? "visible" : "hidden",
                  pointerEvents: isCurrent ? "auto" : "none",
                }}
              >
                {/* Left accent stripe */}
                <div
                  style={{
                    width: "3px",
                    flexShrink: 0,
                    background: accent,
                    transition: "background 0.7s ease",
                    margin: "14px 0 14px 20px",
                    borderRadius: "9999px",
                    opacity: 0.85,
                  }}
                />

                {/* Slide content */}
                <div style={{ padding: "14px 20px 14px 14px", flex: 1, minWidth: 0 }}>
                  {post ? (
                    <>
                      <Link href={`/case/${post.slug}`}>
                        <h2 className="font-sans font-extrabold text-xl sm:text-2xl text-header leading-snug mb-2.5 hover:opacity-75 transition-opacity cursor-pointer line-clamp-3">
                          {post.title}
                        </h2>
                      </Link>
                      {post.teaser && (
                        <p className="text-sm text-slate-500 leading-relaxed mb-4 line-clamp-2">
                          {post.teaser}
                        </p>
                      )}
                      <Link
                        href={`/case/${post.slug}`}
                        className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-bold transition-opacity hover:opacity-75"
                        style={{
                          background: `${accent}15`,
                          color: accent,
                          transition: "background 0.7s ease, color 0.7s ease",
                        }}
                      >
                        Read the Record
                        <ArrowRight className="w-3 h-3" />
                      </Link>
                    </>
                  ) : (
                    <div className="space-y-2.5 animate-pulse pt-1">
                      <div className="h-6 rounded-lg bg-white/50 w-4/5" />
                      <div className="h-4 rounded-lg bg-white/40 w-full" />
                      <div className="h-4 rounded-lg bg-white/40 w-2/3" />
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* ── Footer: dots + progress bar ── */}
        <div style={{ background: bg, transition: "background 0.7s ease" }}>
          <div className="px-5 pt-2 pb-2.5 flex items-center gap-1.5">
            {[0, 1, 2, 3, 4].map(i => (
              <button
                key={i}
                onClick={() => goTo(i)}
                aria-label={`Go to featured article ${i + 1}`}
                style={{
                  height: "5px",
                  width: i === current ? "18px" : "5px",
                  borderRadius: "9999px",
                  background: i === current ? accent : `${accent}28`,
                  transition: "width 0.4s ease, background 0.7s ease",
                  border: "none",
                  cursor: "pointer",
                  padding: 0,
                  flexShrink: 0,
                }}
              />
            ))}
          </div>

          <div
            style={{
              height: "2px",
              margin: "0 20px 16px",
              background: `${accent}18`,
              borderRadius: "9999px",
              overflow: "hidden",
              transition: "background 0.7s ease",
            }}
          >
            <div
              key={`progress-${current}`}
              style={{
                height: "100%",
                width: "100%",
                background: accent,
                transformOrigin: "left center",
                borderRadius: "9999px",
                animation: "cb-slide-progress 7s linear forwards",
                animationPlayState: hovering ? "paused" : "running",
                transition: "background 0.7s ease",
              }}
            />
          </div>
        </div>

      </div>
    </>
  );
}
