"use client";

export default function StreamsPage() {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 p-6">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-2xl font-bold mb-2 text-slate-900 dark:text-white">Streams</h1>
        <p className="text-slate-600 dark:text-slate-300 mb-6">Live games and RedZone.</p>
        <div className="bg-white dark:bg-slate-900 rounded-xl border p-5 space-y-3">
          <a href="https://www.youtube.com/live/LxJIVjEZJM8" target="_blank" rel="noopener" className="block text-emerald-600 dark:text-emerald-400">Chat Sports RedZone Live →</a>
          <a href="https://www.nfl.com/plus/" target="_blank" rel="noopener" className="block text-emerald-600 dark:text-emerald-400">NFL+ →</a>
          <a href="https://www.youtube.com/results?search_query=nfl+redzone+live" target="_blank" rel="noopener" className="block text-emerald-600 dark:text-emerald-400">YouTube RedZone search →</a>
        </div>
        <a href="/" className="inline-block mt-6 text-emerald-600 text-sm">← Back</a>
      </div>
    </div>
  );
}
