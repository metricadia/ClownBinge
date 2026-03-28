import { Layout } from "@/components/Layout";
import { AdminPageHeader } from "@/components/AdminPageHeader";
import { usePageSeoHead } from "@/hooks/use-seo-head";
import { Shield, Lock, Globe, FileText, Eye, EyeOff, Server } from "lucide-react";

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-[10px] font-black uppercase tracking-[0.22em] text-primary mb-4 mt-14 pt-6 border-t border-border">
      {children}
    </p>
  );
}

function LockedBadge() {
  return (
    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border" style={{ borderColor: "#B8860B", color: "#B8860B", background: "rgba(184,134,11,0.06)" }}>
      <Lock className="w-2.5 h-2.5" />
      Record Locked
    </span>
  );
}

export default function Privacy() {
  usePageSeoHead({
    title: "Privacy & Free Speech Jurisdiction Policy — ClownBinge",
    description: "ClownBinge operates under the legal jurisdiction of St. Kitts & Nevis and is hosted exclusively on Icelandic sovereign infrastructure. This page documents our jurisdictional firewall, data sovereignty architecture, and zero-inference privacy commitment.",
    path: "/privacy",
    schemaType: "WebPage",
  });

  return (
    <Layout>
      <div className="max-w-3xl mx-auto px-4 py-12 sm:py-20">

        <AdminPageHeader title="Privacy & Free Speech Jurisdiction Policy" />

        {/* Entity record strip */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-px bg-border rounded-xl overflow-hidden border border-border mb-10">
          {[
            { icon: <Shield className="w-3.5 h-3.5" />, label: "Legal Entity", value: "Primary Source Analytics, LLC" },
            { icon: <Globe className="w-3.5 h-3.5" />, label: "Jurisdiction", value: "St. Kitts & Nevis (SKN)" },
            { icon: <Server className="w-3.5 h-3.5" />, label: "Infrastructure", value: "Icelandic Sovereign Hosting" },
          ].map(({ icon, label, value }) => (
            <div key={label} className="bg-muted/40 px-5 py-4 flex flex-col gap-1">
              <div className="flex items-center gap-1.5 text-muted-foreground">
                {icon}
                <span className="text-[10px] font-bold uppercase tracking-widest">{label}</span>
              </div>
              <p className="text-sm font-bold text-header">{value}</p>
            </div>
          ))}
        </div>
        <div className="flex justify-end mb-8 -mt-6">
          <LockedBadge />
        </div>

        {/* Opening */}
        <p className="text-base sm:text-lg text-muted-foreground leading-relaxed mb-6 max-w-2xl">
          This document is not a standard privacy policy. It is a structural accounting of the deliberate architectural decisions made by <strong className="text-foreground">Primary Source Analytics, LLC</strong> to protect the integrity of independent journalism, the privacy of its researchers, and the safety of the readers who depend on verified information in an era defined by the weaponization of legal process, data surveillance, and corporate platform censorship.
        </p>
        <p className="text-base sm:text-lg text-muted-foreground leading-relaxed mb-10 max-w-2xl">
          Each decision documented here was made after forensic review of global litigation trends, data sovereignty law, and the documented history of how independent journalism platforms have been dismantled not by the falsity of their reporting but by the cost of defending it. We built around those vulnerabilities before they could be exploited.
        </p>

        {/* Section 1 */}
        <SectionLabel>1. The Jurisdictional Firewall: Strategic Necessity</SectionLabel>

        <div className="rounded-xl border-l-4 px-6 py-5 mb-8 bg-primary/5" style={{ borderColor: "#1A3A8F" }}>
          <p className="text-sm font-bold text-header mb-1 uppercase tracking-wider">The Legal Moat</p>
          <p className="text-sm text-muted-foreground leading-relaxed">
            The <a className="cb-factoid" href="#" data-title="Nevis LLC Act (1995, amended 2017)" data-summary="The Nevis Limited Liability Company Ordinance governs LLC formation in the Federal Territory of Nevis, Saint Kitts and Nevis. Section 41 of the Act requires any foreign plaintiff to post a minimum cash bond of EC$100,000 (approx. US$37,000) before an action against a Nevis LLC can be initiated in the High Court of St. Kitts and Nevis. The provision is widely documented as an effective barrier to nuisance and SLAPP-style litigation targeting Nevis-domiciled entities.">Nevis LLC Act</a> requires any foreign plaintiff seeking action against a Nevis-domiciled entity to post a cash bond of $100,000 (XCD equivalent) before proceedings can be initiated. This provision exists specifically to prevent meritless foreign litigation from functioning as a silencing mechanism.
          </p>
        </div>

        <div className="space-y-5">
          <p className="text-base text-muted-foreground leading-relaxed">
            Primary Source Analytics, LLC is incorporated under the jurisdiction of St. Kitts and Nevis. This is not a tax strategy. It is not an evasion. It is a documented legal architecture designed to protect verified accountability journalism from a specific and well-documented threat: nuisance litigation.
          </p>
          <p className="text-base text-muted-foreground leading-relaxed">
            Nuisance litigation -- sometimes called <a className="cb-factoid" href="#" data-title="SLAPP Litigation (Strategic Lawsuits Against Public Participation)" data-summary="First documented by Professors Penelope Canan and George Pring (University of Denver, 1988), SLAPP suits are civil complaints filed not to prevail on the merits but to exhaust the defendant's resources through litigation costs. As of 2025, 33 U.S. states have enacted Anti-SLAPP statutes offering varying degrees of protection. The federal SPEAK FREE Act has been introduced in multiple Congresses but has not been enacted into law. International jurisdictions increasingly recognize SLAPP as a press-freedom threat; the EU adopted the Anti-SLAPP Directive in 2024.">SLAPP litigation</a> (Strategic Lawsuits Against Public Participation) -- is the documented practice of filing meritless legal actions against journalists, researchers, and independent publishers not with any expectation of prevailing in court but with the calculated intent of exhausting the target's financial resources before the case reaches adjudication. It is a suppression tool. It is effective. And in the United States, where <a className="cb-factoid" href="#" data-title="First Amendment, U.S. Constitution (1791)" data-summary="Ratified December 15, 1791 as part of the Bill of Rights. Text (press clause): 'Congress shall make no law ... abridging the freedom of speech, or of the press.' Landmark press-freedom cases include Near v. Minnesota (1931, prior restraint), New York Times Co. v. Sullivan (1964, actual malice standard), Pentagon Papers case (1971, national security vs. press), and Bartnicki v. Vopper (2001, public concern doctrine). Despite these protections, SLAPP litigation operates effectively within First Amendment jurisdictions by exploiting litigation costs rather than legal merit.">First Amendment</a> protections are nominally the strongest in the world, it operates with documented regularity against precisely the kind of primary source accountability journalism ClownBinge publishes.
          </p>
          <p className="text-base text-muted-foreground leading-relaxed">
            The <a className="cb-factoid" href="#" data-title="Nevis LLC Act (1995, amended 2017)" data-summary="The Nevis Limited Liability Company Ordinance governs LLC formation in the Federal Territory of Nevis, Saint Kitts and Nevis. Section 41 of the Act requires any foreign plaintiff to post a minimum cash bond of EC$100,000 (approx. US$37,000) before an action against a Nevis LLC can be initiated in the High Court of St. Kitts and Nevis. The provision is widely documented as an effective barrier to nuisance and SLAPP-style litigation targeting Nevis-domiciled entities.">Nevis LLC Act</a> creates what we have termed a Legal Moat. Any foreign plaintiff -- any party operating outside the jurisdiction of St. Kitts and Nevis -- who wishes to bring a legal action against Primary Source Analytics, LLC must first post a $100,000 cash bond with the <a className="cb-factoid" href="#" data-title="High Court of Justice, Eastern Caribbean Supreme Court (St. Kitts & Nevis)" data-summary="The High Court of Justice in St. Kitts and Nevis is a division of the Eastern Caribbean Supreme Court, established under the Eastern Caribbean Supreme Court Act. It has original jurisdiction over civil and criminal matters arising within the Federation of Saint Kitts and Nevis. Foreign plaintiffs seeking to bring an action against a Nevis LLC must initiate proceedings in this court and are required to post the statutory cash bond under Section 41 of the Nevis LLC Act before the case may proceed.">High Court of St. Kitts and Nevis</a> before proceedings can be initiated. This structural requirement performs a function that no first-amendment protection in U.S. courts currently provides: it ensures that only claims with genuine legal and financial substance behind them can reach the point of requiring our response.
          </p>
          <p className="text-base text-muted-foreground leading-relaxed">
            We do not operate from this jurisdiction to evade accountability. Our journalism is accountable. Every claim we publish is traceable to a named primary source document that any reader can independently verify. We operate from this jurisdiction because the documented record of how independent journalism platforms have been legally silenced in the United States -- not through the failure of their journalism but through the success of weaponized litigation -- required a structural response. This is that response.
          </p>
          <p className="text-base text-muted-foreground leading-relaxed">
            We comply with orders issued by the High Court of St. Kitts and Nevis. We do not comply with foreign subpoenas, extrajudicial data requests, or informal legal pressure from jurisdictions whose courts we are not subject to. This is not non-compliance. This is jurisdiction.
          </p>
        </div>

        {/* Section 2 */}
        <SectionLabel>2. The Infrastructure: Icelandic Data Sovereignty</SectionLabel>

        <div className="rounded-xl overflow-hidden border border-border mb-8">
          <div className="px-5 py-3 bg-muted/60 border-b border-border">
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-primary">Why Iceland</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 divide-y sm:divide-y-0 sm:divide-x divide-border">
            {[
              { label: "Press Freedom Index", value: "Top 3 Globally", note: "Reporters Without Borders, 2024" },
              { label: "Data Privacy Law", value: "EEA / GDPR Aligned", note: "With additional domestic protections" },
              { label: "Parliamentary Priority", value: "Investigative Journalism Protection", note: "Formal legislative mandate" },
              { label: "Foreign Data Requests", value: "Rebuffed by Statute", note: "Requires Icelandic court order" },
            ].map(({ label, value, note }) => (
              <div key={label} className="px-5 py-4">
                <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-1">{label}</p>
                <p className="text-sm font-bold text-header mb-0.5">{value}</p>
                <p className="text-[11px] text-muted-foreground">{note}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-5">
          <p className="text-base text-muted-foreground leading-relaxed">
            The ClownBinge newsroom and the Primary Source Analytics research archive are hosted exclusively on servers physically located in Iceland. This is the second layer of what we refer to as the Sovereign Moat: a dual-jurisdiction structure in which the legal entity operates from St. Kitts and Nevis and the physical data infrastructure operates from Iceland.
          </p>
          <p className="text-base text-muted-foreground leading-relaxed">
            Iceland's position as a global leader in press freedom and data privacy is not rhetorical. It is legislated. The Icelandic parliament has formally identified the protection of investigative journalism infrastructure as a national priority. Iceland consistently ranks in the top three countries globally for press freedom, as documented by <a className="cb-factoid" href="#" data-title="Reporters Without Borders (RSF) — World Press Freedom Index" data-summary="Reporters Without Borders (Reporters Sans Frontières / RSF) is an international NGO headquartered in Paris, France. It has published the annual World Press Freedom Index since 2002, ranking 180 countries across five indicators: political context, legal framework, economic context, sociocultural context, and safety. Iceland has ranked #1 or #2 globally in 12 of the past 14 editions. The 2024 Index ranked Iceland #1 globally (score: 94.65/100). Norway ranked #2; Denmark ranked #3.">Reporters Without Borders</a>. Its domestic privacy law aligns with the European Economic Area's <a className="cb-factoid" href="#" data-title="General Data Protection Regulation (GDPR) — Regulation (EU) 2016/679" data-summary="The GDPR entered into force May 25, 2018 and applies across all EU member states and EEA countries, including Iceland. Key provisions: lawful basis requirements for data processing (Art. 6), data subject rights including access and erasure (Arts. 15-22), mandatory breach notification within 72 hours (Art. 33), and penalties up to €20 million or 4% of global annual revenue. Iceland implements the GDPR through the Act on Data Protection and the Processing of Personal Data (Act No. 90/2018), which extends additional domestic protections for journalistic and research data processing beyond the EU baseline.">General Data Protection Regulation</a> while extending additional sovereign protections that exceed those requirements.
          </p>
          <p className="text-base text-muted-foreground leading-relaxed">
            Specifically: foreign governments and private parties seeking access to data stored on Icelandic servers cannot obtain that access through informal legal channels, subpoenas issued by non-Icelandic courts, or the kind of extrajudicial pressure that major domestic hosting providers in the United States routinely comply with. An Icelandic court order, issued through Icelandic legal process, is required. The structure is not theoretical. It has been tested by other investigative journalism platforms operating under similar threat models and has held.
          </p>
          <p className="text-base text-muted-foreground leading-relaxed">
            Our 40,000-plus global source monitoring infrastructure, our internal research methodologies, our unpublished editorial work product, and the data of every reader who engages with this platform are stored within this architecture. They are not on AWS. They are not on Google Cloud. They are not subject to the <a className="cb-factoid" href="#" data-title="National Security Letters (18 U.S.C. § 2709)" data-summary="National Security Letters (NSLs) are administrative subpoenas issued by the FBI under 18 U.S.C. § 2709, authorized by the Electronic Communications Privacy Act (1986) and significantly expanded by the USA PATRIOT Act (2001). They require no judicial approval and carry automatic gag orders prohibiting the recipient from disclosing receipt. Between 2003 and 2022, the FBI issued approximately 400,000 NSLs. Major U.S. technology and telecommunications companies have received and complied with NSLs. Providers operating outside U.S. jurisdiction under foreign sovereign law are not obligated to comply with NSLs.">National Security Letters</a> or informal FBI/DOJ data requests that U.S.-hosted providers have historically complied with without notifying their users. This is intentional. This is the structure.
          </p>
        </div>

        {/* Section 3 */}
        <SectionLabel>3. The Paradox of Professionalism: Why We Left</SectionLabel>

        <blockquote className="border-l-4 pl-6 py-1 my-8 italic text-lg text-muted-foreground" style={{ borderColor: "#F5C518" }}>
          "It is a documented paradox of the 21st century that to protect the founding principles of Western intellectual inquiry, one must frequently move outside of Western administrative reach."
          <footer className="text-sm font-bold text-header mt-2 not-italic">-- Primary Source Analytics, LLC</footer>
        </blockquote>

        <div className="space-y-5">
          <p className="text-base text-muted-foreground leading-relaxed">
            The United States was founded on a theory of press freedom that has no formal parallel in the legal architecture of any other nation on earth. The <a className="cb-factoid" href="#" data-title="First Amendment, U.S. Constitution (1791)" data-summary="Ratified December 15, 1791 as part of the Bill of Rights. Text (press clause): 'Congress shall make no law ... abridging the freedom of speech, or of the press.' Landmark press-freedom cases include Near v. Minnesota (1931, prior restraint), New York Times Co. v. Sullivan (1964, actual malice standard), Pentagon Papers case (1971, national security vs. press), and Bartnicki v. Vopper (2001, public concern doctrine). Despite these protections, SLAPP litigation operates effectively within First Amendment jurisdictions by exploiting litigation costs rather than legal merit.">First Amendment</a> does not merely permit free speech. It prohibits Congress from abridging it. This is not incidental. It is the structural premise of American civic life, rooted in the explicit recognition by the founding generation that the ability of journalists and citizens to speak truthfully about power was the precondition for everything else the republic was supposed to be.
          </p>
          <p className="text-base text-muted-foreground leading-relaxed">
            The documented reality of American journalism in 2025 is that this architecture has been substantially hollowed out -- not by the repeal of the First Amendment but by the economic architecture of media consolidation, the legal architecture of SLAPP litigation, the technical architecture of platform-controlled distribution, and the social architecture of what we have termed the Respectability Framework: the systematic enforcement of performed legitimacy as a condition of institutional access.
          </p>
          <p className="text-base text-muted-foreground leading-relaxed">
            The Respectability Framework operates through informal social and professional sanction rather than formal legal prohibition. It does not ban journalism that makes powerful institutions uncomfortable. It does not need to. It accomplishes the same result by ensuring that journalism which transgresses the boundaries of performed acceptability cannot access the payment processors, hosting providers, domain registrars, and social distribution platforms that contemporary media infrastructure requires to function. A publication that cannot accept payments, cannot maintain a domain, cannot host its content, and cannot distribute it is not protected by the First Amendment. It simply does not exist.
          </p>
          <p className="text-base text-muted-foreground leading-relaxed">
            Primary Source Analytics, LLC has built an architecture that cannot be disabled through any of these vectors. We cannot be cancelled by a credit card processor because our corporate domicile is not subject to the informal pressure campaigns that have historically caused domestic processors to terminate independent journalism accounts. We cannot be shadow-banned by a domestic host because we do not have a domestic host. We cannot be doxed through a data request to our hosting provider because our hosting provider operates under Icelandic sovereignty and does not respond to foreign extrajudicial requests. We have not built this architecture because we anticipate publishing anything that cannot withstand scrutiny. We have built it because the documented history of independent journalism in the contemporary media environment demonstrates that the ability to withstand scrutiny is not the variable that determines survival.
          </p>
        </div>

        {/* Section 4 */}
        <SectionLabel>4. Zero-Inference Data Policy</SectionLabel>

        <p className="text-base text-muted-foreground leading-relaxed">Consistent with our Truth-Based rules of engagement, we operate under a Zero-Inference data policy. This policy has four operative principles:</p>

        <div className="my-8 flex flex-col gap-4">
          {[
            {
              icon: <EyeOff className="w-5 h-5" />,
              title: "We Do Not Track",
              body: "Primary Source Analytics, LLC does not utilize invasive user persona tracking, behavioral analytics profiles, or cross-site surveillance cookies. We do not build audience profiles. We do not sell reader behavior data. We do not participate in the data brokerage economy that funds much of the free internet and which treats every reader as a product to be monetized. Our readers are not our product. Our journalism is our product.",
            },
            {
              icon: <Lock className="w-5 h-5" />,
              title: "We Do Not Disclose",
              body: <>As a Nevis-domiciled entity with Icelandic data infrastructure, we do not respond to foreign extrajudicial data requests. We do not comply with <a className="cb-factoid" href="#" data-title="National Security Letters (18 U.S.C. § 2709)" data-summary="National Security Letters (NSLs) are administrative subpoenas issued by the FBI under 18 U.S.C. § 2709, authorized by the Electronic Communications Privacy Act (1986) and significantly expanded by the USA PATRIOT Act (2001). They require no judicial approval and carry automatic gag orders prohibiting the recipient from disclosing receipt. Between 2003 and 2022, the FBI issued approximately 400,000 NSLs. Major U.S. technology and telecommunications companies have received and complied with NSLs. Providers operating outside U.S. jurisdiction under foreign sovereign law are not obligated to comply with NSLs.">National Security Letters</a>, informal law enforcement requests, or private legal demands issued outside the jurisdiction of the <a className="cb-factoid" href="#" data-title="High Court of Justice, Eastern Caribbean Supreme Court (St. Kitts & Nevis)" data-summary="The High Court of Justice in St. Kitts and Nevis is a division of the Eastern Caribbean Supreme Court, established under the Eastern Caribbean Supreme Court Act. It has original jurisdiction over civil and criminal matters arising within the Federation of Saint Kitts and Nevis. Foreign plaintiffs seeking to bring an action against a Nevis LLC must initiate proceedings in this court and are required to post the statutory cash bond under Section 41 of the Nevis LLC Act before the case may proceed.">High Court of St. Kitts and Nevis</a>. We are not in a position to disclose reader data to foreign parties because our legal and technical architecture does not permit it. This is by design.</>,
            },
            {
              icon: <Eye className="w-5 h-5" />,
              title: "We Collect Only What Is Necessary",
              body: "If you contact us, we retain your email address for the purpose of responding to you. If you subscribe to our newsletter, we retain your email address for the purpose of delivering it. We do not append behavioral, demographic, or psychographic data to these records. Payment processing is handled by Stripe; ClownBinge does not store payment credentials. No reader action on this platform generates a permanent behavioral profile.",
            },
            {
              icon: <FileText className="w-5 h-5" />,
              title: "The Record Is Sovereign",
              body: "Our primary loyalty is to the primary source. Our privacy policy exists to protect the researchers who document the record and the readers who seek it. Where a conflict arises between the convenience of data collection and the safety of our research community, the safety of the research community governs. This is not a conditional commitment. It is the structural priority of this organization.",
            },
          ].map(({ icon, title, body }) => (
            <div key={title} className="flex gap-4 rounded-xl border border-border bg-muted/30 px-5 py-5">
              <div className="shrink-0 w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center text-primary mt-0.5">
                {icon}
              </div>
              <div>
                <p className="font-bold text-header text-sm mb-1">{title}</p>
                <p className="text-sm text-muted-foreground leading-relaxed">{body}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Section 5 - Reader Rights */}
        <SectionLabel>5. Your Rights Under This Policy</SectionLabel>

        <div className="space-y-5 mb-10">
          <p className="text-base text-muted-foreground leading-relaxed">
            You may request deletion of any personally identifiable data you have provided to this platform at any time by contacting us at <strong className="text-foreground">privacy@clownbinge.com</strong>. Requests are processed within 48 hours. You will receive written confirmation of deletion.
          </p>
          <p className="text-base text-muted-foreground leading-relaxed">
            You may unsubscribe from our newsletter at any time using the unsubscribe link in any newsletter email. Your address will be permanently removed from our mailing list within 24 hours of the request.
          </p>
          <p className="text-base text-muted-foreground leading-relaxed">
            You may request a copy of any personally identifiable data we hold about you. In the overwhelming majority of cases, the answer will be: your email address, submitted voluntarily. We do not hold behavioral profiles, demographic inferences, or third-party appended data. We cannot provide data we do not have.
          </p>
          <p className="text-base text-muted-foreground leading-relaxed">
            You may contact us with any privacy-related concern and receive a response from a human within 48 hours. We do not route privacy inquiries through automated systems. The person who reads your request is also the person who will respond to it.
          </p>
        </div>

        {/* Baldwin close */}
        <div className="rounded-2xl px-7 py-8 border" style={{ background: "#0d1f54", borderColor: "rgba(245,197,24,0.2)" }}>
          <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-white/40 mb-4">On Facing the Record</p>
          <blockquote className="text-lg sm:text-xl font-medium text-white leading-relaxed mb-4 border-none p-0 m-0">
            "Not everything that is faced can be changed, but nothing can be changed until it is faced."
          </blockquote>
          <footer className="text-sm text-white/60 mt-3">
            -- James Baldwin (1962)
          </footer>
          <div className="border-t border-white/10 mt-6 pt-5">
            <p className="text-sm text-white/70 leading-relaxed">
              We have faced the structural vulnerabilities of modern journalism: the litigation weaponized as censorship, the platforms that function as gatekeepers, the infrastructure dependencies that can be severed by a single administrative decision. We have built the firewall required to survive them. This policy is the public record of that architecture. It is locked. It will not change without notice.
            </p>
          </div>
        </div>

        {/* Footer note */}
        <div className="mt-10 pt-6 border-t border-border flex flex-col gap-2">
          <p className="text-xs text-muted-foreground font-mono">
            Primary Source Analytics, LLC -- ClownBinge.com
          </p>
          <p className="text-xs text-muted-foreground font-mono">
            Jurisdiction: Federal Territory of Nevis, St. Kitts and Nevis (SKN)
          </p>
          <p className="text-xs text-muted-foreground font-mono">
            Data Infrastructure: Republic of Iceland
          </p>
          <p className="text-xs text-muted-foreground font-mono">
            Inquiries: privacy@clownbinge.com -- Response within 48 hours.
          </p>
          <p className="text-[10px] text-muted-foreground/60 font-mono mt-2 uppercase tracking-widest">
            Independent. Verified. The Primary Source.
          </p>
        </div>

      </div>
    </Layout>
  );
}
