// src/app/api/war/major-orders/route.ts
import { NextResponse } from 'next/server';

export const revalidate = 300; // 5 min

export async function GET() {
  try {
    const upstream = await fetch('https://helldiverstrainingmanual.com/api/v1/war/major-orders', {
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