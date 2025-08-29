// src/scripts/postUpdates.ts

import { fetchHelldiversLeaderboard } from '@/lib/helldiversLeaderboard';
import { postDiscordWebhook } from '@/lib/discordWebhook';

async function postLeaderboards() {
  const scopes: Array<[
    import('@/lib/helldiversLeaderboard').LeaderboardScope,
    string | undefined
  ]> = [
    ['day', process.env.DISCORD_LEADERBOARD_DAILY_WEBHOOK_URL],
    ['week', process.env.DISCORD_LEADERBOARD_WEEKLY_WEBHOOK_URL],
    ['month', process.env.DISCORD_LEADERBOARD_MONTHLY_WEBHOOK_URL],
    ['lifetime', process.env.DISCORD_LEADERBOARD_YEARLY_WEBHOOK_URL],
    ['solo', process.env.DISCORD_LEADERBOARD_SOLO_WEBHOOK_URL],
  ];

  for (const [scope, webhook] of scopes) {
    if (!webhook) continue;
    const { results } = await fetchHelldiversLeaderboard({ scope, limit: 10 });
    const lines = results.map(
      (r, i) => `**${i + 1}. ${r.player_name}** – ${r.Kills} kills, ${r.Deaths} deaths`
    );
    await postDiscordWebhook(webhook, {
      content: `__${scope.toUpperCase()} Leaderboard__\n${lines.join('\n')}`,
    });
  }
}

async function postIntel() {
  const webhook = process.env.DISCORD_INTEL_WEBHOOK_URL;
  if (!webhook) return;

  const res = await fetch('https://intel.api.url/whatever');
  const intelData = await res.json();

  await postDiscordWebhook(webhook, {
    content: `Intel Update:\n${JSON.stringify(intelData, null, 2)}`,
  });
}

async function main() {
  await Promise.all([postLeaderboards(), postIntel()]);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
