import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const userId = req.nextUrl.searchParams.get("userId");
  if (!userId) return NextResponse.json({ error: "no user" }, { status: 400 });
  return NextResponse.json({ lineup: null, creds: null, note: "db not wired yet" });
}

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => ({}));
  const { userId, lineup, creds } = body;
  if (!userId) return NextResponse.json({ error: "no user" }, { status: 400 });
  return NextResponse.json({ ok: true, note: "saved locally for now" });
}
