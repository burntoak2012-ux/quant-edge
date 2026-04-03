export default async function SignalDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return (
    <div className="max-w-3xl mx-auto py-10 px-6">
      <h1 className="text-3xl font-bold">Signal {id}</h1>
      <p className="text-gray-500 mt-2">Detail page for signal {id}</p>
    </div>
  );
}