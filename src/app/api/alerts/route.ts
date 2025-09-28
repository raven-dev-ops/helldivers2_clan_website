// src/app/api/alerts/route.ts
export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
export const revalidate = 0;

import { NextResponse } from 'next/server';

export async function GET() {
  // TODO: plug in real alerts later
  return NextResponse.json(
    { alerts: [], updatedAt: new Date().toISOString() },
    {
      headers: {
        'Cache-Control': 'public, max-age=30, stale-while-revalidate=300',
      },
    }
  );
}
