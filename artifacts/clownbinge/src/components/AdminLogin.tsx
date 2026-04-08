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
      className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden"
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

      <div className="relative w-full max-w-sm">
        <div
          className="rounded-2xl px-8 py-10"
          style={{
            background: "linear-gradient(160deg, rgba(16,28,58,0.96) 0%, rgba(10,18,40,0.99) 100%)",
            border: `1px solid rgba(201,162,39,0.18)`,
            boxShadow: `0 0 0 1px rgba(255,255,255,0.03), 0 32px 80px rgba(0,0,0,0.65), 0 0 60px rgba(201,162,39,0.05)`,
          }}
        >
          {/* ── Logo section ── */}
          <div className="flex flex-col items-center mb-9 gap-0">
            {/* PsaLogo — white variant, larger */}
            <div className="mb-2">
              <PsaLogo variant="white" style={{ fontSize: "1.25rem", letterSpacing: "0.01em" }} />
            </div>

            {/* Flags */}
            <div className="flex items-center gap-1.5 mb-3">
              <span title="Saint Kitts and Nevis" className="text-base leading-none select-none">🇰🇳</span>
              <span title="United States"          className="text-base leading-none select-none">🇺🇸</span>
              <span title="Iceland"                className="text-base leading-none select-none">🇮🇸</span>
            </div>

            {/* Gold rule */}
            <div className="w-full h-px mb-4" style={{ background: `linear-gradient(90deg, transparent, ${GOLD}55, transparent)` }} />

            {/* brain v1.0 */}
            <p
              className="tracking-widest select-none"
              style={{
                fontFamily: "'Montserrat', 'Inter', system-ui, sans-serif",
                fontWeight: 300,
                fontSize: "0.82rem",
                color: GOLD,
                letterSpacing: "0.28em",
                textTransform: "uppercase",
              }}
            >
              brain v1.0
            </p>
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
                className="w-full pl-10 pr-10 py-[11px] rounded-xl text-sm text-white placeholder:text-slate-600 focus:outline-none transition-all duration-150"
                style={{
                  background: "rgba(255,255,255,0.04)",
                  border: "1px solid rgba(255,255,255,0.08)",
                  caretColor: GOLD,
                }}
                onFocus={(e) => (e.currentTarget.style.border = `1px solid ${GOLD}66`)}
                onBlur={(e)  => (e.currentTarget.style.border = "1px solid rgba(255,255,255,0.08)")}
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
              disabled={isLoading || !password.trim()}
              className="w-full py-[11px] rounded-xl text-sm font-bold tracking-widest uppercase transition-all duration-150 active:scale-[0.98] disabled:opacity-40 disabled:cursor-not-allowed"
              style={{
                background: `linear-gradient(135deg, #b8891a 0%, ${GOLD} 50%, #b8891a 100%)`,
                color: "#0a1628",
                boxShadow: `0 4px 20px rgba(201,162,39,0.3), inset 0 1px 0 rgba(255,255,255,0.15)`,
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

          {/* ── Footer ── */}
          <div
            className="mt-8 pt-5 text-center"
            style={{ borderTop: "1px solid rgba(201,162,39,0.10)" }}
          >
            <p
              className="text-[9px] uppercase tracking-[0.22em]"
              style={{ color: `${GOLD}55`, fontFamily: "'Montserrat', system-ui, sans-serif" }}
            >
              Restricted System Access
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
