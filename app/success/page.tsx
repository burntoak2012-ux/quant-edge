"use client"

import { useEffect, useState } from "react"

export default function SuccessPage() {
  const [ready, setReady] = useState(false)

  useEffect(() => {
    const interval = setInterval(async () => {
      const res = await fetch("/api/access-status")
      const data = await res.json()

      if (data.hasAccess) {
        setReady(true)
        window.location.href = "/signals"
      }
    }, 1500)

    return () => clearInterval(interval)
  }, [])

  return (
    <main className="min-h-screen flex items-center justify-center bg-white">
      <div className="text-center">

        <h1 className="text-2xl font-bold mb-4">
          Payment Successful 🎉
        </h1>

        <p className="text-gray-600 mb-6">
          Activating your access...
        </p>

        <div className="animate-pulse text-gray-400">
          Please wait...
        </div>

        <div className="mt-6">
          <a
            href="/signals"
            className="text-sm underline text-gray-600"
          >
            Go to Signals
          </a>
        </div>

      </div>
    </main>
  )
}
