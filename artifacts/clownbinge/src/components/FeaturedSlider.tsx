import { useState, useEffect, useCallback, useRef } from "react";
import { Link } from "wouter";
import { ArrowRight } from "lucide-react";
import { usePostDetail } from "@/hooks/use-posts";

const FEATURED_SLUGS = [
  "mary-bowser-confederate-white-house-spy-union-intelligence-documented",
  "tsmc-taiwan-advanced-chips-92-percent-geopolitical-risk-pentagon",
  "loneliness-lethal-smoking-15-cigarettes-social-connection-science",
  "national-registry-exonerations-wrongful-conviction-race-data-documented",
  "great-dismal-swamp-maroon-nation-freedom-slavery-archaeology",
  "irs-free-file-intuit-turbotax-lobbying-direct-file-2024",
];

const SLIDE_BG     = ["#F5EBE8", "#E8EDF5", "#FEFAE8", "#E8F0EC", "#FEFAE8", "#E8EDF5"];
const SLIDE_BORDER = ["#D4A090", "#B8C8DC", "#D4C070", "#A8C8B8", "#D4C070", "#B8C8DC"];
const SLIDE_ACCENT = ["#8B2010", "#1A3A8F", "#96720A", "#1A6B4A", "#96720A", "#1A3A8F"];

const CATEGORY_LABELS: Record<string, string> = {
  reasons_pen:             "Reason's Pen",
  self_owned:               "Self-Owned",
  us_history:               "U.S. History",
  money_and_power:          "Money & Power",
  law_and_justice:          "Law & Justice",
  health_and_healing:       "Health & Healing",
  religion:                 "Religion",
  technology:               "Technology",
  war_and_inhumanity:       "War & Inhumanity",
  anti_racist_heroes:       "Anti-Racist Heroes",
  censorship:               "Censorship",
  global_south:             "Global South",
  women_and_girls:          "Women & Girls",
  nerd_out:                 "NerdOut / Academic",
  investigations:           "Investigations",
  us_constitution:          "U.S. Constitution",
  disarming_hate:           "Disarming Hate",
  how_it_works:             "How It Works",
  native_and_first_nations: "Native & First Nations",
};

