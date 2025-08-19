import { NextRequest, NextResponse } from 'next/server';

export const revalidate = 60; // CDN / ISR-friendly

function qs(params: Record<string, string | number | undefined>) {
  const url = new URLSearchParams();
  Object.entries(params).forEach(([k, v]) => {
    if (v !== undefined) url.set(k, String(v));
  });
  return url.toString();
}

async function fetchScope(
  base: string,
  scope: string,
  sortBy?: string,
  sortDir?: string,
  limit = 100
) {
  const q = qs({ scope, sortBy, sortDir, limit });
  const res = await fetch(`${base}/api/helldivers/leaderboard?${q}`, {
    headers: { Accept: 'application/json' },
    next: { revalidate: 60 },
  });
  if (!res.ok) {
    return { error: res.status, results: [] as any[] };
  }
  return res.json();
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const sortBy = searchParams.get('sortBy') ?? 'Kills';
  const sortDir = searchParams.get('sortDir') ?? 'desc';
  const limit = Number(searchParams.get('limit') ?? '100');

  const proto = req.headers.get('x-forwarded-proto') ?? 'https';
  const host = req.headers.get('x-forwarded-host') ?? req.headers.get('host')!;
  const base = `${proto}://${host}`;

  const [day, week, month, lifetime] = await Promise.all([
    fetchScope(base, 'day', sortBy, sortDir, limit),
    fetchScope(base, 'week', sortBy, sortDir, limit),
    fetchScope(base, 'month', sortBy, sortDir, limit),
    fetchScope(base, 'lifetime', sortBy, sortDir, Math.min(limit, 1000)),
  ]);

  return NextResponse.json(
    { day, week, month, lifetime },
    {
      headers: {
        'Cache-Control': 's-maxage=60, stale-while-revalidate=300',
      },
    }
  );
}
