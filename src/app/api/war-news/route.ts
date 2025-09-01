// src/app/api/war-news/route.ts
import { NextResponse } from 'next/server';
import { HellHubApi } from '@/lib/hellhub';
import { ArrowheadApi } from '@/lib/arrowhead';

export const revalidate = 300; // 5 minutes

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

export async function GET() {
  try {
    // Prefer HellHub news if available (aggregated)
    let list: Item[] = [];
    const hh = await HellHubApi.getNews();
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
      const ah = await ArrowheadApi.getNewsFeed(null);
      if (ah.ok && ah.data) {
        const json: any = ah.data;
        list = Array.isArray(json) ? json : Array.isArray(json?.news) ? json.news : [];
      }
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

    return NextResponse.json(
      { news },
      {
        headers: {
          'Cache-Control': 's-maxage=300, stale-while-revalidate=300',
        },
      }
    );
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
          'Cache-Control': 's-maxage=60, stale-while-revalidate=120',
        },
      }
    );
  }
}
