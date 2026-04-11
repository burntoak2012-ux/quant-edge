"use client"

export default function PricingPage() {
  const handleCheckout = async () => {
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
      })

      if (!res.ok) {
        console.error("Checkout failed")
        return
      }

      const data = await res.json()

      if (data.url) {
        window.location.href = data.url
      }
    } catch (err) {
      console.error("Error:", err)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-black px-6">
      <div className="max-w-md w-full rounded-2xl border border-zinc-800 bg-zinc-900 p-8 text-center shadow-xl">
        
        <h1 className="text-3xl font-bold text-white">
          Quant Edge Pro
        </h1>

        <p className="mt-3 text-zinc-400">
          Premium betting signals powered by data edge
        </p>

        <div className="mt-6">
          <span className="text-5xl font-bold text-white">£19</span>
          <span className="text-zinc-400"> / month</span>
        </div>

        <ul className="mt-6 space-y-2 text-sm text-zinc-300">
          <li>✔ Daily high-confidence signals</li>
          <li>✔ Advanced value detection</li>
          <li>✔ Market gap insights</li>
          <li>✔ Lineup-adjusted predictions</li>
        </ul>

        <button
          onClick={handleCheckout}
          className="mt-8 w-full rounded-2xl bg-white px-5 py-3 font-semibold text-black transition hover:bg-zinc-200"
        >
          Upgrade to Pro
        </button>

      </div>
    </div>
  )
}
