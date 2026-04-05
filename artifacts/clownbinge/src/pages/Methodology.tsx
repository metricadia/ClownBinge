import { Layout } from "@/components/Layout";
import { AdminPageHeader } from "@/components/AdminPageHeader";
import { usePageSeoHead } from "@/hooks/use-seo-head";

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden mb-6">
      <div className="bg-[#1a3a8f] px-6 py-3">
        <h2 className="text-white font-bold text-base sm:text-lg leading-tight">{title}</h2>
      </div>
      <div className="px-6 py-5 text-slate-700 text-sm leading-relaxed space-y-3">{children}</div>
    </div>
  );
}

function TierRow({ tier, label, examples }: { tier: string; label: string; examples: string }) {
  const colors =
    tier === "1"
      ? "border-[#F5C518] bg-[#fffdf0]"
      : tier === "2"
      ? "border-blue-300 bg-blue-50"
      : "border-slate-300 bg-slate-50";
  const badge =
    tier === "1"
      ? "bg-[#F5C518] text-[#1a3a8f]"
      : tier === "2"
      ? "bg-blue-600 text-white"
      : "bg-slate-500 text-white";
  return (
    <div className={`rounded-xl border-2 ${colors} p-4 mb-3`}>
      <div className="flex items-start gap-3">
        <span className={`text-xs font-black px-2.5 py-1 rounded-full shrink-0 ${badge}`}>
          Tier {tier}
        </span>
        <div>
          <p className="font-bold text-slate-800 text-sm">{label}</p>
          <p className="text-xs text-slate-600 mt-1">{examples}</p>
        </div>
      </div>
    </div>
  );
}

