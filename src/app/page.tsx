"use client";

import { useState, useEffect } from "react";

export default function Home() {
  const [dark, setDark] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [platform, setPlatform] = useState("espn");

  useEffect(() => {
    const isDark = localStorage.getItem("theme") === "dark" ||
      (!localStorage.getItem("theme") && window.matchMedia("(prefers-color-scheme: dark)").matches);
    setDark(isDark);
    if (isDark) document.documentElement.classList.add("dark");

    const creds = localStorage.getItem("ffCreds");
    if (creds) {
      try {
        const data = JSON.parse(creds);
        if (data.platform) setPlatform(data.platform);
      } catch {}
    }
  }, []);

  const toggleTheme = () => {
    const next = !dark;
    setDark(next);
    if (next) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  };

  const [lineup, setLineup] = useState([
    { pos: "QB", name: "J. Allen", opp: "vs MIA", proj: 22.4, current: 18.2 },
    { pos: "RB", name: "C. McCaffrey", opp: "vs SEA", proj: 18.1, current: 14.6 },
    { pos: "RB", name: "B. Robinson", opp: "vs TB", proj: 15.8, current: 12.3 },
    { pos: "WR", name: "T. Hill", opp: "vs BUF", proj: 16.9, current: 9.4 },
    { pos: "WR", name: "A. St. Brown", opp: "vs CHI", proj: 15.2, current: 11.1 },
    { pos: "TE", name: "T. Kelce", opp: "vs LV", proj: 12.7, current: 8.8 },
    { pos: "FLEX", name: "D. Samuel", opp: "vs GB", proj: 13.4, current: 6.2 },
    { pos: "K", name: "J. Tucker", opp: "vs CIN", proj: 8.5, current: 5.0 },
    { pos: "DEF", name: "BAL", opp: "vs CIN", proj: 7.2, current: 4.0 },
  ]);

  useEffect(() => {
    const load = () => {
      const stored = localStorage.getItem("ffLineup");
      if (stored) {
        try {
          const data = JSON.parse(stored);
          if (data.lineup?.length) {
            setLineup(
              data.lineup.map((p: any) => ({
                pos: p.pos,
                name: p.name,
                opp: p.team ? `vs ${p.team}` : "",
                proj: p.projected || 0,
                current: p.current || 0,
              }))
            );
          }
        } catch {}
      }
    };
    load();
    window.addEventListener("focus", load);
    window.addEventListener("storage", load);
    return () => {
      window.removeEventListener("focus", load);
      window.removeEventListener("storage", load);
    };
  }, []);

  useEffect(() => {
    if (!lineup.length) return;
    const names = lineup.map((p) => p.name).join(",");
    fetch(`/api/points?names=${encodeURIComponent(names)}`)
      .then((r) => r.json())
      .then((data) => {
        if (data.points && Object.keys(data.points).length) {
          setLineup((prev) =>
            prev.map((p) => ({
              ...p,
              proj: data.points[p.name]?.projected ?? p.proj,
              current: data.points[p.name]?.current ?? p.current,
            }))
          );
        }
      })
      .catch(() => {});
  }, [lineup.map((p) => p.name).join(",")]);

  const totalProj = lineup.reduce((sum, p) => sum + p.proj, 0);
  const totalCurrent = lineup.reduce((sum, p) => sum + p.current, 0);

  const leagueLinks: Record<string, string> = {
    espn: "https://fantasy.espn.com/football/",
    yahoo: "https://football.fantasysports.yahoo.com/",
    sleeper: "https://sleeper.com/leagues",
    cbs: "https://www.cbssports.com/fantasy/football/",
    nfl: "https://fantasy.nfl.com/",
  };
  const myLeagueHref = leagueLinks[platform] || leagueLinks.espn;

  return (
    <div className="flex min-h-screen bg-background">
      <aside className="hidden lg:flex lg:flex-col w-64 border-r border-border bg-card p-6">
        <h1 className="text-xl font-bold text-accent mb-8">FF Manager</h1>
        <nav className="space-y-1">
          {["My League", "Rankings", "Injuries", "Streams", "More"].map((item) => (
            <a key={item} href={item === "My League" ? "/league" : item === "Rankings" ? "/rankings" : item === "Injuries" ? "/injuries" : item === "Streams" ? "/streams" : "#"} className="block px-3 py-2 rounded-lg hover:bg-border text-sm font-medium">
              {item}
            </a>
          ))}
        </nav>
      </aside>

      <div className="flex-1 flex flex-col">
        <header className="border-b border-border bg-card px-4 py-3 flex items-center justify-between lg:px-6">
          <div className="flex items-center gap-3">
            <button className="lg:hidden" onClick={() => setSidebarOpen(!sidebarOpen)}>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 6h16M4 12h16M4 18h16"/></svg>
            </button>
            <h1 className="text-lg font-bold text-accent lg:hidden">FF Manager</h1>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={toggleTheme} className="rounded-full px-3 py-1 text-sm bg-border">
              {dark ? "☀️" : "🌙"}
            </button>
            <a href="/api/auth/signin" className="btn-accent">Sign in</a>
          </div>
        </header>

        <main className="flex-1 px-4 py-6 max-w-lg mx-auto w-full space-y-4 pb-20">
          <section className="card p-2.5">
            <div className="flex items-center justify-between mb-1.5">
              <h2 className="text-sm font-bold">My Lineup</h2>
              <span className="text-[9px] text-muted border border-border rounded-full px-1 py-0.5">Week 11</span>
            </div>
            <div className="space-y-1">
              {lineup.map((player) => (
                <div key={player.pos + player.name} className="flex items-center justify-between">
                  <div className="flex items-center gap-1">
                    <span className="w-6 h-6 rounded-full bg-emerald-100 dark:bg-emerald-900/40 text-accent flex items-center justify-center text-[8px] font-semibold">{player.pos}</span>
                    <div>
                      <div className="text-[11px] font-medium">{player.name}</div>
                      <div className="text-[8px] text-muted">{player.opp}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-0.5">
                    <div className="text-right">
                      <div className="text-[11px] font-bold text-accent">{player.current}</div>
                      <div className="text-[7px] text-muted">PTS</div>
                    </div>
                    <div className="w-3 h-3 rounded-full bg-accent text-white text-[7px] flex items-center justify-center">✓</div>
                  </div>
                </div>
              ))}
            </div>
            <div className="flex justify-between mt-1.5 pt-1 border-t border-border text-[10px]">
              <div>
                <div className="text-muted text-[8px]">Current</div>
                <div className="font-bold text-accent">{totalCurrent.toFixed(1)}</div>
              </div>
              <div className="text-right">
                <div className="text-muted text-[8px]">Projected</div>
                <div className="font-bold">{totalProj.toFixed(1)}</div>
              </div>
            </div>
          </section>

          <section className="card p-3">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-semibold">vs Opponent</h3>
              <span className="text-xs text-accent">Live</span>
            </div>
            <div className="space-y-2">
              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span>You</span>
                  <span className="font-medium text-accent">{totalCurrent.toFixed(1)}</span>
                </div>
                <div className="h-3 bg-border rounded-full overflow-hidden">
                  <div className="h-full bg-accent rounded-full" style={{ width: `${Math.min(100, (totalCurrent / Math.max(totalProj, 1)) * 100)}%` }} />
                </div>
              </div>
              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span>Opponent</span>
                  <span className="font-medium">0.0</span>
                </div>
                <div className="h-3 bg-border rounded-full overflow-hidden">
                  <div className="h-full bg-slate-400 rounded-full" style={{ width: "0%" }} />
                </div>
              </div>
            </div>
          </section>
        </main>

        <nav className="lg:hidden fixed bottom-0 left-0 right-0 border-t border-border bg-card flex justify-around py-2 text-xs z-20">
          <a href="/" className="flex flex-col items-center py-1 text-accent">
            <svg className="w-5 h-5 mb-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"/></svg>
            Home
          </a>
          <a href={myLeagueHref} target="_blank" className="flex flex-col items-center py-1 text-muted">
            <svg className="w-5 h-5 mb-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z"/></svg>
            League
          </a>
          <a href="https://fantasyfootballstarts.com/" target="_blank" className="flex flex-col items-center py-1 text-muted">
            <svg className="w-5 h-5 mb-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z"/></svg>
            Start/Sit
          </a>
          <a href="/streams" className="flex flex-col items-center py-1 text-muted">
            <svg className="w-5 h-5 mb-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"/></svg>
            Streams
          </a>
          <a href="/rankings" className="flex flex-col items-center py-1 text-muted">
            <svg className="w-5 h-5 mb-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"/></svg>
            Rankings
          </a>
        </nav>
      </div>
    </div>
  );
}
