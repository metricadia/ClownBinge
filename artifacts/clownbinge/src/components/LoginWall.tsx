import { useEffect, useState } from "react";
import { Shield } from "lucide-react";
import { PsaLogo } from "@/components/PsaLogo";

interface LoginWallProps {
  login: () => void;
  isLoading?: boolean;
}

export function LoginWall({ login, isLoading }: LoginWallProps) {
  const [accessDenied, setAccessDenied] = useState(false);

  /* Subtle pulsing gold glow keyframes — injected once */
  const glowCSS = `
    @keyframes cb-gold-pulse {
      0%   { opacity: 0.18; transform: scale(1);    }
      50%  { opacity: 0.38; transform: scale(1.06); }
      100% { opacity: 0.18; transform: scale(1);    }
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
            boxShadow:
              "0 32px 80px rgba(0,0,0,0.4), 0 8px 24px rgba(0,0,0,0.25)",
            overflow: "hidden",
            position: "relative",
            zIndex: 1,
            background: "linear-gradient(160deg, #1f3a9e 0%, #192e7a 100%)",
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
          </div>

          {/* Card body: white */}
          <div style={{ padding: "28px 48px 72px", background: "#ffffff" }}>
            {/* Access badge */}
            <div className="flex justify-center mb-5">
              <span
                className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full font-bold uppercase tracking-widest"
                style={{
                  background: "rgba(245,197,24,0.12)",
                  border: "1.5px solid rgba(245,197,24,0.4)",
                  color: "#b38800",
                  fontSize: "0.65rem",
                  fontFamily: "'Libre Franklin', sans-serif",
                }}
              >
                <span
                  className="w-1.5 h-1.5 rounded-full"
                  style={{ background: "#F5C518" }}
                />
                Preview Access
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
              The accountability journalism platform that names names, cites
              sources, and follows the money. Sign in to access the full
              platform.
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
        <div className="mt-48 flex flex-col items-center gap-2">
          <PsaLogo
            variant="white"
            dotColor="#F5C518"
            className="text-xl"
            style={{ opacity: 0.85 }}
          />
          <p
            style={{
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: "0.6rem",
              letterSpacing: "0.2em",
              textTransform: "uppercase",
              color: "rgba(255,255,255,0.28)",
            }}
          >
            Authorized personnel only
          </p>
        </div>

      </div>
    </div>
  );
}
