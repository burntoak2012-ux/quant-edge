"use client"

import { useEffect } from "react"
import { track } from "@/lib/track"

export default function PricingPage() {
  useEffect(() => {
    track("pricing_view")
  }, [])

  async function handleCheckout() {
    track("checkout_click")

    const res = await fetch("/api/create-checkout", {
      method: "POST",
    })

    const data = await res.json()

    if (data.url) {
      window.location.href = data.url
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 px-6 py-16">
      <div className="mx-auto max-w-4xl">
        <div className="mb-8 text-center">
          <p className="mb-3 text-sm font-semibold text-green-600">
            ⚡ Today’s premium signals are live
          </p>

          <h1 className="text-4xl font-bold">
            Unlock today’s highest-confidence football picks
          </h1>

          <p className="mt-2 text-sm text-gray-500">
            Trusted by 120+ bettors this week
          </p>

          <p className="mx-auto mt-4 max-w-2xl text-gray-600">
            Get daily AI-powered betting signals with confidence scores,
            markets, odds and premium pick alerts.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <div className="rounded-2xl border bg-white p-6 shadow-sm">
            <h2 className="text-xl font-bold">Free</h2>
            <p className="mt-2 text-gray-600">Preview limited signals.</p>

            <div className="mt-6 text-4xl font-bold">
              £0
              <span className="text-base font-normal text-gray-500">
                /month
              </span>
            </div>

            <ul className="mt-6 space-y-3 text-sm">
              <li>✅ View 2 signals</li>
              <li>❌ No full premium card</li>
              <li>❌ No full confidence breakdown</li>
              <li>❌ No top-pick access</li>
            </ul>

            <a
              href="/signals"
              className="mt-8 inline-block w-full rounded-lg border px-6 py-3 text-center font-semibold"
            >
              View Free Signals
            </a>
          </div>

          <div className="relative rounded-2xl border-2 border-black bg-white p-6 shadow-md">
            <div className="absolute -top-3 left-6 rounded-full bg-black px-3 py-1 text-xs font-semibold text-white">
              Best Value
            </div>

            <h2 className="text-xl font-bold">Pro</h2>
            <p className="mt-2 text-gray-600">
              Full access to today’s premium picks.
            </p>

            <div className="mt-6 text-4xl font-bold">
              £19
              <span className="text-base font-normal text-gray-500">
                /month
              </span>
            </div>

            <div className="mt-4 rounded-lg bg-red-50 p-3 text-sm text-red-700">
              ⏳ Today’s signals are live — lock in access now.
            </div>

            <ul className="mt-6 space-y-3 text-sm">
              <li>✅ Unlimited daily signals</li>
              <li>✅ Full picks, odds and markets</li>
              <li>✅ Confidence scores</li>
              <li>✅ Top Pick alerts</li>
              <li>✅ Cancel anytime</li>
            </ul>

            <button
              type="button"
              onClick={handleCheckout}
              className="mt-8 inline-block w-full rounded-lg bg-black px-6 py-3 text-center font-semibold text-white"
            >
              Get Today’s Picks Now
            </button>

            <p className="mt-3 text-center text-xs text-gray-500">
              Secure checkout. Cancel anytime.
            </p>
          </div>
        </div>

        <div className="mt-12 text-center">
          <p className="mb-4 text-sm text-gray-500">Recent winning picks</p>

          <div className="space-y-2 text-sm">
            <p>✅ Arsenal vs Chelsea — Over 2.5 (W)</p>
            <p>✅ Madrid vs Sevilla — Home Win (W)</p>
            <p>✅ Inter vs Roma — BTTS (W)</p>
          </div>
        </div>
      </div>
    </div>
  )
}