import { Layout } from "@/components/Layout";
import { AdminPageHeader } from "@/components/AdminPageHeader";
import { usePageSeoHead } from "@/hooks/use-seo-head";
import { useState } from "react";

const SCORE_LEVELS = [
  { level: 1, label: "Loose Change", desc: "A minor documented inconsistency. A misstatement, a quietly drifted position, or a contradicted detail for which plausible deniability exists in the primary record." },
  { level: 2, label: "Paper Trail", desc: "A documented contradiction with arguable grounds for distinction. The primary sources establish a gap; the subject retains defensible room to characterize the positions as different rather than contradictory." },
  { level: 3, label: "Public Record", desc: "A clear, documented contradiction between a stated position and a recorded action. The subject's own record requires argumentation against itself to deny the gap." },
  { level: 4, label: "The Pivot", desc: "A verifiable, documented reversal that directly affected the subject's constituents or followers. The gap between documented word and documented deed is no longer readily deniable against the primary sources." },
  { level: 5, label: "Caught on File", desc: "Documented betrayal of a stated core principle, supported by unambiguous primary sources. The subject's own disclosed records are the primary instrument of contradiction." },
  { level: 6, label: "Structural Hypocrisy", desc: "Multiple documented reversals forming a verifiable pattern across the primary record. The contradiction is not isolated; it is recurring and documentable across multiple independent sources within the verification hierarchy." },
  { level: 7, label: "The Quiet Part Loud", desc: "Documented evidence that the public position was inconsistent with the subject's own concurrent private disclosures, filed records, or recorded statements." },
  { level: 8, label: "Spectacular Own Goal", desc: "The documented contradiction directly and materially undermines the subject's defining public identity, established without ambiguity by primary sources." },
  { level: 9, label: "Career-Defining", desc: "A documented contradiction so complete, so thoroughly sourced across multiple independent primary sources, and so consequential that it materially and permanently alters the subject's documented public record." },
  { level: 10, label: "Historic", desc: "A documented contradiction so total and so irrefutable across multiple independent source tiers that it constitutes a standing monument in the primary record. Reserved exclusively for instances in which no reasonable application of the Section 7 source standards can produce a defensible alternative reading of the documentary evidence." },
];

function scoreColor(level: number) {
  if (level <= 3) return { bg: "bg-yellow-100", border: "border-yellow-400", text: "text-yellow-800", badge: "bg-yellow-400 text-yellow-900" };
  if (level <= 6) return { bg: "bg-orange-100", border: "border-orange-400", text: "text-orange-800", badge: "bg-orange-400 text-white" };
  if (level <= 8) return { bg: "bg-red-100", border: "border-red-500", text: "text-red-800", badge: "bg-red-500 text-white" };
  return { bg: "bg-red-950", border: "border-red-800", text: "text-red-100", badge: "bg-red-900 text-red-100" };
}

function StatBox({ value, label }: { value: string; label: string }) {
  return (
    <div className="bg-[#F5C518]/10 border border-[#F5C518]/40 rounded-xl px-5 py-4 text-center">
      <div className="text-2xl font-black text-[#1a3a8f]">{value}</div>
      <div className="text-xs text-slate-600 mt-1 leading-snug">{label}</div>
    </div>
  );
}

function SectionCard({ number, title, children }: { number?: string; title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden mb-6">
      <div className="bg-[#1a3a8f] px-6 py-3 flex items-center gap-3">
        {number && (
          <span className="text-[#F5C518] font-black text-sm bg-[#F5C518]/20 rounded-full w-7 h-7 flex items-center justify-center shrink-0">{number}</span>
        )}
        <h2 className="text-white font-bold text-base sm:text-lg leading-tight">{title}</h2>
      </div>
      <div className="px-6 py-5 text-slate-700 text-sm leading-relaxed space-y-3">{children}</div>
    </div>
  );
}

