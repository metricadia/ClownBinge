import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 flex items-center justify-center p-4">
      <div
        className="w-full max-w-sm bg-gradient-to-br from-slate-900 to-slate-950 rounded-2xl p-8 shadow-2xl"
        style={{ border: "1px solid rgba(99, 102, 241, 0.3)", boxShadow: "0 0 60px rgba(99, 102, 241, 0.1)" }}
      >
        {/* Logo mark */}
        <div className="flex flex-col items-center mb-8 gap-3">
          <div
            className="w-16 h-16 rounded-2xl flex items-center justify-center text-3xl font-black text-white shadow-xl"
            style={{ background: "linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)" }}
          >
            M
          </div>
          <div className="text-center">
            <h1 className="text-2xl font-black text-white tracking-tight">Metricadia Editor</h1>
            <p className="text-slate-400 text-sm mt-0.5 tracking-wide uppercase text-xs font-semibold">
              Admin Access
            </p>
          </div>
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
            <Input
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                setError("");
              }}
              placeholder="Enter admin password"
              className="pl-10 pr-10 bg-slate-950 border-slate-700 text-white placeholder:text-slate-600 focus:border-indigo-500 focus:ring-indigo-500/20"
              data-testid="input-admin-password"
              autoFocus
              autoComplete="current-password"
            />
            <button
              type="button"
              onClick={() => setShowPassword((v) => !v)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors"
              data-testid="button-toggle-password"
              tabIndex={-1}
            >
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>

          {error && (
            <p className="text-red-400 text-sm text-center font-medium" data-testid="text-login-error">
              {error}
            </p>
          )}

          <Button
            type="submit"
            disabled={isLoading || !password.trim()}
            className="w-full font-bold text-white shadow-lg"
            style={{
              background: "linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)",
              border: "none",
            }}
            data-testid="button-admin-login"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Verifying...
              </>
            ) : (
              "Enter Editor"
            )}
          </Button>
        </form>

        <p className="text-center text-slate-600 text-xs mt-6">
          Metricadia Editor &mdash; Restricted Access
        </p>
      </div>
    </div>
  );
}
