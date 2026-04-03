import { useState, useEffect, useCallback } from "react";
import { Link } from "wouter";
import { ArrowRight } from "lucide-react";
import { usePostDetail } from "@/hooks/use-posts";

const FEATURED_SLUGS = [
  "COINTELPRO-fred-hampton-FBI-assassination-Black-Panther-1969",
  "American-eugenics-Nazi-Germany-forced-sterilization-Buck-v-Bell",
  "bracero-program-stolen-wages-mexico-farmworkers-labor-history",
  "ted-cruz-christ-is-king-antisemitic-aipac",
  "national-debt-military-spending-interest-payments-generational-cost",
];

const SLIDE_BG     = ["#E8EDF5", "#FEFAE8", "#E8EDF5", "#FEFAE8", "#E8EDF5"];
const SLIDE_BORDER = ["#C3D0E0", "#DDD090", "#C3D0E0", "#DDD090", "#C3D0E0"];
const SLIDE_ACCENT = ["#1A3A8F", "#A07C10", "#1A3A8F", "#A07C10", "#1A3A8F"];

const CATEGORY_LABELS: Record<string, string> = {
  self_owned:       "Self-Owned",
  us_history:       "U.S. History",
  money_and_power:  "Money & Power",
  law_and_justice:  "Law & Justice",
  health_and_healing:"Health & Healing",
  religion:         "Religion",
  technology:       "Technology",
  war_and_inhumanity:"War & Inhumanity",
  anti_racist_heroes:"Anti-Racist Heroes",
  censorship:       "Censorship",
  global_south:     "Global South",
  nerd_out:         "NerdOut / Academic",
  investigations:   "Investigations",
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
    <div
      className="mb-8 rounded-2xl overflow-hidden"
      style={{
        border: `1px solid ${border}`,
        transition: "border-color 0.7s ease",
      }}
      onMouseEnter={() => setHovering(true)}
      onMouseLeave={() => setHovering(false)}
    >
      {/* Header bar */}
      <div
        className="px-6 pt-5 pb-2 flex items-center justify-between gap-2"
        style={{ background: bg, transition: "background 0.7s ease" }}
      >
        <div
          className="flex items-center bg-white/90 rounded-full overflow-hidden"
          style={{ border: `1px solid ${border}`, transition: "border-color 0.7s ease" }}
        >
          <span
            className="px-3 py-1 text-xs font-extrabold uppercase tracking-widest"
            style={{ color: accent, transition: "color 0.7s ease" }}
          >
            ★ Feature
          </span>
          <span
            className="px-2 py-1 text-xs font-bold tabular-nums"
            style={{
              color: accent,
              borderLeft: `1px solid ${border}`,
              transition: "color 0.7s ease, border-color 0.7s ease",
            }}
          >
            {current + 1} / 5
          </span>
        </div>

        {posts[current] && (
          <span className="text-xs font-mono font-bold text-slate-400 tracking-wide truncate max-w-[55%] text-right">
            {CATEGORY_LABELS[posts[current].category] ?? posts[current].category}
            &nbsp;&nbsp;·&nbsp;&nbsp;
            {posts[current].caseNumber}
          </span>
        )}
      </div>

      {/* Slides */}
      <div
        className="relative overflow-hidden"
        style={{ background: bg, transition: "background 0.7s ease", minHeight: "172px" }}
      >
        {FEATURED_SLUGS.map((slug, i) => {
          const post = posts[i];
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
                top: 0,
                left: 0,
                right: 0,
                padding: "1rem 1.5rem 1.25rem",
                transform: tx,
                opacity,
                transition: "transform 0.65s cubic-bezier(0.4,0,0.2,1), opacity 0.55s ease",
                visibility: isVisible ? "visible" : "hidden",
                pointerEvents: isCurrent ? "auto" : "none",
              }}
            >
              {post ? (
                <>
                  <Link href={`/case/${post.slug}`}>
                    <h2 className="font-sans font-extrabold text-xl sm:text-2xl text-header leading-snug mb-3 hover:text-primary transition-colors cursor-pointer line-clamp-3">
                      {post.title}
                    </h2>
                  </Link>
                  {post.teaser && (
                    <p className="text-sm text-slate-600 leading-relaxed mb-4 line-clamp-2">
                      {post.teaser}
                    </p>
                  )}
                  <Link
                    href={`/case/${post.slug}`}
                    className="inline-flex items-center gap-2 text-sm font-bold hover:underline"
                    style={{ color: accent }}
                  >
                    Read the Record
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </>
              ) : (
                <div className="space-y-2 animate-pulse">
                  <div className="h-6 rounded bg-white/50 w-3/4" />
                  <div className="h-4 rounded bg-white/40 w-full" />
                  <div className="h-4 rounded bg-white/40 w-2/3" />
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Dot nav + progress bar */}
      <div
        className="px-6 pb-4 pt-1 flex items-center gap-2"
        style={{ background: bg, transition: "background 0.7s ease" }}
      >
        {[0, 1, 2, 3, 4].map(i => (
          <button
            key={i}
            onClick={() => goTo(i)}
            aria-label={`Featured article ${i + 1}`}
            style={{
              height: "8px",
              width: i === current ? "24px" : "8px",
              borderRadius: "9999px",
              background: i === current ? accent : `${accent}35`,
              transition: "width 0.4s ease, background 0.7s ease",
              border: "none",
              cursor: "pointer",
              padding: 0,
            }}
          />
        ))}
      </div>
    </div>
  );
}
