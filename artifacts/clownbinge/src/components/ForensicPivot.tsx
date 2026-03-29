import { useRef, useState, useEffect, useMemo } from "react";
import { motion } from "framer-motion";
import { Link } from "wouter";

interface ForensicPivotConfig {
  vol: string;
  tag: string;
  title: string;
  subtitle?: string;
  ctaText: string;
  accent: string;
  accentFg: string;
  bg: string;
  videoSrc?: string;
  coverImage?: string;
  price: string;
}

const FORENSIC_PIVOT_MAP: Record<string, ForensicPivotConfig> = {
  "social-media-disinformation-platforms-facebook-x-youtube-tiktok-receipts": {
    vol: "Vol. 02",
    tag: "Investigations",
    title: "Merchants of Chaos",
    subtitle: "Social Media as the World's Largest Disinformation Infrastructure",
    ctaText: "Access the Full Forensic Audit",
    accent: "#F5C518",
    accentFg: "#1A1A2E",
    bg: "#1A3A8F",
    videoSrc: "/vol02-bg.mp4",
    price: "$24.95",
  },
  "judaism-zionism-distinction-documented-record-2026": {
    vol: "Vol. 08",
    tag: "History / Primary Source",
    title: "Ancient Faith, Modern Politics",
    subtitle: "Judaism \u2260 Zionism",
    ctaText: "Unlock the 400-Page Record",
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

  return (
    <div
      ref={containerRef}
      className="not-prose relative w-full overflow-hidden rounded-2xl my-10"
      style={{ minHeight: "340px", background: config.bg }}
      onMouseEnter={() => !isTouchDevice && setIsHovered(true)}
      onMouseLeave={() => !isTouchDevice && setIsHovered(false)}
    >
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

      <div className="absolute inset-0 bg-black/50" />

      <div
        className="relative z-10 flex flex-col justify-between p-6 sm:p-8"
        style={{ minHeight: "340px" }}
      >
        <div
          className="font-mono text-[11px] font-bold tracking-[0.22em] uppercase"
          style={{ color: config.accent }}
        >
          {config.vol} // Archive / Primary Source
        </div>

        <div className="flex-1 flex flex-col justify-center py-6">
          <div className="text-[10px] font-mono font-bold tracking-[0.28em] uppercase text-white/45 mb-3">
            {config.tag}
          </div>
          <h3
            className="font-display text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white leading-[1.05] mb-3"
            style={{ textShadow: "0 2px 24px rgba(0,0,0,0.7)" }}
          >
            {config.title}
          </h3>
          {config.subtitle && (
            <p
              className="font-mono text-xs sm:text-sm font-bold tracking-wide leading-relaxed max-w-md"
              style={{ color: config.accent, opacity: 0.9 }}
            >
              {config.subtitle}
            </p>
          )}
        </div>

        <div className="flex items-end justify-between gap-4 flex-wrap">
          <div className="text-[10px] font-mono tracking-[0.22em] uppercase text-white/35">
            Primary Source Analytics™
          </div>
          <div className="flex items-center gap-3 flex-wrap justify-end">
            <span className="text-white/40 text-sm font-mono tabular-nums">
              {config.price}
            </span>
            <Link
              href="/bookstore"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-extrabold tracking-wider uppercase transition-all duration-200 hover:scale-105 active:scale-95"
              style={{
                border: `1px solid ${config.accent}`,
                color: config.accent,
                background: `${config.accent}18`,
              }}
            >
              {config.ctaText}
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
