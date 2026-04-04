import { Layout } from "@/components/Layout";
import { AdminPageHeader } from "@/components/AdminPageHeader";
import { StatWidget } from "@/components/StatWidget";
import { usePageSeoHead } from "@/hooks/use-seo-head";

const THREE_STANDARDS = [
  {
    num: "01",
    rule: "Primary Sources Only",
    detail:
      "Every factual claim traces to a government record, a court filing, or an official document. We do not publish anonymous tips. We do not publish unverified allegations. We do not publish inference about motive. If the record does not support the claim, the claim does not appear.",
  },
  {
    num: "02",
    rule: "Empirical Framing Throughout",
    detail:
      "ClownBinge does not tell readers what to think. We present what the documents say. We let the gap speak. The documents produce the accountability. We organize, source, and publish them. That is the full scope of our editorial role.",
  },
  {
    num: "03",
    rule: "1,500 Words Minimum. Every Article.",
    detail:
      "This is not a formatting preference. It is a substantive commitment. Accountability journalism requires depth. A claim worth publishing is worth building properly. Surface-level takes are not published here. This archive is for readers who want to understand the record.",
  },
];

const SOURCES = [
  "Court filings",
  "Congressional transcripts",
  "Federal agency data",
  "FEC disclosures",
  "Peer-reviewed research — PubMed, CDC",
  "The National Archives",
  "The Ellis Island database",
  "SBA loan records",
];

const NO_LIST = [
  "Political action committees",
  "Dark money organizations",
  "Corporate underwriters with editorial interests",
];

