// src/app/api/war/status/route.ts
import { NextResponse } from 'next/server';

export const revalidate = 60;

export async function GET() {
  try {
    const upstream = await fetch('https://helldiverstrainingmanual.com/api/v1/war/status', {
      headers: {
        'User-Agent': 'GPT-Fleet-CommunitySite/1.0',
        'Accept': 'application/json',
      },
      next: { revalidate: 60 },
    });

    if (!upstream.ok) {
      return NextResponse.json({ error: 'upstream', status: upstream.status }, { status: 502 });
    }

    const data = await upstream.json();

    return NextResponse.json(data, {
      headers: {
        'Cache-Control': 's-maxage=60, stale-while-revalidate=120',
      },
    });
  } catch (error) {
    return NextResponse.json({ error: 'unexpected' }, { status: 500 });
  }
}