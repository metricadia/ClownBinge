import { Layout } from "@/components/Layout";
import { AdminPageHeader } from "@/components/AdminPageHeader";
import { usePageSeoHead } from "@/hooks/use-seo-head";

export default function Terms() {
  usePageSeoHead({
    title: "Terms of Service",
    description: "ClownBinge Terms of Service. Metricadia Research, LLC — verified accountability journalism platform. Jurisdiction: Federation of Saint Christopher and Nevis.",
    path: "/terms",
    schemaType: "WebPage",
  });
  return (
    <Layout>
      <div className="max-w-3xl mx-auto px-4 py-12">
        <AdminPageHeader title="Terms of Service" />
        <div className="prose prose-lg max-w-none text-foreground prose-headings:font-display prose-headings:font-bold prose-headings:text-header prose-p:leading-relaxed">
          <p className="text-muted-foreground font-mono text-sm border-l-2 border-border pl-4">Last Updated: April 2026. Effective immediately upon access.</p>

          <p>
            This agreement governs your use of ClownBinge.com (the "Site"), operated by Metricadia Research, LLC ("Metricadia," "we," "us," or "our"). By accessing the Site, you accept these terms in full. If you do not accept them, you must leave the Site immediately.
          </p>

          <h2>1. Governing Jurisdiction</h2>
          <p>
            This agreement is governed exclusively by the laws of the Federation of Saint Christopher and Nevis. Any dispute arising from or relating to this agreement, the Site, or any content published on the Site shall be submitted exclusively to the courts of Saint Christopher and Nevis. You irrevocably waive any objection to that jurisdiction.
          </p>
          <p>
            Metricadia Research, LLC does not consent to the personal jurisdiction of any court in the United States of America for any claim arising from editorial decisions, published content, or journalistic activity. Any U.S. judgment obtained in the absence of Metricadia's consent is not recognized under the terms of this agreement and is not enforceable against Metricadia under Saint Christopher and Nevis law.
          </p>
          <p>
            Notwithstanding the foregoing, Metricadia affirmatively acknowledges and invokes all applicable protections afforded by the Constitution of the United States of America, including but not limited to the First and Fourteenth Amendments, where those protections operate as a defense against any legal action regardless of the forum.
          </p>

          <h2>2. First Amendment and Press Freedom</h2>
          <p>
            ClownBinge is a primary source accountability journalism platform. All editorial activity on this Site constitutes protected press activity under the First Amendment to the United States Constitution and the parallel protections recognized under international human rights instruments, including Article 19 of the International Covenant on Civil and Political Rights, to which Saint Christopher and Nevis is a signatory.
          </p>
          <p>
            All factual claims published on this Site are drawn from verified primary sources including government records, congressional documents, court filings, declassified intelligence materials, and peer-reviewed research. All analysis, commentary, verdicts, and editorializing are protected expressions of opinion. No statement of opinion, analysis, or satire on this Site constitutes a statement of actionable fact.
          </p>
          <p>
            The Fair Report Privilege applies absolutely to all content on this Site that summarizes, quotes, or characterizes the contents of public records, government proceedings, judicial filings, legislative records, or official statements. This privilege is not waived by any agreement between the parties.
          </p>
          <p>
            The Neutral Reportage Privilege applies to all content on this Site that accurately and disinterestedly reports on matters of public concern involving public figures, regardless of whether Metricadia endorses the underlying statements reported.
          </p>

          <h2>3. Defamation Liability Standard</h2>
          <p>
            Every subject of reporting on this Site is either a public official, a public figure, or a limited-purpose public figure who has voluntarily injected themselves into a matter of public concern. Under New York Times Co. v. Sullivan, 376 U.S. 254 (1964), and its progeny, no such person may maintain a defamation claim against Metricadia without clear and convincing evidence of actual malice: publication with knowledge that a statement was false, or with reckless disregard for its truth or falsity.
          </p>
          <p>
            Metricadia publishes no statement of fact that it does not believe to be true and substantiated by primary source evidence at the time of publication. Disagreement with our editorial conclusions is not evidence of actual malice.
          </p>
          <p>
            Substantial truth is an absolute defense to any defamation claim under applicable law. Where a published statement is substantially accurate based on the primary source record, no claim of defamation, libel, or slander shall lie against Metricadia or any of its contributors.
          </p>

          <h2>4. Anti-SLAPP and Abuse of Process</h2>
          <p>
            Metricadia expressly reserves all rights under applicable anti-SLAPP statutes and common law doctrines that protect against strategic litigation designed to silence, intimidate, or financially burden journalism and public commentary. Any legal action brought against Metricadia, its contributors, or its parent entity for content published on this Site in connection with a matter of public concern may be treated as a SLAPP suit under applicable law.
          </p>
          <p>
            Any party filing a legal action against Metricadia arising from published content agrees, as a condition of proceeding, to bear all of Metricadia's reasonable legal fees and costs if the action is dismissed, withdrawn, or resolved in Metricadia's favor. This fee-shifting provision is a material term of access to this Site.
          </p>
          <p>
            Metricadia will seek all available remedies, including sanctions, counterclaims for abuse of process, and declaratory relief, against any party that uses litigation as a tool of censorship or retaliation against protected journalistic activity.
          </p>

          <h2>5. Section 230 and Platform Liability</h2>
          <p>
            To the extent that U.S. law applies to any claim, Metricadia is an interactive computer service provider within the meaning of Section 230 of the Communications Decency Act, 47 U.S.C. 230. Metricadia is not the publisher or speaker of any information provided by third-party users, commenters, or tip submitters. Metricadia is not liable for any content created or provided by third parties through any feature of this Site.
          </p>

          <h2>6. Reporter's Shield and Source Confidentiality</h2>
          <p>
            Metricadia claims all protections available under applicable reporter's shield laws, the First Amendment qualified privilege recognized in Branzburg v. Hayes, 408 U.S. 665 (1972), and analogous protections under the laws of Saint Christopher and Nevis and applicable international press freedom standards.
          </p>
          <p>
            The identities of confidential sources, the contents of communications with sources, and internal editorial deliberations are protected from compelled disclosure. No subpoena, court order, or legal demand issued by any court that lacks jurisdiction over Metricadia will be honored without independent legal review conducted in the jurisdiction of Saint Christopher and Nevis.
          </p>

          <h2>7. Nature of Content and Satire</h2>
          <p>
            This Site publishes primary source accountability journalism. Characterizations, labels, editorial verdicts, and commentary are protected expressions of opinion grounded in documented evidence. The use of rhetorical, satirical, or colloquial framing does not convert protected opinion into actionable fact.
          </p>
          <p>
            Public figures have reduced expectations of privacy with respect to their public conduct, public statements, and exercise of public power. Coverage of public officials acting in their official capacity is categorically protected. We do not target private individuals.
          </p>

          <h2>8. Intellectual Property</h2>
          <p>
            The original editorial content, commentary, design, compilation, and structure of this Site, including the ClownBinge name and all associated marks, are the exclusive property of Metricadia Research, LLC.
          </p>
          <p>
            This Site incorporates short excerpts from public records, government documents, congressional archives, court filings, and broadcast footage solely for transformative purposes of criticism, commentary, and reporting. Such use constitutes Fair Use under 17 U.S.C. 107 and equivalent doctrines in other jurisdictions.
          </p>

          <h2>9. Digital Product Purchases</h2>
          <p>
            All purchases of digital products including eBooks, reports, and research documents are final at the time of delivery. Due to the non-returnable nature of delivered digital goods, no refunds are issued after a file has been accessed or downloaded, except where local consumer protection law mandates otherwise. Technical delivery failures will be resolved promptly upon contact with our support team.
          </p>

          <h2>10. No Injunctive Relief Against Publication</h2>
          <p>
            You agree that prior restraint of publication is a constitutionally disfavored remedy under the First Amendment and under applicable international press freedom standards. You waive any right to seek injunctive relief, temporary restraining orders, or any form of prior restraint against the publication, distribution, or continued availability of any content on this Site, to the fullest extent permitted by applicable law.
          </p>
          <p>
            Any party seeking injunctive relief against Metricadia arising from published content must first post a bond sufficient to cover Metricadia's legal costs, estimated damages from suppression of protected speech, and reputational harm from the chilling effect of the proceeding, as a precondition of any hearing on such relief.
          </p>

          <h2>11. Mandatory Arbitration and Forum Selection</h2>
          <p>
            Any dispute not resolved informally within 30 days of written notice to Metricadia shall be submitted to binding arbitration in Basseterre, Saint Christopher and Nevis, under the rules of an arbitral body selected by Metricadia. The arbitration shall be conducted in English. The arbitral award shall be final and binding. No class actions, class arbitrations, or consolidated proceedings are permitted.
          </p>
          <p>
            You irrevocably waive your right to a jury trial and to participate in any class action with respect to any claim arising from your use of this Site.
          </p>

          <h2>12. Disclaimer of Warranties and Limitation of Liability</h2>
          <p>
            This Site is provided on an as-is and as-available basis. Metricadia makes no warranty, express or implied, as to accuracy, completeness, fitness for a particular purpose, or uninterrupted availability. Metricadia's total liability to any party for any claim arising from use of this Site shall not exceed the amount paid by that party to Metricadia in the 12 months preceding the claim. In no event shall Metricadia be liable for indirect, incidental, consequential, or punitive damages.
          </p>

          <h2>13. Modifications</h2>
          <p>
            Metricadia reserves the right to modify these Terms at any time without prior notice. Continued use of the Site after any modification constitutes acceptance of the revised Terms.
          </p>

          <h2>14. Severability</h2>
          <p>
            If any provision of these Terms is found unenforceable by a court of competent jurisdiction, that provision shall be modified to the minimum extent necessary to make it enforceable, and the remaining provisions shall remain in full force and effect.
          </p>

          <p className="text-muted-foreground font-mono text-sm border-l-2 border-secondary pl-4 mt-10">
            ClownBinge is published by Metricadia Research, LLC. Jurisdiction of record: Federation of Saint Christopher and Nevis. Contact: clownbinge@metricadia.com
          </p>

        </div>
      </div>
    </Layout>
  );
}
