import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  const body = await req.json().catch(() => ({}));
  // This shows up in Vercel "Logs" after deploy
  console.log('[CHAT EVENT]', JSON.stringify(body));
  return NextResponse.json({ ok: true });
}
