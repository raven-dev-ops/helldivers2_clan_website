// src/app/api/news/route.ts
import { NextResponse } from 'next/server';

export const revalidate = 300; // 5 min

export async function GET() {
  try {
    // HellHub/Game API NewsFeed endpoint (example path may vary by deployment)
    // Using Training Manual news as a fallback
    const url = 'https://helldiverstrainingmanual.com/api/v1/war/news';

    const upstream = await fetch(url, {
      headers: {
        'User-Agent': 'GPT-Fleet-CommunitySite/1.0',
        'Accept': 'application/json',
      },
      next: { revalidate: 300 },
    });

    if (!upstream.ok) {
      return NextResponse.json({ error: 'upstream', status: upstream.status }, { status: 502 });
    }

    const data = await upstream.json();

    return NextResponse.json(data, {
      headers: {
        'Cache-Control': 's-maxage=300, stale-while-revalidate=300',
      },
    });
  } catch (error) {
    return NextResponse.json({ error: 'unexpected' }, { status: 500 });
  }
}