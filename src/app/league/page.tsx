"use client";

import { useState, useEffect } from "react";

const platforms = [
  { id: "espn", name: "ESPN" },
  { id: "yahoo", name: "Yahoo" },
  { id: "sleeper", name: "Sleeper" },
  { id: "cbs", name: "CBS" },
  { id: "nfl", name: "NFL.com" },
];

type Player = { id?: string; name: string; pos: string; team?: string; current?: number; projected?: number };

export default function LeaguePage() {
  const [selected, setSelected] = useState("espn");
  const [lineup, setLineup] = useState<Player[]>([]);
  const [saved, setSaved] = useState(false);
  const [leagueId, setLeagueId] = useState("");
  const [espnS2, setEspnS2] = useState("");
  const [swid, setSwid] = useState("");
  const [connectStatus, setConnectStatus] = useState("");
  const [search, setSearch] = useState("");
  const [results, setResults] = useState<Player[]>([]);
  const [searching, setSearching] = useState(false);

  useEffect(() => {
    const storedLineup = localStorage.getItem("ffLineup");
    if (storedLineup) {
      try {
        const data = JSON.parse(storedLineup);
        setSelected(data.platform || "espn");
        setLineup(data.lineup || []);
      } catch {}
    }
    const storedCreds = localStorage.getItem("ffCreds");
    if (storedCreds) {
      try {
        const data = JSON.parse(storedCreds);
        setLeagueId(data.leagueId || "");
        setEspnS2(data.espnS2 || "");
        setSwid(data.swid || "");
        setSelected(data.platform || "espn");
      } catch {}
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(
      "ffCreds",
      JSON.stringify({ platform: selected, leagueId, espnS2, swid })
    );
  }, [selected, leagueId, espnS2, swid]);

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

  const doSearch = async () => {
    if (!search.trim()) return;
    setSearching(true);
    try {
      const res = await fetch(`/api/players?q=${encodeURIComponent(search)}`);
      const data = await res.json();
      setResults(data.players || []);
    } catch {
      setResults([]);
    }
    setSearching(false);
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 p-6">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-2xl font-bold mb-2 text-slate-900 dark:text-white">My Lineup</h1>
        <p className="text-slate-600 dark:text-slate-300 mb-6">
          Connect your league or search all NFL players. Your info is saved in this browser.
        </p>

        <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-5 mb-6">
          <h2 className="font-semibold mb-3 text-slate-900 dark:text-white">Platform</h2>
          <div className="flex flex-wrap gap-2 mb-4">
            {platforms.map((p) => (
              <button
                key={p.id}
                onClick={() => setSelected(p.id)}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium border ${
                  selected === p.id
                    ? "bg-emerald-600 text-white border-emerald-600"
                    : "bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white border-slate-300 dark:border-slate-600"
                }`}
              >
                {p.name}
              </button>
            ))}
          </div>

          <h3 className="font-medium text-sm mb-2 text-slate-900 dark:text-white">League Credentials (saved automatically)</h3>
          <div className="space-y-2 mb-4">
            <input
              type="text"
              value={leagueId}
              onChange={(e) => setLeagueId(e.target.value)}
              placeholder="League ID"
              className="w-full rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-white px-3 py-2 text-sm"
            />
            {selected === "espn" && (
              <>
                <input
                  type="text"
                  value={espnS2}
                  onChange={(e) => setEspnS2(e.target.value)}
                  placeholder="espn_s2 cookie"
                  className="w-full rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-white px-3 py-2 text-xs"
                />
                <input
                  type="text"
                  value={swid}
                  onChange={(e) => setSwid(e.target.value)}
                  placeholder="SWID cookie"
                  className="w-full rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-white px-3 py-2 text-xs"
                />
              </>
            )}
            <p className="text-xs text-emerald-600 dark:text-emerald-400">Credentials save automatically in this browser.</p>
          </div>

          <h3 className="font-medium text-sm mb-2 text-slate-900 dark:text-white">Search All Players</h3>
          <div className="flex gap-2 mb-3">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && doSearch()}
              placeholder="Search name or position (e.g. Mahomes, RB)"
              className="flex-1 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-white px-3 py-2 text-sm"
            />
            <button
              onClick={doSearch}
              disabled={searching}
              className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white"
            >
              {searching ? "..." : "Search"}
            </button>
          </div>
          <div className="flex flex-wrap gap-2 mb-4 max-h-40 overflow-y-auto">
            {results.map((p) => (
              <button
                key={p.id || p.name}
                onClick={() => addPlayer(p)}
                className="px-2 py-1 text-xs rounded border border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white hover:border-emerald-500"
              >
                {p.pos} {p.name} {p.team && `(${p.team})`}
              </button>
            ))}
            {results.length === 0 && search && !searching && (
              <p className="text-xs text-slate-500">No results. Try another search.</p>
            )}
          </div>

          <h3 className="font-medium text-sm mb-2 text-slate-900 dark:text-white">Your Lineup ({lineup.length}/9)</h3>
          <div className="space-y-1 mb-4">
            {lineup.map((p) => (
              <div key={p.name} className="flex items-center justify-between text-sm py-1 border-b border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white">
                <div>
                  <span className="font-mono text-xs text-slate-500 dark:text-slate-400 mr-2">{p.pos}</span>
                  {p.name}
                  {p.team && <span className="text-xs text-slate-400 ml-1">({p.team})</span>}
                </div>
                <button onClick={() => removePlayer(p.name)} className="text-red-500 text-xs">Remove</button>
              </div>
            ))}
            {lineup.length === 0 && <p className="text-xs text-slate-500 dark:text-slate-400">Search and add players above</p>}
          </div>

          <button
            onClick={handleSave}
            className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-700"
          >
            Save Lineup
          </button>
          {saved && <p className="text-xs text-emerald-600 dark:text-emerald-400 mt-2">Lineup saved.</p>}
        </div>

        <a href="/" className="inline-block mt-4 text-emerald-600 dark:text-emerald-400 text-sm">
          ← Back to Hub
        </a>
      </div>
    </div>
  );
}
