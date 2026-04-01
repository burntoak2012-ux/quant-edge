"use client";
import { useEffect, useState } from "react";

type TeamRow = {
  rank: number;
  team: string;
  squad_rating: number;
  best_xi_rating: number;
};

export default function TablePage() {
  const [rows, setRows] = useState<TeamRow[]>([]);

  useEffect(() => {
    fetch("http://127.0.0.1:8000/table")
      .then((res) => res.json())
      .then((data) => setRows(data))
      .catch((err) => console.error("ERROR:", err));
  }, []);

  return (
    <div className="p-10">
      <h1 className="text-3xl font-bold mb-6">League Table ⚽</h1>

      <div className="overflow-x-auto">
        <table className="min-w-full border border-gray-200">
          <thead>
            <tr className="bg-gray-100 text-left">
              <th className="p-3 border-b">Rank</th>
              <th className="p-3 border-b">Team</th>
              <th className="p-3 border-b">Squad Rating</th>
              <th className="p-3 border-b">Best XI Rating</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.team} className="border-b">
                <td className="p-3">{row.rank}</td>
                <td className="p-3 font-semibold">{row.team}</td>
                <td className="p-3">{row.squad_rating}</td>
                <td className="p-3">{row.best_xi_rating}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
