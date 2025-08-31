import { NextResponse } from 'next/server';
import { rateLimitOrResponse } from '@/lib/rateLimit';

export const runtime = 'nodejs';

export async function GET(req: Request) {
  const limited = await rateLimitOrResponse(req, { bucket: 'health:get', windowMs: 60_000, max: 30 });
  if (limited) return limited;
  const env = {
    DISCORD_WEBHOOK_URL: !!process.env.DISCORD_WEBHOOK_URL,
    DISCORD_APPLICATION_WEBHOOK_URL: !!process.env.DISCORD_APPLICATION_WEBHOOK_URL,
    DISCORD_LEADERBOARD_DAILY_WEBHOOK_URL: !!process.env.DISCORD_LEADERBOARD_DAILY_WEBHOOK_URL,
    DISCORD_LEADERBOARD_WEEKLY_WEBHOOK_URL: !!process.env.DISCORD_LEADERBOARD_WEEKLY_WEBHOOK_URL,
    DISCORD_LEADERBOARD_MONTHLY_WEBHOOK_URL: !!process.env.DISCORD_LEADERBOARD_MONTHLY_WEBHOOK_URL,
    DISCORD_LEADERBOARD_YEARLY_WEBHOOK_URL: !!process.env.DISCORD_LEADERBOARD_YEARLY_WEBHOOK_URL,
    DISCORD_LEADERBOARD_SOLO_WEBHOOK_URL: !!process.env.DISCORD_LEADERBOARD_SOLO_WEBHOOK_URL,
    DISCORD_INTEL_WEBHOOK_URL: !!process.env.DISCORD_INTEL_WEBHOOK_URL,
    DISCORD_TWITCH_WEBHOOK_URL: !!process.env.DISCORD_TWITCH_WEBHOOK_URL,
  };
  return NextResponse.json({ ok: true, ts: Date.now(), env });
}
