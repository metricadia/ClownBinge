import { Layout } from "@/components/Layout";
import { AdminNav } from "@/components/AdminNav";
import { usePageSeoHead } from "@/hooks/use-seo-head";

export default function Ethics() {
  usePageSeoHead({
    title: "Editorial Standards & Ethics",
    description: "ClownBinge editorial standards, fact-checking methodology, and sourcing policy. All content sourced from primary government and institutional documents. Primary Source Analytics, LLC.",
    path: "/ethics",
    schemaType: "WebPage",
  });
  return (
    <Layout>
      <div className="max-w-3xl mx-auto px-4 py-12">
        <div className="mb-10">
          <p className="text-xs font-semibold tracking-widest uppercase text-primary mb-3">Editorial Standards</p>
          <h1 className="font-sans font-bold text-3xl sm:text-4xl text-header leading-tight mb-4">
            Editorial Standards, Ethics, and Analytical Methodology
          </h1>
          <p className="text-muted-foreground text-sm">
            Primary Source Analytics, LLC &mdash; ClownBinge.com &mdash; Updated March 2026
          </p>
          <div className="h-1 w-full bg-[#F5C518] rounded-full mt-6" />
        </div>

        <AdminNav />

        <div className="prose prose-slate max-w-none cb-article-body">

          <h2>Abstract</h2>
          <p>
            The proliferation of fabricated news, state-sponsored disinformation, and politically engineered
            misinformation constitutes one of the most consequential threats to democratic governance in the
            twenty-first century. This policy document outlines the editorial ethics, sourcing standards, and
            verification methodology that govern ClownBinge, a public accountability platform operated by
            Primary Source Analytics, LLC. Drawing on peer-reviewed research in political communication, media
            studies, and democratic theory, this document establishes the empirical basis for ClownBinge's
            mission and articulates the standards to which it holds itself and the public figures it covers.
          </p>

          <h2>Platform Framework: Satire as Analytical Lens</h2>
          <p>
            ClownBinge operates within an established tradition of accountability journalism that employs
            satirical framing as a presentational device. The platform name, visual identity, and category
            terminology use the vernacular term "clown" as a rhetorical instrument with documented roots in
            democratic political commentary, consistent with its use in editorial cartooning, political satire,
            and accountability journalism since the nineteenth century. Courts, legislatures, and journalistic
            bodies have long recognized satirical framing as a constitutionally protected and journalistically
            legitimate method of presenting factual material.
          </p>
          <p>
            This framing is explicitly and exclusively presentational. The term is applied only to documented
            patterns of public hypocrisy by individuals in positions of public trust. No content published
            on this platform targets any person on the basis of race, ethnicity, religion as a protected
            characteristic, gender, sexual orientation, national origin, disability status, or any other
            identity category. Coverage is limited to the documented public conduct of public figures in the
            exercise of their public roles. When religious leaders or institutions are covered, coverage is
            confined to documented instances in which their public conduct contradicts their own publicly
            stated doctrinal positions -- a standard of accountability that applies equally across all
            categories of public figure on this platform.
          </p>
          <p>
            The satirical presentational layer and the empirical methodology are not in tension. The satirical
            register is the frame; the primary source documentation is the substance. All content must satisfy
            the verification standards defined in Section 7 regardless of any satirical or analytical framing
            applied to any headline, case label, or platform feature. The platform does not publish satire as
            fact. All analytical commentary is labeled distinctly from verified factual reportage, and no
            article is published without at least one citation to a source within the three-tier verification
            hierarchy.
          </p>

          <h2>1. Introduction: The Misinformation Crisis</h2>
          <p>
            The United States is experiencing a sustained, multi-vector assault on its information environment.
            The mechanisms through which citizens form political beliefs and make electoral decisions have been
            systematically compromised by three overlapping forces: foreign state-sponsored disinformation
            campaigns, domestically produced partisan misinformation, and the structural incentives of
            algorithmic social media platforms that reward engagement over accuracy (Lazer et al., 2018;
            Wardle &amp; Derakhshan, 2017).
          </p>
          <p>
            The consequences are measurable and severe. A 2019 study published in <em>Science</em> found that
            false news spreads six times faster than true news on Twitter and reaches a broader audience with
            greater depth (Vosoughi et al., 2018). The Reuters Institute Digital News Report (2023) documents
            that trust in news media across the United States has declined to historic lows, with fewer than
            one in three Americans expressing trust in most news sources most of the time. The Pew Research
            Center (2021) found that 48% of U.S. adults reported seeing made-up news online often or
            sometimes, with the overwhelming majority unable to correctly identify factual statements
            from opinion.
          </p>
          <p>
            ClownBinge was founded in response to this documented crisis. Its mission is not to produce
            opinion, commentary, or punditry, but to curate verified, cited, and sourced documentation of
            public accountability failures by elected officials and those entrusted with the public's confidence.
          </p>

          <h2>2. Foreign State-Sponsored Disinformation</h2>
          <p>
            The intervention of foreign state actors in the American information environment is not a
            hypothesis. It is a documented, adjudicated, and ongoing reality confirmed by the United States
            Senate Select Committee on Intelligence (2020), the Mueller Report (United States Department of
            Justice, 2019), and the Director of National Intelligence's annual Worldwide Threat Assessment
            (Office of the Director of National Intelligence, 2023).
          </p>
          <p>
            The Internet Research Agency (IRA), a Russian state-linked entity, operated a sustained influence
            operation targeting American voters between 2013 and 2018, reaching an estimated 126 million
            Facebook users, 20 million Instagram users, and 1.4 million Twitter users with fabricated,
            divisive, and politically engineered content (U.S. Senate Select Committee on Intelligence, 2020).
            The scale of Instagram engagement alone is instructive: the Senate Intelligence Committee's
            2020 report documented that IRA content on Instagram accumulated over 185 million likes, a figure
            that exceeds the combined circulation of every major American daily newspaper by several orders
            of magnitude. The operation was not limited to electoral interference. IRA operatives created and
            managed hundreds of fake American personas, built audiences on issues ranging from immigration and
            race to gun rights and LGBTQ+ issues, and deployed these audiences to amplify existing social
            divisions (DiResta et al., 2019).
          </p>
          <p>
            China's information operations targeting the United States have followed a different model,
            emphasizing narrative dilution and credibility laundering rather than direct fabrication.
            The Stanford Internet Observatory (Gleicher et al., 2022) documented coordinated inauthentic
            behavior campaigns that seeded favorable narratives about Chinese government positions across
            American social media platforms, often through the amplification of authentic fringe sources
            rather than the creation of entirely fabricated ones.
          </p>
          <p>
            Iran's influence operations, documented extensively by FireEye (2018) and subsequently confirmed
            by platform transparency reports from Meta and Twitter, targeted American audiences on both the
            political left and right, demonstrating that foreign disinformation does not operate with a single
            ideological preference but rather with the strategic goal of maximizing division.
          </p>
          <p>
            ClownBinge does not treat foreign disinformation as a theoretical threat. Every piece of content
            published on this platform is evaluated against the question of whether its claims can be sourced
            to verified American institutions, not to social media narratives, anonymous accounts, or sources
            that have not been independently verified by recognized journalistic or academic institutions.
          </p>

          <h2>3. Domestically Produced Political Misinformation</h2>
          <p>
            Foreign interference, while severe, accounts for only a portion of the misinformation that
            circulates in American political discourse. A substantial and growing body of research documents
            that domestically produced political misinformation constitutes an independent threat to
            democratic function, one that cannot be attributed to foreign actors and must be understood on
            its own terms (Bennett &amp; Livingston, 2018; Roozenbeek et al., 2020).
          </p>
          <p>
            Pennycook and Rand (2019) identify two primary drivers of belief in false political information:
            motivated reasoning, in which individuals accept information that confirms pre-existing beliefs
            regardless of its accuracy, and inattention, in which individuals share content without evaluating
            its truth value. The implications for political communication are significant. Elected officials
            and their affiliated media ecosystems have exploited both mechanisms, producing narratives that
            are technically unverifiable but emotionally resonant, or that are directly contradicted by
            primary source documentation that most voters never encounter.
          </p>
          <p>
            The PolitiFact Truth-O-Meter database, which has evaluated tens of thousands of political
            statements since 2007, finds that statements rated "False" or "Pants on Fire" are disproportionately
            shared on social media relative to statements rated "True" or "Mostly True," confirming the
            broader finding of Vosoughi et al. (2018) that novelty and emotional arousal, rather than
            accuracy, drive information diffusion.
          </p>
          <p>
            Domestically engineered political misinformation takes several documented forms: the selective
            presentation of accurate data stripped of context, the fabrication of quotations attributed to
            public figures, the manipulation of images and video through both traditional editing and
            emerging AI-generated synthetic media, and the deliberate misrepresentation of legislative
            outcomes, voting records, and policy positions. Each of these tactics is specifically targeted
            by ClownBinge's verification methodology.
          </p>

          <h2>4. Algorithmic Amplification and Platform Responsibility</h2>
          <p>
            The structural conditions under which misinformation spreads cannot be understood without
            reference to the algorithmic architectures of social media platforms. Facebook, X (formerly
            Twitter), YouTube, and TikTok are not neutral conduits for information. They are engagement
            optimization systems that systematically amplify content that produces emotional activation,
            irrespective of its accuracy (Tufekci, 2018; Bail et al., 2018).
          </p>
          <p>
            Bail et al. (2018) conducted a randomized field experiment in which participants were assigned
            to follow a bot that retweeted political content from the opposing party. Rather than producing
            moderation, exposure to cross-partisan content increased ideological extremity, an effect
            mediated by the emotional nature of the content the algorithms selected. The implication is
            that platform design choices, not merely bad actors, are constitutive of the misinformation
            environment.
          </p>
          <p>
            Frances Haugen's testimony before the United States Senate Commerce Committee (2021) and the
            subsequent publication of internal Facebook research documents established that Meta's own
            engineers had identified content recommendation systems that drove users toward increasingly
            extreme content as a predictable output of engagement optimization. These findings were
            corroborated by independent research from the New York University Center for Social Media
            and Politics (Guess et al., 2023).
          </p>
          <p>
            ClownBinge's response to platform-mediated amplification is structural, not merely rhetorical.
            By requiring that every factual claim on the platform be sourced to a primary government
            document, peer-reviewed research, or a recognized news organization with published editorial
            standards, and by displaying those sources transparently within the article body via the
            platform's factoid citation system, ClownBinge creates a verifiable record that readers can
            evaluate independently of any platform recommendation system.
          </p>

          <h2>5. The Economic Structure of Misinformation</h2>
          <p>
            Misinformation is not produced exclusively for ideological reasons. It has a documented
            economic logic. Hunt Allcott and Matthew Gentzkow (2017), in their landmark study of fake news
            during the 2016 presidential election, documented that the majority of fake news websites
            encountered by American voters were commercially motivated, producing content designed to
            maximize advertising revenue through viral engagement rather than to advance any particular
            political agenda. The Macedonian teenager farms that produced pro-Trump content during 2016
            were primarily motivated by Google AdSense revenue, not political conviction.
          </p>
          <p>
            This economic dimension of misinformation has structural implications that persist regardless of
            the outcome of any individual election. As long as engagement metrics drive platform advertising
            revenue, and as long as false or emotionally manipulative content generates higher engagement
            than accurate content, the economic incentive to produce misinformation will persist. Regulatory
            interventions targeting specific actors cannot address a structural incentive embedded in the
            platform economy itself.
          </p>
          <p>
            ClownBinge's monetization model is designed to align economic incentives with accuracy rather
            than engagement. Platform revenue is derived from book sales, membership subscriptions, and
            display advertising subject to editorial standards, not from per-impression viral amplification.
            The ClownCheck member verification feature, by design, generates revenue from the platform's
            accuracy, not from the production of engaging falsehoods.
          </p>

          <h2>6. Impact on Democratic Governance</h2>
          <p>
            The documented effects of sustained misinformation on democratic governance are extensive and
            span multiple dimensions of political life. Roozenbeek et al. (2020) identify three primary
            mechanisms through which misinformation undermines democratic function: the distortion of
            electoral choice through the corruption of voters' factual beliefs about candidates and policies;
            the erosion of institutional trust through the systematic delegitimization of sources of
            authoritative information; and the suppression of civic participation through the demobilization
            of voters who perceive the information environment as irreparably corrupt.
          </p>
          <p>
            The National Academies of Sciences, Engineering, and Medicine (2020) published a comprehensive
            review concluding that exposure to misinformation reduces the probability of accurate political
            knowledge even when individuals are exposed to subsequent corrections, a phenomenon known as
            the "backfire effect" in earlier research, though more recent studies have qualified the
            conditions under which this occurs (Wood &amp; Porter, 2019).
          </p>
          <p>
            Elected officials bear specific accountability for their participation in the production and
            amplification of misinformation. The First Amendment protects political speech broadly, including
            speech that is inaccurate or misleading. However, constitutional protection for speech does not
            constitute protection from public documentation, and the public record of what elected officials
            have said, done, voted for, and received in campaign contributions is a matter of permanent
            public interest. ClownBinge's coverage of elected officials is grounded in this public interest
            mandate, not in partisan advocacy.
          </p>

          <h2>7. ClownBinge Editorial Standards and Verification Methodology</h2>
          <p>
            ClownBinge publishes accountability journalism verified against a defined three-tier source
            hierarchy. No factual claim may be published without citation to at least one source within
            this hierarchy, and all citations are displayed transparently within the article body.
          </p>

          <h3>7.1 Tier One: Primary Government Sources</h3>
          <p>
            Tier One sources include official government records, congressional documents, federal agency
            publications, court filings, Federal Election Commission records, financial disclosure reports,
            and documented statements made by officials in the exercise of their public duties. These sources
            are treated as authoritative for the facts they contain regarding the conduct of public officials.
          </p>

          <h3>7.2 Tier Two: Nonpartisan Research and Academic Sources</h3>
          <p>
            Tier Two sources include peer-reviewed academic research, reports from nonpartisan research
            institutions with documented methodology and no advocacy mission, and established fact-checking
            organizations with published standards. The determination of nonpartisan status requires that
            an organization's funding sources, board composition, and methodological disclosures be
            publicly available and not primarily funded by entities with a direct stake in the political
            questions addressed. Sources such as Pew Research Center, Brookings Institution, the
            Congressional Budget Office, and the Government Accountability Office meet this standard.
            Sources whose primary mission is advocacy, regardless of tax status, do not.
          </p>

          <h3>7.3 Tier Three: Verified News Organizations</h3>
          <p>
            Tier Three sources include news organizations with published editorial standards, a documented
            corrections policy, and identifiable editorial leadership. These organizations include the
            Associated Press, Reuters, BBC News, National Public Radio, The New York Times, The Washington
            Post, and The Wall Street Journal, among others. The inclusion of a news organization in this
            tier does not constitute an endorsement of its editorial positions, only recognition that it
            operates under documented journalistic standards subject to public accountability.
          </p>

          <h3>7.4 The ClownBinge Citation System</h3>
          <p>
            Every factoid link embedded within a ClownBinge article constitutes a citation. These links
            are displayed to readers as underlined text with a dotted gold border, and clicking any such
            link opens a citation card displaying the source title, a summary of the cited material,
            and the source URL. All citations are additionally compiled automatically in the Verified
            References section displayed at the conclusion of every article. The number of verified
            citations in each article is displayed in the article header via the Citations badge.
          </p>
          <p>
            This citation architecture serves two functions. First, it enables readers to independently
            verify every claim made in any ClownBinge article without leaving the article or trusting
            the platform's characterization of any source. Second, it creates a searchable, linkable
            public record that persists independently of the social media platforms through which
            ClownBinge content may be shared.
          </p>

          <h3>7.5 What ClownBinge Does Not Publish</h3>
          <p>
            ClownBinge does not publish anonymous tips, unverified social media posts, rumor, speculation,
            or content that cannot be sourced within the three-tier hierarchy above. ClownBinge does not
            publish private information about public figures that is not relevant to their exercise of
            public duties. ClownBinge does not publish opinion presented as fact. Satirical commentary,
            where it appears, is clearly labeled and never presented as primary sourcing.
          </p>

          <h3 id="self-own-methodology">7.6 The ClownBinge Self-Own Score: A Proprietary Empirical Accountability Metric</h3>
          <p>
            The ClownBinge Self-Own Score is a proprietary analytical instrument that quantifies the magnitude
            of documented contradiction between a public figure's stated positions and their verifiable actions
            or disclosed records. It is not a measure of political alignment, moral judgment, or editorial
            opinion. It is a measure of documentary gap: the distance, expressed in evidentiary terms, between
            what a subject has said in the public record and what the public record independently demonstrates
            they have done.
          </p>
          <p>
            The metric is expressed on a 10-point ordinal scale. Each point on the scale corresponds to a
            defined evidentiary threshold, not a subjective editorial determination. Assignment of a score
            at any level requires that the contradiction be directly legible in verified primary source
            documentation without editorial inference or interpretive mediation. A Self-Own Score may not
            be assigned on the basis of anonymous sourcing, reputation, prior reporting not independently
            verified by ClownBinge, or circumstantial evidence. The specific primary sources supporting
            the assigned score are cited in the article body and compiled in the Verified References section
            of every article, allowing independent reader verification of the evidentiary adequacy of
            any assignment.
          </p>
          <p>The 10-level evidentiary taxonomy is defined as follows:</p>
          <ul>
            <li><strong>1 — Loose Change.</strong> A minor documented inconsistency. A misstatement, a quietly drifted position, or a contradicted detail for which plausible deniability exists in the primary record.</li>
            <li><strong>2 — Paper Trail.</strong> A documented contradiction with arguable grounds for distinction. The primary sources establish a gap; the subject retains defensible room to characterize the positions as different rather than contradictory.</li>
            <li><strong>3 — Public Record.</strong> A clear, documented contradiction between a stated position and a recorded action. The subject's own record requires argumentation against itself to deny the gap.</li>
            <li><strong>4 — The Pivot.</strong> A verifiable, documented reversal that directly affected the subject's constituents or followers. The gap between documented word and documented deed is no longer readily deniable against the primary sources.</li>
            <li><strong>5 — Caught on File.</strong> Documented betrayal of a stated core principle, supported by unambiguous primary sources. The subject's own disclosed records are the primary instrument of contradiction.</li>
            <li><strong>6 — Structural Hypocrisy.</strong> Multiple documented reversals forming a verifiable pattern across the primary record. The contradiction is not isolated; it is recurring and documentable across multiple independent sources within the verification hierarchy.</li>
            <li><strong>7 — The Quiet Part Loud.</strong> Documented evidence that the public position was inconsistent with the subject's own concurrent private disclosures, filed records, or recorded statements.</li>
            <li><strong>8 — Spectacular Own Goal.</strong> The documented contradiction directly and materially undermines the subject's defining public identity, established without ambiguity by primary sources.</li>
            <li><strong>9 — Career-Defining.</strong> A documented contradiction so complete, so thoroughly sourced across multiple independent primary sources, and so consequential that it materially and permanently alters the subject's documented public record.</li>
            <li><strong>10 — Historic.</strong> A documented contradiction so total and so irrefutable across multiple independent source tiers that it constitutes a standing monument in the primary record. Reserved exclusively for instances in which no reasonable application of the Section 7 source standards can produce a defensible alternative reading of the documentary evidence.</li>
          </ul>
          <p>
            The Self-Own Score is encoded in the platform's structured data output as an
            {" "}<code>additionalProperty</code> within the <code>NewsArticle</code> JSON-LD schema
            attached to each article, and as a <code>reviewRating</code> within the
            {" "}<code>ClaimReview</code> schema on all articles covering named public figures. This
            structured data architecture enables search engines and AI answer systems to recognize the
            score as a formalized, methodology-grounded analytical rating rather than informal editorial
            commentary, consistent with the platform's obligations under E-E-A-T (Experience, Expertise,
            Authoritativeness, and Trustworthiness) evaluation frameworks.
          </p>

          <h2>8. Corrections and Accountability</h2>
          <p>
            ClownBinge maintains a published corrections policy. If a factual error is identified in any
            published piece, a correction will be appended to the article within 48 hours of confirmation,
            and a public corrections log will document the nature of the error and the corrected information.
            Corrections are never deleted or obscured; the original text and the correction are both
            preserved in the public record. Submissions identifying potential errors may be submitted
            through the platform's contact form.
          </p>

          <h2>9. Conclusion</h2>
          <p>
            The crisis of fabricated news, foreign interference, and politically engineered misinformation
            is not a crisis of technology alone, nor of politics alone, nor of any single actor or platform.
            It is a systemic failure of the information infrastructure on which democratic self-governance
            depends. ClownBinge does not claim to resolve this crisis. It claims only to operate within it
            with documented standards, transparent sourcing, and an unambiguous commitment to primary
            source verification.
          </p>
          <p>
            The public record belongs to the public. ClownBinge's function is to make it accessible,
            comprehensible, and impossible to ignore.
          </p>

          <div className="h-1 w-full bg-[#F5C518] rounded-full my-10" />

          <h2>References</h2>
          <p>
            Allcott, H., &amp; Gentzkow, M. (2017). Social media and fake news in the 2016 election.
            <em> Journal of Economic Perspectives, 31</em>(2), 211&ndash;236.
            https://doi.org/10.1257/jep.31.2.211
          </p>
          <p>
            Bail, C. A., Argyle, L. P., Brown, T. W., Bumpus, J. P., Chen, H., Hunzaker, M. B. F.,
            Lee, J., Mann, M., Merhout, F., &amp; Volfovsky, A. (2018). Exposure to opposing views on
            social media can increase political polarization. <em>Proceedings of the National Academy
            of Sciences, 115</em>(37), 9216&ndash;9221. https://doi.org/10.1073/pnas.1804840115
          </p>
          <p>
            Bennett, W. L., &amp; Livingston, S. (2018). The disinformation order: Disruptive
            communication and the decline of democratic institutions. <em>European Journal of
            Communication, 33</em>(2), 122&ndash;139. https://doi.org/10.1177/0267323118760317
          </p>
          <p>
            DiResta, R., Shaffer, K., Ruppel, B., Sullivan, D., Matney, R., Fox, R., Albright, J.,
            &amp; Johnson, B. (2019). <em>The tactics and tropes of the Internet Research Agency.</em>
            New Knowledge. https://digitalcommons.unl.edu/senatedocs/2/
          </p>
          <p>
            FireEye. (2018). <em>Suspected Iranian influence operation: Leveraging inauthentic news
            sites and social media aimed at U.S., U.K., Latin America and Middle East.</em>
            FireEye Intelligence.
          </p>
          <p>
            Gleicher, N., Goldberg, A., &amp; Thomas, T. (2022). <em>Coordinated inauthentic behavior
            report: Q3 2022.</em> Meta Transparency Center.
          </p>
          <p>
            Guess, A. M., Malhotra, N., Pan, J., Barberá, P., Allcott, H., Brown, T., Crespo-Tenorio, A.,
            Dimmery, D., Freelon, D., Gentzkow, M., &amp; González-Bailón, S. (2023). How do social
            media feed algorithms affect attitudes and behavior in an election campaign? <em>Science,
            381</em>(6656), 398&ndash;404. https://doi.org/10.1126/science.abp9364
          </p>
          <p>
            Haugen, F. (2021, October 5). <em>Testimony before the United States Senate Committee on
            Commerce, Science, and Transportation.</em> 117th Congress.
          </p>
          <p>
            Lazer, D. M. J., Baum, M. A., Benkler, Y., Berinsky, A. J., Greenhill, K. M., Menczer, F.,
            Metzger, M. J., Nyhan, B., Pennycook, G., Rothschild, D., Schudson, M., Sloman, S. A.,
            Sunstein, C. R., Thorson, E. A., Watts, D. J., &amp; Zittrain, J. L. (2018). The science
            of fake news. <em>Science, 359</em>(6380), 1094&ndash;1096.
            https://doi.org/10.1126/science.aao2998
          </p>
          <p>
            National Academies of Sciences, Engineering, and Medicine. (2020). <em>Evaluating the
            authenticity of online health information.</em> The National Academies Press.
          </p>
          <p>
            Office of the Director of National Intelligence. (2023). <em>Annual threat assessment of
            the U.S. intelligence community.</em> ODNI.
          </p>
          <p>
            Pennycook, G., &amp; Rand, D. G. (2019). Lazy, not biased: Susceptibility to partisan
            fake news is better explained by lack of reasoning than by motivated reasoning.
            <em> Cognition, 188</em>, 39&ndash;50. https://doi.org/10.1016/j.cognition.2018.06.011
          </p>
          <p>
            Pew Research Center. (2021). <em>Americans' views of the news media in the wake of COVID-19.</em>
            Pew Research Center.
          </p>
          <p>
            Reuters Institute for the Study of Journalism. (2023). <em>Digital news report 2023.</em>
            University of Oxford.
          </p>
          <p>
            Roozenbeek, J., Schneider, C. R., Dryhurst, S., Kerr, J., Freeman, A. L. J., Recchia, G.,
            van der Bles, A. M., &amp; van der Linden, S. (2020). Susceptibility to misinformation
            about COVID-19 across 26 countries. <em>Royal Society Open Science, 7</em>(10).
            https://doi.org/10.1098/rsos.201199
          </p>
          <p>
            Tufekci, Z. (2018, March 10). YouTube, the great radicalizer.
            <em> The New York Times.</em>
          </p>
          <p>
            United States Department of Justice. (2019). <em>Report on the investigation into Russian
            interference in the 2016 presidential election</em> (Vol. I &amp; II). Mueller, R. S.
          </p>
          <p>
            United States Senate Select Committee on Intelligence. (2020). <em>Report of the Select
            Committee on Intelligence on Russian active measures campaigns and interference in the
            2016 U.S. election</em> (Vol. 2). U.S. Government Publishing Office.
          </p>
          <p>
            Vosoughi, S., Roy, D., &amp; Aral, S. (2018). The spread of true and false news online.
            <em> Science, 359</em>(6380), 1146&ndash;1151. https://doi.org/10.1126/science.aap9559
          </p>
          <p>
            Wardle, C., &amp; Derakhshan, H. (2017). <em>Information disorder: Toward an
            interdisciplinary framework for research and policy making.</em> Council of Europe.
          </p>
          <p>
            Wood, T., &amp; Porter, E. (2019). The elusive backfire effect: Mass attitudes' steadfast
            factual adherence. <em>Political Behavior, 41</em>(1), 135&ndash;163.
            https://doi.org/10.1007/s11109-018-9443-y
          </p>

        </div>
      </div>
    </Layout>
  );
}
