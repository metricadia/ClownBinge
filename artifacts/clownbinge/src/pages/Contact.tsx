import { Layout } from "@/components/Layout";
import { AdminNav } from "@/components/AdminNav";
import { Link } from "wouter";
import { Send, MapPin, Mail, MessageSquare, FileText } from "lucide-react";

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
            Primary Source Analytics, LLC &mdash; ClownBinge.com &mdash; Tips, press inquiries, corrections &amp; bulk orders
          </p>
          <div className="h-1 w-full bg-[#F5C518] rounded-full mt-6" />
        </div>

        <AdminNav />

        <div className="mb-10 rounded-2xl p-6 flex flex-col sm:flex-row items-center gap-6" style={{ background: "#1A3A8F" }}>
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

        <div className="flex flex-col lg:flex-row gap-12">
          
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
                      Primary Source Analytics, LLC<br/>
                      1309 Coffeen Avenue STE 1200<br/>
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
    </Layout>
  );
}
