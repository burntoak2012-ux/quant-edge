"use client";
import { useEffect, useState } from "react";

type SimRow = {
  team: string;
  avg_points: number;
  avg_expected_points: number;
  title_probability: number;
  top2_probability: number;
  most_likely_finish: number;
  power_rank: number;
  finish_distribution: Record<string, number>;
};

export default function SimulateTablePage() {
  const [rows, setRows] = useState<SimRow[]>([]);

  useEffect(() => {
    fetch("http://127.0.0.1:8000/simulate-table")
      .then((res) => res.json())
      .then((data) => setRows(data))
      .catch((err) => console.error("ERROR:", err));
  }, []);

  return (
    <div className="p-10">
      <h1 className="text-3xl font-bold mb-6">Season Simulation 🏆</h1>

      <div className="overflow-x-auto">
        <table className="min-w-full border border-gray-200">
          <thead>
            <tr className="bg-gray-100 text-left">
              <th className="p-3 border-b">Rank</th>
              <th className="p-3 border-b">Team</th>
              <th className="p-3 border-b">Avg Points</th>
              <th className="p-3 border-b">xPts</th>
              <th className="p-3 border-b">Title %</th>
              <th className="p-3 border-b">Top 2 %</th>
              <th className="p-3 border-b">Most Likely Finish</th>
              <th className="p-3 border-b">Top Finishes</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((team) => (
              <tr key={team.team} className="border-b">
                <td className="p-3">{team.power_rank}</td>
                <td className="p-3 font-semibold">{team.team}</td>
                <td className="p-3">{team.avg_points}</td>
                <td className="p-3">{team.avg_expected_points}</td>
                <td className="p-3">{(team.title_probability * 100).toFixed(1)}%</td>
                <td className="p-3">{(team.top2_probability * 100).toFixed(1)}%</td>
                <td className="p-3">{team.most_likely_finish}</td>
                <td className="p-3">
                  {Object.entries(team.finish_distribution)
                    .sort((a, b) => b[1] - a[1])
                    .slice(0, 3)
                    .map(([k, v]) => (
                      <div key={k}>
                        {k.replace("finish_", "")}: {(v * 100).toFixed(0)}%
                      </div>
                    ))}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}