function TierCard({ tier, title, examples, children }: { tier: string; title: string; examples?: string; children: React.ReactNode }) {
  const colors = tier === "1"
    ? "border-[#F5C518] bg-[#fffdf0]"
    : tier === "2"
    ? "border-blue-300 bg-blue-50"
    : "border-slate-300 bg-slate-50";
  const badgeColors = tier === "1"
    ? "bg-[#F5C518] text-[#1a3a8f]"
    : tier === "2"
    ? "bg-blue-600 text-white"
    : "bg-slate-600 text-white";
  return (
    <div className={`rounded-xl border-2 ${colors} p-5`}>
      <div className="flex items-center gap-3 mb-3">
        <span className={`${badgeColors} text-xs font-black px-3 py-1 rounded-full uppercase tracking-wider`}>Tier {tier}</span>
        <span className="font-bold text-slate-800 text-sm">{title}</span>
      </div>
      <div className="text-sm text-slate-600 leading-relaxed mb-2">{children}</div>
      {examples && <div className="text-xs text-slate-500 italic">{examples}</div>}
    </div>
  );
}

export default function Ethics() {
  const [selectedScore, setSelectedScore] = useState<number | null>(null);
  const [refsOpen, setRefsOpen] = useState(false);

  usePageSeoHead({
    title: "Editorial Standards & Ethics",
    description: "ClownBinge editorial standards, fact-checking methodology, and sourcing policy. All content sourced from primary government and institutional documents. Metricadia Research, LLC.",
    path: "/ethics",
    schemaType: "WebPage",
  });

  return (
    <Layout>
      <div className="max-w-3xl mx-auto px-4 py-12">
        <AdminPageHeader
          title="Editorial Standards, Ethics, and Analytical Methodology"
          subtitle="Metricadia Research, LLC — ClownBinge.com — Updated March 2026"
        />

        {/* Abstract */}
        <div className="rounded-2xl bg-[#1a3a8f] text-white px-6 py-6 mb-8 relative overflow-hidden">
          <div className="absolute top-0 right-0 text-[8rem] leading-none opacity-5 font-black select-none pointer-events-none">§</div>
          <div className="text-[#F5C518] text-xs font-black uppercase tracking-widest mb-2">Abstract</div>
          <p className="text-sm leading-relaxed text-blue-100">
            The proliferation of fabricated news, state-sponsored disinformation, and politically engineered
            misinformation constitutes one of the most consequential threats to democratic governance in the
            twenty-first century. This policy document outlines the editorial ethics, sourcing standards, and
            verification methodology that govern ClownBinge, a public accountability platform operated by
            Metricadia Research, LLC. Drawing on peer-reviewed research in political communication, media
            studies, and democratic theory, this document establishes the empirical basis for ClownBinge's
            mission and articulates the standards to which it holds itself and the public figures it covers.
          </p>
        </div>

        {/* Platform Framework */}
        <SectionCard title="Platform Framework: Satire as Analytical Lens">
          <p>
            ClownBinge operates within an established tradition of accountability journalism that employs
            satirical framing as a presentational device. The platform name, visual identity, and category
            terminology use the vernacular term "clown" as a rhetorical instrument with documented roots in
            democratic political commentary, consistent with its use in editorial cartooning, political satire,
            and accountability journalism since the nineteenth century.
          </p>
          <div className="rounded-lg bg-[#F5C518]/10 border-l-4 border-[#F5C518] px-4 py-3 text-slate-700">
            <strong>The satirical presentational layer and the empirical methodology are not in tension.</strong> The satirical
            register is the frame; the primary source documentation is the substance. All content must satisfy
            the verification standards defined in Section 7 regardless of any satirical or analytical framing
            applied to any headline, case label, or platform feature.
          </div>
          <p>
            This framing is explicitly and exclusively presentational. Coverage is limited to the documented public conduct of public
            figures in the exercise of their public roles. When religious leaders or institutions are covered, coverage is
            confined to documented instances in which their public conduct contradicts their own publicly stated doctrinal positions.
          </p>
        </SectionCard>

        {/* The Crisis — stats spotlight */}
        <SectionCard number="1" title="The Misinformation Crisis">
          <p>
            The United States is experiencing a sustained, multi-vector assault on its information environment
            compromised by three overlapping forces: foreign state-sponsored disinformation campaigns, domestically
            produced partisan misinformation, and the structural incentives of algorithmic social media platforms
            that reward engagement over accuracy (Lazer et al., 2018; Wardle &amp; Derakhshan, 2017).
          </p>
          <div className="grid grid-cols-3 gap-3 my-4">
            <StatBox value="6×" label="Faster than true news — false stories spread on Twitter (Vosoughi et al., 2018)" />
            <StatBox value="1 in 3" label="Americans who trust most news sources most of the time (Reuters Institute, 2023)" />
            <StatBox value="48%" label="U.S. adults who reported seeing made-up news online often or sometimes (Pew, 2021)" />
          </div>
          <p>
            ClownBinge was founded in response to this documented crisis. Its mission is not to produce
            opinion, commentary, or punditry, but to curate verified, cited, and sourced documentation of
            public accountability failures by elected officials and those entrusted with the public's confidence.
          </p>
        </SectionCard>

        {/* Foreign disinformation */}
        <SectionCard number="2" title="Foreign State-Sponsored Disinformation">
          <p>
            The intervention of foreign state actors in the American information environment is not a
            hypothesis. It is a documented, adjudicated, and ongoing reality confirmed by the U.S. Senate
            Select Committee on Intelligence (2020), the Mueller Report (DOJ, 2019), and the Director of
            National Intelligence's annual Worldwide Threat Assessment (ODNI, 2023).
          </p>
          <div className="grid grid-cols-3 gap-3 my-4">
            <StatBox value="126M" label="Facebook users reached by the Internet Research Agency (IRA)" />
            <StatBox value="185M+" label="Instagram likes accumulated by IRA content" />
            <StatBox value="1.4M" label="Twitter users reached by IRA operations (Senate Intel, 2020)" />
          </div>
          <p>
            China's operations emphasized narrative dilution and credibility laundering. Iran's, documented by
            FireEye (2018), targeted both the political left and right — demonstrating that foreign disinformation
            has no single ideological preference, only a strategic goal of maximizing division.
          </p>
          <div className="rounded-lg bg-slate-100 border border-slate-200 px-4 py-3 text-slate-600 text-xs">
            Every piece of content on ClownBinge is evaluated against the question of whether its claims can be
            sourced to verified American institutions — not social media narratives or unverified accounts.
          </div>
        </SectionCard>

        {/* Domestic misinformation */}
        <SectionCard number="3" title="Domestically Produced Political Misinformation">
          <p>
            Foreign interference accounts for only a portion of the misinformation circulating in American
            political discourse. Domestically produced political misinformation constitutes an independent
            threat that cannot be attributed to foreign actors (Bennett &amp; Livingston, 2018; Roozenbeek et al., 2020).
          </p>
          <p>
            Pennycook and Rand (2019) identify two primary drivers: <strong>motivated reasoning</strong> (accepting
            information that confirms pre-existing beliefs) and <strong>inattention</strong> (sharing content without
            evaluating its truth value). Domestically engineered misinformation takes several forms:
          </p>
          <ul className="space-y-1 list-none pl-0">
            {[
              "Selective presentation of accurate data stripped of context",
              "Fabrication of quotations attributed to public figures",
              "Manipulation of images and video, including AI-generated synthetic media",
              "Deliberate misrepresentation of legislative outcomes, voting records, and policy positions",
            ].map((item) => (
              <li key={item} className="flex items-start gap-2">
                <span className="text-[#F5C518] mt-0.5">▸</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
          <p className="text-xs text-slate-500">Each of these tactics is specifically targeted by ClownBinge's verification methodology.</p>
        </SectionCard>

        {/* Algorithmic */}
        <SectionCard number="4" title="Algorithmic Amplification and Platform Responsibility">
          <p>
            Facebook, X, YouTube, and TikTok are not neutral conduits for information. They are engagement
            optimization systems that systematically amplify content that produces emotional activation,
            irrespective of its accuracy (Tufekci, 2018; Bail et al., 2018).
          </p>
          <div className="rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-red-800 text-sm">
            Frances Haugen's 2021 Senate testimony and subsequent internal Facebook documents established that
            Meta's own engineers had identified recommendation systems that drove users toward increasingly
            extreme content as a <em>predictable output of engagement optimization</em>.
          </div>
          <p>
            ClownBinge's response is structural: by requiring every factual claim be sourced to a primary
            government document, peer-reviewed research, or a verified news organization — and displaying those
            sources transparently via the factoid citation system — ClownBinge creates a verifiable record
            readers can evaluate independently of any platform recommendation system.
          </p>
        </SectionCard>

        {/* Economic */}
        <SectionCard number="5" title="The Economic Structure of Misinformation">
          <p>
            Misinformation is not produced exclusively for ideological reasons. Allcott and Gentzkow (2017)
            documented that the majority of fake news websites encountered during the 2016 election were
            <strong> commercially motivated</strong> — designed to maximize advertising revenue through viral
            engagement rather than to advance any political agenda. The Macedonian teenager farms that produced
            pro-Trump content were primarily motivated by Google AdSense revenue, not political conviction.
          </p>
          <p>
            As long as engagement metrics drive platform advertising revenue, and false content generates
            higher engagement than accurate content, the economic incentive to produce misinformation will persist.
          </p>
          <div className="rounded-lg bg-[#F5C518]/10 border-l-4 border-[#F5C518] px-4 py-3 text-slate-700">
            ClownBinge's monetization model is designed to align economic incentives with accuracy rather
            than engagement. Revenue is derived from book sales, membership subscriptions, and display
            advertising subject to editorial standards — not per-impression viral amplification.
          </div>
        </SectionCard>

        {/* Democratic governance */}
        <SectionCard number="6" title="Impact on Democratic Governance">
          <p>
            Roozenbeek et al. (2020) identify three primary mechanisms through which misinformation
            undermines democratic function:
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 my-3">
            {[
              { icon: "🗳️", label: "Electoral Distortion", desc: "Corrupting voters' factual beliefs about candidates and policies" },
              { icon: "🏛️", label: "Institutional Erosion", desc: "Systematically delegitimizing sources of authoritative information" },
              { icon: "🚫", label: "Civic Suppression", desc: "Demobilizing voters who perceive the information environment as irreparably corrupt" },
            ].map((m) => (
              <div key={m.label} className="rounded-xl bg-slate-50 border border-slate-200 px-4 py-4 text-center">
                <div className="text-2xl mb-1">{m.icon}</div>
                <div className="font-bold text-slate-800 text-xs mb-1">{m.label}</div>
                <div className="text-xs text-slate-500">{m.desc}</div>
              </div>
            ))}
          </div>
          <p>
            The First Amendment protects political speech broadly, including speech that is inaccurate or misleading.
            However, constitutional protection for speech does not constitute protection from public documentation.
            ClownBinge's coverage is grounded in the public interest mandate, not in partisan advocacy.
          </p>
        </SectionCard>

        {/* Section 7 */}
        <div className="rounded-2xl border-2 border-[#1a3a8f] overflow-hidden mb-6">
          <div className="bg-[#1a3a8f] px-6 py-4">
            <div className="text-[#F5C518] text-xs font-black uppercase tracking-widest mb-1">Section 7</div>
            <h2 className="text-white font-bold text-lg">ClownBinge Editorial Standards &amp; Verification Methodology</h2>
            <p className="text-blue-200 text-xs mt-1">
              No factual claim may be published without citation to at least one source within the three-tier hierarchy.
              All citations are displayed transparently within the article body.
            </p>
          </div>
          <div className="px-6 py-5 space-y-4">
            <div className="grid grid-cols-1 gap-4">
              <TierCard tier="1" title="Primary Government Sources" examples="Official government records, congressional docs, federal agency publications, court filings, FEC records, financial disclosures">
                Treated as authoritative for the facts they contain regarding the conduct of public officials.
                These include documented statements made by officials in the exercise of their public duties.
              </TierCard>
              <TierCard tier="2" title="Nonpartisan Research &amp; Academic Sources" examples="Pew Research Center, Brookings Institution, Congressional Budget Office, Government Accountability Office">
                Peer-reviewed academic research, reports from nonpartisan research institutions with documented
                methodology, and established fact-checking organizations. Sources whose primary mission is advocacy,
                regardless of tax status, do not qualify.
              </TierCard>
              <TierCard tier="3" title="Verified News Organizations" examples="Associated Press, Reuters, BBC News, NPR, The New York Times, The Washington Post, The Wall Street Journal">
                News organizations with published editorial standards, a documented corrections policy, and
                identifiable editorial leadership. Inclusion does not constitute endorsement of editorial positions,
                only recognition of documented journalistic standards.
              </TierCard>
            </div>

            {/* Citation System */}
            <div className="rounded-xl bg-[#fffdf0] border border-[#F5C518]/40 px-5 py-4">
              <div className="font-bold text-slate-800 mb-2 text-sm">7.4 — The ClownBinge Citation System</div>
              <p className="text-sm text-slate-600 mb-2">
                Every factoid link embedded within a ClownBinge article constitutes a citation — displayed as
                underlined text with a dotted gold border. Clicking opens a citation card with the source title,
                summary, and URL. All citations are compiled in the Verified References section at the
                conclusion of every article, and counted in the Citations badge in the article header.
              </p>
              <div className="flex gap-3 flex-wrap text-xs">
                <span className="bg-[#F5C518]/20 border border-[#F5C518]/40 rounded-full px-3 py-1 text-[#1a3a8f] font-semibold">✓ Independently verifiable by readers</span>
                <span className="bg-[#F5C518]/20 border border-[#F5C518]/40 rounded-full px-3 py-1 text-[#1a3a8f] font-semibold">✓ Permanent searchable public record</span>
              </div>
            </div>

            {/* What we don't publish */}
            <div className="rounded-xl bg-red-50 border border-red-200 px-5 py-4">
              <div className="font-bold text-red-800 mb-2 text-sm">7.5 — What ClownBinge Does Not Publish</div>
              <ul className="text-sm text-red-700 space-y-1">
                {[
                  "Anonymous tips or unverified social media posts",
                  "Rumor, speculation, or content outside the three-tier hierarchy",
                  "Private information not relevant to a public figure's exercise of public duties",
                  "Opinion presented as fact",
                  "Satirical commentary presented as primary sourcing",
                ].map((item) => (
                  <li key={item} className="flex items-start gap-2">
                    <span className="text-red-400 mt-0.5">✕</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Self-Own Score */}
        <div className="rounded-2xl border-2 border-slate-800 overflow-hidden mb-6" id="self-own-methodology">
          <div className="bg-slate-900 px-6 py-4">
            <div className="text-[#F5C518] text-xs font-black uppercase tracking-widest mb-1">Section 7.6</div>
            <h2 className="text-white font-bold text-lg">The ClownBinge Self-Own Score</h2>
            <p className="text-slate-400 text-xs mt-1">
              A proprietary empirical accountability metric — not editorial opinion, but a measure of <em>documentary gap</em>.
            </p>
          </div>
          <div className="px-6 py-5">
            <p className="text-sm text-slate-600 mb-1">
              The Self-Own Score quantifies the magnitude of documented contradiction between a public figure's
              stated positions and their verifiable actions or disclosed records. It is expressed on a
              <strong> 10-point ordinal scale</strong> — each point corresponds to a defined evidentiary threshold,
              not a subjective editorial determination. A score may not be assigned on the basis of anonymous
              sourcing, reputation, or circumstantial evidence.
            </p>
            <p className="text-xs text-slate-500 mb-4">
              The structured data is encoded as an <code>additionalProperty</code> in <code>NewsArticle</code> JSON-LD
              and as a <code>reviewRating</code> in <code>ClaimReview</code> schema, enabling search engines and
              AI answer systems to recognize it as a methodology-grounded analytical rating under E-E-A-T frameworks.
            </p>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">Select a level to see its definition</p>
            <div className="flex gap-2 flex-wrap mb-4">
              {SCORE_LEVELS.map(({ level }) => {
                const c = scoreColor(level);
                const isSelected = selectedScore === level;
                return (
                  <button
                    key={level}
                    onClick={() => setSelectedScore(isSelected ? null : level)}
                    className={`w-9 h-9 rounded-full font-black text-sm border-2 transition-all ${c.badge} ${isSelected ? "scale-125 ring-2 ring-offset-1 ring-slate-400" : "opacity-80 hover:opacity-100 hover:scale-110"}`}
                  >
                    {level}
                  </button>
                );
              })}
            </div>
            {selectedScore !== null && (() => {
              const item = SCORE_LEVELS[selectedScore - 1];
              const c = scoreColor(selectedScore);
              return (
                <div className={`rounded-xl border-2 ${c.border} ${c.bg} px-5 py-4 transition-all`}>
                  <div className="flex items-center gap-2 mb-2">
                    <span className={`${c.badge} font-black text-sm px-3 py-1 rounded-full`}>{item.level}</span>
                    <span className={`font-bold ${c.text}`}>{item.label}</span>
                  </div>
                  <p className={`text-sm ${c.text}`}>{item.desc}</p>
                </div>
              );
            })()}
          </div>
        </div>

        {/* Corrections */}
        <SectionCard number="8" title="Corrections and Accountability">
          <div className="flex gap-4 items-start">
            <div className="text-3xl">📋</div>
            <div className="space-y-2">
              <p>
                ClownBinge maintains a published corrections policy. If a factual error is identified in any
                published piece, a correction will be appended to the article within <strong>48 hours</strong> of
                confirmation, and a public corrections log will document the nature of the error and the corrected information.
              </p>
              <p>
                Corrections are never deleted or obscured; the original text and the correction are both
                preserved in the public record. Submissions identifying potential errors may be submitted
                through the platform's contact form.
              </p>
            </div>
          </div>
        </SectionCard>

        {/* Conclusion */}
        <div className="rounded-2xl bg-gradient-to-br from-[#1a3a8f] to-[#0f2260] text-white px-6 py-6 mb-6 relative overflow-hidden">
          <div className="absolute bottom-0 right-4 text-[6rem] leading-none opacity-5 font-black select-none pointer-events-none">9</div>
          <div className="text-[#F5C518] text-xs font-black uppercase tracking-widest mb-2">Section 9 — Conclusion</div>
          <p className="text-blue-100 text-sm leading-relaxed mb-3">
            The crisis of fabricated news, foreign interference, and politically engineered misinformation
            is not a crisis of technology alone, nor of politics alone, nor of any single actor or platform.
            It is a systemic failure of the information infrastructure on which democratic self-governance
            depends. ClownBinge does not claim to resolve this crisis. It claims only to operate within it
            with documented standards, transparent sourcing, and an unambiguous commitment to primary
            source verification.
          </p>
          <p className="text-[#F5C518] font-bold text-sm">
            The public record belongs to the public. ClownBinge's function is to make it accessible, comprehensible, and impossible to ignore.
          </p>
        </div>

        {/* References — collapsible */}
        <div className="rounded-2xl border border-slate-200 overflow-hidden mb-6">
          <button
            onClick={() => setRefsOpen((v) => !v)}
            className="w-full flex items-center justify-between px-6 py-4 bg-slate-50 hover:bg-slate-100 transition-colors text-left"
          >
            <span className="font-bold text-slate-700">References</span>
            <span className="text-slate-400 text-lg">{refsOpen ? "▲" : "▼"}</span>
          </button>
          {refsOpen && (
            <div className="px-6 py-4 grid grid-cols-1 gap-2">
              {[
                "Allcott, H., & Gentzkow, M. (2017). Social media and fake news in the 2016 election. Journal of Economic Perspectives, 31(2), 211–236. https://doi.org/10.1257/jep.31.2.211",
                "Bail, C. A., et al. (2018). Exposure to opposing views on social media can increase political polarization. PNAS, 115(37), 9216–9221. https://doi.org/10.1073/pnas.1804840115",
                "Bennett, W. L., & Livingston, S. (2018). The disinformation order. European Journal of Communication, 33(2), 122–139. https://doi.org/10.1177/0267323118760317",
                "DiResta, R., et al. (2019). The tactics and tropes of the Internet Research Agency. New Knowledge. https://digitalcommons.unl.edu/senatedocs/2/",
                "FireEye. (2018). Suspected Iranian influence operation. FireEye Intelligence.",
                "Gleicher, N., Goldberg, A., & Thomas, T. (2022). Coordinated inauthentic behavior report: Q3 2022. Meta Transparency Center.",
                "Guess, A. M., et al. (2023). How do social media feed algorithms affect attitudes and behavior in an election campaign? Science, 381(6656), 398–404. https://doi.org/10.1126/science.abp9364",
                "Haugen, F. (2021, October 5). Testimony before the U.S. Senate Committee on Commerce, Science, and Transportation. 117th Congress.",
                "Lazer, D. M. J., et al. (2018). The science of fake news. Science, 359(6380), 1094–1096. https://doi.org/10.1126/science.aao2998",
                "National Academies of Sciences, Engineering, and Medicine. (2020). Evaluating the authenticity of online health information. The National Academies Press.",
                "Office of the Director of National Intelligence. (2023). Annual threat assessment of the U.S. intelligence community. ODNI.",
                "Pennycook, G., & Rand, D. G. (2019). Lazy, not biased. Cognition, 188, 39–50. https://doi.org/10.1016/j.cognition.2018.06.011",
                "Pew Research Center. (2021). Americans' views of the news media in the wake of COVID-19.",
                "Reuters Institute for the Study of Journalism. (2023). Digital news report 2023. University of Oxford.",
                "Roozenbeek, J., et al. (2020). Susceptibility to misinformation about COVID-19 across 26 countries. Royal Society Open Science, 7(10). https://doi.org/10.1098/rsos.201199",
                "Tufekci, Z. (2018, March 10). YouTube, the great radicalizer. The New York Times.",
                "United States Department of Justice. (2019). Report on the investigation into Russian interference in the 2016 presidential election (Vol. I & II). Mueller, R. S.",
                "United States Senate Select Committee on Intelligence. (2020). Report on Russian active measures campaigns and interference in the 2016 U.S. election (Vol. 2). U.S. Government Publishing Office.",
                "Vosoughi, S., Roy, D., & Aral, S. (2018). The spread of true and false news online. Science, 359(6380), 1146–1151. https://doi.org/10.1126/science.aap9559",
                "Wardle, C., & Derakhshan, H. (2017). Information disorder: Toward an interdisciplinary framework for research and policy making. Council of Europe.",
                "Wood, T., & Porter, E. (2019). The elusive backfire effect. Political Behavior, 41(1), 135–163. https://doi.org/10.1007/s11109-018-9443-y",
              ].map((ref) => (
                <div key={ref} className="text-xs text-slate-600 border-b border-slate-100 pb-2 last:border-0 last:pb-0">{ref}</div>
              ))}
            </div>
          )}
        </div>

      </div>
    </Layout>
  );
}
