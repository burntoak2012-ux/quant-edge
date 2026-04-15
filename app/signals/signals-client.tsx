"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"

type Signal = {
  match?: string
  pick?: string
  prediction_display?: string
  confidence?: number
}

function SignalsSkeleton() {
  return (
    <main className="min-h-screen bg-[#0B1120] text-white px-6 py-12">
      <div className="mx-auto max-w-6xl">
        <div className="mb-8 rounded-3xl border border-white/10 bg-white/5 p-8">
          <div className="h-3 w-28 animate-pulse rounded bg-cyan-400/20" />
          <div className="mt-4 h-10 w-64 animate-pulse rounded bg-white/10" />
          <div className="mt-4 h-5 w-80 animate-pulse rounded bg-white/10" />
          <div className="mt-4 h-8 w-28 animate-pulse rounded-full bg-emerald-500/15" />
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          {[1, 2, 3, 4].map((item) => (
            <div
              key={item}
              className="rounded-2xl border border-white/10 bg-white/5 p-6"
            >
              <div className="h-7 w-40 animate-pulse rounded bg-white/10" />
              <div className="mt-4 h-5 w-24 animate-pulse rounded bg-white/10" />
              <div className="mt-3 h-6 w-32 animate-pulse rounded bg-white/10" />
              <div className="mt-4 h-4 w-28 animate-pulse rounded bg-emerald-400/10" />
            </div>
          ))}
        </div>
      </div>
    </main>
  )
}

export default function SignalsClient() {
  const router = useRouter()
  const [signals, setSignals] = useState<Signal[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    let cancelled = false

    const loadSignals = async () => {
      try {
        const res = await fetch("/api/signals", {
          cache: "no-store",
        })

        if (res.status === 401) {
          router.replace("/sign-in")
          return
        }

        if (res.status === 403) {
          router.replace("/pricing")
          return
        }

        if (!res.ok) {
          throw new Error("Failed to load signals")
        }

        const data = await res.json()
        const parsed = Array.isArray(data) ? data : data.signals ?? []

        if (!cancelled) {
          setSignals(parsed)
        }
      } catch (err) {
        console.error(err)
        if (!cancelled) {
          setError("Could not load signals.")
        }
      } finally {
        if (!cancelled) {
          setLoading(false)
        }
      }
    }

    loadSignals()

    return () => {
      cancelled = true
    }
  }, [router])

  if (loading) {
    return <SignalsSkeleton />
  }

  if (error) {
    return (
      <main className="min-h-screen bg-[#0B1120] text-white px-6 py-12">
        <div className="mx-auto max-w-6xl">
          <div className="rounded-2xl border border-red-500/20 bg-red-500/10 p-6 text-red-300">
            {error}
          </div>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-[#0B1120] text-white px-6 py-12">
      <div className="mx-auto max-w-6xl">
        <div className="mb-8 rounded-3xl border border-white/10 bg-white/5 p-8">
          <p className="text-xs uppercase tracking-[0.25em] text-cyan-400">
            Quant Edge Pro
          </p>
          <h1 className="mt-3 text-4xl font-bold">Today&apos;s Signals</h1>
          <p className="mt-3 text-gray-400">
            Premium football signals unlocked for paid users.
          </p>
          <div className="mt-4 inline-flex rounded-full bg-emerald-500/15 px-3 py-1 text-sm text-emerald-300">
            Pro access active
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          {signals.map((signal, index) => (
            <div
              key={`${signal.match ?? "signal"}-${index}`}
              className="rounded-2xl border border-white/10 bg-white/5 p-6 transition hover:bg-white/[0.07]"
            >
              <h2 className="text-xl font-semibold">
                {signal.match ?? "Match"}
              </h2>

              <p className="mt-3 text-gray-300">
                {signal.prediction_display ||
                  signal.pick ||
                  "Prediction available"}
              </p>

              {typeof signal.confidence === "number" && (
                <p className="mt-2 text-sm text-emerald-400">
                  Confidence: {signal.confidence}%
                </p>
              )}
            </div>
          ))}
        </div>

        {signals.length === 0 && (
          <div className="mt-6 rounded-2xl border border-white/10 bg-white/5 p-6 text-gray-300">
            No signals available yet.
          </div>
        )}
      </div>
    </main>
  )
}
