import { useState, useEffect, useRef } from "react";
import { Layout } from "@/components/Layout";
import { Send, AlertCircle, CheckCircle2, Loader2, FileText, ExternalLink } from "lucide-react";

const TURNSTILE_SITE_KEY = import.meta.env.VITE_TURNSTILE_SITE_KEY ?? "1x00000000000000000000AA";

declare global {
  interface Window {
    turnstile?: {
      render: (el: HTMLElement, options: { sitekey: string; callback: (token: string) => void; "expired-callback": () => void }) => string;
      reset: (widgetId: string) => void;
    };
  }
}

function TurnstileWidget({ onToken, onExpire }: { onToken: (t: string) => void; onExpire: () => void }) {
  const ref = useRef<HTMLDivElement>(null);
  const widgetId = useRef<string | null>(null);

  useEffect(() => {
    function mount() {
      if (ref.current && window.turnstile && !widgetId.current) {
        widgetId.current = window.turnstile.render(ref.current, {
          sitekey: TURNSTILE_SITE_KEY,
          callback: onToken,
          "expired-callback": onExpire,
        });
      }
    }

    if (window.turnstile) {
      mount();
      return;
    }

    const existing = document.querySelector('script[data-turnstile]');
    if (!existing) {
      const script = document.createElement("script");
      script.src = "https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit";
      script.setAttribute("data-turnstile", "1");
      script.async = true;
      script.onload = mount;
      document.head.appendChild(script);
    } else {
      const interval = setInterval(() => {
        if (window.turnstile) {
          clearInterval(interval);
          mount();
        }
      }, 100);
      return () => clearInterval(interval);
    }
  }, []);

  return <div ref={ref} className="mt-2" />;
}

