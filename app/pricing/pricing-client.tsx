"use client"

import { useUser, SignInButton } from "@clerk/nextjs"

export default function PricingClient() {
  const { isSignedIn } = useUser()

  async function handleUpgrade() {
  try {
    const res = await fetch("/api/create-checkout", {
      method: "POST",
    })

    const data = await res.json()

    if (res.ok && data.url) {
      window.location.href = data.url
      return
    }

    throw new Error(data?.error || "Checkout failed")
  } catch (err) {
    console.error("Error:", err)
    alert("Checkout failed. Check terminal output.")
  }
}

  return (
    <main className="min-h-screen bg-white text-black">
      <div className="max-w-4xl mx-auto px-6 py-20 text-center">

        <h1 className="text-4xl font-bold mb-4">
          Upgrade to Pro
        </h1>

        <p className="text-gray-600 mb-8">
          Unlock all signals and full edge analysis.
        </p>

        {!isSignedIn ? (
          <SignInButton mode="modal">
            <button className="px-6 py-3 bg-black text-white rounded-lg">
              Sign in to upgrade
            </button>
          </SignInButton>
        ) : (
          <button
            onClick={handleUpgrade}
            className="px-6 py-3 bg-black text-white rounded-lg"
          >
            Start Free Trial
          </button>
        )}

      </div>
    </main>
  )
}
