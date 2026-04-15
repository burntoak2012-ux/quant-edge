import { redirect } from "next/navigation"

export default async function SignalsPage() {
  const res = await fetch("http://localhost:3000/api/access-status", {
    cache: "no-store",
  })

  const data = await res.json()

  if (!data.hasAccess) {
    redirect("/pricing")
  }

  return (
    <main className="min-h-screen bg-white text-black">
      <div className="max-w-5xl mx-auto px-6 py-16">

        <div className="mb-10">
          <h1 className="text-3xl font-bold">Today's Signals</h1>
          <p className="text-gray-600">
            Premium football signals unlocked.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">

          <div className="p-6 rounded-xl border shadow-sm">
            <h2 className="font-semibold text-lg">
              Arsenal vs Chelsea
            </h2>
            <p className="text-gray-600 mt-2">Over 2.5</p>
            <p className="text-green-600 mt-2 font-medium">
              Confidence: 78%
            </p>
          </div>

          <div className="p-6 rounded-xl border shadow-sm">
            <h2 className="font-semibold text-lg">
              Madrid vs Sevilla
            </h2>
            <p className="text-gray-600 mt-2">Home Win</p>
            <p className="text-green-600 mt-2 font-medium">
              Confidence: 82%
            </p>
          </div>

        </div>

      </div>
    </main>
  )
}