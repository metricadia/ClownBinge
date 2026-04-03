import { Layout } from "@/components/Layout";
import { AdminPageHeader } from "@/components/AdminPageHeader";
import { StatWidget } from "@/components/StatWidget";
import { usePageSeoHead } from "@/hooks/use-seo-head";

export default function About() {
  usePageSeoHead({
    title: "About ClownBinge",
    description: "ClownBinge is verified accountability journalism by Metricadia Research, LLC. Primary sources only.",
    path: "/about",
    schemaType: "AboutPage",
  });

  return (
    <Layout>
      <div className="max-w-3xl mx-auto px-4 py-12">
        <AdminPageHeader title="About ClownBinge" />

        <div className="prose prose-lg prose-slate max-w-none cb-article-body">

          <p>
            ClownBinge is an independent accountability journalism platform operated by
            Metricadia Research, LLC, registered in the Federation of Saint Christopher
            and Nevis.
          </p>

          <p>
            We publish documented accounts of public figures, institutions, and systems
            using one standard: the primary source record. Court filings. Congressional
            transcripts. Federal agency data. Peer-reviewed research. If it cannot be
            traced to a verifiable primary document, it does not appear in this archive.
          </p>

          <p>
            The platform name is rhetorical, not editorial. We use it to describe a
            documented pattern — the gap between what public figures say in public and
            what the record shows they have done. That gap is the story. We source it
            and publish it without inference.
          </p>

          <h3>What We Are Not</h3>

          <p>
            We are not a commentary platform. We do not publish opinion, anonymous tips,
            unverified allegations, or anything that depends on inference about motive or
            character. We do not cover private individuals. We are not partisan — the record
            does not have a party affiliation, and neither do we.
          </p>

          <h3>Funding</h3>

          <p>
            ClownBinge accepts no funding from political action committees, dark money
            organizations, or corporate underwriters with editorial interests. Revenue comes
            from readers: display advertising, memberships, research reports, and book sales.
            Coverage decisions are made against the primary source record, not the ad buy.
          </p>

          <h3>Corrections</h3>

          <p>
            If a factual error is identified in any published record, a correction is appended
            to the article within 48 hours of confirmation. The original text and the correction
            are both preserved. Corrections are never deleted. Submit potential errors through
            the <a href="/contact">contact form</a>.
          </p>

        </div>

        <div className="mt-10">
          <StatWidget />
        </div>

        <p className="text-xs text-muted-foreground mt-10">
          Metricadia Research, LLC &mdash; ClownBinge.com
        </p>
      </div>
    </Layout>
  );
}
