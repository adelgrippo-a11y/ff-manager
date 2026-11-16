import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const names = req.nextUrl.searchParams.get("names")?.split(",").filter(Boolean) || [];
  if (!names.length) return NextResponse.json({ points: {} });

  try {
    const stateRes = await fetch("https://api.sleeper.app/v1/state/nfl");
    const state = await stateRes.json();
    const week = state.week || 11;
    const season = state.season || "2026";

    const projRes = await fetch(`https://api.sleeper.app/projections/nfl/${season}/${week}?season_type=regular`);
    const projections = projRes.ok ? await projRes.json() : [];

    const statsRes = await fetch(`https://api.sleeper.app/stats/nfl/${season}/${week}?season_type=regular`);
    const stats = statsRes.ok ? await statsRes.json() : {};

    const points: Record<string, { projected: number; current: number }> = {};

    for (const name of names) {
      const lower = name.toLowerCase().trim();
      const last = lower.split(" ").pop() || lower;

      let projMatch: any = null;
      if (Array.isArray(projections)) {
        projMatch = projections.find((p: any) => {
          const full = (p.player?.full_name || "").toLowerCase();
          const ln = (p.player?.last_name || "").toLowerCase();
          return full.includes(lower) || ln === last || lower.includes(ln);
        });
      }

      let current = 0;
      if (projMatch?.player_id && stats[projMatch.player_id]) {
        current = stats[projMatch.player_id].pts_ppr || stats[projMatch.player_id].pts_std || 0;
      } else {
        for (const id of Object.keys(stats)) {
          const s = stats[id];
          const full = (s.player?.full_name || "").toLowerCase();
          const ln = (s.player?.last_name || "").toLowerCase();
          if (full.includes(lower) || ln === last || lower.includes(ln)) {
            current = s.pts_ppr || s.pts_std || 0;
            break;
          }
        }
      }

      points[name] = {
        projected: Math.round((projMatch?.pts_ppr || projMatch?.pts_std || 0) * 10) / 10,
        current: Math.round(current * 10) / 10,
      };
    }

    return NextResponse.json({ points, week, season });
  } catch (e) {
    return NextResponse.json({ points: {}, error: "fetch failed" });
  }
}
