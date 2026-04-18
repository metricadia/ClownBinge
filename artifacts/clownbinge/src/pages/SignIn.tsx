import { useState } from "react";
import { useLocation } from "wouter";
import { useAuth } from "@/context/AuthContext";
import { Layout } from "@/components/Layout";

const apiBase = import.meta.env.BASE_URL.replace(/\/$/, "");

export default function SignIn() {
  const { refresh } = useAuth();
  const [, setLocation] = useLocation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`${apiBase}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Login failed.");
      await refresh();
      setLocation("/account");
    } catch (err: any) {
      setError(err.message ?? "An error occurred.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <div className="min-h-[70vh] flex items-center justify-center py-16 px-4">
        <div className="w-full max-w-sm">
          <div className="mb-8">
            <p className="text-[11px] font-black uppercase tracking-[0.2em] text-primary/60 mb-1">ClownBinge</p>
            <h1 className="text-3xl font-black text-foreground">Sign In</h1>
            <p className="text-sm text-muted-foreground mt-2">
              Don't have an account?{" "}
              <a href="/sign-up" className="text-primary font-semibold hover:underline">Sign up</a>
            </p>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div>
              <label className="block text-sm font-semibold text-foreground mb-1">Email</label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
                autoFocus
                className="w-full border border-border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 bg-white"
                placeholder="you@example.com"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-foreground mb-1">Password</label>
              <input
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
                className="w-full border border-border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 bg-white"
                placeholder="••••••••"
              />
            </div>

            {error && (
              <p className="text-sm text-red-600 font-semibold">{error}</p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-primary text-white font-black rounded-xl py-2.5 text-sm uppercase tracking-wider hover:bg-primary/90 transition-colors disabled:opacity-60"
            >
              {loading ? "Signing in…" : "Sign In"}
            </button>
          </form>
        </div>
      </div>
    </Layout>
  );
}
