// src/lib/discordWebhook.ts

import { logger } from '@/lib/logger';

function maskDiscordWebhookUrl(url: string): string {
  try {
    const parsed = new URL(url);
    const parts = parsed.pathname.split('/').filter(Boolean);
    // Expect format: /api/webhooks/{id}/{token}
    const isDiscordWebhook = parts[0] === 'api' && parts[1] === 'webhooks';
    if (isDiscordWebhook && parts.length >= 3) {
      const id = parts[2];
      return `${parsed.hostname}/api/webhooks/${id}/***`;
    }
    return `${parsed.hostname}${parsed.pathname}`;
  } catch {
    return 'invalid_url';
  }
}

export async function postDiscordWebhook(
  webhookUrl: string,
  payload: { content?: string; embeds?: unknown[] }
) {
  const maskedUrl = maskDiscordWebhookUrl(webhookUrl);
  const payloadMeta = {
    hasContent: Boolean(payload?.content),
    contentLength: payload?.content ? String(payload.content).length : 0,
    embedsCount: Array.isArray(payload?.embeds) ? payload.embeds.length : 0,
  };
  logger.info('Posting Discord webhook', { url: maskedUrl, payload: payloadMeta });
  const res = await fetch(webhookUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const err = await res.text().catch(() => '');
    logger.error('Discord webhook failed', {
      url: maskedUrl,
      err,
      status: res.status,
    });
    throw new Error(`Discord webhook error ${res.status}: ${err}`);
  }

  logger.info('Discord webhook succeeded', { url: maskedUrl, status: res.status });
}
