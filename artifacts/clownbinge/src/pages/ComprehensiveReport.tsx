import { Layout } from "@/components/Layout";
import { ArrowRight, FileText, Shield, BookOpen, CheckCircle, Lock, Clock, Mail } from "lucide-react";

const reportSections = [
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
  return (
    <Layout>
      <div className="max-w-3xl mx-auto px-4 py-12">

        {/* Header */}
        <div className="mb-10">
          <p className="text-xs font-semibold tracking-widest uppercase text-primary mb-3">ClownBinge Intelligence</p>
          <h1 className="font-display font-extrabold text-3xl sm:text-4xl text-header leading-tight mb-4">
            The Complete Public Record.<br />
            <span style={{ color: "#F5C518" }}>On Anyone Who Holds Power.</span>
          </h1>
          <p className="text-muted-foreground text-lg leading-relaxed max-w-2xl">
            A 20-page verified public record report on any elected official or public figure. Everything that is legally available, professionally compiled, and delivered to your inbox.
          </p>
          <div className="h-1 w-full bg-[#F5C518] rounded-full mt-6" />
        </div>

        {/* Price + CTA */}
        <div className="rounded-2xl border-2 p-8 mb-12 text-center" style={{ borderColor: "#1A3A8F", background: "#f8f9fe" }}>
          <div className="inline-flex items-center gap-2 bg-white border border-gray-200 rounded-full px-4 py-1.5 mb-4">
            <FileText className="w-3.5 h-3.5 text-primary" />
            <span className="text-xs font-semibold tracking-wider uppercase text-muted-foreground">Comprehensive PDF Report</span>
          </div>
          <div className="font-display font-extrabold text-5xl mb-1" style={{ color: "#1A3A8F" }}>
            $24.95
          </div>
          <p className="text-muted-foreground text-sm mb-2">Per report. Delivered to your email within 24 hours.</p>
          <p className="text-xs text-muted-foreground mb-6">20 pages. APA 7 citations. Verified public record only.</p>
          <button
            className="inline-flex items-center gap-2 px-8 py-4 rounded-full font-display font-bold text-white text-lg transition-opacity hover:opacity-90"
            style={{ background: "#1A3A8F" }}
            onClick={() => alert("Reports launching shortly — enter your email to be notified.")}
          >
            Order a Report Now
            <ArrowRight className="w-5 h-5" />
          </button>
          <p className="text-xs text-muted-foreground mt-3">Secure checkout. You will be prompted to provide the subject's name and office.</p>
        </div>

        {/* Trust signals */}
        <div className="grid sm:grid-cols-3 gap-4 mb-14">
          <div className="flex flex-col items-center text-center p-5 rounded-xl border bg-white">
            <Shield className="w-6 h-6 text-primary mb-2" />
            <div className="font-semibold text-sm text-header mb-1">Public Record Only</div>
            <p className="text-xs text-muted-foreground">Every fact in your report is drawn from publicly available government, legal, and verified news records. No private data. No surveillance.</p>
          </div>
          <div className="flex flex-col items-center text-center p-5 rounded-xl border bg-white">
            <BookOpen className="w-6 h-6 text-primary mb-2" />
            <div className="font-semibold text-sm text-header mb-1">APA 7 Citations</div>
            <p className="text-xs text-muted-foreground">Every claim is cited. Every citation is numbered. You can verify every statement in your report against the original source.</p>
          </div>
          <div className="flex flex-col items-center text-center p-5 rounded-xl border bg-white">
            <Clock className="w-6 h-6 text-primary mb-2" />
            <div className="font-semibold text-sm text-header mb-1">24-Hour Delivery</div>
            <p className="text-xs text-muted-foreground">Your completed report is delivered as a professionally formatted PDF to your email address within 24 hours of your order.</p>
          </div>
        </div>

        {/* What's inside */}
        <div className="mb-14">
          <h2 className="font-display font-bold text-2xl text-header mb-2">What Your Report Contains</h2>
          <p className="text-muted-foreground text-sm mb-8">
            Twenty pages. Ten substantive sections. Every section sourced to the verified public record.
          </p>
          <div className="space-y-0 border rounded-xl overflow-hidden">
            {reportSections.map((section, i) => (
              <div
                key={section.number}
                className={`flex gap-5 p-5 ${i < reportSections.length - 1 ? "border-b" : ""} bg-white hover:bg-slate-50 transition-colors`}
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

        {/* Who orders */}
        <div className="mb-14">
          <h2 className="font-display font-bold text-2xl text-header mb-5">Who Orders These Reports</h2>
          <div className="grid sm:grid-cols-2 gap-4">
            {[
              { label: "Voters", text: "Researching a candidate before an election with a complete picture of their official record." },
              { label: "Journalists", text: "Needing a verified baseline on a public official before an interview or investigation." },
              { label: "Civic Organizations", text: "Evaluating elected officials' records for endorsements, campaigns, or advocacy." },
              { label: "Opposing Campaigns", text: "Building an opposition research foundation from verified public documents only." },
              { label: "Academics & Researchers", text: "Requiring a citable, APA 7-formatted baseline on a political figure for scholarly work." },
              { label: "Concerned Citizens", text: "Wanting to know the documented truth about someone who holds power over their community." },
            ].map((item) => (
              <div key={item.label} className="flex gap-3 p-4 rounded-xl border bg-white">
                <CheckCircle className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                <div>
                  <div className="font-semibold text-sm text-header mb-0.5">{item.label}</div>
                  <p className="text-xs text-muted-foreground">{item.text}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Process */}
        <div className="mb-14">
          <h2 className="font-display font-bold text-2xl text-header mb-2">How to Order</h2>
          <p className="text-muted-foreground text-sm mb-6">Three steps. No account required.</p>
          <div className="space-y-4">
            {[
              { step: "1", title: "Place Your Order", text: "Provide the name of the public official or public figure and their office or role. Checkout securely for $24.95." },
              { step: "2", title: "We Compile the Record", text: "Our team assembles your report from verified government records, public filings, and recognized news sources. Every claim is cited." },
              { step: "3", title: "Receive Your PDF", text: "Your 20-page APA 7-formatted report is delivered to your email within 24 hours. Professionally formatted. Immediately citable." },
            ].map((item) => (
              <div key={item.step} className="flex gap-5 items-start p-5 rounded-xl border bg-white">
                <div
                  className="w-9 h-9 rounded-full flex items-center justify-center font-display font-extrabold text-white text-sm shrink-0"
                  style={{ background: "#1A3A8F" }}
                >
                  {item.step}
                </div>
                <div>
                  <div className="font-semibold text-header mb-1">{item.title}</div>
                  <p className="text-sm text-muted-foreground">{item.text}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Disclaimer */}
        <div className="mb-14 p-5 rounded-xl bg-slate-50 border text-xs text-muted-foreground leading-relaxed flex gap-3">
          <Lock className="w-4 h-4 shrink-0 mt-0.5 text-primary" />
          <p>
            ClownBinge Comprehensive Reports are compiled exclusively from publicly available legal records, government filings, court documents, official disclosures, and verified news sources. We do not obtain, use, or include private, non-public, or illegally obtained information. Reports reflect the documented public record as of the date of compilation. ClownBinge does not warrant the completeness of any public record. All findings are subject to the source limitations of publicly available data.
          </p>
        </div>

        {/* Bottom CTA */}
        <div className="rounded-2xl text-center py-10 px-6" style={{ background: "#1A3A8F" }}>
          <Mail className="w-8 h-8 text-white/60 mx-auto mb-3" />
          <h2 className="font-display font-extrabold text-2xl text-white mb-2">
            The Complete Record. $24.95.
          </h2>
          <p className="text-white/70 text-sm mb-6">
            Twenty pages. Ten sections. Every claim verified and cited. Delivered to your inbox in 24 hours.
          </p>
          <button
            className="inline-flex items-center gap-2 px-8 py-4 rounded-full font-display font-bold text-header text-lg transition-opacity hover:opacity-90"
            style={{ background: "#F5C518" }}
            onClick={() => alert("Reports launching shortly — enter your email to be notified.")}
          >
            Order Your Report — $24.95
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>

      </div>
    </Layout>
  );
}
