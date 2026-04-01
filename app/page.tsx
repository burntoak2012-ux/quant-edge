"use client";

import { useUser } from "@clerk/nextjs";

export default function Home() {
  const { user, isLoaded, isSignedIn } = useUser();

  const isProUser =
    isLoaded &&
    isSignedIn &&
    user?.publicMetadata?.plan === "pro";

  return (
    <main className="p-16 text-center">
      <h1 className="text-5xl font-bold">
        QuantEdge AI ⚡
      </h1>

      <p className="mt-4 text-lg">
        Real-time football betting intelligence powered by AI
      </p>

      <div className="mt-6">
        {/* NOT SIGNED IN */}
        {!isSignedIn && (
          <button
            onClick={() => (window.location.href = "/sign-in")}
            className="bg-black text-white px-6 py-3 rounded-lg"
          >
            Get Started
          </button>
        )}

        {/* SIGNED IN BUT NOT PRO */}
        {isSignedIn && !isProUser && (
          <button
            onClick={() => (window.location.href = "/pricing")}
            className="bg-black text-white px-6 py-3 rounded-lg"
          >
            Upgrade to Pro
          </button>
        )}

        {/* PRO USER */}
        {isSignedIn && isProUser && (
          <button
            onClick={() => (window.location.href = "/signals")}
            className="bg-black text-white px-6 py-3 rounded-lg"
          >
            View Signals
          </button>
        )}
      </div>
    </main>
  );
}
