import Link from "next/link"
import fs from "fs"
import path from "path"
import { notFound } from "next/navigation"

type Signal = {
  id: number
  home_team?: string
  away_team?: string
  match: string
  league: string
  prediction: string
  confidence: number
  confidence_reason?: string
  matchup_bias?: string
  odds: number
  implied_probability: number
  model_probability: number
  value: number
  market_gap?: number
  gap_label?: string
  kickoff: string
  home_attack?: number
  home_defense?: number
  away_attack?: number
  away_defense?: number
  reasoning: string
  lineup_adjusted?: boolean
  strength_score?: number
  strength_label?: string
  grade?: string
  value_reason?: string
  home_lineup_reason?: string
  away_lineup_reason?: string
}

export default async function SignalDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params

  const filePath = path.join(process.cwd(), "python-engine/output/signals.json")
  const data = fs.readFileSync(filePath, "utf-8")
  const signals: Signal[] = JSON.parse(data)

  const signal = signals.find((s) => String(s.id) === id)

  if (!signal) {
    notFound()
  }

  const isPro = false

  const homeAttack = signal.home_attack ?? 0
  const homeDefense = signal.home_defense ?? 0
  const awayAttack = signal.away_attack ?? 0
  const awayDefense = signal.away_defense ?? 0

  const strengthDiff = homeAttack - awayDefense
  const total = homeAttack + awayDefense || 1
  const homeAttackWidth = (homeAttack / total) * 100
  const awayDefenseWidth = (awayDefense / total) * 100

  const thinEdge = signal.confidence >= 55 && signal.value < 0.05

  return (
    <div className="mx-auto max-w-5xl px-6 py-12">
      <Link
        href="/signals"
        className="text-sm text-gray-500 transition hover:text-gray-900"
      >
        ← Back to Signals
      </Link>

      <div className="mt-8 rounded-[32px] border border-gray-200 bg-white p-8 shadow-sm">
        <div className="flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-gray-400">
              Live Signal
            </p>

            <h1 className="mt-3 text-4xl font-bold tracking-tight text-gray-900">
              {signal.home_team && signal.away_team
                ? `${signal.home_team} vs ${signal.away_team}`
                : signal.match}
            </h1>

            <p className="mt-2 text-lg text-gray-500">{signal.league}</p>

            <div className="mt-4 flex flex-wrap items-center gap-3">
              {signal.grade && (
                <span
                  className={`rounded-full px-3 py-1 text-sm font-bold ${
                    signal.grade === "A"
                      ? "bg-emerald-600 text-white"
                      : signal.grade === "B"
                      ? "bg-amber-500 text-white"
                      : "bg-gray-400 text-white"
                  }`}
                >
                  {signal.grade}
                </span>
              )}

              {signal.strength_label && signal.strength_score !== undefined && (
                <span
                  className={`rounded-full px-3 py-1 text-sm font-semibold ${
                    signal.strength_label === "Elite"
                      ? "border border-violet-200 bg-violet-50 text-violet-700"
                      : signal.strength_label === "Strong"
                      ? "border border-amber-200 bg-amber-50 text-amber-700"
                      : signal.strength_label === "Medium"
                      ? "border border-slate-200 bg-slate-50 text-slate-700"
                      : "border border-rose-200 bg-rose-50 text-rose-700"
                  }`}
                >
                  {signal.strength_label} · {signal.strength_score}
                </span>
              )}

              {signal.value_reason && (
                <span className="rounded-full border border-indigo-200 bg-indigo-50 px-3 py-1 text-sm font-semibold text-indigo-700">
                  {signal.value_reason}
                </span>
              )}

              {signal.matchup_bias && (
                <span className="rounded-full border border-gray-200 bg-gray-50 px-3 py-1 text-sm text-gray-700">
                  {signal.matchup_bias}
                </span>
              )}

              {signal.gap_label && signal.market_gap !== undefined && (
                <span className="rounded-full border border-cyan-200 bg-cyan-50 px-3 py-1 text-sm font-semibold text-cyan-700">
                  {signal.gap_label} · {signal.market_gap > 0 ? "+" : ""}
                  {signal.market_gap}%
                </span>
              )}

              {signal.lineup_adjusted && (
                <span className="rounded-full border border-violet-200 bg-violet-50 px-3 py-1 text-sm font-semibold text-violet-700">
                  Lineup adjusted
                </span>
              )}

              {thinEdge && (
                <span className="rounded-full border border-rose-200 bg-rose-50 px-3 py-1 text-sm font-semibold text-rose-700">
                  Thin edge
                </span>
              )}
            </div>

            {signal.confidence_reason && (
              <p className="mt-4 text-sm text-gray-600">
                {signal.confidence_reason}
              </p>
            )}

            {signal.home_lineup_reason && (
              <p className="mt-3 text-sm text-gray-600">
                {signal.home_team}: {signal.home_lineup_reason}
              </p>
            )}

            {signal.away_lineup_reason && (
              <p className="text-sm text-gray-600">
                {signal.away_team}: {signal.away_lineup_reason}
              </p>
            )}
          </div>

          <div className="rounded-full border border-emerald-200 bg-emerald-50 px-4 py-2 text-sm font-semibold text-emerald-700">
            +{Math.round(signal.value * 100)}% edge
          </div>
        </div>

        <p className="mt-6 text-sm font-semibold text-rose-500">
          Odds can move quickly once the market reacts.
        </p>

        {!isPro ? (
          <div className="mt-8 rounded-[28px] border border-gray-200 bg-gray-50 p-8 text-center">
            <p className="text-sm font-semibold uppercase tracking-[0.22em] text-gray-400">
              Premium Analysis
            </p>

            <h2 className="mt-3 text-2xl font-bold tracking-tight text-gray-900">
              Unlock full signal breakdown
            </h2>

            <p className="mt-3 mx-auto max-w-2xl text-sm leading-6 text-gray-600">
              See the full model breakdown, market gap interpretation, matchup structure, and lineup-driven edge analysis.
            </p>

            <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
              <span className="rounded-full border border-blue-200 bg-blue-50 px-3 py-1 text-sm font-semibold text-blue-700">
                {Math.round(signal.model_probability * 100)}% model
              </span>

              <span className="rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-sm font-semibold text-emerald-700">
                +{Math.round(signal.value * 100)}% edge
              </span>

              {signal.gap_label && signal.market_gap !== undefined && (
                <span className="rounded-full border border-cyan-200 bg-cyan-50 px-3 py-1 text-sm font-semibold text-cyan-700">
                  {signal.gap_label} · {signal.market_gap > 0 ? "+" : ""}
                  {signal.market_gap}%
                </span>
              )}
            </div>

            <div className="mt-8">
              <Link
                href="/pricing"
                className="inline-flex rounded-full bg-black px-6 py-3 text-sm font-semibold text-white transition hover:bg-gray-800"
              >
                Unlock Full Model Access
              </Link>
            </div>
          </div>
        ) : (
          <>
            <div className="mt-8 grid gap-4 md:grid-cols-4">
              <div className="rounded-3xl border border-gray-200 bg-white p-5">
                <p className="text-xs font-semibold uppercase tracking-[0.22em] text-gray-400">
                  Odds
                </p>
                <p className="mt-3 text-2xl font-bold text-gray-900">
                  {signal.odds}
                </p>
              </div>

              <div className="rounded-3xl border border-gray-200 bg-white p-5">
                <p className="text-xs font-semibold uppercase tracking-[0.22em] text-gray-400">
                  Market Probability
                </p>
                <p className="mt-3 text-2xl font-bold text-gray-900">
                  {Math.round(signal.implied_probability * 100)}%
                </p>
              </div>

              <div className="rounded-3xl border border-blue-200 bg-blue-50 p-5">
                <p className="text-xs font-semibold uppercase tracking-[0.22em] text-blue-700">
                  Model Probability
                </p>
                <p className="mt-3 text-2xl font-bold text-blue-700">
                  {Math.round(signal.model_probability * 100)}%
                </p>
              </div>

              <div className="rounded-3xl border border-emerald-200 bg-emerald-50 p-5">
                <p className="text-xs font-semibold uppercase tracking-[0.22em] text-emerald-700">
                  Edge
                </p>
                <p className="mt-3 text-2xl font-bold text-emerald-700">
                  +{Math.round(signal.value * 100)}%
                </p>
              </div>
            </div>

            <div className="mt-8 grid gap-4 md:grid-cols-2">
              <div className="rounded-3xl border border-gray-200 bg-white p-5">
                <p className="text-xs font-semibold uppercase tracking-[0.22em] text-gray-400">
                  Prediction
                </p>
                <p className="mt-3 text-2xl font-bold text-gray-900">
                  {signal.prediction}
                </p>
              </div>

              <div className="rounded-3xl border border-gray-200 bg-white p-5">
                <p className="text-xs font-semibold uppercase tracking-[0.22em] text-gray-400">
                  Kickoff
                </p>
                <p className="mt-3 text-2xl font-bold text-gray-900">
                  {signal.kickoff}
                </p>
              </div>
            </div>

            <div className="mt-8 grid gap-4 md:grid-cols-4">
              <div className="rounded-3xl border border-gray-200 bg-white p-5">
                <p className="text-xs font-semibold uppercase tracking-[0.22em] text-gray-400">
                  Home Attack
                </p>
                <p className="mt-3 text-2xl font-bold text-gray-900">
                  {homeAttack}
                </p>
              </div>

              <div className="rounded-3xl border border-gray-200 bg-white p-5">
                <p className="text-xs font-semibold uppercase tracking-[0.22em] text-gray-400">
                  Home Defense
                </p>
                <p className="mt-3 text-2xl font-bold text-gray-900">
                  {homeDefense}
                </p>
              </div>

              <div className="rounded-3xl border border-gray-200 bg-white p-5">
                <p className="text-xs font-semibold uppercase tracking-[0.22em] text-gray-400">
                  Away Attack
                </p>
                <p className="mt-3 text-2xl font-bold text-gray-900">
                  {awayAttack}
                </p>
              </div>

              <div className="rounded-3xl border border-gray-200 bg-white p-5">
                <p className="text-xs font-semibold uppercase tracking-[0.22em] text-gray-400">
                  Away Defense
                </p>
                <p className="mt-3 text-2xl font-bold text-gray-900">
                  {awayDefense}
                </p>
              </div>
            </div>

            <div className="mt-8 rounded-[28px] border border-gray-200 bg-white p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.22em] text-gray-400">
                    Strength Comparison
                  </p>
                  <p className="mt-2 text-lg font-semibold text-gray-900">
                    Home attack vs away defense
                  </p>
                </div>

                <div className="text-right">
                  <p className="text-xs font-semibold uppercase tracking-[0.22em] text-gray-400">
                    Difference
                  </p>
                  <p className="mt-2 text-lg font-bold text-gray-900">
                    {strengthDiff >= 0 ? "+" : ""}
                    {strengthDiff}
                  </p>
                </div>
              </div>

              <div className="mt-6">
                <div className="flex items-center justify-between text-sm font-medium text-gray-600">
                  <span>Home Attack ({homeAttack})</span>
                  <span>Away Defense ({awayDefense})</span>
                </div>

                <div className="mt-3 h-4 overflow-hidden rounded-full bg-gray-100">
                  <div className="flex h-full w-full">
                    <div
                      className="h-full bg-blue-500"
                      style={{ width: `${homeAttackWidth}%` }}
                    />
                    <div
                      className="h-full bg-gray-300"
                      style={{ width: `${awayDefenseWidth}%` }}
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-8 rounded-[28px] bg-gray-950 p-6 text-white">
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-gray-400">
                AI Analysis
              </p>
              <p className="mt-4 text-lg leading-8 text-gray-100">
                {signal.reasoning}
              </p>
            </div>
          </>
        )}
      </div>
    </div>
  )
}