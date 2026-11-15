"use client";

export default function RankingsPage() {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 p-6">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-2xl font-bold mb-2 text-slate-900 dark:text-white">Rankings</h1>
        <p className="text-slate-600 dark:text-slate-300 mb-6">Power rankings and rest-of-season outlook.</p>
        <div className="bg-white dark:bg-slate-900 rounded-xl border p-5">
          <a href="https://www.fantasypros.com/nfl/rankings/ros-overall.php" target="_blank" rel="noopener" className="block text-emerald-600 dark:text-emerald-400 mb-2">FantasyPros ROS Rankings →</a>
          <a href="https://www.fantasypros.com/nfl/rankings/consensus-cheatsheets.php" target="_blank" rel="noopener" className="block text-emerald-600 dark:text-emerald-400">Weekly Consensus Rankings →</a>
        </div>
        <a href="/" className="inline-block mt-6 text-emerald-600 text-sm">← Back</a>
      </div>
    </div>
  );
}
