import { Layout } from "@/components/Layout";
import { ArrowRight, Lock } from "lucide-react";
import { usePageSeoHead } from "@/hooks/use-seo-head";

export default function ComprehensiveReport() {
  usePageSeoHead({
    title: "Verify News & Get Reports — Primary Source Intelligence",
    description: "Quick fact-checks ($4.95) or comprehensive dossiers ($24.95). For everyone from casual fact-checkers to journalists and researchers.",
    path: "/reports",
    schemaType: "ItemPage",
  });

  return (
    <Layout>
      <div className="min-h-screen flex flex-col">
        {/* Gold Gradient Top Bar */}
        <div className="h-1 bg-gradient-to-r from-secondary via-secondary to-amber-400" />

        {/* Hero Section */}
        <section className="relative py-16 px-4 bg-gradient-to-b from-header to-header/95 text-white">
          <div className="max-w-6xl mx-auto">
            <div className="grid sm:grid-cols-2 gap-12 items-center">
              {/* Left: Content */}
              <div>
                {/* Badge */}
                <div className="inline-flex items-center gap-2 bg-secondary/20 border border-secondary rounded-full px-4 py-2 mb-8">
                  <span className="text-sm font-bold text-secondary uppercase tracking-wider">Primary Source Intelligence</span>
                </div>

                <h1 className="font-sans font-bold text-5xl sm:text-6xl text-white leading-tight mb-6">
                  Truth <br />
                  <span className="text-secondary">Has a Paper Trail</span>
                </h1>

                <p className="text-lg text-white/80 mb-8 leading-relaxed">
                  Foreign governments. American politicians. AI-generated misinformation. Biased outlets with corporate owners. We built ClownBinge because we were done waiting for someone else to fix it.
                </p>

                <div className="space-y-3 mb-8">
                  <div className="flex items-start gap-3">
                    <span className="text-secondary text-xl mt-0.5">✓</span>
                    <span className="text-white">Verified against primary sources only</span>
                  </div>
                  <div className="flex items-start gap-3">
                    <span className="text-secondary text-xl mt-0.5">✓</span>
                    <span className="text-white">APA 7 cited for academic & legal use</span>
                  </div>
                  <div className="flex items-start gap-3">
                    <span className="text-secondary text-xl mt-0.5">✓</span>
                    <span className="text-white">No guessing, no interpretation—the record</span>
                  </div>
                </div>
              </div>

              {/* Right: Product Cards */}
              <div className="space-y-4">
                {/* Quick Verify Card */}
                <div className="rounded-2xl border-2 border-secondary p-6 bg-white hover:shadow-xl transition-shadow">
                  <div className="mb-4">
                    <span className="text-xs font-bold text-secondary uppercase tracking-wider">Quick Verification</span>
                  </div>
                  <h2 className="font-sans font-bold text-2xl text-primary mb-3">Analyze Any Claim</h2>
                  <p className="text-header text-base mb-4 leading-relaxed">
                    Submit a news story, quote, or claim. We verify it against primary sources.
                  </p>
                  <div className="font-sans font-extrabold text-4xl text-secondary mb-1">$4.95</div>
                  <p className="text-sm text-header mb-6">Instant results. Cited sources.</p>
                  <button
                    className="w-full inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full font-bold text-white text-sm transition-opacity hover:opacity-90"
                    style={{ background: "#1A3A8F" }}
                    onClick={() => alert("Verify ANY News launching shortly — enter your email to be notified.")}
                  >
                    Verify a Claim
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>

                {/* Full Report Card */}
                <div className="rounded-2xl border-2 border-secondary p-6 bg-white shadow-lg hover:shadow-2xl transition-shadow ring-2 ring-secondary/20">
                  <div className="mb-4">
                    <span className="text-xs font-bold text-secondary uppercase tracking-wider">Comprehensive Dossier</span>
                  </div>
                  <h2 className="font-sans font-bold text-2xl text-primary mb-3">Full Public Report</h2>
                  <p className="text-header text-base mb-4 leading-relaxed">
                    Up to 20-page verified dossier: voting record, finances, legal history, conflict assessment.
                  </p>
                  <div className="font-sans font-extrabold text-4xl text-secondary mb-1">$24.95</div>
                  <p className="text-sm text-header mb-6">24-hour delivery. APA 7 cited.</p>
                  <button
                    className="w-full inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full font-bold text-white text-sm transition-opacity hover:opacity-90"
                    style={{ background: "#1A3A8F" }}
                    onClick={() => alert("Comprehensive Reports launching shortly — enter your email to be notified.")}
                  >
                    Order Full Report
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Trust Section */}
        <section className="py-16 px-4 bg-white border-b">
          <div className="max-w-4xl mx-auto">
            <h2 className="font-sans font-bold text-2xl text-header text-center mb-12">Why Researchers & Journalists Trust ClownBinge</h2>
            <div className="grid sm:grid-cols-3 gap-6">
              <div className="p-6 rounded-xl border bg-slate-50">
                <div className="font-bold text-header mb-2">Public Record Only</div>
                <p className="text-header text-sm leading-relaxed">
                  Zero surveillance data. Zero private information. Every fact from publicly available government, legal, and verified news sources.
                </p>
              </div>
              <div className="p-6 rounded-xl border bg-slate-50">
                <div className="font-bold text-header mb-2">Report Honesty</div>
                <p className="text-header text-sm leading-relaxed">
                  We cannot guarantee the content of any report. We report what the public record contains. That's all we can promise.
                </p>
              </div>
              <div className="p-6 rounded-xl border bg-slate-50">
                <div className="font-bold text-header mb-2">Fast Turnaround</div>
                <p className="text-header text-sm leading-relaxed">
                  Quick Verify results appear instantly. Full Reports delivered as PDF within 24 hours to your inbox.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Quotes Section */}
        <section className="py-16 px-4 bg-slate-50">
          <div className="max-w-4xl mx-auto">
            <h2 className="font-sans font-bold text-2xl text-header text-center mb-12">Why This Matters</h2>
            <div className="space-y-6">
              <blockquote className="flex flex-col sm:flex-row gap-6 p-8 bg-white rounded-xl border-l-4" style={{ borderColor: "#F5C518" }}>
                <div className="text-4xl text-secondary/30 font-serif leading-none flex-shrink-0">"</div>
                <div>
                  <p className="text-lg text-header font-medium mb-2 leading-relaxed">
                    Sadly, every country has state-interest or political party interest-formed 'journalism'—we are all sick of it.
                  </p>
                  <p className="text-base text-header italic">
                    The cure is not less information. It's access to the primary sources themselves.
                  </p>
                </div>
              </blockquote>

              <blockquote className="flex flex-col sm:flex-row gap-6 p-8 bg-white rounded-xl border-l-4" style={{ borderColor: "#F5C518" }}>
                <div className="text-4xl text-secondary/30 font-serif leading-none flex-shrink-0">"</div>
                <div>
                  <p className="text-lg text-header font-medium mb-2 leading-relaxed">
                    In a world of misinformation, the journalist's job is to provide the receipts. Not interpretation. The primary source record itself.
                  </p>
                  <p className="text-base text-header italic">
                    Metricadia Research approach to accountability journalism
                  </p>
                </div>
              </blockquote>
            </div>
          </div>
        </section>

        {/* Use Cases */}
        <section className="py-16 px-4 bg-white">
          <div className="max-w-4xl mx-auto">
            <h2 className="font-sans font-bold text-2xl text-header mb-10">From Fact-Checkers to Researchers</h2>
            <div className="grid sm:grid-cols-2 gap-6">
              {[
                { label: "Casual Truth-Seekers", text: "You see a viral claim. $4.95 gets you the verified record in minutes." },
                { label: "Student Researchers", text: "Building a paper? Start with Quick Verify, expand to Full Report for your bibliography." },
                { label: "Journalists", text: "Before an interview, get a comprehensive dossier. Up to 20 pages. APA 7 citations. Ready to publish." },
                { label: "Academics & Think Tanks", text: "Baseline research drawn from primary sources. Citable. Defensible. Archival." },
                { label: "Civic Organizations", text: "Evaluating elected officials? Compare candidates using identical, verified dossiers." },
                { label: "Debate Prep", text: "See where the record contradicts the narrative. Instant ammunition for arguments." },
              ].map((item) => (
                <div key={item.label} className="p-5 rounded-xl border bg-slate-50">
                  <div className="font-bold text-header mb-2">{item.label}</div>
                  <p className="text-sm text-header">{item.text}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Process Section */}
        <section className="py-16 px-4 bg-slate-50">
          <div className="max-w-4xl mx-auto">
            <h2 className="font-sans font-bold text-2xl text-header mb-12">How It Works</h2>
            <div className="grid sm:grid-cols-2 gap-8">
              {/* Quick Verify */}
              <div>
                <h3 className="font-bold text-header mb-6">Quick Verify ($4.95)</h3>
                <div className="space-y-4">
                  {[
                    { step: "1", title: "Submit Your Claim", text: "Paste a news headline, quote, or statement." },
                    { step: "2", title: "We Search the Record", text: "Check primary sources, government databases, verified news." },
                    { step: "3", title: "Get Your Results", text: "See what's accurate, contradicted, or missing — instantly." },
                  ].map((item) => (
                    <div key={item.step} className="flex gap-4 items-start p-4 rounded-lg bg-white border">
                      <div className="w-8 h-8 rounded-full flex items-center justify-center font-bold text-white shrink-0" style={{ background: "#1A3A8F" }}>
                        {item.step}
                      </div>
                      <div>
                        <div className="font-semibold text-primary text-sm mb-0.5">{item.title}</div>
                        <p className="text-sm text-header">{item.text}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Full Report */}
              <div>
                <h3 className="font-bold text-header mb-6">Full Report ($24.95)</h3>
                <div className="space-y-4">
                  {[
                    { step: "1", title: "Order Your Report", text: "Provide the public figure's name and office." },
                    { step: "2", title: "We Compile the Record", text: "10 sections from government filings, court records, verified sources." },
                    { step: "3", title: "Receive Your PDF", text: "Up to 20-page APA 7-formatted report within 24 hours." },
                  ].map((item) => (
                    <div key={item.step} className="flex gap-4 items-start p-4 rounded-lg bg-white border">
                      <div className="w-8 h-8 rounded-full flex items-center justify-center font-bold text-white shrink-0" style={{ background: "#1A3A8F" }}>
                        {item.step}
                      </div>
                      <div>
                        <div className="font-semibold text-primary text-sm mb-0.5">{item.title}</div>
                        <p className="text-sm text-header">{item.text}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Legal Disclaimer */}
        <section className="py-12 px-4 bg-white">
          <div className="max-w-4xl mx-auto p-6 rounded-xl bg-slate-50 border text-sm text-header leading-relaxed flex gap-3">
            <Lock className="w-4 h-4 shrink-0 mt-0.5 text-primary" />
            <div>
              <p className="mb-3">
                <strong>Report Content Disclaimer:</strong> We cannot guarantee the content of any report. We report only what the publicly available record contains—voting records, legal filings, campaign finance data, news archives. That's our promise: the record, nothing more.
              </p>
              <p>
                ClownBinge Verify & Reports are compiled exclusively from publicly available legal records, government filings, court documents, official disclosures, and verified news sources. We do not obtain, use, or include private, non-public, or illegally obtained information. All findings reflect the documented public record as of the compilation date.
              </p>
            </div>
          </div>
        </section>

        {/* Final CTA */}
        <section className="py-20 px-4 bg-gradient-to-r from-header to-header/95 text-white text-center">
          <h2 className="font-sans font-bold text-4xl mb-4">
            The Record Is Public.<br />We Make It Accessible.
          </h2>
          <p className="text-white/80 text-lg mb-8 max-w-xl mx-auto">
            Whether you're fact-checking a claim or researching a career, ClownBinge turns the verified public record into intelligence you can use.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full font-bold text-header text-lg transition-opacity hover:opacity-90"
              style={{ background: "#F5C518" }}
              onClick={() => alert("Quick Verify launching shortly — enter your email to be notified.")}
            >
              Quick Verify — $4.95
              <ArrowRight className="w-5 h-5" />
            </button>
            <button
              className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full font-bold border-2 border-white text-white text-lg transition-colors hover:bg-white/10"
              onClick={() => alert("Comprehensive Reports launching shortly — enter your email to be notified.")}
            >
              Full Report — $24.95
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        </section>
      </div>
    </Layout>
  );
}
