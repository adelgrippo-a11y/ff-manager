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

  const quickActions = [
    { title: "My League", href: myLeagueHref },
    { title: "Rankings", href: "https://www.fantasypros.com/nfl/myplaybook/" },
    { title: "Start / Sit", href: "https://fantasyfootballstarts.com/" },
    { title: "Injuries", href: "https://www.nfl.com/injuries/" },
    { title: "Streams", href: "/streams" },
    { title: "More", href: "#" },
  ];

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
            <button className="lg:hidden" onClick={() => setSidebarOpen(!sidebarOpen)}>☰</button>
            <h1 className="text-lg font-bold text-accent lg:hidden">FF Manager</h1>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={toggleTheme} className="rounded-full px-3 py-1 text-sm bg-border">
              {dark ? "☀️" : "🌙"}
            </button>
            <a href="/api/auth/signin" className="btn-accent">Sign in</a>
          </div>
        </header>

        <main className="flex-1 px-4 py-6 max-w-lg mx-auto w-full space-y-5 pb-24">
          <section className="card p-5">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold">My Lineup</h2>
              <span className="text-xs text-muted border border-border rounded-full px-2 py-1">Week 11</span>
            </div>
            <div className="space-y-3">
              {lineup.map((player) => (
                <div key={player.pos + player.name} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="w-10 h-10 rounded-full bg-emerald-100 dark:bg-emerald-900/40 text-accent flex items-center justify-center text-xs font-semibold">{player.pos}</span>
                    <div>
                      <div className="font-medium">{player.name}</div>
                      <div className="text-xs text-muted">{player.opp}</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-bold text-accent">{player.current}</div>
                    <div className="text-[10px] text-muted">PTS</div>
                  </div>
                </div>
              ))}
            </div>
            <div className="flex justify-between mt-4 pt-3 border-t border-border text-sm">
              <div>
                <div className="text-muted text-xs">Current</div>
                <div className="text-xl font-bold text-accent">{totalCurrent.toFixed(1)}</div>
              </div>
              <div className="text-right">
                <div className="text-muted text-xs">Projected</div>
                <div className="text-xl font-bold">{totalProj.toFixed(1)}</div>
              </div>
            </div>
          </section>

          <section className="card p-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold">vs Opponent</h3>
              <span className="text-xs text-accent">Live</span>
            </div>
            <div className="flex items-end gap-8 h-32">
              <div className="flex-1 text-center">
                <div className="text-sm font-medium mb-1">{totalCurrent.toFixed(1)}</div>
                <div className="bg-accent rounded-t mx-auto" style={{ height: `${Math.min(100, (totalCurrent / Math.max(totalProj, 1)) * 100)}%`, width: "48px" }} />
                <div className="text-xs text-muted mt-1">You</div>
              </div>
              <div className="flex-1 text-center">
                <div className="text-sm font-medium mb-1">0.0</div>
                <div className="bg-slate-300 dark:bg-slate-600 rounded-t mx-auto" style={{ height: "20%", width: "48px" }} />
                <div className="text-xs text-muted mt-1">Opponent</div>
              </div>
            </div>
          </section>

          <section>
            <h3 className="font-semibold mb-3">Quick Actions</h3>
            <div className="grid grid-cols-3 gap-3">
              {quickActions.map((action) => (
                <a key={action.title} href={action.href} target={action.href.startsWith("http") ? "_blank" : undefined} rel={action.href.startsWith("http") ? "noopener noreferrer" : undefined} className="card p-4 text-center text-sm font-medium hover:border-accent transition">
                  {action.title}
                </a>
              ))}
            </div>
          </section>
        </main>

        <nav className="lg:hidden sticky bottom-0 border-t border-border bg-card flex justify-around py-2 text-xs z-10">
          {["Home", "League", "Rankings", "More"].map((item) => (
            <a key={item} href={item === "Home" ? "/" : item === "League" ? "/league" : item === "Rankings" ? "/rankings" : "#"} className="flex flex-col items-center py-1 text-muted">
              {item}
            </a>
          ))}
        </nav>
      </div>
    </div>
  );
}
