import { Layout } from "@/components/Layout";
import { AdminNav } from "@/components/AdminNav";
import { StatWidget } from "@/components/StatWidget";

export default function About() {
  return (
    <Layout>
      <div className="max-w-3xl mx-auto px-4 py-12">

        {/* Name Defense -- dark navy opener */}
        <div
          className="rounded-2xl px-7 py-8 mb-10 border border-white/10"
          style={{ background: "#1A3A8F" }}
        >
          <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/40 mb-3">
            Why the Name
          </p>
          <h2 className="font-sans font-black text-2xl sm:text-3xl text-white leading-tight mb-4">
            ClownBinge is not a joke.<br />
            <span style={{ color: "#F5C518" }}>The clown farm is.</span>
          </h2>
          <p className="text-sm sm:text-base text-white/75 leading-relaxed">
            We named this platform after the thing we document. The modern news cycle has become a performance industry: outrage manufactured for engagement, facts subordinated to narrative, journalism repackaged as entertainment and sold to the highest corporate bidder. We don't participate in that system. We audit it. Every record we publish is extracted from primary sources -- court filings, congressional transcripts, federal agency data, declassified documents. The clowns are in the farm. We are in the archive.
          </p>
        </div>

        {/* Brand Manifesto */}
        <div className="mb-12">
          <p className="text-xs font-bold tracking-widest uppercase text-primary mb-6">About ClownBinge</p>

          <p className="text-base sm:text-lg text-muted-foreground leading-relaxed mb-10 max-w-2xl">
            <strong className="text-foreground">ClownBinge was built on a simple premise:</strong> traditional media has become a circus of misinformation, performance, and manufactured narrative. We don't editorialize the chaos. We navigate it. Our team binges the entire information ecosystem, from fringe to mainstream, from local court records to international wire services, extracting only what survives the only test that matters: the primary source. If it can't be verified against an original document, it doesn't exist here.
          </p>

          <h1 className="font-sans font-extrabold text-4xl sm:text-5xl text-header leading-tight mb-3">
            The News Cycle Is a Clown Farm.
          </h1>
          <p className="font-sans font-bold text-xl sm:text-2xl mb-7" style={{ color: "#C9980A" }}>
            We binge it to curate and verify primary sourced information.
          </p>

          <div className="flex flex-wrap items-center gap-x-6 gap-y-2 mb-10">
            {["No Emotion", "No Opinion", "No Slander"].map((item, i) => (
              <span key={i} className="flex items-center gap-2">
                <span className="text-sm font-black uppercase tracking-widest text-header">{item}</span>
                {i < 2 && <span className="text-[#F5C518] font-black text-lg leading-none">&#183;</span>}
              </span>
            ))}
          </div>

          <div className="rounded-2xl px-6 py-5 mb-8 border border-[#F5C518]/30 bg-[#FEFCE8]">
            <p className="font-mono font-bold text-base sm:text-lg tracking-wide" style={{ color: "#1A3A8F" }}>
              <span style={{ color: "#C9980A" }}>65,000</span> global sources<span style={{ color: "#C9980A" }}>.</span> Zero opinions<span style={{ color: "#C9980A" }}>.</span> One standard: the primary source record<span style={{ color: "#C9980A" }}>.</span>
            </p>
          </div>

          <div className="h-1 w-full bg-[#F5C518] rounded-full" />
        </div>

        {/* Prime Directive Block */}
        <div className="mb-12 border-l-4 border-[#F5C518] pl-6 py-1">
          <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-primary mb-2">
            Our Prime Directive
          </p>
          <h2 className="font-sans font-black text-3xl sm:text-4xl text-header mb-4">
            Ethicality.
          </h2>
          <p className="text-base text-muted-foreground leading-relaxed mb-6 max-w-2xl">
            Not as a marketing claim. As a structural commitment. ClownBinge is operated by Primary Source Analytics, LLC -- a company that accepts zero funding from political action committees, dark money organizations, corporate underwriters, or foundations with editorial interests. Our editorial decisions are made by researchers, not revenue managers. Our coverage is not subject to advertiser approval. Our independence is not a promise. It is the financial architecture of this organization.
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

        <div className="prose prose-slate max-w-none cb-article-body">

          <h2>What ClownBinge Is</h2>
          <p>
            ClownBinge is an independent, primary source journalism platform operated by Primary Source Analytics, LLC.
            We publish documented accounts of public events, institutional conduct, and structural contradictions in
            American civic, religious, political, and financial life. Our archive is built on a single standard:
            every factual claim must trace to a verifiable primary source before publication.
          </p>
          <p>
            We are not a commentary platform. We are not an opinion publication. We do not characterize,
            editorialize, or assign motive. We document. The record we publish is available to anyone with
            an internet connection. ClownBinge organizes it, sources it, and presents it without interpretation.
            The documents speak. We transcribe.
          </p>
          <p>
            We are entirely independent. We are not funded by political action committees, dark money
            organizations, political parties, foundations with policy agendas, or corporate underwriters
            with editorial interests. Our revenue comes directly from readers and from the verification
            and reporting services we provide. This structure is not incidental to our editorial
            independence. It is the condition of it.
          </p>

        </div>

        <StatWidget />

        <div className="prose prose-slate max-w-none cb-article-body">

          <h2>What the Archive Documents</h2>
          <p>
            The ClownBinge archive documents the gap between the documented public record and the conduct,
            statements, and decisions of public figures and institutions. That gap is the story. We do not
            manufacture it. We do not speculate about it. We measure it against what the primary sources
            actually say.
          </p>
          <p>
            The archive covers sixteen categories of documented public interest: self-contradiction in
            public life, law and justice, money and power, constitutional history, the documented
            contributions of American women, anti-racist figures and their historical record, United
            States history, religion and public accountability, original investigations, war and its
            documented human cost, health policy, technology and its institutional consequences,
            censorship, the global south as covered by primary sources, explanatory journalism
            on how systems work, and data-driven analysis. The categories exist because the primary
            source record requires them. Not one of them is a political position.
          </p>
          <p>
            A survey of our published archive reflects this breadth. We have documented United States
            senators on both sides of the aisle caught voting against legislation they publicly championed.
            We have documented the financial conduct of some of America's most prominent religious
            institutions against their own public teachings. We have documented the structural history
            of American women's legal rights against primary sources held by the Library of Congress
            and the National Archives. We have documented the national debt against audits produced
            by the Government Accountability Office and projections by the Congressional Budget Office.
            The archive does not have a party affiliation. It has a source standard.
          </p>

          <h2>The Source Standard</h2>
          <p>
            Every claim published on ClownBinge is verified against a primary source before publication.
            We recognize three source tiers:
          </p>
          <ul>
            <li>
              <strong>Tier One:</strong> Official government records, court documents, congressional voting
              records, federal agency publications, FEC filings, judicial records maintained by the Federal
              Judicial Center, and official legislative transcripts including the Congressional Record.
            </li>
            <li>
              <strong>Tier Two:</strong> Peer-reviewed academic research and nonpartisan research
              institutions with documented, publicly available methodology. This includes the Government
              Accountability Office, the Congressional Budget Office, the Bipartisan Policy Center, and
              university-based research centers with published sourcing standards.
            </li>
            <li>
              <strong>Tier Three:</strong> Recognized news organizations with published editorial
              standards, a documented corrections policy, and identifiable editorial leadership.
              Tier Three sources are used to establish context, not to establish primary facts.
              Primary facts trace to Tier One.
            </li>
          </ul>
          <p>
            Primary sources are linked directly within article text. Readers can verify every factual
            claim in every article independently without leaving the page. We do not ask readers to
            trust us. We ask them to check the source.
          </p>

          <h2>What ClownBinge Is Not</h2>
          <p>
            We do not publish anonymous tips. We do not publish unverified allegations. We do not publish
            content that cannot be traced to a named, public, verifiable source. We do not accept content
            submissions that arrive without documentation attached. A story that cannot be sourced is not
            a ClownBinge story.
          </p>
          <p>
            We do not publish opinion. We do not publish analysis that depends on inference about intent,
            character, or motivation. We report what the record shows. When the record is ambiguous, we
            say so. When the record is silent, we do not fill the silence. The ClownBinge standard phrase
            for this is straightforward: ClownBinge makes no judgment. The record does.
          </p>
          <p>
            We do not cover private individuals. Public accountability journalism applies to public
            figures and institutions that have accepted positions of public trust, public authority,
            or public financial stewardship. Private conduct that does not implicate a public role
            or a publicly stated value is not within our coverage mandate.
          </p>
          <p>
            We are not partisan. We do not have a preferred political outcome. Our archive documents
            institutional contradiction and the gap between stated values and documented conduct wherever
            that gap appears in the primary source record. That includes Democrats, Republicans, religious
            leaders, corporations, federal agencies, and the bipartisan Congressional voting record that
            built the national debt. The record is not partisan. Neither are we.
          </p>

          <h2>Legal Architecture</h2>
          <p>
            ClownBinge operates under the strongest First Amendment protections available in the
            United States. <em>New York Times Co. v. Sullivan</em>, 376 U.S. 254 (1964) establishes
            the actual malice standard for public figures. Because ClownBinge publishes only verified
            primary source documentation, actual malice cannot be established against this platform
            by design. We do not speculate. We do not fabricate. We cite. The citations are in the
            article. The article is in the archive.
          </p>

          <h2>Corrections</h2>
          <p>
            If a factual error is identified in any published record, a correction is appended to
            the article within 48 hours of confirmation. The original text and the correction are
            both preserved in the public record. Corrections are never deleted or obscured. Submissions
            identifying potential errors may be sent through the contact form in the site navigation.
            We respond to all credible error reports within 48 hours.
          </p>

          <div className="h-1 w-full bg-[#F5C518] rounded-full my-10" />

          <p className="text-sm text-muted-foreground">
            Primary Source Analytics, LLC &mdash; ClownBinge.com<br />
            <em>Independent. Verified. The Primary Source.</em>
          </p>

        </div>
      </div>
    </Layout>
  );
}
