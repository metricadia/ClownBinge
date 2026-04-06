import { useEffect, useState } from "react";
import { Sparkles, Lock, Shield } from "lucide-react";

interface LoginWallProps {
  login: () => void;
  isLoading?: boolean;
}

export function LoginWall({ login, isLoading }: LoginWallProps) {
  const [accessDenied, setAccessDenied] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get("access") === "denied") {
      setAccessDenied(true);
    }
  }, []);

  return (
    <div
      className="min-h-screen flex items-center justify-center px-4 relative overflow-hidden"
      style={{
        background: "linear-gradient(135deg, #0a0a0f 0%, #0f0e16 40%, #0c0a14 70%, #080810 100%)",
      }}
    >
      {/* Ambient glow */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 60% 50% at 50% 50%, rgba(251,191,36,0.04) 0%, transparent 70%)",
        }}
      />

      {/* Subtle grid texture */}
      <div
        className="absolute inset-0 pointer-events-none opacity-20"
        style={{
          backgroundImage:
            "linear-gradient(rgba(251,191,36,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(251,191,36,0.03) 1px, transparent 1px)",
          backgroundSize: "60px 60px",
        }}
      />

      {/* Card */}
      <div
        className="relative w-full max-w-md"
        style={{
          background:
            "linear-gradient(135deg, #141218 0%, #0f0e18 50%, #141218 100%)",
          border: "2px solid transparent",
          backgroundImage:
            "linear-gradient(135deg, #141218 0%, #0f0e18 50%, #141218 100%), linear-gradient(135deg, #fbbf24 0%, #f59e0b 50%, #d97706 100%)",
          backgroundOrigin: "border-box",
          backgroundClip: "padding-box, border-box",
          borderRadius: "1.25rem",
          boxShadow:
            "0 0 60px rgba(251,191,36,0.12), 0 20px 80px rgba(0,0,0,0.6)",
        }}
      >
        <div className="px-8 py-10 flex flex-col items-center text-center">
          {/* Logo badge */}
          <div className="mb-6 flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-amber-500/10 to-yellow-400/10 border border-amber-500/20">
            <Sparkles className="w-4 h-4 text-amber-400" />
            <span className="text-xs font-bold text-amber-400 tracking-widest uppercase">
              Metricadia Research LLC
            </span>
          </div>

          {/* Main logo */}
          <div className="mb-2">
            <h1
              className="text-5xl font-black tracking-tight"
              style={{
                background: "linear-gradient(135deg, #fbbf24 0%, #f59e0b 50%, #fbbf24 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              ClownBinge
            </h1>
          </div>

          <p className="text-xs text-stone-500 tracking-widest uppercase mb-8">
            Accountability Journalism · Empirical &amp; Fearless
          </p>

          {/* Divider */}
          <div className="w-full flex items-center gap-3 mb-8">
            <div className="flex-1 h-px bg-gradient-to-r from-transparent via-amber-900/40 to-transparent" />
            <div className="flex items-center gap-1.5">
              <Lock className="w-3.5 h-3.5 text-amber-700/60" />
              <span className="text-xs text-amber-700/60 font-bold uppercase tracking-widest">
                Preview Access
              </span>
            </div>
            <div className="flex-1 h-px bg-gradient-to-r from-transparent via-amber-900/40 to-transparent" />
          </div>

          {/* Description */}
          <p className="text-stone-400 text-sm leading-relaxed mb-8 max-w-sm">
            ClownBinge is the accountability journalism platform that names names,
            cites sources, and follows the money. Sign in to access the full platform.
          </p>

          {/* Access denied message */}
          {accessDenied && (
            <div className="w-full mb-6 flex items-start gap-3 px-4 py-3 rounded-xl bg-red-950/30 border border-red-800/40">
              <Shield className="w-4 h-4 text-red-400 mt-0.5 flex-shrink-0" />
              <p className="text-sm text-red-300 text-left">
                This account is not authorized to access ClownBinge. Please sign in with an authorized account.
              </p>
            </div>
          )}

          {/* Sign in button */}
          <button
            onClick={login}
            disabled={isLoading}
            className="w-full py-3.5 px-6 rounded-xl font-black text-base text-stone-950 transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed hover:scale-[1.02] active:scale-[0.98]"
            style={{
              background: isLoading
                ? "#78716c"
                : "linear-gradient(135deg, #fbbf24 0%, #f59e0b 50%, #fbbf24 100%)",
              boxShadow: isLoading
                ? "none"
                : "0 4px 24px rgba(251,191,36,0.3), 0 2px 8px rgba(0,0,0,0.4)",
            }}
          >
            {isLoading ? (
              <span className="flex items-center justify-center gap-2">
                <span className="w-4 h-4 border-2 border-stone-500 border-t-transparent rounded-full animate-spin" />
                Signing in...
              </span>
            ) : (
              "Sign In to Access"
            )}
          </button>

          {/* Footer */}
          <p className="mt-6 text-xs text-stone-700 leading-relaxed">
            Authorized personnel only · {new Date().getFullYear()} Metricadia Research LLC
          </p>
        </div>
      </div>
    </div>
  );
}
