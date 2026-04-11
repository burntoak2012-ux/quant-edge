import { auth } from "@clerk/nextjs/server"
import { redirect } from "next/navigation"
import fs from "fs"
import path from "path"

// ===== Helper functions =====

function getPaidUsersPath() {
  return path.join(process.cwd(), "python-engine", "data", "paid_users.json")
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

// ===== Page =====

export default async function SignalsPage() {
  const { userId } = await auth()

  // Not logged in → send to sign in
  if (!userId) {
    redirect("/sign-in")
  }

  // Check paid users
  const paidUsers = getPaidUsers()
  const isPaidUser = paidUsers.includes(userId)

  // Not paid → send to pricing
  if (!isPaidUser) {
    redirect("/pricing")
  }

  // ===== Your existing UI =====
  return (
    <main className="mx-auto max-w-6xl px-6 py-10">
      <section className="rounded-[32px] border border-zinc-200 bg-white p-8 shadow-sm">
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

        <div className="mt-6 flex flex-wrap gap-3">
          <span className="rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1.5 text-sm font-medium text-emerald-700">
            Pro access active
          </span>

          <span className="rounded-full border border-zinc-200 bg-zinc-50 px-3 py-1.5 text-sm font-medium text-zinc-700">
            3 signals loaded
          </span>
        </div>
      </section>

      {/* Example signal (keep or replace with your real data) */}
      <div className="mt-8 rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm">
        <p className="text-sm font-medium text-zinc-500">
          Premier League • Grade A • 65% Confidence
        </p>

        <h2 className="mt-2 text-xl font-semibold text-zinc-900">
          Arsenal vs Chelsea
        </h2>

        <p className="mt-2 text-zinc-700">
          Pick: <span className="font-semibold">Over 2.5 Goals</span>
        </p>

        <p className="mt-2 text-sm text-zinc-500">
          Model read: Home attacking advantage
        </p>
      </div>
    </main>
  )
}