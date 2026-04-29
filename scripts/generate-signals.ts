import * as dotenv from "dotenv"
dotenv.config({ path: ".env.local" })

import { createClient } from "@supabase/supabase-js"

const SUPABASE_URL =
  process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL

const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY
const API_KEY = process.env.API_FOOTBALL_KEY

if (!SUPABASE_URL) throw new Error("Missing SUPABASE_URL")
if (!SUPABASE_SERVICE_ROLE_KEY) {
  throw new Error("Missing SUPABASE_SERVICE_ROLE_KEY")
}
if (!API_KEY) throw new Error("Missing API_FOOTBALL_KEY")

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY)

async function fetchFixtures() {
  const date = "2026-04-29"
console.log("Fetching fixtures for:", date)

  const res = await fetch(
    `https://v3.football.api-sports.io/fixtures?date=${date}`,
    {
      headers: {
        "x-apisports-key": API_KEY!,
      },
    }
  )

  const data = await res.json()
  console.log("API status:", res.status)
console.log("API results:", data.results)
console.log("API errors:", data.errors)
console.log("API response sample:", data.response?.slice?.(0, 3))
  return data.response || []
}

async function fetchOdds(fixtureId: number) {
  const res = await fetch(
    `https://v3.football.api-sports.io/odds?fixture=${fixtureId}`,
    {
      headers: {
        "x-apisports-key": API_KEY!,
      },
    }
  )

  const data = await res.json()
  const bookmakers = data.response?.[0]?.bookmakers || []

  for (const bookmaker of bookmakers) {
    const matchWinner = bookmaker.bets?.find(
      (bet: any) => bet.name === "Match Winner"
    )

    if (!matchWinner) continue

    const home = matchWinner.values?.find((v: any) => v.value === "Home")
    const away = matchWinner.values?.find((v: any) => v.value === "Away")

    if (home?.odd && away?.odd) {
      return {
        home: Number(home.odd),
        away: Number(away.odd),
      }
    }
  }

  return null
}

function buildSignal(home: string, away: string, odds: any) {
  if (!odds?.home || !odds?.away) return null

  const homeOdds = odds.home
  const awayOdds = odds.away

  const pick = homeOdds < awayOdds ? home : away
  const selectedOdds = Math.min(homeOdds, awayOdds)

  const confidence = Math.round((100 / selectedOdds) * 1.1)

  const probability = confidence / 100
  const roi = probability * selectedOdds - 1

  if (roi <= 0) return null
  if (confidence < 55) return null
  if (selectedOdds > 1.85) return null

  return {
    match: `${home} vs ${away}`,
    pick,
    market: "Match Winner",
    odds: selectedOdds,
    confidence,
    edge: 0,
    is_active: true,
  }
}

async function main() {
  const fixtures = await fetchFixtures()

  console.log(`Found ${fixtures.length} fixtures`)

  const upcomingFixtures = fixtures
    .filter((f: any) => ["NS", "TBD"].includes(f.fixture?.status?.short))
    .slice(0, 30)

  const signals: any[] = []
  const seenMatches = new Set<string>()

  for (const fixture of upcomingFixtures) {
    const home = fixture.teams.home.name
    const away = fixture.teams.away.name
    const fixtureId = fixture.fixture.id
    const matchKey = `${home} vs ${away}`

    if (seenMatches.has(matchKey)) continue
    seenMatches.add(matchKey)

    const odds = await fetchOdds(fixtureId)

    if (!odds) {
      console.log(`${matchKey}: skipped no odds`)
      continue
    }

    const signal = buildSignal(home, away, odds)

    if (!signal) {
      console.log(`${matchKey}: skipped weak signal`)
      continue
    }

    console.log(
      `${signal.match} → ${signal.pick} | odds ${signal.odds} | confidence ${signal.confidence}% | ROI ${signal.roi}%`
    )

    signals.push(signal)
  }

  if (signals.length === 0) {
    console.log("No valid signals found today")
    return
  }

  await supabase
    .from("signals")
    .update({ is_active: false })
    .eq("is_active", true)

  console.log("Signals to insert:",signals)

  const { data, error } = await supabase
  .from("signals")
  .insert(signals)
  .select()

console.log("Supabase insert data:", data)
console.log("Supabase insert error:", error)

  if (error) {
    console.error("Insert error:", error.message)
    return
  }

  console.log(`Inserted ${signals.length} signals`)
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
