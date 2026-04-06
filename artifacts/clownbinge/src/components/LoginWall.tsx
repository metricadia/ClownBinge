import { useEffect, useState } from "react";
import { Shield } from "lucide-react";
import { PsaLogo } from "@/components/PsaLogo";

interface LoginWallProps {
  login: () => void;
  isLoading?: boolean;
}

export function LoginWall({ login, isLoading }: LoginWallProps) {
  const [accessDenied, setAccessDenied] = useState(false);

  /* Pulsing gold glow keyframes — injected once */
  const glowCSS = `
    @keyframes cb-gold-pulse {
      0%   { opacity: 0.18; transform: scale(1);    }
      50%  { opacity: 0.38; transform: scale(1.06); }
      100% { opacity: 0.18; transform: scale(1);    }
    }
    @keyframes cb-card-glow {
      0%   { box-shadow: 0 32px 80px rgba(0,0,0,0.4), 0 8px 24px rgba(0,0,0,0.25), 0 0 18px 4px rgba(245,197,24,0.12); }
      50%  { box-shadow: 0 32px 80px rgba(0,0,0,0.4), 0 8px 24px rgba(0,0,0,0.25), 0 0 42px 14px rgba(245,197,24,0.32); }
      100% { box-shadow: 0 32px 80px rgba(0,0,0,0.4), 0 8px 24px rgba(0,0,0,0.25), 0 0 18px 4px rgba(245,197,24,0.12); }
    }
  `;

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get("access") === "denied") {
      setAccessDenied(true);
    }
  }, []);

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center relative overflow-hidden"
      style={{ background: "#192e7a" }}
    >
      {/* Background: diagonal stripes */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: `repeating-linear-gradient(
            -55deg,
            transparent,
            transparent 38px,
            rgba(255,255,255,0.025) 38px,
            rgba(255,255,255,0.025) 40px
          )`,
        }}
      />
      {/* Background: radial vignette lift behind card */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 70% 60% at 50% 46%, rgba(67,105,230,0.35) 0%, transparent 70%)",
        }}
      />

      {/* Yellow top bar — full width */}
      <div
        className="absolute top-0 left-0 right-0"
        style={{ height: "6px", background: "#F5C518", zIndex: 10 }}
      />

      {/* Centered content */}
      <div className="relative z-10 flex flex-col items-center w-full px-6 pt-14 pb-14">

        {/* Inject glow keyframes */}
        <style>{glowCSS}</style>

        {/* Card + peeking image wrapper */}
        <div className="relative w-full" style={{ maxWidth: "460px" }}>

        {/* Gold glow layer — sits behind the card */}
        <div
          style={{
            position: "absolute",
            inset: "-28px",
            borderRadius: "36px",
            background:
              "radial-gradient(ellipse at 50% 50%, rgba(245,197,24,0.55) 0%, rgba(245,197,24,0.18) 55%, transparent 80%)",
            animation: "cb-gold-pulse 3.6s ease-in-out infinite",
            zIndex: 0,
            pointerEvents: "none",
          }}
        />

        {/* Card */}
        <div
          className="w-full"
          style={{
            borderRadius: "20px",
            overflow: "hidden",
            position: "relative",
            zIndex: 1,
            background: "linear-gradient(160deg, #1f3a9e 0%, #192e7a 100%)",
            animation: "cb-card-glow 3.6s ease-in-out infinite",
          }}
        >
          {/* Card top: blue band with logo — diagonal bottom cut */}
          <div
            className="flex flex-col items-center text-center"
            style={{
              background: "linear-gradient(160deg, #1f3a9e 0%, #192e7a 100%)",
              padding: "52px 48px 62px",
              clipPath: "polygon(0 0, 100% 0, 100% calc(100% - 28px), 0 100%)",
            }}
          >
            {/* ClownBinge wordmark */}
            <div className="flex items-baseline justify-center mb-3">
              <span
                style={{
                  fontFamily: "'Archivo Black', sans-serif",
                  fontSize: "3.4rem",
                  fontWeight: 900,
                  color: "#ffffff",
                  lineHeight: 1,
                  letterSpacing: "-1px",
                }}
              >
                Clown
              </span>
              <span
                style={{
                  fontFamily: "'Archivo Black', sans-serif",
                  fontSize: "3.4rem",
                  fontWeight: 900,
                  color: "#F5C518",
                  lineHeight: 1,
                  letterSpacing: "-1px",
                }}
              >
                Binge
              </span>
            </div>
            {/* Sub-tagline */}
            <div className="flex items-center gap-2" style={{ whiteSpace: "nowrap" }}>
              <div style={{ height: "1px", width: "20px", background: "rgba(245,197,24,0.5)", flexShrink: 0 }} />
              <span
                style={{
                  fontFamily: "'JetBrains Mono', monospace",
                  fontSize: "0.58rem",
                  letterSpacing: "0.18em",
                  textTransform: "uppercase",
                  color: "rgba(255,255,255,0.5)",
                  whiteSpace: "nowrap",
                }}
              >
                Independent
                <span style={{ color: "#F5C518", margin: "0 3px" }}>·</span>
                Verified
                <span style={{ color: "#F5C518", margin: "0 3px" }}>·</span>
                The Primary Source
              </span>
              <div style={{ height: "1px", width: "20px", background: "rgba(245,197,24,0.5)", flexShrink: 0 }} />
            </div>

            {/* Launch date — specific, no fanfare */}
            <div className="flex items-center gap-3 mt-3">
              <div style={{ height: "1px", width: "18px", background: "rgba(245,197,24,0.3)", flexShrink: 0 }} />
              <span
                style={{
                  fontFamily: "'JetBrains Mono', monospace",
                  fontSize: "0.7rem",
                  fontWeight: 500,
                  letterSpacing: "0.14em",
                  color: "rgba(245,197,24,0.6)",
                }}
              >
                MAY 2026
              </span>
              <div style={{ height: "1px", width: "18px", background: "rgba(245,197,24,0.3)", flexShrink: 0 }} />
            </div>
          </div>

          {/* Card body: white */}
          <div style={{ padding: "28px 48px 72px", background: "#ffffff" }}>
            {/* Studio marker */}
            <div className="flex justify-center mb-5">
              <span
                style={{
                  fontFamily: "'Libre Franklin', sans-serif",
                  fontSize: "0.82rem",
                  fontWeight: 600,
                  color: "#b38800",
                  letterSpacing: "0.08em",
                  borderBottom: "1px solid rgba(245,197,24,0.35)",
                  paddingBottom: "3px",
                }}
              >
                Creative Minds At Work
              </span>
            </div>

            {/* Description */}
            <p
              className="text-center leading-relaxed mb-8"
              style={{
                fontFamily: "'Libre Franklin', sans-serif",
                fontSize: "0.95rem",
                color: "#374151",
                lineHeight: 1.7,
              }}
            >
              Journalism captured by money, politics, and nation-state interests
              has run its course. <strong style={{ fontWeight: 700, color: "#111827" }}>ClownBinge</strong> goes to the primary source: court
              filings, congressional records, and federal data. It reports only
              what the documents say. Nothing added. Nothing omitted.
            </p>

            {/* Access denied message */}
            {accessDenied && (
              <div
                className="flex items-start gap-3 px-4 py-3 rounded-xl text-left mb-6"
                style={{ background: "#FFF1F2", border: "1px solid #FECDD3" }}
              >
                <Shield
                  className="w-4 h-4 flex-shrink-0 mt-0.5"
                  style={{ color: "#E11D48" }}
                />
                <p style={{ fontSize: "0.82rem", color: "#9F1239", lineHeight: 1.5 }}>
                  This account is not authorized. Please sign in with an
                  authorized account.
                </p>
              </div>
            )}

            {/* DEV-ONLY: instant bypass — not visible in production */}
            {import.meta.env.DEV && (
              <div className="flex justify-center mb-3">
                <button
                  onClick={() => { window.location.href = "/api/dev-login"; }}
                  style={{
                    fontFamily: "'JetBrains Mono', monospace",
                    fontSize: "0.65rem",
                    color: "rgba(99,102,241,0.8)",
                    background: "rgba(99,102,241,0.08)",
                    border: "1px solid rgba(99,102,241,0.25)",
                    borderRadius: "6px",
                    padding: "4px 12px",
                    cursor: "pointer",
                    letterSpacing: "0.05em",
                  }}
                >
                  ⚡ dev login
                </button>
              </div>
            )}

            {/* CTA Button */}
            <button
              onClick={login}
              disabled={isLoading}
              className="w-full rounded-xl transition-all duration-150 active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed"
              style={{
                background: "linear-gradient(135deg, #F5C518 0%, #e6b800 100%)",
                color: "#111827",
                fontFamily: "'Libre Franklin', sans-serif",
                fontWeight: 500,
                fontSize: "1rem",
                padding: "1rem 1.5rem",
                boxShadow: "0 4px 20px rgba(245,197,24,0.45), 0 1px 4px rgba(0,0,0,0.15)",
                border: "none",
                cursor: isLoading ? "not-allowed" : "pointer",
                letterSpacing: "0.04em",
              }}
              onMouseEnter={e => {
                if (!isLoading) (e.currentTarget as HTMLButtonElement).style.boxShadow = "0 6px 28px rgba(245,197,24,0.6), 0 2px 6px rgba(0,0,0,0.2)";
              }}
              onMouseLeave={e => {
                (e.currentTarget as HTMLButtonElement).style.boxShadow = "0 4px 20px rgba(245,197,24,0.45), 0 1px 4px rgba(0,0,0,0.15)";
              }}
            >
              {isLoading ? (
                <span className="flex items-center justify-center gap-2">
                  <span
                    className="w-4 h-4 rounded-full border-2 border-t-transparent animate-spin"
                    style={{ borderColor: "#111827", borderTopColor: "transparent" }}
                  />
                  Signing in…
                </span>
              ) : (
                <span>
                  <strong style={{ fontWeight: 700 }}>Authorized Users</strong>
                  <span style={{ fontWeight: 400, opacity: 0.75 }}> | Continue</span>
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Team image — heads peek above the card bottom, bodies fade out */}
        <div
          style={{
            position: "absolute",
            bottom: "-240px",
            left: "50%",
            transform: "translateX(-50%)",
            zIndex: 2,
            pointerEvents: "none",
            width: "420px",
            display: "flex",
            justifyContent: "center",
          }}
        >
          <img
            src="/metricadia-team.png"
            alt="Metricadia Research LLC team"
            style={{
              height: "300px",
              width: "auto",
              objectFit: "contain",
              display: "block",
              WebkitMaskImage:
                "linear-gradient(to bottom, black 0%, black 42%, transparent 75%)",
              maskImage:
                "linear-gradient(to bottom, black 0%, black 42%, transparent 75%)",
            }}
          />
        </div>

        </div>{/* end card+image wrapper */}

        {/* Metricadia Research LLC logo — well below */}
        <div className="mt-48 flex flex-col items-center gap-3 w-full" style={{ maxWidth: "460px" }}>
          <PsaLogo
            variant="white"
            dotColor="#F5C518"
            className="text-xl"
            style={{ opacity: 0.85 }}
          />
          {/* 1px rule */}
          <div style={{ width: "100%", height: "1px", background: "rgba(255,255,255,0.12)" }} />
          {/* Copyright */}
          <p
            style={{
              fontFamily: "'Libre Franklin', sans-serif",
              fontSize: "0.7rem",
              color: "rgba(255,255,255,0.3)",
              letterSpacing: "0.04em",
            }}
          >
            © {new Date().getFullYear()} Metricadia Research LLC. All rights reserved.
          </p>
        </div>

      </div>
    </div>
  );
}
