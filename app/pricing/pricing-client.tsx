"use client"

import { useState } from "react"

export default function PricingClient() {
  const [loading, setLoading] = useState(false)

  const handleUpgrade = async () => {
    console.log("CLICK WORKED")

    try {
      setLoading(true)

      const res = await fetch("/api/checkout", {
        method: "POST",
      })

      const text = await res.text()
      console.log("Raw checkout response:", text)

      let data: { url?: string; error?: string } = {}

      try {
        data = JSON.parse(text)
      } catch {
        throw new Error("API route not found or invalid response")
      }

      if (!res.ok || !data.url) {
        throw new Error(data.error || "Checkout failed")
      }

      window.location.href = data.url
    } catch (error) {
      console.error("Upgrade error:", error)
      alert(
        error instanceof Error
          ? error.message
          : "Something went wrong. Try again."
      )
      setLoading(false)
    }
  }

  return (
    <main className="min-h-screen bg-white text-black">
      <div className="mx-auto max-w-5xl px-6 py-16">
        <div className="max-w-md">
          <h1 className="text-3xl font-bold">Upgrade to Pro</h1>
          <p className="mt-2 text-gray-600">
            Unlock all signals and full edge analysis.
          </p>

          <button
            type="button"
            onClick={handleUpgrade}
            disabled={loading}
            className="mt-6 rounded-lg bg-black px-5 py-3 text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? "Redirecting..." : "Start Free Trial"}
          </button>
        </div>
      </div>
    </main>
  )
}