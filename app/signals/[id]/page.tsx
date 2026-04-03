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
      <div className="max-w-3xl mx-auto py-10 px-6">
        <h1 className="text-3xl font-bold">Signal not found</h1>
        <p className="text-gray-500 mt-2">Requested ID: {id}</p>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto py-10 px-6">
      <h1 className="text-3xl font-bold">{signal.match}</h1>
      <p className="text-gray-500 mt-2">{signal.league}</p>

      <div className="mt-8 border rounded-2xl p-6 bg-white shadow-sm space-y-4">
        <div>
          <p className="text-sm text-gray-500">Kickoff</p>
          <p className="font-medium">{signal.kickoff}</p>
        </div>

        <div>
          <p className="text-sm text-gray-500">Prediction</p>
          <p className="font-medium">{signal.prediction}</p>
        </div>

        <div>
          <p className="text-sm text-gray-500">Confidence</p>
          <p className="font-medium">{signal.confidence}%</p>
        </div>
      </div>
    </div>
  );
}