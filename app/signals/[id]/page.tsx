export const dynamic = "force-dynamic";

export default function SignalDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const { id } = params;

  return (
    <div className="max-w-3xl mx-auto py-10 px-6">
      <h1 className="text-3xl font-bold">Signal {id}</h1>
      <p className="text-gray-500 mt-2">
        Detail page for signal {id}
      </p>
    </div>
  );
}