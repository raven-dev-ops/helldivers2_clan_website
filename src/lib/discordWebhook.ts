// src/lib/discordWebhook.ts

import { logger } from '@/lib/logger';

export async function postDiscordWebhook(
  webhookUrl: string,
  payload: { content?: string; embeds?: unknown[] }
) {
  logger.info('Posting Discord webhook', { webhookUrl, payload });
  const res = await fetch(webhookUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const err = await res.text().catch(() => '');
    logger.error('Discord webhook failed', {
      webhookUrl,
      err,
      status: res.status,
    });
    throw new Error(`Discord webhook error ${res.status}: ${err}`);
  }

  logger.info('Discord webhook succeeded', { webhookUrl });
}
