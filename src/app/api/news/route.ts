// src/app/api/news/route.ts
import { NextResponse } from 'next/server';

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
    const url = 'https://api.helldivers2.com/api/war/news';
    const upstream = await fetch(url, {
      headers: {
        'User-Agent': 'GPT-Fleet-CommunitySite/1.0',
        Accept: 'application/json',
      },
      // Allow Next.js to cache on the edge for the same length as the
      // revalidate period to minimise calls to the upstream service.
      next: { revalidate: 300 },
    });

    if (!upstream.ok) throw new Error('upstream');

    const raw = await upstream.json();

    // Some upstreams return `{ news: [...] }` others `{ data: [...] }` or even
    // an array directly.  Normalise the shape here.
    const items: any[] = Array.isArray(raw?.news)
      ? raw.news
      : Array.isArray(raw?.data)
        ? raw.data
        : Array.isArray(raw)
          ? raw
          : [];

    const news = items.map((n, i) => ({
      id: n.id ?? i,
      title: n.title ?? n.headline ?? n.message ?? 'Update',
      message: n.message ?? n.body ?? '',
      published: n.published ?? n.timestamp ?? n.time ?? new Date().toISOString(),
    }));

    return NextResponse.json(
      { news },
      { headers: { 'Cache-Control': 's-maxage=300, stale-while-revalidate=300' } }
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