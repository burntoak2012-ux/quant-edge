export const runtime = "nodejs"

import { execSync } from "child_process"
import { createClient } from "@supabase/supabase-js"

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const match = searchParams.get("match") || "Arsenal vs Chelsea"

  const [homeTeam, awayTeam] = match.split(" vs ")

  let homeRating = 80
  let awayRating = 75
  let result = ""

  try {
    result = execSync(
      `python app/lineup_calculator.py "${homeTeam}" "${awayTeam}"`
    )
      .toString()
      .trim()

    const parsed = JSON.parse(result)

    homeRating = parsed.home_rating
    awayRating = parsed.away_rating
  } catch (error) {
    console.error("Python failed:", error)
  }

  const edge = homeRating - awayRating
  const confidence = edge === 0 ? 50 : Math.min(Math.abs(edge) * 10, 100)
  const pick = edge > 0 ? homeTeam : awayTeam

  // ✅ Save to Supabase
  await supabase.from("signals").insert({
    match,
    pick,
    confidence,
    edge,
    is_active: true,
  })

  return Response.json({
    match,
    homeTeam,
    awayTeam,
    homeRating,
    awayRating,
    edge,
    confidence,
    pick,
  })
}