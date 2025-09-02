import { NextResponse } from 'next/server';
import { logger } from '@/lib/logger';
import type { Alert } from '@/_types/alerts';

export async function GET(request: Request) {
  const startedAt = Date.now();
  const now = new Date().toISOString();
  const alerts: Alert[] = [];
  let twitchLiveCount = 0;
  let leaderboardAdded = false;

  const origin = new URL(request.url).origin;

  // Gather live Twitch creators
  try {
    const twitchRes = await fetch(`${origin}/api/twitch/creators`, {
      cache: 'no-store',
    });
    if (twitchRes.ok) {
      const creators: any[] = await twitchRes.json();
      creators
        .filter((c) => c.isLive)
        .forEach((c) => {
          alerts.push({
            id: `twitch-${c.channelName}`,
            type: 'twitch_live',
            variant: 'purple',
            message: `${c.displayName || c.channelName} is live on Twitch!`,
            url: `https://www.twitch.tv/${c.channelName}`,
            createdAt: now,
          });
          twitchLiveCount += 1;
        });
    }
  } catch {
    // ignore twitch errors
  }

  // Detect daily leaderboard updates
  try {
    const lbRes = await fetch(
      `${origin}/api/helldivers/leaderboard?scope=day&sortBy=Kills&sortDir=desc&limit=1`,
      { cache: 'no-store' }
    );
    if (lbRes.ok) {
      const data = await lbRes.json();
      const top = data?.results?.[0];
      if (top) {
        alerts.push({
          id: `leaderboard-${top.id || 'daily'}`,
          type: 'leaderboard_update',
          variant: 'blue',
          message: `Daily leaderboard updated: ${top.player_name} leads with ${top.Kills} kills`,
          url: '/helldivers-2/leaderboard',
          createdAt: now,
        });
        leaderboardAdded = true;
      }
    }
  } catch {
    // ignore leaderboard errors
  }

  const totalMs = Date.now() - startedAt;
  const counts = { total: alerts.length, twitchLive: twitchLiveCount, leaderboard: leaderboardAdded ? 1 : 0 };
  logger.info('alerts summary', { counts, timings: { totalMs } });
  if (alerts.length === 0) {
    logger.warn('alerts empty', { counts, timings: { totalMs } });
  }
  const WARN_MS = 150;
  if (totalMs > WARN_MS) {
    logger.warn('alerts slow', { counts, timings: { totalMs }, thresholdMs: WARN_MS });
  }

  return NextResponse.json({ alerts });
}

