import { Layout } from "@/components/Layout";
import { AdminPageHeader } from "@/components/AdminPageHeader";
import { StatWidget } from "@/components/StatWidget";
import { usePageSeoHead } from "@/hooks/use-seo-head";

export default function About() {
  usePageSeoHead({
    title: "About ClownBinge",
    description: "ClownBinge is verified accountability journalism by Metricadia Research, LLC. Primary sources only. Every article is empirical, cited, and at least 1,500 words.",
    path: "/about",
    schemaType: "AboutPage",
  });

  return (
    <Layout>
      <div className="max-w-3xl mx-auto px-4 py-12">
        <AdminPageHeader title="About ClownBinge" />

        <div className="prose prose-lg prose-slate max-w-none cb-article-body">

          <h3>The Name</h3>

          <p>
            ClownBinge is a deliberately chosen name for a deliberately serious operation.
          </p>

          <p>
            A clown, in the accountability journalism tradition going back through editorial
            cartooning and political satire, is a public figure caught in documented contradiction
            with their own public record. Not a political enemy. Not someone we disagree with.
            Someone whose own words, votes, financial disclosures, court records, or genealogy
            directly contradict the position they have staked out in public life. The contradiction
            is the story. The documents are the story. The clown is just what you call it when
            a U.S. Senator votes against the very bill he co-sponsored, or a pastor preaching
            against immigration turns out to have four immigrant grandparents on record at the
            National Archives.
          </p>

          <p>
            We binge on primary sources so that readers do not have to. Court filings.
            Congressional transcripts. Federal agency data. FEC disclosures. Peer-reviewed
            research from PubMed, the CDC, and academic institutions. The National Archives.
            The Ellis Island database. The Small Business Administration's loan records. We go
            into the archive, pull out what is verifiable, and publish it in plain language
            against a documented evidentiary record. That is the binge. The name earns itself.
          </p>

          <h3>The Standard</h3>

          <p>
            Every article published on ClownBinge meets three non-negotiable requirements.
          </p>

          <p>
            First: primary sources only. Every factual claim traces to a government record,
            a court filing, a peer-reviewed study, or an official institutional document.
            We do not publish anonymous tips, unverified allegations, inference about motive,
            or anything a subject could credibly contest on evidentiary grounds. If the record
            does not support the claim, the claim does not appear.
          </p>

          <p>
            Second: empirical framing throughout. ClownBinge does not tell readers what to
            think. We present what the documents say and let the gap speak. The documents
            produce the accountability. We organize, source, and publish them. That is the
            full scope of our editorial role.
          </p>

          <p>
            Third: a minimum of 1,500 words per article. This is not a formatting preference.
            It is a substantive commitment. Accountability journalism requires enough depth to
            trace the primary source chain, establish the institutional context, and give the
            subject a full documentary hearing. A claim worth publishing is worth building
            properly. Surface-level takes are not published here. The archive is built
            for the reader who wants to understand the record, not just react to a headline.
          </p>

          <h3>Who We Are</h3>

          <p>
            ClownBinge is operated by Metricadia Research, LLC, registered in the Federation
            of Saint Christopher and Nevis. We accept no funding from political action
            committees, dark money organizations, or corporate underwriters with editorial
            interests. Revenue comes from readers: display advertising, memberships, pay-per
            research reports, and the ClownBinge FactBook library. Coverage decisions are made
            against the primary source record. Not the ad buy.
          </p>

          <h3>Corrections</h3>

          <p>
            If a factual error is identified in any published record, a correction is appended
            to the article within 48 hours of confirmation. The original text and the correction
            are both preserved in the public record. Corrections are never deleted. Submit
            potential errors through the <a href="/contact">contact form</a>.
          </p>

        </div>

        <div className="mt-10">
          <StatWidget />
        </div>

        <p className="text-xs text-muted-foreground mt-10">
          Metricadia Research, LLC &mdash; ClownBinge.com &mdash; Independent. Verified. The Primary Source.
        </p>
      </div>
    </Layout>
  );
}
