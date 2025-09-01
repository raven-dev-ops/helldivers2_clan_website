// src/app/api/cron/post-super-store/route.ts
import { NextResponse } from 'next/server';
import { logger } from '@/lib/logger';
import { postDiscordWebhook } from '@/lib/discordWebhook';
import { fetchSuperstore } from '@/lib/helldivers/superstore';

export const runtime = 'nodejs';

function isAuthorized(req: Request): boolean {
  const token = process.env.CRON_SECRET;
  if (!token) return true; // allow local/manual if unset
  const hdr = req.headers.get('authorization') || '';
  const provided = hdr.startsWith('Bearer ') ? hdr.slice(7) : null;
  return Boolean(provided && provided === token);
}

function summarizeRotation(data: any): string {
  const lines: string[] = ['**Super Store Rotation**'];
  const endsAt = data?.rotationEndsAt ? new Date(data.rotationEndsAt) : undefined;
  if (endsAt && !isNaN(endsAt.getTime())) {
    lines.push(`Ends: ${new Intl.DateTimeFormat(undefined, { year: 'numeric', month: 'short', day: '2-digit', hour: 'numeric', minute: '2-digit' }).format(endsAt)}`);
  }
  const sets = Array.isArray(data?.rotatingSets) ? data.rotatingSets.slice(0, 6) : [];
  for (const set of sets) {
    const name = set?.name || set?.title || 'Set';
    const price = set?.price ? ` — ${set.price}` : '';
    lines.push(`• ${name}${price}`);
  }
  return lines.join('\n');
}

export async function POST(req: Request) {
  if (!isAuthorized(req)) {
    return NextResponse.json({ error: 'unauthorized' }, { status: 401 });
  }

  const webhook = process.env.DISCORD_INTEL_WEBHOOK_URL;
  if (!webhook) {
    return NextResponse.json({ ok: false, reason: 'no_webhook_configured' }, { status: 400 });
  }

  try {
    const { ok, data } = await fetchSuperstore();
    if (!ok || !data) {
      return NextResponse.json({ ok: true, posted: 0, reason: 'no_rotation' });
    }
    const content = summarizeRotation(data).slice(0, 1900);
    await postDiscordWebhook(webhook, { content });
    return NextResponse.json({ ok: true, posted: 1 });
  } catch (err: any) {
    logger.error('Failed to post super store rotation', { err: String(err) });
    return NextResponse.json({ ok: false, reason: 'post_failed' }, { status: 500 });
  }
}

export async function GET(req: Request) {
  if (!isAuthorized(req)) {
    return NextResponse.json({ error: 'unauthorized' }, { status: 401 });
  }
  return NextResponse.json({ ok: true, env: { DISCORD_INTEL_WEBHOOK_URL: !!process.env.DISCORD_INTEL_WEBHOOK_URL } });
}

