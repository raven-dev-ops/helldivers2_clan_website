import { NextResponse } from 'next/server';
import { rateLimitOrResponse } from '@/lib/rateLimit';

export async function GET(req: Request) {
  const limited = await rateLimitOrResponse(req, { bucket: 'health:get', windowMs: 60_000, max: 30 });
  if (limited) return limited;
  return NextResponse.json({ ok: true, ts: Date.now() });
}
