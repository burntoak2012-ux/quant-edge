"use client";

import { useUser } from "@clerk/nextjs";
import { signals } from "@/lib/signals";

export default function SignalsPage() {
  const { user, isLoaded, isSignedIn } = useUser();

  if (!isLoaded) {
    return <div className="p-6">Loading...</div>;
  }

  if (!isSignedIn) {
    return (
      <div className="max-w-3xl mx-auto py-20 px-6 text-center">
        <h1 className="text-2xl font-bold mb-4">Please sign in</h1>
        <p>You must be signed in to view signals.</p>
      </div>
    );
  }

  const isProUser =
    isLoaded &&
    isSignedIn &&
    user?.publicMetadata?.plan === "pro";

  if (!isProUser) {
    return (
      <div className="max-w-3xl mx-auto py-20 px-6 text-center">
        <h1 className="text-3xl font-bold mb-4">Upgrade to view all signals</h1>
        <p className="mb-6">Pro members get access to the full live signals list.</p>
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
  <div className="max-w-5xl mx-auto py-10 px-6">
    <div className="hidden text-green-600 text-yellow-600 text-red-600"></div>
    <div className="mb-8">
      <h1 className="text-4xl font-bold">Live Signals</h1>
      <p className="text-gray-500 mt-2">
        Today’s AI-powered football betting picks
      </p>
    </div>

    <div className="grid gap-4">
      {signals.map((signal) => (
        <div
          key={signal.id}
          className="border rounded-2xl p-5 shadow-sm bg-white"
        >
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-lg font-semibold">{signal.match}</h2>
            <span className="text-sm text-gray-500">{signal.kickoff}</span>
          </div>

          <p className="text-sm text-gray-500 mb-3">{signal.league}</p>

          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Prediction</p>
              <p className="font-medium">{signal.prediction}</p>
            </div>

            <div className="text-right">
              <p className="text-sm 
            text-gray-500">Confidence</p>

              <p
                className={`font-semibold ${
                  signal.confidence >= 80
                    ? "text-green-600"
                    : signal.confidence >= 70
                    ? "text-yellow-600"
                    : "text-red-600"
                }`}
              >
                {signal.confidence}%
              </p>
            </div>
          </div>
        </div>
      ))}
    </div>
  </div>
);
}


