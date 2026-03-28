import { Link } from "wouter";
import { Layout } from "@/components/Layout";
import { AdminNav } from "@/components/AdminNav";
import { Heart, Shield, FileText, ArrowRight, CheckCircle, Lock, Globe } from "lucide-react";
import { usePageSeoHead } from "@/hooks/use-seo-head";

export default function Support() {
  usePageSeoHead({
    title: "Support Independent Journalism",
    description: "Support ClownBinge — the only accountability journalism platform sourced exclusively from primary government and institutional records. Every dollar funds verified reporting.",
    path: "/contact",
    schemaType: "WebPage",
  });
  return (
    <Layout>

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

            <p className="text-white/75 text-lg leading-relaxed mb-8">
              We built ClownBinge because we were done waiting for someone else to fix it.
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

          {/* RIGHT -- options */}
          <div className="flex flex-col gap-4">

            {/* Donate */}
            <div className="rounded-2xl overflow-hidden" style={{ border: "2px solid #F5C518" }}>
              <div className="p-6" style={{ background: "#1A3A8F" }}>
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <div className="text-xs font-bold tracking-widest uppercase mb-1" style={{ color: "#F5C518" }}>Donate</div>
                    <div className="font-extrabold text-3xl text-white">Any Amount</div>
                  </div>
                  <div className="w-12 h-12 rounded-full flex items-center justify-center shrink-0" style={{ background: "#F5C518" }}>
                    <Heart className="w-6 h-6" style={{ color: "#1A3A8F" }} />
                  </div>
                </div>
                <p className="text-white/65 text-sm leading-relaxed mb-4">
                  No product. No deliverable. Just you deciding that verified, independent
                  journalism is worth keeping alive. Keeps the site free and unpaywalled.
                </p>
                <div className="flex flex-wrap gap-x-4 gap-y-1 mb-5">
                  {["Funds original research", "Supports editorial independence", "Keeps the site free"].map((item) => (
                    <div key={item} className="flex items-center gap-1.5 text-xs" style={{ color: "#F5C518" }}>
                      <CheckCircle className="w-3 h-3 shrink-0" />
                      {item}
                    </div>
                  ))}
                </div>
                <a
                  href="mailto:support@clownbinge.com?subject=I%20want%20to%20support%20ClownBinge"
                  className="w-full inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full font-extrabold text-sm transition-opacity hover:opacity-90"
                  style={{ background: "#F5C518", color: "#1A3A8F" }}
                >
                  I Want to Help
                  <Heart className="w-4 h-4" />
                </a>
              </div>
            </div>

            {/* Verify ANY News */}
            <div className="rounded-2xl overflow-hidden bg-white border border-gray-200 p-6 flex flex-col sm:flex-row gap-5 items-start">
              <div className="w-11 h-11 rounded-full flex items-center justify-center shrink-0" style={{ background: "#1A3A8F" }}>
                <Shield className="w-5 h-5 text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-3 mb-1 flex-wrap">
                  <div className="text-xs font-bold tracking-widest uppercase text-muted-foreground">Verify ANY News</div>
                  <div className="font-extrabold text-2xl" style={{ color: "#1A3A8F" }}>$4.95</div>
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed mb-4">
                  Submit any article, claim, or quote. We cross-reference against the primary
                  record and return a verified assessment: confirmed, contested, or fabricated.
                </p>
                <Link
                  href="/clowncheck"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full font-extrabold text-sm text-white transition-opacity hover:opacity-90"
                  style={{ background: "#1A3A8F" }}
                >
                  Verify a Story
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>

            {/* Full PST Report */}
            <div className="rounded-2xl overflow-hidden bg-white border border-gray-200 p-6 flex flex-col sm:flex-row gap-5 items-start">
              <div className="w-11 h-11 rounded-full flex items-center justify-center shrink-0" style={{ background: "#1A3A8F" }}>
                <FileText className="w-5 h-5 text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-3 mb-1 flex-wrap">
                  <div className="text-xs font-bold tracking-widest uppercase text-muted-foreground">Full PST Report</div>
                  <div className="font-extrabold text-2xl" style={{ color: "#1A3A8F" }}>$24.95</div>
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed mb-4">
                  A full Primary Source Transparency report on any public figure. Voting records,
                  financial disclosures, lobbying relationships, public statements vs. the actual
                  record. Up to 20 pages, APA 7 citations, delivered within 24 hours.
                </p>
                <Link
                  href="/reports"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full font-extrabold text-sm text-white transition-opacity hover:opacity-90"
                  style={{ background: "#1A3A8F" }}
                >
                  Order a Report
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* Closing */}
      <div className="max-w-3xl mx-auto px-6 pt-12">
        <AdminNav />
      </div>
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
        <p className="text-muted-foreground text-sm mt-2">Primary Source Analytics, LLC</p>
      </div>

    </Layout>
  );
}
