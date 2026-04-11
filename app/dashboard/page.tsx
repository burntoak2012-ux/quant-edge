import { auth } from "@clerk/nextjs/server"
import fs from "fs"
import path from "path"
import Link from "next/link"
import ManageBillingButton from "../components/manage-billing-button"

type Signal = {
  id: number
  match: string
  league: string
  prediction: string
  prediction_display?: string
  confidence: number
  kickoff?: string
  reasoning?: string
  grade?: string
  value_reason?: string
  gap_label?: string
  market_gap?: number
  value?: number
  matchup_bias?: string
  strength_label?: string
}

function readJsonFile<T>(filePath: string, fallback: T): T {
  try {
    const raw = fs.readFileSync(filePath, "utf-8")
    return JSON.parse(raw) as T
  } catch {
    return fallback
  }
}

function formatPrediction(signal: Signal) {
  if (signal.prediction_display) return signal.prediction_display

  const map: Record<string, string> = {
    home_win: "Home Win",
    away_win: "Away Win",
    over_2_5: "Over 2.5 Goals",
    btts_yes: "Both Teams To Score",
  }

  return map[signal.prediction] || signal.prediction.replaceAll("_", " ")
}

function average(nums: number[]) {
  if (nums.length === 0) return 0
  return nums.reduce((a, b) => a + b, 0) / nums.length
}

function StatCard({
  label,
  value,
  subtext,
}: {
  label: string
  value: string
  subtext?: string
}) {
  return (
    <div className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm">
      <p className="text-xs font-semibold uppercase tracking-wide text-zinc-400">
        {label}
      </p>
      <p className="mt-3 text-3xl font-bold tracking-tight text-zinc-950">{value}</p>
      {subtext && <p className="mt-2 text-sm text-zinc-500">{subtext}</p>}
    </div>
  )
}

