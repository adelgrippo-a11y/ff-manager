"use client";

import { useState, useEffect } from "react";

const platforms = [
  { id: "espn", name: "ESPN" },
  { id: "yahoo", name: "Yahoo" },
  { id: "sleeper", name: "Sleeper" },
  { id: "cbs", name: "CBS" },
  { id: "nfl", name: "NFL.com" },
];

const popular = [
  { name: "Josh Allen", pos: "QB", team: "BUF" },
  { name: "Christian McCaffrey", pos: "RB", team: "SF" },
  { name: "Tyreek Hill", pos: "WR", team: "MIA" },
  { name: "Travis Kelce", pos: "TE", team: "KC" },
  { name: "Justin Tucker", pos: "K", team: "BAL" },
  { name: "Baltimore", pos: "DEF", team: "BAL" },
  { name: "Saquon Barkley", pos: "RB", team: "PHI" },
  { name: "CeeDee Lamb", pos: "WR", team: "DAL" },
  { name: "Amon-Ra St. Brown", pos: "WR", team: "DET" },
  { name: "Deebo Samuel", pos: "WR", team: "SF" },
];

type Player = { name: string; pos: string; team?: string; current?: number; projected?: number };

export default function LeaguePage() {
  const [selected, setSelected] = useState("espn");
  const [lineup, setLineup] = useState<Player[]>([]);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem("ffLineup");
    if (stored) {
      try {
        const data = JSON.parse(stored);
        setSelected(data.platform || "espn");
        setLineup(data.lineup || []);
      } catch {}
    }
  }, []);

  const addPlayer = (p: Player) => {
    if (lineup.length >= 9) return;
    if (lineup.some((x) => x.name === p.name)) return;
    setLineup([...lineup, { ...p, current: 0, projected: 0 }]);
    setSaved(false);
  };

  const removePlayer = (name: string) => {
    setLineup(lineup.filter((p) => p.name !== name));
    setSaved(false);
  };

  const handleSave = () => {
    localStorage.setItem("ffLineup", JSON.stringify({ platform: selected, lineup }));
    setSaved(true);
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 p-6">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-2xl font-bold mb-2">My Lineup</h1>
        <p className="text-slate-500 dark:text-slate-400 mb-6">
          Pick your platform and add players. Points will load from public data.
        </p>

        <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-5 mb-6">
          <h2 className="font-semibold mb-3">Platform</h2>
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

          <h3 className="font-medium text-sm mb-2">Quick Add</h3>
          <div className="flex flex-wrap gap-2 mb-4">
            {popular.map((p) => (
              <button
                key={p.name}
                onClick={() => addPlayer(p)}
                className="px-2 py-1 text-xs rounded border border-slate-300 dark:border-slate-700 hover:border-emerald-500"
              >
                {p.pos} {p.name}
              </button>
            ))}
          </div>

          <h3 className="font-medium text-sm mb-2">Your Lineup ({lineup.length}/9)</h3>
          <div className="space-y-1 mb-4">
            {lineup.map((p) => (
              <div key={p.name} className="flex items-center justify-between text-sm py-1 border-b border-slate-100 dark:border-slate-700">
                <div>
                  <span className="font-mono text-xs text-slate-500 mr-2">{p.pos}</span>
                  {p.name}
                </div>
                <button onClick={() => removePlayer(p.name)} className="text-red-500 text-xs">Remove</button>
              </div>
            ))}
            {lineup.length === 0 && <p className="text-xs text-slate-400">Add players above</p>}
          </div>

          <button
            onClick={handleSave}
            className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-700"
          >
            Save Lineup
          </button>
          {saved && <p className="text-xs text-emerald-600 mt-2">Saved. Points pull coming next.</p>}
        </div>

        <a href="/" className="inline-block mt-4 text-emerald-600 dark:text-emerald-400 text-sm">
          ← Back to Hub
        </a>
      </div>
    </div>
  );
}
