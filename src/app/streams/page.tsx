"use client";

const creators = [
  { name: "NFL Streams", href: "https://v2.streameast.ga/nfl-streams/", icon: "TV" },
  { name: "Chat Sports RedZone", href: "https://www.youtube.com/live/LxJIVjEZJM8", icon: "RZ" },
  { name: "Fantasy Footballers", href: "https://www.youtube.com/@TheFantasyFootballers", icon: "FF" },
  { name: "Sal Vetri", href: "https://www.youtube.com/@SalVetri", icon: "SV" },
  { name: "The Flock League", href: "https://www.youtube.com/@FlockLeague", icon: "FL" },
  { name: "FantasyPros", href: "https://www.youtube.com/@FantasyPros", icon: "FP" },
];

export default function StreamsPage() {
  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card px-4 h-14 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <a href="/" className="text-accent">Back</a>
          <h1 className="text-lg font-bold">Streams</h1>
        </div>
        <button onClick={() => { const isDark = document.documentElement.classList.toggle("dark"); localStorage.setItem("theme", isDark ? "dark" : "light"); }} className="px-3 py-1 rounded-full bg-border text-sm">Theme</button>
      </header>
      <main className="px-4 py-6 max-w-lg mx-auto space-y-3">
        {creators.map((c) => (
          <a key={c.name} href={c.href} target="_blank" rel="noopener" className="card p-4 flex items-center gap-4 hover:border-accent transition">
            <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center text-sm font-bold">{c.icon}</div>
            <div>
              <div className="font-semibold text-sm">{c.name}</div>
              <div className="text-xs text-muted">Open</div>
            </div>
          </a>
        ))}
        <div className="card p-3">
          <div className="text-sm font-medium mb-2">Custom URL</div>
          <input type="url" placeholder="Paste link" className="w-full rounded border border-border bg-background px-2 py-1 text-sm" onKeyDown={(e) => { const input = e.target as HTMLInputElement; if (e.key === "Enter" && input.value) window.open(input.value, "_blank"); }} />
        </div>
      </main>
    </div>
  );
}
