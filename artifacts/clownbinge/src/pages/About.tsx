import { Layout } from "@/components/Layout";
import { AdminNav } from "@/components/AdminNav";
import { StatWidget } from "@/components/StatWidget";

export default function About() {
  return (
    <Layout>
      <div className="max-w-3xl mx-auto px-4 py-12">
        <div className="mb-10">
          <p className="text-xs font-semibold tracking-widest uppercase text-primary mb-3">About ClownBinge</p>
          <h1 className="font-sans font-bold text-3xl sm:text-4xl text-header leading-tight mb-4">
            The Mission.
          </h1>
          <p className="text-muted-foreground text-sm">
            Laughphoria Informatics &mdash; ClownBinge.com &mdash; Updated March 2026
          </p>
          <div className="h-1 w-full bg-[#F5C518] rounded-full mt-6" />
        </div>

        <AdminNav />

        <div className="prose prose-slate max-w-none cb-article-body">

          <h2>Who We Are</h2>
          <p>
            ClownBinge is a public accountability news platform operated by Laughphoria Informatics, a
            Wyoming corporation. We document real, verifiable incidents in which elected officials,
            religious leaders, and other figures entrusted with public confidence have acted in direct
            contradiction to their own documented words, votes, and stated values.
          </p>
          <p>
            We are entirely independent. We are not funded by PACs, dark money groups, political
            parties, or billionaires. Our revenue comes directly from our readers through subscriptions,
            verification services, and reports. This structure ensures our editorial independence
            remains absolute and unconditional.
          </p>

        </div>

        <StatWidget />

        <div className="prose prose-slate max-w-none cb-article-body">

          <h2>The Premise</h2>
          <p>
            Public figures should be held to the standard of their own documented words and actions.
            Nothing more. Nothing less. When a senator votes for a bill he publicly claimed to oppose,
            that is not an opinion. It is a fact. When a pastor preaches against the behavior he is
            privately engaged in, that is not commentary. It is a record. ClownBinge publishes the record.
          </p>
          <p>
            We operate on the conviction that the public record belongs to the public, and that
            accountability journalism does not require fabrication, speculation, or partisan framing.
            Reality, properly documented, is damning enough.
          </p>

          <h2>What We Cover</h2>
          <p>
            ClownBinge covers verified incidents of hypocrisy, self-contradiction, and betrayal of
            public trust by individuals in positions of power or public confidence. Our coverage
            focuses on five categories:
          </p>
          <ul>
            <li><strong>Self-Owned:</strong> Public figures caught directly contradicting their own documented statements or votes.</li>
            <li><strong>Clown Electeds:</strong> Elected officials whose conduct in office contradicts their public platform.</li>
            <li><strong>Religious:</strong> Religious leaders whose private conduct directly contradicts their public moral teachings.</li>
            <li><strong>Political:</strong> Documented political hypocrisy grounded in voting records, financial disclosures, and public statements.</li>
            <li><strong>Anti-Racist Hero:</strong> Individuals who stood for accountability and faced institutional retaliation for it.</li>
          </ul>
          <p>
            We do not cover private individuals. We do not publish unverified tips, anonymous
            allegations, or content that cannot be traced to a primary source. Every record published
            on this platform is sourced before it is written.
          </p>

          <h2>Verification Standards</h2>
          <p>
            Every claim published on ClownBinge is verified against at least one of the following
            source tiers before publication:
          </p>
          <ul>
            <li><strong>Tier One:</strong> Official government records, court documents, congressional voting records, federal agency publications, and FEC filings.</li>
            <li><strong>Tier Two:</strong> Peer-reviewed academic research and nonpartisan research institutions with documented, publicly available methodology.</li>
            <li><strong>Tier Three:</strong> Recognized news organizations with published editorial standards, a documented corrections policy, and identifiable editorial leadership.</li>
          </ul>
          <p>
            Primary sources are linked directly within article text. The full source citation appears
            in the Verified References section at the conclusion of every article. Readers can verify
            every factual claim independently without leaving the page.
          </p>

          <h2>Legal Architecture</h2>
          <p>
            ClownBinge operates under the strongest First Amendment protections available in the United
            States. Our legal architecture is designed specifically to protect independent media from
            frivolous SLAPP suits and bad-faith legal pressure.
          </p>
          <p>
            <em>New York Times Co. v. Sullivan</em>, 376 U.S. 254 (1964) establishes the actual malice
            standard for public figures. Because ClownBinge publishes only verified primary source
            documentation, establishing actual malice against this platform is, by design, legally
            impossible. We do not speculate. We do not fabricate. We cite.
          </p>

          <h2>Corrections Policy</h2>
          <p>
            If a factual error is identified in any published record, a correction will be appended
            to the article within 48 hours of confirmation. A public corrections log documents the
            nature of every error and the corrected information. Corrections are never deleted or
            obscured. The original text and the correction are both preserved in the public record.
            Submissions identifying potential errors may be submitted through the platform's
            contact form.
          </p>

          <h2>Contact</h2>
          <p>
            ClownBinge is operated by Laughphoria Informatics. For press inquiries, corrections,
            or tip submissions, use the contact form linked in the site navigation. We respond to
            all credible error reports within 48 hours.
          </p>

          <div className="h-1 w-full bg-[#F5C518] rounded-full my-10" />

          <p className="text-sm text-muted-foreground">
            Laughphoria Informatics &mdash; Wyoming Corporation &mdash; ClownBinge.com<br />
            <em>Verified. Primary Sources. For The People.</em>
          </p>

        </div>
      </div>
    </Layout>
  );
}
