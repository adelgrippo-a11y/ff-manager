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
    { title: "My League", desc: "Open your league app", href: myLeagueHref },
    { title: "Power Rankings", desc: "See where you stand", href: "https://www.fantasypros.com/nfl/myplaybook/" },
    { title: "Start / Sit", desc: "Optimize your lineup", href: "https://fantasyfootballstarts.com/" },
    { title: "ROS Rankings", desc: "Rest of season outlook", href: "https://www.fantasypros.com/nfl/rankings/ros-overall.php" },
    { title: "NFL Injuries", desc: "Latest updates", href: "https://www.nfl.com/injuries/" },
    { title: "Stream Live", desc: "RedZone (YouTube app)", href: "https://www.youtube.com/live/LxJIVjEZJM8" },
    { title: "Highlights", desc: "Top plays", href: "https://www.nfl.com/videos/" },
    { title: "X Feed", desc: "Live NFL chatter", href: "https://x.com/NFL" },
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
            <a href="/api/auth/signin" className="rounded-lg bg-accent px-3 py-1 text-sm text-white">
              Sign in
            </a>
          </div>
        </header>

        <main className="flex-1 px-4 py-6 max-w-4xl mx-auto w-full space-y-6 pb-20">
          <section className="card p-4">
            <div className="flex items-start justify-between mb-3">
              <div>
                <h2 className="text-lg font-bold">My Lineup</h2>
                <p className="text-muted text-xs">Week 11</p>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-accent">{totalCurrent.toFixed(1)}</div>
                <div className="text-xs text-muted">{totalProj.toFixed(1)} proj</div>
              </div>
            </div>
            <div className="space-y-1">
              {lineup.map((player) => (
                <div key={player.pos + player.name} className="flex items-center justify-between text-xs py-1 border-b border-border last:border-0">
                  <div className="flex items-center gap-2">
                    <span className="w-7 font-mono text-[10px] font-semibold text-muted">{player.pos}</span>
                    <span className="font-medium">{player.name}</span>
                    <span className="text-[10px] text-muted">{player.opp}</span>
                  </div>
                  <div className="text-right font-semibold">{player.current}<span className="text-muted text-[10px] font-normal ml-1">/{player.proj}</span></div>
                </div>
              ))}
            </div>
          </section>

          <section className="card p-4">
            <h3 className="text-sm font-semibold mb-3">vs Opponent</h3>
            <div className="space-y-2">
              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span>You</span>
                  <span className="font-medium">{totalCurrent.toFixed(1)} / {totalProj.toFixed(1)}</span>
                </div>
                <div className="h-2 bg-border rounded-full overflow-hidden">
                  <div className="h-full bg-accent rounded-full" style={{ width: `${Math.min(100, (totalCurrent / Math.max(totalProj, 1)) * 100)}%` }} />
                </div>
              </div>
              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span>Opponent</span>
                  <span className="font-medium">0.0 / 0.0</span>
                </div>
                <div className="h-2 bg-border rounded-full overflow-hidden">
                  <div className="h-full bg-muted rounded-full" style={{ width: "0%" }} />
                </div>
              </div>
            </div>
            <p className="text-[10px] text-muted mt-2">Opponent data loads once your league is connected.</p>
          </section>

          <section>
            <h3 className="text-lg font-semibold mb-3">Actions</h3>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
              {quickActions.map((action) => (
                <a key={action.title} href={action.href} target={action.href.startsWith("http") ? "_blank" : undefined} rel={action.href.startsWith("http") ? "noopener noreferrer" : undefined} className="card p-4 hover:border-accent transition text-center">
                  <div className="font-medium text-sm">{action.title}</div>
                </a>
              ))}
            </div>
          </section>
        </main>

        <nav className="lg:hidden sticky bottom-0 border-t border-border bg-card flex justify-around py-2 text-xs z-10">
          {["League", "Rankings", "Injuries", "Streams", "More"].map((item) => (
            <a key={item} href={item === "League" ? "/league" : item === "Rankings" ? "/rankings" : item === "Injuries" ? "/injuries" : item === "Streams" ? "/streams" : "#"} className="flex flex-col items-center py-1 px-2 text-muted">
              {item}
            </a>
          ))}
        </nav>
      </div>
    </div>
  );
}
