// src/app/api/war/info/route.ts
import { NextResponse } from 'next/server';

export const revalidate = 86400; // 24h

export async function GET() {
  try {
    const upstream = await fetch(
      'https://helldiverstrainingmanual.com/api/v1/war/info',
      {
        headers: {
          'User-Agent': 'GPT-Fleet-CommunitySite/1.0',
          Accept: 'application/json',
        },
        next: { revalidate: 86400 },
      }
    );
    if (upstream.ok) {
      const data = await upstream.json();
      return NextResponse.json(data, {
        headers: {
          'Cache-Control': 's-maxage=86400, stale-while-revalidate=86400',
        },
      });
    }
    throw new Error('upstream');
  } catch {
    const sample = {
      planets: [
        {
          id: 1,
          name: 'Super Earth',
          biome: 'urban',
          environmentals: ['none'],
        },
      ],
    };
    return NextResponse.json(sample, {
      headers: {
        'Cache-Control': 's-maxage=86400, stale-while-revalidate=86400',
      },
    });
  }
}
