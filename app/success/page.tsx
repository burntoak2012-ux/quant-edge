"use client"

import { useEffect, useState } from "react"
import Link from "next/link"

export default function SuccessPage() {
  const [done, setDone] = useState(false)

  useEffect(() => {
    async function activate() {
      try {
        await fetch("/api/activate-user", { method: "POST" })
      } catch (err) {
        console.error(err)
      } finally {
        setDone(true)
      }
    }

    activate()
  }, [])

  return (
    <main className="min-h-screen bg-white text-black">
      <div className="max-w-3xl mx-auto px-6 py-24 text-center">
        <h1 className="text-3xl font-bold mb-4">Payment Successful 🎉</h1>
        <p className="text-gray-600 mb-6">
          {done ? "Access activated." : "Activating your access..."}
        </p>

        <Link
          href="/signals"
          className="inline-block px-6 py-3 bg-black text-white rounded-lg"
        >
          Go to Signals
        </Link>
      </div>
    </main>
  )
}
