import { useState } from "react";
import { Layout } from "@/components/Layout";
import { usePageSeoHead } from "@/hooks/use-seo-head";
import { AdminPageHeader } from "@/components/AdminPageHeader";
import { Link } from "wouter";
import {
  Send, Mail, MessageSquare, FileText, CheckCircle,
  Shield, TrendingUp, BookOpen, BarChart3, Users, Megaphone, Phone
} from "lucide-react";

const FORMATS = [
  {
    icon: BookOpen,
    color: "#1A3A8F",
    title: "Category Sponsorship",
    description: "Own an entire editorial category. Your brand appears as the presenting sponsor of every article published under a ClownBinge category.",
    details: ["Persistent logo placement across category", "Included in category social amplification", "Monthly audience delivery report"],
    rate: "From $2,500 / month",
  },
  {
    icon: FileText,
    color: "#7c2d12",
    title: "Sponsored Research Brief",
    description: "Commission a ClownBinge-standard primary-source research brief, clearly labeled as sponsored content, on a topic of documented public interest.",
    details: ["Full editorial independence maintained", "Clearly labeled sponsored content", "Primary sources cited, methodology documented"],
    rate: "From $3,500 / placement",
  },
  {
    icon: BarChart3,
    color: "#065f46",
    title: "ClownCheck Report Sponsorship",
    description: "Sponsor our flagship verification product. Your brand associated with the gold standard of factual accountability.",
    details: ["Co-branding on every verification PDF", "Mention in confirmation emails", "Quarterly impact report"],
    rate: "From $1,500 / month",
  },
  {
    icon: TrendingUp,
    color: "#4c1d95",
    title: "In-Article Display",
    description: "High-attention display units placed within long-form primary source articles. Average session length exceeds six minutes per article.",
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

type Tab = "contact" | "submit" | "advertising";

export default function Contact() {
  usePageSeoHead({
    title: "Contact ClownBinge",
    description: "Contact ClownBinge, submit a tip, or inquire about advertising. Metricadia Research, LLC — independent accountability journalism.",
    path: "/contact",
    schemaType: "ContactPage",
  });
  const [activeTab, setActiveTab] = useState<Tab>("contact");

  const tabs: { id: Tab; label: string; icon: React.ElementType; desc: string }[] = [
    { id: "contact", label: "Contact", icon: Phone, desc: "General inquiries, tips & corrections" },
    { id: "submit", label: "Submit a Post", icon: FileText, desc: "Have a primary source to share?" },
    { id: "advertising", label: "Advertising", icon: Megaphone, desc: "Reach our verified audience" },
  ];

  return (
    <Layout>
      <div className="max-w-3xl mx-auto px-4 py-12">
        <AdminPageHeader title="Contact, Support & Advertising Center" />
      </div>

      <div className="max-w-5xl mx-auto px-4 pb-10">
        {/* Tab selector */}
        <div className="grid grid-cols-3 gap-3 mb-8 mt-4">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex flex-col sm:flex-row items-center sm:items-start gap-3 p-4 sm:p-5 rounded-2xl border-2 text-left transition-all ${
                  isActive
                    ? "border-[#1A3A8F] bg-[#1A3A8F] text-white"
                    : "border-gray-200 bg-white text-header hover:border-[#1A3A8F]/40"
                }`}
              >
                <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${isActive ? "bg-white/20" : "bg-primary/10"}`}>
                  <Icon className={`w-5 h-5 ${isActive ? "text-white" : "text-primary"}`} />
                </div>
                <div>
                  <div className={`font-bold text-sm leading-tight ${isActive ? "text-white" : "text-header"}`}>{tab.label}</div>
                  <div className={`text-xs mt-0.5 leading-snug hidden sm:block ${isActive ? "text-white/70" : "text-muted-foreground"}`}>{tab.desc}</div>
                </div>
              </button>
            );
          })}
        </div>

        {/* ── CONTACT TAB ─────────────────────────────────────── */}
        {activeTab === "contact" && (
          <div className="flex flex-col lg:flex-row gap-10">

            {/* Corporate info */}
            <div className="w-full lg:w-1/3 space-y-4">
              <div className="bg-muted p-7 rounded-2xl border border-border">
                <h3 className="font-bold text-lg mb-5 text-foreground border-b border-border pb-3">Corporate Info</h3>
                <div className="space-y-5">
                  <div className="flex items-start gap-3">
                    <div className="bg-white p-2 rounded-lg shadow-sm border border-border shrink-0">
                      <Mail className="w-4 h-4 text-primary" />
                    </div>
                    <div>
                      <p className="font-bold text-sm text-foreground">General Inquiries</p>
                      <a href="mailto:contact@clownbinge.com" className="text-sm text-primary hover:underline mt-1 block">
                        contact@clownbinge.com
                      </a>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="bg-white p-2 rounded-lg shadow-sm border border-border shrink-0">
                      <MessageSquare className="w-4 h-4 text-primary" />
                    </div>
                    <div>
                      <p className="font-bold text-sm text-foreground">Secure Tips</p>
                      <p className="text-sm text-muted-foreground mt-1">
                        Use Signal or ProtonMail for sensitive documents. Contact general email for public key.
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="bg-white p-2 rounded-lg shadow-sm border border-border shrink-0">
                      <Megaphone className="w-4 h-4 text-primary" />
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

            {/* Contact form */}
            <div className="w-full lg:w-2/3">
              <div className="bg-white border-2 border-border shadow-xl rounded-2xl p-8">
                <h2 className="font-bold text-xl text-header mb-6">Send a Message</h2>
                <form className="space-y-5" onSubmit={(e) => e.preventDefault()}>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-foreground">First Name</label>
                      <input type="text" className="w-full bg-background border-2 border-border rounded-xl px-4 py-3 focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all" placeholder="Jane" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-foreground">Email Address *</label>
                      <input type="email" required className="w-full bg-background border-2 border-border rounded-xl px-4 py-3 focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all" placeholder="jane@example.com" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-foreground">Subject</label>
                    <select className="w-full bg-background border-2 border-border rounded-xl px-4 py-3 focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all text-foreground">
                      <option>General Inquiry</option>
                      <option>Submit a Tip / Receipt</option>
                      <option>Advertising Inquiry</option>
                      <option>Academic / Bulk Book Order</option>
                      <option>Press Inquiry</option>
                      <option>Correction Request</option>
                      <option>Website Bug Report</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-foreground">Message *</label>
                    <textarea rows={6} required className="w-full bg-background border-2 border-border rounded-xl px-4 py-3 focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all resize-none" placeholder="Provide context, links to public records, or C-SPAN timestamps..." />
                  </div>
                  <button type="submit" className="w-full bg-primary text-white font-bold text-base py-4 rounded-xl shadow-lg hover:shadow-xl hover:-translate-y-0.5 active:translate-y-0 transition-all flex items-center justify-center gap-2">
                    <Send className="w-5 h-5" />
                    Submit to Editorial
                  </button>
                  <p className="text-xs text-center text-muted-foreground">
                    By submitting, you acknowledge that ClownBinge is a journalistic entity and any tips submitted may be investigated for publication.
                  </p>
                </form>
              </div>
            </div>
          </div>
        )}

        {/* ── SUBMIT A POST TAB ────────────────────────────────── */}
        {activeTab === "submit" && (
          <div className="max-w-3xl mx-auto">
            <div className="rounded-2xl overflow-hidden shadow-lg" style={{ border: "2px solid #1A3A8F" }}>
              <div className="p-8" style={{ background: "#1A3A8F" }}>
                <div className="w-12 h-12 rounded-full flex items-center justify-center mb-5" style={{ background: "#F5C518" }}>
                  <FileText className="w-6 h-6" style={{ color: "#1A3A8F" }} />
                </div>
                <h2 className="font-bold text-2xl text-white mb-3">Submit a Primary Source</h2>
                <p className="text-white/75 text-base leading-relaxed mb-6">
                  Have a primary source the public needs to see? A documented vote, court filing,
                  government record, peer-reviewed study, or verified fact on any public figure,
                  institution, or claim. Submit it and we will review it for publication.
                </p>
                <div className="grid sm:grid-cols-3 gap-4 mb-8">
                  {[
                    { label: "Court filings", detail: "Federal and state court documents" },
                    { label: "Voting records", detail: "Official legislative votes and records" },
                    { label: "Government docs", detail: "Disclosures, contracts, meeting minutes" },
                  ].map((item) => (
                    <div key={item.label} className="bg-white/10 rounded-xl p-4">
                      <div className="font-bold text-white text-sm mb-1">{item.label}</div>
                      <div className="text-white/60 text-xs">{item.detail}</div>
                    </div>
                  ))}
                </div>
                <Link
                  href="/submit"
                  className="inline-flex items-center gap-2 font-bold px-8 py-4 rounded-full transition-opacity hover:opacity-90 text-base"
                  style={{ background: "#F5C518", color: "#1A3A8F" }}
                >
                  <FileText className="w-5 h-5" />
                  Go to Submission Form
                </Link>
              </div>
              <div className="bg-gray-50 p-6 border-t border-gray-200">
                <p className="text-sm font-bold text-header mb-2">What we review</p>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  All submissions are reviewed by our editorial team. We publish only what we can independently verify against the primary record. We do not publish anonymous allegations without corroborating documentation. Submissions become the property of Metricadia Research, LLC for editorial consideration.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* ── ADVERTISING TAB ──────────────────────────────────── */}
        {activeTab === "advertising" && (
          <div>
            {/* Advertising intro */}
            <div className="rounded-2xl p-7 mb-6" style={{ background: "#1A3A8F" }}>
              <div className="flex flex-col sm:flex-row sm:items-end gap-6">
                <div className="flex-1">
                  <p className="text-xs font-bold tracking-widest uppercase mb-2" style={{ color: "#F5C518" }}>Advertise with ClownBinge</p>
                  <h2 className="font-black text-2xl sm:text-3xl text-white leading-tight mb-3">
                    Your brand, next to the <span style={{ color: "#F5C518" }}>primary source.</span>
                  </h2>
                  <p className="text-white/70 text-sm leading-relaxed max-w-xl">
                    ClownBinge readers are educators, researchers, journalists, and engaged citizens who verify. Average session: 6+ minutes. Post-graduate majority audience.
                  </p>
                </div>
                <a
                  href="mailto:advertising@clownbinge.com"
                  className="shrink-0 inline-flex items-center gap-2 font-bold px-7 py-3.5 rounded-full transition-opacity hover:opacity-90 text-sm"
                  style={{ background: "#F5C518", color: "#1A3A8F" }}
                >
                  <Mail className="w-4 h-4" />
                  Start a Conversation
                </a>
              </div>
            </div>

            {/* Ad formats */}
            <p className="text-xs font-bold tracking-widest uppercase text-primary mb-4">Ad Formats</p>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-8">
              {FORMATS.map((f) => {
                const Icon = f.icon;
                return (
                  <div key={f.title} className="rounded-2xl border shadow-sm overflow-hidden flex flex-col">
                    <div className="px-5 py-4 flex items-center gap-3" style={{ background: f.color }}>
                      <div className="bg-white/20 rounded-xl p-2 shrink-0">
                        <Icon className="w-4 h-4 text-white" />
                      </div>
                      <div>
                        <h4 className="font-black text-white text-sm leading-tight">{f.title}</h4>
                        <p className="text-white/75 text-xs font-bold uppercase tracking-wider mt-0.5">{f.rate}</p>
                      </div>
                    </div>
                    <div className="p-5 flex flex-col flex-1 bg-white">
                      <p className="text-muted-foreground text-sm leading-relaxed mb-3">{f.description}</p>
                      <ul className="space-y-1">
                        {f.details.map((d) => (
                          <li key={d} className="flex items-start gap-2 text-sm text-foreground">
                            <CheckCircle className="w-3.5 h-3.5 text-green-600 shrink-0 mt-0.5" />{d}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Brand safety */}
            <div className="rounded-2xl p-6 mb-6" style={{ background: "#1A3A8F" }}>
              <div className="flex items-center gap-3 mb-5">
                <div className="bg-white/10 rounded-xl p-2.5 shrink-0">
                  <Shield className="w-4 h-4" style={{ color: "#F5C518" }} />
                </div>
                <h3 className="font-black text-lg text-white">Brand Safety Policy</h3>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 mb-6">
                {BRAND_SAFE.map((item) => (
                  <div key={item} className="flex items-start gap-2.5 bg-white/5 rounded-xl px-4 py-3">
                    <CheckCircle className="w-3.5 h-3.5 shrink-0 mt-0.5" style={{ color: "#F5C518" }} />
                    <p className="text-white/80 text-xs leading-snug">{item}</p>
                  </div>
                ))}
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 bg-white/5 rounded-2xl p-5">
                <div>
                  <p className="font-black text-sm mb-3 text-green-400">We welcome</p>
                  <ul className="space-y-1.5 text-xs text-white/70">
                    {["Nonprofits and advocacy organizations with documented missions", "Publishers, journals, and academic institutions", "Legal services, civic tech, and public information tools", "Businesses whose products serve civic engagement"].map((i) => (
                      <li key={i} className="flex items-start gap-2"><CheckCircle className="w-3.5 h-3.5 text-green-400 shrink-0 mt-0.5" />{i}</li>
                    ))}
                  </ul>
                </div>
                <div>
                  <p className="font-black text-sm mb-3 text-red-400">We do not accept</p>
                  <ul className="space-y-1.5 text-xs text-white/70">
                    {["Political campaigns, PACs, or dark money organizations", "Advertising that contradicts documented public record", "Products or services ClownBinge has reported on critically", "Any entity that has attempted to misrepresent primary sources"].map((i) => (
                      <li key={i} className="flex items-start gap-2"><span className="text-red-400 font-black shrink-0">&#x2715;</span>{i}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

            {/* Advertising CTA */}
            <div className="text-center py-6">
              <div className="inline-flex items-center gap-2 bg-primary/10 rounded-full px-4 py-2 mb-4">
                <Users className="w-4 h-4 text-primary" />
                <span className="text-xs font-bold uppercase tracking-widest text-primary">Get in Touch</span>
              </div>
              <h3 className="font-black text-2xl text-header mb-2">Ready to be next to the source?</h3>
              <p className="text-muted-foreground text-sm mb-5 max-w-md mx-auto">All advertising inquiries are reviewed by our editorial team. We respond within two business days.</p>
              <a
                href="mailto:advertising@clownbinge.com"
                className="inline-flex items-center gap-2 text-white font-bold px-10 py-4 rounded-full text-sm hover:opacity-90 transition-opacity shadow-lg"
                style={{ background: "#1A3A8F" }}
              >
                <Mail className="w-4 h-4" />
                advertising@clownbinge.com
              </a>
              <p className="text-xs text-muted-foreground mt-4">Metricadia Research, LLC &nbsp;&middot;&nbsp; All advertising subject to editorial review.</p>
            </div>
          </div>
        )}

      </div>
    </Layout>
  );
}
