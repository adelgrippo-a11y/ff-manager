"use client";

import { useState, useEffect } from "react";

const links = [
  { title: "My League", href: "https://fantasy.espn.com/football/team?leagueId=539752", icon: "\ud83c\udfc8", desc: "ESPN League 539752" },
  { title: "Power Rankings", href: "https://www.fantasypros.com/nfl/myplaybook/", icon: "\ud83d\udcca", desc: "FantasyPros My Playbook" },
  { title: "Matchup", href: "https://www.fantasypros.com/nfl/myplaybook/matchup.php", icon: "\u2694\ufe0f", desc: "FantasyPros Matchup" },
  { title: "Start / Sit", href: "https://fantasyfootballstarts.com/", icon: "\u26a1", desc: "Start/sit advice" },
  { title: "ROS Rankings", href: "https://www.fantasypros.com/nfl/rankings/ros-overall.php", icon: "\ud83d\udcc8", desc: "Rest of season" },
  { title: "NFL Injuries", href: "https://www.nfl.com/injuries/", icon: "\ud83c\udfe5", desc: "Official injury report" },
  { title: "NFL Games", href: "https://www.nfl.com/schedules/", icon: "\ud83d\udcc5", desc: "Schedule & scores" },
  { title: "Stream Games", href: "/streams", icon: "\ud83d\udcfa", desc: "RedZone & live streams" },
  { title: "Highlights", href: "https://www.nfl.com/videos/", icon: "\ud83c\udfac", desc: "Official NFL highlights" },
  { title: "NFL on X", href: "https://x.com/NFL", icon: "\ud83d\udc26", desc: "Live NFL feed" },
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
      <header className="sticky top-0 z-10 border-b border-border bg-card px-4 h-14 flex items-center justify-between">
        <h1 className="text-lg font-bold text-accent">FF Manager</h1>
        <button onClick={toggleTheme} className="w-9 h-9 rounded-full bg-border flex items-center justify-center text-base">
          {dark ? "sun" : "moon"}
        </button>
      </header>
      <main className="px-4 py-6 max-w-lg mx-auto">
        <div className="grid grid-cols-2 gap-3">
          {links.map((link) => (
            <a key={link.title} href={link.href} target={link.href.startsWith("http") ? "_blank" : undefined} rel={link.href.startsWith("http") ? "noopener" : undefined} className="card group flex flex-col items-center justify-center text-center p-5 min-h-[120px] hover:border-accent hover:shadow-md transition-all active:scale-[0.98]">
              <span className="text-3xl mb-2">{link.icon}</span>
              <div className="font-semibold text-sm leading-tight">{link.title}</div>
              <div className="text-[11px] text-muted mt-1 leading-tight">{link.desc}</div>
            </a>
          ))}
        </div>
      </main>
    </div>
  );
}
