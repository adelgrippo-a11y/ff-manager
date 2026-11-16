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
  const [search, setSearch] = useState("");
  const [results, setResults] = useState<Player[]>([]);
  const [teams, setTeams] = useState<any[]>([]);
  const [teamsStatus, setTeamsStatus] = useState("");
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
    localStorage.setItem("ffCreds", JSON.stringify({ platform: selected, leagueId, espnS2, swid }));
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
    window.dispatchEvent(new Event("storage"));
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
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card px-4 py-3">
        <a href="/" className="text-accent text-sm">← Back</a>
        <h1 className="text-xl font-bold mt-1">My Lineup</h1>
      </header>
      <main className="px-4 py-6 max-w-lg mx-auto space-y-4">
        <p className="text-sm text-muted">Connect your league or search players. Saved in this browser.</p>

        <div className="card p-4">
          <h2 className="font-semibold mb-3">Platform</h2>
          <div className="flex flex-wrap gap-2 mb-4">
            {platforms.map((p) => (
              <button
                key={p.id}
                onClick={() => setSelected(p.id)}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium border ${
                  selected === p.id
                    ? "bg-accent text-white border-accent"
                    : "bg-border text-foreground border-border"
                }`}
              >
                {p.name}
              </button>
            ))}
          </div>

          <h3 className="font-medium text-sm mb-2">League Credentials</h3>
          <div className="space-y-2 mb-4">
            <input
              type="text"
              value={leagueId}
              onChange={(e) => setLeagueId(e.target.value)}
              placeholder="League ID"
              className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm"
            />
            {selected === "espn" && (
              <>
                <input
                  type="text"
                  value={espnS2}
                  onChange={(e) => setEspnS2(e.target.value)}
                  placeholder="espn_s2 cookie"
                  className="w-full rounded-lg border border-border bg-background px-3 py-2 text-xs"
                />
                <input
                  type="text"
                  value={swid}
                  onChange={(e) => setSwid(e.target.value)}
                  placeholder="SWID cookie"
                  className="w-full rounded-lg border border-border bg-background px-3 py-2 text-xs"
                />
              </>
            )}
            <p className="text-xs text-accent">Credentials save automatically.</p>
            <button
              onClick={async () => {
                if (!leagueId.trim()) return;
                setTeamsStatus("Loading teams...");
                const params = new URLSearchParams({ leagueId: leagueId.trim(), platform: selected });
                if (espnS2) params.set("espnS2", espnS2);
                if (swid) params.set("swid", swid);
                try {
                  const res = await fetch(`/api/teams?${params}`);
                  const data = await res.json();
                  setTeams(data.teams || []);
                  setTeamsStatus(data.error || `${data.teams?.length || 0} teams found`);
                } catch {
                  setTeamsStatus("fetch failed");
                }
              }}
              className="btn-accent"
            >
              Load Teams
            </button>
            {teamsStatus && <p className="text-xs text-muted">{teamsStatus}</p>}
          </div>

          <h3 className="font-medium text-sm mb-2">Search All Players</h3>
          <div className="flex gap-2 mb-3">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && doSearch()}
              placeholder="Type name, last name, or position"
              className="flex-1 rounded-lg border border-border bg-background px-3 py-2 text-sm"
            />
            <button onClick={doSearch} className="btn-accent" disabled={searching}>Search</button>
          </div>
          {results.length > 0 && (
            <div className="space-y-1 max-h-40 overflow-y-auto">
              {results.map((p) => (
                <div key={p.name} className="flex items-center justify-between text-sm py-1">
                  <span>{p.name} <span className="text-muted text-xs">{p.pos}</span></span>
                  <button onClick={() => addPlayer(p)} className="text-xs text-accent">Add</button>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="card p-4">
          <h3 className="font-semibold mb-2">Your Lineup ({lineup.length}/9)</h3>
          {lineup.length === 0 && <p className="text-xs text-muted">Search and add players above</p>}
          <div className="space-y-1">
            {lineup.map((p) => (
              <div key={p.name} className="flex items-center justify-between text-sm py-1 border-b border-border last:border-0">
                <div>
                  <span className="font-medium">{p.name}</span>
                  <span className="text-xs text-muted ml-2">{p.pos}</span>
                </div>
                <button onClick={() => removePlayer(p.name)} className="text-xs text-muted">Remove</button>
              </div>
            ))}
          </div>
          {lineup.length > 0 && (
            <button onClick={handleSave} className="btn-accent mt-3">{saved ? "Saved" : "Save Lineup"}</button>
          )}
        </div>
      </main>
    </div>
  );
}
