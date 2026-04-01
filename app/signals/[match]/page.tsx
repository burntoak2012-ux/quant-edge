"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";

type SignalRow = {
  match: string;
  best_bet: string;
  best_edge: number;
  confidence?: string;
  home_win_probability: number;
  draw_probability: number;
  away_win_probability: number;
  home_fair_odds: number;
  draw_fair_odds: number;
  away_fair_odds: number;
  market_home_odds: number;
  market_draw_odds: number;
  market_away_odds: number;
  home_edge?: number;
  draw_edge?: number;
  away_edge?: number;
  home_rating?: number;
  away_rating?: number;
  edge?: number;
};

type SignalResponse = {
  top_picks?: SignalRow[];
  all?: SignalRow[];
};

function slugifyMatch(match: string) {
  return match.trim().toLowerCase().replace(/\s+/g, "-");
}

export default function MatchDetailsPage() {
  const params = useParams();
  const [matchData, setMatchData] = useState<SignalRow | null>(null);
  const [loading, setLoading] = useState(true);

  const routeSlug =
  typeof params?.match === "string"
    ? decodeURIComponent(params.match)
        .trim()
        .toLowerCase()
        .replace(/\s+/g, "-")
    : "";

  useEffect(() => {
    if (!routeSlug) {
      setLoading(false);
      return;
    }

    fetch("http://127.0.0.1:8000/signal")
      .then((res) => res.json())
      .then((data: SignalResponse) => {
        const allSignals = Array.isArray(data?.all) ? data.all : [];
        const topPicks = Array.isArray(data?.top_picks) ? data.top_picks : [];
        const combined = [...allSignals, ...topPicks];

        const found =
          combined.find((row) => slugifyMatch(row.match) === routeSlug) || null;

        setMatchData(found);
      })
      .catch((err) => {
        console.error("ERROR:", err);
        setMatchData(null);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [routeSlug]);

  if (loading) {
    return <div className="p-10">Loading match details...</div>;
  }

  if (!matchData) {
    return (
      <div className="p-10">
        <Link href="/signals" className="text-blue-600 hover:underline">
          ← Back to Signals
        </Link>
        <p className="mt-6">Match not found.</p>
        <p className="mt-2 text-sm text-gray-500">Route slug: {routeSlug}</p>
      </div>
    );
  }

  return (
    <div className="p-10">
      <Link
        href="/signals"
        className="text-blue-600 hover:underline mb-6 inline-block"
      >
        ← Back to Signals
      </Link>

      <h1 className="text-3xl font-bold mb-2">{matchData.match}</h1>
      <p className="text-gray-600 mb-8">
        Detailed value betting breakdown for this match.
      </p>

<div className="grid gap-4 md:grid-cols-3 mb-8">
  <div className="rounded-2xl border border-green-200 bg-green-50 p-5">
    <div className="text-sm text-gray-600 mb-1">Best Bet</div>
    <div className="text-2xl font-bold text-green-700">{matchData.best_bet}</div>
  </div>

  <div className="rounded-2xl border border-blue-200 bg-blue-50 p-5">
    <div className="text-sm text-gray-600 mb-1">Best Edge</div>
    <div className="text-2xl font-bold text-blue-700">
      {(matchData.best_edge * 100).toFixed(1)}%
    </div>
  </div>

  <div className="rounded-2xl border border-yellow-200 bg-yellow-50 p-5">
    <div className="text-sm text-gray-600 mb-1">Confidence</div>
    <div className="text-2xl font-bold text-yellow-700">
      {matchData.confidence || "N/A"}
    </div>
  </div>
</div>

      <div className="grid gap-6 md:grid-cols-2 mb-8">
        <div className="rounded-2xl border border-gray-200 p-6 shadow-sm">
          <h2 className="text-xl font-semibold mb-4">Model Summary</h2>
          <div className="space-y-2 text-sm">
            <p><strong>Best Bet:</strong> {matchData.best_bet}</p>
            <p><strong>Confidence:</strong> {matchData.confidence || "N/A"}</p>
            <p className="text-green-600 font-semibold">
              <strong>Best Edge:</strong> {(matchData.best_edge * 100).toFixed(1)}%
            </p>
            <p><strong>Home Rating:</strong> {matchData.home_rating ?? "N/A"}</p>
            <p><strong>Away Rating:</strong> {matchData.away_rating ?? "N/A"}</p>
            <p><strong>Overall Edge Score:</strong> {matchData.edge ?? "N/A"}</p>
          </div>
        </div>

<div className="mt-6 border rounded-xl p-4">
  <h3 className="font-semibold mb-2">📊 Edge Breakdown</h3>

  <div className="space-y-2 text-sm">
    <p>Home Edge: {((matchData.home_edge ?? 0) * 100).toFixed(1)}%</p>
    <p>Draw Edge: {((matchData.draw_edge ?? 0) * 100).toFixed(1)}%</p>
    <p>Away Edge: {((matchData.away_edge ?? 0) * 100).toFixed(1)}%</p>
  </div>
</div>
        <div className="rounded-2xl border border-gray-200 p-6 shadow-sm">
          <h2 className="text-xl font-semibold mb-4">Probabilities</h2>
          <div className="space-y-2 text-sm">
            <p><strong>Home Win:</strong> {(matchData.home_win_probability * 100).toFixed(1)}%</p>
            <p><strong>Draw:</strong> {(matchData.draw_probability * 100).toFixed(1)}%</p>
            <p><strong>Away Win:</strong> {(matchData.away_win_probability * 100).toFixed(1)}%</p>
          </div>
        </div>
      </div>

<div className="mt-6 rounded-2xl border border-gray-200 p-6 shadow-sm">
  <h2 className="text-xl font-semibold mb-4">Why this is a good bet</h2>

<div className="mt-6 rounded-2xl border border-red-200 bg-red-50 p-6">
  <h2 className="text-xl font-semibold mb-4 text-red-700">
    🚨 Where the market is wrong
  </h2>

  <div className="space-y-3 text-sm text-gray-700">
    <p>
      The bookmaker odds imply a lower probability than our model suggests.
    </p>

    <p>
      Our model gives <strong>{matchData.best_bet}</strong> a probability of{" "}
      <strong>
        {(
          (matchData.best_bet === "HOME"
            ? matchData.home_win_probability
            : matchData.best_bet === "DRAW"
            ? matchData.draw_probability
            : matchData.away_win_probability) * 100
        ).toFixed(1)}%
      </strong>.
    </p>

    <p>
      However, the market odds of{" "}
      <strong>
        {matchData.best_bet === "HOME"
          ? matchData.market_home_odds
          : matchData.best_bet === "DRAW"
          ? matchData.market_draw_odds
          : matchData.market_away_odds}
      </strong>{" "}
      suggest a lower implied probability.
    </p>

    <p>
      This creates a value edge of{" "}
      <strong>{(matchData.best_edge * 100).toFixed(1)}%</strong>.
    </p>
  </div>
</div>

  <div className="space-y-3 text-sm text-gray-700">
    <p>
      The model’s strongest position on this match is <strong>{matchData.best_bet}</strong>,
      with an edge of <strong>{(matchData.best_edge * 100).toFixed(1)}%</strong>.
    </p>

    <p>
      Probabilities are:
      {" "}Home <strong>{(matchData.home_win_probability * 100).toFixed(1)}%</strong>,
      Draw <strong>{(matchData.draw_probability * 100).toFixed(1)}%</strong>,
      Away <strong>{(matchData.away_win_probability * 100).toFixed(1)}%</strong>.
    </p>

    <p>
      Model ratings show <strong>{matchData.home_rating ?? "N/A"}</strong> for the home side
      and <strong>{matchData.away_rating ?? "N/A"}</strong> for the away side.
    </p>

    <p>
      Market odds are Home <strong>{matchData.market_home_odds}</strong>,
      Draw <strong>{matchData.market_draw_odds}</strong>,
      Away <strong>{matchData.market_away_odds}</strong>.
    </p>

    <p>
      Confidence level is <strong>{matchData.confidence || "N/A"}</strong>.
    </p>
  </div>
</div>

      <div className="grid gap-6 md:grid-cols-2 mb-8">
        <div className="rounded-2xl border border-gray-200 p-6 shadow-sm">
          <h2 className="text-xl font-semibold mb-4">Fair Odds</h2>
          <div className="space-y-2 text-sm">
            <p><strong>Home:</strong> {matchData.home_fair_odds}</p>
            <p><strong>Draw:</strong> {matchData.draw_fair_odds}</p>
            <p><strong>Away:</strong> {matchData.away_fair_odds}</p>
          </div>
        </div>

        <div className="rounded-2xl border border-gray-200 p-6 shadow-sm">
          <h2 className="text-xl font-semibold mb-4">Market Odds</h2>
          <div className="space-y-2 text-sm">
            <p><strong>Home:</strong> {matchData.market_home_odds}</p>
            <p><strong>Draw:</strong> {matchData.market_draw_odds}</p>
            <p><strong>Away:</strong> {matchData.market_away_odds}</p>
          </div>
        </div>
      </div>

      <div className="rounded-2xl border border-gray-200 p-6 shadow-sm">
        <h2 className="text-xl font-semibold mb-4">Side Edges</h2>
        <div className="space-y-2 text-sm">
          <p className={(matchData.home_edge ?? 0) > 0 ? "text-green-600" : "text-red-600"}>
            <strong>Home Edge:</strong> {((matchData.home_edge ?? 0) * 100).toFixed(1)}%
          </p>
          <p className={(matchData.draw_edge ?? 0) > 0 ? "text-green-600" : "text-red-600"}>
            <strong>Draw Edge:</strong> {((matchData.draw_edge ?? 0) * 100).toFixed(1)}%
          </p>
          <p className={(matchData.away_edge ?? 0) > 0 ? "text-green-600" : "text-red-600"}>
            <strong>Away Edge:</strong> {((matchData.away_edge ?? 0) * 100).toFixed(1)}%
          </p>
        </div>
      </div>
    </div>
  );
}

