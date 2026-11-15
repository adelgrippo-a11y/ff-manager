"use client";

import { useState, useEffect } from "react";

const platforms = [
  { id: "espn", name: "ESPN", placeholder: "League ID" },
  { id: "yahoo", name: "Yahoo", placeholder: "League ID" },
  { id: "sleeper", name: "Sleeper", placeholder: "League ID" },
  { id: "cbs", name: "CBS", placeholder: "League ID" },
  { id: "nfl", name: "NFL.com", placeholder: "League ID" },
];

export default function LeaguePage() {
  const [selected, setSelected] = useState("espn");
  const [leagueId, setLeagueId] = useState("");
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem("ffLeague");
    if (stored) {
      try {
        const data = JSON.parse(stored);
        setSelected(data.platform || "espn");
        setLeagueId(data.id || "");
      } catch {}
    }
  }, []);

  const handleSave = () => {
    if (leagueId.trim()) {
      localStorage.setItem(
        "ffLeague",
        JSON.stringify({ platform: selected, id: leagueId.trim() })
      );
      setSaved(true);
    }
  };

  const current = platforms.find((p) => p.id === selected) || platforms[0];

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 p-6">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-2xl font-bold mb-2">My League</h1>
        <p className="text-slate-500 dark:text-slate-400 mb-6">
          Connect your league (ESPN, Yahoo, Sleeper, CBS, NFL.com)
        </p>

        <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-5 mb-6">
          <h2 className="font-semibold mb-3">League Platform</h2>
          <div className="flex flex-wrap gap-2 mb-4">
            {platforms.map((p) => (
              <button
                key={p.id}
                onClick={() => {
                  setSelected(p.id);
                  setSaved(false);
                }}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium border ${
                  selected === p.id
                    ? "bg-emerald-600 text-white border-emerald-600"
                    : "bg-white dark:bg-slate-800 border-slate-300 dark:border-slate-700"
                }`}
              >
                {p.name}
              </button>
            ))}
          </div>

          <h3 className="font-medium text-sm mb-2">{current.name} League ID</h3>
          <div className="flex gap-2">
            <input
              type="text"
              value={leagueId}
              onChange={(e) => {
                setLeagueId(e.target.value);
                setSaved(false);
              }}
              placeholder={current.placeholder}
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
              Saved {current.name} league. Live data pull coming next.
            </p>
          )}
          <p className="text-xs text-slate-500 mt-3">
            Find your league ID in the app URL or league settings.
          </p>
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-5">
          <h2 className="font-semibold mb-3">This Week</h2>
          <p className="text-sm text-slate-600 dark:text-slate-400">
            Select a platform and enter your league ID to pull live scores and roster.
          </p>
        </div>

        <a href="/" className="inline-block mt-6 text-emerald-600 dark:text-emerald-400 text-sm">
          ← Back to Hub
        </a>
      </div>
    </div>
  );
}
