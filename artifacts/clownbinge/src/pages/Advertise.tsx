import { Layout } from "@/components/Layout";
import { CheckCircle, Users, FileText, Shield, TrendingUp, Mail, BarChart3, BookOpen } from "lucide-react";

const FORMATS = [
  {
    icon: BookOpen,
    color: "bg-primary",
    title: "Category Sponsorship",
    description:
      "Own an entire editorial category. Your brand appears as the presenting sponsor of every article published under a ClownBinge category — Law & Justice, Investigations, U.S. History, and more.",
    details: ["Persistent logo placement across category", "Included in category social amplification", "First-right-of-refusal for category exclusivity", "Monthly audience delivery report"],
    rate: "From $2,500 / month",
  },
  {
    icon: FileText,
    color: "bg-red-700",
    title: "Sponsored Research Brief",
    description:
      "Commission a ClownBinge-standard primary-source research brief, clearly labeled as sponsored content, on a topic of documented public interest aligned with your organization's mission.",
    details: ["Full editorial independence maintained", "Clearly labeled 'Sponsored Research'", "Primary sources cited, methodology documented", "Permanent archive placement"],
    rate: "From $3,500 / placement",
  },
  {
    icon: BarChart3,
    color: "bg-emerald-700",
    title: "ClownCheck Report Sponsorship",
    description:
      "Sponsor our flagship verification product. Your brand is associated with the gold standard of factual accountability — every ClownCheck report delivered to readers includes your sponsorship mark.",
    details: ["Co-branding on every verification PDF", "Mention in verification confirmation emails", "Quarterly impact and volume report", "Preferred placement in the ClownCheck tool"],
    rate: "From $1,500 / month",
  },
  {
    icon: TrendingUp,
    color: "bg-violet-700",
    title: "In-Article Display",
    description:
      "High-attention display units placed within long-form primary source articles. ClownBinge readers are deep readers — the average session length exceeds six minutes per article.",
    details: ["Mid-article and footer placement available", "Desktop and mobile optimized creative", "Category targeting available", "Weekly click and impression reporting"],
    rate: "From $750 / month",
  },
];

const AUDIENCE = [
  { label: "Civic Engagement", value: "High", note: "Readers who cross-reference primary sources" },
  { label: "Education", value: "Post-graduate majority", note: "Audience drawn to documented, cited journalism" },
  { label: "Average session", value: "6+ min", note: "Long-form primary source readers" },
  { label: "Return visits", value: "High frequency", note: "Accountability journalism creates habitual readers" },
];

const BRAND_SAFE = [
  "No clickbait. No manufactured outrage. No untested claims.",
  "Every article cites primary sources. Every fact is documented.",
  "Editorial and advertising are structurally separated.",
  "Sponsored content is always clearly and prominently labeled.",
  "We do not accept advertising from campaigns, PACs, or dark money groups.",
  "We do not accept advertising that contradicts documented public record.",
];

