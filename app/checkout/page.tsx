"use client"

import { useState } from "react"

export default function CheckoutPage() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const handleCheckout = async () => {
    try {
      setLoading(true)
      setError("")

      const res = await fetch("/api/checkout", {
        method: "POST",
      })

      const data = await res.json()

      if (!res.ok) {
        setError(data.error || "Checkout failed")
        return
      }

      if (data.url) {
        window.location.href = data.url
        return
      }

      setError("No checkout URL returned")
    } catch (err: any) {
      setError(err?.message || "Checkout failed")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="mx-auto max-w-xl px-6 py-16 text-center">
      <h1 className="text-2xl font-bold text-gray-900">Upgrade to Pro</h1>
      <p className="mt-2 text-gray-600">Unlock all signals and full edge analysis.</p>

      <button
        onClick={handleCheckout}
        disabled={loading}
        className="mt-6 rounded-lg bg-black px-6 py-3 font-semibold text-white disabled:opacity-50"
      >
        {loading ? "Loading..." : "Pay Now"}
      </button>

      {error && <p className="mt-4 text-sm text-red-600">{error}</p>}
    </div>
  )
}
