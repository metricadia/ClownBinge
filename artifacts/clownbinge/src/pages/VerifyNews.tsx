import { useState } from "react";
import { Layout } from "@/components/Layout";
import { usePageSeoHead } from "@/hooks/use-seo-head";
import {
  CheckCircle, XCircle, HelpCircle, AlertTriangle, EyeOff,
  ArrowRight, Shield, Globe, Newspaper, Radio, Loader2, ExternalLink, Lock
} from "lucide-react";

type Verdict =
  | "CONFIRMED"
  | "US_SUPPRESSED"
  | "WESTERN_COORDINATED_BLACKOUT"
  | "CONTESTED"
  | "UNVERIFIABLE";

interface PSTSource {
  title: string;
  url: string;
  domain: string;
}

interface PSTReport {
  query: string;
  verdict: Verdict;
  verdictExplanation: string;
  axis1: { label: string; finding: string; sources: PSTSource[] };
  axis2: { label: string; finding: string; sources: PSTSource[] };
  whatTheRecordShows: string;
  whatIsNotConfirmed: string;
  suppressionFlag: boolean;
  pstAxesUsed: number;
  timestamp: string;
}

const VERDICT_CONFIG: Record<
  Verdict,
  { label: string; color: string; bg: string; border: string; icon: React.ReactNode; description: string }
> = {
  CONFIRMED: {
    label: "CONFIRMED",
    color: "text-green-800",
    bg: "bg-green-50",
    border: "border-green-300",
    icon: <CheckCircle className="w-8 h-8 text-green-600" />,
    description: "Both axes independently confirm this claim.",
  },
  US_SUPPRESSED: {
    label: "US SUPPRESSED",
    color: "text-orange-800",
    bg: "bg-orange-50",
    border: "border-orange-300",
    icon: <EyeOff className="w-8 h-8 text-orange-500" />,
    description: "US/global coverage is absent or minimal. European press has it.",
  },
  WESTERN_COORDINATED_BLACKOUT: {
    label: "WESTERN COORDINATED BLACKOUT",
    color: "text-red-800",
    bg: "bg-red-50",
    border: "border-red-300",
    icon: <AlertTriangle className="w-8 h-8 text-red-600" />,
    description: "Both Western axes show coordinated silence on this topic.",
  },
  CONTESTED: {
    label: "CONTESTED",
    color: "text-yellow-800",
    bg: "bg-yellow-50",
    border: "border-yellow-300",
    icon: <XCircle className="w-8 h-8 text-yellow-600" />,
    description: "The two axes present contradictory information.",
  },
  UNVERIFIABLE: {
    label: "UNVERIFIABLE",
    color: "text-gray-700",
    bg: "bg-gray-50",
    border: "border-gray-300",
    icon: <HelpCircle className="w-8 h-8 text-gray-500" />,
    description: "Insufficient information across both axes to reach a conclusion.",
  },
};

async function runVerification(query: string): Promise<PSTReport> {
  const res = await fetch("/api/verify", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ query }),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: "Unknown error" }));
    throw new Error((err as { error?: string }).error ?? "Verification failed");
  }
  return res.json() as Promise<PSTReport>;
}

