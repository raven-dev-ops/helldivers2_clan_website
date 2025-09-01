// src/app/api/war/info/route.ts
import { NextResponse } from 'next/server';
import { HellHubApi } from '@/lib/hellhub';
import { ArrowheadApi } from '@/lib/arrowhead';

export const runtime = 'edge';            // optional: faster cold starts
export const revalidate = 60;             // 60s for fresher data during dev

const MAX_AGE = 60;                       // 60s CDN cache

type WarInfo = {
  planets?: Array<{
    id: number | string;
    name: string;
    biome?: string;
    environmentals?: string[];
  }>;
  // add other fields from the upstream as needed
};

async function fetchUpstream(): Promise<{
  ok: boolean;
  data?: WarInfo;
  status: number;
  statusText: string;
}> {
  // Prefer Arrowhead live Info for freshness
  const ah = await ArrowheadApi.getWarInfo(null);
  if (ah.ok && ah.data) {
    return { ok: true, data: ah.data as any, status: 200, statusText: 'OK' };
  }

  // Fallback to HellHub aggregator
  try {
    const hh = await HellHubApi.getWar();
    if (hh.ok && hh.data) {
      return { ok: true, data: hh.data as any, status: 200, statusText: 'OK' };
    }
    return { ok: false, data: undefined, status: hh.status, statusText: hh.statusText } as const;
  } catch {
    return { ok: false, data: undefined, status: 599, statusText: 'FetchError' } as const;
  }
}

export async function GET() {
  const { ok, data, status, statusText } = await fetchUpstream();

  const body: WarInfo =
    ok && data
      ? data
      : {
          planets: [
            {
              id: 1,
              name: 'Super Earth',
              biome: 'urban',
              environmentals: ['none'],
            },
          ],
        };

  const headers = {
    // Shorter CDN caching for freshness while you validate
    'Cache-Control': `s-maxage=${MAX_AGE}, stale-while-revalidate=${MAX_AGE}`,
    'Content-Type': 'application/json; charset=utf-8',
  };

  if (!ok) {
    // Return fallback but indicate we used it (helps telemetry/UI)
    return NextResponse.json(
      { ...body, _fallback: true, _error: `Upstream ${status} ${statusText}` },
      { status: 200, headers }
    );
  }

  return NextResponse.json(body, { status: 200, headers });
}

// Optional: lightweight HEAD for health checks / warmups, mirrors cache headers
export async function HEAD() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Cache-Control': `s-maxage=${MAX_AGE}, stale-while-revalidate=${MAX_AGE}`,
    },
  });
}
