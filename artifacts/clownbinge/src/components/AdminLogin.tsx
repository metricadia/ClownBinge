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

        {/* ── VEIN A — full width, lower-left → upper-right ── */}
        <path d="M -10 510 C 60 470, 50 380, 150 330 C 240 285, 340 355, 420 305 C 500 255, 458 145, 558 105 C 625 75, 698 115, 768 68 C 840 22, 920 40, 1010 15"
          fill="none" stroke="#C8A230" strokeWidth="18" strokeOpacity="0.025" />
        <path d="M -10 510 C 60 470, 50 380, 150 330 C 240 285, 340 355, 420 305 C 500 255, 458 145, 558 105 C 625 75, 698 115, 768 68 C 840 22, 920 40, 1010 15"
          fill="none" stroke="#D4A832" strokeWidth="5" strokeOpacity="0.055" />
        <path d="M -10 510 C 60 470, 50 380, 150 330 C 240 285, 340 355, 420 305 C 500 255, 458 145, 558 105 C 625 75, 698 115, 768 68 C 840 22, 920 40, 1010 15"
          fill="none" stroke="#F0D070" strokeWidth="1.0" strokeOpacity="0.18" filter="url(#vein-glow)" />

        {/* ── VEIN B — full width, upper meandering ── */}
        <path d="M -10 145 C 90 125, 125 185, 218 168 C 308 152, 328 72, 438 92 C 538 110, 558 192, 668 178 C 758 164, 798 92, 918 82 C 962 78, 995 92, 1010 88"
          fill="none" stroke="#C8A230" strokeWidth="14" strokeOpacity="0.022" />
        <path d="M -10 145 C 90 125, 125 185, 218 168 C 308 152, 328 72, 438 92 C 538 110, 558 192, 668 178 C 758 164, 798 92, 918 82 C 962 78, 995 92, 1010 88"
          fill="none" stroke="#D4A832" strokeWidth="4" strokeOpacity="0.050" />
        <path d="M -10 145 C 90 125, 125 185, 218 168 C 308 152, 328 72, 438 92 C 538 110, 558 192, 668 178 C 758 164, 798 92, 918 82 C 962 78, 995 92, 1010 88"
          fill="none" stroke="#F0D070" strokeWidth="0.8" strokeOpacity="0.15" filter="url(#vein-glow)" />

        {/* ── VEIN C — full width fork, left edge → right edge ── */}
        <path d="M -10 365 C 60 345, 118 334, 150 320 C 182 292, 232 302, 272 272 C 312 242, 312 182, 372 162 C 422 144, 482 162, 522 142 C 590 115, 660 130, 740 110 C 820 90, 900 105, 1010 90"
          fill="none" stroke="#D4A832" strokeWidth="3" strokeOpacity="0.04" />
        <path d="M -10 365 C 60 345, 118 334, 150 320 C 182 292, 232 302, 272 272 C 312 242, 312 182, 372 162 C 422 144, 482 162, 522 142 C 590 115, 660 130, 740 110 C 820 90, 900 105, 1010 90"
          fill="none" stroke="#F0D070" strokeWidth="0.6" strokeOpacity="0.13" filter="url(#vein-glow)" />

        {/* ── VEIN D — full width, lower wandering ── */}
        <path d="M 1010 505 C 928 472, 882 532, 802 512 C 722 492, 702 422, 622 402 C 542 382, 502 442, 422 432 C 362 424, 332 372, 272 382 C 200 394, 140 360, 60 375 C 20 382, -10 372, -10 372"
          fill="none" stroke="#C8A230" strokeWidth="12" strokeOpacity="0.020" />
        <path d="M 1010 505 C 928 472, 882 532, 802 512 C 722 492, 702 422, 622 402 C 542 382, 502 442, 422 432 C 362 424, 332 372, 272 382 C 200 394, 140 360, 60 375 C 20 382, -10 372, -10 372"
          fill="none" stroke="#D4A832" strokeWidth="3.5" strokeOpacity="0.045" />
        <path d="M 1010 505 C 928 472, 882 532, 802 512 C 722 492, 702 422, 622 402 C 542 382, 502 442, 422 432 C 362 424, 332 372, 272 382 C 200 394, 140 360, 60 375 C 20 382, -10 372, -10 372"
          fill="none" stroke="#F0D070" strokeWidth="0.7" strokeOpacity="0.14" filter="url(#vein-glow)" />

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
