"use client";

import { useState } from "react";

export default function LeaguePage() {
  const [leagueId, setLeagueId] = useState("");
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    if (leagueId.trim()) {
      localStorage.setItem("sleeperLeagueId", leagueId.trim());
      setSaved(true);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 p-6">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-2xl font-bold mb-2">My League</h1>
        <p className="text-slate-500 dark:text-slate-400 mb-6">
          Connect your Sleeper league to load real standings and lineup
        </p>

        <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-5 mb-6">
          <h2 className="font-semibold mb-3">Sleeper League ID</h2>
          <div className="flex gap-2">
            <input
              type="text"
              value={leagueId}
              onChange={(e) => setLeagueId(e.target.value)}
              placeholder="e.g. 1048123456789012345"
              className="flex-1 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-2 text-sm"
            />
            <button
              onClick={handleSave}
              className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-700"
            >
              Save
            </button>
          </div>
          {saved && (
            <p className="text-xs text-emerald-600 dark:text-emerald-400 mt-2">
              Saved. Real data loading coming in the next update.
            </p>
          )}
          <p className="text-xs text-slate-500 mt-3">
            Find your league ID in the Sleeper app URL or league settings.
          </p>
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-5">
          <h2 className="font-semibold mb-3">This Week</h2>
          <p className="text-sm text-slate-600 dark:text-slate-400">
            Enter a league ID above to pull live scores and roster.
          </p>
        </div>

        <a href="/" className="inline-block mt-6 text-emerald-600 dark:text-emerald-400 text-sm">
          ← Back to Hub
        </a>
      </div>
    </div>
  );
}