export default function SubmitTip() {
  const [form, setForm] = useState({
    submitterName: "",
    submitterEmail: "",
    subjectName: "",
    subjectTitle: "",
    category: "" as string,
    incidentDescription: "",
    sourceUrl: "",
  });
  const [captchaToken, setCaptchaToken] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState<{ success: boolean; message: string } | null>(null);
  const [error, setError] = useState<string | null>(null);

  function set(field: string, value: string) {
    setForm(f => ({ ...f, [field]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!captchaToken) {
      setError("Please complete the CAPTCHA before submitting.");
      return;
    }
    setSubmitting(true);
    setError(null);

    try {
      const BASE = import.meta.env.BASE_URL.replace(/\/$/, "");
      const resp = await fetch(`${BASE}/api/tips`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, captchaToken }),
      });
      const data = await resp.json() as { success?: boolean; message?: string; error?: string };
      if (resp.ok && data.success) {
        setResult({ success: true, message: data.message ?? "Tip received." });
      } else {
        setError(data.error ?? "Submission failed. Please try again.");
      }
    } catch {
      setError("Network error. Please check your connection and try again.");
    } finally {
      setSubmitting(false);
    }
  }

  if (result?.success) {
    return (
      <Layout>
        <div className="max-w-2xl mx-auto px-4 py-16 text-center">
          <CheckCircle2 className="w-16 h-16 text-green-600 mx-auto mb-6" />
          <h1 className="font-bold text-2xl sm:text-3xl text-header mb-4">Tip Received</h1>
          <p className="text-muted-foreground text-lg leading-relaxed mb-8">{result.message}</p>
          <a href="/" className="inline-block px-6 py-3 bg-primary text-white font-bold rounded-lg hover:bg-primary/90 transition-colors">
            Back to the Feed
          </a>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="max-w-2xl mx-auto px-4 py-12">

        <div className="mb-10">
          <p className="text-xs font-semibold tracking-widest uppercase text-primary mb-3">Got Receipts?</p>
          <h1 className="font-sans font-bold text-3xl sm:text-4xl text-header leading-tight mb-4">
            Submit a Post
          </h1>
          <p className="text-muted-foreground text-sm">
            ClownBinge &mdash; Verified accountability journalism &mdash; Primary sources only
          </p>
          <div className="h-1 w-full bg-[#F5C518] rounded-full mt-6" />
        </div>

        <div className="bg-muted/50 border border-border rounded-xl p-5 mb-8 text-sm text-muted-foreground leading-relaxed space-y-2">
          <div className="flex items-start gap-2">
            <FileText className="w-4 h-4 text-primary shrink-0 mt-0.5" />
            <p>We document <strong className="text-foreground">real, verifiable incidents</strong> where politicians or religious leaders contradict their own documented words, votes, or stated values.</p>
          </div>
          <div className="flex items-start gap-2">
            <ExternalLink className="w-4 h-4 text-primary shrink-0 mt-0.5" />
            <p>A <strong className="text-foreground">primary source URL</strong> (news article, official record, video) dramatically increases your tip's chance of publication.</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">

          <fieldset className="border border-border rounded-xl p-6 space-y-4">
            <legend className="text-xs font-bold uppercase tracking-widest text-muted-foreground px-2">About the Subject</legend>

            <div>
              <label className="block text-sm font-semibold text-foreground mb-1.5">Subject's Full Name <span className="text-pink-600">*</span></label>
              <input
                type="text"
                required
                value={form.subjectName}
                onChange={e => set("subjectName", e.target.value)}
                placeholder="e.g. Rep. John Smith"
                className="w-full border border-border rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 bg-background"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-foreground mb-1.5">Their Title / Role</label>
              <input
                type="text"
                value={form.subjectTitle}
                onChange={e => set("subjectTitle", e.target.value)}
                placeholder="e.g. U.S. Representative, Pastor, Senator"
                className="w-full border border-border rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 bg-background"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-foreground mb-1.5">Category</label>
              <select
                value={form.category}
                onChange={e => set("category", e.target.value)}
                className="w-full border border-border rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 bg-background"
              >
                <option value="">Select a category</option>
                <option value="self_owned">Self-Owned</option>
                <option value="law_and_justice">Law &amp; Justice Files</option>
                <option value="money_and_power">Money &amp; Power</option>
                <option value="us_constitution">U.S. Constitution</option>
                <option value="women_and_girls">Women &amp; Girls</option>
                <option value="anti_racist_heroes">Anti-Racist Heroes</option>
                <option value="us_history">U.S. History</option>
                <option value="religion">Religion</option>
                <option value="investigations">Investigations</option>
                <option value="war_and_inhumanity">War &amp; Inhumanity</option>
                <option value="health_and_healing">Health &amp; Healing</option>
                <option value="technology">Technology</option>
                <option value="censorship">Censorship</option>
                <option value="global_south">Global South</option>
                <option value="how_it_works">How It Works</option>
                <option value="nerd_out">NerdOut</option>
              </select>
            </div>
          </fieldset>

          <fieldset className="border border-border rounded-xl p-6 space-y-4">
            <legend className="text-xs font-bold uppercase tracking-widest text-muted-foreground px-2">The Incident</legend>

            <div>
              <label className="block text-sm font-semibold text-foreground mb-1.5">
                What happened? <span className="text-pink-600">*</span>
                <span className="text-xs font-normal text-muted-foreground ml-2">(minimum 50 characters)</span>
              </label>
              <textarea
                required
                minLength={50}
                maxLength={5000}
                value={form.incidentDescription}
                onChange={e => set("incidentDescription", e.target.value)}
                rows={6}
                placeholder="Describe the incident in detail. What did they say or do? What does it contradict? When did it happen?"
                className="w-full border border-border rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 bg-background resize-y"
              />
              <p className="text-xs text-muted-foreground mt-1 text-right">{form.incidentDescription.length} / 5000</p>
            </div>

            <div>
              <label className="block text-sm font-semibold text-foreground mb-1.5">Primary Source URL</label>
              <input
                type="url"
                value={form.sourceUrl}
                onChange={e => set("sourceUrl", e.target.value)}
                placeholder="https://..."
                className="w-full border border-border rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 bg-background"
              />
              <p className="text-xs text-muted-foreground mt-1">Link to a news article, official record, video, or government document.</p>
            </div>
          </fieldset>

          <fieldset className="border border-border rounded-xl p-6 space-y-4">
            <legend className="text-xs font-bold uppercase tracking-widest text-muted-foreground px-2">Your Info (Optional)</legend>
            <p className="text-xs text-muted-foreground">Anonymous tips are accepted. If you provide your email we may follow up for more details.</p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-foreground mb-1.5">Your Name</label>
                <input
                  type="text"
                  value={form.submitterName}
                  onChange={e => set("submitterName", e.target.value)}
                  placeholder="Optional"
                  className="w-full border border-border rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 bg-background"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-foreground mb-1.5">Your Email</label>
                <input
                  type="email"
                  value={form.submitterEmail}
                  onChange={e => set("submitterEmail", e.target.value)}
                  placeholder="Optional"
                  className="w-full border border-border rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 bg-background"
                />
              </div>
            </div>
          </fieldset>

          <div>
            <label className="block text-sm font-semibold text-foreground mb-1.5">Verification <span className="text-pink-600">*</span></label>
            <TurnstileWidget
              onToken={setCaptchaToken}
              onExpire={() => setCaptchaToken(null)}
            />
            {!captchaToken && (
              <p className="text-xs text-muted-foreground mt-2">Complete the security check above to submit.</p>
            )}
          </div>

          {error && (
            <div className="flex items-start gap-2 bg-red-50 border border-red-200 rounded-lg p-4 text-red-700 text-sm">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <p>{error}</p>
            </div>
          )}

          <button
            type="submit"
            disabled={submitting || !captchaToken}
            className="w-full flex items-center justify-center gap-2 bg-primary hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold py-3 px-6 rounded-lg transition-colors text-base"
          >
            {submitting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Submitting...
              </>
            ) : (
              <>
                <Send className="w-4 h-4" />
                Submit Post
              </>
            )}
          </button>

          <p className="text-xs text-muted-foreground text-center leading-relaxed">
            All submissions are reviewed by our editorial team. We do not publish tips that cannot be verified against primary sources.
            Your submission is filtered by AI before reaching our editors. Spam and bad-faith submissions are automatically discarded.
          </p>
        </form>
      </div>
    </Layout>
  );
}
