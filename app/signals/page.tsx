import { auth } from "@clerk/nextjs/server"
import { createClient } from "@supabase/supabase-js"
import Link from "next/link"
import { isProUser } from "@/lib/isProUser"

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

function SignalCard({ signal }: { signal: any }) {
  return (
    <div className="border rounded-xl p-4 flex justify-between items-center">
      <div>
        <p className="text-lg font-semibold">{signal.match}</p>

        <p className="text-sm text-gray-600">
          Prediction: {signal.pick}
        </p>

        <p className="mt-1 text-xs font-medium text-green-600">
          Expected ROI: +{signal.roi}%
        </p>
      </div>

      <div className="text-right">
        <p className="text-xl font-bold">{signal.confidence}%</p>
        <p className="text-xs text-gray-400">confidence</p>
      </div>
    </div>
  )
}

export default async function SignalsPage() {
  const { userId } = await auth()
  const isPro = await isProUser()

  const { data: signals } = await supabase
    .from("signals")
    .select("*")
    .eq("is_active", true)
    .order("roi", { ascending: false })

  const visibleSignals = isPro ? signals || [] : (signals || []).slice(0, 1)
  const lockedSignals = !isPro && (signals || []).length > 1

  return (
    <main className="max-w-3xl mx-auto px-6 py-16">
      <h1 className="text-3xl font-bold">Today’s Signals</h1>

      <p className="mt-1 text-xs text-gray-500">
        Updated 2 minutes ago • Market-based model
      </p>

      <p className="mt-3 text-sm text-red-600">
        🔥 14 users viewing today’s signals
      </p>

      <div className="mt-8 space-y-4">
        {visibleSignals.map((signal: any) => (
          <SignalCard key={signal.id} signal={signal} />
        ))}

        {lockedSignals && (
          <div className="border rounded-xl p-8 text-center bg-white">
            <p className="font-semibold text-lg">🔒 Unlock all signals</p>
            <p className="mt-2 text-sm text-gray-600">
              Get full access to today’s market-based signals.
            </p>

            <Link
              href="/pricing"
              className="mt-5 inline-block rounded-lg bg-black px-6 py-3 text-white font-semibold"
            >
              Get Full Access
            </Link>
          </div>
        )}

        {(signals || []).length === 0 && (
          <p className="text-sm text-gray-500">
            No valid signals available right now. Check back later today.
          </p>
        )}
      </div>

      <p className="mt-10 text-xs text-gray-400">
        Betting involves risk. QuantEdge provides data-driven insights only and
        does not guarantee outcomes.
      </p>
    </main>
  )
}
