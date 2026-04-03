"use client";

import { useUser } from "@clerk/nextjs";
import { redirect } from "next/navigation";

export default function SignalsPage() {
  const { user, isLoaded, isSignedIn } = useUser();

  

  const isProUser =
  isLoaded &&
  isSignedIn &&
  user?.publicMetadata?.plan === "pro";

  if (!isProUser) {
    return (
      <div className="max-w-3xl mx-auto py-20 px-6 text-center">
        <h1 className="text-3xl font-bold mb-4">Upgrade to view all signals</h1>
        <p className="mb-6">
          Pro members get access to the full live signals list.
        </p>
        <a
          href="/pricing"
          className="inline-block rounded-xl bg-black px-6 py-3 text-white"
        >
          View Pricing
        </a>
      </div>
    );
  }

  return (
  <div className="max-w-3xl mx-auto py-10 px-6">
    <h1 className="text-3xl font-bold mb-6">Live Signals</h1>

    <div className="space-y-4">
      <div className="border rounded-xl p-4">
        <p className="font-semibold">⚽ Arsenal vs Chelsea</p>
        <p>Prediction: Over 2.5 Goals</p>
        <p className="text-sm text-gray-500">Confidence: 78%</p>
      </div>

      <div className="border rounded-xl p-4">
        <p className="font-semibold">⚽ Barcelona vs Valencia</p>
        <p>Prediction: Barcelona Win</p>
        <p className="text-sm text-gray-500">Confidence: 82%</p>
      </div>

      <div className="border rounded-xl p-4">
        <p className="font-semibold">⚽ Inter vs Milan</p>
        <p>Prediction: Both Teams to Score</p>
        <p className="text-sm text-gray-500">Confidence: 74%</p>
      </div>
    </div>
  </div>
);
}

