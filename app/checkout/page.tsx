"use client";

import { useState } from "react";
import Link from "next/link";

export default function CheckoutPage() {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  function handleSubscribe() {
    setLoading(true);

    setTimeout(() => {
      setLoading(false);
      setSuccess(true);
    }, 1500);
  }

  return (
    <div className="min-h-screen bg-gray-50 p-10">
      <div className="max-w-xl mx-auto bg-white p-8 rounded-2xl border shadow-sm">

        <Link href="/pricing" className="text-blue-600 text-sm">
          ← Back to Pricing
        </Link>

        {!success ? (
          <>
            <h1 className="text-2xl font-bold mt-4 mb-6">
              Upgrade to Pro
            </h1>

            <div className="mb-6">
              <p className="text-gray-600">Plan</p>
              <p className="text-xl font-semibold">Pro — £19/month</p>
            </div>

            <div className="space-y-2 text-sm text-gray-700 mb-6">
              <p>✅ All value bets</p>
              <p>✅ Full signal list</p>
              <p>✅ Match breakdowns</p>
              <p>✅ Confidence ratings</p>
            </div>

            <button
              onClick={handleSubscribe}
              className="w-full bg-black text-white py-3 rounded-xl hover:bg-gray-800"
            >
              {loading ? "Processing..." : "Subscribe"}
            </button>
          </>
        ) : (
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">
              🎉 You're now Pro!
            </h1>

            <p className="text-gray-600 mb-6">
              You now have full access to all signals and insights.
            </p>

            <Link
              href="/signals"
              className="inline-block bg-black text-white px-6 py-3 rounded-xl"
            >
              Go to Signals
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}