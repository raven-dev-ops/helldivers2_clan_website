// src/app/api/cron/post-galactic-map/route.ts
import { NextResponse } from 'next/server';
import { logger } from '@/lib/logger';
import { postDiscordWebhook } from '@/lib/discordWebhook';
import { ArrowheadApi } from '@/lib/arrowhead';
import { HellHubApi } from '@/lib/hellhub';

export const runtime = 'nodejs';

function isAuthorized(req: Request): boolean {
  const token = process.env.CRON_SECRET;
  if (!token) return true; // allow local/manual if unset
  const hdr = req.headers.get('authorization') || '';
  const provided = hdr.startsWith('Bearer ') ? hdr.slice(7) : null;
  return Boolean(provided && provided === token);
}

function summarizeWarStatus(status: any): string {
  try {
    const progress = status?.galactic_war?.progress;
    const percent = typeof progress === 'number' ? Math.round(progress * 100) : undefined;
    const frontCount = Array.isArray(status?.fronts) ? status.fronts.length : undefined;
    const factions = Array.isArray(status?.factions)
      ? status.factions.map((f: any) => f?.name || f?.id).filter(Boolean).join(' · ')
      : undefined;
    const lines: string[] = ['**Galactic Map Update**'];
    if (typeof percent === 'number') lines.push(`War Progress: ${percent}%`);
    if (typeof frontCount === 'number') lines.push(`Active Fronts: ${frontCount}`);
    if (factions) lines.push(`Factions: ${factions}`);
    return lines.join('\n');
  } catch {
    return '**Galactic Map Update**';
  }
}

async function fetchUpstream(): Promise<any | null> {
  // Prefer Arrowhead live war status; fallback to HellHub
  const ah = await ArrowheadApi.getWarStatus(null);
  if (ah.ok && ah.data) return ah.data as any;
  const hh = await HellHubApi.getWar();
  if (hh.ok && hh.data) return hh.data as any;
  return null;
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
    const status = await fetchUpstream();
    if (!status) {
      return NextResponse.json({ ok: true, posted: 0, reason: 'no_status' });
    }
    const content = summarizeWarStatus(status).slice(0, 1900);
    await postDiscordWebhook(webhook, { content });
    return NextResponse.json({ ok: true, posted: 1 });
  } catch (err: any) {
    logger.error('Failed to post galactic map', { err: String(err) });
    return NextResponse.json({ ok: false, reason: 'post_failed' }, { status: 500 });
  }
}

export async function GET(req: Request) {
  if (!isAuthorized(req)) {
    return NextResponse.json({ error: 'unauthorized' }, { status: 401 });
  }
  return NextResponse.json({ ok: true, env: { DISCORD_INTEL_WEBHOOK_URL: !!process.env.DISCORD_INTEL_WEBHOOK_URL } });
}

