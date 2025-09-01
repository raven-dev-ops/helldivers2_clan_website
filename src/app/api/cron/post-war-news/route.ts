// src/app/api/cron/post-war-news/route.ts
import { NextResponse } from 'next/server';
import { logger } from '@/lib/logger';
import { HellHubApi } from '@/lib/hellhub';
import { ArrowheadApi } from '@/lib/arrowhead';
import { postDiscordWebhook } from '@/lib/discordWebhook';

export const runtime = 'nodejs';

function isAuthorized(req: Request): boolean {
  const token = process.env.CRON_SECRET;
  if (!token) return true; // allow local/manual if unset
  const hdr = req.headers.get('authorization') || '';
  const provided = hdr.startsWith('Bearer ') ? hdr.slice(7) : null;
  return Boolean(provided && provided === token);
}

type NewsItem = {
  id?: string | number;
  title?: string;
  message?: string;
  url?: string;
  link?: string;
  planet?: string;
  sector?: string;
  faction?: string;
  severity?: string;
  time?: string | number;
  published?: string | number;
  updatedAt?: string | number;
  createdAt?: string | number;
  timestamp?: string | number;
};

const asString = (v: unknown) => (typeof v === 'string' && v.trim() ? v.trim() : undefined);

function pickDate(n: NewsItem) {
  const raw = (n as any).time ?? n.published ?? n.timestamp ?? n.updatedAt ?? n.createdAt ?? Date.now();
  const d = new Date(raw as any);
  return isNaN(d.getTime()) ? new Date() : d;
}

function formatForDiscord(n: NewsItem) {
  const date = pickDate(n);
  const title =
    asString(n.title) ||
    asString((n as any).headline) ||
    asString(n.message)?.split('\n')[0]?.slice(0, 120) ||
    'War News';
  const url = asString(n.url) ?? asString(n.link);
  const body = asString(n.message) ?? asString((n as any).body) ?? '';
  const bits = [
    asString(n.planet),
    asString(n.sector ?? (n as any).theater),
    asString(n.faction),
    asString(n.severity),
  ].filter(Boolean);
  const meta = bits.length ? `\n_${bits.join(' · ')}_` : '';
  const when = new Intl.DateTimeFormat(undefined, {
    year: 'numeric', month: 'short', day: '2-digit', hour: 'numeric', minute: '2-digit',
  }).format(date);
  const link = url ? `\n<${url}>` : '';
  return `**${title}**\n${body}${meta}${link}\n_${when}_`;
}

async function fetchUpstream(): Promise<NewsItem[]> {
  // Prefer HellHub aggregated news; fallback to Arrowhead NewsFeed
  const hh = await HellHubApi.getNews();
  if (hh.ok && hh.data) {
    const raw: any = hh.data;
    const items = Array.isArray(raw)
      ? raw
      : Array.isArray(raw?.news)
      ? raw.news
      : Array.isArray(raw?.data)
      ? raw.data
      : [];
    if (items.length) return items;
  }
  const ah = await ArrowheadApi.getNewsFeed(null);
  if (ah.ok && ah.data) {
    const raw: any = ah.data;
    return Array.isArray(raw) ? raw : Array.isArray(raw?.news) ? raw.news : [];
  }
  return [];
}

export async function POST(req: Request) {
  if (!isAuthorized(req)) {
    return NextResponse.json({ error: 'unauthorized' }, { status: 401 });
  }

  // Prefer unified INTEL webhook for all Intel posts; fallback to legacy WAR_NEWS if provided
  const webhook = process.env.DISCORD_INTEL_WEBHOOK_URL || process.env.DISCORD_WAR_NEWS_WEBHOOK_URL;
  if (!webhook) {
    return NextResponse.json({ ok: false, reason: 'no_webhook_configured' }, { status: 400 });
  }

  try {
    const list = await fetchUpstream();
    if (!list.length) {
      return NextResponse.json({ ok: true, posted: 0, reason: 'no_news' });
    }

    // Post the most recent 1-3 items, depending on length
    const latest = list
      .map((n, i) => ({ n, i, date: pickDate(n) }))
      .sort((a, b) => b.date.getTime() - a.date.getTime())
      .slice(0, Math.min(3, list.length))
      .map((x) => x.n);

    for (const item of latest) {
      const content = formatForDiscord(item).slice(0, 1900); // keep under Discord limit
      await postDiscordWebhook(webhook, { content });
    }
    return NextResponse.json({ ok: true, posted: latest.length });
  } catch (err: any) {
    logger.error('Failed to post war news', { err: String(err) });
    return NextResponse.json({ ok: false, reason: 'post_failed' }, { status: 500 });
  }
}

export async function GET(req: Request) {
  if (!isAuthorized(req)) {
    return NextResponse.json({ error: 'unauthorized' }, { status: 401 });
  }
  return NextResponse.json({
    ok: true,
    env: {
      DISCORD_INTEL_WEBHOOK_URL: !!process.env.DISCORD_INTEL_WEBHOOK_URL,
      DISCORD_WAR_NEWS_WEBHOOK_URL: !!process.env.DISCORD_WAR_NEWS_WEBHOOK_URL,
    },
  });
}

