import { Layout } from "@/components/Layout";
import { ShieldAlert, FileText, Scale } from "lucide-react";

export default function About() {
  return (
    <Layout>
      {/* Hero */}
      <div className="w-full h-[40vh] sm:h-[50vh] relative bg-black flex items-center justify-center overflow-hidden">
        <img 
          src={`${import.meta.env.BASE_URL}images/about-hero.png`} 
          alt="ClownBinge Documentation" 
          className="absolute inset-0 w-full h-full object-cover opacity-50"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
        <div className="relative z-10 text-center px-4">
          <h1 className="font-sans font-bold text-5xl sm:text-7xl text-white mb-4 tracking-tight">
            The Mission.
          </h1>
          <p className="text-xl sm:text-2xl text-secondary font-mono tracking-widest uppercase">
            Documenting the hypocrisy.
          </p>
        </div>
      </div>

      <div className="cb-container py-16 sm:py-24 max-w-4xl mx-auto">
        <div className="prose prose-lg sm:prose-xl text-foreground max-w-none prose-headings:font-display prose-headings:font-extrabold prose-headings:text-header prose-p:leading-relaxed">
          
          <p className="text-2xl font-medium leading-relaxed border-l-4 border-primary pl-6 mb-12 text-header">
            ClownBinge is a verified accountability journalism and political satire platform. We operate on a simple premise: public figures should be held to the standard of their own documented words and actions.
          </p>

          <div className="grid sm:grid-cols-3 gap-8 my-16 not-prose">
            <div className="bg-muted p-6 rounded-2xl border border-border">
              <FileText className="w-10 h-10 text-primary mb-4" />
              <h3 className="font-bold text-lg mb-2">Verified Sources</h3>
              <p className="text-sm text-muted-foreground">Every claim traces to a public record, C-SPAN archive, or verified news outlet.</p>
            </div>
            <div className="bg-muted p-6 rounded-2xl border border-border">
              <ShieldAlert className="w-10 h-10 text-primary mb-4" />
              <h3 className="font-bold text-lg mb-2">No Fabrications</h3>
              <p className="text-sm text-muted-foreground">We document reality. The truth is vastly more compelling than fiction.</p>
            </div>
            <div className="bg-muted p-6 rounded-2xl border border-border">
              <Scale className="w-10 h-10 text-primary mb-4" />
              <h3 className="font-bold text-lg mb-2">Public Figures Only</h3>
              <p className="text-sm text-muted-foreground">We never target private individuals. We focus exclusively on those wielding public power.</p>
            </div>
          </div>

          <h2>Editorial Standards</h2>
          <p>
            The internet is flooded with misinformation, deep fakes, and bad-faith arguments. We cut through the noise by relying entirely on the <strong className="bg-pink-verified/10 text-verified px-1">receipts</strong>. 
          </p>
          <ul>
            <li><strong>Primary Sources First:</strong> We prefer court documents, voting records, and uncut video footage over punditry.</li>
            <li><strong>Context Matters:</strong> We don't deceptively edit. If a public official self-owns, we show the full context that proves they meant exactly what they said.</li>
            <li><strong>Satirical Frame:</strong> Our tone is sharp, mocking, and forensic. We treat our audience as intelligent adults capable of understanding complex hypocrisy.</li>
          </ul>

          <h2>Corporate Structure & Protection</h2>
          <div className="bg-header text-white p-8 rounded-2xl my-8 not-prose">
            <h3 className="font-display font-bold text-2xl mb-4 text-white">ClownBinge Wyoming Corp</h3>
            <p className="text-white/80 mb-6">
              ClownBinge operates under the strongest First Amendment protections available in the United States. Our legal architecture is designed specifically to protect independent media from frivolous SLAPP suits and bad-faith legal bullying.
            </p>
            <div className="bg-black/20 p-4 rounded-lg font-mono text-sm text-white/70">
              New York Times Co. v. Sullivan, 376 U.S. 254 (1964) establishes the "actual malice" standard for public figures. Because we only publish verified public records, establishing actual malice against ClownBinge is legally impossible.
            </div>
          </div>

          <p>
            We are entirely independent. We are not funded by PACs, dark money groups, or billionaires. We are funded directly by our readers through book sales and our newsletter. This ensures our editorial independence remains absolute.
          </p>

        </div>
      </div>
    </Layout>
  );
}
