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
            ClownBinge is a deliberate name for a serious operation.
          </p>

          <p>
            A clown is a public figure caught in documented contradiction. Not a political
            enemy. Not someone we disagree with. Someone the record catches. Their own words.
            Their own votes. Their own financial disclosures. All contradicting what they say
            in public. The contradiction is the story. The documents are the story. The clown
            is what you call it when a senator votes against the bill he co-sponsored. Or
            when a pastor preaching against immigration has four immigrant grandparents at the
            National Archives.
          </p>

          <p>
            We binge on primary sources so readers do not have to. Court filings.
            Congressional transcripts. Federal agency data. FEC disclosures. Peer-reviewed
            research from PubMed and the CDC. The National Archives. The Ellis Island
            database. SBA loan records. We go into the archive. We pull out what is
            verifiable. We publish it in plain language. That is the binge. The name earns
            itself.
          </p>

          <h3>The Standard</h3>

          <p>
            Every article on ClownBinge meets three non-negotiable requirements.
          </p>

          <p>
            First: primary sources only. Every factual claim traces to a government record,
            a court filing, or an official document. We do not publish anonymous tips. We do
            not publish unverified allegations. We do not publish inference about motive. If
            the record does not support the claim, the claim does not appear.
          </p>

          <p>
            Second: empirical framing throughout. ClownBinge does not tell readers what to
            think. We present what the documents say. We let the gap speak. The documents
            produce the accountability. We organize, source, and publish them. That is the
            full scope of our editorial role.
          </p>

          <p>
            Third: a minimum of 1,500 words per article. This is not a formatting preference.
            It is a substantive commitment. Accountability journalism requires depth. A claim
            worth publishing is worth building properly. Surface-level takes are not published
            here. This archive is for readers who want to understand the record.
          </p>

          <h3>Who We Are</h3>

          <p>
            ClownBinge is operated by Metricadia Research, LLC. We are registered in the
            Federation of Saint Christopher and Nevis. We accept no funding from political
            action committees. No dark money organizations. No corporate underwriters with
            editorial interests. Revenue comes from readers: advertising, memberships,
            pay-per research reports, and the ClownBinge FactBook library. Coverage decisions
            are made against the primary source record. Not the ad buy.
          </p>

          <h3>Corrections</h3>

          <p>
            If a factual error is identified, a correction is appended within 48 hours.
            The original text and the correction are both preserved. Corrections are never
            deleted. Submit potential errors through the <a href="/contact">contact form</a>.
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
