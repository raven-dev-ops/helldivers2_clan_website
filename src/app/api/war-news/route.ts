// src/app/api/war-news/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { HellHubApi } from '@/lib/hellhub';
import { ArrowheadApi } from '@/lib/arrowhead';
import { logger } from '@/lib/logger';
import { strongETagFrom, cacheHeaders } from '@/lib/http/etag';

export const revalidate = 300; // 5 minutes
export const runtime = 'nodejs';

type Item = {
  id?: string | number;
  title?: string;
  message?: string;
  url?: string;
  link?: string;
  planet?: string;
  sector?: string;
  theater?: string;
  faction?: string;
  severity?: string;
  time?: string | number;
  published?: string | number;
  updatedAt?: string | number;
  createdAt?: string | number;
  timestamp?: string | number;
};

const asString = (v: unknown) =>
  typeof v === 'string' && v.trim() ? v.trim() : undefined;

const pickDate = (n: Item) => {
  const raw =
    (n as any).time ??
    n.published ??
    n.timestamp ??
    n.updatedAt ??
    n.createdAt ??
    Date.now();
  const d = new Date(raw as any);
  return isNaN(d.getTime()) ? new Date() : d;
};

export async function GET(req: NextRequest) {
  try {
    const startedAt = Date.now();
    // Prefer HellHub news if available (aggregated)
    let list: Item[] = [];
    const t0 = Date.now();
    const hh = await HellHubApi.getNews();
    const tHellHub = Date.now() - t0;
    if (hh.ok && hh.data) {
      const json: any = hh.data;
      list = Array.isArray(json)
        ? json
        : Array.isArray(json?.news)
        ? json.news
        : [];
    }
    if (!list.length) {
      // Fallback to Arrowhead NewsFeed for current war
      const t1 = Date.now();
      const ah = await ArrowheadApi.getNewsFeed(null);
      const tArrowhead = Date.now() - t1;
      if (ah.ok && ah.data) {
        const json: any = ah.data;
        list = Array.isArray(json) ? json : Array.isArray(json?.news) ? json.news : [];
      }
      logger.info('war-news timings', {
        timings: { hellHubMs: tHellHub, arrowheadMs: tArrowhead, totalMs: Date.now() - startedAt },
      });
    } else {
      logger.info('war-news timings', {
        timings: { hellHubMs: tHellHub, totalMs: Date.now() - startedAt },
      });
    }

    // Normalize and latest-first
    const news = list
      .map((n, i) => {
        const date = pickDate(n);
        const title =
          asString(n.title) ??
          asString((n as any).headline) ??
          asString(n.message)?.split('\n')[0]?.slice(0, 120) ??
          'War News';
        const message =
          asString(n.message) ??
          asString((n as any).body) ??
          asString((n as any).description);
        const url = asString(n.url) ?? asString(n.link);

        const metaBits = [
          asString(n.planet),
          asString(n.sector ?? (n as any).theater),
          asString(n.faction),
          asString(n.severity),
          'Helldivers Training Manual',
        ].filter(Boolean);

        return {
          id: String(n.id ?? `${title}-${date.getTime()}-${i}`),
          title,
          message,
          date: date.toISOString(),
          url,
          planet: asString(n.planet),
          sector: asString(n.sector ?? (n as any).theater),
          faction: asString(n.faction),
          severity: asString(n.severity),
          source: 'Helldivers Training Manual',
          meta: metaBits.length ? metaBits.join(' · ') : undefined,
        };
      })
      .reverse();

    // If upstream returned nothing, keep previous ETag response valid to avoid spamming empty updates
    if (!news.length) {
      const headers = {
        ...cacheHeaders({ maxAgeSeconds: 30, staleWhileRevalidateSeconds: 300 }),
        'Content-Type': 'application/json; charset=utf-8',
      } as Record<string, string>;
      return new NextResponse(JSON.stringify({ news: [] }), { status: 200, headers });
    }

    // ETag handling
    const body = { news };
    const etag = strongETagFrom(body);
    const ifNoneMatch = req.headers.get('if-none-match');
    const headers = {
      ...cacheHeaders({ maxAgeSeconds: 30, staleWhileRevalidateSeconds: 300 }),
      ETag: etag,
      'Content-Type': 'application/json; charset=utf-8',
    } as Record<string, string>;

    if (ifNoneMatch && ifNoneMatch === etag) {
      return new NextResponse(null, { status: 304, headers });
    }
    return new NextResponse(JSON.stringify(body), { status: 200, headers });
  } catch (err: any) {
    // Safe fallback
    return NextResponse.json(
      {
        news: [],
        _fallback: true,
        _error: err?.message || 'FetchError',
      },
      {
        status: 200,
        headers: {
          ...cacheHeaders({ maxAgeSeconds: 30, staleWhileRevalidateSeconds: 300 }),
        },
      }
    );
  }
}
