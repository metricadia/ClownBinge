import { useState } from "react";
import { useLocation } from "wouter";
import { useAuth } from "@/context/AuthContext";
import { Layout } from "@/components/Layout";

const apiBase = import.meta.env.BASE_URL.replace(/\/$/, "");

export default function SignUp() {
  const { refresh } = useAuth();
  const [, setLocation] = useLocation();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`${apiBase}/api/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ email, password, name }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Registration failed.");
      await refresh();
      setDone(true);
    } catch (err: any) {
      setError(err.message ?? "An error occurred.");
    } finally {
      setLoading(false);
    }
  };

  if (done) {
    return (
      <Layout>
        <div className="min-h-[70vh] flex items-center justify-center py-16 px-4">
          <div className="w-full max-w-sm text-center">
            <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h2 className="text-2xl font-black text-foreground mb-2">Account created!</h2>
            <p className="text-sm text-muted-foreground mb-6">
              Check your email to verify your address. You can browse ClownBinge in the meantime.
            </p>
            <button
              onClick={() => setLocation("/account")}
              className="bg-primary text-white font-black rounded-xl px-6 py-2.5 text-sm uppercase tracking-wider hover:bg-primary/90 transition-colors"
            >
              Go to My Account
            </button>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="min-h-[70vh] flex items-center justify-center py-16 px-4">
        <div className="w-full max-w-sm">
          <div className="mb-8">
            <p className="text-[11px] font-black uppercase tracking-[0.2em] text-primary/60 mb-1">ClownBinge</p>
            <h1 className="text-3xl font-black text-foreground">Create Account</h1>
            <p className="text-sm text-muted-foreground mt-2">
              Already have an account?{" "}
              <a href="/sign-in" className="text-primary font-semibold hover:underline">Sign in</a>
            </p>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div>
              <label className="block text-sm font-semibold text-foreground mb-1">Name <span className="text-muted-foreground font-normal">(optional)</span></label>
              <input
                type="text"
                value={name}
                onChange={e => setName(e.target.value)}
                className="w-full border border-border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 bg-white"
                placeholder="Your name"
              />
            </div>
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
                minLength={8}
                className="w-full border border-border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 bg-white"
                placeholder="8+ characters"
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
              {loading ? "Creating account…" : "Create Account"}
            </button>

            <p className="text-xs text-muted-foreground text-center">
              By signing up you agree to our{" "}
              <a href="/terms" className="underline">Terms</a> and{" "}
              <a href="/privacy" className="underline">Privacy Policy</a>.
            </p>
          </form>
        </div>
      </div>
    </Layout>
  );
}
