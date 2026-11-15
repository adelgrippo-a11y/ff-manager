import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const names = req.nextUrl.searchParams.get("names")?.split(",") || [];
  if (!names.length) return NextResponse.json({ points: {} });

  try {
    const stateRes = await fetch("https://api.sleeper.app/v1/state/nfl");
    const state = await stateRes.json();
    const week = state.week || 11;
    const season = state.season || "2026";

    const positions = ["QB", "RB", "WR", "TE", "K", "DEF"];
    const all: any[] = [];
    for (const pos of positions) {
      const r = await fetch(
        `https://api.sleeper.app/projections/nfl/${season}/${week}?season_type=regular&position[]=${pos}`
      );
      if (r.ok) {
        const data = await r.json();
        if (Array.isArray(data)) all.push(...data);
      }
    }

    const points: Record<string, { projected: number; current: number }> = {};
    for (const name of names) {
      const lower = name.toLowerCase();
      const match = all.find(
        (p) =>
          p.player?.full_name?.toLowerCase().includes(lower) ||
          p.player?.last_name?.toLowerCase() === lower ||
          lower.includes(p.player?.last_name?.toLowerCase() || "")
      );
      if (match) {
        points[name] = {
          projected: Math.round((match.pts_ppr || match.pts_std || 0) * 10) / 10,
          current: 0,
        };
      } else {
        points[name] = { projected: 0, current: 0 };
      }
    }

    return NextResponse.json({ points, week, season });
  } catch {
    return NextResponse.json({ points: {}, error: "fetch failed" });
  }
}
