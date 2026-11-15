"use client";

import { useState, useEffect } from "react";

export default function Home() {
  const [dark, setDark] = useState(false);

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

  // Mock league data
  const league = {
    name: "Your League",
    rank: 3,
    record: "7-3",
    points: 1245.6,
    opponent: "Rival Team",
    opponentPoints: 1189.2,
  };

  return (
    <div className="flex flex-col min-h-screen">
      {/* Header */}
      <header className="border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-6 py-4 flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight text-emerald-600 dark:text-emerald-400">
          FF Manager
        </h1>
        <button
          onClick={toggleTheme}
          className="rounded-full p-2 text-sm font-medium bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition"
          aria-label="Toggle theme"
        >
          {dark ? "☀️ Light" : "🌙 Dark"}
        </button>
      </header>

      {/* Main Dashboard */}
      <main className="flex-1 max-w-5xl mx-auto w-full px-4 py-8 space-y-8">
        <section>
          <h2 className="text-3xl font-semibold mb-2">Welcome back</h2>
          <p className="text-slate-600 dark:text-slate-400">
            Your fantasy football companion
          </p>
        </section>

        {/* League Summary Card */}
        <section className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 p-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h3 className="text-xl font-semibold">{league.name}</h3>
              <p className="text-slate-500 dark:text-slate-400 mt-1">
                Rank #{league.rank} · {league.record}
              </p>
            </div>
            <div className="text-right">
              <div className="text-3xl font-bold text-emerald-600 dark:text-emerald-400">
                {league.points}
              </div>
              <div className="text-sm text-slate-500">Total points</div>
            </div>
          </div>

          <div className="mt-6 pt-6 border-t border-slate-100 dark:border-slate-800">
            <p className="text-sm font-medium text-slate-500 dark:text-slate-400 mb-2">
              This week vs {league.opponent}
            </p>
            <div className="flex items-center justify-between text-lg font-semibold">
              <span>You: {league.points}</span>
              <span className="text-slate-400">vs</span>
              <span>{league.opponentPoints}</span>
            </div>
          </div>
        </section>

        {/* Quick Links / Tools */}
        <section className="grid gap-4 sm:grid-cols-2">
          <a
            href="https://www.youtube.com/live/LxJIVjEZJM8"
            target="_blank"
            rel="noopener noreferrer"
            className="block bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 hover:border-emerald-500 dark:hover:border-emerald-400 transition group"
          >
            <h4 className="font-semibold group-hover:text-emerald-600 dark:group-hover:text-emerald-400">
              RedZone Audio
            </h4>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
              Live stream (via Chat Sports on YouTube)
            </p>
          </a>

          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6">
            <h4 className="font-semibold">League Tools</h4>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
              More features coming soon
            </p>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200 dark:border-slate-800 py-6 text-center text-sm text-slate-500">
        FF Manager · Fantasy football companion · Links credited to original creators
      </footer>
    </div>
  );
}
