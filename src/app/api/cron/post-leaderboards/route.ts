// src/app/api/cron/post-leaderboards/route.ts
import { NextResponse } from 'next/server';
import { logger } from '@/lib/logger';
import { fetchHelldiversLeaderboard } from '@/lib/helldiversLeaderboard';
import { postDiscordWebhook } from '@/lib/discordWebhook';

export const runtime = 'nodejs';

function isAuthorized(req: Request): boolean {
  const token = process.env.CRON_SECRET;
  if (!token) return true; // if unset, allow for local/manual
  const hdr = req.headers.get('authorization') || '';
  const provided = hdr.startsWith('Bearer ') ? hdr.slice(7) : null;
  return Boolean(provided && provided === token);
}

export async function POST(req: Request) {
  if (!isAuthorized(req)) {
    return NextResponse.json({ error: 'unauthorized' }, { status: 401 });
  }

  const webhooks: Array<[string, string | undefined]> = [
    ['day', process.env.DISCORD_LEADERBOARD_DAILY_WEBHOOK_URL],
    ['week', process.env.DISCORD_LEADERBOARD_WEEKLY_WEBHOOK_URL],
    ['month', process.env.DISCORD_LEADERBOARD_MONTHLY_WEBHOOK_URL],
    ['lifetime', process.env.DISCORD_LEADERBOARD_YEARLY_WEBHOOK_URL],
    ['solo', process.env.DISCORD_LEADERBOARD_SOLO_WEBHOOK_URL],
  ];

  const posted: Array<{ scope: string; ok: boolean; reason?: string }> = [];

  for (const [scope, url] of webhooks) {
    try {
      if (!url) {
        posted.push({ scope, ok: false, reason: 'no_webhook_configured' });
        continue;
      }
      const { results } = await fetchHelldiversLeaderboard({ scope: scope as any, limit: 10 });
      const lines = results.map((r, i) => `**${i + 1}. ${r.player_name}** – ${r.Kills} kills, ${r.Deaths} deaths`);
      await postDiscordWebhook(url, { content: `__${scope.toUpperCase()} Leaderboard__\n${lines.join('\n')}` });
      posted.push({ scope, ok: true });
    } catch (err: any) {
      logger.error('Failed to post leaderboard webhook', { scope, err: String(err) });
      posted.push({ scope, ok: false, reason: 'post_failed' });
    }
  }

  return NextResponse.json({ ok: true, posted });
}

export async function GET(req: Request) {
  // GET can be used for a quick health check without posting
  if (!isAuthorized(req)) {
    return NextResponse.json({ error: 'unauthorized' }, { status: 401 });
  }
  return NextResponse.json({
    ok: true,
    env: {
      DISCORD_LEADERBOARD_DAILY_WEBHOOK_URL: !!process.env.DISCORD_LEADERBOARD_DAILY_WEBHOOK_URL,
      DISCORD_LEADERBOARD_WEEKLY_WEBHOOK_URL: !!process.env.DISCORD_LEADERBOARD_WEEKLY_WEBHOOK_URL,
      DISCORD_LEADERBOARD_MONTHLY_WEBHOOK_URL: !!process.env.DISCORD_LEADERBOARD_MONTHLY_WEBHOOK_URL,
      DISCORD_LEADERBOARD_YEARLY_WEBHOOK_URL: !!process.env.DISCORD_LEADERBOARD_YEARLY_WEBHOOK_URL,
      DISCORD_LEADERBOARD_SOLO_WEBHOOK_URL: !!process.env.DISCORD_LEADERBOARD_SOLO_WEBHOOK_URL,
    },
  });
}

