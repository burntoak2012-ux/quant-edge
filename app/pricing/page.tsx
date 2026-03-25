export default function Pricing() {
  return (
    <div className="p-10 grid md:grid-cols-3 gap-6">
      <div className="p-6 bg-white rounded-2xl shadow">
        <h2 className="text-2xl font-bold">Free</h2>
        <p>1 signal/day</p>
      </div>

      <div className="p-6 bg-white rounded-2xl shadow">
        <h2 className="text-2xl font-bold">Pro</h2>
        <p>Real-time signals</p>
      </div>

      <div className="p-6 bg-white rounded-2xl shadow">
        <h2 className="text-2xl font-bold">Elite</h2>
        <p>Full system</p>
      </div>
    </div>
  );
}