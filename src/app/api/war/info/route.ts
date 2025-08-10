// src/app/api/war/info/route.ts
import { NextResponse } from 'next/server';

export const revalidate = 86400; // 24h

export async function GET() {
  try {
    const upstream = await fetch('https://helldiverstrainingmanual.com/api/v1/war/info', {
      headers: {
        'User-Agent': 'GPT-Fleet-CommunitySite/1.0',
        'Accept': 'application/json',
      },
      next: { revalidate: 86400 },
    });

    if (!upstream.ok) {
      return NextResponse.json({ error: 'upstream', status: upstream.status }, { status: 502 });
    }

    const data = await upstream.json();

    return NextResponse.json(data, {
      headers: {
        'Cache-Control': 's-maxage=86400, stale-while-revalidate=86400',
      },
    });
  } catch (error) {
    return NextResponse.json({ error: 'unexpected' }, { status: 500 });
  }
}