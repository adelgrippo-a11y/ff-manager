"use client";

import { useState } from "react";

const creators = [
  { name: "Chat Sports RedZone", url: "https://www.youtube.com/live/LxJIVjEZJM8" },
  { name: "Fantasy Footballers", url: "https://www.youtube.com/@TheFantasyFootballers" },
  { name: "Matthew Berry", url: "https://www.youtube.com/@MatthewBerryFantasy" },
  { name: "FantasyPros", url: "https://www.youtube.com/@FantasyPros" },
  { name: "The Fantasy Headliners", url: "https://www.youtube.com/@TheFantasyHeadliners" },
  { name: "Establish The Run", url: "https://www.youtube.com/@EstablishTheRun" },
];

export default function StreamsPage() {
  const [custom, setCustom] = useState("");

  const openCustom = () => {
    if (!custom.trim()) return;
    const url = custom.startsWith("http") ? custom : `https://www.youtube.com/results?search_query=${encodeURIComponent(custom)}`;
    window.open(url, "_blank");
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 p-6">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-2xl font-bold mb-2 text-slate-900 dark:text-white">Streams</h1>
        <p className="text-slate-600 dark:text-slate-300 mb-6">Pick a creator or enter your own. Opens in the YouTube app for background audio.</p>

        <div className="bg-white dark:bg-slate-900 rounded-xl border p-5 mb-6">
          <h2 className="font-semibold mb-3 text-slate-900 dark:text-white">Popular FF Creators</h2>
          <div className="space-y-2">
            {creators.map((c) => (
              <a key={c.name} href={c.url} target="_blank" rel="noopener" className="block text-emerald-600 dark:text-emerald-400 text-sm">
                {c.name} →
              </a>
            ))}
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-xl border p-5 mb-6">
          <h2 className="font-semibold mb-3 text-slate-900 dark:text-white">Or enter your own</h2>
          <div className="flex gap-2">
            <input
              type="text"
              value={custom}
              onChange={(e) => setCustom(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && openCustom()}
              placeholder="YouTube URL or creator name"
              className="flex-1 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-white px-3 py-2 text-sm"
            />
            <button onClick={openCustom} className="rounded-lg bg-emerald-600 px-4 py-2 text-sm text-white">
              Open
            </button>
          </div>
        </div>

        <a href="/" className="inline-block text-emerald-600 dark:text-emerald-400 text-sm">← Back</a>
      </div>
    </div>
  );
}
