// src/app/api/war-news/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { HellHubApi } from '@/lib/hellhub';
import { ArrowheadApi } from '@/lib/arrowhead';
import { logger } from '@/lib/logger';
import { strongETagFrom, cacheHeaders } from '@/lib/http/etag';

// Reduce route-level cache to 30s to improve freshness
export const revalidate = 0;
export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
export const fetchCache = 'default-no-store';

const TWENTY_FOUR_HOURS_MS = 86_400_000;

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

// Parses a variety of upstream date formats safely.
// - Accepts ISO strings containing a date
// - Accepts epoch seconds/milliseconds (strings or numbers)
// - Ignores short time-of-day strings (e.g., "00:48:19.330Z") which would map to 1970
const parseDateValue = (raw: unknown): Date | null => {
  if (raw == null) return null;
  if (typeof raw === 'number') {
    const n = raw;
    // Treat plausible seconds since epoch as seconds; smaller numbers are ignored
    const ms = n < 1e12 ? (n > 1e9 ? n * 1000 : NaN) : n;
    const d = new Date(ms);
    return isNaN(d.getTime()) ? null : d;
  }
  if (typeof raw === 'string') {
    const s = raw.trim();
    if (!s) return null;
    // Pure digits -> numeric epoch
    if (/^\d+$/.test(s)) {
      const n = Number(s);
      const ms = n < 1e12 ? (n > 1e9 ? n * 1000 : NaN) : n;
      const d = new Date(ms);
      return isNaN(d.getTime()) ? null : d;
    }
    // Require a date component in the string
    if (s.includes('T') || s.includes('-') || s.includes('/')) {
      const d = new Date(s);
      return isNaN(d.getTime()) ? null : d;
    }
    return null;
  }
  return null;
};

const pickDate = (n: Item) => {
  // Prefer fields that commonly contain full ISO timestamps; check 'time' last
  const candidates: Array<unknown> = [
    (n as any).published,
    (n as any).timestamp,
    (n as any).updatedAt,
    (n as any).createdAt,
    (n as any).time,
  ];
  for (const c of candidates) {
    const d = parseDateValue(c);
    if (d) return d;
  }
  return null;
};

// Type guard that narrows to objects with a non-NaN Date in the `date` field
const hasValidDate = <T extends { date: Date | null }>(x: T): x is T & { date: Date } =>
  x.date instanceof Date && !isNaN(x.date.getTime());

export async function GET(req: NextRequest) {
  try {
    const startedAt = Date.now();
    // Prefer Arrowhead NewsFeed for freshness; fallback to HellHub aggregated news
    let list: Item[] = [];
    let tHellHub = 0;
    let tArrowhead = 0;
    let listSource: 'arrowhead' | 'hellhub' | undefined = undefined;

    const tA = Date.now();
    const ah = await ArrowheadApi.getNewsFeed(null);
    tArrowhead = Date.now() - tA;
    if (ah.ok && ah.data) {
      const json: any = ah.data;
      const arr = Array.isArray(json) ? json : Array.isArray(json?.news) ? json.news : [];
      if (arr.length) {
        list = arr as Item[];
        listSource = 'arrowhead';
      }
    }

    if (!list.length) {
      const tH = Date.now();
      const hh = await HellHubApi.getNews();
      tHellHub = Date.now() - tH;
      if (hh.ok && hh.data) {
        const json: any = hh.data;
        const arr = Array.isArray(json)
          ? json
          : Array.isArray(json?.news)
          ? json.news
          : Array.isArray(json?.data)
          ? json.data
          : [];
        if (arr.length) {
          list = arr as Item[];
          listSource = 'hellhub';
        }
      }
    }

    logger.info('war-news timings', {
      timings: { hellHubMs: tHellHub, arrowheadMs: tArrowhead, totalMs: Date.now() - startedAt },
    });

    // Normalize and sort newest-first by computed date
    const newsAll = list
      .map((n, i) => ({ raw: n, index: i, date: pickDate(n) }))
      .filter(hasValidDate)
      .sort((a, b) => b.date.getTime() - a.date.getTime())
      .map(({ raw: n, index: i, date }) => {
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
        const source =
          asString((n as any).source) ||
          asString((n as any).author) ||
          (listSource === 'arrowhead' ? 'Arrowhead' : undefined);
        const metaBits = [
          asString(n.planet),
          asString(n.sector ?? (n as any).theater),
          asString(n.faction),
          asString(n.severity),
          source,
        ].filter(Boolean);

        return {
          id: String((n as any).id ?? `${title}-${date.getTime()}-${i}`),
          title,
          message,
          date: date.toISOString(),
          published: date.toISOString(),
          url,
          planet: asString((n as any).planet),
          sector: asString((n as any).sector ?? (n as any).theater),
          faction: asString((n as any).faction),
          severity: asString((n as any).severity),
          source,
          meta: metaBits.length ? metaBits.join(' · ') : undefined,
        };
      });

    // Filter to last 24 hours for freshness
    const now = Date.now();
    const news = newsAll.filter((item) => {
      const t = new Date((item as any).published || (item as any).date).getTime();
      return Number.isFinite(t) && now - t <= TWENTY_FOUR_HOURS_MS;
    });

    // If upstream returned nothing, keep previous ETag response valid to avoid spamming empty updates
    if (!news.length) {
      const headers = {
        'Cache-Control': 'no-store',
        'Content-Type': 'application/json; charset=utf-8',
      } as Record<string, string>;
      return new NextResponse(JSON.stringify({ news: [] }), { status: 200, headers });
    }

    // ETag handling
    const body = { news };
    const etag = strongETagFrom(body);
    const ifNoneMatch = req.headers.get('if-none-match');
    const headers = {
      'Cache-Control': 'no-store',
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
          'Cache-Control': 'no-store',
        },
      }
    );
  }
}
