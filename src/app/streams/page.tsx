"use client";

const creators = [
  { name: "Chat Sports RedZone", href: "https://www.youtube.com/live/LxJIVjEZJM8", thumb: "https://i.ytimg.com/vi/LxJIVjEZJM8/hqdefault.jpg" },
  { name: "Fantasy Footballers", href: "https://www.youtube.com/@TheFantasyFootballers", thumb: "https://yt3.ggpht.com/ytc/AIdro_n5vQ=s88" },
  { name: "Sal Vetri", href: "https://www.youtube.com/@SalVetri", thumb: "https://yt3.ggpht.com/ytc/AIdro_n5vQ=s88" },
  { name: "The Flock League", href: "https://www.youtube.com/@FlockLeague", thumb: "https://yt3.ggpht.com/ytc/AIdro_n5vQ=s88" },
  { name: "FantasyPros", href: "https://www.youtube.com/@FantasyPros", thumb: "https://yt3.ggpht.com/ytc/AIdro_n5vQ=s88" },
];

export default function StreamsPage() {
  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card px-4 py-3 flex items-center justify-between">
        <div>
          <a href="/" className="text-accent text-sm">← Back</a>
          <h1 className="text-xl font-bold mt-1">Streams</h1>
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
      <main className="px-4 py-6 max-w-lg mx-auto space-y-3">
        {creators.map((c) => (
          <a key={c.name} href={c.href} target="_blank" rel="noopener" className="card p-3 flex items-center gap-3 hover:border-accent transition">
            <img src={c.thumb} alt="" className="w-16 h-12 rounded object-cover bg-border" />
            <div>
              <div className="font-medium text-sm">{c.name}</div>
              <div className="text-xs text-muted">Open in YouTube</div>
            </div>
          </a>
        ))}
        <div className="card p-3">
          <div className="text-sm font-medium mb-2">Custom URL</div>
          <input
            type="url"
            placeholder="Paste YouTube link"
            className="w-full rounded border border-border bg-background px-2 py-1 text-sm"
            onKeyDown={(e) => {
              if (e.key === "Enter" && (e.target as HTMLInputElement).value) {
                window.open((e.target as HTMLInputElement).value, "_blank");
              }
            }}
          />
        </div>
      </main>
    </div>
  );
}