export default function Methodology() {
  usePageSeoHead({
    title: "Editorial Methodology | ClownBinge",
    description: "How ClownBinge researches, verifies, and publishes accountability journalism. Source standards, editorial pipeline, AI scoring, and the CB Dry Rationalism framework.",
    path: "/methodology",
    schemaType: "AboutPage",
  });

  return (
    <Layout>
      <div className="cb-container max-w-3xl mx-auto py-10 px-4 sm:px-6">
        <AdminPageHeader
          title="Editorial Methodology"
          subtitle="How ClownBinge documents the record — source standards, verification pipeline, and editorial framework."
        />

        <Section title="The CB Dry Rationalism Standard">
          <p>
            Every ClownBinge article is written under the <strong>CB Dry Rationalism</strong> editorial framework.
            Dry Rationalism means the article presents what the primary record shows — nothing more, nothing less.
            The language is declarative, not evaluative. The sources do the work.
          </p>
          <p>
            Prohibited constructions include: evaluative adjectives (<em>damning, pivotal, emblematic</em>),
            conclusion openers (<em>Ultimately, In the end</em>), significance assertions (<em>underscores,
            highlights, cannot be ignored</em>), AI-characteristic phrasing (<em>at its core, by any measure</em>),
            and narrative framing that editorializes the primary record. Every published article is scanned
            against a 27-point pattern library before publication.
          </p>
          <p>
            The goal is Google E-E-A-T over GPT-style fluency. A ClownBinge article should read like
            a well-organized primary source summary — because that is what it is.
          </p>
        </Section>

        <Section title="Source Verification Hierarchy">
          <p className="text-xs font-bold uppercase tracking-widest text-slate-500 mb-3">
            Sources are weighted by tier. Tier 1 is required for every published article.
          </p>
          <TierRow
            tier="1"
            label="Primary government documents and official records"
            examples="Court opinions, congressional legislation and hearing transcripts, executive orders, agency regulations (Federal Register), official government statistics (Census, BLS, CDC, FBI), peer-reviewed research published in indexed journals."
          />
          <TierRow
            tier="2"
            label="Credentialed institutional documentation"
            examples="University research centers, established think tanks with disclosed methodology, official international body reports (UN, WHO, World Bank), professional association studies with disclosed sample sizes and peer review."
          />
          <TierRow
            tier="3"
            label="Investigative journalism with primary source citation"
            examples="Reporting by established news organizations where the underlying primary source is cited and independently verifiable. Tier 3 sources supplement but do not substitute for Tier 1 or Tier 2 documentation."
          />
          <p className="text-xs text-slate-500 mt-2">
            Opinion, social media, and unsourced claims do not meet ClownBinge source standards and are not used.
          </p>
        </Section>

        <Section title="The Six-Block Production Gate">
          <p>
            Every article passes a programmatic six-block gate before publication. Any block failure locks the
            article in draft status until resolved. The gate is run via the ClownBinge editorial scan tool against
            the full published text and metadata.
          </p>
          <ul className="list-disc list-inside space-y-2 text-sm">
            <li><strong>Block 1 — Required fields:</strong> Title, teaser, body, case number, category, and verified source must be present and non-empty.</li>
            <li><strong>Block 2 — Title em dash prohibition:</strong> Public-facing titles may not contain em dashes (—). Em dashes are permitted in body text.</li>
            <li><strong>Block 3 — CB Dry Rationalism:</strong> 27 prohibited pattern families checked across the full article body and teaser. Zero violations required.</li>
            <li><strong>Block 4 — Body H1 prohibition:</strong> Article bodies may not contain H1 tags. The page title renders the document H1; duplicate H1s are a Google penalty.</li>
            <li><strong>Block 5 — Source quality:</strong> Verified sources are evaluated for Tier 1/2 compliance. Unsourced articles do not pass.</li>
            <li><strong>Block 6 — Lock gate:</strong> Once all blocks pass, the article is locked. Locked articles cannot be modified without editorial authorization.</li>
          </ul>
        </Section>

        <Section title="AI Scoring (Self-Own Score)">
          <p>
            Self-Owned category articles carry a <strong>Self-Own Score</strong> from 1 to 10, calibrated to the
            severity and documentability of the contradiction between a public figure's stated position and their
            documented record.
          </p>
          <ul className="list-disc list-inside space-y-1.5 text-sm">
            <li><strong>1–3 (Loose Change / Paper Trail / Public Record):</strong> Documented inconsistency with some room for distinction between positions.</li>
            <li><strong>4–6 (The Pivot / Caught on File / Structural Hypocrisy):</strong> Verifiable reversal directly affecting constituents; pattern of contradiction across the primary record.</li>
            <li><strong>7–9 (The Quiet Part Loud / Spectacular Own Goal / Career-Defining):</strong> Documented contradiction between public position and concurrent private record; gap permanent in the primary record.</li>
            <li><strong>10 (Historic):</strong> Reserved exclusively for contradictions so total and so irrefutable across multiple independent source tiers that no reasonable reading of the evidence supports an alternative. Requires editorial committee authorization.</li>
          </ul>
        </Section>

        <Section title="AI-Assisted Research">
          <p>
            ClownBinge uses large language model assistance during the research and drafting phase to identify
            relevant primary sources and organize documented information. AI output is not published directly.
            Every AI-generated draft is reviewed against the original primary sources, rewritten for CB Dry
            Rationalism compliance, and passed through the six-block production gate before publication.
          </p>
          <p>
            AI assistance is used for efficiency, not for source generation. An AI draft that cannot be verified
            against the primary source record is discarded. The published article is the human-reviewed,
            source-verified record — not the AI draft.
          </p>
        </Section>

        <Section title="Publication Standards">
          <p>
            Articles are published with a case number (CB-XXXXXX), category assignment, verified source block,
            and optional subject metadata (name, title, party where applicable). All published articles are
            locked after passing the six-block gate and cannot be modified without an editorial correction record.
          </p>
          <p>
            For questions about our methodology, contact us at{" "}
            <a href="/contact" className="text-primary underline hover:no-underline">clownbinge.com/contact</a>.
            To report an error, see our{" "}
            <a href="/corrections" className="text-primary underline hover:no-underline">corrections policy</a>.
          </p>
        </Section>
      </div>
    </Layout>
  );
}
