"use client"

export default function PricingPage() {
  const handleCheckout = async () => {
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
      })

      const data = await res.json()

      if (data.url) {
        window.location.href = data.url
      } else {
        alert("Checkout failed")
      }
    } catch {
      alert("Checkout failed")
    }
  }

  return (
    <main className="min-h-screen bg-[#070b14] px-6 py-16 text-white">
      <div className="mx-auto max-w-6xl">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.35em] text-cyan-300/80">
            Pricing
          </p>

          <h1 className="mt-4 text-5xl font-bold tracking-tight sm:text-6xl">
            Quant Edge Pro
          </h1>

          <p className="mt-5 text-lg leading-8 text-zinc-300">
            Premium football betting signals powered by team strength, lineup
            edges, value detection, and market-gap analysis.
          </p>
        </div>

        <div className="mt-14 grid gap-8 lg:grid-cols-[1.15fr_0.85fr]">
          <section className="rounded-[32px] border border-white/10 bg-white/5 p-8 shadow-2xl backdrop-blur">
            <div className="flex flex-wrap items-center gap-3">
              <span className="rounded-full border border-cyan-400/20 bg-cyan-400/10 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-cyan-200">
                Most Popular
              </span>
              <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-zinc-300">
                Cancel anytime
              </span>
            </div>

            <div className="mt-8 flex items-end gap-3">
              <span className="text-6xl font-bold tracking-tight">£19</span>
              <span className="mb-2 text-lg text-zinc-400">/ month</span>
            </div>

            <p className="mt-4 max-w-xl text-base leading-7 text-zinc-300">
              Get full access to premium signals, value ratings, confidence
              scores, model reads, and billing management.
            </p>

            <div className="mt-8 grid gap-3 sm:grid-cols-2">
              <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
                <p className="font-semibold text-white">Daily high-confidence signals</p>
                <p className="mt-1 text-sm text-zinc-400">
                  Fresh picks generated from your model output.
                </p>
              </div>

              <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
                <p className="font-semibold text-white">Value detection</p>
                <p className="mt-1 text-sm text-zinc-400">
                  Spot stronger opportunities with model edge.
                </p>
              </div>

              <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
                <p className="font-semibold text-white">Market gap insights</p>
                <p className="mt-1 text-sm text-zinc-400">
                  See where your numbers differ from the market.
                </p>
              </div>

              <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
                <p className="font-semibold text-white">Lineup-adjusted signals</p>
                <p className="mt-1 text-sm text-zinc-400">
                  Incorporates team changes and matchup structure.
                </p>
              </div>

              <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
                <p className="font-semibold text-white">Premium dashboard</p>
                <p className="mt-1 text-sm text-zinc-400">
                  View confidence, strength, and board overview.
                </p>
              </div>

              <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
                <p className="font-semibold text-white">Manage billing anytime</p>
                <p className="mt-1 text-sm text-zinc-400">
                  Update payment method or cancel in one click.
                </p>
              </div>
            </div>
          </section>

          <aside className="rounded-[32px] border border-cyan-400/20 bg-gradient-to-b from-cyan-400/10 to-blue-500/10 p-8 shadow-2xl backdrop-blur">
            <p className="text-sm font-semibold uppercase tracking-[0.25em] text-cyan-200">
              Quant Edge Pro
            </p>

            <h2 className="mt-4 text-3xl font-bold">Everything in one plan</h2>

            <p className="mt-4 text-sm leading-7 text-zinc-300">
              Built for users who want cleaner signal delivery and faster access
              to the strongest model-backed picks.
            </p>

            <ul className="mt-8 space-y-4 text-sm text-zinc-200">
              <li>✓ Premium daily football signals</li>
              <li>✓ Confidence and value scores</li>
              <li>✓ Market-gap and edge views</li>
              <li>✓ Pro-only dashboard access</li>
              <li>✓ Stripe billing portal access</li>
              <li>✓ Cancel whenever you want</li>
            </ul>

            <button
              onClick={handleCheckout}
              className="mt-8 w-full rounded-full bg-white px-6 py-4 text-base font-semibold text-zinc-950 transition hover:opacity-90"
            >
              Upgrade to Pro
            </button>

            <p className="mt-4 text-center text-xs text-zinc-400">
              Secure checkout powered by Stripe
            </p>
          </aside>
        </div>
      </div>
    </main>
  )
}
