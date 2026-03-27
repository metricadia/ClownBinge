import { Layout } from "@/components/Layout";
import { AdminNav } from "@/components/AdminNav";
import { StatWidget } from "@/components/StatWidget";
import { usePageSeoHead } from "@/hooks/use-seo-head";

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-primary mb-4 mt-12 pt-6 border-t border-border">
      {children}
    </p>
  );
}

export default function About() {
  usePageSeoHead({
    title: "About Citatious",
    description: "Citatious is a knowledge movement. Primary sources used only. Always. We are the standard CNN, Fox News, and Reuters don't meet.",
    path: "/about",
    schemaType: "AboutPage",
  });
  return (
    <Layout>
      <div className="max-w-3xl mx-auto px-4 py-12">

        {/* Hero Statement */}
        <div className="mb-10">
          <h1 className="font-sans font-black text-4xl sm:text-5xl text-foreground leading-tight mb-3">
            Citatious is a<br />
            <span style={{ color: "#F5C518" }}>Knowledge Movement.</span>
          </h1>
          <p className="font-sans text-lg sm:text-xl text-foreground/70 font-medium tracking-wide">
            Primary Sources Used Only. Always.
          </p>
        </div>

        {/* Why the Name */}
        <div
          className="rounded-2xl px-7 py-8 mb-10 border border-white/10"
          style={{ background: "#1A3A8F" }}
        >
          <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/40 mb-3">
            Why the Name
          </p>
          <h2 className="font-sans font-black text-2xl sm:text-3xl text-white leading-tight mb-4">
            Citatious is a compliment.<br />
            <span style={{ color: "#F5C518" }}>We took it as one.</span>
          </h2>
          <p className="text-sm sm:text-base text-white/75 leading-relaxed mb-4">
            <span className="text-white">It is simultaneously an indictment of every newsroom that considers assertion a substitute for documentation.</span> CNN runs claims without primary source links. Fox News editorializes without filed records. Reuters moves wire copy without court document verification. This is the industry standard. We rejected it.
          </p>
          <p className="text-sm sm:text-base text-white/75 leading-relaxed mb-4">
            Citatious means exactly what it sounds like: audaciously, relentlessly, structurally committed to the citation. Not as a style. Not as a differentiator. As the only legitimate basis for publishing anything at all.
          </p>
          <p className="text-sm sm:text-base text-white/75 leading-relaxed">
            If it cannot be traced to a primary source document, it does not exist in this archive. If it exists in this archive, the source is linked in the text. Check it yourself. That is something CNN cannot say. Neither can Fox. Neither can Reuters.
          </p>
        </div>

        {/* The Standard They Don't Meet */}
        <div className="mb-12">
          <p className="text-xs font-bold tracking-widest uppercase text-primary mb-6">The Standard</p>

          <div className="rounded-2xl px-6 py-8 mb-8 border-l-4" style={{ borderColor: "#F5C518", backgroundColor: "rgba(245, 197, 24, 0.03)" }}>
            <p className="text-base sm:text-lg text-foreground leading-relaxed font-medium">
              Every major news organization in the United States operates without a mandatory primary source requirement. Broadcasts are filed. Wire copy moves. Chyrons run. None of it is required to trace to a government document, a court filing, or a verifiable public record. Citatious has one rule: primary sources only. Always. That rule is not aspirational. It is structural. Nothing publishes here without it.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
            {[
              { org: "CNN", fact: "No mandatory primary source citation standard. Opinion and analysis run without document links." },
              { org: "Fox News", fact: "No mandatory primary source citation standard. Editorialized framing runs without filed records." },
              { org: "Reuters", fact: "No mandatory primary source citation standard. Wire copy moves without court document verification." },
            ].map(({ org, fact }) => (
              <div key={org} className="rounded-xl border border-border bg-muted/40 px-4 py-4">
                <p className="text-xs font-black uppercase tracking-widest text-header mb-2">{org}</p>
                <p className="text-xs text-muted-foreground leading-relaxed">{fact}</p>
              </div>
            ))}
          </div>

          <div className="rounded-2xl px-6 py-5 mb-8 border border-[#F5C518]/30 bg-[#FEFCE8]">
            <p className="font-mono font-bold text-base sm:text-lg tracking-wide" style={{ color: "#1A3A8F" }}>
              <span style={{ color: "#C9980A" }}>Citatious</span> has a primary source requirement<span style={{ color: "#C9980A" }}>.</span> None of them do<span style={{ color: "#C9980A" }}>.</span>
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-x-6 gap-y-2 mb-8">
            {["No Emotion", "No Opinion", "No Slander"].map((item, i) => (
              <span key={i} className="flex items-center gap-2">
                <span className="text-sm font-black uppercase tracking-widest text-header">{item}</span>
                {i < 2 && <span className="text-[#F5C518] font-black text-lg leading-none">&#183;</span>}
              </span>
            ))}
          </div>

          <div className="h-1 w-full bg-[#F5C518] rounded-full" />
        </div>

        {/* Prime Directive */}
        <div className="mb-12 border-l-4 border-[#F5C518] pl-6 py-1">
          <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-primary mb-2">
            Our Prime Directive
          </p>
          <h2 className="font-sans font-black text-3xl sm:text-4xl text-header mb-4">
            Ethicality.
          </h2>
          <p className="text-sm text-muted-foreground leading-relaxed mb-2">
            Not as a marketing claim. As a structural commitment.
          </p>
          <p className="text-base text-muted-foreground leading-relaxed mb-6 max-w-2xl">
            Citatious is operated by Primary Source Analytics, LLC, a company that accepts zero funding from political action committees, dark money organizations, corporate underwriters, or foundations with editorial interests. Editorial decisions are made by researchers, not revenue managers. Coverage is not subject to advertiser approval. Our independence is not a promise. It is the financial architecture of this organization.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {[
              { label: "Not PAC-Funded", desc: "Zero dollars accepted from political action committees or anonymous donors." },
              { label: "Not Corporate-Owned", desc: "No media conglomerate. No hedge fund. No parent company with editorial interests." },
              { label: "Not Advertiser-Controlled", desc: "Coverage decisions are made against the primary source record. Not the ad buy." },
            ].map(({ label, desc }) => (
              <div key={label} className="rounded-xl border border-border bg-muted/40 px-4 py-4">
                <p className="text-xs font-black uppercase tracking-widest text-header mb-1">{label}</p>
                <p className="text-xs text-muted-foreground leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>

        <AdminNav />

        {/* What Citatious Is */}
        <SectionLabel>What Citatious Is</SectionLabel>
        <div className="prose prose-lg prose-slate max-w-none cb-article-body">
          <p>
            Citatious is an independent, primary source journalism platform and knowledge movement operated by Primary Source Analytics, LLC. We publish documented accounts of public events, institutional conduct, and structural contradictions in American civic, religious, political, and financial life.
          </p>
          <p>
            We are not a commentary platform. We are not an opinion publication. We do not characterize, editorialize, or assign motive. We document. Every factual claim traces to a verifiable primary source before publication. The documents speak. We organize, source, and present them without interpretation.
          </p>
          <p>
            Our revenue comes directly from readers and from the verification and research services we provide. We accept no funding from political action committees, dark money organizations, political parties, foundations with policy agendas, or corporate underwriters with editorial interests. That structure is not incidental to our editorial independence. It is the condition of it.
          </p>
        </div>

        <StatWidget />

        {/* What the Archive Documents */}
        <SectionLabel>What the Archive Documents</SectionLabel>
        <div className="prose prose-lg prose-slate max-w-none cb-article-body">
          <p>
            The Citatious archive documents the gap between the public record and the conduct, statements, and decisions of public figures and institutions. That gap is the story.
          </p>
          <p>
            The archive covers sixteen categories of documented public interest: self-contradiction in public life, law and justice, money and power, constitutional history, the documented contributions of American women, anti-racist figures and their historical record, United States history, religion and public accountability, original investigations, war and its documented human cost, health policy, technology and its institutional consequences, censorship, the global south as covered by primary sources, explanatory journalism on how systems work, and data-driven analysis. The categories exist because the primary source record requires them. Not one of them is a political position.
          </p>
          <p>
            Our published archive reflects this breadth. We have documented United States senators on both sides of the aisle voting against legislation they publicly championed. We have documented the financial conduct of prominent religious institutions against their own public teachings. We have documented the structural history of American women's legal rights against primary sources held by the Library of Congress and the National Archives. We have documented the national debt against audits produced by the Government Accountability Office and projections by the Congressional Budget Office. The archive does not have a party affiliation. It has a source standard.
          </p>
        </div>

        {/* The Source Standard */}
        <SectionLabel>The Source Standard</SectionLabel>
        <div className="prose prose-lg prose-slate max-w-none cb-article-body">
          <p>
            Every claim published on Citatious is verified against a primary source before publication. We recognize three source tiers:
          </p>
        </div>

        <dl className="my-6 flex flex-col gap-0 border border-border rounded-xl overflow-hidden">
          {[
            {
              tier: "Tier One",
              summary: "Government & Legal Records",
              detail: "Official government records, court documents, congressional voting records, federal agency publications, FEC filings, judicial records maintained by the Federal Judicial Center, and official legislative transcripts including the Congressional Record.",
            },
            {
              tier: "Tier Two",
              summary: "Peer-Reviewed & Nonpartisan",
              detail: "Peer-reviewed academic research and nonpartisan research institutions with documented, publicly available methodology, including the Government Accountability Office, the Congressional Budget Office, the Bipartisan Policy Center, and university-based research centers with published sourcing standards.",
            },
            {
              tier: "Tier Three",
              summary: "Context Sources Only",
              detail: "Recognized news organizations with published editorial standards, a documented corrections policy, and identifiable editorial leadership. Tier Three sources establish context, not primary facts. Primary facts trace to Tier One.",
            },
          ].map(({ tier, summary, detail }, i) => (
            <div
              key={tier}
              className={`flex flex-col sm:flex-row gap-0 ${i > 0 ? "border-t border-border" : ""}`}
            >
              <dt className="shrink-0 w-full sm:w-44 px-5 py-4 bg-muted/60 flex flex-col justify-start gap-0.5 border-b sm:border-b-0 sm:border-r border-border">
                <span className="text-[10px] font-black uppercase tracking-widest text-primary">{tier}</span>
                <span className="text-xs font-semibold text-foreground leading-snug">{summary}</span>
              </dt>
              <dd className="px-5 py-4 text-sm text-muted-foreground leading-relaxed m-0">{detail}</dd>
            </div>
          ))}
        </dl>

        <div className="prose prose-lg prose-slate max-w-none cb-article-body">
          <p>
            Primary sources are linked directly within article text. Readers can verify every factual claim in every article independently without leaving the page. We do not ask readers to trust us. We ask them to check the source.
          </p>
        </div>

        {/* What Citatious Is Not */}
        <SectionLabel>What Citatious Is Not</SectionLabel>
        <div className="prose prose-lg prose-slate max-w-none cb-article-body">
          <p>
            We do not publish anonymous tips, unverified allegations, or content that cannot be traced to a named, public, verifiable source. A story without documentation is not a Citatious story.
          </p>
          <p>
            We do not publish opinion or analysis that depends on inference about intent, character, or motivation. We report what the record shows. When the record is ambiguous, we say so. When the record is silent, we do not fill the silence. The Citatious standard: the record speaks. We transcribe it.
          </p>
          <p>
            We do not cover private individuals. Public accountability journalism applies to public figures and institutions that have accepted positions of public trust, public authority, or public financial stewardship.
          </p>
          <p>
            We are not partisan. Our archive documents institutional contradiction wherever it appears in the primary source record. That includes Democrats, Republicans, religious leaders, corporations, federal agencies, and the bipartisan Congressional record. The record is not partisan. Neither are we.
          </p>
        </div>

        {/* Legal Architecture */}
        <SectionLabel>Legal Architecture</SectionLabel>
        <div className="prose prose-lg prose-slate max-w-none cb-article-body">
          <p>
            Citatious operates under the strongest First Amendment protections available in the United States. <em>New York Times Co. v. Sullivan</em>, 376 U.S. 254 (1964) establishes the actual malice standard for public figures. Because Citatious publishes only verified primary source documentation, actual malice cannot be established against this platform by design. We do not speculate. We do not fabricate. We cite. The citations are in the article. The article is in the archive.
          </p>
        </div>

        {/* Corrections */}
        <SectionLabel>Corrections</SectionLabel>
        <div className="prose prose-lg prose-slate max-w-none cb-article-body">
          <p>
            If a factual error is identified in any published record, a correction is appended to the article within 48 hours of confirmation. The original text and the correction are both preserved in the public record. Corrections are never deleted or obscured. Submissions identifying potential errors may be sent through the contact form. We respond to all credible error reports within 48 hours.
          </p>

          <div className="h-1 w-full bg-[#F5C518] rounded-full my-10" />

          <p className="text-sm text-muted-foreground">
            Primary Source Analytics, LLC &mdash; Citatious.com<br />
            <em>Independent. Verified. The Primary Source.</em>
          </p>
        </div>

      </div>
    </Layout>
  );
}
