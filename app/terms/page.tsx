import Link from "next/link"

export default function TermsPage() {
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
            Terms of Service
          </h1>
          <p className="mt-3 text-sm text-zinc-500">
            Last updated: 11 April 2026
          </p>

          <div className="prose prose-zinc mt-8 max-w-none">
            <h2>1. Overview</h2>
            <p>
              QuantEdge provides football signal content, model outputs, market
              observations, and related analytics for informational and educational
              purposes only.
            </p>

            <h2>2. No Financial, Betting, or Investment Advice</h2>
            <p>
              QuantEdge does not provide financial advice, investment advice,
              gambling advice, or guaranteed predictions. All content is provided
              for information only. You are solely responsible for any decision you
              make based on information shown on this website.
            </p>

            <h2>3. Age Requirement</h2>
            <p>
              You must be at least 18 years old, or the minimum legal age in your
              jurisdiction, to use paid services or any content related to betting
              markets.
            </p>

            <h2>4. User Responsibility</h2>
            <p>
              You are responsible for ensuring that your use of QuantEdge complies
              with the laws and regulations in your jurisdiction. Access to this
              service is void where prohibited by law.
            </p>

            <h2>5. Subscriptions and Billing</h2>
            <p>
              Paid access is billed on a recurring subscription basis unless and
              until cancelled. By subscribing, you authorize recurring billing
              through our payment provider.
            </p>
            <p>
              Unless required by law, subscription fees are non-refundable once a
              billing period has started.
            </p>

            <h2>6. Service Availability</h2>
            <p>
              We may modify, suspend, or discontinue any part of the service at any
              time, including signals, features, data sources, pricing, or access
              rules, without liability.
            </p>

            <h2>7. No Warranty</h2>
            <p>
              The service is provided on an “as is” and “as available” basis. We do
              not guarantee accuracy, completeness, uptime, profitability, or
              fitness for any particular purpose.
            </p>

            <h2>8. Limitation of Liability</h2>
            <p>
              To the maximum extent permitted by law, QuantEdge shall not be liable
              for any direct, indirect, incidental, special, consequential, or
              financial losses arising from use of the service, including losses
              related to betting activity, reliance on model outputs, or service
              interruptions.
            </p>

            <h2>9. Acceptable Use</h2>
            <p>You agree not to:</p>
            <ul>
              <li>copy, resell, or redistribute paid content without permission</li>
              <li>attempt to reverse engineer or exploit the platform</li>
              <li>use automated tools to scrape restricted content</li>
              <li>use the service for unlawful purposes</li>
            </ul>

            <h2>10. Intellectual Property</h2>
            <p>
              All content, branding, model presentation, and website materials are
              owned by QuantEdge unless otherwise stated. No rights are granted
              except the limited right to use the service for personal use.
            </p>

            <h2>11. Termination</h2>
            <p>
              We may suspend or terminate access at our discretion if these terms
              are violated or if continued access presents legal, operational, or
              security risk.
            </p>

            <h2>12. Governing Law</h2>
            <p>
              These terms are governed by the laws of England and Wales, unless
              otherwise required by applicable consumer law.
            </p>

            <h2>13. Contact</h2>
            <p>
              For legal or account questions, contact: support@quantedge.local
            </p>
          </div>
        </div>
      </main>
    </div>
  )
}