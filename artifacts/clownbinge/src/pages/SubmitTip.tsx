import { useState, useEffect, useRef } from "react";
import { Layout } from "@/components/Layout";
import { AdminPageHeader } from "@/components/AdminPageHeader";
import { Send, AlertCircle, CheckCircle2, Loader2, Link2, Zap } from "lucide-react";

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
    if (window.turnstile) { mount(); return; }
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
        if (window.turnstile) { clearInterval(interval); mount(); }
      }, 100);
      return () => clearInterval(interval);
    }
  }, []);

  return <div ref={ref} className="mt-2" />;
}

const inputCls = "w-full border-2 border-border rounded-xl px-4 py-3 text-sm font-medium focus:outline-none focus:border-[#1A3A8F] bg-white transition-colors placeholder:text-muted-foreground/60";
const labelCls = "block text-sm font-bold text-foreground mb-1.5 tracking-tight";

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
    if (!captchaToken) { setError("Please complete the security check below."); return; }
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
      setError("Network error. Check your connection and try again.");
    } finally {
      setSubmitting(false);
    }
  }

  if (result?.success) {
    return (
      <Layout>
        <div className="max-w-xl mx-auto px-4 py-20 text-center">
          <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 className="w-10 h-10 text-green-600" />
          </div>
          <h1 className="font-black text-3xl text-[#1A3A8F] mb-3">Receipts Received.</h1>
          <p className="text-muted-foreground text-base leading-relaxed mb-8 max-w-sm mx-auto">{result.message}</p>
          <a href="/" className="inline-flex items-center gap-2 px-6 py-3 bg-[#1A3A8F] text-white font-bold rounded-xl hover:bg-[#1A3A8F]/90 transition-colors">
            Back to the Feed
          </a>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>

      <div className="max-w-3xl mx-auto px-4 py-12">
        <AdminPageHeader title="Submit a Post" />
      </div>

      {/* Hero Header */}
      <div className="bg-[#1A3A8F] text-white">
        <div className="max-w-2xl mx-auto px-4 py-10 sm:py-14">
          <div className="inline-flex items-center gap-2 bg-[#F5C518] text-[#1A3A8F] text-xs font-black uppercase tracking-widest px-3 py-1.5 rounded-full mb-5">
            <Zap className="w-3.5 h-3.5" />
            Got Receipts?
          </div>
          <h1 className="font-black text-3xl sm:text-4xl lg:text-5xl leading-tight mb-4">
            Submit a <span className="text-[#F5C518]">Post</span>
          </h1>
          <p className="text-white/75 text-sm sm:text-base max-w-lg leading-relaxed">
            ClownBinge runs on primary sources. If you have a verifiable incident where a public figure contradicted their own documented record, we want it.
          </p>
          <div className="mt-6 flex flex-wrap gap-4 text-xs font-bold text-white/60 uppercase tracking-wider">
            <span>Independent</span>
            <span className="text-[#F5C518]">|</span>
            <span>Verified</span>
            <span className="text-[#F5C518]">|</span>
            <span>The Primary Source</span>
          </div>
        </div>
      </div>

      {/* Source tip banner */}
      <div className="bg-[#F5C518]/15 border-b border-[#F5C518]/30">
        <div className="max-w-2xl mx-auto px-4 py-3 flex items-start gap-2.5">
          <Link2 className="w-4 h-4 text-[#C9980A] shrink-0 mt-0.5" />
          <p className="text-xs font-semibold text-[#7A5C00] leading-snug">
            A primary source URL (news article, official record, court document, video) dramatically increases your tip's chance of publication.
          </p>
        </div>
      </div>

      {/* Form */}
      <div className="max-w-2xl mx-auto px-4 py-10">
        <form onSubmit={handleSubmit} className="space-y-5">

          {/* Section: The Subject */}
          <div className="bg-white border-2 border-border rounded-2xl overflow-hidden shadow-sm">
            <div className="px-5 py-3 bg-muted/50 border-b border-border">
              <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Who did what</p>
            </div>
            <div className="p-5 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className={labelCls}>
                    Subject's Full Name <span className="text-[#FF0099]">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={form.subjectName}
                    onChange={e => set("subjectName", e.target.value)}
                    placeholder="Rep. John Smith"
                    className={inputCls}
                  />
                </div>
                <div>
                  <label className={labelCls}>Their Title / Role</label>
                  <input
                    type="text"
                    value={form.subjectTitle}
                    onChange={e => set("subjectTitle", e.target.value)}
                    placeholder="U.S. Representative, Pastor..."
                    className={inputCls}
                  />
                </div>
              </div>
              <div>
                <label className={labelCls}>Category</label>
                <select
                  value={form.category}
                  onChange={e => set("category", e.target.value)}
                  className={inputCls}
                >
                  <option value="">Select the best fit</option>
                  <option value="self_owned">Self-Owned</option>
                  <option value="law_and_justice">Law &amp; Justice</option>
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
            </div>
          </div>

          {/* Section: The Incident */}
          <div className="bg-white border-2 border-border rounded-2xl overflow-hidden shadow-sm">
            <div className="px-5 py-3 bg-muted/50 border-b border-border">
              <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">The receipts</p>
            </div>
            <div className="p-5 space-y-4">
              <div>
                <label className={labelCls}>
                  What happened? <span className="text-[#FF0099]">*</span>
                </label>
                <textarea
                  required
                  minLength={50}
                  maxLength={5000}
                  value={form.incidentDescription}
                  onChange={e => set("incidentDescription", e.target.value)}
                  rows={5}
                  placeholder="What did they say or do? What does it contradict on the record? When and where did it happen? The more specific, the better."
                  className={`${inputCls} resize-y`}
                />
                <div className="flex justify-between items-center mt-1.5">
                  <p className="text-xs text-muted-foreground">Minimum 50 characters</p>
                  <p className="text-xs text-muted-foreground tabular-nums">{form.incidentDescription.length} / 5000</p>
                </div>
              </div>
              <div>
                <label className={labelCls}>Primary Source URL</label>
                <input
                  type="url"
                  value={form.sourceUrl}
                  onChange={e => set("sourceUrl", e.target.value)}
                  placeholder="https://..."
                  className={inputCls}
                />
                <p className="text-xs text-muted-foreground mt-1.5">News article, official record, court filing, video, government document.</p>
              </div>
            </div>
          </div>

          {/* Section: Your Info */}
          <div className="bg-white border-2 border-border rounded-2xl overflow-hidden shadow-sm">
            <div className="px-5 py-3 bg-muted/50 border-b border-border flex items-center justify-between">
              <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Your info</p>
              <span className="text-[10px] font-bold text-muted-foreground/60 uppercase tracking-wider">Anonymous tips accepted</span>
            </div>
            <div className="p-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className={labelCls}>Your Name</label>
                  <input
                    type="text"
                    value={form.submitterName}
                    onChange={e => set("submitterName", e.target.value)}
                    placeholder="Optional"
                    className={inputCls}
                  />
                </div>
                <div>
                  <label className={labelCls}>Your Email</label>
                  <input
                    type="email"
                    value={form.submitterEmail}
                    onChange={e => set("submitterEmail", e.target.value)}
                    placeholder="Optional — for follow-up only"
                    className={inputCls}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Captcha */}
          <div className="bg-white border-2 border-border rounded-2xl p-5 shadow-sm">
            <label className={labelCls}>Security Check <span className="text-[#FF0099]">*</span></label>
            <TurnstileWidget onToken={setCaptchaToken} onExpire={() => setCaptchaToken(null)} />
            {!captchaToken && (
              <p className="text-xs text-muted-foreground mt-2">Complete the check above to unlock the submit button.</p>
            )}
          </div>

          {error && (
            <div className="flex items-start gap-2.5 bg-red-50 border-2 border-red-200 rounded-xl p-4 text-red-700 text-sm font-medium">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <p>{error}</p>
            </div>
          )}

          <button
            type="submit"
            disabled={submitting || !captchaToken}
            className="w-full flex items-center justify-center gap-2.5 bg-[#1A3A8F] hover:bg-[#1A3A8F]/90 disabled:opacity-40 disabled:cursor-not-allowed text-white font-black py-4 px-6 rounded-xl transition-colors text-base tracking-tight shadow-lg shadow-[#1A3A8F]/20"
          >
            {submitting ? (
              <><Loader2 className="w-4 h-4 animate-spin" />Sending to the Desk...</>
            ) : (
              <><Send className="w-4 h-4" />Send to the Desk</>
            )}
          </button>

          <p className="text-xs text-muted-foreground text-center leading-relaxed px-4">
            All submissions are reviewed by our editorial team. We publish only what can be verified against primary sources.
            Spam and bad-faith submissions are automatically discarded before they reach our editors.
          </p>
        </form>
      </div>
    </Layout>
  );
}
