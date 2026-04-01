import { useEffect, useRef, useState } from "react";
import { useQuery } from "@tanstack/react-query";

interface PlatformStats {
  totalArticles: number;
  totalCitations: number;
  retractionsIssued: number;
  darkMoneyAccepted: number;
}

function useCountUp(target: number, duration = 1400) {
  const [value, setValue] = useState(0);
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    if (!target) return;
    const start = performance.now();
    const tick = (now: number) => {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setValue(Math.floor(eased * target));
      if (progress < 1) {
        rafRef.current = requestAnimationFrame(tick);
      } else {
        setValue(target);
      }
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => {
      if (rafRef.current != null) cancelAnimationFrame(rafRef.current);
    };
  }, [target, duration]);

  return value;
}

function StatCard({
  value,
  label,
  description,
  prefix = "",
  suffix = "",
  decimals = 0,
  isCurrency = false,
  border = false,
}: {
  value: number;
  label: string;
  description: string;
  prefix?: string;
  suffix?: string;
  decimals?: number;
  isCurrency?: boolean;
  border?: boolean;
}) {
  const animated = useCountUp(value);
  const display = isCurrency
    ? `${prefix}${animated.toFixed(decimals)}`
    : `${prefix}${animated.toLocaleString()}${suffix}`;

  return (
    <div
      className={`flex flex-col justify-between px-6 py-7 ${border ? "border-t border-white/10 sm:border-t-0 sm:border-l" : ""}`}
    >
      <div
        className="font-display font-black tabular-nums leading-none mb-3"
        style={{ color: "#F5C518", fontSize: "clamp(2.5rem, 5vw, 3.5rem)" }}
        aria-label={`${label}: ${display}`}
      >
        {display}
      </div>
      <div>
        <p className="text-white font-black text-xs uppercase tracking-widest leading-snug mb-1.5">
          {label}
        </p>
        <p className="text-white/50 text-xs leading-relaxed">
          {description}
        </p>
      </div>
    </div>
  );
}

export function StatWidget() {
  const { data } = useQuery<PlatformStats>({
    queryKey: ["platform-stats"],
    queryFn: async () => {
      const res = await fetch("/api/posts/stats");
      if (!res.ok) throw new Error("Failed to fetch stats");
      return res.json();
    },
    staleTime: 0,
  });

  const stats = data ?? {
    totalArticles: 0,
    totalCitations: 0,
    retractionsIssued: 0,
    darkMoneyAccepted: 0,
  };

  return (
    <section
      className="rounded-xl overflow-hidden my-12 border border-white/10"
      style={{ background: "#0f2060" }}
      aria-label="Platform statistics"
    >
      <header className="px-6 pt-7 pb-5 border-b border-white/10 text-center">
        <p
          className="text-[11px] font-mono font-black uppercase tracking-[0.25em]"
          style={{ color: "#F5C518" }}
        >
          The Record to Date
        </p>
        <p className="text-white/40 text-xs mt-1 tracking-wide">
          Live data. Updated continuously.
        </p>
      </header>

      <div className="grid grid-cols-1 sm:grid-cols-2">
        <StatCard
          value={stats.totalArticles}
          label="Verified Records Published"
          description="Every article sourced to primary documents before publication. No exceptions."
        />
        <StatCard
          value={stats.totalCitations}
          label="Primary Sources Cited"
          description="Court records, government filings, original data, and declassified documents."
          border
        />
        <div className="border-t border-white/10 col-span-1 sm:col-span-2 grid grid-cols-1 sm:grid-cols-2">
          <StatCard
            value={stats.retractionsIssued}
            label="Retractions Issued"
            description="Every record stands. We verify before we publish. We have never retracted a single record."
          />
          <StatCard
            value={0}
            label="PAC / Dark Money Accepted"
            description="We take no money from political action committees or anonymous donors. Our independence is structural."
            prefix="$"
            isCurrency
            decimals={2}
            border
          />
        </div>
      </div>
    </section>
  );
}
