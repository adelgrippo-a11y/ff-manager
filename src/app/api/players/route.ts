import { NextRequest, NextResponse } from "next/server";

let cache: any = null;
let cacheTime = 0;

export async function GET(req: NextRequest) {
  const q = req.nextUrl.searchParams.get("q")?.toLowerCase() || "";

  // Cache for 24h
  if (!cache || Date.now() - cacheTime > 86400000) {
    try {
      const res = await fetch("https://api.sleeper.app/v1/players/nfl?active=true", {
        headers: { "User-Agent": "FF-Manager" },
      });
      if (res.ok) {
        const data = await res.json();
        cache = Object.values(data)
          .filter((p: any) => p.active && p.full_name && p.position)
          .map((p: any) => ({
            id: p.player_id,
            name: p.full_name,
            pos: p.position,
            team: p.team || "",
          }))
          .slice(0, 2000);
        cacheTime = Date.now();
      }
    } catch (e) {
      // fall through
    }
  }

  if (!cache) {
    return NextResponse.json({ players: [] });
  }

  const filtered = q
    ? cache.filter((p: any) => p.name.toLowerCase().includes(q) || p.pos.toLowerCase() === q).slice(0, 40)
    : cache.slice(0, 30);

  return NextResponse.json({ players: filtered });
}
