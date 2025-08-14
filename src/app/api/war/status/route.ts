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
    if (upstream.ok) {
      const data = await upstream.json();
      return NextResponse.json(data, {
        headers: { 'Cache-Control': 's-maxage=60, stale-while-revalidate=120' },
      });
    }
    throw new Error('upstream');
  } catch {
    const sample = {
      status: 'Unknown',
      galactic_war: { progress: 0 },
    };
    return NextResponse.json(sample, {
      headers: { 'Cache-Control': 's-maxage=60, stale-while-revalidate=120' },
    });
  }
}