"use client"

import { useEffect, useState } from "react"
import { UserButton } from "@clerk/nextjs"

export default function Navbar() {
  const [data, setData] = useState<any>(null)

  useEffect(() => {
  setData({ hasAccess: true })
}, [])

  const hasAccess = data?.hasAccess
  const isTrial = data?.subscriptionStatus === "trialing"
  const daysLeft = data?.trialDaysLeft

  return (
    <nav className="w-full border-b bg-white">
      <div className="max-w-6xl mx-auto px-6 py-4 flex justify-between items-center">

        {/* Logo */}
        <h1 className="font-bold text-lg">QuantEdge</h1>

        <div className="flex items-center gap-4">

          <a href="/signals">Signals</a>
          <a href="/pricing">Pricing</a>

          {/* Trial badge */}
          {isTrial && daysLeft > 0 && (
            <span className="text-sm text-green-600">
              Trial: {daysLeft}d left
            </span>
          )}

          {/* Active badge */}
          {hasAccess && !isTrial && (
            <span className="text-sm text-green-600">
              Pro Active
            </span>
          )}

          {/* Upgrade button */}
          {!hasAccess && (
            <a
              href="/pricing"
              className="px-4 py-2 bg-black text-white rounded-lg"
            >
              Start Free Trial
            </a>
          )}

          {/* Billing */}
          {data?.signedIn && (
            <button
              onClick={async () => {
                const res = await fetch("/api/portal", { method: "POST" })
                const d = await res.json()
                window.location.href = d.url
              }}
              className="text-sm text-gray-600"
            >
              Manage Billing
            </button>
          )}

          <UserButton />
        </div>
      </div>
    </nav>
  )
}
