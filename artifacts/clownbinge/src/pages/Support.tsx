import { Link } from "wouter";
import { Layout } from "@/components/Layout";
import { AdminPageHeader } from "@/components/AdminPageHeader";
import { Heart, Shield, FileText, ArrowRight, CheckCircle, Lock, Globe, Star } from "lucide-react";
import { usePageSeoHead } from "@/hooks/use-seo-head";

export default function Support() {
  usePageSeoHead({
    title: "Subscribe to ClownBinge — $9/mo Supporting Member",
    description: "Subscribe for $9/month and unlock the full research toolkit: Metricadia ID profiles, CB Factoid citations, and every interactive tool we build. Keeping accountability journalism alive.",
    path: "/invest-in-us",
    schemaType: "WebPage",
  });
  return (
    <Layout>

      <div className="max-w-3xl mx-auto px-4 py-12">
        <AdminPageHeader title="Subscribe Now" />
      </div>

      {/* Two-column hero: story left, options right */}
      <div className="w-full" style={{ background: "#0d1f54" }}>
        <div className="max-w-6xl mx-auto px-6 py-14 grid lg:grid-cols-2 gap-12 items-start">

          {/* LEFT -- origin story */}
          <div>
            <div className="inline-flex items-center gap-2 rounded-full px-4 py-1.5 mb-8 text-xs font-bold tracking-widest uppercase" style={{ background: "#F5C518", color: "#1A3A8F" }}>
              <Lock className="w-3 h-3" />
              We Cannot Be Bought
            </div>

            <h1 className="font-sans font-extrabold text-4xl sm:text-5xl text-white leading-tight mb-6">
              We Are PhD Students.<br />
              <span style={{ color: "#F5C518" }}>We Got Sick of the Lies.</span>
            </h1>

            <p className="text-white/75 text-lg leading-relaxed mb-4">
              Foreign governments. American politicians. AI-generated videos. Biased outlets with
              corporate owners. Fabricated headlines engineered to make you angry, afraid, and
              confused about what is actually true.
            </p>

            <p className="text-white/75 text-lg leading-relaxed mb-4">
              We built ClownBinge because we were done waiting for someone else to fix it. $9 a month
              keeps this platform independent — no corporate parent, no advertiser on line one, no one
              calling with a list of stories we cannot touch.
            </p>

            <p className="text-white/60 text-base leading-relaxed mb-8">
              Every article stays free. Your subscription unlocks the research tools that let you go
              deeper than the headline.
            </p>

            <div className="grid grid-cols-3 gap-6 border-t pt-8" style={{ borderColor: "rgba(255,255,255,0.15)" }}>
              <div>
                <div className="font-extrabold text-lg text-white mb-1">Independent.</div>
                <p className="text-white/50 text-xs leading-relaxed">No corporate owners. No one calling with a list of stories we cannot touch.</p>
              </div>
              <div>
                <div className="font-extrabold text-lg mb-1" style={{ color: "#F5C518" }}>Verified.</div>
                <p className="text-white/50 text-xs leading-relaxed">Every claim sourced to the primary record: court filings, votes, peer-reviewed research.</p>
              </div>
              <div>
                <div className="font-extrabold text-lg text-white mb-1">Primary Source.</div>
                <p className="text-white/50 text-xs leading-relaxed">We go to the original document. That is the only standard we accept.</p>
              </div>
            </div>
          </div>

          {/* RIGHT -- double-stack options */}
          <div className="flex flex-col gap-4">

            {/* PRIMARY: Subscribe $9/mo */}
            <div className="rounded-2xl overflow-hidden" style={{ border: "2px solid #F5C518" }}>
              <div className="p-6" style={{ background: "#1A3A8F" }}>
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <div className="text-xs font-bold tracking-widest uppercase mb-1" style={{ color: "#F5C518" }}>Supporting Member</div>
                    <div className="font-extrabold text-3xl text-white">$9 <span className="text-lg font-bold text-white/60">/ month</span></div>
                  </div>
                  <div className="w-12 h-12 rounded-full flex items-center justify-center shrink-0" style={{ background: "#F5C518" }}>
                    <Star className="w-6 h-6 fill-current" style={{ color: "#1A3A8F" }} />
                  </div>
                </div>
                <p className="text-white/75 text-sm leading-relaxed mb-4">
                  Unlock the full research toolkit on every article. Metricadia ID profiles on every
                  person named in our reporting. CB Factoid citation popups with full source context.
                  Every tool we build, available to you first.
                </p>
                <div className="flex flex-wrap gap-x-4 gap-y-1.5 mb-5">
                  {[
                    "Metricadia ID person profiles",
                    "CB Factoid citation popups",
                    "Supports editorial independence",
                    "Keeps all articles free for everyone",
                  ].map((item) => (
                    <div key={item} className="flex items-center gap-1.5 text-xs" style={{ color: "#F5C518" }}>
                      <CheckCircle className="w-3 h-3 shrink-0" />
                      {item}
                    </div>
                  ))}
                </div>
                <Link
                  href="/subscribe"
                  className="w-full inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full font-extrabold text-sm transition-opacity hover:opacity-90"
                  style={{ background: "#F5C518", color: "#1A3A8F" }}
                >
                  Subscribe Now!
                  <Star className="w-4 h-4 fill-current" />
                </Link>
              </div>
            </div>

            {/* SECONDARY: Donate any amount */}
            <div className="rounded-2xl overflow-hidden" style={{ border: "1.5px solid rgba(245,197,24,0.35)", background: "rgba(255,255,255,0.04)" }}>
              <div className="p-5">
                <div className="flex items-center justify-between mb-2">
                  <div>
                    <div className="text-xs font-bold tracking-widest uppercase mb-1" style={{ color: "rgba(245,197,24,0.6)" }}>One-Time Donation</div>
                    <div className="font-extrabold text-xl text-white">Any Amount</div>
                  </div>
                  <div className="w-9 h-9 rounded-full flex items-center justify-center shrink-0" style={{ background: "rgba(245,197,24,0.15)" }}>
                    <Heart className="w-4 h-4" style={{ color: "#F5C518" }} />
                  </div>
                </div>
                <p className="text-white/50 text-xs leading-relaxed mb-4">
                  Not ready for a subscription? Any contribution keeps the platform alive
                  and the reporting free for every reader.
                </p>
                <a
                  href="mailto:support@clownbinge.com?subject=I%20want%20to%20support%20ClownBinge"
                  className="w-full inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-full font-bold text-xs transition-opacity hover:opacity-80 border"
                  style={{ borderColor: "rgba(245,197,24,0.4)", color: "#F5C518", background: "transparent" }}
                >
                  Donate
                  <Heart className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>

            {/* Verify ANY News */}
            <div className="rounded-2xl overflow-hidden bg-white border border-gray-200 p-5 flex flex-col sm:flex-row gap-4 items-start">
              <div className="w-10 h-10 rounded-full flex items-center justify-center shrink-0" style={{ background: "#1A3A8F" }}>
                <Shield className="w-4 h-4 text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-3 mb-1 flex-wrap">
                  <div className="text-xs font-bold tracking-widest uppercase text-muted-foreground">Verify ANY News</div>
                  <div className="font-extrabold text-xl" style={{ color: "#1A3A8F" }}>$4.95</div>
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed mb-3">
                  Submit any article, claim, or quote. We cross-reference against the primary record and return a verified assessment.
                </p>
                <Link
                  href="/clowncheck"
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full font-extrabold text-xs text-white transition-opacity hover:opacity-90"
                  style={{ background: "#1A3A8F" }}
                >
                  Verify a Story
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* Closing */}
      <div className="max-w-2xl mx-auto px-6 py-16 text-center">
        <Globe className="w-8 h-8 mx-auto mb-6 text-muted-foreground" />
        <p className="text-muted-foreground text-base leading-relaxed mb-4">
          We are not a newsroom with a corporate parent, a hedge fund owner, or an advertiser
          on line one. We are researchers who made a decision: the documented record is more
          important than our comfort, our neutrality, or our safety from the people whose
          documented record we are publishing.
        </p>
        <p className="font-bold text-lg text-header">
          Independent. Verified. The Primary Source.
        </p>
        <p className="text-muted-foreground text-sm mt-2">Metricadia Research, LLC</p>
      </div>

    </Layout>
  );
}
