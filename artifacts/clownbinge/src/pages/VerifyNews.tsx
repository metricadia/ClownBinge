import { Layout } from "@/components/Layout";
import { CheckCircle, XCircle, HelpCircle, ArrowRight, Shield, FileSearch, Zap } from "lucide-react";

export default function VerifyNews() {
  return (
    <Layout>
      <div className="max-w-3xl mx-auto px-4 py-12">

        {/* Header */}
        <div className="mb-10">
          <p className="text-xs font-semibold tracking-widest uppercase text-primary mb-3">ClownBinge Verification</p>
          <h1 className="font-display font-extrabold text-3xl sm:text-4xl text-header leading-tight mb-4">
            Verify News.<br />
            <span style={{ color: "#F5C518" }}>Instantly.</span>
          </h1>
          <p className="text-muted-foreground text-lg leading-relaxed max-w-2xl">
            Paste a headline, story, or URL. We check it against verified American sources and return a verdict — fast.
          </p>
          <div className="h-1 w-full bg-[#F5C518] rounded-full mt-6" />
        </div>

        {/* Price CTA */}
        <div className="rounded-2xl border-2 p-8 mb-10 text-center" style={{ borderColor: "#1A3A8F", background: "#f8f9fe" }}>
          <div className="inline-flex items-center gap-2 bg-white border border-gray-200 rounded-full px-4 py-1.5 mb-4">
            <Zap className="w-3.5 h-3.5" style={{ color: "#F5C518" }} />
            <span className="text-xs font-semibold tracking-wider uppercase text-muted-foreground">Instant Verdict</span>
          </div>
          <div className="font-display font-extrabold text-5xl mb-2" style={{ color: "#1A3A8F" }}>
            $1.95
          </div>
          <p className="text-muted-foreground text-sm mb-6">Per verification. No subscription. No account required.</p>
          <button
            className="inline-flex items-center gap-2 px-8 py-4 rounded-full font-display font-bold text-white text-lg transition-opacity hover:opacity-90"
            style={{ background: "#1A3A8F" }}
            onClick={() => alert("Payment coming soon — ClownCheck launching shortly.")}
          >
            Verify a Story Now
            <ArrowRight className="w-5 h-5" />
          </button>
          <p className="text-xs text-muted-foreground mt-3">Secure checkout. Result delivered on screen.</p>
        </div>

        {/* Verdicts */}
        <h2 className="font-display font-bold text-xl text-header mb-5">Three Possible Verdicts</h2>
        <div className="grid gap-4 mb-12">
          <div className="flex items-start gap-4 p-5 rounded-xl bg-green-50 border border-green-200">
            <CheckCircle className="w-7 h-7 text-green-600 shrink-0 mt-0.5" />
            <div>
              <div className="font-display font-bold text-green-800 text-lg mb-1">Verified</div>
              <p className="text-green-700 text-sm leading-relaxed">
                The core claim is confirmed by multiple independent, verified American sources. A summary of confirming sources is included with your result.
              </p>
            </div>
          </div>
          <div className="flex items-start gap-4 p-5 rounded-xl bg-red-50 border border-red-200">
            <XCircle className="w-7 h-7 text-red-600 shrink-0 mt-0.5" />
            <div>
              <div className="font-display font-bold text-red-800 text-lg mb-1">Fake News</div>
              <p className="text-red-700 text-sm leading-relaxed">
                The claim is directly contradicted by verified primary source records. The contradicting sources are cited in your result so you can see exactly what the record shows.
              </p>
            </div>
          </div>
          <div className="flex items-start gap-4 p-5 rounded-xl bg-amber-50 border border-amber-200">
            <HelpCircle className="w-7 h-7 text-amber-600 shrink-0 mt-0.5" />
            <div>
              <div className="font-display font-bold text-amber-800 text-lg mb-1">Cannot Verify</div>
              <p className="text-amber-700 text-sm leading-relaxed">
                Verified sources do not confirm or deny the claim. This is an honest result — we report what the record shows and nothing more.
              </p>
            </div>
          </div>
        </div>

        {/* Source standards */}
        <div className="mb-12">
          <h2 className="font-display font-bold text-xl text-header mb-2">Checked Against Verified American Sources</h2>
          <p className="text-muted-foreground text-sm mb-5">
            Every verification is run against a curated whitelist of verified American institutions. We do not accept anonymous sources, social media posts, or partisan outlets as primary evidence.
          </p>
          <div className="grid sm:grid-cols-3 gap-4">
            <div className="p-4 rounded-xl border bg-white">
              <Shield className="w-5 h-5 text-primary mb-2" />
              <div className="font-semibold text-sm text-header mb-1">Government Records</div>
              <p className="text-xs text-muted-foreground">Congressional documents, federal agency publications, court records, and official government databases.</p>
            </div>
            <div className="p-4 rounded-xl border bg-white">
              <FileSearch className="w-5 h-5 text-primary mb-2" />
              <div className="font-semibold text-sm text-header mb-1">Research Institutions</div>
              <p className="text-xs text-muted-foreground">Nonpartisan research organizations and accredited universities with published methodology and no advocacy mission.</p>
            </div>
            <div className="p-4 rounded-xl border bg-white">
              <CheckCircle className="w-5 h-5 text-primary mb-2" />
              <div className="font-semibold text-sm text-header mb-1">Verified News Organizations</div>
              <p className="text-xs text-muted-foreground">News organizations with published editorial standards, a documented corrections policy, and identifiable editorial leadership.</p>
            </div>
          </div>
        </div>

        {/* FAQ */}
        <div className="mb-12">
          <h2 className="font-display font-bold text-xl text-header mb-5">Common Questions</h2>
          <div className="space-y-5">
            <div className="border-b pb-5">
              <div className="font-semibold text-header mb-1">What can I submit for verification?</div>
              <p className="text-sm text-muted-foreground">Any news story, headline, social media claim, or URL you have seen and want to verify. Political claims, policy statements, viral stories — anything you are unsure about.</p>
            </div>
            <div className="border-b pb-5">
              <div className="font-semibold text-header mb-1">How fast will I get my result?</div>
              <p className="text-sm text-muted-foreground">Results are delivered on screen immediately after payment. You will also receive a confirmation by email.</p>
            </div>
            <div className="border-b pb-5">
              <div className="font-semibold text-header mb-1">What if you cannot verify my story?</div>
              <p className="text-sm text-muted-foreground">You receive a detailed explanation of what sources were checked and why no conclusion could be reached. "Cannot Verify" is an honest result, not a failure — it means the public record is genuinely inconclusive.</p>
            </div>
            <div className="border-b pb-5">
              <div className="font-semibold text-header mb-1">Is this a subscription?</div>
              <p className="text-sm text-muted-foreground">No. $1.95 per verification, pay as you go. No account required, no recurring charges.</p>
            </div>
            <div className="pb-5">
              <div className="font-semibold text-header mb-1">Can I share my result?</div>
              <p className="text-sm text-muted-foreground">Yes. Every result includes a shareable link so you can send it directly to anyone who needs to see the record.</p>
            </div>
          </div>
        </div>

        {/* Bottom CTA */}
        <div className="rounded-2xl text-center py-10 px-6" style={{ background: "#1A3A8F" }}>
          <h2 className="font-display font-extrabold text-2xl text-white mb-2">Stop Sharing. Start Verifying.</h2>
          <p className="text-white/70 text-sm mb-6">One story. One dollar ninety-five. The public record, checked.</p>
          <button
            className="inline-flex items-center gap-2 px-8 py-4 rounded-full font-display font-bold text-header text-lg transition-opacity hover:opacity-90"
            style={{ background: "#F5C518" }}
            onClick={() => alert("Payment coming soon — ClownCheck launching shortly.")}
          >
            Verify a Story — $1.95
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>

      </div>
    </Layout>
  );
}