export default function VerifyNews() {
  usePageSeoHead({
    title: "Verify ANY News Story — $4.95",
    description: "Submit any news story and Citatious will verify it against primary government and institutional sources. Is it real? Is it suppressed? Get the documented answer for $4.95.",
    path: "/clowncheck",
    schemaType: "WebPage",
  });
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [report, setReport] = useState<PSTReport | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleVerify = async () => {
    if (query.trim().length < 5) return;
    setLoading(true);
    setReport(null);
    setError(null);
    try {
      const result = await runVerification(query.trim());
      setReport(result);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Verification failed. Try again.");
    } finally {
      setLoading(false);
    }
  };

  const verdict = report ? VERDICT_CONFIG[report.verdict] : null;

  return (
    <Layout>
      <div className="max-w-3xl mx-auto px-4 py-10">

        {/* Header */}
        <div className="mb-8">
          <p className="text-xs font-bold tracking-widest uppercase text-primary mb-3">
            Primary Source Triangulation
          </p>
          <h1 className="font-sans font-bold text-3xl sm:text-4xl text-header leading-tight mb-3">
            Verify ANY News.{" "}
            <span style={{ color: "#F5C518" }}>Three Axes. One Truth.</span>
          </h1>
          <p className="text-muted-foreground text-base leading-relaxed max-w-2xl">
            Submit any topic, claim, or headline. The PST engine cross-references
            US/global, Western European, and non-Western press simultaneously to
            detect confirmation, suppression, and coordinated blackouts.
            Instant on-screen report. No account required.
          </p>
          <div className="h-1 w-full bg-[#F5C518] rounded-full mt-5" />
        </div>

        {/* Scale claim */}
        <div className="flex items-center justify-center gap-3 mb-6 py-4 px-6 rounded-2xl bg-white border-2" style={{ borderColor: "#1A3A8F" }}>
          <span className="font-extrabold text-2xl sm:text-3xl" style={{ color: "#1A3A8F" }}>65,000+</span>
          <span className="text-sm font-semibold text-muted-foreground leading-snug max-w-xs">
            empirical news sources searched globally via Primary Source Triangulation
          </span>
        </div>

        {/* PST Axes */}
        <div className="grid sm:grid-cols-3 gap-3 mb-8">
          <div className="flex items-start gap-3 p-4 rounded-xl border bg-white">
            <Globe className="w-5 h-5 text-primary shrink-0 mt-0.5" />
            <div>
              <div className="font-bold text-sm text-header mb-0.5">Axis 1 — US/Global Record</div>
              <p className="text-xs text-muted-foreground">Real-time coverage across thousands of US and international news sources.</p>
            </div>
          </div>
          <div className="flex items-start gap-3 p-4 rounded-xl border bg-white">
            <Newspaper className="w-5 h-5 text-primary shrink-0 mt-0.5" />
            <div>
              <div className="font-bold text-sm text-header mb-0.5">Axis 2 — Western European Press</div>
              <p className="text-xs text-muted-foreground">Independent European editorial coverage under different political and ownership pressures.</p>
            </div>
          </div>
          <div className="flex items-start gap-3 p-4 rounded-xl border bg-white relative">
            <Radio className="w-5 h-5 text-primary shrink-0 mt-0.5" />
            <div>
              <div className="flex items-center gap-2 mb-0.5">
                <span className="font-bold text-sm text-header">Axis 3 — Non-Western Press</span>
                <span className="text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded-full" style={{ background: "#F5C518", color: "#1A3A8F" }}>Soon</span>
              </div>
              <p className="text-xs text-muted-foreground">Al Jazeera and Global South editorial sources operating outside Western media alliances.</p>
            </div>
          </div>
        </div>

        {/* Intake Form */}
        <div className="rounded-2xl border-2 p-6 mb-8 bg-[#f8f9fe]" style={{ borderColor: "#1A3A8F" }}>
          <label className="block font-bold text-header mb-2 text-sm uppercase tracking-wider">
            What do you want to verify?
          </label>
          <textarea
            className="w-full border-2 border-border rounded-xl px-4 py-3 text-sm focus:border-primary focus:outline-none transition-colors resize-none mb-4"
            rows={3}
            placeholder={'e.g. "Netanyahu health status" or "US military withdrawal from Syria" or paste a headline...'}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            disabled={loading}
          />
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <Lock className="w-3.5 h-3.5" />
              <span>PST report delivered immediately. No account required.</span>
            </div>
            <button
              onClick={handleVerify}
              disabled={loading || query.trim().length < 5}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full font-bold text-white text-sm transition-opacity hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
              style={{ background: "#1A3A8F" }}
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Triangulating...
                </>
              ) : (
                <>
                  Run PST Verification
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </div>
        </div>

        {/* Pricing note */}
        {!report && !loading && (
          <div className="text-center mb-8 py-4 border rounded-xl bg-white">
            <span className="text-2xl font-extrabold text-header" style={{ fontFamily: "inherit" }}>$4.95</span>
            <span className="text-muted-foreground text-sm ml-2">per verification</span>
            <span className="mx-3 text-muted-foreground/30">|</span>
            <span className="text-xs text-muted-foreground">No subscription. No account. PST report on screen.</span>
            <p className="text-xs text-muted-foreground/60 mt-1">Payment integration coming soon. Currently running as free demo.</p>
          </div>
        )}

        {/* Error */}
        {error && (
          <div className="rounded-xl border border-red-200 bg-red-50 p-5 mb-8 text-red-800 text-sm">
            <strong>Error:</strong> {error}
          </div>
        )}

        {/* PST Report */}
        {report && verdict && (
          <div className="space-y-6 mb-12">

            {/* Verdict */}
            <div className={`rounded-2xl border-2 p-6 ${verdict.bg} ${verdict.border}`}>
              <div className="flex items-start gap-4">
                <div className="shrink-0 mt-0.5">{verdict.icon}</div>
                <div>
                  <div className={`font-extrabold text-xl mb-1 ${verdict.color}`}>
                    {verdict.label}
                  </div>
                  <p className={`text-sm font-semibold mb-2 ${verdict.color}`}>{verdict.description}</p>
                  <p className="text-sm text-gray-700">{report.verdictExplanation}</p>
                  {report.suppressionFlag && (
                    <div className="mt-3 inline-flex items-center gap-1.5 bg-red-100 text-red-700 text-xs font-bold px-3 py-1 rounded-full">
                      <EyeOff className="w-3 h-3" />
                      SUPPRESSION FLAG ACTIVE
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Axis 1 */}
            <div className="rounded-xl border bg-white p-5">
              <div className="flex items-center gap-2 mb-3">
                <Globe className="w-4 h-4 text-primary" />
                <h3 className="font-bold text-sm uppercase tracking-wider text-header">{report.axis1.label}</h3>
              </div>
              <p className="text-sm text-muted-foreground mb-4 leading-relaxed">{report.axis1.finding}</p>
              {report.axis1.sources.length > 0 && (
                <div className="space-y-2">
                  {report.axis1.sources.map((src, i) => (
                    <a
                      key={i}
                      href={src.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-start gap-2 text-xs text-primary hover:underline group"
                    >
                      <ExternalLink className="w-3 h-3 shrink-0 mt-0.5 opacity-60 group-hover:opacity-100" />
                      <span>{src.title} <span className="text-muted-foreground">({src.domain})</span></span>
                    </a>
                  ))}
                </div>
              )}
            </div>

            {/* Axis 2 */}
            <div className="rounded-xl border bg-white p-5">
              <div className="flex items-center gap-2 mb-3">
                <Newspaper className="w-4 h-4 text-primary" />
                <h3 className="font-bold text-sm uppercase tracking-wider text-header">{report.axis2.label}</h3>
              </div>
              <p className="text-sm text-muted-foreground mb-4 leading-relaxed">{report.axis2.finding}</p>
              {report.axis2.sources.length > 0 && (
                <div className="space-y-2">
                  {report.axis2.sources.map((src, i) => (
                    <a
                      key={i}
                      href={src.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-start gap-2 text-xs text-primary hover:underline group"
                    >
                      <ExternalLink className="w-3 h-3 shrink-0 mt-0.5 opacity-60 group-hover:opacity-100" />
                      <span>{src.title} <span className="text-muted-foreground">({src.domain})</span></span>
                    </a>
                  ))}
                </div>
              )}
            </div>

            {/* What the Record Shows */}
            <div className="rounded-xl border-l-4 bg-white p-5" style={{ borderLeftColor: "#1A3A8F" }}>
              <div className="flex items-center gap-2 mb-2">
                <Shield className="w-4 h-4 text-primary" />
                <h3 className="font-bold text-sm uppercase tracking-wider text-header">What the Record Shows</h3>
              </div>
              <p className="text-sm leading-relaxed text-gray-800">{report.whatTheRecordShows}</p>
            </div>

            {/* What Is Not Confirmed */}
            <div className="rounded-xl border-l-4 border-amber-400 bg-amber-50 p-5">
              <div className="flex items-center gap-2 mb-2">
                <HelpCircle className="w-4 h-4 text-amber-600" />
                <h3 className="font-bold text-sm uppercase tracking-wider text-amber-800">What Is Not Confirmed</h3>
              </div>
              <p className="text-sm leading-relaxed text-amber-900">{report.whatIsNotConfirmed}</p>
            </div>

            {/* PST Badge */}
            <div className="text-center py-4 border rounded-xl bg-white">
              <div className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-1">
                Primary Source Triangulation
              </div>
              <div className="text-xs text-muted-foreground">
                {report.pstAxesUsed} axes verified
                <span className="mx-2">|</span>
                {new Date(report.timestamp).toLocaleString()}
              </div>
            </div>

            {/* Verify another */}
            <button
              onClick={() => { setReport(null); setQuery(""); }}
              className="w-full py-3 rounded-xl border-2 border-border font-bold text-header text-sm hover:border-primary hover:text-primary transition-colors"
            >
              Verify Another Claim
            </button>
          </div>
        )}

        {/* Verdict Reference */}
        {!report && (
          <div className="mb-12">
            <h2 className="font-bold text-lg text-header mb-4 uppercase tracking-wider">Five PST Verdicts</h2>
            <div className="grid gap-3">
              {(Object.entries(VERDICT_CONFIG) as [Verdict, typeof VERDICT_CONFIG[Verdict]][]).map(([key, cfg]) => (
                <div key={key} className={`flex items-start gap-3 p-4 rounded-xl border ${cfg.bg} ${cfg.border}`}>
                  <div className="shrink-0 mt-0.5 scale-75">{cfg.icon}</div>
                  <div>
                    <div className={`font-bold text-sm mb-0.5 ${cfg.color}`}>{cfg.label}</div>
                    <p className={`text-xs leading-relaxed ${cfg.color} opacity-80`}>{cfg.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Bottom CTA */}
        <div className="rounded-2xl text-center py-10 px-6" style={{ background: "#1A3A8F" }}>
          <h2 className="font-extrabold text-2xl text-white mb-2">
            Stop Sharing. Start Verifying.
          </h2>
          <p className="text-white/70 text-sm mb-6">
            One question. Three axes. The record, checked.
          </p>
          <button
            onClick={() => { setReport(null); window.scrollTo({ top: 0, behavior: "smooth" }); }}
            className="inline-flex items-center gap-2 px-8 py-4 rounded-full font-bold text-header text-lg transition-opacity hover:opacity-90"
            style={{ background: "#F5C518" }}
          >
            Verify Now — $4.95
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>

      </div>
    </Layout>
  );
}
