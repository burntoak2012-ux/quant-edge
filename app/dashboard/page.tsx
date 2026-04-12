import { auth, currentUser } from "@clerk/nextjs/server"
import fs from "fs"
import path from "path"
import Link from "next/link"
import { UserButton } from "@clerk/nextjs"
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
  strength_score?: number
  home_attack?: number
  home_defense?: number
  away_attack?: number
  away_defense?: number
  lineup_adjusted?: boolean
}

function getSignalsPath() {
  return path.join(process.cwd(), "python-engine", "output", "signals.json")
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

function StatCard({
  label,
  value,
  subtext,
}: {
  label: string
  value: string
  subtext: string
}) {
  return (
    <div className="rounded-[28px] border border-zinc-200 bg-white p-5 shadow-sm">
      <p className="text-xs font-semibold uppercase tracking-wide text-zinc-400">
        {label}
      </p>
      <p className="mt-3 text-3xl font-bold tracking-tight text-zinc-950">{value}</p>
      <p className="mt-2 text-sm text-zinc-500">{subtext}</p>
    </div>
  )
}

export default async function DashboardPage({
  searchParams,
}: {
  searchParams?: Promise<{ success?: string }>
}) {
  const params = searchParams ? await searchParams : undefined
  const { userId } = await auth()

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

  const user = await currentUser()
  const isPaidUser = user?.publicMetadata?.isPro === true
  const justPaid = params?.success === "true"

  const signals = getSignals()
  const totalSignals = signals.length

  const avgConfidence =
    totalSignals > 0
      ? Math.round(
          signals.reduce((sum, signal) => sum + (signal.confidence || 0), 0) /
            totalSignals
        )
      : 0

  const avgValue =
    totalSignals > 0
      ? signals.reduce((sum, signal) => sum + (signal.value || 0), 0) / totalSignals
      : 0

  const topConfidence =
    totalSignals > 0 ? Math.max(...signals.map((signal) => signal.confidence || 0)) : 0

  const topSignal =
    totalSignals > 0
      ? [...signals].sort((a, b) => (b.confidence || 0) - (a.confidence || 0))[0]
      : null

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
            <Link href="/signals" className="text-zinc-600 hover:text-zinc-900">
              Signals
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
          <div className="grid gap-8 lg:grid-cols-[1.45fr_0.9fr]">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-zinc-400">
                Premium Dashboard
              </p>

              <h1 className="mt-4 text-5xl font-bold tracking-tight text-zinc-950">
                Model Overview
              </h1>

              <p className="mt-4 max-w-3xl text-lg leading-8 text-zinc-600">
                A quick view of today’s board quality, signal concentration, and
                edge profile.
              </p>

              {justPaid && !isPaidUser ? (
                <div className="mt-6 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm font-medium text-amber-700">
                  Payment received. Your Pro access is being activated. Refresh in a few
                  seconds.
                </div>
              ) : null}

              <div className="mt-6 flex flex-wrap gap-3">
                {isPaidUser ? (
                  <>
                    <span className="rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1.5 text-sm font-medium text-emerald-700">
                      Pro active
                    </span>
                    <span className="rounded-full border border-zinc-200 bg-zinc-50 px-3 py-1.5 text-sm font-medium text-zinc-700">
                      {totalSignals} signals loaded
                    </span>
                  </>
                ) : (
                  <span className="rounded-full border border-amber-200 bg-amber-50 px-3 py-1.5 text-sm font-medium text-amber-700">
                    Free access
                  </span>
                )}
              </div>

              <div className="mt-6">
                {isPaidUser ? (
                  <ManageBillingButton />
                ) : (
                  <Link
                    href="/pricing"
                    className="inline-flex rounded-full bg-black px-5 py-3 text-sm font-semibold text-white"
                  >
                    Upgrade to Pro
                  </Link>
                )}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="rounded-3xl border border-zinc-200 p-5">
                <p className="text-[11px] font-semibold uppercase tracking-wide text-zinc-400">
                  Total Signals
                </p>
                <p className="mt-3 text-3xl font-bold tracking-tight text-zinc-950">
                  {totalSignals}
                </p>
                <p className="mt-1 text-sm text-zinc-500">Current board size</p>
              </div>

              <div className="rounded-3xl border border-zinc-200 p-5">
                <p className="text-[11px] font-semibold uppercase tracking-wide text-zinc-400">
                  Avg Confidence
                </p>
                <p className="mt-3 text-3xl font-bold tracking-tight text-zinc-950">
                  {avgConfidence}%
                </p>
                <p className="mt-1 text-sm text-zinc-500">Average across loaded signals</p>
              </div>

              <div className="rounded-3xl border border-zinc-200 p-5">
                <p className="text-[11px] font-semibold uppercase tracking-wide text-zinc-400">
                  Avg Value
                </p>
                <p className="mt-3 text-3xl font-bold tracking-tight text-zinc-950">
                  {avgValue > 0 ? `+${avgValue.toFixed(2)}` : avgValue.toFixed(2)}
                </p>
                <p className="mt-1 text-sm text-zinc-500">Model edge estimate</p>
              </div>

              <div className="rounded-3xl border border-zinc-200 p-5">
                <p className="text-[11px] font-semibold uppercase tracking-wide text-zinc-400">
                  Top Confidence
                </p>
                <p className="mt-3 text-3xl font-bold tracking-tight text-zinc-950">
                  {topConfidence}%
                </p>
                <p className="mt-1 text-sm text-zinc-500">Strongest signal on board</p>
              </div>
            </div>
          </div>
        </section>

        {isPaidUser ? (
          <>
            {topSignal ? (
              <section className="mt-8 rounded-[32px] border border-zinc-200 bg-white p-8 shadow-sm">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="rounded-full border border-zinc-200 bg-zinc-50 px-3 py-1 text-[11px] font-semibold uppercase tracking-wide text-zinc-600">
                    Top Signal
                  </span>
                  <span className="rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-[11px] font-semibold uppercase tracking-wide text-emerald-700">
                    {topSignal.confidence}% Confidence
                  </span>
                  {topSignal.grade ? (
                    <span className="rounded-full border border-cyan-200 bg-cyan-50 px-3 py-1 text-[11px] font-semibold uppercase tracking-wide text-cyan-700">
                      Grade {topSignal.grade}
                    </span>
                  ) : null}
                </div>

                <div className="mt-5 grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
                  <div>
                    <h2 className="text-3xl font-bold tracking-tight text-zinc-950">
                      {topSignal.match}
                    </h2>
                    <p className="mt-2 text-zinc-500">{topSignal.league}</p>

                    <div className="mt-6">
                      <p className="text-[11px] font-semibold uppercase tracking-wide text-zinc-400">
                        Pick
                      </p>
                      <p className="mt-2 text-2xl font-semibold text-zinc-900">
                        {topSignal.prediction_display ||
                          formatPrediction(topSignal.prediction)}
                      </p>
                    </div>

                    <div className="mt-6">
                      <p className="text-[11px] font-semibold uppercase tracking-wide text-zinc-400">
                        Model Reasoning
                      </p>
                      <p className="mt-2 text-zinc-600">
                        {topSignal.reasoning || "No model reasoning available."}
                      </p>
                    </div>
                  </div>

                  <div className="grid gap-3 sm:grid-cols-3 lg:grid-cols-2">
                    <StatCard
                      label="Value"
                      value={formatValue(topSignal.value)}
                      subtext={topSignal.value_reason || "Lineup edge"}
                    />
                    <StatCard
                      label="Market Gap"
                      value={formatMarketGap(topSignal.market_gap)}
                      subtext={topSignal.gap_label || "Gap estimate"}
                    />
                    <StatCard
                      label="Strength"
                      value={
                        typeof topSignal.strength_score === "number"
                          ? String(topSignal.strength_score)
                          : "N/A"
                      }
                      subtext="Composite model score"
                    />
                    <StatCard
                      label="Lineup"
                      value={topSignal.lineup_adjusted ? "Adjusted" : "Base"}
                      subtext="Model input state"
                    />
                  </div>
                </div>
              </section>
            ) : null}

            <section className="mt-8">
              <div className="mb-4 flex items-center justify-between">
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-zinc-400">
                    Latest Signals
                  </p>
                  <h2 className="mt-2 text-2xl font-bold tracking-tight text-zinc-950">
                    Board Snapshot
                  </h2>
                </div>

                <Link
                  href="/signals"
                  className="rounded-full border border-zinc-200 px-4 py-2 text-sm font-medium text-zinc-700 hover:bg-zinc-50"
                >
                  View all signals
                </Link>
              </div>

              <div className="grid gap-4">
                {signals.slice(0, 3).map((signal) => (
                  <div
                    key={signal.id}
                    className="rounded-[28px] border border-zinc-200 bg-white p-6 shadow-sm"
                  >
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="rounded-full border border-zinc-200 bg-zinc-50 px-3 py-1 text-[11px] font-semibold uppercase tracking-wide text-zinc-600">
                        {signal.league}
                      </span>
                      <span className="rounded-full border border-zinc-200 bg-zinc-50 px-3 py-1 text-[11px] font-semibold uppercase tracking-wide text-zinc-600">
                        {signal.confidence}% Confidence
                      </span>
                      {signal.grade ? (
                        <span className="rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-[11px] font-semibold uppercase tracking-wide text-emerald-700">
                          Grade {signal.grade}
                        </span>
                      ) : null}
                    </div>

                    <div className="mt-4 grid gap-5 lg:grid-cols-[1.2fr_0.8fr]">
                      <div>
                        <h3 className="text-2xl font-semibold text-zinc-950">
                          {signal.match}
                        </h3>
                        <p className="mt-3 text-zinc-700">
                          Pick:{" "}
                          <span className="font-semibold">
                            {signal.prediction_display ||
                              formatPrediction(signal.prediction)}
                          </span>
                        </p>
                        <p className="mt-2 text-sm text-zinc-500">
                          {signal.reasoning || "No model reasoning available."}
                        </p>
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <div className="rounded-3xl border border-zinc-200 p-4">
                          <p className="text-[11px] font-semibold uppercase tracking-wide text-zinc-400">
                            Value
                          </p>
                          <p className="mt-2 text-2xl font-bold text-zinc-950">
                            {formatValue(signal.value)}
                          </p>
                        </div>

                        <div className="rounded-3xl border border-zinc-200 p-4">
                          <p className="text-[11px] font-semibold uppercase tracking-wide text-zinc-400">
                            Gap
                          </p>
                          <p className="mt-2 text-2xl font-bold text-zinc-950">
                            {formatMarketGap(signal.market_gap)}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </>
        ) : (
          <section className="mt-8 rounded-[32px] border border-zinc-200 bg-white p-8 shadow-sm">
            <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-zinc-400">
              Premium Access
            </p>
            <h2 className="mt-3 text-3xl font-bold tracking-tight text-zinc-950">
              Upgrade to unlock full model insights
            </h2>
            <p className="mt-4 max-w-2xl text-zinc-600">
              Get access to premium signals, confidence scoring, value ratings,
              market-gap analysis, and billing management.
            </p>

            <div className="mt-6">
              <Link
                href="/pricing"
                className="inline-flex rounded-full bg-black px-5 py-3 text-sm font-semibold text-white"
              >
                Upgrade to Pro
              </Link>
            </div>
          </section>
        )}
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