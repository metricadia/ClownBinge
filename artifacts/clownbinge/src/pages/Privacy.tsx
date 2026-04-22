import { Layout } from "@/components/Layout";
import { AdminPageHeader } from "@/components/AdminPageHeader";
import { usePageSeoHead } from "@/hooks/use-seo-head";
import { useFactoidPopup } from "@/hooks/use-factoid-popup";
import { FactoidPopup } from "@/components/FactoidPopup";
import { Shield, Lock, Globe, FileText, Eye, EyeOff, Server } from "lucide-react";

function SectionCard({ eyebrow, title, children }: { eyebrow: string; title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-2xl border-2 border-[#1a3a8f] overflow-hidden mb-6">
      <div className="bg-[#1a3a8f] px-6 py-4">
        <div className="text-[#F5C518] text-xs font-black uppercase tracking-widest mb-1">{eyebrow}</div>
        <h2 className="text-white font-bold text-lg leading-tight">{title}</h2>
      </div>
      <div className="px-6 py-5 space-y-4 text-sm text-slate-600 leading-relaxed">{children}</div>
    </div>
  );
}

function Callout({ children, variant = "gold" }: { children: React.ReactNode; variant?: "gold" | "blue" | "red" }) {
  const styles = {
    gold: "bg-[#F5C518]/10 border-l-4 border-[#F5C518] text-slate-700",
    blue: "bg-[#1a3a8f]/5 border-l-4 border-[#1a3a8f] text-slate-700",
    red: "bg-red-50 border-l-4 border-red-400 text-red-800",
  };
  return <div className={`rounded-r-xl px-5 py-4 ${styles[variant]}`}>{children}</div>;
}

export default function Privacy() {
  const { containerRef, popupRef, factoid, copied, isMobile, closeFactoid, handleCopy } = useFactoidPopup();

  usePageSeoHead({
    title: "Privacy & Free Speech Jurisdiction Policy — ClownBinge",
    description:
      "ClownBinge operates under the legal jurisdiction of St. Kitts & Nevis and is hosted exclusively on Icelandic sovereign infrastructure. This page documents our jurisdictional firewall, data sovereignty architecture, and zero-inference privacy commitment.",
    path: "/privacy",
    schemaType: "WebPage",
  });

  return (
    <Layout>
      <div className="max-w-3xl mx-auto px-4 py-12" ref={(el) => { containerRef.current = el; }}>

        <AdminPageHeader title="Privacy & Free Speech Jurisdiction Policy" />

        {/* Entity record strip */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-4">
          {[
            { icon: <Shield className="w-4 h-4" />, label: "Legal Entity", value: "Metricadia Research, LLC" },
            { icon: <Globe className="w-4 h-4" />, label: "Jurisdiction", value: "St. Kitts & Nevis (SKN)" },
            { icon: <Server className="w-4 h-4" />, label: "Infrastructure", value: "Icelandic Sovereign Hosting" },
          ].map(({ icon, label, value }) => (
            <div key={label} className="rounded-xl bg-[#1a3a8f] px-5 py-4 flex items-start gap-3">
              <div className="text-[#F5C518] mt-0.5 shrink-0">{icon}</div>
              <div>
                <p className="text-[10px] font-black uppercase tracking-widest text-blue-300 mb-0.5">{label}</p>
                <p className="text-sm font-bold text-white">{value}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="flex justify-end mb-6">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border" style={{ borderColor: "#B8860B", color: "#B8860B", background: "rgba(184,134,11,0.06)" }}>
            <Lock className="w-2.5 h-2.5" />
            Record Locked
          </span>
        </div>

        {/* Opening hero */}
        <div className="rounded-2xl bg-[#1a3a8f] px-6 py-6 mb-6 relative overflow-hidden">
          <div className="absolute top-0 right-0 text-[8rem] leading-none opacity-[0.04] font-black select-none pointer-events-none">⚖</div>
          <p className="text-[#F5C518] text-xs font-black uppercase tracking-widest mb-3">What This Document Is</p>
          <p className="text-white text-sm leading-relaxed mb-3">
            This document is not a standard privacy policy. It is a structural accounting of the deliberate architectural decisions made by{" "}
            <strong className="text-[#F5C518]">Metricadia Research, LLC</strong> to protect the integrity of independent journalism, the privacy of its researchers, and the safety of the readers who depend on verified information in an era defined by the weaponization of legal process, data surveillance, and corporate platform censorship.
          </p>
          <p className="text-blue-200 text-sm leading-relaxed">
            Each decision documented here was made after forensic review of global litigation trends, data sovereignty law, and the documented history of how independent journalism platforms have been dismantled — not by the falsity of their reporting but by the cost of defending it. We built around those vulnerabilities before they could be exploited.
          </p>
        </div>

        {/* Section 1 — Jurisdictional Firewall */}
        <SectionCard eyebrow="Section 1" title="The Jurisdictional Firewall: Strategic Necessity">
          <Callout variant="gold">
            <p className="font-bold text-[#1a3a8f] text-xs uppercase tracking-wider mb-1">The Legal Moat</p>
            <p>
              The{" "}
              <a className="cb-factoid" href="#" data-title="Nevis LLC Act (1995, amended 2017)" data-summary="The Nevis Limited Liability Company Ordinance governs LLC formation in the Federal Territory of Nevis, Saint Kitts and Nevis. Section 41 of the Act requires any foreign plaintiff to post a minimum cash bond of EC$100,000 (approx. US$37,000) before an action against a Nevis LLC can be initiated in the High Court of St. Kitts and Nevis. The provision is widely documented as an effective barrier to nuisance and SLAPP-style litigation targeting Nevis-domiciled entities.">Nevis LLC Act</a>{" "}
              requires any foreign plaintiff seeking action against a Nevis-domiciled entity to post a cash bond of $100,000 (XCD equivalent) before proceedings can be initiated. This provision exists specifically to prevent meritless foreign litigation from functioning as a silencing mechanism.
            </p>
          </Callout>
          <p>
            Metricadia Research, LLC is incorporated under the jurisdiction of St. Kitts and Nevis. This is not a tax strategy. It is not an evasion. It is a documented legal architecture designed to protect verified accountability journalism from a specific and well-documented threat: nuisance litigation.
          </p>
          <p>
            Nuisance litigation — sometimes called{" "}
            <a className="cb-factoid" href="#" data-title="SLAPP Litigation (Strategic Lawsuits Against Public Participation)" data-summary="First documented by Professors Penelope Canan and George Pring (University of Denver, 1988), SLAPP suits are civil complaints filed not to prevail on the merits but to exhaust the defendant's resources through litigation costs. As of 2025, 33 U.S. states have enacted Anti-SLAPP statutes offering varying degrees of protection. The federal SPEAK FREE Act has been introduced in multiple Congresses but has not been enacted into law. International jurisdictions increasingly recognize SLAPP as a press-freedom threat; the EU adopted the Anti-SLAPP Directive in 2024.">SLAPP litigation</a>{" "}
            (Strategic Lawsuits Against Public Participation) — is the documented practice of filing meritless legal actions against journalists, researchers, and independent publishers not with any expectation of prevailing in court but with the calculated intent of exhausting the target's financial resources before the case reaches adjudication. It is a suppression tool. It is effective. And in the United States, where{" "}
            <a className="cb-factoid" href="#" data-title="First Amendment, U.S. Constitution (1791)" data-summary="Ratified December 15, 1791 as part of the Bill of Rights. Text (press clause): 'Congress shall make no law ... abridging the freedom of speech, or of the press.' Landmark press-freedom cases include Near v. Minnesota (1931, prior restraint), New York Times Co. v. Sullivan (1964, actual malice standard), Pentagon Papers case (1971, national security vs. press), and Bartnicki v. Vopper (2001, public concern doctrine). Despite these protections, SLAPP litigation operates effectively within First Amendment jurisdictions by exploiting litigation costs rather than legal merit.">First Amendment</a>{" "}
            protections are nominally the strongest in the world, it operates with documented regularity against precisely the kind of journalism this platform publishes.
          </p>
          <p>
            The{" "}
            <a className="cb-factoid" href="#" data-title="Nevis LLC Act (1995, amended 2017)" data-summary="The Nevis Limited Liability Company Ordinance governs LLC formation in the Federal Territory of Nevis, Saint Kitts and Nevis. Section 41 of the Act requires any foreign plaintiff to post a minimum cash bond of EC$100,000 (approx. US$37,000) before an action against a Nevis LLC can be initiated in the High Court of St. Kitts and Nevis. The provision is widely documented as an effective barrier to nuisance and SLAPP-style litigation targeting Nevis-domiciled entities.">Nevis LLC Act</a>{" "}
            creates what we have termed a Legal Moat. Any foreign plaintiff who wishes to bring a legal action against Metricadia Research, LLC must first post a $100,000 cash bond with the{" "}
            <a className="cb-factoid" href="#" data-title="High Court of Justice, Eastern Caribbean Supreme Court (St. Kitts & Nevis)" data-summary="The High Court of Justice in St. Kitts and Nevis is a division of the Eastern Caribbean Supreme Court, established under the Eastern Caribbean Supreme Court Act. It has original jurisdiction over civil and criminal matters arising within the Federation of Saint Kitts and Nevis. Foreign plaintiffs seeking to bring an action against a Nevis LLC must initiate proceedings in this court and are required to post the statutory cash bond under Section 41 of the Nevis LLC Act before the case may proceed.">High Court of St. Kitts and Nevis</a>{" "}
            before proceedings can be initiated. This ensures that only claims with genuine legal and financial substance behind them can reach the point of requiring our response.
          </p>
          <Callout variant="blue">
            We do not operate from this jurisdiction to evade accountability. Our journalism is accountable — every claim traceable to a named primary source any reader can independently verify. We operate from this jurisdiction because the documented record of how independent journalism platforms have been legally silenced in the United States required a structural response. We comply with orders issued by the High Court of St. Kitts and Nevis. We do not comply with foreign subpoenas, extrajudicial data requests, or informal legal pressure from jurisdictions whose courts we are not subject to. This is not non-compliance. This is jurisdiction.
          </Callout>
        </SectionCard>

        {/* Section 2 — Iceland */}
        <SectionCard eyebrow="Section 2" title="The Infrastructure: Icelandic Data Sovereignty">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 -mx-1">
            {[
              { label: "Press Freedom Rank", value: "Top 3 Globally", note: "Reporters Without Borders, 2024" },
              { label: "Data Privacy", value: "EEA / GDPR+", note: "Extended domestic protections" },
              { label: "Legislative Priority", value: "Press Protection", note: "Formal parliamentary mandate" },
              { label: "Foreign Data Requests", value: "Rebuffed by Statute", note: "Requires Icelandic court order" },
            ].map(({ label, value, note }) => (
              <div key={label} className="rounded-xl bg-[#F5C518]/10 border border-[#F5C518]/30 px-4 py-3 text-center">
                <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1">{label}</p>
                <p className="text-sm font-black text-[#1a3a8f] leading-tight mb-0.5">{value}</p>
                <p className="text-[10px] text-slate-400">{note}</p>
              </div>
            ))}
          </div>
          <p>
            The ClownBinge newsroom and the Metricadia Research archive are hosted exclusively on servers physically located in Iceland — the second layer of what we refer to as the <strong>Sovereign Moat</strong>: a dual-jurisdiction structure in which the legal entity operates from St. Kitts and Nevis and the physical data infrastructure operates from Iceland.
          </p>
          <p>
            Iceland's position as a global leader in press freedom is not rhetorical. It is legislated. The Icelandic parliament has formally identified the protection of investigative journalism infrastructure as a national priority. Iceland consistently ranks in the top three countries globally for press freedom, as documented by{" "}
            <a className="cb-factoid" href="#" data-title="Reporters Without Borders (RSF) — World Press Freedom Index" data-summary="Reporters Without Borders (Reporters Sans Frontières / RSF) is an international NGO headquartered in Paris, France. It has published the annual World Press Freedom Index since 2002, ranking 180 countries across five indicators: political context, legal framework, economic context, sociocultural context, and safety. Iceland has ranked #1 or #2 globally in 12 of the past 14 editions. The 2024 Index ranked Iceland #1 globally (score: 94.65/100). Norway ranked #2; Denmark ranked #3.">Reporters Without Borders</a>. Its domestic privacy law aligns with the EEA's{" "}
            <a className="cb-factoid" href="#" data-title="General Data Protection Regulation (GDPR) — Regulation (EU) 2016/679" data-summary="The GDPR entered into force May 25, 2018 and applies across all EU member states and EEA countries, including Iceland. Key provisions: lawful basis requirements for data processing (Art. 6), data subject rights including access and erasure (Arts. 15-22), mandatory breach notification within 72 hours (Art. 33), and penalties up to €20 million or 4% of global annual revenue. Iceland implements the GDPR through the Act on Data Protection and the Processing of Personal Data (Act No. 90/2018), which extends additional domestic protections for journalistic and research data processing beyond the EU baseline.">General Data Protection Regulation</a>{" "}
            while extending additional sovereign protections that exceed those requirements.
          </p>
          <Callout variant="blue">
            Our 40,000-plus global source monitoring infrastructure, our internal research methodologies, our unpublished editorial work product, and the data of every reader who engages with this platform are stored within this architecture. They are not on AWS. They are not on Google Cloud. They are not subject to{" "}
            <a className="cb-factoid" href="#" data-title="National Security Letters (18 U.S.C. § 2709)" data-summary="National Security Letters (NSLs) are administrative subpoenas issued by the FBI under 18 U.S.C. § 2709, authorized by the Electronic Communications Privacy Act (1986) and significantly expanded by the USA PATRIOT Act (2001). They require no judicial approval and carry automatic gag orders prohibiting the recipient from disclosing receipt. Between 2003 and 2022, the FBI issued approximately 400,000 NSLs. Major U.S. technology and telecommunications companies have received and complied with NSLs. Providers operating outside U.S. jurisdiction under foreign sovereign law are not obligated to comply with NSLs.">National Security Letters</a>{" "}
            or informal FBI/DOJ data requests that U.S.-hosted providers have historically complied with without notifying their users. <strong>This is intentional. This is the structure.</strong>
          </Callout>
        </SectionCard>

        {/* Section 3 — Paradox */}
        <SectionCard eyebrow="Section 3" title="The Paradox of Professionalism: Why We Left">
          <blockquote className="border-l-4 pl-5 py-1 italic text-base text-slate-600" style={{ borderColor: "#F5C518" }}>
            "It is a documented paradox of the 21st century that to protect the founding principles of Western intellectual inquiry, one must frequently move outside of Western administrative reach."
            <footer className="text-xs font-bold text-[#1a3a8f] mt-2 not-italic">— Metricadia Research, LLC</footer>
          </blockquote>
          <p>
            The United States was founded on a theory of press freedom that has no formal parallel in the legal architecture of any other nation on earth. The{" "}
            <a className="cb-factoid" href="#" data-title="First Amendment, U.S. Constitution (1791)" data-summary="Ratified December 15, 1791 as part of the Bill of Rights. Text (press clause): 'Congress shall make no law ... abridging the freedom of speech, or of the press.' Landmark press-freedom cases include Near v. Minnesota (1931, prior restraint), New York Times Co. v. Sullivan (1964, actual malice standard), Pentagon Papers case (1971, national security vs. press), and Bartnicki v. Vopper (2001, public concern doctrine). Despite these protections, SLAPP litigation operates effectively within First Amendment jurisdictions by exploiting litigation costs rather than legal merit.">First Amendment</a>{" "}
            does not merely permit free speech. It prohibits Congress from abridging it. This is the structural premise of American civic life, rooted in the recognition by the founding generation that the ability of journalists and citizens to speak truthfully about power was the precondition for everything else the republic was supposed to be.
          </p>
          <p>
            The documented reality of American journalism in 2025 is that this architecture has been substantially hollowed out — not by the repeal of the First Amendment but by the economic architecture of media consolidation, the legal architecture of SLAPP litigation, the technical architecture of platform-controlled distribution, and the social architecture of the Respectability Framework: the systematic enforcement of performed legitimacy as a condition of institutional access.
          </p>
          <div className="rounded-xl bg-slate-900 px-5 py-4">
            <p className="text-[#F5C518] font-black text-xs uppercase tracking-widest mb-3">What Cannot Be Done to Us</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {[
                { label: "Cannot be payment-cancelled", desc: "Corporate domicile is outside the pressure campaigns that terminate domestic accounts" },
                { label: "Cannot be shadow-banned by a host", desc: "We do not have a domestic host" },
                { label: "Cannot be doxed via data request", desc: "Icelandic infrastructure does not respond to foreign extrajudicial requests" },
                { label: "Cannot be NSL'd", desc: "Not subject to informal FBI/DOJ data demands that U.S. providers routinely comply with" },
              ].map(({ label, desc }) => (
                <div key={label} className="rounded-lg bg-white/5 px-4 py-3">
                  <p className="text-white font-bold text-xs mb-1">{label}</p>
                  <p className="text-slate-400 text-xs leading-snug">{desc}</p>
                </div>
              ))}
            </div>
          </div>
          <Callout variant="gold">
            We have not built this architecture because we anticipate publishing anything that cannot withstand scrutiny. We have built it because the documented history of independent journalism demonstrates that the ability to withstand scrutiny is not the variable that determines survival.
          </Callout>
        </SectionCard>

        {/* Section 4 — Zero-Inference */}
        <SectionCard eyebrow="Section 4" title="Zero-Inference Data Policy">
          <p>
            Consistent with our Truth-Based rules of engagement, we operate under a Zero-Inference data policy with four operative principles:
          </p>
          <div className="flex flex-col gap-3">
            {[
              {
                icon: <EyeOff className="w-5 h-5" />,
                title: "We Do Not Track",
                body: "Metricadia Research, LLC does not utilize invasive user persona tracking, behavioral analytics profiles, or cross-site surveillance cookies. We do not build audience profiles. We do not sell reader behavior data. We do not participate in the data brokerage economy that treats every reader as a product to be monetized. Our readers are not our product. Our journalism is our product.",
              },
              {
                icon: <Lock className="w-5 h-5" />,
                title: "We Do Not Disclose",
                body: (
                  <>
                    As a Nevis-domiciled entity with Icelandic data infrastructure, we do not respond to foreign extrajudicial data requests. We do not comply with{" "}
                    <a className="cb-factoid" href="#" data-title="National Security Letters (18 U.S.C. § 2709)" data-summary="National Security Letters (NSLs) are administrative subpoenas issued by the FBI under 18 U.S.C. § 2709, authorized by the Electronic Communications Privacy Act (1986) and significantly expanded by the USA PATRIOT Act (2001). They require no judicial approval and carry automatic gag orders prohibiting the recipient from disclosing receipt. Between 2003 and 2022, the FBI issued approximately 400,000 NSLs. Major U.S. technology and telecommunications companies have received and complied with NSLs. Providers operating outside U.S. jurisdiction under foreign sovereign law are not obligated to comply with NSLs.">National Security Letters</a>, informal law enforcement requests, or private legal demands issued outside the jurisdiction of the{" "}
                    <a className="cb-factoid" href="#" data-title="High Court of Justice, Eastern Caribbean Supreme Court (St. Kitts & Nevis)" data-summary="The High Court of Justice in St. Kitts and Nevis is a division of the Eastern Caribbean Supreme Court, established under the Eastern Caribbean Supreme Court Act. It has original jurisdiction over civil and criminal matters arising within the Federation of Saint Kitts and Nevis. Foreign plaintiffs seeking to bring an action against a Nevis LLC must initiate proceedings in this court and are required to post the statutory cash bond under Section 41 of the Nevis LLC Act before the case may proceed.">High Court of St. Kitts and Nevis</a>. We are not in a position to disclose reader data to foreign parties because our legal and technical architecture does not permit it. This is by design.
                  </>
                ),
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
              <div key={title} className="flex gap-4 rounded-xl border border-slate-200 bg-slate-50 px-5 py-4">
                <div className="shrink-0 w-9 h-9 rounded-full bg-[#1a3a8f]/10 flex items-center justify-center text-[#1a3a8f] mt-0.5">
                  {icon}
                </div>
                <div>
                  <p className="font-bold text-[#1a3a8f] text-sm mb-1">{title}</p>
                  <p className="text-sm text-slate-600 leading-relaxed">{body}</p>
                </div>
              </div>
            ))}
          </div>
        </SectionCard>

        {/* Section 5 — Reader Rights */}
        <SectionCard eyebrow="Section 5" title="Your Rights Under This Policy">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {[
              {
                icon: "🗑️",
                title: "Right to Deletion",
                body: "Request deletion of any personally identifiable data at any time. Email clownbinge@metricadia.com. Processed within 48 hours with written confirmation.",
              },
              {
                icon: "📭",
                title: "Right to Unsubscribe",
                body: "Unsubscribe from our newsletter at any time using the link in any email. Permanently removed within 24 hours.",
              },
              {
                icon: "👤",
                title: "Right to a Human",
                body: "Privacy inquiries are not routed through automated systems. The person who reads your request is the person who responds to it.",
              },
            ].map(({ icon, title, body }) => (
              <div key={title} className="rounded-xl border border-slate-200 bg-white px-5 py-4 text-center">
                <div className="text-2xl mb-2">{icon}</div>
                <p className="font-bold text-[#1a3a8f] text-sm mb-1">{title}</p>
                <p className="text-xs text-slate-500 leading-relaxed">{body}</p>
              </div>
            ))}
          </div>
          <p className="text-slate-500 text-xs">
            You may request a copy of any personally identifiable data we hold about you. In the overwhelming majority of cases, the answer will be: your email address, submitted voluntarily. We do not hold behavioral profiles, demographic inferences, or third-party appended data. We cannot provide data we do not have.
          </p>
        </SectionCard>

        {/* Baldwin close */}
        <div className="rounded-2xl px-7 py-8 border mb-6" style={{ background: "#0d1f54", borderColor: "rgba(245,197,24,0.2)" }}>
          <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-white/40 mb-4">On Facing the Record</p>
          <blockquote className="text-lg sm:text-xl font-medium text-white leading-relaxed mb-4 border-none p-0 m-0">
            "Not everything that is faced can be changed, but nothing can be changed until it is faced."
          </blockquote>
          <footer className="text-sm text-white/60 mt-3">
            — James Baldwin (1962)
          </footer>
          <div className="border-t border-white/10 mt-6 pt-5">
            <p className="text-sm text-white/70 leading-relaxed">
              We have faced the structural vulnerabilities of modern journalism: the litigation weaponized as censorship, the platforms that function as gatekeepers, the infrastructure dependencies that can be severed by a single administrative decision. We have built the firewall required to survive them. This policy is the public record of that architecture. It is locked. It will not change without notice.
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="pt-4 border-t border-slate-200 grid grid-cols-2 sm:grid-cols-4 gap-y-1 gap-x-4">
          {[
            ["Entity", "Metricadia Research, LLC"],
            ["Jurisdiction", "Nevis, St. Kitts & Nevis (SKN)"],
            ["Infrastructure", "Republic of Iceland"],
            ["Inquiries", "clownbinge@metricadia.com"],
          ].map(([label, value]) => (
            <div key={label}>
              <p className="text-[9px] font-black uppercase tracking-widest text-slate-400">{label}</p>
              <p className="text-xs text-slate-500 font-mono">{value}</p>
            </div>
          ))}
        </div>
        <p className="text-[10px] text-slate-400 font-mono mt-3 uppercase tracking-widest">
          Independent. Verified. The Primary Source.
        </p>

      </div>

      {factoid && (
        <FactoidPopup
          factoid={factoid}
          popupRef={popupRef}
          copied={copied}
          isMobile={isMobile}
          onClose={closeFactoid}
          onCopy={handleCopy}
        />
      )}
    </Layout>
  );
}
