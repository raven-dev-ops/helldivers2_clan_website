// src/app/api/news/route.ts
import { NextResponse } from 'next/server';
import { HellHubApi } from '@/lib/hellhub';
import { ArrowheadApi } from '@/lib/arrowhead';

// Cache for five minutes. War news does not change often.
export const revalidate = 300;

/**
 * Retrieve the latest war news from Arrowhead's public API.  The upstream
 * responses have changed formats a few times so the handler normalises the
 * data into a consistent shape: an array of objects containing `id`,
 * `title`, `message` and `published` fields.  This makes the client side
 * component simpler and avoids defensive checks everywhere.
 */
export async function GET() {
  try {
    // Prefer Arrowhead NewsFeed for freshness; fallback to HellHub aggregated news
    let items: any[] = [];
    const ah = await ArrowheadApi.getNewsFeed(null);
    if (ah.ok && ah.data) {
      const raw = ah.data as any;
      items = Array.isArray(raw?.news)
        ? raw.news
        : Array.isArray(raw?.data)
        ? raw.data
        : Array.isArray(raw)
        ? raw
        : [];
    }
    if (!items.length) {
      const hh = await HellHubApi.getNews();
      if (hh.ok && hh.data) {
        const raw = hh.data as any;
        items = Array.isArray(raw?.news)
          ? raw.news
          : Array.isArray(raw?.data)
          ? raw.data
          : Array.isArray(raw)
          ? raw
          : [];
      }
    }

    const news = items.map((n, i) => ({
      id: n.id ?? i,
      title: n.title ?? n.headline ?? n.message ?? 'Update',
      message: n.message ?? n.body ?? '',
      published:
        n.published ?? n.timestamp ?? n.time ?? new Date().toISOString(),
    }));

    return NextResponse.json(
      { news },
      {
        headers: {
          'Cache-Control': 's-maxage=300, stale-while-revalidate=300',
        },
      }
    );
  } catch {
    // Fallback sample so the site still renders if the upstream is
    // unavailable.
    const sample = {
      news: [
        {
          id: 1,
          title: 'Helldivers hold the line on Malevelon Creek',
          message: 'Casualties are high but liberty prevails.',
          published: new Date().toISOString(),
        },
      ],
    };

    return NextResponse.json(sample, {
      headers: { 'Cache-Control': 's-maxage=300, stale-while-revalidate=300' },
    });
  }
}
