// src/app/api/webhooks/test/route.ts
import { NextResponse } from 'next/server';
import { logger } from '@/lib/logger';
import { postDiscordWebhook } from '@/lib/discordWebhook';
import { rateLimitOrResponse } from '@/lib/rateLimit';

export const runtime = 'nodejs';

function isAuthorized(req: Request): boolean {
  const token = process.env.CRON_SECRET;
  if (!token) return true; // allow local/manual if unset
  const hdr = req.headers.get('authorization') || '';
  const provided = hdr.startsWith('Bearer ') ? hdr.slice(7) : null;
  return Boolean(provided && provided === token);
}

function gatherDiscordWebhookEntries(): Array<[string, string]> {
  return (Object.entries(process.env).filter(
    ([key, value]) => key.startsWith('DISCORD') && key.endsWith('WEBHOOK_URL') && typeof value === 'string' && value
  ) as Array<[string, string]>);
}

export async function GET(req: Request) {
  const limited = await rateLimitOrResponse(req, { bucket: 'webhooks_test_get', windowMs: 60_000, max: 10 });
  if (limited) return limited;
  if (!isAuthorized(req)) {
    return NextResponse.json({ error: 'unauthorized' }, { status: 401 });
  }
  const entries = gatherDiscordWebhookEntries();
  const env = Object.fromEntries(entries.map(([key]) => [key, true]));
  return NextResponse.json({ ok: true, count: entries.length, env });
}

export async function POST(req: Request) {
  const limited = await rateLimitOrResponse(req, { bucket: 'webhooks_test_post', windowMs: 60_000, max: 5 });
  if (limited) return limited;
  if (!isAuthorized(req)) {
    return NextResponse.json({ error: 'unauthorized' }, { status: 401 });
  }

  const entries = gatherDiscordWebhookEntries();
  if (entries.length === 0) {
    return NextResponse.json({ ok: false, reason: 'no_webhooks_configured' }, { status: 400 });
  }

  const posted: Array<{ key: string; ok: boolean; reason?: string }> = [];

  for (const [key, url] of entries) {
    try {
      logger.info('Testing Discord webhook', { key });
      await postDiscordWebhook(url, {
        content: `Webhook test for ${key} at ${new Date().toISOString()}`,
      });
      posted.push({ key, ok: true });
    } catch (err: any) {
      logger.error('Webhook test failed', { key, err: String(err) });
      posted.push({ key, ok: false, reason: 'post_failed' });
    }
  }

  const successCount = posted.filter((p) => p.ok).length;
  const failureCount = posted.length - successCount;
  const requestId = req.headers.get('x-request-id') ?? undefined;
  logger.info('Webhook test dispatch complete', {
    total: posted.length,
    successCount,
    failureCount,
    requestId,
  });

  return NextResponse.json({ ok: true, posted });
}

