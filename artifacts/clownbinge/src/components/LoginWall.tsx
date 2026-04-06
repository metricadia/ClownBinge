import { useEffect, useState } from "react";
import { Lock, Shield } from "lucide-react";
import { PsaLogo } from "@/components/PsaLogo";

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
      className="min-h-screen flex flex-col items-center justify-center px-4 py-12 relative overflow-hidden"
      style={{ background: "#1A3A8F" }}
    >
      {/* Subtle pattern overlay */}
      <div
        className="absolute inset-0 pointer-events-none opacity-10"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.05) 1px, transparent 1px)",
          backgroundSize: "40px 40px",
        }}
      />

      {/* White card */}
      <div
        className="relative w-full max-w-sm bg-white rounded-2xl overflow-hidden"
        style={{
          boxShadow:
            "0 20px 60px rgba(0,0,0,0.3), 0 4px 16px rgba(0,0,0,0.2)",
        }}
      >
        {/* Yellow top accent bar */}
        <div className="h-1.5 w-full" style={{ background: "#F5C518" }} />

        <div className="px-8 pt-8 pb-8 flex flex-col items-center text-center">
          {/* ClownBinge logo — matches site header */}
          <div className="mb-1 flex flex-col items-center">
            <div className="flex items-baseline gap-0 leading-none">
              <span
                className="text-4xl font-black tracking-tight"
                style={{
                  fontFamily: "'Archivo Black', sans-serif",
                  color: "#1A3A8F",
                }}
              >
                Clown
              </span>
              <span
                className="text-4xl font-black tracking-tight"
                style={{
                  fontFamily: "'Archivo Black', sans-serif",
                  color: "#F5C518",
                }}
              >
                Binge
              </span>
              <span
                className="text-2xl font-light mx-2"
                style={{ color: "rgba(26,58,143,0.3)" }}
              >
                |
              </span>
              <span
                className="text-lg font-semibold tracking-widest uppercase"
                style={{
                  fontFamily: "'Libre Franklin', sans-serif",
                  color: "rgba(26,58,143,0.55)",
                }}
              >
                Newsroom
              </span>
            </div>
            <span
              className="text-[10px] tracking-[0.2em] uppercase mt-1"
              style={{
                fontFamily: "'JetBrains Mono', monospace",
                color: "rgba(26,58,143,0.45)",
              }}
            >
              Independent
              <span style={{ color: "#F5C518" }}>.</span> Verified
              <span style={{ color: "#F5C518" }}>.</span> The Primary Source
              <span style={{ color: "#F5C518" }}>.</span>
            </span>
          </div>

          {/* Yellow rule */}
          <div
            className="w-full rounded-full my-6"
            style={{ height: "3px", background: "#F5C518" }}
          />

          {/* Preview access label */}
          <div className="flex items-center gap-2 mb-4">
            <Lock className="w-3.5 h-3.5" style={{ color: "#1A3A8F" }} />
            <span
              className="text-xs font-bold tracking-widest uppercase"
              style={{ color: "#1A3A8F" }}
            >
              Preview Access
            </span>
          </div>

          {/* Description */}
          <p
            className="text-sm leading-relaxed mb-6"
            style={{ color: "#6B7280" }}
          >
            ClownBinge is the accountability journalism platform that names
            names, cites sources, and follows the money. Sign in to access the
            full platform.
          </p>

          {/* Access denied message */}
          {accessDenied && (
            <div
              className="w-full mb-5 flex items-start gap-3 px-4 py-3 rounded-xl border text-left"
              style={{
                background: "#FFF1F2",
                borderColor: "#FECDD3",
              }}
            >
              <Shield
                className="w-4 h-4 flex-shrink-0 mt-0.5"
                style={{ color: "#E11D48" }}
              />
              <p className="text-sm" style={{ color: "#9F1239" }}>
                This account is not authorized to access ClownBinge. Please sign
                in with an authorized account.
              </p>
            </div>
          )}

          {/* Sign in button */}
          <button
            onClick={login}
            disabled={isLoading}
            className="w-full py-3.5 px-6 rounded-xl font-black text-base transition-all duration-150 disabled:opacity-60 disabled:cursor-not-allowed hover:brightness-95 active:scale-[0.98]"
            style={{
              background: "#F5C518",
              color: "#1A1A2E",
              fontFamily: "'Libre Franklin', sans-serif",
              boxShadow: "0 2px 12px rgba(245,197,24,0.35)",
            }}
          >
            {isLoading ? (
              <span className="flex items-center justify-center gap-2">
                <span
                  className="w-4 h-4 border-2 border-t-transparent rounded-full animate-spin"
                  style={{ borderColor: "#1A1A2E", borderTopColor: "transparent" }}
                />
                Signing in…
              </span>
            ) : (
              "Sign In to Access"
            )}
          </button>
        </div>
      </div>

      {/* Metricadia Research LLC logo — below the card */}
      <div className="mt-8 flex flex-col items-center gap-2">
        <PsaLogo
          variant="white"
          dotColor="#F5C518"
          className="text-base"
          style={{ opacity: 0.85 }}
        />
        <p
          className="text-xs tracking-widest uppercase"
          style={{ color: "rgba(255,255,255,0.35)", fontFamily: "'JetBrains Mono', monospace" }}
        >
          Authorized personnel only
        </p>
      </div>
    </div>
  );
}
