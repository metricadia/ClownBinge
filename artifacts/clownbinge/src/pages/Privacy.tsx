import { Layout } from "@/components/Layout";

export default function Privacy() {
  return (
    <Layout>
      <div className="cb-container py-16 sm:py-24 max-w-3xl mx-auto">
        <div className="prose prose-lg max-w-none text-foreground prose-headings:font-display prose-headings:font-bold prose-headings:text-header prose-p:leading-relaxed">
          
          <h1 className="text-4xl sm:text-5xl mb-8">Privacy Policy</h1>
          <p className="text-muted-foreground font-mono text-sm border-l-2 border-border pl-4">Last Updated: October 2023</p>

          <div className="bg-muted p-6 rounded-xl my-8 border border-border">
            <p className="m-0 text-sm font-medium">
              <strong>TL;DR:</strong> We collect minimal data necessary to run the site, process book orders via Stripe, and serve Ezoic ads. We don't sell your personal email to third parties. We are a journalism site, not a data broker.
            </p>
          </div>

          <h2>1. Information We Collect</h2>
          <p>
            <strong>Information you provide to us:</strong> When you subscribe to our newsletter, use our contact form, or purchase a book, you may provide us with your email address, name, and payment information. <em>Note: Payment information is processed securely by Stripe; ClownBinge does not store your credit card details.</em>
          </p>
          <p>
            <strong>Information collected automatically:</strong> We use standard analytics and advertising partners (Ezoic) that may collect IP addresses, browser types, device information, and interaction data using cookies and similar technologies.
          </p>

          <h2>2. How We Use Your Information</h2>
          <ul>
            <li>To deliver the digital products (PDFs) you purchase.</li>
            <li>To send the newsletter you opted into.</li>
            <li>To analyze site traffic and improve our editorial focus.</li>
            <li>To serve relevant advertisements that fund our independent journalism.</li>
          </ul>

          <h2>3. Ezoic and Advertising</h2>
          <p>
            We use Ezoic to provide personalization and analytic services on this website. Ezoic's privacy policy can be viewed on their platform. Advertisers may use cookies to serve ads based on your prior visits to our website or other websites.
          </p>

          <h2>4. Third-Party Services</h2>
          <p>We utilize the following services which have their own privacy policies:</p>
          <ul>
            <li><strong>Stripe:</strong> For secure payment processing.</li>
            <li><strong>Bunny.net:</strong> For video hosting delivery.</li>
            <li><strong>Hyvor Talk:</strong> For comment hosting and moderation.</li>
          </ul>

          <h2>5. Your Rights</h2>
          <p>
            You have the right to unsubscribe from our newsletter at any time using the link at the bottom of every email. You may also request deletion of your account/data by contacting us at privacy@clownbinge.com.
          </p>

          <h2>6. Contact Us</h2>
          <p>
            If you have questions about this Privacy Policy, please contact us at:
            <br />ClownBinge Wyoming Corp
            <br />privacy@clownbinge.com
          </p>

        </div>
      </div>
    </Layout>
  );
}
