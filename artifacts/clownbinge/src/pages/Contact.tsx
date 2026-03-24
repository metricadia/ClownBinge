import { Layout } from "@/components/Layout";
import { AdminNav } from "@/components/AdminNav";
import { Link } from "wouter";
import {
  Send, MapPin, Mail, MessageSquare, FileText, CheckCircle,
  Shield, TrendingUp, BookOpen, BarChart3, Users
} from "lucide-react";

const FORMATS = [
  {
    icon: BookOpen,
    color: "#1A3A8F",
    title: "Category Sponsorship",
    description:
      "Own an entire editorial category. Your brand appears as the presenting sponsor of every article published under a ClownBinge category.",
    details: ["Persistent logo placement across category", "Included in category social amplification", "Monthly audience delivery report"],
    rate: "From $2,500 / month",
  },
  {
    icon: FileText,
    color: "#7c2d12",
    title: "Sponsored Research Brief",
    description:
      "Commission a ClownBinge-standard primary-source research brief, clearly labeled as sponsored content, on a topic of documented public interest.",
    details: ["Full editorial independence maintained", "Clearly labeled sponsored content", "Primary sources cited, methodology documented"],
    rate: "From $3,500 / placement",
  },
  {
    icon: BarChart3,
    color: "#065f46",
    title: "ClownCheck Report Sponsorship",
    description:
      "Sponsor our flagship verification product. Your brand associated with the gold standard of factual accountability.",
    details: ["Co-branding on every verification PDF", "Mention in confirmation emails", "Quarterly impact report"],
    rate: "From $1,500 / month",
  },
  {
    icon: TrendingUp,
    color: "#4c1d95",
    title: "In-Article Display",
    description:
      "High-attention display units placed within long-form primary source articles. Average session length exceeds six minutes per article.",
    details: ["Mid-article and footer placement", "Desktop and mobile optimized", "Weekly impression reporting"],
    rate: "From $750 / month",
  },
];

const BRAND_SAFE = [
  "No clickbait. No manufactured outrage. No untested claims.",
  "Every article cites primary sources. Every fact is documented.",
  "Editorial and advertising are structurally separated.",
  "Sponsored content is always clearly and prominently labeled.",
  "We do not accept advertising from campaigns, PACs, or dark money groups.",
  "We do not accept advertising that contradicts documented public record.",
];

