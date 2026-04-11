export const dynamic = "force-dynamic"
export const revalidate = 0

import { auth } from "@clerk/nextjs/server"
import { redirect } from "next/navigation"
import fs from "fs"
import path from "path"
import Link from "next/link"
import { UserButton } from "@clerk/nextjs"

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
  strength_score?: number
  home_attack?: number
  home_defense?: number
  away_attack?: number
  away_defense?: number
  lineup_adjusted?: boolean
}

function getPaidUsersPath() {
  return path.join(process.cwd(), "python-engine", "data", "paid_users.json")
}

function getSignalsPath() {
  return path.join(process.cwd(), "python-engine", "output", "signals.json")
}

function getPaidUsers(): string[] {
  try {
    const filePath = getPaidUsersPath()

    if (!fs.existsSync(filePath)) {
      return []
    }

    return JSON.parse(fs.readFileSync(filePath, "utf-8"))
  } catch {
    return []
  }
}

function getSignals(): Signal[] {
  try {
    const filePath = getSignalsPath()

    if (!fs.existsSync(filePath)) {
      return []
    }

    return JSON.parse(fs.readFileSync(filePath, "utf-8"))
  } catch {
    return []
  }
}

function formatPrediction(prediction?: string) {
  if (!prediction) return "N/A"

  return prediction
    .replace(/_/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase())
}

function formatValue(value?: number) {
  if (typeof value !== "number") return "N/A"
  return value > 0 ? `+${value.toFixed(2)}` : value.toFixed(2)
}

function formatMarketGap(value?: number) {
  if (typeof value !== "number") return "N/A"
  const pct = value * 100
  return pct > 0 ? `+${pct.toFixed(0)}%` : `${pct.toFixed(0)}%`
}

