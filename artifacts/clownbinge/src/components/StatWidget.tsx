import { useEffect, useRef, useState } from "react";
import { useQuery } from "@tanstack/react-query";

interface PlatformStats {
  totalArticles: number;
  totalCitations: number;
  historicSelfOwns: number;
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

function Stat({
  value,
  label,
  prefix = "",
  suffix = "",
  decimals = 0,
  isCurrency = false,
}: {
  value: number;
  label: string;
  prefix?: string;
  suffix?: string;
  decimals?: number;
  isCurrency?: boolean;
}) {
  const animated = useCountUp(value);
  const display = isCurrency
    ? `${prefix}${animated.toFixed(decimals)}`
    : `${prefix}${animated.toLocaleString()}${suffix}`;

  return (
    <div className="flex flex-col items-center text-center px-4 py-6">
      <span
        className="font-display font-black text-4xl sm:text-5xl tabular-nums leading-none mb-2"
        style={{ color: "#F5C518" }}
      >
        {display}
      </span>
      <span className="text-white/80 font-semibold text-xs sm:text-sm uppercase tracking-widest leading-snug max-w-[160px]">
        {label}
      </span>
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
    staleTime: 5 * 60_000,
  });

  const stats = data ?? {
    totalArticles: 0,
    totalCitations: 0,
    historicSelfOwns: 0,
    darkMoneyAccepted: 0,
  };

  return (
    <div
      className="rounded-xl overflow-hidden my-10 border border-white/10"
      style={{ background: "#0f2060" }}
    >
      <div className="px-6 pt-6 pb-2 text-center">
        <p
          className="text-xs font-mono font-bold uppercase tracking-[0.2em]"
          style={{ color: "#F5C518" }}
        >
          The Record to Date
        </p>
        <p className="text-white/50 text-xs mt-1">Live data. Updated continuously.</p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 divide-x divide-white/10 border-t border-white/10 mt-4">
        <Stat value={stats.totalArticles} label="Verified Records Published" />
        <Stat value={stats.totalCitations} label="Primary Sources Cited" />
        <Stat value={stats.historicSelfOwns} label="Historic 10/10 Self-Owns" />
        <Stat value={0} label="PAC / Dark Money Accepted" prefix="$" suffix=".00" isCurrency decimals={2} />
      </div>
    </div>
  );
}
