import { Link } from "wouter";
import { Layout } from "@/components/Layout";
import { Heart, Shield, FileText, ArrowRight, CheckCircle, Lock, AlertTriangle, Globe } from "lucide-react";

export default function Support() {
  return (
    <Layout>

      {/* Hero -- the real story */}
      <div className="w-full" style={{ background: "#0d1f54" }}>
        <div className="max-w-3xl mx-auto px-6 py-16 text-center">
          <div className="inline-flex items-center gap-2 rounded-full px-4 py-1.5 mb-8 text-xs font-bold tracking-widest uppercase" style={{ background: "#F5C518", color: "#1A3A8F" }}>
            <Lock className="w-3 h-3" />
            We Cannot Be Bought
          </div>

          <h1 className="font-sans font-extrabold text-4xl sm:text-5xl text-white leading-tight mb-6">
            We Are PhD Students.<br />
            <span style={{ color: "#F5C518" }}>We Got Sick of the Lies.</span>
          </h1>

          <p className="text-white/80 text-xl leading-relaxed mb-4">
            Foreign governments. American politicians. AI-generated videos. Biased outlets with
            corporate owners. Fabricated headlines engineered to make you angry, afraid, and
            most importantly confused about what is actually true.
          </p>

          <p className="text-white/80 text-xl leading-relaxed">
            We built ClownBinge because we were done waiting for someone else to fix it.
          </p>
        </div>
      </div>

      {/* The manifesto block */}
      <div className="w-full border-b" style={{ background: "#1A3A8F" }}>
        <div className="max-w-4xl mx-auto px-6 py-12 grid sm:grid-cols-3 gap-8 text-center">
          <div>
            <div className="font-extrabold text-2xl text-white mb-2">Independent.</div>
            <p className="text-white/60 text-sm leading-relaxed">
              No corporate owners. No advertisers in the editorial room. No one calling us with
              a list of stories we cannot touch.
            </p>
          </div>
          <div>
            <div className="font-extrabold text-2xl mb-2" style={{ color: "#F5C518" }}>Verified.</div>
            <p className="text-white/60 text-sm leading-relaxed">
              Nothing gets published without double verification. Every claim is sourced
              to the primary record: court filings, voting records, peer-reviewed research.
            </p>
          </div>
          <div>
            <div className="font-extrabold text-2xl text-white mb-2">The Primary Source.</div>
            <p className="text-white/60 text-sm leading-relaxed">
              We do not report on reports. We go to the original document, the actual vote,
              the real transcript. That is the only standard we accept.
            </p>
          </div>
        </div>
      </div>

      {/* The personal appeal */}
      <div className="max-w-2xl mx-auto px-6 py-16 text-center">
        <AlertTriangle className="w-8 h-8 mx-auto mb-6" style={{ color: "#F5C518" }} />
        <h2 className="font-bold text-3xl text-header mb-6 leading-snug">
          Nobody Likes Paywalls.<br />
          <span style={{ color: "#1A3A8F" }}>We Are Trying to Avoid One.</span>
        </h2>
        <p className="text-muted-foreground text-lg leading-relaxed mb-6">
          We believe verified journalism should be free to read. The record belongs to everyone.
          You should not have to pay a subscription to find out what your senator actually voted for,
          or whether the headline you just saw is real.
        </p>
        <p className="text-muted-foreground text-lg leading-relaxed mb-6">
          But journalism costs time. Research costs time. Verification costs time.
          And unlike the outlets manufacturing outrage for ad revenue, we refuse to take shortcuts.
        </p>
        <p className="font-bold text-xl text-header leading-snug">
          Your support is what makes the paywall unnecessary.<br />
          <span style={{ color: "#1A3A8F" }}>You can make the difference.</span>
        </p>
      </div>

      {/* Three ways to support */}
      <div className="w-full py-14" style={{ background: "#f8f9fe" }}>
        <div className="max-w-5xl mx-auto px-6">
          <div className="text-center mb-12">
            <p className="text-xs font-bold tracking-widest uppercase mb-3" style={{ color: "#1A3A8F" }}>Three Ways to Help</p>
            <h2 className="font-bold text-3xl text-header">Support the Work</h2>
          </div>

          <div className="grid md:grid-cols-3 gap-6">

            {/* Donate */}
            <div className="flex flex-col rounded-2xl overflow-hidden shadow-lg" style={{ border: "2px solid #F5C518" }}>
              <div className="flex-1 p-7" style={{ background: "#1A3A8F" }}>
                <div className="w-11 h-11 rounded-full flex items-center justify-center mb-5" style={{ background: "#F5C518" }}>
                  <Heart className="w-5 h-5" style={{ color: "#1A3A8F" }} />
                </div>
                <div className="text-xs font-bold tracking-widest uppercase mb-2" style={{ color: "#F5C518" }}>
                  Donate
                </div>
                <div className="font-extrabold text-3xl text-white mb-4">Any Amount</div>
                <p className="text-white/70 text-sm leading-relaxed">
                  No product. No deliverable. Just you deciding that verified, independent
                  journalism is worth keeping alive. Every dollar goes directly into the research
                  that keeps this site free and unpaywalled.
                </p>
                <div className="mt-5 space-y-2">
                  {["Keeps the site free to read", "Funds original research", "Supports editorial independence"].map((item) => (
                    <div key={item} className="flex items-center gap-2 text-xs" style={{ color: "#F5C518" }}>
                      <CheckCircle className="w-3.5 h-3.5 shrink-0" />
                      {item}
                    </div>
                  ))}
                </div>
              </div>
              <div className="p-5" style={{ background: "#F5C518" }}>
                <a
                  href="mailto:support@clownbinge.com?subject=I%20want%20to%20support%20ClownBinge"
                  className="w-full inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-full font-extrabold text-sm transition-opacity hover:opacity-90"
                  style={{ background: "#1A3A8F", color: "#ffffff" }}
                >
                  I Want to Help
                  <Heart className="w-4 h-4" />
                </a>
              </div>
            </div>

            {/* Verify ANY News */}
            <div className="flex flex-col rounded-2xl overflow-hidden shadow-sm border border-gray-200 bg-white">
              <div className="flex-1 p-7">
                <div className="w-11 h-11 rounded-full flex items-center justify-center mb-5" style={{ background: "#1A3A8F" }}>
                  <Shield className="w-5 h-5 text-white" />
                </div>
                <div className="text-xs font-bold tracking-widest uppercase mb-2 text-muted-foreground">
                  Verify ANY News
                </div>
                <div className="font-extrabold text-4xl mb-1" style={{ color: "#1A3A8F" }}>$4.95</div>
                <p className="text-xs text-muted-foreground mb-4">Per verification report</p>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  Saw a headline and something felt off? Submit any article, claim, or quote.
                  We cross-reference it against the primary record and return a verified
                  assessment: confirmed, contested, or fabricated.
                </p>
                <div className="mt-5 space-y-2">
                  {[
                    "Any story, any outlet, any claim",
                    "Primary source cross-reference",
                    "Verdict delivered to your inbox",
                  ].map((item) => (
                    <div key={item} className="flex items-center gap-2 text-xs text-muted-foreground">
                      <CheckCircle className="w-3.5 h-3.5 shrink-0 text-green-600" />
                      {item}
                    </div>
                  ))}
                </div>
              </div>
              <div className="p-5 border-t border-gray-100">
                <Link
                  href="/clowncheck"
                  className="w-full inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-full font-extrabold text-sm text-white transition-opacity hover:opacity-90"
                  style={{ background: "#1A3A8F" }}
                >
                  Verify a Story
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>

            {/* Full PST Report */}
            <div className="flex flex-col rounded-2xl overflow-hidden shadow-sm border border-gray-200 bg-white">
              <div className="flex-1 p-7">
                <div className="w-11 h-11 rounded-full flex items-center justify-center mb-5" style={{ background: "#1A3A8F" }}>
                  <FileText className="w-5 h-5 text-white" />
                </div>
                <div className="text-xs font-bold tracking-widest uppercase mb-2 text-muted-foreground">
                  Full PST Report
                </div>
                <div className="font-extrabold text-4xl mb-1" style={{ color: "#1A3A8F" }}>$24.95</div>
                <p className="text-xs text-muted-foreground mb-4">Up to 20 pages. APA 7 citations.</p>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  A full Primary Source Transparency report on any public figure who holds power.
                  Voting records, financial disclosures, lobbying relationships, public
                  statements vs. the actual record: everything legally available, professionally
                  compiled. Some public personas may not have much on record.
                </p>
                <div className="mt-5 space-y-2">
                  {[
                    "Elected officials, executives, public figures",
                    "Up to 20 pages, every claim cited",
                    "Delivered to your inbox within 24 hours",
                  ].map((item) => (
                    <div key={item} className="flex items-center gap-2 text-xs text-muted-foreground">
                      <CheckCircle className="w-3.5 h-3.5 shrink-0 text-green-600" />
                      {item}
                    </div>
                  ))}
                </div>
              </div>
              <div className="p-5 border-t border-gray-100">
                <Link
                  href="/reports"
                  className="w-full inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-full font-extrabold text-sm text-white transition-opacity hover:opacity-90"
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

      {/* Closing statement */}
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
        <p className="text-muted-foreground text-sm mt-2">
          Primary Source Analytics, LLC
        </p>
      </div>

    </Layout>
  );
}