export default async function DashboardPage() {
  const { userId } = await auth()

  console.log("USER ID:", userId)

  if (!userId) {
    return (
      <div className="min-h-screen bg-white">
        <div className="mx-auto flex min-h-screen max-w-6xl items-center justify-center px-6">
          <div className="w-full max-w-md rounded-3xl border border-zinc-200 bg-white p-8 text-center shadow-sm">
            <h1 className="text-2xl font-bold text-zinc-950">Please sign in</h1>
            <p className="mt-3 text-zinc-500">
              You need an account to access the dashboard.
            </p>
            <a
              href="/sign-in"
              className="mt-6 inline-flex rounded-2xl bg-black px-5 py-3 font-semibold text-white"
            >
              Sign in
            </a>
          </div>
        </div>
      </div>
    )
  }

  const signalsPath = path.join(process.cwd(), "python-engine", "output", "signals.json")
  const paidUsersPath = path.join(process.cwd(), "python-engine", "data", "paid_users.json")

  const signals = readJsonFile<Signal[]>(signalsPath, [])
  const paidUsers = readJsonFile<string[]>(paidUsersPath, [])

  const isPaidUser = paidUsers.includes(userId)

  if (!isPaidUser) {
    return (
      <div className="min-h-screen bg-zinc-50">
        <div className="border-b border-zinc-200 bg-white">
          <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
            <Link href="/" className="flex items-center gap-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-black text-sm font-bold text-white">
                Q
              </div>
              <span className="text-lg font-semibold text-zinc-900">QuantEdge</span>
            </Link>

            <div className="flex items-center gap-6 text-sm">
              <Link href="/signals" className="text-zinc-600 hover:text-zinc-900">
                Signals
              </Link>
              <Link
                href="/pricing"
                className="rounded-full bg-black px-4 py-2 font-medium text-white"
              >
                Upgrade
              </Link>
            </div>
          </div>
        </div>

        <main className="mx-auto max-w-6xl px-6 py-10">
          <div className="rounded-[32px] border border-zinc-200 bg-white p-8 shadow-sm">
            <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-zinc-400">
              Dashboard
            </p>
            <h1 className="mt-4 text-4xl font-bold tracking-tight text-zinc-950">
              Premium Dashboard
            </h1>
            <p className="mt-4 max-w-2xl text-lg leading-8 text-zinc-600">
              Unlock premium performance stats, signal overview, and model summaries.
            </p>

            <Link
              href="/pricing"
              className="mt-6 inline-flex rounded-2xl bg-black px-5 py-3 font-semibold text-white"
            >
              Upgrade to Pro
            </Link>
          </div>
        </main>
      </div>
    )
  }

  const totalSignals = signals.length
  const avgConfidence = average(signals.map((s) => s.confidence))
  const avgValue = average(signals.map((s) => s.value ?? 0))
  const topConfidence = totalSignals > 0 ? Math.max(...signals.map((s) => s.confidence)) : 0
  const highConfidenceSignals = signals.filter((s) => s.confidence >= 65).length
  const bigGapSignals = signals.filter((s) => (s.market_gap ?? 0) >= 0.1).length

  const leagueCounts = signals.reduce<Record<string, number>>((acc, signal) => {
    acc[signal.league] = (acc[signal.league] || 0) + 1
    return acc
  }, {})

  const predictionCounts = signals.reduce<Record<string, number>>((acc, signal) => {
    const key = formatPrediction(signal)
    acc[key] = (acc[key] || 0) + 1
    return acc
  }, {})

  const strongestSignals = [...signals]
    .sort((a, b) => {
      const aScore = (a.confidence || 0) + ((a.value || 0) * 100)
      const bScore = (b.confidence || 0) + ((b.value || 0) * 100)
      return bScore - aScore
    })
    .slice(0, 3)

  return (
    <div className="min-h-screen bg-zinc-50">
      <div className="border-b border-zinc-200 bg-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <Link href="/" className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-black text-sm font-bold text-white">
              Q
            </div>
            <span className="text-lg font-semibold text-zinc-900">QuantEdge</span>
          </Link>

          <div className="flex items-center gap-6 text-sm">
            <Link href="/signals" className="text-zinc-600 hover:text-zinc-900">
              Signals
            </Link>
            <Link
              href="/dashboard"
              className="rounded-full bg-black px-4 py-2 font-medium text-white"
            >
              Dashboard
            </Link>
          </div>
        </div>
      </div>

      <main className="mx-auto max-w-6xl px-6 py-10">
        <section className="rounded-[32px] border border-zinc-200 bg-white p-8 shadow-sm">
          <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-zinc-400">
            Premium Dashboard
          </p>
          <h1 className="mt-4 text-5xl font-bold tracking-tight text-zinc-950">
  Model Overview
</h1>

<p className="mt-2 text-sm text-red-500">User ID: {userId}</p>

<div className="mt-4">
  <ManageBillingButton />
</div>
          <p className="mt-4 max-w-3xl text-lg leading-8 text-zinc-600">
            A quick view of today’s board quality, signal concentration, and edge profile.
          </p>

          <div className="mt-6 flex flex-wrap gap-3">
            <span className="rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1.5 text-sm font-medium text-emerald-700">
              Pro active
            </span>
            <span className="rounded-full border border-zinc-200 bg-zinc-50 px-3 py-1.5 text-sm font-medium text-zinc-700">
              {totalSignals} signals loaded
            </span>
          </div>
          <div className="mt-6">
  <ManageBillingButton />
</div>
        </section>

        <section className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <StatCard
            label="Total Signals"
            value={String(totalSignals)}
            subtext="Current board size"
          />
          <StatCard
            label="Avg Confidence"
            value={`${avgConfidence.toFixed(0)}%`}
            subtext="Average across loaded signals"
          />
          <StatCard
            label="Avg Value"
            value={avgValue >= 0 ? `+${avgValue.toFixed(2)}` : avgValue.toFixed(2)}
            subtext="Model edge estimate"
          />
          <StatCard
            label="Top Confidence"
            value={topConfidence ? `${topConfidence}%` : "—"}
            subtext="Strongest signal on board"
          />
        </section>

        <section className="mt-4 grid gap-4 md:grid-cols-3">
          <StatCard
            label="High Confidence"
            value={String(highConfidenceSignals)}
            subtext="Signals at 65%+ confidence"
          />
          <StatCard
            label="Big Gaps"
            value={String(bigGapSignals)}
            subtext="Signals with market gap of 10%+"
          />
          <StatCard
            label="Pro Status"
            value="Active"
            subtext="Premium access is enabled"
          />
        </section>

        <section className="mt-10 grid gap-6 lg:grid-cols-2">
          <div className="rounded-3xl border border-zinc-200 bg-white p-6 shadow-sm">
            <h2 className="text-2xl font-bold tracking-tight text-zinc-950">
              League Distribution
            </h2>

            <div className="mt-6 space-y-4">
              {Object.keys(leagueCounts).length === 0 ? (
                <p className="text-sm text-zinc-500">No signals available.</p>
              ) : (
                Object.entries(leagueCounts).map(([league, count]) => (
                  <div key={league}>
                    <div className="mb-2 flex items-center justify-between text-sm">
                      <span className="font-medium text-zinc-700">{league}</span>
                      <span className="text-zinc-500">{count}</span>
                    </div>
                    <div className="h-2 rounded-full bg-zinc-100">
                      <div
                        className="h-2 rounded-full bg-black"
                        style={{
                          width: `${(count / totalSignals) * 100}%`,
                        }}
                      />
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="rounded-3xl border border-zinc-200 bg-white p-6 shadow-sm">
            <h2 className="text-2xl font-bold tracking-tight text-zinc-950">
              Market Mix
            </h2>

            <div className="mt-6 space-y-4">
              {Object.keys(predictionCounts).length === 0 ? (
                <p className="text-sm text-zinc-500">No signals available.</p>
              ) : (
                Object.entries(predictionCounts).map(([prediction, count]) => (
                  <div key={prediction}>
                    <div className="mb-2 flex items-center justify-between text-sm">
                      <span className="font-medium text-zinc-700">{prediction}</span>
                      <span className="text-zinc-500">{count}</span>
                    </div>
                    <div className="h-2 rounded-full bg-zinc-100">
                      <div
                        className="h-2 rounded-full bg-black"
                        style={{
                          width: `${(count / totalSignals) * 100}%`,
                        }}
                      />
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </section>

        <section className="mt-10 rounded-3xl border border-zinc-200 bg-white p-6 shadow-sm">
          <h2 className="text-2xl font-bold tracking-tight text-zinc-950">
            Strongest Signals
          </h2>

          <div className="mt-6 grid gap-4 lg:grid-cols-3">
            {strongestSignals.length === 0 ? (
              <p className="text-sm text-zinc-500">No signals available.</p>
            ) : (
              strongestSignals.map((signal) => (
                <div
                  key={signal.id}
                  className="rounded-2xl border border-zinc-200 bg-zinc-50 p-5"
                >
                  <p className="text-xs font-semibold uppercase tracking-wide text-zinc-400">
                    {signal.league}
                  </p>
                  <h3 className="mt-2 text-lg font-bold text-zinc-950">{signal.match}</h3>
                  <p className="mt-2 text-sm font-medium text-zinc-700">
                    {formatPrediction(signal)}
                  </p>

                  <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
                    <div>
                      <p className="text-zinc-400">Confidence</p>
                      <p className="font-semibold text-zinc-900">{signal.confidence}%</p>
                    </div>
                    <div>
                      <p className="text-zinc-400">Value</p>
                      <p className="font-semibold text-zinc-900">
                        {typeof signal.value === "number"
                          ? `${signal.value > 0 ? "+" : ""}${signal.value.toFixed(2)}`
                          : "—"}
                      </p>
                    </div>
                  </div>

                  {signal.reasoning && (
                    <p className="mt-4 text-sm leading-7 text-zinc-600">
                      {signal.reasoning}
                    </p>
                  )}
                </div>
              ))
            )}
          </div>
        </section>
      </main>
    </div>
  )
}
