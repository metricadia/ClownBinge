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

export default function Corrections() {
  usePageSeoHead({
    title: "Corrections Policy | ClownBinge",
    description: "ClownBinge corrections policy. How errors are reported, reviewed, and documented. The correction record is part of the permanent primary source record.",
    path: "/corrections",
    schemaType: "AboutPage",
  });

  return (
    <Layout>
      <div className="cb-container max-w-3xl mx-auto py-10 px-4 sm:px-6">
        <AdminPageHeader
          title="Corrections Policy"
          subtitle="Errors reported. Errors corrected. The record updated. The correction documented."
        />

        <Section title="Our Commitment">
          <p>
            ClownBinge is committed to accuracy over speed. Every article is built exclusively on primary sources
            and passes a six-block production gate before publication. When errors occur, we correct them promptly,
            transparently, and in a way that makes the correction part of the permanent record.
          </p>
          <p>
            We do not silently edit published articles. Every material correction is documented with what changed,
            when it changed, and why. This is required by our editorial standards and by the integrity of the
            primary source record we are building.
          </p>
        </Section>

        <Section title="What Constitutes a Correction">
          <p>Corrections are issued for:</p>
          <ul className="list-disc list-inside space-y-1.5">
            <li>Factual errors — incorrect dates, names, figures, or document citations</li>
            <li>Source attribution errors — wrong document cited for a given claim</li>
            <li>Context errors — material information omitted that changes the documented picture</li>
            <li>Transcription errors — quoted language that does not match the cited source</li>
          </ul>
          <p className="mt-3">
            Corrections are <strong>not</strong> issued for:
          </p>
          <ul className="list-disc list-inside space-y-1.5">
            <li>Disagreement with how primary sources are characterized when the characterization is supported by the cited document</li>
            <li>Editorial judgment calls that do not affect factual accuracy</li>
            <li>Stylistic preferences or requests to soften documented findings</li>
          </ul>
        </Section>

        <Section title="How to Submit a Correction Request">
          <p>
            To request a correction, contact us at{" "}
            <a href="/contact" className="text-primary underline hover:no-underline">clownbinge.com/contact</a>{" "}
            with:
          </p>
          <ol className="list-decimal list-inside space-y-1.5">
            <li>The ClownBinge case number (CB-XXXXXX) of the article in question</li>
            <li>The specific claim or passage you believe is in error</li>
            <li>The primary source that contradicts or corrects the claim, with enough specificity that we can locate it independently</li>
          </ol>
          <p className="mt-3 text-xs text-slate-500">
            Correction requests without a cited primary source will be reviewed but may not result in a change to the published record. Opinion disagreements are not correction requests.
          </p>
        </Section>

        <Section title="Correction Review Process">
          <p>
            Every correction request is reviewed against the original primary sources cited in the article and
            the source provided by the submitter. If the submitted source establishes a factual error in the
            published article, the correction is issued within five business days of verification.
          </p>
          <p>
            Complex corrections involving multiple claims or requiring additional primary source research may
            take longer. We will acknowledge receipt of your request within two business days.
          </p>
        </Section>

        <Section title="Correction Record">
          <p>
            When a material correction is issued:
          </p>
          <ul className="list-disc list-inside space-y-1.5">
            <li>The article body is updated to reflect the correction</li>
            <li>A correction notice is added to the article identifying what changed and when</li>
            <li>The correction is logged in the article's metadata record</li>
            <li>If the correction materially changes the article's documented conclusions, an editor's note is added at the top of the article</li>
          </ul>
          <p className="mt-3">
            Corrected articles retain their original case number and URL. The correction becomes part of
            the permanent documentary record of the article — not a replacement of it.
          </p>
        </Section>

        <Section title="Retraction Policy">
          <p>
            Retractions are reserved for articles in which the foundational primary source claim is established
            as false or fabricated. Retraction means the article is removed from the public archive and a
            retraction notice is published at its URL explaining what was retracted and why.
          </p>
          <p>
            ClownBinge has published zero retractions. Our source standards are designed to make retraction
            unnecessary — but the policy exists because transparency requires it.
          </p>
        </Section>

        <div className="mt-8 p-4 rounded-xl bg-[#F5C518]/10 border border-[#F5C518]/40 text-sm text-slate-700">
          <p className="font-bold text-[#1a3a8f] mb-1">Questions about our editorial standards?</p>
          <p>
            Read our full{" "}
            <a href="/methodology" className="text-primary underline hover:no-underline">editorial methodology</a>{" "}
            or{" "}
            <a href="/ethics" className="text-primary underline hover:no-underline">ethics policy</a>.
            For corrections, contact us at{" "}
            <a href="/contact" className="text-primary underline hover:no-underline">clownbinge.com/contact</a>.
          </p>
        </div>
      </div>
    </Layout>
  );
}
