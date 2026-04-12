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

      // 🔴 Show backend error clearly
      if (!res.ok) {
        const text = await res.text();
        alert("Checkout error: " + text);
        return;
      }

      const data = await res.json();

      // 🔴 No URL returned
      if (!data.url) {
        alert("Checkout error: No checkout URL returned");
        return;
      }

      // ✅ Redirect to Stripe
      window.location.href = data.url;
    } catch (err: any) {
      alert("Client error: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-5xl mx-auto px-6 py-16 text-center">
        <h1 className="text-4xl font-bold mb-6">Upgrade to Pro</h1>
        <p className="text-gray-600 mb-10">
          Get full access to premium signals and insights.
        </p>

        <button
          onClick={handleCheckout}
          disabled={loading}
          className="bg-black text-white px-8 py-4 rounded-lg text-lg hover:opacity-80 transition disabled:opacity-50"
        >
          {loading ? "Processing..." : "Upgrade to Pro"}
        </button>
      </div>
    </div>
  );
}