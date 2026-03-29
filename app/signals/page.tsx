"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

type Signal = {
  match: string;
  best_bet: string;
  confidence: string;
  best_edge: number;
  home_win_probability: number;
  draw_probability: number;
  away_win_probability: number;
  home_lineup_penalty: number;
away_lineup_penalty: number;
home_missing_players: { name: string; importance: string }[];
away_missing_players: { name: string; importance: string }[];

};

export default function SignalsPage() {
  const [rows, setRows] = useState<Signal[]>([]);
  const [loading, setLoading] = useState(true);
  const [isPro, setIsPro] = useState(false);
  const [sortBy, setSortBy] = useState("edge-desc");
const [confidenceFilter, setConfidenceFilter] = useState("All");
const [minEdgeFilter, setMinEdgeFilter] = useState("All");


 useEffect(() => {
  fetch("http://127.0.0.1:8000/signal")
    .then((res) => res.json())
    .then((data) => {
      setRows(data.all || []);
    })
    .catch((err) => {
      console.error("FETCH ERROR:", err);
      setRows([]);
    })
    .finally(() => {
      setLoading(false);
    });
}, []);
  const filteredRows = rows.filter((row) => {
  const confidenceMatch =
    confidenceFilter === "All" ||
    row.confidence?.toUpperCase() === confidenceFilter.toUpperCase();

  const edgePercent = row.best_edge * 100;

  const edgeMatch =
    minEdgeFilter === "All" ||
    (minEdgeFilter === "5+" && edgePercent >= 5) ||
    (minEdgeFilter === "8+" && edgePercent >= 8) ||
    (minEdgeFilter === "10+" && edgePercent >= 10);

  return confidenceMatch && edgeMatch;
});

const sortedRows = [...filteredRows].sort((a, b) => {
  if (sortBy === "edge-desc") {
    return b.best_edge - a.best_edge;
  }
  return a.best_edge - b.best_edge;
});

const visibleRows = sortedRows;
const freeRows = visibleRows.slice(0, 1);
const displayedRows = isPro ? visibleRows : freeRows;


  console.log("ROWS:", rows);
console.log("VISIBLE ROWS:", visibleRows);

  if (loading) {
    return <div className="p-10">Loading signals...</div>;
  }
const totalSignals = visibleRows.length;

const highConfidenceCount = visibleRows.filter(
  (row) => row.confidence === "HIGH"
).length;

const avgEdge =
  totalSignals > 0
    ? visibleRows.reduce((sum, row) => sum + row.best_edge, 0) / totalSignals
    : 0;
  return (
    <div className="bg-gray-50 min-h-screen py-10 px-6">
      <div className="max-w-6xl mx-auto">

        {/* Header */}
        <h1 className="text-4xl font-bold mb-3">⚡ Quant Edge</h1>
<p className="text-gray-600 mb-8 max-w-2xl">
  AI-powered football value bets, fair odds, and market edges in one place.
</p>

        {/* Toggle */}
        <div className="mb-8 flex items-center gap-3">
          <span>Free</span>
          <button
            onClick={() => setIsPro(!isPro)}
            className={`w-12 h-6 flex items-center rounded-full p-1 transition ${
              isPro ? "bg-green-500" : "bg-gray-300"
            }`}
          >
            <div
              className={`bg-white w-4 h-4 rounded-full shadow-md transform transition ${
                isPro ? "translate-x-6" : ""
              }`}
            />
          </button>
          <span>Pro</span>
        </div>



<div className="mb-4 flex flex-wrap items-center gap-3">
  {/* Confidence */}
  <div className="flex items-center gap-2">
    <label className="text-sm text-gray-600">Confidence:</label>
    <select
      value={confidenceFilter}
      onChange={(e) => setConfidenceFilter(e.target.value)}
      className="rounded-lg border border-gray-300 px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500"
    >
      <option value="All">All</option>
      <option value="HIGH">High</option>
      <option value="MEDIUM">Medium</option>
      <option value="LOW">Low</option>
    </select>
  </div>

  {/* Min Edge */}
  <div className="flex items-center gap-2">
    <label className="text-sm text-gray-600">Min Edge:</label>
    <select
      value={minEdgeFilter}
      onChange={(e) => setMinEdgeFilter(e.target.value)}
      className="rounded-lg border border-gray-300 px-3 py-2 text-sm focus:ring-2 focus:ring-green-500"
    >
      <option value="All">All</option>
      <option value="5+">5%+</option>
      <option value="8+">8%+</option>
      <option value="10+">10%+</option>
    </select>
  </div>

  {/* Sort */}
  <div className="flex items-center gap-2">
    <label className="text-sm text-gray-600">Sort:</label>
    <select
      value={sortBy}
      onChange={(e) => setSortBy(e.target.value)}
      className="rounded-lg border border-gray-300 px-3 py-2 text-sm focus:ring-2 focus:ring-purple-500"
    >
      <option value="edge-desc">Best edge first</option>
      <option value="edge-asc">Worst edge first</option>
    </select>
  </div>
</div>



        {/* Table */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden mb-8">
          <div className="mb-4 grid grid-cols-1 gap-3 md:grid-cols-3">
  <div className="rounded-xl border border-gray-200 bg-white p-4">
    <p className="text-sm text-gray-500">Visible Signals</p>
    <p className="text-2xl font-bold">{totalSignals}</p>
  </div>

  <div className="rounded-xl border border-gray-200 bg-white p-4">
    <p className="text-sm text-gray-500">High Confidence</p>
    <p className="text-2xl font-bold text-green-700">{highConfidenceCount}</p>
  </div>

  <div className="rounded-xl border border-gray-200 bg-white p-4">
    <p className="text-sm text-gray-500">Average Edge</p>
    <p className="text-2xl font-bold">
      {(avgEdge * 100).toFixed(1)}%
    </p>
  </div>
</div>

          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-left">
              <tr>
                <th className="p-3">Match</th>
                <th className="p-3">Best Bet</th>
                <th className="p-3">Confidence</th>
                <th className="p-3">Edge</th>
                <th className="p-3">Home %</th>
                <th className="p-3">Draw %</th>
                <th className="p-3">Away %</th>
                <th className="p-3">Lineup Impact</th>
              </tr>
            </thead>
            <tbody>
  {visibleRows.length === 0 ? (
    <tr>
      <td colSpan={8} className="py-16 px-10 text-center">
  <div className="flex flex-col items-center gap-2 text-gray-500">
    <span className="text-3xl">🔎</span>
    <p className="font-medium">No signals match your current filters</p>
    <p className="text-sm text-gray-400">
      Try lowering the minimum edge or changing the confidence filter.
    </p>
  </div>
</td>
    </tr>
  ) : (
    displayedRows.map((row, i) => {
  return (
    <tr key={i} className="border-t border-gray-100 hover:bg-gray-50">
      
      {/* Match */}
      <td className="p-3">
        <Link
          href={`/signals/${encodeURIComponent(row.match)}`}
          className="text-blue-600 hover:underline font-medium"
        >
          <span className="flex items-center gap-2">
            {row.match}
            {i < 3 && (
              <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded">
                TOP
              </span>
            )}
          </span>
        </Link>
      </td>

      {/* Best Bet */}
      <td className="p-3">{row.best_bet}</td>

      {/* Confidence */}
      <td
        className={`p-3 font-medium ${
          row.confidence === "HIGH"
            ? "text-green-700"
            : row.confidence === "MEDIUM"
            ? "text-yellow-600"
            : "text-gray-500"
        }`}
      >
        {row.confidence}
      </td>

      {/* Edge */}
      <td
        className={`p-3 font-semibold ${
          row.best_edge > 0.10
            ? "text-green-700"
            : row.best_edge > 0.05
            ? "text-yellow-600"
            : "text-gray-500"
        }`}
      >
        {(row.best_edge * 100).toFixed(1)}%
      </td>

      {/* Home % */}
      <td className="p-3">
        {((row.home_win_probability ?? 0) * 100).toFixed(1)}%
      </td>

      {/* Draw % */}
      <td className="p-3">
        {((row.draw_probability ?? 0) * 100).toFixed(1)}%
      </td>

      {/* Away % */}
      <td className="p-3">
        {((row.away_win_probability ?? 0) * 100).toFixed(1)}%
      </td>

      {/* Lineup Impact */}
      <td className="p-3">
        {row.home_lineup_penalty > 0 || row.away_lineup_penalty > 0 ? (
          <span className="text-red-600 font-medium">
            H: -{row.home_lineup_penalty} / A: -{row.away_lineup_penalty}
          </span>
        ) : (
          <span className="text-gray-400">None</span>
        )}
      </td>

    </tr>
  );
})
  )}
</tbody>
          </table>
        </div>

        {!isPro && visibleRows.length > 1 && (
  <div className="mt-4 rounded-2xl border border-gray-200 bg-gray-50 p-4">
    <p className="mb-2 text-sm font-medium text-gray-700">
      More Pro Signals
    </p>

    <div className="space-y-2">
      {visibleRows.slice(1, 4).map((row, i) => (
        <div
          key={i}
          className="flex items-center justify-between rounded-xl border border-gray-200 bg-white px-4 py-3 opacity-60 blur-[1px]"
        >
          <span className="font-medium">{row.match}</span>
          <span>{row.best_bet}</span>
          <span>{(row.best_edge * 100).toFixed(1)}%</span>
        </div>
      ))}
    </div>
  </div>
)}


        {/* Paywall */}
        {!isPro && (
  <div className="mt-8 rounded-2xl border border-amber-200 bg-gradient-to-br from-amber-50 to-white p-6 shadow-sm">
    <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
      <div>
        <p className="mb-2 text-sm font-semibold uppercase tracking-wide text-amber-700">
          Pro Access
        </p>
        <h3 className="text-2xl font-bold text-gray-900">
          Unlock every signal before the market moves
        </h3>
        <p className="mt-2 max-w-2xl text-gray-600">
          Get full access to all model picks, stronger value edges, and lineup-driven signals in one dashboard.
        </p>

        <ul className="mt-4 space-y-2 text-sm text-gray-700">
          <li>✅ Full list of daily signals</li>
          <li>✅ Strongest value bets ranked first</li>
          <li>✅ Lineup impact visibility</li>
          <li>✅ Faster decisions before odds shift</li>
        </ul>
      </div>

      <div className="rounded-2xl border border-amber-200 bg-white p-5 text-center shadow-sm md:min-w-[220px]">
        <p className="text-sm text-gray-500">Monthly plan</p>
        <p className="mt-2 text-3xl font-bold text-gray-900">£19</p>
        <p className="text-sm text-gray-500">per month</p>

        <button className="mt-4 w-full rounded-xl bg-black py-3 text-white font-medium hover:opacity-90 transition">
          Upgrade to Pro
        </button>

        <p className="mt-3 text-xs text-gray-400">
          Cancel anytime
        </p>
      </div>
    </div>
  </div>
)}

