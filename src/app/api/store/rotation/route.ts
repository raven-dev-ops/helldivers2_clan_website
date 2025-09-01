// src/app/api/store/rotation/route.ts
import { NextResponse } from 'next/server';
import { fetchSuperstore } from '@/lib/helldivers/superstore';

export const revalidate = 60; // allow CDN to cache for a minute with SWR
export const runtime = 'nodejs';

export async function GET() {
  const { ok, data } = await fetchSuperstore();

  // Guard rails: if upstream empty or error, return empty arrays with short cache
  if (!ok || !data || (!data.rotatingSets?.length && !data.permanentCatalog?.length)) {
    return NextResponse.json(
      { rotatingSets: [], permanentCatalog: [] },
      { headers: { 'Cache-Control': 'max-age=60, stale-while-revalidate=300' } }
    );
  }

  // Enforce max 6 sets
  const rotatingSets = Array.isArray(data.rotatingSets) ? data.rotatingSets.slice(0, 6) : [];

  return NextResponse.json(
    {
      rotationEndsAt: data.rotationEndsAt,
      rotatingSets,
      permanentCatalog: Array.isArray(data.permanentCatalog) ? data.permanentCatalog : [],
    },
    {
      headers: {
        // Make SWR explicit for CDNs and clients
        'Cache-Control': 'max-age=300, stale-while-revalidate=300',
        'Content-Type': 'application/json; charset=utf-8',
      },
    }
  );
}

// Legacy POST removed: rotation now comes from upstream Superstore. If needed, add admin proxy elsewhere.
