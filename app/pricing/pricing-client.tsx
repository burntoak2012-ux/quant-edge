"use client";

import { useState } from "react";

export default function PricingClient() {
  const [loading, setLoading] = useState(false);

  const handleCheckout = async () => {
    try {
      setLoading(true);

      const res = await fetch("/api/checkout", {
        method: "POST",
      });

      const data = await res.json();

      if (data.url) {
        window.location.href = data.url;
        return;
      }

      alert("No checkout URL returned");
    } catch (error) {
      console.error("Checkout error:", error);
      alert("Checkout failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-5xl mx-auto px-6 py-16">
        <div className="text-center">
          <h1 className="text-5xl font-bold tracking-tight text-gray-900">
            Unlock Pro Signals
          </h1>
          <p className="mt-4 text-lg text-gray-600">
            Get access to AI-powered betting insights with high-confidence edges
          </p>
        </div>

        <div className="mt-12 flex justify-center">
          <div className="w-full max-w-md rounded-3xl border border-gray-200 bg-white p-8 shadow-sm">
            <h2 className="text-3xl font-bold text-gray-900">QuantEdge Pro</h2>

            <div className="mt-6 flex items-end gap-2">
              <span className="text-5xl font-bold text-gray-900">£19</span>
              <span className="mb-1 text-gray-500">/month</span>
            </div>

            <ul className="mt-8 space-y-4 text-gray-700">
              <li>✅ Full signal predictions</li>
              <li>✅ Confidence ratings</li>
              <li>✅ AI-generated summaries</li>
              <li>✅ Premium match insights</li>
              <li>✅ Early access to signals</li>
            </ul>

            <button
              onClick={handleCheckout}
              disabled={loading}
              className="mt-8 w-full rounded-xl bg-black px-6 py-3 text-sm font-medium text-white disabled:opacity-60"
            >
              {loading ? "Redirecting..." : "Upgrade to Pro"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}