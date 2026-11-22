"use client";

import { useState, useEffect } from "react";

const links = [
  { title: "My League", href: "https://fantasy.espn.com/football/team?leagueId=539752", icon: "\ud83c\udfc8", desc: "Open your ESPN league (ID 539752)" },
  { title: "Power Rankings", href: "https://www.fantasypros.com/nfl/myplaybook/", icon: "\ud83d\udcca", desc: "FantasyPros My Playbook" },
  { title: "Matchup", href: "https://www.fantasypros.com/nfl/myplaybook/matchup.php", icon: "\u2694\ufe0f", desc: "FantasyPros Matchup view" },
  { title: "Start / Sit Tool", href: "https://fantasyfootballstarts.com/", icon: "\u26a1", desc: "Start/sit advice" },
  { title: "ROS Rankings", href: "https://www.fantasypros.com/nfl/rankings/ros-overall.php", icon: "\ud83d\udcc8", desc: "Rest of season rankings" },
  { title: "Official NFL Injuries", href: "https://www.nfl.com/injuries/", icon: "\ud83c\udfe5", desc: "NFL injury report" },
  { title: "NFL Games", href: "https://www.nfl.com/schedules/", icon: "\ud83d\udcc5", desc: "Schedule & scores" },
  { title: "Stream Games Live", href: "/streams", icon: "\ud83d\udcfa", desc: "RedZone & streams" },
  { title: "NFL Highlights", href: "https://www.nfl.com/videos/", icon: "\ud83c\udfac", desc: "Official highlights" },
  { title: "NFL Feed on X", href: "https://x.com/NFL", icon: "\ud83d\udc26", desc: "Live NFL on X" },
];

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

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card px-4 py-3 flex items-center justify-between">
        <h1 className="text-xl font-bold text-accent">FF Manager</h1>
        <button onClick={toggleTheme} className="rounded-full px-3 py-1 text-sm bg-border">
          {dark ? "\u2600\ufe0f" : "\ud83c\udf19"}
        </button>
      </header>

      <main className="px-4 py-6 max-w-lg mx-auto">
        <p className="text-sm text-muted mb-6">Your fantasy football hub</p>

        <div className="space-y-2">
          {links.map((link) => (
            <a
              key={link.title}
              href={link.href}
              target={link.href.startsWith("http") ? "_blank" : undefined}
              rel={link.href.startsWith("http") ? "noopener" : undefined}
              className="card flex items-center gap-4 p-4 hover:border-accent transition-colors"
            >
              <span className="text-2xl">{link.icon}</span>
              <div className="flex-1">
                <div className="font-semibold">{link.title}</div>
                <div className="text-xs text-muted">{link.desc}</div>
              </div>
              <span className="text-muted">\u2192</span>
            </a>
          ))}
        </div>
      </main>
    </div>
  );
}
