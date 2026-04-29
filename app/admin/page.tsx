"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@clerk/nextjs";

export default function AdminPage() {
  const router = useRouter();
  const { user, isLoaded } = useUser();

  const ADMIN_EMAIL = "lo9791@hotmail.com"; // 🔥 CHANGE THIS

  const [match, setMatch] = useState("");
  const [pick, setPick] = useState("");
  const [market, setMarket] = useState("");
  const [odds, setOdds] = useState("");
  const [confidence, setConfidence] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // 🔐 Protect route
  if (!isLoaded) return null;

  if (user?.primaryEmailAddress?.emailAddress !== ADMIN_EMAIL) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-lg font-semibold">Access denied</p>
      </div>
    );
  }

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/admin/create-signal", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          match,
          pick,
          market,
          odds: parseFloat(odds),
          confidence: parseInt(confidence),
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Something went wrong");
      }

      router.push("/signals");
    } catch (err: any) {
      setError(err.message);
    }

    setLoading(false);
  };

  return (
    <div className="max-w-xl mx-auto py-12">
      <h1 className="text-2xl font-bold mb-6">Admin</h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          placeholder="Match"
          value={match}
          onChange={(e) => setMatch(e.target.value)}
          className="w-full border p-3 rounded"
        />

        <input
          placeholder="Pick"
          value={pick}
          onChange={(e) => setPick(e.target.value)}
          className="w-full border p-3 rounded"
        />

        <input
          placeholder="Market"
          value={market}
          onChange={(e) => setMarket(e.target.value)}
          className="w-full border p-3 rounded"
        />

        <input
          placeholder="Odds (e.g. 1.67)"
          value={odds}
          onChange={(e) => setOdds(e.target.value)}
          className="w-full border p-3 rounded"
        />

        <input
          placeholder="Confidence (e.g. 86)"
          value={confidence}
          onChange={(e) => setConfidence(e.target.value)}
          className="w-full border p-3 rounded"
        />

        {error && (
          <p className="text-red-500 text-sm">{error}</p>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-black text-white py-3 rounded font-semibold"
        >
          {loading ? "Adding..." : "Add Signal"}
        </button>
      </form>
    </div>
  );
}