export default async function SignalsPage() {
  const { userId } = await auth()

  if (!userId) {
    redirect("/sign-in")
  }

  const paidUsers = getPaidUsers()
  const isPaidUser = paidUsers.includes(userId)

  if (!isPaidUser) {
    redirect("/pricing")
  }

  const signals = getSignals()
  const topConfidence =
    signals.length > 0 ? Math.max(...signals.map((s) => s.confidence || 0)) : 0

  return (
    <div className="min-h-screen bg-white text-zinc-950">
      <header className="border-b border-zinc-200 bg-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-5">
          <Link href="/" className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-black text-sm font-bold text-white">
              Q
            </div>
            <span className="text-lg font-semibold text-zinc-900">QuantEdge</span>
          </Link>

          <div className="flex items-center gap-6 text-sm">
            <Link href="/pricing" className="text-zinc-600 hover:text-zinc-900">
              Pricing
            </Link>

            <Link
              href="/dashboard"
              className="rounded-full bg-black px-4 py-2 font-medium text-white"
            >
              Dashboard
            </Link>

            <UserButton />
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-6 py-10">
        <section className="rounded-[32px] border border-zinc-200 bg-white p-8 shadow-sm">
          <div className="grid gap-8 lg:grid-cols-[1.6fr_0.9fr]">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-zinc-400">
                Quant Edge Pro
              </p>

              <h1 className="mt-4 text-5xl font-bold tracking-tight text-zinc-950">
                Today’s Signals
              </h1>

              <p className="mt-4 max-w-3xl text-lg leading-8 text-zinc-600">
                Premium football signals built from team strength, matchup
                structure, lineup changes, and model edge.
              </p>

              <div className="mt-6 flex flex-wrap gap-3">
                <span className="rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1.5 text-sm font-medium text-emerald-700">
                  Pro access active
                </span>

                <span className="rounded-full border border-zinc-200 bg-zinc-50 px-3 py-1.5 text-sm font-medium text-zinc-700">
                  {signals.length} signals loaded
                </span>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div className="rounded-3xl border border-zinc-200 p-5">
                <p className="text-[11px] font-semibold uppercase tracking-wide text-zinc-400">
                  Signals
                </p>
                <p className="mt-3 text-3xl font-bold tracking-tight text-zinc-950">
                  {signals.length}
                </p>
              </div>

              <div className="rounded-3xl border border-zinc-200 p-5">
                <p className="text-[11px] font-semibold uppercase tracking-wide text-zinc-400">
                  Top Confidence
                </p>
                <p className="mt-3 text-3xl font-bold tracking-tight text-zinc-950">
                  {topConfidence}%
                </p>
              </div>

              <div className="rounded-3xl border border-zinc-200 p-5">
                <p className="text-[11px] font-semibold uppercase tracking-wide text-zinc-400">
                  Access
                </p>
                <p className="mt-3 text-3xl font-bold tracking-tight text-zinc-950">
                  Pro
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="mt-8 space-y-6">
          {signals.length === 0 ? (
            <div className="rounded-[28px] border border-zinc-200 bg-white p-8 shadow-sm">
              <h2 className="text-2xl font-semibold text-zinc-900">
                No signals loaded
              </h2>
              <p className="mt-3 text-zinc-600">
                Your signals file is empty or missing. Run your Python pipeline,
                then refresh this page.
              </p>
            </div>
          ) : (
            signals.map((signal) => (
              <article
                key={signal.id}
                className="rounded-[28px] border border-zinc-200 bg-white p-6 shadow-sm"
              >
                <div className="grid gap-6 lg:grid-cols-[1.35fr_0.65fr]">
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="rounded-full border border-zinc-200 bg-zinc-50 px-3 py-1 text-[11px] font-semibold uppercase tracking-wide text-zinc-600">
                        {signal.league}
                      </span>

                      {signal.grade ? (
                        <span className="rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-[11px] font-semibold uppercase tracking-wide text-emerald-700">
                          Grade {signal.grade}
                        </span>
                      ) : null}

                      <span className="rounded-full border border-zinc-200 bg-zinc-50 px-3 py-1 text-[11px] font-semibold uppercase tracking-wide text-zinc-600">
                        {signal.confidence}% Confidence
                      </span>
                    </div>

                    <h2 className="mt-4 text-3xl font-bold tracking-tight text-zinc-950">
                      {signal.match}
                    </h2>

                    {signal.kickoff ? (
                      <p className="mt-2 text-sm text-zinc-500">{signal.kickoff}</p>
                    ) : null}

                    <div className="mt-6">
                      <p className="text-[11px] font-semibold uppercase tracking-wide text-zinc-400">
                        Pick
                      </p>
                      <p className="mt-2 text-2xl font-semibold text-zinc-900">
                        {signal.prediction_display ||
                          formatPrediction(signal.prediction)}
                      </p>
                    </div>

                    <div className="mt-6">
                      <p className="text-[11px] font-semibold uppercase tracking-wide text-zinc-400">
                        Why the model likes it
                      </p>
                      <p className="mt-2 text-zinc-600">
                        {signal.reasoning || "No model reasoning available yet."}
                      </p>
                    </div>
                  </div>

                  <div className="grid gap-3 sm:grid-cols-3 lg:grid-cols-2">
                    <div className="rounded-3xl border border-zinc-200 p-4">
                      <p className="text-[11px] font-semibold uppercase tracking-wide text-zinc-400">
                        Value
                      </p>
                      <p className="mt-3 text-3xl font-bold tracking-tight text-zinc-950">
                        {formatValue(signal.value)}
                      </p>
                      <p className="mt-1 text-sm text-zinc-500">
                        {signal.value_reason || "Model edge"}
                      </p>
                    </div>

                    <div className="rounded-3xl border border-zinc-200 p-4">
                      <p className="text-[11px] font-semibold uppercase tracking-wide text-zinc-400">
                        Market Gap
                      </p>
                      <p className="mt-3 text-3xl font-bold tracking-tight text-zinc-950">
                        {formatMarketGap(signal.market_gap)}
                      </p>
                      <p className="mt-1 text-sm text-zinc-500">
                        {signal.gap_label || "Gap estimate"}
                      </p>
                    </div>

                    <div className="rounded-3xl border border-zinc-200 p-4 sm:col-span-3 lg:col-span-2">
                      <p className="text-[11px] font-semibold uppercase tracking-wide text-zinc-400">
                        Model Read
                      </p>
                      <div className="mt-3 grid grid-cols-2 gap-3 text-sm text-zinc-600">
                        <div>
                          <span className="block text-zinc-400">Home Attack</span>
                          <span className="font-medium text-zinc-900">
                            {signal.home_attack ?? "N/A"}
                          </span>
                        </div>
                        <div>
                          <span className="block text-zinc-400">Away Defense</span>
                          <span className="font-medium text-zinc-900">
                            {signal.away_defense ?? "N/A"}
                          </span>
                        </div>
                        <div>
                          <span className="block text-zinc-400">Strength Score</span>
                          <span className="font-medium text-zinc-900">
                            {signal.strength_score ?? "N/A"}
                          </span>
                        </div>
                        <div>
                          <span className="block text-zinc-400">Lineup Adjusted</span>
                          <span className="font-medium text-zinc-900">
                            {signal.lineup_adjusted ? "Yes" : "No"}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </article>
            ))
          )}
        </section>
      </main>

      <footer className="border-t border-zinc-200 bg-white">
        <div className="mx-auto flex max-w-6xl flex-col gap-4 px-6 py-6 text-sm text-zinc-500 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-black text-xs font-bold text-white">
              Q
            </div>
            <span className="font-medium text-zinc-700">QuantEdge</span>
          </div>

          <div className="flex flex-wrap gap-4">
            <Link href="/signals" className="hover:text-zinc-900">
              Signals
            </Link>
            <Link href="/pricing" className="hover:text-zinc-900">
              Pricing
            </Link>
            <Link href="/terms" className="hover:text-zinc-900">
              Terms
            </Link>
            <Link href="/privacy" className="hover:text-zinc-900">
              Privacy
            </Link>
            <Link href="/disclaimer" className="hover:text-zinc-900">
              Disclaimer
            </Link>
          </div>
        </div>
      </footer>
    </div>
  )
}
