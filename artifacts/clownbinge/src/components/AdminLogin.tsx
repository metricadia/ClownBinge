import { useState } from "react";
import { Lock, Eye, EyeOff, Loader2 } from "lucide-react";

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
      style={{ background: "linear-gradient(160deg, #05090f 0%, #0a1020 50%, #080d1a 100%)" }}
    >
      {/* Ambient glow */}
      <div className="absolute inset-0 pointer-events-none select-none">
        <div
          className="absolute rounded-full blur-[140px] opacity-[0.18]"
          style={{ width: 560, height: 560, background: "#1e3a8a", top: "-15%", left: "-12%" }}
        />
        <div
          className="absolute rounded-full blur-[110px] opacity-[0.10]"
          style={{ width: 400, height: 400, background: "#312e81", bottom: "0%", right: "-5%" }}
        />
      </div>

      <div className="relative w-full max-w-sm">
        <div
          className="rounded-3xl px-8 py-10"
          style={{
            background: "linear-gradient(145deg, rgba(14,19,40,0.97) 0%, rgba(9,13,26,0.99) 100%)",
            border: "1px solid rgba(99,102,241,0.18)",
            boxShadow: "0 0 0 1px rgba(255,255,255,0.025), 0 32px 80px rgba(0,0,0,0.7), 0 0 100px rgba(79,70,229,0.07)",
          }}
        >
          {/* Logo + brand */}
          <div className="flex flex-col items-center mb-9">
            {/* Icon mark */}
            <div
              className="w-[72px] h-[72px] rounded-[20px] flex items-center justify-center mb-5 relative"
              style={{
                background: "linear-gradient(150deg, #1a2d5e 0%, #0f1a36 100%)",
                border: "1px solid rgba(99,102,241,0.30)",
                boxShadow: "0 0 40px rgba(79,70,229,0.22), inset 0 1px 0 rgba(255,255,255,0.07)",
              }}
            >
              <span
                className="text-[26px] font-black text-white select-none"
                style={{ letterSpacing: "-0.02em", fontFamily: "system-ui, sans-serif" }}
              >
                M
              </span>
              <span
                className="absolute bottom-[7px] right-[7px] w-[7px] h-[7px] rounded-full"
                style={{ background: "linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)" }}
              />
            </div>

            {/* Name */}
            <h1
              className="text-[1.7rem] font-black text-white leading-none tracking-tight mb-1"
              style={{ fontFamily: "system-ui, sans-serif" }}
            >
              Metricadia Brain
              <sup className="text-[0.55rem] font-black text-indigo-400 align-super ml-0.5 tracking-normal">™</sup>
            </h1>

            {/* Flags */}
            <div className="flex items-center gap-1.5 mt-2.5 mb-2">
              <span title="Saint Kitts and Nevis" className="text-[1.1rem] leading-none select-none">🇰🇳</span>
              <span title="United States"          className="text-[1.1rem] leading-none select-none">🇺🇸</span>
              <span title="Iceland"                className="text-[1.1rem] leading-none select-none">🇮🇸</span>
            </div>

            <p className="text-[9.5px] font-bold text-slate-600 uppercase tracking-[0.2em] mt-1">
              Restricted System Access
            </p>
          </div>

          {/* Password form */}
          <form onSubmit={handleLogin} className="space-y-3">
            <div className="relative">
              <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-[15px] h-[15px] text-slate-600 pointer-events-none" />
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => { setPassword(e.target.value); setError(""); }}
                placeholder="Admin passphrase"
                className="w-full pl-10 pr-10 py-[11px] rounded-xl text-sm text-white placeholder:text-slate-700 focus:outline-none transition-all duration-150"
                style={{
                  background: "rgba(255,255,255,0.035)",
                  border: "1px solid rgba(255,255,255,0.07)",
                  caretColor: "#6366f1",
                }}
                onFocus={(e) => (e.currentTarget.style.border = "1px solid rgba(99,102,241,0.45)")}
                onBlur={(e)  => (e.currentTarget.style.border = "1px solid rgba(255,255,255,0.07)")}
                data-testid="input-admin-password"
                autoFocus
                autoComplete="current-password"
              />
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-600 hover:text-slate-300 transition-colors"
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
              className="w-full py-[11px] rounded-xl text-sm font-black text-white tracking-wide transition-all duration-150 active:scale-[0.98] disabled:opacity-40 disabled:cursor-not-allowed"
              style={{
                background: "linear-gradient(135deg, #4338ca 0%, #5b21b6 100%)",
                boxShadow: "0 4px 20px rgba(67,56,202,0.4), inset 0 1px 0 rgba(255,255,255,0.08)",
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

          {/* Footer */}
          <div className="mt-8 pt-5 border-t border-white/[0.04] text-center">
            <p className="text-[10px] font-bold text-slate-600 tracking-widest uppercase">ClownBinge</p>
            <p className="text-[9px] text-slate-700 tracking-wide mt-0.5">Metricadia Research LLC</p>
          </div>
        </div>
      </div>
    </div>
  );
}