export default function About() {
  usePageSeoHead({
    title: "About ClownBinge",
    description:
      "ClownBinge is verified accountability journalism by Metricadia Research, LLC. Primary sources only. Every article is empirical, cited, and at least 1,500 words.",
    path: "/about",
    schemaType: "AboutPage",
  });

  return (
    <Layout>
      <div className="max-w-3xl mx-auto px-4 py-12">
        <AdminPageHeader title="About ClownBinge" />

        {/* The Name */}
        <div className="rounded-2xl bg-[#1a3a8f] overflow-hidden mb-6 relative">
          <div className="px-6 pt-6 pb-2">
            <div className="text-[#F5C518] text-xs font-black uppercase tracking-widest mb-4">
              The Name
            </div>
            <p className="text-2xl sm:text-3xl font-black text-white leading-tight mb-4">
              A deliberate name for a serious operation.
            </p>
          </div>
          <div className="px-6 pb-6 space-y-3">
            <div className="rounded-xl bg-white/10 px-5 py-4">
              <p className="text-blue-100 text-sm leading-relaxed">
                The <span className="text-[#F5C518] font-bold">clown</span> is
                the system. The disingenuous machinery of corporate, monied,
                nation-state, and political interest journalism — outlets bought,
                captured, or constructed to manufacture consent rather than
                document reality. The press that calls itself independent while
                taking direction from its ad base, its government, or its
                party. The newsroom that buries the story because the story
                leads to the boardroom, the embassy, or the donor list.
              </p>
            </div>
            <div className="rounded-xl bg-white/10 px-5 py-4">
              <p className="text-blue-100 text-sm leading-relaxed">
                That system is the act. We are not. The primary source record —
                court filings, congressional transcripts, FEC disclosures, the
                National Archives — does not have an ad buy. It does not have a
                donor. It does not have a preferred outcome. The documents just
                say what they say. We publish them.
              </p>
            </div>
            <div className="rounded-xl bg-[#F5C518]/15 border border-[#F5C518]/30 px-5 py-4">
              <p className="text-white font-bold text-sm">
                We{" "}
                <span className="text-[#F5C518]">binge</span> on primary sources
                so readers do not have to.
              </p>
              <p className="text-blue-200 text-xs mt-1">
                We go into the archive. We pull out what is verifiable. We
                publish it in plain language. The name earns itself.
              </p>
            </div>
          </div>
        </div>

        {/* Sources we actually use */}
        <div className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden mb-6">
          <div className="bg-slate-800 px-6 py-3">
            <p className="text-white text-xs font-black uppercase tracking-widest">
              Where We Actually Look
            </p>
          </div>
          <div className="px-6 py-4 grid grid-cols-2 sm:grid-cols-4 gap-3">
            {SOURCES.map((s) => (
              <div
                key={s}
                className="rounded-lg bg-[#F5C518]/10 border border-[#F5C518]/30 px-3 py-2 text-center"
              >
                <span className="text-[#1a3a8f] font-semibold text-xs leading-snug">
                  {s}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* The Standard */}
        <div className="rounded-2xl border-2 border-[#1a3a8f] overflow-hidden mb-6">
          <div className="bg-[#1a3a8f] px-6 py-4">
            <div className="text-[#F5C518] text-xs font-black uppercase tracking-widest mb-1">
              The Standard
            </div>
            <p className="text-white font-bold text-lg">
              Three non-negotiable requirements. Every article. No exceptions.
            </p>
          </div>
          <div className="divide-y divide-slate-100">
            {THREE_STANDARDS.map(({ num, rule, detail }) => (
              <div key={num} className="flex gap-5 px-6 py-5 items-start">
                <div className="shrink-0 text-3xl font-black text-[#F5C518]/30 leading-none w-10 text-right">
                  {num}
                </div>
                <div>
                  <p className="font-black text-[#1a3a8f] text-base mb-1">
                    {rule}
                  </p>
                  <p className="text-slate-600 text-sm leading-relaxed">
                    {detail}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Who We Are */}
        <div className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden mb-6">
          <div className="bg-[#1a3a8f] px-6 py-3">
            <p className="text-white font-bold text-base">Who We Are</p>
          </div>
          <div className="px-6 py-5 space-y-4">
            <p className="text-slate-700 text-sm leading-relaxed">
              ClownBinge is operated by{" "}
              <strong>Metricadia Research, LLC</strong>, registered in the
              Federation of Saint Christopher and Nevis. Coverage decisions are
              made against the primary source record. Not the ad buy.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="rounded-xl bg-green-50 border border-green-200 px-4 py-4">
                <p className="text-green-800 font-black text-xs uppercase tracking-wider mb-2">
                  Revenue comes from
                </p>
                <ul className="space-y-1">
                  {[
                    "Advertising",
                    "Memberships",
                    "Pay-per research reports",
                    "ClownBinge FactBook library",
                  ].map((item) => (
                    <li
                      key={item}
                      className="flex items-center gap-2 text-green-700 text-sm"
                    >
                      <span className="text-green-500 font-bold">✓</span>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="rounded-xl bg-red-50 border border-red-200 px-4 py-4">
                <p className="text-red-800 font-black text-xs uppercase tracking-wider mb-2">
                  We accept nothing from
                </p>
                <ul className="space-y-1">
                  {NO_LIST.map((item) => (
                    <li
                      key={item}
                      className="flex items-center gap-2 text-red-700 text-sm"
                    >
                      <span className="text-red-400 font-bold">✕</span>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Corrections */}
        <div className="rounded-2xl bg-slate-800 px-6 py-5 mb-6 flex gap-4 items-start">
          <div className="text-3xl shrink-0">📋</div>
          <div>
            <p className="text-[#F5C518] font-black text-xs uppercase tracking-widest mb-1">
              Corrections
            </p>
            <p className="text-white text-sm leading-relaxed">
              If a factual error is identified, a correction is appended within{" "}
              <strong className="text-[#F5C518]">48 hours</strong>. The original
              text and the correction are both preserved. Corrections are never
              deleted.{" "}
              <a
                href="/contact"
                className="underline text-blue-300 hover:text-blue-200"
              >
                Submit potential errors through the contact form.
              </a>
            </p>
          </div>
        </div>

        {/* Live stats */}
        <StatWidget />

        <p className="text-xs text-muted-foreground mt-6 text-center">
          Metricadia Research, LLC &mdash; ClownBinge.com &mdash; Independent.
          Verified. The Primary Source.
        </p>
      </div>
    </Layout>
  );
}
