import Link from "next/link";
import { signals } from "@/lib/signals";

export default async function SignalDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const signal = signals.find((s) => s.id === Number(id));

  if (!signal) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-4xl mx-auto px-6 py-12">
          <Link
            href="/signals"
            className="inline-flex items-center rounded-xl border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50"
          >
            ← Back to Signals
          </Link>

          <div className="mt-10 rounded-3xl border border-gray-200 bg-white p-8 shadow-sm">
            <h1 className="text-3xl font-bold text-gray-900">Signal not found</h1>
            <p className="mt-2 text-gray-500">Requested ID: {id}</p>
          </div>
        </div>
      </div>
    );
  }

  const confidenceStyles =
    signal.confidence >= 80
      ? "bg-emerald-100 text-emerald-700 border border-emerald-200"
      : signal.confidence >= 70
      ? "bg-amber-100 text-amber-700 border border-amber-200"
      : "bg-rose-100 text-rose-700 border border-rose-200";

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-5xl mx-auto px-6 py-10">
        <Link
          href="/signals"
          className="inline-flex items-center rounded-xl border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50"
        >
          ← Back to Signals
        </Link>

        <div className="mt-8 rounded-[28px] border border-gray-200 bg-white p-8 shadow-sm">
          <div className="flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
            <div>
              <p className="text-sm font-medium uppercase tracking-[0.2em] text-gray-400">
                Live Signal
              </p>
              <h1 className="mt-3 text-4xl font-bold tracking-tight text-gray-900">
                {signal.match}
              </h1>
              <p className="mt-3 text-lg text-gray-500">{signal.league}</p>
            </div>

            <div
              className={`inline-flex items-center rounded-full px-4 py-2 text-sm font-semibold ${confidenceStyles}`}
            >
              Confidence {signal.confidence}%
            </div>
          </div>

          <div className="mt-10 grid gap-4 md:grid-cols-3">
            <div className="rounded-2xl border border-gray-200 bg-gray-50 p-5">
              <p className="text-sm text-gray-500">Kickoff</p>
              <p className="mt-2 text-2xl font-bold text-gray-900">
                {signal.kickoff}
              </p>
            </div>

            <div className="rounded-2xl border border-gray-200 bg-gray-50 p-5 md:col-span-2">
              <p className="text-sm text-gray-500">Prediction</p>
              <p className="mt-2 text-2xl font-bold text-gray-900">
                {signal.prediction}
              </p>
            </div>
          </div>

          <div className="mt-8 rounded-2xl bg-gradient-to-r from-gray-900 to-gray-800 p-6 text-white shadow-sm">
            <p className="text-sm uppercase tracking-[0.2em] text-gray-300">
              AI Summary
            </p>
            <p className="mt-3 text-lg leading-8 text-gray-100">
              This signal rates <span className="font-semibold">{signal.match}</span> as a{" "}
              <span className="font-semibold">{signal.confidence}% confidence</span> opportunity,
              with the strongest angle being{" "}
              <span className="font-semibold">{signal.prediction}</span>.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}