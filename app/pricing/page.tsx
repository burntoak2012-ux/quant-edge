"use client";

import { useState } from "react";
import { useUser } from "@clerk/nextjs";

export default function PricingPage() {
  const { user, isLoaded, isSignedIn } = useUser();
  const [loading, setLoading] = useState(false);

  const isProUser =
    isLoaded &&
    isSignedIn &&
    user?.publicMetadata?.plan === "pro";

  return (
    <div className="max-w-4xl mx-auto py-20 px-6">
      <h1 className="text-3xl font-bold mb-8 text-center">
        Choose your plan
      </h1>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="border rounded-xl p-6">
          <h2 className="text-xl font-semibold mb-2">Free</h2>
          <p className="text-2xl font-bold mb-4">£0</p>

          <ul className="text-sm space-y-2 mb-6">
            <li>✔ 1 top value bet per day</li>
            <li>✔ Limited preview of signals</li>
            <li>✘ Full signal list</li>
            <li>✘ Premium insights</li>
          </ul>

          <button
            disabled
            className="w-full rounded-xl bg-gray-300 py-3 text-black"
          >
            {isProUser ? "Previous Plan" : "Current Plan"}
          </button>
        </div>

        <div className="border rounded-xl p-6">
          <h2 className="text-xl font-semibold mb-2">Pro</h2>
          <p className="text-2xl font-bold mb-4">£19/month</p>

          <ul className="text-sm space-y-2 mb-6">
            <li>✔ All daily value bets</li>
            <li>✔ Full signal list</li>
            <li>✔ Odds comparison</li>
            <li>✔ Confidence ratings</li>
          </ul>

          {isProUser ? (
            <button
              disabled
              className="w-full rounded-xl bg-gray-300 py-3 text-black"
            >
              Current Plan
            </button>
          ) : (
            <button
              onClick={async () => {
                if (!isLoaded) return;

                if (!isSignedIn || !user?.id) {
                  alert("You need to sign in first");
                  return;
                }

                try {
                  setLoading(true);

                  const res = await fetch("/api/checkout", {
                    method: "POST",
                    headers: {
                      "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                      clerkUserId: user.id,
                    }),
                  });

                  const data = await res.json();

                  if (!res.ok) {
                    alert(data.error || "Checkout failed");
                    return;
                  }

                  if (data.url) {
                    window.location.href = data.url;
                    return;
                  }

                  alert("No checkout URL returned");
                } catch (err) {
                  console.error("Checkout error:", err);
                  alert("Checkout failed");
                } finally {
                  setLoading(false);
                }
              }}
              disabled={loading || !isLoaded}
              className="w-full rounded-xl bg-black py-3 text-white"
            >
              {loading ? "Redirecting..." : "Upgrade to Pro"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
