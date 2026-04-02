"use client";

import { useUser } from "@clerk/nextjs";
import { redirect } from "next/navigation";

export default function SignalsPage() {
  const { user, isLoaded, isSignedIn } = useUser();

  if (!isLoaded) {
    return <div className="p-6">Loading...</div>;
  }

  if (!isSignedIn) {
    return (
      <div className="max-w-3xl mx-auto py-20 px-6 text-center">
        <h1 className="text-3xl font-bold mb-4">Live Signals</h1>
        <p className="mb-6">Please sign in to access signals.</p>
      </div>
    );
  }

  const isProUser = user?.publicMetadata?.plan === "pro";

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
    <div className="max-w-5xl mx-auto py-10 px-6">
      <h1 className="text-3xl font-bold mb-6">Live Signals</h1>

      <div className="border rounded-xl p-6">
        <p>Your pro signals will appear here.</p>
      </div>
    </div>
  );
}