export function FeaturedSlider() {
  const [current, setCurrent] = useState(0);
  const [hovering, setHovering] = useState(false);
  const touchStartX = useRef<number | null>(null);

  const r0 = usePostDetail(FEATURED_SLUGS[0]);
  const r1 = usePostDetail(FEATURED_SLUGS[1]);
  const r2 = usePostDetail(FEATURED_SLUGS[2]);
  const r3 = usePostDetail(FEATURED_SLUGS[3]);
  const r4 = usePostDetail(FEATURED_SLUGS[4]);
  const r5 = usePostDetail(FEATURED_SLUGS[5]);
  const posts = [r0.data, r1.data, r2.data, r3.data, r4.data, r5.data];

  const advance  = useCallback(() => setCurrent(c => (c + 1) % 6), []);
  const goBack   = useCallback(() => setCurrent(c => (c - 1 + 6) % 6), []);
  const goTo     = (i: number) => setCurrent(i);

  useEffect(() => {
    if (hovering) return;
    const id = setInterval(advance, 7000);
    return () => clearInterval(id);
  }, [hovering, advance]);

  function onTouchStart(e: React.TouchEvent) {
    touchStartX.current = e.touches[0].clientX;
  }
  function onTouchEnd(e: React.TouchEvent) {
    if (touchStartX.current === null) return;
    const dx = e.changedTouches[0].clientX - touchStartX.current;
    touchStartX.current = null;
    if (Math.abs(dx) < 40) return;
    if (dx < 0) advance(); else goBack();
  }

  const bg     = SLIDE_BG[current];
  const border = SLIDE_BORDER[current];
  const accent = SLIDE_ACCENT[current];
  const post   = posts[current];

  return (
    <>
      <style>{`
        @keyframes cb-slide-progress {
          from { transform: scaleX(0); }
          to   { transform: scaleX(1); }
        }
        @keyframes cb-slide-fadein {
          from { opacity: 0; }
          to   { opacity: 1; }
        }
      `}</style>

      <div
        className="mb-8 rounded-2xl overflow-hidden"
        style={{ border: `1px solid ${border}`, boxShadow: `0 4px 24px ${accent}18` }}
        onMouseEnter={() => setHovering(true)}
        onMouseLeave={() => setHovering(false)}
      >
        {/* ── Header ── */}
        <div
          className="px-5 pt-4 pb-3 flex items-center justify-between gap-3"
          style={{ background: bg }}
        >
          <div className="flex items-center gap-2.5">
            <div
              className="flex items-center gap-1 px-2.5 py-1 rounded-full"
              style={{ background: accent }}
            >
              <span className="text-[10px] font-black uppercase tracking-widest text-white leading-none">
                ★ Feature
              </span>
            </div>
            <span className="text-[11px] font-bold tabular-nums" style={{ color: `${accent}99` }}>
              {current + 1} / 6
            </span>
          </div>

          {post && (
            <div className="flex items-center gap-2 min-w-0">
              <span
                className="hidden sm:inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wide whitespace-nowrap"
                style={{ background: `${accent}20`, color: accent }}
              >
                {CATEGORY_LABELS[post.category] ?? post.category}
              </span>
              <span
                className="text-[10px] font-mono font-bold tracking-widest shrink-0"
                style={{ color: `${accent}77` }}
              >
                {post.caseNumber}
              </span>
            </div>
          )}
        </div>

        {/* ── Slide body: only the current slide is in the DOM ── */}
        <div
          style={{ background: bg, minHeight: "160px" }}
          onTouchStart={onTouchStart}
          onTouchEnd={onTouchEnd}
        >
          {/* Re-keyed on current so CSS fade-in fires on every transition */}
          <div
            key={`slide-${current}`}
            style={{
              display: "flex",
              alignItems: "stretch",
              animation: "cb-slide-fadein 0.35s ease",
            }}
          >
            {/* Left accent stripe */}
            <div style={{
              width: "3px",
              flexShrink: 0,
              background: accent,
              margin: "14px 0 14px 20px",
              borderRadius: "9999px",
              opacity: 0.85,
            }} />

            {/* Content */}
            <div style={{ padding: "14px 20px 14px 14px", flex: 1 }}>
              {post ? (
                <>
                  <Link href={`/case/${post.slug}`}>
                    <h2
                      className="font-sans font-extrabold text-xl sm:text-2xl leading-snug mb-2.5 hover:opacity-75 transition-opacity cursor-pointer line-clamp-3"
                      style={{ color: "#1A2A4A" }}
                    >
                      {post.title}
                    </h2>
                  </Link>
                  {post.teaser && (
                    <p className="text-sm leading-relaxed mb-4 line-clamp-2" style={{ color: "#64748b" }}>
                      {post.teaser}
                    </p>
                  )}
                  <Link
                    href={`/case/${post.slug}`}
                    className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-bold hover:opacity-75"
                    style={{ background: `${accent}18`, color: accent }}
                  >
                    Read the Record
                    <ArrowRight className="w-3 h-3" />
                  </Link>
                </>
              ) : (
                /* Loading skeleton */
                <div className="space-y-2.5 animate-pulse pt-1">
                  <div className="h-6 rounded-lg w-4/5" style={{ background: `${accent}18` }} />
                  <div className="h-4 rounded-lg w-full"  style={{ background: `${accent}12` }} />
                  <div className="h-4 rounded-lg w-2/3"   style={{ background: `${accent}12` }} />
                  <div className="h-8 rounded-full w-36"  style={{ background: `${accent}12` }} />
                </div>
              )}
            </div>
          </div>
        </div>

        {/* ── Footer: dots + progress bar ── */}
        <div style={{ background: bg }}>
          <div className="px-5 pt-2 pb-2.5 flex items-center gap-1.5">
            {[0, 1, 2, 3, 4, 5].map(i => (
              <button
                key={i}
                onClick={() => goTo(i)}
                aria-label={`Go to featured article ${i + 1}`}
                style={{
                  height: "5px",
                  width: i === current ? "18px" : "5px",
                  borderRadius: "9999px",
                  background: i === current ? accent : `${accent}30`,
                  transition: "width 0.35s ease",
                  border: "none",
                  cursor: "pointer",
                  padding: 0,
                  flexShrink: 0,
                }}
              />
            ))}
          </div>

          <div style={{
            height: "2px",
            margin: "0 20px 16px",
            background: `${accent}18`,
            borderRadius: "9999px",
            overflow: "hidden",
          }}>
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
              }}
            />
          </div>
        </div>
      </div>
    </>
  );
}
