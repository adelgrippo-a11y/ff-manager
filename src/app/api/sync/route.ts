import { NextRequest, NextResponse } from "next/server";
import { neon } from "@neondatabase/serverless";

const sql = process.env.POSTGRES_URL ? neon(process.env.POSTGRES_URL) : null;

async function ensureTable() {
  if (!sql) return;
  await sql`
    CREATE TABLE IF NOT EXISTS user_data (
      user_id TEXT PRIMARY KEY,
      lineup JSONB,
      creds JSONB,
      updated_at TIMESTAMPTZ DEFAULT now()
    )
  `;
}

export async function GET(req: NextRequest) {
  const userId = req.nextUrl.searchParams.get("userId");
  if (!userId || !sql) return NextResponse.json({ lineup: null, creds: null });

  try {
    await ensureTable();
    const rows = await sql`SELECT lineup, creds FROM user_data WHERE user_id = ${userId}`;
    const row = rows[0];
    return NextResponse.json({ lineup: row?.lineup || null, creds: row?.creds || null });
  } catch {
    return NextResponse.json({ lineup: null, creds: null });
  }
}

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => ({}));
  const { userId, lineup, creds } = body;
  if (!userId || !sql) return NextResponse.json({ ok: false });

  try {
    await ensureTable();
    await sql`
      INSERT INTO user_data (user_id, lineup, creds, updated_at)
      VALUES (${userId}, ${JSON.stringify(lineup || null)}::jsonb, ${JSON.stringify(creds || null)}::jsonb, now())
      ON CONFLICT (user_id) DO UPDATE SET
        lineup = EXCLUDED.lineup,
        creds = EXCLUDED.creds,
        updated_at = now()
    `;
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ ok: false });
  }
}
