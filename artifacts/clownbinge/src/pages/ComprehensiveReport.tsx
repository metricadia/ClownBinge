import { Layout } from "@/components/Layout";
import { ArrowRight, FileText, Shield, BookOpen, CheckCircle, Lock, Clock, Mail, Zap } from "lucide-react";
import { usePageSeoHead } from "@/hooks/use-seo-head";

const fullReportSections = [
  {
    number: "01",
    title: "Executive Profile",
    description: "Full biographical record including elected offices held, official titles, jurisdictions served, committee assignments, and documented public roles.",
  },
  {
    number: "02",
    title: "Voting Record & Legislative History",
    description: "Complete documented voting record on legislation, resolutions, and measures. Bills sponsored, co-sponsored, or opposed. Committee activity and attendance.",
  },
  {
    number: "03",
    title: "Campaign Finance & Donor Analysis",
    description: "Full Federal Election Commission or applicable disclosure records. Top donors, PAC relationships, industry contributions, and expenditure history.",
  },
  {
    number: "04",
    title: "Lobbying & Industry Relationships",
    description: "Documented relationships with registered lobbying entities. Revolving door history. Industry sector contribution patterns correlated with legislative positions.",
  },
  {
    number: "05",
    title: "Public Statements vs. Verified Record",
    description: "Material public statements cross-referenced against the documented record. Positions stated in public matched to votes, filings, and official actions.",
  },
  {
    number: "06",
    title: "Media Coverage History",
    description: "Documented coverage from verified news organizations. Major events, controversies, and public accountability moments on the record.",
  },
  {
    number: "07",
    title: "Ethics, Legal & Disciplinary Record",
    description: "Publicly filed ethics complaints, official investigations, disciplinary proceedings, civil litigation, and adjudicated outcomes accessible via public court records.",
  },
  {
    number: "08",
    title: "Policy Positions & Documented Stances",
    description: "Verified public positions on major policy issues drawn from official statements, votes, press releases, and documented public communications.",
  },
  {
    number: "09",
    title: "Conflict of Interest Assessment",
    description: "Financial disclosures cross-referenced against policy positions and votes. Documented business relationships, asset holdings, and relevant family financial interests on public record.",
  },
  {
    number: "10",
    title: "Verified Citations (APA 7)",
    description: "Every claim in the report is supported by a numbered APA 7 citation drawn exclusively from government records, verified research institutions, or recognized news organizations with published editorial standards.",
  },
];

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
        {/* Hero */}
        <section className="relative py-20 px-4 bg-gradient-to-b from-header to-header/95">
          <div className="max-w-6xl mx-auto text-center mb-16">
            <p className="text-xs font-semibold tracking-widest uppercase text-secondary mb-4">Primary Source Intelligence</p>
            <h1 className="font-sans font-bold text-4xl sm:text-5xl text-white leading-tight mb-4">
              Truth Has a Paper Trail.
            </h1>
            <p className="text-lg text-white/80 max-w-2xl mx-auto leading-relaxed">
              Whether you're fact-checking a viral claim, researching a candidate, or building a comprehensive dossier—we dig into the verified public record and hand you the receipts.
            </p>
            <div className="h-1 w-24 bg-secondary rounded-full mx-auto mt-8" />
          </div>

          {/* Two-Tier Product Grid */}
          <div className="max-w-6xl mx-auto grid sm:grid-cols-2 gap-8">
            {/* Quick Verify — $4.95 */}
            <div className="rounded-2xl border-2 border-secondary/50 p-8 bg-white hover:shadow-xl transition-shadow">
              <div className="flex items-start justify-between mb-6">
                <div>
                  <div className="inline-flex items-center gap-2 bg-secondary/10 rounded-full px-3 py-1 mb-3">
                    <Zap className="w-4 h-4 text-secondary" />
                    <span className="text-xs font-bold text-secondary uppercase tracking-wider">Quick Check</span>
                  </div>
                  <h2 className="font-display font-bold text-2xl text-header">Analyze Any Claim</h2>
                </div>
              </div>
              <p className="text-muted-foreground text-sm mb-6 leading-relaxed">
                Submit a news story, quote, or claim. We verify it against primary sources and show you what's accurate, what's missing, and what's contradicted by the record.
              </p>
              <div className="font-display font-extrabold text-4xl text-header mb-1">$4.95</div>
              <p className="text-xs text-muted-foreground mb-8">Instant results. Cited sources.</p>
              <button
                className="w-full inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full font-bold text-white text-sm transition-opacity hover:opacity-90"
                style={{ background: "#1A3A8F" }}
                onClick={() => alert("Verify ANY News launching shortly — enter your email to be notified.")}
              >
                Verify a Claim
                <ArrowRight className="w-4 h-4" />
              </button>

              <div className="mt-8 space-y-4 pt-8 border-t">
                <div className="text-xs">
                  <div className="font-bold text-header mb-1">Perfect for:</div>
                  <ul className="text-muted-foreground space-y-1">
                    <li>• Checking viral claims on social media</li>
                    <li>• Fact-checking before sharing</li>
                    <li>• Researching for school papers</li>
                    <li>• Preparing for a debate</li>
                    <li>• Breaking through misinformation</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Full Dossier — $24.95 */}
            <div className="rounded-2xl border-2 border-secondary p-8 bg-white shadow-lg hover:shadow-2xl transition-shadow ring-2 ring-secondary/20">
              <div className="flex items-start justify-between mb-6">
                <div>
                  <div className="inline-flex items-center gap-2 bg-secondary/10 rounded-full px-3 py-1 mb-3">
                    <FileText className="w-4 h-4 text-secondary" />
                    <span className="text-xs font-bold text-secondary uppercase tracking-wider">Comprehensive</span>
                  </div>
                  <h2 className="font-display font-bold text-2xl text-header">Full Public Dossier</h2>
                </div>
              </div>
              <p className="text-muted-foreground text-sm mb-6 leading-relaxed">
                A 20-page professionally compiled report on any public figure: voting record, financial disclosures, legal history, documented contradictions, conflict-of-interest assessment. Every claim verified and APA 7 cited.
              </p>
              <div className="font-display font-extrabold text-4xl text-header mb-1">$24.95</div>
              <p className="text-xs text-muted-foreground mb-8">20 pages. 24-hour delivery.</p>
              <button
                className="w-full inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full font-bold text-white text-sm transition-opacity hover:opacity-90"
                style={{ background: "#1A3A8F" }}
                onClick={() => alert("Comprehensive Reports launching shortly — enter your email to be notified.")}
              >
                Order Full Report
                <ArrowRight className="w-4 h-4" />
              </button>

              <div className="mt-8 space-y-4 pt-8 border-t">
                <div className="text-xs">
                  <div className="font-bold text-header mb-1">Perfect for:</div>
                  <ul className="text-muted-foreground space-y-1">
                    <li>• Journalists preparing for interviews</li>
                    <li>• Researchers and academics</li>
                    <li>• Voters evaluating candidates</li>
                    <li>• Civic organizations & advocacy groups</li>
                    <li>• Opposition research & campaigns</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Authority Quotes */}
        <section className="py-16 px-4 bg-slate-50 border-b">
          <div className="max-w-4xl mx-auto">
            <h2 className="font-display font-bold text-2xl text-header text-center mb-12">Why This Matters</h2>
            <div className="space-y-8">
              <blockquote className="flex flex-col sm:flex-row gap-6 p-8 bg-white rounded-xl border-l-4" style={{ borderColor: "#F5C518" }}>
                <div className="text-4xl text-secondary/30 font-serif leading-none flex-shrink-0">"</div>
                <div>
                  <p className="text-lg text-header font-medium mb-3 leading-relaxed">
                    Sadly, every country has state-interest or political party interest-formed 'journalism'—we are all sick of it.
                  </p>
                  <p className="text-sm text-muted-foreground italic">
                    The cure is not less information. It's access to the primary sources themselves.
                  </p>
                </div>
              </blockquote>

              <blockquote className="flex flex-col sm:flex-row gap-6 p-8 bg-white rounded-xl border-l-4" style={{ borderColor: "#F5C518" }}>
                <div className="text-4xl text-secondary/30 font-serif leading-none flex-shrink-0">"</div>
                <div>
                  <p className="text-lg text-header font-medium mb-3 leading-relaxed">
                    In a world of misinformation, the journalist's job is to provide the receipts. Not interpretation. The primary source record itself.
                  </p>
                  <p className="text-sm text-muted-foreground italic">
                    Primary Source Analytics approach to accountability journalism
                  </p>
                </div>
              </blockquote>

              <blockquote className="flex flex-col sm:flex-row gap-6 p-8 bg-white rounded-xl border-l-4" style={{ borderColor: "#F5C518" }}>
                <div className="text-4xl text-secondary/30 font-serif leading-none flex-shrink-0">"</div>
                <div>
                  <p className="text-lg text-header font-medium mb-3 leading-relaxed">
                    The American public has access to the documented record. Court filings. Congressional votes. SEC disclosures. FEC filings. The problem is not secrecy—it's that no one is systematically making the record readable.
                  </p>
                  <p className="text-sm text-muted-foreground italic">
                    On transparency in American governance
                  </p>
                </div>
              </blockquote>
            </div>
          </div>
        </section>

        {/* Trust Signals */}
        <section className="py-16 px-4 bg-white border-b">
          <div className="max-w-6xl mx-auto">
            <h2 className="font-display font-bold text-2xl text-header text-center mb-12">Why Researchers & Journalists Trust ClownBinge</h2>
            <div className="grid sm:grid-cols-3 gap-6">
              <div className="flex flex-col items-center text-center p-6 rounded-xl border bg-slate-50">
                <Shield className="w-8 h-8 text-primary mb-3" />
                <div className="font-semibold text-header mb-2">Public Record Only</div>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Zero surveillance data. Zero private information. Every fact drawn exclusively from publicly available government, legal, and verified news sources.
                </p>
              </div>
              <div className="flex flex-col items-center text-center p-6 rounded-xl border bg-slate-50">
                <BookOpen className="w-8 h-8 text-primary mb-3" />
                <div className="font-semibold text-header mb-2">APA 7 Citations</div>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Every claim is numbered. Every number links to the original source. Immediately citable for scholarly work, journalism, or legal proceedings.
                </p>
              </div>
              <div className="flex flex-col items-center text-center p-6 rounded-xl border bg-slate-50">
                <Clock className="w-8 h-8 text-primary mb-3" />
                <div className="font-semibold text-header mb-2">Fast Turnaround</div>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Quick Verify results appear instantly. Full Reports delivered as a PDF within 24 hours to your inbox, ready to use.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Full Report Contents */}
        <section className="py-16 px-4 bg-slate-50">
          <div className="max-w-4xl mx-auto">
            <h2 className="font-display font-bold text-2xl text-header mb-3">Inside a Full Report</h2>
            <p className="text-muted-foreground mb-8">
              Ten comprehensive sections. Every section sourced to the verified public record. Ready for citation, presentation, or publication.
            </p>
            <div className="space-y-0 border rounded-xl overflow-hidden bg-white">
              {fullReportSections.map((section, i) => (
                <div
                  key={section.number}
                  className={`flex gap-5 p-5 ${i < fullReportSections.length - 1 ? "border-b" : ""} hover:bg-slate-50 transition-colors`}
                >
                  <div
                    className="font-display font-extrabold text-2xl shrink-0 w-10 text-right leading-none pt-0.5"
                    style={{ color: "#F5C518" }}
                  >
                    {section.number}
                  </div>
                  <div>
                    <div className="font-display font-bold text-header text-base mb-1">{section.title}</div>
                    <p className="text-muted-foreground text-sm leading-relaxed">{section.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* The Spectrum of Users */}
        <section className="py-16 px-4 bg-white">
          <div className="max-w-4xl mx-auto">
            <h2 className="font-display font-bold text-2xl text-header mb-10">From Fact-Checkers to Researchers</h2>
            <div className="grid sm:grid-cols-2 gap-6">
              {[
                { label: "Casual Truth-Seekers", text: "You see a viral claim that doesn't sit right. $4.95 gets you the verified record in minutes.", price: "$4.95" },
                { label: "Student Researchers", text: "Building a paper on a political figure? Start with a Quick Verify, expand to a Full Report for your bibliography.", price: "$4.95–$24.95" },
                { label: "Journalists", text: "Before an interview or investigation, get a comprehensive dossier. 10 sections. 20 pages. APA 7 citations. Ready to publish.", price: "$24.95" },
                { label: "Academics & Think Tanks", text: "Baseline research on a public figure, drawn from primary sources. Citable. Defensible. Archival.", price: "$24.95" },
                { label: "Civic Organizations", text: "Evaluating elected officials for endorsements? Compare candidates using identical, verified dossiers.", price: "$24.95" },
                { label: "Debate Prep", text: "Need ammunition for a school debate or town hall? Quick Verify shows you where the record contradicts the narrative.", price: "$4.95" },
              ].map((item) => (
                <div key={item.label} className="flex flex-col p-5 rounded-xl border bg-slate-50">
                  <div className="font-bold text-header mb-2">{item.label}</div>
                  <p className="text-sm text-muted-foreground mb-3 flex-grow">{item.text}</p>
                  <div className="text-xs font-semibold text-primary">{item.price}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Process */}
        <section className="py-16 px-4 bg-slate-50">
          <div className="max-w-4xl mx-auto">
            <h2 className="font-display font-bold text-2xl text-header mb-2">How It Works</h2>
            <p className="text-muted-foreground text-sm mb-10">No account. No complexity. Two paths, same integrity.</p>
            <div className="grid sm:grid-cols-2 gap-8">
              {/* Quick Verify Process */}
              <div>
                <h3 className="font-bold text-header mb-6">Quick Verify ($4.95)</h3>
                <div className="space-y-4">
                  {[
                    { step: "1", title: "Submit Your Claim", text: "Paste a news headline, quote, or statement into our form." },
                    { step: "2", title: "We Search the Record", text: "Check against primary sources, government databases, and verified news archives." },
                    { step: "3", title: "Get Your Results", text: "See what's accurate, what's contradicted, and what's missing — instantly." },
                  ].map((item) => (
                    <div key={item.step} className="flex gap-4 items-start p-4 rounded-lg bg-white border">
                      <div className="w-8 h-8 rounded-full flex items-center justify-center font-bold text-white shrink-0" style={{ background: "#1A3A8F" }}>
                        {item.step}
                      </div>
                      <div>
                        <div className="font-semibold text-header text-sm mb-0.5">{item.title}</div>
                        <p className="text-xs text-muted-foreground">{item.text}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Full Report Process */}
              <div>
                <h3 className="font-bold text-header mb-6">Full Report ($24.95)</h3>
                <div className="space-y-4">
                  {[
                    { step: "1", title: "Order Your Report", text: "Provide the public figure's name and office. Secure checkout." },
                    { step: "2", title: "We Compile the Record", text: "Our team assembles 10 sections from government filings, court records, and verified sources. Every claim cited." },
                    { step: "3", title: "Receive Your PDF", text: "20-page APA 7-formatted report delivered to your email within 24 hours." },
                  ].map((item) => (
                    <div key={item.step} className="flex gap-4 items-start p-4 rounded-lg bg-white border">
                      <div className="w-8 h-8 rounded-full flex items-center justify-center font-bold text-white shrink-0" style={{ background: "#1A3A8F" }}>
                        {item.step}
                      </div>
                      <div>
                        <div className="font-semibold text-header text-sm mb-0.5">{item.title}</div>
                        <p className="text-xs text-muted-foreground">{item.text}</p>
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
          <div className="max-w-4xl mx-auto p-6 rounded-xl bg-slate-50 border text-xs text-muted-foreground leading-relaxed flex gap-3">
            <Lock className="w-4 h-4 shrink-0 mt-0.5 text-primary" />
            <p>
              ClownBinge Verify & Reports are compiled exclusively from publicly available legal records, government filings, court documents, official disclosures, and verified news sources. We do not obtain, use, or include private, non-public, or illegally obtained information. All findings reflect the documented public record as of the compilation date. ClownBinge does not warrant the completeness of any public record. All findings are subject to the source limitations of publicly available data.
            </p>
          </div>
        </section>

        {/* Final CTA */}
        <section className="py-20 px-4 bg-gradient-to-r from-header to-header/95 text-white text-center">
          <h2 className="font-display font-bold text-3xl mb-4">
            The Record Is Public. We Make It Accessible.
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
