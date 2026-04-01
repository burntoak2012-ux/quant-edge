"use client";
import { useEffect, useState } from "react";

export default function Dashboard() {
  const [signals, setSignals] = useState<any[]>([]);

  useEffect(() => {
    fetch("http://127.0.0.1:8000/signal")
      .then((res) => res.json())
      .then((data) => setSignals(data))
      .catch((err) => console.error("ERROR:", err));
  }, []);

  return (
    <div className="p-10">
      <h1 className="text-3xl font-bold">Live Signals ⚡</h1>

      {signals.length === 0 && (
        <p className="mt-4">No signals yet (backend not connected)</p>
      )}

      {signals.map((s, i) => (
        <div key={i} className="p-4 mt-4 bg-white shadow rounded-xl">
          <p className="font-bold">{s.match}</p>
          <p>Edge: {s.edge}</p>
          <p>Odds: {s.odds}</p>
        </div>
      ))}
    </div>
  );
}