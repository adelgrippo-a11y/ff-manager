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
  const [teams, setTeams] = useState<any[]>([]);
  const [teamsStatus, setTeamsStatus] = useState("");
  const [searching, setSearching] = useState(false);

  useEffect(() => {
    if (window.location.hash.startsWith("#import=")) {
      try {
        const raw = decodeURIComponent(window.location.hash.slice(8));
        const data = JSON.parse(raw);
        if (data.lineup?.length) {
          setLineup(data.lineup);
          setSelected(data.platform || "espn");
          if (data.leagueId) setLeagueId(data.leagueId);
          localStorage.setItem("ffLineup", JSON.stringify({ platform: data.platform || "espn", lineup: data.lineup }));
          window.history.replaceState(null, "", window.location.pathname);
          setConnectStatus(`Loaded ${data.teamName || "roster"} from ESPN`);
        }
      } catch {}
    }

    const storedLineup = localStorage.getItem("ffLineup");
    if (storedLineup && !window.location.hash.startsWith("#import=")) {
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

  const handleSave = async () => {
    localStorage.setItem("ffLineup", JSON.stringify({ platform: selected, lineup }));
    window.dispatchEvent(new Event("storage"));
    setSaved(true);
    try {
      const sessionRes = await fetch("/api/auth/session");
      const session = await sessionRes.json();
      if (session?.user?.id) {
        await fetch("/api/sync", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ userId: session.user.id, lineup, creds: { platform: selected, leagueId, espnS2, swid } }),
        });
      }
    } catch {}
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
      <header className="border-b border-border bg-card px-4 py-3 flex items-center justify-between">
        <div>
          <a href="/" className="text-accent text-sm">← Back</a>
          <h1 className="text-xl font-bold mt-1">My Lineup</h1>
        </div>
        <button
          onClick={() => {
            const isDark = document.documentElement.classList.toggle("dark");
            localStorage.setItem("theme", isDark ? "dark" : "light");
          }}
          className="rounded-full px-3 py-1 text-sm bg-border"
        >
          🌙
        </button>
      </header>
      <main className="px-4 py-6 max-w-lg mx-auto space-y-4">
        <p className="text-sm text-muted">Connect your league or search players. Saved in this browser.</p>
        {connectStatus && <p className="text-sm text-accent">{connectStatus}</p>}

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
                try {
                  const year = new Date().getFullYear();
                  const url = `https://fantasy.espn.com/apis/v3/games/ffl/seasons/${year}/segments/0/leagues/${leagueId.trim()}?view=mRoster`;
                  const headers: HeadersInit = { Accept: "application/json" };
                  if (espnS2 && swid) {
                    headers["Cookie"] = `espn_s2=${espnS2}; SWID=${swid}`;
                  }
                  const res = await fetch(url, { headers, credentials: "include" });
                  if (!res.ok) {
                    setTeamsStatus(`ESPN ${res.status}`);
                    return;
                  }
                  const data = await res.json();
                  const teams = (data.teams || []).map((t: any) => ({
                    id: t.id,
                    name: t.location ? `${t.location} ${t.nickname}` : `Team ${t.id}`,
                    players: (t.roster?.entries || []).map((e: any) => e.playerPoolEntry?.player?.fullName).filter(Boolean),
                  }));
                  setTeams(teams);
                  setTeamsStatus(`${teams.length} teams found`);
                } catch (e: any) {
                  setTeamsStatus(e?.message || "fetch failed");
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
          {lineup.length === 0 && <p className="text-xs text-muted">Search and add players above, or use the ESPN extension</p>}
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
            <button onClick={handleSave} className="btn-gold mt-3">{saved ? "Saved" : "Save Lineup"}</button>
          )}
        </div>
      </main>
    </div>
  );
}
