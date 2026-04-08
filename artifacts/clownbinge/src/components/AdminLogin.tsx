import { useState } from "react";
import { Lock, Eye, EyeOff, Loader2 } from "lucide-react";
import { PsaLogo } from "@/components/PsaLogo";

const GOLD = "#C9A227";
const NAVY = "#0d1c3a";

interface AdminLoginProps {
  onSuccess: () => void;
}

export function AdminLogin({ onSuccess }: AdminLoginProps) {
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!password.trim()) return;
    setIsLoading(true);
    setError("");
    try {
      const response = await fetch("/api/metricadia/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ password }),
      });
      const data = await response.json();
      if (response.ok && data.success) {
        if (data.token) {
          sessionStorage.setItem("metricadia_token", data.token);
          sessionStorage.setItem("metricadia_authenticated", "true");
        }
        onSuccess();
      } else {
        setError(data.message || "Incorrect password. Try again.");
        setPassword("");
      }
    } catch {
      setError("Connection error. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden pb-[14vh]"
      style={{ background: `linear-gradient(170deg, #0a1628 0%, ${NAVY} 45%, #0b1a35 100%)` }}
    >
      {/* Subtle grid overlay */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.03]"
        style={{
          backgroundImage: `linear-gradient(${GOLD} 1px, transparent 1px), linear-gradient(90deg, ${GOLD} 1px, transparent 1px)`,
          backgroundSize: "48px 48px",
        }}
      />

      {/* Kintsugi-marble gold veining — glow + core layers + particle scatter */}
      <style>{`
        @keyframes veinPulse {
          0%, 100% { opacity: 1; }
          50%       { opacity: 0.45; }
        }
        .vein-svg { animation: veinPulse 9s ease-in-out infinite; }
      `}</style>
      <svg
        className="absolute inset-0 w-full h-full pointer-events-none vein-svg"
        viewBox="0 0 1000 600"
        preserveAspectRatio="xMidYMid slice"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          {/* Reusable glow filter */}
          <filter id="vein-glow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
          </filter>
        </defs>

        {/* ── VEIN 1 — BL→TR diagonal (main sweep) ── */}
        <path d="M -10 590 C 70 530, 55 450, 160 400 C 265 350, 370 420, 450 360 C 530 300, 495 195, 598 148 C 672 115, 748 155, 820 98 C 890 42, 958 20, 1010 5"
          fill="none" stroke="#C8A230" strokeWidth="18" strokeOpacity="0.025" />
        <path d="M -10 590 C 70 530, 55 450, 160 400 C 265 350, 370 420, 450 360 C 530 300, 495 195, 598 148 C 672 115, 748 155, 820 98 C 890 42, 958 20, 1010 5"
          fill="none" stroke="#D4A832" strokeWidth="5" strokeOpacity="0.055" />
        <path d="M -10 590 C 70 530, 55 450, 160 400 C 265 350, 370 420, 450 360 C 530 300, 495 195, 598 148 C 672 115, 748 155, 820 98 C 890 42, 958 20, 1010 5"
          fill="none" stroke="#F0D070" strokeWidth="1.0" strokeOpacity="0.18" filter="url(#vein-glow)" />

        {/* ── VEIN 2 — TL→BR counter-diagonal ── */}
        <path d="M -10 30 C 80 80, 60 170, 170 220 C 280 270, 390 200, 470 260 C 550 320, 520 430, 620 470 C 710 505, 810 465, 890 520 C 950 562, 990 590, 1010 605"
          fill="none" stroke="#C8A230" strokeWidth="14" strokeOpacity="0.022" />
        <path d="M -10 30 C 80 80, 60 170, 170 220 C 280 270, 390 200, 470 260 C 550 320, 520 430, 620 470 C 710 505, 810 465, 890 520 C 950 562, 990 590, 1010 605"
          fill="none" stroke="#D4A832" strokeWidth="4" strokeOpacity="0.050" />
        <path d="M -10 30 C 80 80, 60 170, 170 220 C 280 270, 390 200, 470 260 C 550 320, 520 430, 620 470 C 710 505, 810 465, 890 520 C 950 562, 990 590, 1010 605"
          fill="none" stroke="#F0D070" strokeWidth="0.8" strokeOpacity="0.15" filter="url(#vein-glow)" />

        {/* ── VEIN 3 — near-vertical, top→bottom through left side ── */}
        <path d="M 200 -10 C 180 60, 240 120, 210 200 C 180 280, 100 310, 120 400 C 140 480, 220 500, 190 590 C 175 620, 155 640, 140 620"
          fill="none" stroke="#D4A832" strokeWidth="3" strokeOpacity="0.04" />
        <path d="M 200 -10 C 180 60, 240 120, 210 200 C 180 280, 100 310, 120 400 C 140 480, 220 500, 190 590 C 175 620, 155 640, 140 620"
          fill="none" stroke="#F0D070" strokeWidth="0.6" strokeOpacity="0.13" filter="url(#vein-glow)" />

        {/* ── VEIN 4 — near-vertical, top→bottom through right side ── */}
        <path d="M 820 -10 C 845 50, 780 110, 810 190 C 840 270, 920 300, 900 390 C 880 470, 800 490, 830 580 C 848 620, 870 635, 860 615"
          fill="none" stroke="#D4A832" strokeWidth="3" strokeOpacity="0.035" />
        <path d="M 820 -10 C 845 50, 780 110, 810 190 C 840 270, 920 300, 900 390 C 880 470, 800 490, 830 580 C 848 620, 870 635, 860 615"
          fill="none" stroke="#F0D070" strokeWidth="0.55" strokeOpacity="0.12" filter="url(#vein-glow)" />

        {/* ── VEIN 5 — lower horizontal band ── */}
        <path d="M -10 480 C 80 460, 140 510, 240 495 C 340 480, 370 420, 480 438 C 590 456, 630 510, 740 500 C 840 490, 910 450, 1010 465"
          fill="none" stroke="#C8A230" strokeWidth="12" strokeOpacity="0.020" />
        <path d="M -10 480 C 80 460, 140 510, 240 495 C 340 480, 370 420, 480 438 C 590 456, 630 510, 740 500 C 840 490, 910 450, 1010 465"
          fill="none" stroke="#D4A832" strokeWidth="3.5" strokeOpacity="0.045" />
        <path d="M -10 480 C 80 460, 140 510, 240 495 C 340 480, 370 420, 480 438 C 590 456, 630 510, 740 500 C 840 490, 910 450, 1010 465"
          fill="none" stroke="#F0D070" strokeWidth="0.7" strokeOpacity="0.14" filter="url(#vein-glow)" />

        {/* ── VEIN 6 — upper horizontal band ── */}
        <path d="M -10 110 C 100 90, 150 148, 260 135 C 370 122, 400 60, 520 78 C 640 96, 670 162, 790 148 C 890 137, 960 95, 1010 108"
          fill="none" stroke="#C8A230" strokeWidth="10" strokeOpacity="0.018" />
        <path d="M -10 110 C 100 90, 150 148, 260 135 C 370 122, 400 60, 520 78 C 640 96, 670 162, 790 148 C 890 137, 960 95, 1010 108"
          fill="none" stroke="#D4A832" strokeWidth="3" strokeOpacity="0.040" />
        <path d="M -10 110 C 100 90, 150 148, 260 135 C 370 122, 400 60, 520 78 C 640 96, 670 162, 790 148 C 890 137, 960 95, 1010 108"
          fill="none" stroke="#F0D070" strokeWidth="0.6" strokeOpacity="0.12" filter="url(#vein-glow)" />

        {/* ── Gold particle scatter — clustered near vein intersections ── */}
        <g fill="#D4A832">
          {/* cluster near vein-A reversal ~(420,300) */}
          <circle cx="390" cy="310" r="1.2" fillOpacity="0.12" />
          <circle cx="408" cy="295" r="0.7" fillOpacity="0.09" />
          <circle cx="430" cy="308" r="1.5" fillOpacity="0.07" />
          <circle cx="415" cy="320" r="0.5" fillOpacity="0.10" />
          <circle cx="400" cy="285" r="0.9" fillOpacity="0.08" />
          <circle cx="445" cy="290" r="0.6" fillOpacity="0.07" />
          {/* cluster near vein-B wave ~(440,90) */}
          <circle cx="430" cy="85"  r="1.0" fillOpacity="0.10" />
          <circle cx="448" cy="96"  r="0.6" fillOpacity="0.08" />
          <circle cx="460" cy="82"  r="1.3" fillOpacity="0.07" />
          <circle cx="420" cy="100" r="0.5" fillOpacity="0.09" />
          {/* scattered singles along vein A */}
          <circle cx="80"  cy="444" r="0.8" fillOpacity="0.07" />
          <circle cx="155" cy="318" r="0.6" fillOpacity="0.08" />
          <circle cx="560" cy="102" r="1.0" fillOpacity="0.09" />
          <circle cx="700" cy="62"  r="0.7" fillOpacity="0.07" />
          {/* scattered singles along vein B */}
          <circle cx="220" cy="162" r="0.8" fillOpacity="0.08" />
          <circle cx="670" cy="173" r="1.1" fillOpacity="0.07" />
          <circle cx="880" cy="83"  r="0.6" fillOpacity="0.08" />
          {/* random field dusting */}
          <circle cx="290" cy="530" r="0.5" fillOpacity="0.06" />
          <circle cx="740" cy="400" r="0.7" fillOpacity="0.06" />
          <circle cx="120" cy="240" r="0.5" fillOpacity="0.05" />
          <circle cx="860" cy="200" r="0.6" fillOpacity="0.06" />
          <circle cx="600" cy="480" r="0.8" fillOpacity="0.06" />
        </g>
      </svg>

      {/* Ambient glow — gold tinted, brand-accurate */}
      <div className="absolute inset-0 pointer-events-none">
        <div
          className="absolute rounded-full blur-[160px]"
          style={{ width: 500, height: 500, background: "#1a3060", opacity: 0.5, top: "-15%", left: "-10%" }}
        />
        <div
          className="absolute rounded-full blur-[120px]"
          style={{ width: 320, height: 320, background: "#2a1800", opacity: 0.35, bottom: "0%", right: "-5%" }}
        />
      </div>

      {/*
        Wrapper: paddingTop creates space for the lion above the card.
        Lion center (~42% down the image) aligns to the card top edge.
        260px wide → ~357px tall → center at ~150px.
      */}
      <div className="relative w-full max-w-sm" style={{ paddingTop: "100px" }}>

        {/* Lion-sword medallion — straddling the card top edge */}
        <img
          src="/brain-lion.png"
          alt="Metricadia Brain"
          style={{
            position: "absolute",
            top: 0,
            left: "50%",
            transform: "translateX(-50%)",
            width: "260px",
            height: "auto",
            zIndex: 10,
            pointerEvents: "none",
            filter: "drop-shadow(0 8px 32px rgba(201,162,39,0.35)) drop-shadow(0 2px 8px rgba(0,0,0,0.7))",
          }}
        />

        <div
          className="rounded-2xl px-8 pb-10"
          style={{
            paddingTop: "80px",
            background: "linear-gradient(160deg, rgba(26,44,85,0.97) 0%, rgba(18,30,62,0.99) 100%)",
            border: `1px solid rgba(201,162,39,0.18)`,
            boxShadow: `0 0 0 1px rgba(255,255,255,0.03), 0 32px 80px rgba(0,0,0,0.65), 0 0 60px rgba(201,162,39,0.08)`,
            position: "relative",
            overflow: "hidden",
          }}
        >
          {/* Subtle gold radial glow behind lion insertion point */}
          <div
            style={{
              position: "absolute",
              top: "-30px",
              left: "50%",
              transform: "translateX(-50%)",
              width: "240px",
              height: "160px",
              background: `radial-gradient(ellipse at top, rgba(201,162,39,0.10) 0%, transparent 70%)`,
              pointerEvents: "none",
            }}
          />

          {/* ── Logo section ── */}
          <div className="flex flex-col items-center mb-4 gap-0">
            {/* PsaLogo */}
            <div className="mb-2">
              <PsaLogo variant="white" style={{ fontSize: "1.1rem", letterSpacing: "0.01em" }} />
            </div>

            {/* Gold rule */}
            <div className="w-full h-px mb-3" style={{ background: `linear-gradient(90deg, transparent, ${GOLD}55, transparent)` }} />

            {/* BRAIN V1.0 — ClownBinge Instance */}
            <div className="flex flex-col items-center gap-[3px] select-none">
              <div className="flex items-baseline gap-1.5">
                <span
                  style={{
                    fontFamily: "'Montserrat', system-ui, sans-serif",
                    fontWeight: 700,
                    fontSize: "0.95rem",
                    color: GOLD,
                    letterSpacing: "0.28em",
                    textTransform: "uppercase",
                  }}
                >
                  Brain
                </span>
                <span
                  style={{
                    fontFamily: "'Montserrat', system-ui, sans-serif",
                    fontWeight: 300,
                    fontSize: "0.75rem",
                    color: GOLD,
                    letterSpacing: "0.15em",
                  }}
                >
                  v1.0
                </span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="h-px w-6" style={{ background: "rgba(255,255,255,0.35)" }} />
                <span
                  style={{
                    fontFamily: "'Montserrat', system-ui, sans-serif",
                    fontWeight: 600,
                    fontSize: "0.52rem",
                    color: "#ffffff",
                    letterSpacing: "0.22em",
                    textTransform: "uppercase",
                  }}
                >
                  ClownBinge Instance
                </span>
                <div className="h-px w-6" style={{ background: "rgba(255,255,255,0.35)" }} />
              </div>
            </div>
          </div>

          {/* ── Password form ── */}
          <form onSubmit={handleLogin} className="space-y-3">
            <div className="relative">
              <Lock
                className="absolute left-3.5 top-1/2 -translate-y-1/2 w-[14px] h-[14px] pointer-events-none"
                style={{ color: `${GOLD}80` }}
              />
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => { setPassword(e.target.value); setError(""); }}
                placeholder="Admin passphrase"
                className="w-full pl-10 pr-10 py-[11px] rounded-xl text-sm text-white placeholder:text-slate-500 focus:outline-none transition-all duration-150"
                style={{
                  background: "rgba(201,162,39,0.06)",
                  border: `1px solid ${GOLD}55`,
                  caretColor: GOLD,
                }}
                onFocus={(e) => (e.currentTarget.style.border = `1px solid ${GOLD}cc`)}
                onBlur={(e)  => (e.currentTarget.style.border = `1px solid ${GOLD}55`)}
                data-testid="input-admin-password"
                autoFocus
                autoComplete="current-password"
              />
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 transition-colors"
                style={{ color: `${GOLD}60` }}
                tabIndex={-1}
                data-testid="button-toggle-password"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>

            {error && (
              <p className="text-red-400 text-xs text-center font-semibold" data-testid="text-login-error">
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-[11px] rounded-xl text-sm font-bold tracking-widest uppercase transition-all duration-150 active:scale-[0.98] disabled:opacity-60"
              style={{
                background: `linear-gradient(135deg, #b8891a 0%, ${GOLD} 50%, #b8891a 100%)`,
                color: "#0a1628",
                boxShadow: `0 4px 24px rgba(201,162,39,0.45), inset 0 1px 0 rgba(255,255,255,0.18)`,
                letterSpacing: "0.18em",
              }}
              data-testid="button-admin-login"
            >
              {isLoading ? (
                <span className="flex items-center justify-center gap-2">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Verifying…
                </span>
              ) : (
                "Access Brain"
              )}
            </button>
          </form>

        </div>

        {/* ── Footer — outside the card ── */}
        <p
          className="text-center mt-4 text-[9px] uppercase tracking-[0.22em] select-none"
          style={{ color: `${GOLD}99`, fontFamily: "'Montserrat', system-ui, sans-serif" }}
        >
          Restricted System Access
        </p>
      </div>
    </div>
  );
}
