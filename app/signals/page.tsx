import { auth } from "@clerk/nextjs/server"
import { redirect } from "next/navigation"
import fs from "fs"
import path from "path"

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

export default async function SignalsPage() {
  const { userId } = await auth()

  if (!userId) {
    redirect("/sign-in")
  }

  const paidUsers = getPaidUsers()
  const isPaid = paidUsers.includes(userId)

  if (!isPaid) {
    redirect("/pricing")
  }

  return (
    <main className="mx-auto max-w-6xl px-6 py-10">
      <section className="rounded-[32px] border border-zinc-200 bg-white p-8 shadow-sm">
        <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-zinc-400">
          Quant Edge Pro
        </p>

        <h1 className="mt-4 text-5xl font-bold tracking-tight text-zinc-950">
          Today’s Signals
        </h1>

        <p className="mt-4 text-lg leading-8 text-zinc-600">
          Premium football signals unlocked for paid users.
        </p>

        <div className="mt-6 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1.5 inline-flex text-sm font-medium text-emerald-700">
          Pro access active
        </div>
      </section>
    </main>
  )
}