import { useState, useEffect } from "react";
import { Layout } from "@/components/Layout";
import { useActivateSubscription, useSubscription } from "@/hooks/use-subscription";
import { Star, Lock, Check, Mail, Loader2 } from "lucide-react";
import { Link } from "wouter";

const PERKS = [
  "Metricadia ID profiles on every person named in our reporting",
  "CB Factoid citation popups with full source context",
  "Priority access to new investigation tools",
  "Direct support for independent accountability journalism",
];

export default function Subscribe() {
  const { data: status } = useSubscription();
  const [tokenInput, setTokenInput] = useState("");
  const [view, setView] = useState<"pricing" | "activate" | "success" | "activating">("pricing");
  const [successLabel, setSuccessLabel] = useState("");
  const activate = useActivateSubscription();

  // Auto-activate if token is in URL params (e.g., from admin-sent link)
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const urlToken = params.get("token");
    if (urlToken && !status?.isSubscriber) {
      setView("activating");
      activate.mutateAsync(urlToken.trim())
        .then((result) => {
          setSuccessLabel(result.label);
          setView("success");
          window.history.replaceState({}, "", window.location.pathname);
        })
        .catch(() => {
          setTokenInput(urlToken);
          setView("activate");
          window.history.replaceState({}, "", window.location.pathname);
        });
    }
  }, []);

  async function handleActivate(e: React.FormEvent) {
    e.preventDefault();
    try {
      const result = await activate.mutateAsync(tokenInput.trim());
      setSuccessLabel(result.label);
      setView("success");
    } catch {
      // error shown via activate.error
    }
  }

  return (
    <Layout>
      <div className="cb-container py-16 max-w-2xl mx-auto">

        {view === "activating" && (
          <div className="text-center py-20">
            <Loader2 className="w-12 h-12 animate-spin mx-auto mb-4" style={{ color: "#1B3E99" }} />
            <p className="text-gray-600">Activating your membership...</p>
          </div>
        )}

        {view === "pricing" && (
          <>
            {status?.isSubscriber ? (
              <div className="text-center py-12">
                <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-5" style={{ background: "#EEF2FF" }}>
                  <Star className="w-8 h-8 fill-amber-400 text-amber-500" />
                </div>
                <h1 className="font-sans font-bold text-3xl text-gray-900 mb-3">You're a Supporting Member</h1>
                <p className="text-gray-600 mb-6">Your subscription is active. All interactive tools are unlocked.</p>
                <Link href="/" className="inline-flex items-center gap-2 font-bold text-sm px-5 py-2.5 rounded-lg text-white" style={{ background: "#1B3E99" }}>
                  Back to Archives
                </Link>
              </div>
            ) : (
              <>
                <div className="text-center mb-10">
                  <p className="font-mono text-xs font-bold uppercase tracking-widest mb-3" style={{ color: "#1B3E99" }}>
                    Independent Accountability Journalism
                  </p>
                  <h1 className="font-sans font-bold text-4xl text-gray-900 mb-4 leading-tight">
                    Become a Supporting Member
                  </h1>
                  <p className="text-gray-600 text-lg max-w-lg mx-auto">
                    Every article stays free to read. Membership unlocks the research tools that make ClownBinge more than just headlines.
                  </p>
                </div>

                <div className="border-2 rounded-2xl overflow-hidden mb-8" style={{ borderColor: "#1B3E99" }}>
                  <div className="px-8 py-5 text-white" style={{ background: "#1B3E99" }}>
                    <div className="flex items-baseline gap-2">
                      <span className="font-bold text-4xl">$9</span>
                      <span className="text-blue-200 text-lg">/month</span>
                    </div>
                    <p className="text-blue-200 text-sm mt-1">Supporting Member</p>
                  </div>
                  <div className="bg-white px-8 py-6">
                    <ul className="space-y-3 mb-7">
                      {PERKS.map((p) => (
                        <li key={p} className="flex items-start gap-3 text-gray-700 text-sm">
                          <Check className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                          {p}
                        </li>
                      ))}
                    </ul>

                    <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-6">
                      <div className="flex items-center gap-2 mb-1">
                        <Lock className="w-4 h-4 text-amber-600 flex-shrink-0" />
                        <span className="font-bold text-sm text-amber-900">SEO stays open</span>
                      </div>
                      <p className="text-xs text-amber-700 leading-relaxed">
                        All article text is always free and publicly indexed. Only the interactive research popups (Metricadia IDs and Factoids) are member-only.
                      </p>
                    </div>

                    <a
                      href="mailto:clownbinge@metricadia.com?subject=Supporting%20Member%20Subscription"
                      className="flex items-center justify-center gap-2 w-full py-3 rounded-xl font-bold text-sm transition-colors text-white mb-3"
                      style={{ background: "#1B3E99" }}
                    >
                      <Mail className="w-4 h-4" />
                      Subscribe via Email
                    </a>
                    <p className="text-center text-xs text-gray-500">
                      Email us to subscribe. We'll send your access token within 24 hours.
                    </p>
                  </div>
                </div>

                <div className="text-center">
                  <button
                    onClick={() => setView("activate")}
                    className="text-sm underline underline-offset-2 text-gray-500 hover:text-gray-800"
                  >
                    Already subscribed? Activate your access token
                  </button>
                </div>
              </>
            )}
          </>
        )}

        {view === "activate" && (
          <div className="max-w-md mx-auto">
            <button
              onClick={() => setView("pricing")}
              className="text-xs text-gray-400 hover:text-gray-700 mb-6 flex items-center gap-1"
            >
              &#8592; Back
            </button>
            <h2 className="font-sans font-bold text-2xl text-gray-900 mb-2">Activate Your Membership</h2>
            <p className="text-gray-600 text-sm mb-7">
              Paste the access token from your welcome email. This unlocks Metricadia IDs and Factoid popups for one year across this browser.
            </p>
            <form onSubmit={handleActivate} className="space-y-4">
              <input
                type="text"
                value={tokenInput}
                onChange={(e) => setTokenInput(e.target.value)}
                placeholder="Paste your access token..."
                className="w-full border border-gray-300 rounded-xl px-4 py-3 text-sm font-mono focus:outline-none focus:ring-2"
                autoFocus
              />
              {activate.error && (
                <p className="text-red-600 text-sm">{(activate.error as Error).message}</p>
              )}
              <button
                type="submit"
                disabled={!tokenInput.trim() || activate.isPending}
                className="w-full py-3 rounded-xl font-bold text-sm text-white transition-colors disabled:opacity-50"
                style={{ background: "#1B3E99" }}
              >
                {activate.isPending ? "Activating..." : "Activate Membership"}
              </button>
            </form>
          </div>
        )}

        {view === "success" && (
          <div className="text-center py-12">
            <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-5" style={{ background: "#F0FDF4" }}>
              <Star className="w-8 h-8 text-green-600 fill-green-500" />
            </div>
            <h1 className="font-sans font-bold text-3xl text-gray-900 mb-3">Welcome, Supporting Member!</h1>
            {successLabel && (
              <p className="text-gray-600 mb-2">Access granted for: <strong>{successLabel}</strong></p>
            )}
            <p className="text-gray-500 text-sm mb-8">
              Your membership is now active on this browser. Metricadia ID profiles and CB Factoid popups are unlocked across all articles.
            </p>
            <Link href="/" className="inline-flex items-center gap-2 font-bold text-sm px-6 py-3 rounded-xl text-white" style={{ background: "#1B3E99" }}>
              Explore the Archives
            </Link>
          </div>
        )}
      </div>
    </Layout>
  );
}
