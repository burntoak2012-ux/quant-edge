import Link from "next/link"

export default function DisclaimerPage() {
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
            Disclaimer
          </h1>
          <p className="mt-3 text-sm text-zinc-500">
            Last updated: 11 April 2026
          </p>

          <div className="prose prose-zinc mt-8 max-w-none">
            <h2>Informational Use Only</h2>
            <p>
              QuantEdge content is provided for informational and educational
              purposes only. It is not betting advice, financial advice,
              investment advice, or a guarantee of results.
            </p>

            <h2>No Guarantee of Accuracy or Profit</h2>
            <p>
              We do not guarantee the accuracy, completeness, reliability,
              profitability, or suitability of any signal, model output, market
              view, or written commentary.
            </p>

            <h2>User Responsibility</h2>
            <p>
              Any decision you make based on this website is entirely your own
              responsibility. You accept full responsibility for any gains, losses,
              or consequences arising from use of this service.
            </p>

            <h2>Bet Responsibly</h2>
            <p>
              If you choose to participate in betting activity, do so responsibly
              and only where lawful. Never bet more than you can afford to lose.
            </p>

            <h2>Jurisdiction</h2>
            <p>
              It is your responsibility to ensure that accessing this service and
              participating in betting-related activity is lawful in your location.
            </p>

            <h2>Contact</h2>
            <p>
              For questions about this disclaimer, contact: legal@quantedge.local
            </p>
          </div>
        </div>
      </main>
    </div>
  )
}