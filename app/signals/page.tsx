import Link from "next/link";
import { signals } from "@/lib/signals";

export default function SignalsPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-6 py-10">
        <div className="mb-10">
          <p className="text-sm font-medium uppercase tracking-[0.2em] text-gray-400">
            Quant Edge
          </p>
          <h1 className="mt-3 text-4xl font-bold tracking-tight text-gray-900">
            Live Signals
          </h1>
          <p className="mt-3 text-lg text-gray-500">
            Today’s AI-powered football betting picks
          </p>
        </div>

        <div className="grid gap-6">
          {signals.map((signal) => {
            const confidenceStyles =
              signal.confidence >= 80
                ? "bg-emerald-100 text-emerald-700 border border-emerald-200"
                : signal.confidence >= 70
                ? "bg-amber-100 text-amber-700 border border-amber-200"
                : "bg-rose-100 text-rose-700 border border-rose-200";

            return (
              <Link
                key={signal.id}
                href={`/signals/${signal.id}`}
                className="block"
              >
                <div className="rounded-[28px] border border-gray-200 bg-white p-6 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
                  <div className="flex flex-col gap-5 md:flex-row md:items-start md:justify-between">
                    <div>
                      <h2 className="text-2xl font-bold tracking-tight text-gray-900">
                        {signal.match}
                      </h2>
                      <p className="mt-2 text-base text-gray-500">
                        {signal.league}
                      </p>
                    </div>

                    <div className="flex flex-col items-start gap-2 md:items-end">
                      <p className="text-sm text-gray-400">Kickoff</p>
                      <p className="text-lg font-semibold text-gray-900">
                        {signal.kickoff}
                      </p>
                      <div
                        className={`mt-1 inline-flex items-center rounded-full px-4 py-2 text-sm font-semibold ${confidenceStyles}`}
                      >
                        {signal.confidence}% Confidence
                      </div>
                    </div>
                  </div>

                  <div className="mt-6 rounded-2xl border border-gray-100 bg-gray-50 p-4">
                    <p className="text-sm text-gray-500">Prediction</p>
                    <p className="mt-2 text-lg font-semibold text-gray-900">
                      {signal.prediction}
                    </p>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}


