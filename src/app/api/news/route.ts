// src/app/api/news/route.ts
import { NextResponse } from 'next/server';

export const revalidate = 300; // 5 min

export async function GET() {
  try {
    const url = 'https://helldiverstrainingmanual.com/api/v1/war/news';
    const upstream = await fetch(url, {
      headers: {
        'User-Agent': 'GPT-Fleet-CommunitySite/1.0',
        'Accept': 'application/json',
      },
      next: { revalidate: 300 },
    });
    if (upstream.ok) {
      const data = await upstream.json();
      return NextResponse.json(data, {
        headers: { 'Cache-Control': 's-maxage=300, stale-while-revalidate=300' },
      });
    }
    throw new Error('upstream');
  } catch {
    const sample = {
      news: [
        { id: 1, title: 'Helldivers hold the line on Malevelon Creek', published: new Date().toISOString() },
      ],
    };
    return NextResponse.json(sample, {
      headers: { 'Cache-Control': 's-maxage=300, stale-while-revalidate=300' },
    });
  }
}