import { auth } from "@clerk/nextjs/server"
import fs from "fs"
import path from "path"
import Link from "next/link"

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

function formatKickoff(value?: string) {
  if (!value) return "Kickoff TBC"

  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return value

  return date.toLocaleString("en-GB", {
    day: "2-digit",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  })
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

function confidenceStyles(confidence: number) {
  if (confidence >= 65) {
    return "border-emerald-200 bg-emerald-50 text-emerald-700"
  }
  if (confidence >= 55) {
    return "border-amber-200 bg-amber-50 text-amber-700"
  }
  return "border-zinc-200 bg-zinc-50 text-zinc-700"
}

function gradeStyles(grade?: string) {
  if (grade === "A") return "border-emerald-200 bg-emerald-50 text-emerald-700"
  if (grade === "B") return "border-amber-200 bg-amber-50 text-amber-700"
  return "border-zinc-200 bg-zinc-50 text-zinc-700"
}

function valueText(value?: number) {
  if (typeof value !== "number") return "—"
  return `${value > 0 ? "+" : ""}${value.toFixed(2)}`
}

function gapText(marketGap?: number) {
  if (typeof marketGap !== "number") return "—"
  return `${marketGap > 0 ? "+" : ""}${(marketGap * 100).toFixed(0)}%`
}

function SignalCard({ signal }: { signal: Signal }) {
  return (
    <div className="rounded-3xl border border-zinc-200 bg-white p-6 shadow-sm">
      <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <span className="rounded-full border border-zinc-200 bg-zinc-50 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-zinc-600">
              {signal.league}
            </span>

            {signal.grade && (
              <span
                className={`rounded-full border px-3 py-1 text-xs font-semibold uppercase tracking-wide ${gradeStyles(signal.grade)}`}
              >
                Grade {signal.grade}
              </span>
            )}

            <span
              className={`rounded-full border px-3 py-1 text-xs font-semibold uppercase tracking-wide ${confidenceStyles(
                signal.confidence
              )}`}
            >
              {signal.confidence}% confidence
            </span>
          </div>

          <h2 className="mt-4 text-2xl font-bold tracking-tight text-zinc-950">
            {signal.match}
          </h2>

          <p className="mt-1 text-sm text-zinc-500">{formatKickoff(signal.kickoff)}</p>

          <div className="mt-5">
            <p className="text-xs font-semibold uppercase tracking-wide text-zinc-400">
              Pick
            </p>
            <p className="mt-1 text-lg font-semibold text-zinc-900">
              {formatPrediction(signal)}
            </p>
          </div>

          {signal.reasoning && (
            <div className="mt-5">
              <p className="text-xs font-semibold uppercase tracking-wide text-zinc-400">
                Why the model likes it
              </p>
              <p className="mt-2 max-w-3xl text-sm leading-7 text-zinc-600">
                {signal.reasoning}
              </p>
            </div>
          )}
        </div>

        <div className="grid w-full grid-cols-2 gap-3 lg:w-72">
          <div className="rounded-2xl border border-zinc-200 bg-zinc-50 p-4">
            <p className="text-xs font-semibold uppercase tracking-wide text-zinc-400">
              Value
            </p>
            <p className="mt-2 text-xl font-bold text-zinc-900">{valueText(signal.value)}</p>
            {signal.value_reason && (
              <p className="mt-1 text-xs text-zinc-500">{signal.value_reason}</p>
            )}
          </div>

          <div className="rounded-2xl border border-zinc-200 bg-zinc-50 p-4">
            <p className="text-xs font-semibold uppercase tracking-wide text-zinc-400">
              Market Gap
            </p>
            <p className="mt-2 text-xl font-bold text-zinc-900">{gapText(signal.market_gap)}</p>
            {signal.gap_label && <p className="mt-1 text-xs text-zinc-500">{signal.gap_label}</p>}
          </div>

          <div className="rounded-2xl border border-zinc-200 bg-zinc-50 p-4 col-span-2">
            <p className="text-xs font-semibold uppercase tracking-wide text-zinc-400">
              Model read
            </p>
            <p className="mt-2 text-sm font-medium text-zinc-900">
              {signal.matchup_bias || signal.strength_label || "Structured edge detected"}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default async function SignalsPage({
  searchParams,
}: {
  searchParams: Promise<{ success?: string }>
}) {
  const params = await searchParams
  const { userId } = await auth()

  if (!userId) {
    return (
      <div className="min-h-screen bg-white">
        <div className="border-b border-zinc-200">
          <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
            <Link href="/" className="flex items-center gap-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-black text-sm font-bold text-white">
                Q
              </div>
              <span className="text-lg font-semibold text-zinc-900">QuantEdge</span>
            </Link>
          </div>
        </div>

        <div className="mx-auto flex min-h-[80vh] max-w-6xl items-center justify-center px-6">
          <div className="w-full max-w-md rounded-3xl border border-zinc-200 bg-white p-8 text-center shadow-sm">
            <h1 className="text-2xl font-bold text-zinc-950">Please sign in</h1>
            <p className="mt-3 text-zinc-500">
              You need an account to access QuantEdge signals.
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
  const justPaid = params.success === "true"
  const hasAccess = isPaidUser || justPaid

  if (!hasAccess) {
    return (
      <div className="min-h-screen bg-white">
        <div className="border-b border-zinc-200">
          <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
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
            </div>
          </div>
        </div>

        <main className="mx-auto max-w-6xl px-6 py-10">
          <section className="rounded-[32px] border border-zinc-200 bg-white p-8 shadow-sm">
            <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-zinc-400">
              Quant Edge
            </p>
            <h1 className="mt-4 text-5xl font-bold tracking-tight text-zinc-950">
              Premium Signals
            </h1>
            <p className="mt-4 max-w-3xl text-lg leading-8 text-zinc-600">
              Unlock all model-selected football signals, including stronger edges,
              market gaps, and full premium access.
            </p>
          </section>

          <section className="mt-10 overflow-hidden rounded-3xl border border-zinc-200 bg-white shadow-sm">
            <div className="grid gap-6 p-8 md:grid-cols-[1.4fr_1fr]">
              <div className="space-y-4 opacity-35 blur-[2px]">
                {signals.slice(0, 2).map((signal) => (
                  <SignalCard key={signal.id} signal={signal} />
                ))}

                {signals.length === 0 && (
                  <div className="rounded-3xl border border-zinc-200 bg-zinc-50 p-8">
                    <div className="h-6 w-48 rounded bg-zinc-200" />
                    <div className="mt-3 h-4 w-28 rounded bg-zinc-200" />
                    <div className="mt-6 h-20 rounded bg-zinc-200" />
                  </div>
                )}
              </div>

              <div className="flex items-center justify-center">
                <div className="w-full rounded-[28px] bg-black p-8 text-center text-white shadow-2xl">
                  <div className="mx-auto mb-4 inline-flex rounded-full bg-white px-4 py-1.5 text-sm font-semibold text-black">
                    Pro Only
                  </div>

                  <h2 className="text-3xl font-bold tracking-tight">
                    Upgrade to Pro
                  </h2>

                  <p className="mt-3 text-zinc-300">
                    Unlock all signals and advanced analytics.
                  </p>

                  <div className="mt-6 space-y-2 text-sm text-zinc-300">
                    <p>• Full premium board</p>
                    <p>• Confidence and value analysis</p>
                    <p>• Stronger daily model picks</p>
                  </div>

                  <Link
                    href="/pricing"
                    className="mt-6 inline-flex rounded-2xl bg-white px-5 py-3 font-semibold text-black transition hover:bg-zinc-100"
                  >
                    Upgrade (£19/month)
                  </Link>
                </div>
              </div>
            </div>
          </section>
        </main>
      </div>
    )
  }

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
            <Link href="/pricing" className="text-zinc-600 hover:text-zinc-900">
              Pricing
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
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-zinc-400">
                Quant Edge Pro
              </p>
              <h1 className="mt-4 text-5xl font-bold tracking-tight text-zinc-950">
                Today’s Signals
              </h1>
              <p className="mt-4 max-w-3xl text-lg leading-8 text-zinc-600">
                Premium football signals built from team strength, matchup structure,
                lineup changes, and model edge.
              </p>

              <div className="mt-5 flex flex-wrap gap-3">
                <span className="rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1.5 text-sm font-medium text-emerald-700">
                  Pro access active
                </span>

                {justPaid && (
                  <span className="rounded-full border border-sky-200 bg-sky-50 px-3 py-1.5 text-sm font-medium text-sky-700">
                    Payment successful
                  </span>
                )}

                <span className="rounded-full border border-zinc-200 bg-zinc-50 px-3 py-1.5 text-sm font-medium text-zinc-700">
                  {signals.length} signals loaded
                </span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
              <div className="rounded-2xl border border-zinc-200 bg-zinc-50 p-4">
                <p className="text-xs font-semibold uppercase tracking-wide text-zinc-400">
                  Signals
                </p>
                <p className="mt-2 text-2xl font-bold text-zinc-900">{signals.length}</p>
              </div>

              <div className="rounded-2xl border border-zinc-200 bg-zinc-50 p-4">
                <p className="text-xs font-semibold uppercase tracking-wide text-zinc-400">
                  Top Confidence
                </p>
                <p className="mt-2 text-2xl font-bold text-zinc-900">
                  {signals.length > 0 ? `${Math.max(...signals.map((s) => s.confidence))}%` : "—"}
                </p>
              </div>

              <div className="rounded-2xl border border-zinc-200 bg-zinc-50 p-4 col-span-2 sm:col-span-1">
                <p className="text-xs font-semibold uppercase tracking-wide text-zinc-400">
                  Access
                </p>
                <p className="mt-2 text-2xl font-bold text-zinc-900">Pro</p>
              </div>
            </div>
          </div>
        </section>

        <section className="mt-10 space-y-5">
          {signals.length === 0 ? (
            <div className="rounded-3xl border border-zinc-200 bg-white p-8 text-center shadow-sm">
              <h2 className="text-2xl font-bold text-zinc-950">No signals available</h2>
              <p className="mt-2 text-zinc-500">
                Run the generator and refresh this page.
              </p>
            </div>
          ) : (
            signals.map((signal) => <SignalCard key={signal.id} signal={signal} />)
          )}
        </section>
      </main>
    </div>
  )
}
