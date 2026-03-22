import { Layout } from "@/components/Layout";

export default function Terms() {
  return (
    <Layout>
      <div className="cb-container py-16 sm:py-24 max-w-3xl mx-auto">
        <div className="prose prose-lg max-w-none text-foreground prose-headings:font-display prose-headings:font-bold prose-headings:text-header prose-p:leading-relaxed">
          
          <h1 className="text-4xl sm:text-5xl mb-8">Terms of Service</h1>
          <p className="text-muted-foreground font-mono text-sm border-l-2 border-border pl-4">Last Updated: October 2023</p>

          <h2>1. Acceptance of Terms</h2>
          <p>
            By accessing and using ClownBinge.com (the "Site"), you accept and agree to be bound by the terms and provision of this agreement. 
          </p>

          <h2>2. Nature of the Content</h2>
          <p>
            <strong>Satire and Commentary:</strong> ClownBinge is an accountability journalism platform that heavily utilizes political satire, criticism, and forensic commentary. While our factual claims are sourced from verified public records, news outlets, and government documents, our commentary and "verdicts" are protected expressions of opinion and satire under the First Amendment.
          </p>
          <p>
            <strong>Public Figures:</strong> The subjects of our articles are public figures, elected officials, and individuals operating in a public capacity. We do not target private citizens.
          </p>

          <h2>3. Intellectual Property</h2>
          <p>
            The original commentary, compilation, design, and structure of the Site (including the "ClownBinge" name and logo) are owned by ClownBinge Primary Source Analytics, LLC.
          </p>
          <p>
            <strong>Fair Use:</strong> The Site utilizes short excerpts of video, audio, and text from public records, congressional archives (C-SPAN), and news broadcasts for the strict purpose of transformative commentary, criticism, and reporting. This constitutes Fair Use under U.S. Copyright law.
          </p>

          <h2>4. User Conduct & Comments</h2>
          <p>
            When utilizing our commenting system (Hyvor Talk), you agree to not post content that is:
          </p>
          <ul>
            <li>Unlawful, threatening, or inciting violence.</li>
            <li>Doxxing or revealing private information of individuals.</li>
            <li>Spam, automated scripts, or unauthorized advertising.</li>
          </ul>
          <p>
            We reserve the right to remove any comment and ban any user without notice for violating these standards.
          </p>

          <h2>5. Digital Product Purchases</h2>
          <p>
            All purchases of digital products (eBooks, PDFs) are final. Due to the digital nature of the products, we do not offer refunds once the file has been delivered, except where required by law. If you experience technical issues downloading your purchase, contact support.
          </p>

          <h2>6. Limitation of Liability</h2>
          <p>
            ClownBinge Primary Source Analytics, LLC shall not be liable for any indirect, incidental, special, consequential or punitive damages, or any loss of profits or revenues, whether incurred directly or indirectly, resulting from your use of the Site.
          </p>

          <h2>7. Governing Law</h2>
          <p>
            These Terms shall be governed by and construed in accordance with the laws of the State of Wyoming, without regard to its conflict of law provisions.
          </p>

        </div>
      </div>
    </Layout>
  );
}
