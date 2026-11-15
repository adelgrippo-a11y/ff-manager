import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const leagueId = req.nextUrl.searchParams.get("leagueId");
  const platform = req.nextUrl.searchParams.get("platform") || "espn";
  const espnS2 = req.nextUrl.searchParams.get("espnS2");
  const swid = req.nextUrl.searchParams.get("swid");

  if (!leagueId) return NextResponse.json({ teams: [], error: "no league id" });

  try {
    if (platform === "sleeper") {
      const res = await fetch(`https://api.sleeper.app/v1/league/${leagueId}/rosters`);
      if (!res.ok) return NextResponse.json({ teams: [], error: "league not found" });
      const rosters = await res.json();
      const usersRes = await fetch(`https://api.sleeper.app/v1/league/${leagueId}/users`);
      const users = usersRes.ok ? await usersRes.json() : [];
      const teams = rosters.map((r: any) => {
        const u = users.find((x: any) => x.user_id === r.owner_id);
        return {
          id: r.roster_id,
          name: u?.display_name || `Team ${r.roster_id}`,
          players: r.players || [],
        };
      });
      return NextResponse.json({ teams });
    }

    const year = "2026";
    const url = `https://fantasy.espn.com/apis/v3/games/ffl/seasons/${year}/segments/0/leagues/${leagueId}?view=mRoster`;
    const headers: HeadersInit = { "User-Agent": "Mozilla/5.0" };
    if (espnS2 && swid) headers["Cookie"] = `espn_s2=${espnS2}; SWID=${swid}`;
    const res = await fetch(url, { headers });
    if (!res.ok) return NextResponse.json({ teams: [], error: "private or invalid" });
    const data = await res.json();
    const teams = (data.teams || []).map((t: any) => ({
      id: t.id,
      name: t.location ? `${t.location} ${t.nickname}` : `Team ${t.id}`,
      players: (t.roster?.entries || []).map((e: any) => e.playerPoolEntry?.player?.fullName).filter(Boolean),
    }));
    return NextResponse.json({ teams });
  } catch {
    return NextResponse.json({ teams: [], error: "fetch failed" });
  }
}
