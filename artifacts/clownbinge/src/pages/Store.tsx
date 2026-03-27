import { Layout } from "@/components/Layout";
import { ShoppingCart, CheckCircle2, ShieldCheck, Download } from "lucide-react";
import { usePageSeoHead } from "@/hooks/use-seo-head";

export default function Store() {
  usePageSeoHead({
    title: "Verify ANY News Story — Citatious Store",
    description: "Verify any news story for $4.95, or get a Full Primary Source Report on any public figure for $24.95. Sourced from court records, federal data, and congressional transcripts.",
    path: "/store",
    schemaType: "ItemPage",
  });
  return (
    <Layout>
      {/* Store Hero */}
      <div className="bg-header text-white py-16 sm:py-24 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-1/2 h-full bg-primary opacity-20 skew-x-12 translate-x-32" />
        <div className="cb-container relative z-10">
          <div className="max-w-2xl">
            <span className="font-mono text-secondary font-bold tracking-widest uppercase mb-4 block">Citatious Press</span>
            <h1 className="font-sans font-bold text-4xl sm:text-5xl lg:text-6xl mb-6 leading-tight">
              The Complete Archives. In Print.
            </h1>
            <p className="text-xl text-white/80 font-medium leading-relaxed">
              When the internet deletes the evidence, ink survives. Secure your copy of the most comprehensive documentation of political self-owns.
            </p>
          </div>
        </div>
      </div>

      <div className="cb-container py-16 sm:py-24">
        
        {/* Main Book - Flagship */}
        <div className="bg-white border-2 border-border rounded-3xl overflow-hidden shadow-xl hover:shadow-2xl transition-shadow duration-500 mb-16">
          <div className="flex flex-col md:flex-row">
            {/* Book Image Area */}
            <div className="md:w-5/12 bg-muted p-8 sm:p-12 flex items-center justify-center border-b-2 md:border-b-0 md:border-r-2 border-border relative">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent" />
              <img 
                src={`${import.meta.env.BASE_URL}images/illegal-who-cover.png`} 
                alt="Illegal, Who? Book Cover" 
                className="w-full max-w-[320px] rounded-sm shadow-[20px_20px_40px_rgba(0,0,0,0.2)] rotate-2 hover:rotate-0 hover:scale-105 transition-all duration-500 relative z-10"
              />
            </div>
            
            {/* Book Details */}
            <div className="md:w-7/12 p-8 sm:p-12 lg:p-16 flex flex-col justify-center">
              <div className="inline-flex items-center gap-2 bg-pink-verified/10 text-verified px-3 py-1.5 rounded-full font-bold text-xs uppercase tracking-wider mb-6 w-fit border border-verified/20">
                <ShieldCheck className="w-4 h-4" />
                Flagship Release
              </div>
              
              <h2 className="font-display font-extrabold text-4xl sm:text-5xl text-header mb-4 leading-tight">
                Illegal, Who?
              </h2>
              <p className="text-xl text-muted-foreground mb-8">
                The definitive record of 200 documented cases exploring the vast gap between public rhetoric and actual records. Meticulously cited.
              </p>
              
              <div className="space-y-4 mb-10">
                {['Includes 20 exclusive deep-dives not published on the site', 'Fully cited with primary source URLs', 'Digital PDF delivered instantly via email'].map((feature, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <CheckCircle2 className="w-6 h-6 text-secondary shrink-0" />
                    <span className="text-foreground font-medium">{feature}</span>
                  </div>
                ))}
              </div>

              <div className="flex flex-col sm:flex-row items-center gap-6">
                <div className="flex flex-col">
                  <span className="font-mono text-sm text-muted-foreground line-through">$29.95</span>
                  <span className="font-display font-bold text-4xl text-foreground">$21.95</span>
                </div>
                <button className="w-full sm:w-auto bg-primary text-white font-bold text-lg px-10 py-5 rounded-xl shadow-lg shadow-primary/30 hover:shadow-xl hover:-translate-y-1 active:translate-y-0 transition-all flex items-center justify-center gap-3">
                  <ShoppingCart className="w-5 h-5" />
                  Buy Now via Stripe
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Secondary Books Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          
          {/* Greatest Hits */}
          <div className="bg-white border-2 border-border rounded-3xl p-8 sm:p-10 flex flex-col shadow-md hover:shadow-xl transition-shadow">
            <div className="aspect-[4/3] bg-muted rounded-xl mb-8 flex items-center justify-center overflow-hidden relative">
              <img 
                src={`${import.meta.env.BASE_URL}images/greatest-hits-cover.png`} 
                alt="Citatious Greatest Hits Cover" 
                className="h-full object-cover shadow-2xl scale-110"
              />
            </div>
            <h3 className="font-display font-extrabold text-2xl text-header mb-3">Citatious Greatest Hits Vol. 1</h3>
            <p className="text-muted-foreground mb-8 flex-1">
              The 50 most brutal, undeniable Self-Owns from the archive. Perfect quick-reference guide for debates.
            </p>
            <div className="flex items-center justify-between mt-auto">
              <span className="font-display font-bold text-3xl text-foreground">$9.00</span>
              <button className="bg-header text-white font-bold px-6 py-3 rounded-lg hover:bg-header/90 transition-colors flex items-center gap-2">
                <Download className="w-4 h-4" />
                Get PDF
              </button>
            </div>
          </div>

          {/* Newsletter Subscription */}
          <div className="bg-header border-2 border-header rounded-3xl p-8 sm:p-10 flex flex-col shadow-xl text-white relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-secondary/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/4" />
            <div className="relative z-10 flex-1 flex flex-col">
              <div className="w-16 h-16 bg-secondary text-header rounded-2xl flex items-center justify-center mb-8 rotate-3 shadow-lg">
                <span className="font-display font-bold text-3xl">CB</span>
              </div>
              <h3 className="font-display font-extrabold text-2xl mb-3">Annual Premium Subscription</h3>
              <p className="text-white/80 mb-8 flex-1">
                Fund independent accountability journalism. Get ad-free browsing, exclusive weekly deep dives, and early access to all new books.
              </p>
              <div className="flex items-center justify-between mt-auto">
                <div>
                  <span className="font-display font-bold text-3xl text-secondary">$25</span>
                  <span className="text-white/60 ml-1">/year</span>
                </div>
                <button className="bg-secondary text-header font-bold px-6 py-3 rounded-lg hover:bg-white transition-colors">
                  Subscribe
                </button>
              </div>
            </div>
          </div>

        </div>

        {/* Secure Checkout Trust Badge */}
        <div className="mt-16 flex items-center justify-center gap-3 text-muted-foreground">
          <ShieldCheck className="w-5 h-5" />
          <span className="font-medium text-sm">Secure checkout powered by Stripe. PDF delivery is instant.</span>
        </div>

      </div>
    </Layout>
  );
}
