import Link from "next/link"

export default function SignalsPage() {
  
  const signals = [
    {
      id: 1,
      match: "Arsenal vs Chelsea",
      league: "Premier League",
      kickoff: "19:45",
      prediction: "Over 2.5 Goals",
      confidence: 78,
    },
    {
      id: 2,
      match: "Barcelona vs Valencia",
      league: "La Liga",
      kickoff: "20:00",
      prediction: "Barcelona Win",
      confidence: 82,
    },
    {
      id: 3,
      match: "Inter vs Milan",
      league: "Serie A",
      kickoff: "19:30",
      prediction: "Both Teams to Score",
      confidence: 74,
    },
  ];

  return (
    <div className="max-w-5xl mx-auto py-10 px-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold">Live Signals</h1>
        <p className="text-gray-500 mt-2">
          Today’s AI-powered football betting picks
        </p>
      </div>

      {/* Signals */}
      <div className="grid gap-6">
        {signals.map((signal) => (
  <Link key={signal.id} href={`/signals/${signal.id}`}>
    <div
            
            className="border rounded-2xl p-5 shadow-sm bg-white hover:shadow-md transition cursor-pointer"
          >
            {/* Top row */}
            <div className="flex justify-between items-start">
              {/* LEFT */}
              <div>
                <h2 className="text-lg font-semibold">{signal.match}</h2>
                <p className="text-sm text-gray-500">{signal.league}</p>
              </div>

              {/* RIGHT */}
              <div className="text-right space-y-1">
                <p className="text-xs text-gray-400">{signal.kickoff}</p>

                <p className="text-xs text-gray-400">Confidence</p>

                <span
                  className={`px-3 py-1 rounded-full text-sm font-bold shadow-sm ${
                    signal.confidence >= 80
                      ? "bg-green-100 text-green-700"
                      : signal.confidence >= 70
                      ? "bg-yellow-100 text-yellow-700"
                      : "bg-red-100 text-red-700"
                  }`}
                >
                  {signal.confidence}%
                </span>
              </div>
            </div>

            {/* Prediction */}
            <p className="text-sm mt-3">
              Prediction:{" "}
              <span className="font-medium">{signal.prediction}</span>
            </p>
          </div>
          </Link>
        ))}
      </div>
    </div>
  );
}


