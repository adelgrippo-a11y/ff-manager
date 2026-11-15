"use client";

import { useState, useEffect } from "react";

export default function Home() {
  const [dark, setDark] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    const isDark = localStorage.getItem("theme") === "dark" ||
      (!localStorage.getItem("theme") && window.matchMedia("(prefers-color-scheme: dark)").matches);
    setDark(isDark);
    if (isDark) document.documentElement.classList.add("dark");
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
        if (data.points) {
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

  const quickActions = [
    { title: "Power Rankings", desc: "See where you stand", href: "https://www.fantasypros.com/nfl/rankings/ros-overall.php" },
    { title: "Start / Sit", desc: "Optimize your lineup", href: "https://fantasyfootballstarts.com/" },
    { title: "ROS Rankings", desc: "Rest of season outlook", href: "https://www.fantasypros.com/nfl/rankings/ros-overall.php" },
    { title: "NFL Injuries", desc: "Latest updates", href: "https://www.nfl.com/injuries/" },
    { title: "Stream Live", desc: "Games & RedZone", href: "https://www.youtube.com/live/LxJIVjEZJM8" },
    { title: "Highlights", desc: "Top plays", href: "https://www.nfl.com/videos/" },
    { title: "X Feed", desc: "Live NFL chatter", href: "https://x.com/NFL" },
  ];

  return (
    <div className="flex min-h-screen bg-slate-50 dark:bg-slate-950">
      <aside className="hidden lg:flex lg:flex-col w-64 border-r border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6">
        <h1 className="text-xl font-bold text-emerald-600 dark:text-emerald-400 mb-8">FF Manager</h1>
        <nav className="space-y-1">
          {["My League", "Rankings", "Tools", "Streams", "More"].map((item) => (
            <a key={item} href={item === "My League" ? "/league" : "#"} className="block px-3 py-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-sm font-medium">
              {item}
            </a>
          ))}
        </nav>
      </aside>

      <div className="flex-1 flex flex-col">
        <header className="border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-4 py-3 flex items-center justify-between lg:px-6">
          <div className="flex items-center gap-3">
            <button className="lg:hidden" onClick={() => setSidebarOpen(!sidebarOpen)}>☰</button>
            <h1 className="text-lg font-bold text-emerald-600 dark:text-emerald-400 lg:hidden">FF Manager</h1>
          </div>
          <button onClick={toggleTheme} className="rounded-full px-3 py-1 text-sm bg-slate-100 dark:bg-slate-800">
            {dark ? "☀️" : "🌙"}
          </button>
        </header>

        <main className="flex-1 px-4 py-6 max-w-4xl mx-auto w-full space-y-6 pb-20">
          <section className="bg-gradient-to-br from-emerald-50 to-white dark:from-slate-900 dark:to-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-3 shadow-sm">
            <div className="flex items-start justify-between mb-2">
              <div>
                <h2 className="text-lg font-bold">My Lineup</h2>
                <p className="text-slate-500 dark:text-slate-400 text-[11px]">Week 11 · vs Rival Team</p>
              </div>
              <div className="text-right">
                <div className="text-xl font-bold text-emerald-600 dark:text-emerald-400">{totalCurrent.toFixed(1)}</div>
                <div className="text-[10px] text-slate-500">Current</div>
                <div className="text-[10px] font-medium">{totalProj.toFixed(1)} proj</div>
              </div>
            </div>
            <div className="space-y-0.5">
              {lineup.map((player) => (
                <div key={player.pos + player.name} className="flex items-center justify-between text-[11px] py-0.5 border-b border-slate-100 dark:border-slate-700 last:border-0">
                  <div className="flex items-center gap-1.5">
                    <span className="w-8 font-mono text-[9px] font-semibold text-slate-500">{player.pos}</span>
                    <span className="font-medium">{player.name}</span>
                    <span className="text-[9px] text-slate-400">{player.opp}</span>
                  </div>
                  <div className="text-right">
                    <span className="font-semibold">{player.current}</span>
                    <span className="text-[9px] text-slate-400 ml-1">/{player.proj}</span>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section>
            <h3 className="text-lg font-semibold mb-3">Quick Actions</h3>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
              {quickActions.map((action) => (
                <a key={action.title} href={action.href} target={action.href.startsWith("http") ? "_blank" : undefined} rel={action.href.startsWith("http") ? "noopener noreferrer" : undefined} className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-4 hover:border-emerald-500 dark:hover:border-emerald-400 transition">
                  <div className="font-medium text-sm">{action.title}</div>
                  <div className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{action.desc}</div>
                </a>
              ))}
            </div>
          </section>
        </main>

        <nav className="lg:hidden sticky bottom-0 border-t border-slate-200 dark:border-slate-800 bg-white/95 dark:bg-slate-900/95 backdrop-blur-sm flex justify-around py-2 text-xs z-10">
          {["League", "Rankings", "Tools", "Streams", "More"].map((item) => (
            <a key={item} href={item === "League" ? "/league" : "#"} className="flex flex-col items-center py-1 px-2 text-slate-600 dark:text-slate-400">
              {item}
            </a>
          ))}
        </nav>
      </div>
    </div>
  );
}
