// src/app/api/cron/post-major-orders/route.ts
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

type MajorOrder = {
  id?: string | number;
  title?: string;
  description?: string;
  expires?: string | number;
  progress?: number;
  goal?: number;
};

const asString = (v: unknown) => (typeof v === 'string' && v.trim() ? v.trim() : undefined);

function pickExpires(raw: any): Date | undefined {
  const v = raw?.expires ?? raw?.expiry ?? raw?.endTime ?? raw?.expiresAt ?? raw?.end;
  if (!v) return undefined;
  const d = new Date(v);
  return isNaN(d.getTime()) ? undefined : d;
}

function formatOrder(o: MajorOrder, i: number): string {
  const title = asString(o.title) ?? 'Major Order';
  const desc = asString(o.description) ?? '';
  const expires = pickExpires(o as any);
  const parts: string[] = [`**${title}**`];
  if (desc) parts.push(desc);
  const progress = typeof o.progress === 'number' ? o.progress : undefined;
  const goal = typeof o.goal === 'number' ? o.goal : undefined;
  if (typeof progress === 'number' && typeof goal === 'number') {
    parts.push(`Progress: ${Math.round((progress / Math.max(1, goal)) * 100)}% (${progress}/${goal})`);
  } else if (typeof progress === 'number') {
    parts.push(`Progress: ${Math.round(progress * 100)}%`);
  }
  if (expires) {
    parts.push(`_Expires: ${new Intl.DateTimeFormat(undefined, { year: 'numeric', month: 'short', day: '2-digit', hour: 'numeric', minute: '2-digit' }).format(expires)}_`);
  }
  return parts.join('\n');
}

async function fetchUpstream(): Promise<MajorOrder[]> {
  // Prefer Arrowhead assignments for freshness; fallback to HellHub
  const ah = await ArrowheadApi.getAssignments(null);
  if (ah.ok && ah.data) {
    const raw: any = ah.data;
    const list: any[] = Array.isArray(raw)
      ? raw
      : Array.isArray(raw?.orders)
      ? raw.orders
      : Array.isArray(raw?.assignments)
      ? raw.assignments
      : [];
    if (list.length) return list;
  }
  const hh = await HellHubApi.getAssignments();
  if (hh.ok && hh.data) {
    const raw: any = hh.data;
    return Array.isArray(raw)
      ? raw
      : Array.isArray(raw?.orders)
      ? raw.orders
      : Array.isArray(raw?.assignments)
      ? raw.assignments
      : [];
  }
  return [];
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
    const rawList = await fetchUpstream();
    if (!rawList.length) {
      return NextResponse.json({ ok: true, posted: 0, reason: 'no_orders' });
    }
    // Post the most recent up to 3 orders
    const latest = rawList.slice(0, Math.min(3, rawList.length));
    for (let i = 0; i < latest.length; i++) {
      const content = formatOrder(latest[i], i).slice(0, 1900);
      await postDiscordWebhook(webhook, { content });
    }
    return NextResponse.json({ ok: true, posted: latest.length });
  } catch (err: any) {
    logger.error('Failed to post major orders', { err: String(err) });
    return NextResponse.json({ ok: false, reason: 'post_failed' }, { status: 500 });
  }
}

export async function GET(req: Request) {
  if (!isAuthorized(req)) {
    return NextResponse.json({ error: 'unauthorized' }, { status: 401 });
  }
  return NextResponse.json({ ok: true, env: { DISCORD_INTEL_WEBHOOK_URL: !!process.env.DISCORD_INTEL_WEBHOOK_URL } });
}