export default function Contact() {
  return (
    <Layout>
      <div className="max-w-5xl mx-auto px-4 py-12">

        <div className="max-w-3xl mb-10">
          <p className="text-xs font-semibold tracking-widest uppercase text-primary mb-3">Get In Touch</p>
          <h1 className="font-sans font-bold text-3xl sm:text-4xl text-header leading-tight mb-4">
            Got Receipts?
          </h1>
          <p className="text-muted-foreground text-sm">
            Primary Source Analytics, LLC &mdash; ClownBinge.com &mdash; Tips, press inquiries, corrections &amp; advertising
          </p>
          <div className="h-1 w-full bg-[#F5C518] rounded-full mt-6" />
        </div>

        <AdminNav />

        {/* Submit a Post */}
        <div className="mb-6 rounded-2xl p-6 flex flex-col sm:flex-row items-center gap-6" style={{ background: "#1A3A8F" }}>
          <div className="flex-1">
            <p className="text-xs font-bold tracking-widest uppercase mb-1" style={{ color: "#F5C518" }}>Got Receipts?</p>
            <h2 className="font-bold text-xl text-white mb-2">Submit a Post</h2>
            <p className="text-sm leading-relaxed" style={{ color: "rgba(255,255,255,0.75)" }}>
              Have a primary source the public needs to see? A documented vote, court filing, government record, peer-reviewed study, or verified fact on any public figure, institution, or claim. Submit it and we will review it for publication.
            </p>
          </div>
          <Link href="/submit" className="shrink-0 inline-flex items-center gap-2 font-bold px-6 py-3 rounded-full transition-opacity hover:opacity-90 text-sm" style={{ background: "#F5C518", color: "#1A3A8F" }}>
            <FileText className="w-4 h-4" />
            Submit a Post
          </Link>
        </div>

        {/* Contact form + info */}
        <div className="flex flex-col lg:flex-row gap-12 mb-16">

          {/* Contact Info */}
          <div className="w-full lg:w-1/3 space-y-8">
            <div className="bg-muted p-8 rounded-2xl border border-border">
              <h3 className="font-bold text-xl mb-6 text-foreground border-b border-border pb-4">Corporate Info</h3>

              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="bg-white p-2 rounded-lg shadow-sm border border-border shrink-0">
                    <MapPin className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-bold text-sm text-foreground">Mailing Address</p>
                    <p className="text-sm text-muted-foreground mt-1 leading-relaxed">
                      Primary Source Analytics, LLC<br />
                      1309 Coffeen Avenue STE 1200<br />
                      Sheridan, Wyoming 82801
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="bg-white p-2 rounded-lg shadow-sm border border-border shrink-0">
                    <Mail className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-bold text-sm text-foreground">General Inquiries</p>
                    <a href="mailto:contact@clownbinge.com" className="text-sm text-primary hover:underline mt-1 block">
                      contact@clownbinge.com
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="bg-white p-2 rounded-lg shadow-sm border border-border shrink-0">
                    <MessageSquare className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-bold text-sm text-foreground">Secure Tips</p>
                    <p className="text-sm text-muted-foreground mt-1">
                      Use Signal or ProtonMail for sensitive documents. Contact general email for public key.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="bg-white p-2 rounded-lg shadow-sm border border-border shrink-0">
                    <Mail className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-bold text-sm text-foreground">Advertising</p>
                    <a href="mailto:advertising@clownbinge.com" className="text-sm text-primary hover:underline mt-1 block">
                      advertising@clownbinge.com
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="w-full lg:w-2/3">
            <div className="bg-white border-2 border-border shadow-xl rounded-2xl p-8 sm:p-10">
              <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-foreground">First Name</label>
                    <input
                      type="text"
                      className="w-full bg-background border-2 border-border rounded-xl px-4 py-3 focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all"
                      placeholder="John"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-foreground">Email Address *</label>
                    <input
                      type="email"
                      required
                      className="w-full bg-background border-2 border-border rounded-xl px-4 py-3 focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all"
                      placeholder="john@example.com"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-bold text-foreground">Subject / Case Category</label>
                  <select className="w-full bg-background border-2 border-border rounded-xl px-4 py-3 focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all text-foreground">
                    <option>General Inquiry</option>
                    <option>Submit a Tip / Receipt</option>
                    <option>Advertising Inquiry</option>
                    <option>Academic/Bulk Book Order</option>
                    <option>Press Inquiry</option>
                    <option>Website Bug Report</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-bold text-foreground">Message *</label>
                  <textarea
                    rows={6}
                    required
                    className="w-full bg-background border-2 border-border rounded-xl px-4 py-3 focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all resize-none"
                    placeholder="Provide context, links to public records, or C-SPAN timestamps..."
                  />
                </div>

                <button
                  type="submit"
                  className="w-full bg-primary text-white font-bold text-lg py-4 rounded-xl shadow-lg hover:shadow-xl hover:-translate-y-0.5 active:translate-y-0 transition-all flex items-center justify-center gap-2"
                >
                  <Send className="w-5 h-5" />
                  Submit to Editorial
                </button>

                <p className="text-xs text-center text-muted-foreground mt-4">
                  By submitting this form, you acknowledge that ClownBinge is a journalistic entity and any tips submitted may be investigated for publication.
                </p>
              </form>
            </div>
          </div>
        </div>
      </div>

      {/* ── ADVERTISING SECTION ─────────────────────────────── */}
      <div id="advertise" className="w-full border-t border-gray-200">

        {/* Advertising hero */}
        <div className="w-full" style={{ background: "#1A3A8F" }}>
          <div className="max-w-5xl mx-auto px-6 py-14">
            <p className="text-xs font-bold tracking-widest uppercase mb-3" style={{ color: "#F5C518" }}>
              Advertise with ClownBinge
            </p>
            <h2 className="font-sans font-black text-3xl sm:text-4xl text-white leading-tight mb-4 max-w-3xl">
              Your brand, next to the <span style={{ color: "#F5C518" }}>primary source.</span>
            </h2>
            <p className="text-white/75 text-base max-w-2xl leading-relaxed mb-8">
              ClownBinge readers came here because they wanted to know what the record actually says. They are educators, researchers, and engaged citizens who verify. Reaching them means something different than reaching any other audience.
            </p>
            <div className="inline-block bg-[#F5C518] text-[#1A3A8F] font-bold px-4 py-1.5 rounded-full text-xs uppercase tracking-widest mb-0">
              Brand-safe. Source-documented. Editorially independent.
            </div>
          </div>
        </div>

        {/* Audience stats */}
        <div className="w-full bg-gray-50 border-b border-gray-200">
          <div className="max-w-5xl mx-auto px-6 py-12">
            <p className="text-xs font-bold tracking-widest uppercase text-primary mb-8">The Audience</p>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                { label: "Civic Engagement", value: "High", note: "Readers who cross-reference primary sources" },
                { label: "Education", value: "Post-grad majority", note: "Drawn to documented, cited journalism" },
                { label: "Avg. Session", value: "6+ min", note: "Long-form primary source readers" },
                { label: "Return Visits", value: "High frequency", note: "Accountability journalism creates habitual readers" },
              ].map((a) => (
                <div key={a.label} className="bg-white rounded-2xl border shadow-sm p-5">
                  <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-2">{a.label}</p>
                  <p className="font-black text-xl text-header mb-1">{a.value}</p>
                  <p className="text-xs text-muted-foreground leading-snug">{a.note}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Ad formats */}
        <div className="w-full bg-white">
          <div className="max-w-5xl mx-auto px-6 py-12">
            <p className="text-xs font-bold tracking-widest uppercase text-primary mb-2">Ad Formats</p>
            <h3 className="font-black text-2xl sm:text-3xl text-header mb-8">Four ways to be in the record.</h3>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
              {FORMATS.map((f) => {
                const Icon = f.icon;
                return (
                  <div key={f.title} className="rounded-2xl border shadow-sm overflow-hidden flex flex-col">
                    <div className="px-6 py-4 flex items-center gap-4" style={{ background: f.color }}>
                      <div className="bg-white/20 rounded-xl p-2.5 shrink-0">
                        <Icon className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <h4 className="font-black text-white text-base leading-tight">{f.title}</h4>
                        <p className="text-white/80 text-xs font-bold uppercase tracking-wider mt-0.5">{f.rate}</p>
                      </div>
                    </div>
                    <div className="p-5 flex flex-col flex-1 bg-white">
                      <p className="text-muted-foreground text-sm leading-relaxed mb-4">{f.description}</p>
                      <ul className="space-y-1.5">
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

        {/* Brand safety + who we work with */}
        <div className="w-full" style={{ background: "#1A3A8F" }}>
          <div className="max-w-5xl mx-auto px-6 py-12">
            <div className="flex items-start gap-4 mb-8">
              <div className="bg-white/10 rounded-xl p-3 shrink-0">
                <Shield className="w-5 h-5" style={{ color: "#F5C518" }} />
              </div>
              <div>
                <p className="text-xs font-bold tracking-widest uppercase mb-1" style={{ color: "#F5C518" }}>Brand Safety Policy</p>
                <h3 className="font-black text-2xl text-white leading-tight">
                  We protect the record. <span style={{ color: "#F5C518" }}>That protects your brand.</span>
                </h3>
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-10">
              {BRAND_SAFE.map((item) => (
                <div key={item} className="flex items-start gap-3 bg-white/5 rounded-xl px-4 py-3">
                  <CheckCircle className="w-4 h-4 shrink-0 mt-0.5" style={{ color: "#F5C518" }} />
                  <p className="text-white/80 text-sm leading-snug">{item}</p>
                </div>
              ))}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 bg-white/5 rounded-2xl p-6">
              <div>
                <p className="font-black text-base mb-3 text-green-400">We welcome</p>
                <ul className="space-y-2 text-sm text-white/75">
                  {["Nonprofits and advocacy organizations with documented missions", "Publishers, journals, and academic institutions", "Legal services, civic tech, and public information tools", "Businesses whose products serve civic engagement"].map((i) => (
                    <li key={i} className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-green-400 shrink-0 mt-0.5" />{i}
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <p className="font-black text-base mb-3 text-red-400">We do not accept</p>
                <ul className="space-y-2 text-sm text-white/75">
                  {["Political campaigns, PACs, or dark money organizations", "Advertising that contradicts documented public record", "Products or services ClownBinge has reported on critically", "Any entity that has attempted to misrepresent primary sources"].map((i) => (
                    <li key={i} className="flex items-start gap-2">
                      <span className="text-red-400 font-black shrink-0 mt-0.5">&#x2715;</span>{i}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Advertising CTA */}
        <div className="w-full bg-white border-t border-gray-100">
          <div className="max-w-5xl mx-auto px-6 py-12 text-center">
            <div className="inline-flex items-center justify-center bg-primary/10 rounded-full px-4 py-2 mb-5">
              <Users className="w-4 h-4 text-primary mr-2" />
              <span className="text-xs font-bold uppercase tracking-widest text-primary">Get in Touch</span>
            </div>
            <h3 className="font-black text-2xl sm:text-3xl text-header mb-3">Ready to be next to the source?</h3>
            <p className="text-muted-foreground text-base leading-relaxed mb-6 max-w-xl mx-auto">
              All advertising inquiries are reviewed by our editorial team before acceptance. We respond within two business days.
            </p>
            <a
              href="mailto:advertising@clownbinge.com"
              className="inline-flex items-center gap-2 text-white font-bold px-10 py-4 rounded-full text-sm uppercase tracking-wider hover:opacity-90 transition-opacity shadow-lg"
              style={{ background: "#1A3A8F" }}
            >
              <Mail className="w-4 h-4" />
              advertising@clownbinge.com
            </a>
            <p className="text-xs text-muted-foreground mt-5">
              Primary Source Analytics, LLC &nbsp;&middot;&nbsp; ClownBinge.com &nbsp;&middot;&nbsp; All advertising subject to editorial review.
            </p>
          </div>
        </div>

      </div>
    </Layout>
  );
}