export default function Advertise() {
  return (
    <Layout>
      {/* Hero */}
      <div className="bg-header text-white">
        <div className="cb-container py-16 sm:py-24">
          <p className="text-xs font-bold tracking-widest uppercase text-secondary mb-4">
            Advertise with ClownBinge
          </p>
          <h1 className="font-sans font-black text-4xl sm:text-5xl lg:text-6xl leading-tight mb-6 max-w-4xl">
            Your brand, next to the{" "}
            <span className="text-secondary">primary source.</span>
          </h1>
          <p className="text-white/75 text-lg sm:text-xl max-w-2xl leading-relaxed mb-10">
            ClownBinge readers came here because they wanted to know what the record actually says.
            They are not passive consumers of information. They are people who verify. Reaching
            them means something different than reaching any other audience.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <a
              href="mailto:advertising@clownbinge.com"
              className="inline-flex items-center gap-2 bg-secondary text-gray-900 font-bold px-8 py-4 rounded-full text-sm uppercase tracking-wider hover:bg-secondary/90 transition-colors"
            >
              <Mail className="w-4 h-4" />
              Start a Conversation
            </a>
            <a
              href="#formats"
              className="inline-flex items-center gap-2 border border-white/30 text-white font-bold px-8 py-4 rounded-full text-sm uppercase tracking-wider hover:bg-white/10 transition-colors"
            >
              See Ad Formats
            </a>
          </div>
        </div>
      </div>

      {/* Brand safety strip */}
      <div className="bg-secondary">
        <div className="cb-container py-4">
          <p className="text-gray-900 text-sm font-bold text-center tracking-wide uppercase">
            Brand-safe. Source-documented. Editorially independent.
          </p>
        </div>
      </div>

      {/* Audience */}
      <div className="bg-gray-50 border-b">
        <div className="cb-container py-14">
          <div className="max-w-3xl mx-auto text-center mb-12">
            <p className="text-xs font-bold tracking-widest uppercase text-primary mb-3">The Audience</p>
            <h2 className="font-sans font-black text-3xl sm:text-4xl text-header mb-4">
              Readers who read to the end.
            </h2>
            <p className="text-muted-foreground text-base leading-relaxed">
              ClownBinge publishes long-form, citation-heavy accountability journalism. Our
              audience self-selects for exactitude. They follow up. They share primary source links.
              They are the people other people trust to know what actually happened.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {AUDIENCE.map((a) => (
              <div key={a.label} className="bg-white rounded-2xl border shadow-sm p-6">
                <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-2">{a.label}</p>
                <p className="font-black text-2xl text-header mb-1">{a.value}</p>
                <p className="text-xs text-muted-foreground leading-snug">{a.note}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Ad Formats */}
      <div className="bg-white" id="formats">
        <div className="cb-container py-16">
          <div className="max-w-3xl mx-auto text-center mb-12">
            <p className="text-xs font-bold tracking-widest uppercase text-primary mb-3">Ad Formats</p>
            <h2 className="font-sans font-black text-3xl sm:text-4xl text-header mb-4">
              Four ways to be in the record.
            </h2>
            <p className="text-muted-foreground text-base leading-relaxed">
              Every format is held to the same standard as our editorial content: transparent,
              sourced, and honest about what it is.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {FORMATS.map((f) => {
              const Icon = f.icon;
              return (
                <div key={f.title} className="rounded-2xl border shadow-sm overflow-hidden flex flex-col">
                  <div className={`${f.color} px-6 py-5 flex items-center gap-4`}>
                    <div className="bg-white/20 rounded-xl p-2.5">
                      <Icon className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h3 className="font-black text-white text-lg leading-tight">{f.title}</h3>
                      <p className="text-white/80 text-xs font-bold uppercase tracking-wider mt-0.5">{f.rate}</p>
                    </div>
                  </div>
                  <div className="p-6 flex flex-col flex-1 bg-white">
                    <p className="text-muted-foreground text-sm leading-relaxed mb-5">{f.description}</p>
                    <ul className="space-y-2 mt-auto">
                      {f.details.map((d) => (
                        <li key={d} className="flex items-start gap-2 text-sm text-foreground">
                          <CheckCircle className="w-4 h-4 text-green-600 shrink-0 mt-0.5" />
                          {d}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Brand safety */}
      <div className="bg-header text-white">
        <div className="cb-container py-14">
          <div className="max-w-4xl mx-auto">
            <div className="flex items-start gap-4 mb-8">
              <div className="bg-secondary/20 rounded-xl p-3 shrink-0">
                <Shield className="w-6 h-6 text-secondary" />
              </div>
              <div>
                <p className="text-xs font-bold tracking-widest uppercase text-secondary mb-2">Brand Safety Policy</p>
                <h2 className="font-black text-3xl sm:text-4xl leading-tight">
                  We protect the record. That protects your brand.
                </h2>
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {BRAND_SAFE.map((item) => (
                <div key={item} className="flex items-start gap-3 bg-white/5 rounded-xl px-5 py-4">
                  <CheckCircle className="w-4 h-4 text-secondary shrink-0 mt-0.5" />
                  <p className="text-white/85 text-sm leading-snug">{item}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Who we will and won't work with */}
      <div className="bg-gray-50 border-b">
        <div className="cb-container py-14">
          <div className="max-w-3xl mx-auto">
            <p className="text-xs font-bold tracking-widest uppercase text-primary mb-3">Our Standards</p>
            <h2 className="font-sans font-black text-3xl text-header mb-6">We work with organizations that have something real to say.</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 text-sm leading-relaxed text-muted-foreground">
              <div>
                <p className="font-black text-base text-green-700 mb-3">We welcome</p>
                <ul className="space-y-2">
                  {[
                    "Nonprofits and advocacy organizations with documented missions",
                    "Publishers, journals, and academic institutions",
                    "Legal services, civic tech, and public information tools",
                    "Businesses whose products serve civic engagement",
                    "Organizations comfortable with primary-source readers",
                  ].map((i) => (
                    <li key={i} className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-green-600 shrink-0 mt-0.5" />
                      {i}
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <p className="font-black text-base text-red-700 mb-3">We do not accept</p>
                <ul className="space-y-2">
                  {[
                    "Political campaigns, PACs, or dark money organizations",
                    "Advertising that contradicts documented public record",
                    "Products or services ClownBinge has reported on critically",
                    "Advertising conditioned on editorial outcomes or story suppression",
                    "Any entity that has attempted to misrepresent primary sources",
                  ].map((i) => (
                    <li key={i} className="flex items-start gap-2">
                      <span className="text-red-500 font-black shrink-0 mt-0.5">&#x2715;</span>
                      {i}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* CTA */}
      <div className="bg-white">
        <div className="cb-container py-16">
          <div className="max-w-2xl mx-auto text-center">
            <div className="inline-flex items-center justify-center bg-secondary/15 rounded-full px-4 py-2 mb-6">
              <Users className="w-4 h-4 text-primary mr-2" />
              <span className="text-xs font-bold uppercase tracking-widest text-primary">Get in Touch</span>
            </div>
            <h2 className="font-black text-3xl sm:text-4xl text-header mb-4 leading-tight">
              Ready to be next to the source?
            </h2>
            <p className="text-muted-foreground text-base leading-relaxed mb-8">
              All advertising inquiries are reviewed by our editorial team before acceptance.
              We respond to every inquiry within two business days. Rates and availability
              are discussed directly.
            </p>
            <a
              href="mailto:advertising@clownbinge.com"
              className="inline-flex items-center gap-2 bg-primary text-white font-bold px-10 py-4 rounded-full text-sm uppercase tracking-wider hover:bg-primary/90 transition-colors shadow-lg"
            >
              <Mail className="w-4 h-4" />
              advertising@clownbinge.com
            </a>
            <p className="text-xs text-muted-foreground mt-6">
              Primary Source Analytics, LLC &nbsp;·&nbsp; ClownBinge.com &nbsp;·&nbsp; All advertising subject to editorial review.
            </p>
          </div>
        </div>
      </div>
    </Layout>
  );
}
