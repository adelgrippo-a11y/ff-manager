"use client";

export default function InjuriesPage() {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 p-6">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-2xl font-bold mb-2 text-slate-900 dark:text-white">Injuries</h1>
        <p className="text-slate-600 dark:text-slate-300 mb-6">Latest NFL injury updates.</p>
        <div className="bg-white dark:bg-slate-900 rounded-xl border p-5">
          <a href="https://www.nfl.com/injuries/" target="_blank" rel="noopener" className="block text-emerald-600 dark:text-emerald-400 mb-2">NFL Official Injury Report →</a>
          <a href="https://www.espn.com/nfl/injuries" target="_blank" rel="noopener" className="block text-emerald-600 dark:text-emerald-400">ESPN Injury Report →</a>
        </div>
        <a href="/" className="inline-block mt-6 text-emerald-600 text-sm">← Back</a>
      </div>
    </div>
  );
}
