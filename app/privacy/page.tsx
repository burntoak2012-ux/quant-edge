import Link from "next/link"

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-zinc-50">
      <div className="border-b border-zinc-200 bg-white">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-4">
          <Link href="/" className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-black text-sm font-bold text-white">
              Q
            </div>
            <span className="text-lg font-semibold text-zinc-900">QuantEdge</span>
          </Link>

          <div className="flex items-center gap-6 text-sm">
            <Link href="/signals" className="text-zinc-600 hover:text-zinc-900">
              Signals
            </Link>
            <Link href="/pricing" className="text-zinc-600 hover:text-zinc-900">
              Pricing
            </Link>
          </div>
        </div>
      </div>

      <main className="mx-auto max-w-4xl px-6 py-10">
        <div className="rounded-[32px] border border-zinc-200 bg-white p-8 shadow-sm">
          <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-zinc-400">
            Legal
          </p>
          <h1 className="mt-4 text-4xl font-bold tracking-tight text-zinc-950">
            Privacy Policy
          </h1>
          <p className="mt-3 text-sm text-zinc-500">
            Last updated: 11 April 2026
          </p>

          <div className="prose prose-zinc mt-8 max-w-none">
            <h2>1. Information We Collect</h2>
            <p>We may collect the following categories of information:</p>
            <ul>
              <li>account information such as email address and user ID</li>
              <li>subscription and billing status</li>
              <li>technical data such as browser type, IP address, and device data</li>
              <li>usage data such as pages visited and feature interactions</li>
            </ul>

            <h2>2. How We Use Information</h2>
            <p>We use personal data to:</p>
            <ul>
              <li>provide and secure the service</li>
              <li>manage subscriptions and paid access</li>
              <li>improve product performance and user experience</li>
              <li>communicate service updates and support messages</li>
              <li>comply with legal obligations</li>
            </ul>

            <h2>3. Payments</h2>
            <p>
              Payments are processed by third-party payment providers such as
              Stripe. We do not store full payment card details on our servers.
            </p>

            <h2>4. Authentication</h2>
            <p>
              User authentication may be handled by third-party identity providers.
              Those providers may process your login and account data under their
              own terms and privacy policies.
            </p>

            <h2>5. Cookies and Analytics</h2>
            <p>
              We may use cookies or similar technologies for authentication,
              session management, analytics, and website functionality.
            </p>

            <h2>6. Data Sharing</h2>
            <p>We do not sell personal data. We may share data with:</p>
            <ul>
              <li>payment providers</li>
              <li>authentication providers</li>
              <li>hosting and infrastructure providers</li>
              <li>analytics or support providers</li>
              <li>authorities when required by law</li>
            </ul>

            <h2>7. Data Retention</h2>
            <p>
              We keep personal data only for as long as reasonably necessary to
              provide the service, operate the business, resolve disputes, and
              comply with legal obligations.
            </p>

            <h2>8. Your Rights</h2>
            <p>
              Depending on your location, you may have rights to access, correct,
              delete, restrict, or object to certain processing of your personal
              data.
            </p>

            <h2>9. Security</h2>
            <p>
              We use reasonable technical and organizational measures to protect
              personal data, but no method of storage or transmission is completely
              secure.
            </p>

            <h2>10. International Transfers</h2>
            <p>
              Your data may be processed in countries outside your own jurisdiction
              where our providers operate.
            </p>

            <h2>11. Children</h2>
            <p>
              This service is not intended for children and should not be used by
              anyone under the applicable minimum age.
            </p>

            <h2>12. Contact</h2>
            <p>
              For privacy requests or questions, contact: privacy@quantedge.local
            </p>
          </div>
        </div>
      </main>
    </div>
  )
}
