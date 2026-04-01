"use client";

import { useUser } from "@clerk/nextjs";
import { useState } from "react";
import Link from "next/link";

export default function PricingPage() {
  const { user, isLoaded, isSignedIn } = useUser();
  const [loading, setLoading] = useState(false);

  const isProUser =
    isLoaded &&
    isSignedIn &&
    user?.publicMetadata?.plan === "pro";

  return (
    <div className="min-h-screen bg-gray-50 p-10">
      <div className="max-w-6xl mx-auto">
        
        {/* Back */}
        <div className="mb-10">
          <Link href="/signals" className="text-blue-600 hover:underline">
            ← Back to Signals
          </Link>
        </div>

        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">Choose your plan</h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Get daily football value bets, fair odds, confidence ratings,
            and detailed match breakdowns in one place.
          </p>
        </div>

        {/* Plans */}
        <div className="grid gap-8 md:grid-cols-2 mb-14">
          
          {/* FREE */}
          <div className="rounded-2xl border border-gray-200 bg-white p-8 shadow-sm">
            <h2 className="text-2xl font-semibold mb-2">Free</h2>
            <p className="text-gray-500 mb-4">For casual users</p>
            <p className="text-3xl font-bold mb-6">£0</p>

            <ul className="space-y-2 mb-6 text-sm">
              <li>✅ 1 top value bet per day</li>
              <li>✅ Limited preview of signals</li>
              <li>❌ Full signal list</li>
              <li>❌ Premium insights</li>
            </ul>

            <button
              disabled
              className="w-full rounded-xl border border-gray-300 py-3 text-gray-500"
            >
              Current Plan
            </button>
          </div>

          {/* PRO */}
          <div className="rounded-2xl border border-black bg-white p-8 shadow-sm">
            <p className="text-xs font-semibold mb-2">MOST POPULAR</p>
            <h2 className="text-2xl font-semibold mb-2">Pro</h2>
            <p className="text-gray-500 mb-4">For serious bettors</p>
            <p className="text-3xl font-bold mb-6">£19/month</p>

            <ul className="space-y-2 mb-6 text-sm">
              <li>✅ All daily value bets</li>
              <li>✅ Full signal list</li>
              <li>✅ Odds comparison</li>
              <li>✅ Confidence ratings</li>
            </ul>

            {isProUser ? (
              <button
                disabled
                className="w-full rounded-xl border border-gray-300 py-3 text-gray-500"
              >
                Current Plan
              </button>
            ) : (
              <button
                onClick={async () => {
                  setLoading(true);

                  const res = await fetch("/api/checkout", {
                    method: "POST",
                    headers: {
                      "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                      clerkUserId: user?.id,
                    }),
                  });

                  const data = await res.json();

                  if (data.url) {
                    window.location.href = data.url;
                    return;
                  }

                  setLoading(false);
                }}
                disabled={loading}
                className="w-full rounded-xl bg-black py-3 text-white"
              >
                {loading ? "Redirecting..." : "Upgrade to Pro"}
              </button>
            )}

            <p className="text-xs text-gray-500 mt-3 text-center">
              Cancel anytime
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

