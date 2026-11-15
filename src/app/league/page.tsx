"use client";

export default function LeaguePage() {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 p-6">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-2xl font-bold mb-2">My League</h1>
        <p className="text-slate-500 dark:text-slate-400 mb-6">
          Standings, matchup, and roster details (Sleeper integration coming next)
        </p>

        <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-5">
          <h2 className="font-semibold mb-3">This Week</h2>
          <p className="text-sm text-slate-600 dark:text-slate-400">
            Connect your Sleeper league ID to load real standings, scores, and rosters.
          </p>
        </div>

        <a href="/" className="inline-block mt-6 text-emerald-600 dark:text-emerald-400 text-sm">
          ← Back to Hub
        </a>
      </div>
    </div>
  );
}
