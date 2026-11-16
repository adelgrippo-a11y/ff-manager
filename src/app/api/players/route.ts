import { NextRequest, NextResponse } from "next/server";

let cache: any[] | null = null;
let cacheTime = 0;

export async function GET(req: NextRequest) {
  const q = (req.nextUrl.searchParams.get("q") || "").toLowerCase().trim();

  if (!cache || Date.now() - cacheTime > 86400000) {
    try {
      const res = await fetch("https://api.sleeper.app/v1/players/nfl", {
        headers: { "User-Agent": "FF-Manager" },
      });
      if (res.ok) {
        const data = await res.json();
        cache = Object.values(data)
          .filter((p: any) => p.active && p.full_name && p.position && ["QB","RB","WR","TE","K","DEF"].includes(p.position))
          .map((p: any) => ({
            id: p.player_id,
            name: p.full_name,
            pos: p.position,
            team: p.team || "",
            search: `${p.full_name} ${p.last_name || ""} ${p.first_name || ""}`.toLowerCase(),
          }));
        cacheTime = Date.now();
      }
    } catch {}
  }

  if (!cache) return NextResponse.json({ players: [] });

  if (!q) {
    return NextResponse.json({ players: cache.slice(0, 40) });
  }

  const starts = cache.filter((p) => p.search.startsWith(q) || p.name.toLowerCase().startsWith(q));
  const includes = cache.filter((p) => !starts.includes(p) && (p.search.includes(q) || p.pos.toLowerCase() === q || p.team.toLowerCase() === q));

  const results = [...starts, ...includes].slice(0, 50);
  return NextResponse.json({ players: results });
}
