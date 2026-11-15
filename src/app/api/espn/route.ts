import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const leagueId = searchParams.get("leagueId");
  const year = searchParams.get("year") || "2026";

  if (!leagueId) {
    return NextResponse.json({ error: "leagueId required" }, { status: 400 });
  }

  const url = `https://fantasy.espn.com/apis/v3/games/ffl/seasons/${year}/segments/0/leagues/${leagueId}?view=mTeam&view=mRoster&view=mMatchup`;

  try {
    const res = await fetch(url, {
      headers: {
        "User-Agent": "Mozilla/5.0",
      },
    });

    if (!res.ok || res.url.includes("espn.com/fantasy")) {
      return NextResponse.json(
        {
          error: "League is private or not accessible",
          message: "Public leagues work without login. Private leagues need espn_s2 + SWID cookies.",
        },
        { status: 401 }
      );
    }

    const data = await res.json();
    return NextResponse.json(data);
  } catch (err) {
    return NextResponse.json({ error: "Failed to fetch league" }, { status: 500 });
  }
}
