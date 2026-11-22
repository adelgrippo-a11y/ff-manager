"use client";

export default function RankingsPage() {
  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card px-4 h-14 flex items-center">
        <a href="/" className="text-accent text-sm font-medium">\u2190 Back</a>
        <h1 className="text-lg font-bold ml-3">Rankings</h1>
      </header>
      <main className="px-4 py-6 max-w-lg mx-auto space-y-4">
        <a href="https://www.fantasypros.com/nfl/myplaybook/" target="_blank" rel="noopener" className="card p-4 block hover:border-accent transition">
          <div className="font-semibold">Power Rankings</div>
          <div className="text-xs text-muted mt-1">FantasyPros MyPlaybook</div>
        </a>
        <a href="https://www.fantasypros.com/nfl/rankings/ros-overall.php" target="_blank" rel="noopener" className="card p-4 block hover:border-accent transition">
          <div className="font-semibold">ROS Rankings</div>
          <div className="text-xs text-muted mt-1">Rest of season outlook</div>
        </a>
        <a href="https://www.fantasypros.com/nfl/rankings/consensus-cheatsheets.php" target="_blank" rel="noopener" className="card p-4 block hover:border-accent transition">
          <div className="font-semibold">Weekly Consensus</div>
          <div className="text-xs text-muted mt-1">FantasyPros rankings</div>
        </a>
      </main>
    </div>
  );
}
