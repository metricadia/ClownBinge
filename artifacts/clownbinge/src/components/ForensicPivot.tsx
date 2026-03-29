import { useRef, useState, useEffect, useMemo } from "react";
import { motion } from "framer-motion";
import { Link } from "wouter";
import { ArrowRight, BookOpen } from "lucide-react";

interface ForensicPivotConfig {
  bookId: number;
  vol: string;
  tag: string;
  title: string;
  subtitle?: string;
  accent: string;
  accentFg: string;
  bg: string;
  videoSrc?: string;
  coverImage?: string;
  price: string;
}

const FORENSIC_PIVOT_MAP: Record<string, ForensicPivotConfig> = {
  "social-media-disinformation-platforms-facebook-x-youtube-tiktok-receipts": {
    bookId: 2,
    vol: "Vol. 02",
    tag: "Investigations",
    title: "Merchants of Chaos",
    subtitle: "Social Media as the World\u2019s Largest Disinformation Infrastructure",
    accent: "#F5C518",
    accentFg: "#1A1A2E",
    bg: "#1A3A8F",
    videoSrc: "/vol02-bg.mp4",
    price: "$24.95",
  },
  "judaism-zionism-distinction-documented-record-2026": {
    bookId: 8,
    vol: "Vol. 08",
    tag: "History / Primary Source",
    title: "Ancient Faith, Modern Politics",
    subtitle: "Judaism \u2260 Zionism",
    accent: "#C9A227",
    accentFg: "#1A1A2E",
    bg: "#0D0500",
    coverImage: "/covers/vol08-cover.png",
    price: "$39.95",
  },
};

export function ForensicPivot({ slug }: { slug: string }) {
  const config = FORENSIC_PIVOT_MAP[slug];
  if (!config) return null;

  const containerRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isHovered, setIsHovered] = useState(false);
  const [isInView, setIsInView] = useState(false);
  const [videoSrcSet, setVideoSrcSet] = useState(false);

  const isTouchDevice = useMemo(
    () => typeof window !== "undefined" && window.matchMedia("(hover: none)").matches,
    []
  );

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        const visible = entry.isIntersecting;
        setIsInView(visible);
        if (visible && config.videoSrc && videoRef.current && !videoSrcSet) {
          videoRef.current.src = config.videoSrc;
          videoRef.current.load();
          setVideoSrcSet(true);
        }
      },
      { threshold: 0.15 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [config.videoSrc, videoSrcSet]);

  const shouldDeblur = isTouchDevice ? isInView : isHovered;
  const href = `/bookstore?book=${config.bookId}`;

  return (
    <Link href={href}>
      <div
        ref={containerRef}
        className="not-prose relative w-full overflow-hidden rounded-2xl my-10 cursor-pointer group"
        style={{ minHeight: "320px", background: config.bg }}
        onMouseEnter={() => !isTouchDevice && setIsHovered(true)}
        onMouseLeave={() => !isTouchDevice && setIsHovered(false)}
      >
        {/* ── Background media ── */}
        {config.videoSrc ? (
          <motion.div
            className="absolute inset-0"
            animate={{ filter: shouldDeblur ? "blur(0px)" : "blur(10px)" }}
            transition={{ duration: 0.5, ease: "easeOut" }}
          >
            <video
              ref={videoRef}
              autoPlay
              loop
              muted
              playsInline
              className="absolute inset-0 w-full h-full object-cover"
            />
          </motion.div>
        ) : config.coverImage ? (
          <motion.div
            className="absolute inset-0"
            animate={{ filter: shouldDeblur ? "blur(0px)" : "blur(10px)" }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            style={{
              backgroundImage: `url(${config.coverImage})`,
              backgroundSize: "cover",
              backgroundPosition: "center top",
            }}
          />
        ) : null}

        {/* Dark overlay — lifts slightly on hover */}
        <motion.div
          className="absolute inset-0"
          animate={{ backgroundColor: isHovered ? "rgba(0,0,0,0.38)" : "rgba(0,0,0,0.56)" }}
          transition={{ duration: 0.3 }}
        />

        {/* Hover border flash */}
        <motion.div
          className="absolute inset-0 rounded-2xl pointer-events-none"
          animate={{ opacity: isHovered ? 1 : 0 }}
          transition={{ duration: 0.3 }}
          style={{ border: `2px solid ${config.accent}`, boxShadow: `0 0 32px ${config.accent}40` }}
        />

        {/* ── Content ── */}
        <div
          className="relative z-10 flex flex-col justify-between p-6 sm:p-8"
          style={{ minHeight: "320px" }}
        >
          {/* Top row — vol metadata + FactBook badge */}
          <div className="flex items-center justify-between">
            <span
              className="font-mono text-[11px] font-bold tracking-[0.22em] uppercase"
              style={{ color: config.accent }}
            >
              {config.vol} // Primary Source Archive
            </span>
            <span
              className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-black tracking-widest uppercase"
              style={{ background: `${config.accent}22`, border: `1px solid ${config.accent}55`, color: config.accent }}
            >
              <BookOpen className="w-2.5 h-2.5" />
              FactBook™
            </span>
          </div>

          {/* Center — title block */}
          <div className="flex-1 flex flex-col justify-center py-5">
            <div className="text-[10px] font-mono font-bold tracking-[0.3em] uppercase text-white/40 mb-2">
              {config.tag}
            </div>
            <h3
              className="font-display text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white leading-[1.05] mb-3"
              style={{ textShadow: "0 2px 24px rgba(0,0,0,0.8)" }}
            >
              {config.title}
            </h3>
            {config.subtitle && (
              <p
                className="font-mono text-xs sm:text-sm font-bold tracking-wide leading-relaxed max-w-lg"
                style={{ color: config.accent, opacity: 0.9 }}
              >
                {config.subtitle}
              </p>
            )}
          </div>

          {/* Bottom row — branding left, CTA right */}
          <div className="flex items-end justify-between gap-4 flex-wrap">
            <div className="text-[10px] font-mono tracking-[0.22em] uppercase text-white/30">
              Primary Source Analytics™
            </div>
            <div className="flex items-center gap-3 flex-wrap justify-end">
              <span className="text-white/40 text-sm font-mono tabular-nums">{config.price}</span>
              <motion.div
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-extrabold tracking-wider uppercase"
                animate={
                  isHovered
                    ? { background: config.accent, color: config.accentFg, scale: 1.04 }
                    : { background: `${config.accent}18`, color: config.accent, scale: 1 }
                }
                transition={{ duration: 0.25 }}
                style={{ border: `1.5px solid ${config.accent}` }}
              >
                Open the Record
                <ArrowRight className="w-3.5 h-3.5" />
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}
