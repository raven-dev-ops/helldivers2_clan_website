// src/app/api/war/status/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { HellHubApi } from '@/lib/hellhub';
import { ArrowheadApi } from '@/lib/arrowhead';
import { jsonWithETag } from '@/lib/httpCache';

export const runtime = 'nodejs';        // use Node runtime for hashing/ETag
export const revalidate = 60;           // ISR: 60s

const MAX_AGE = 60;                     // CDN cache: 60s
const STALE_AGE = 120;                  // serve stale while revalidating

type WarStatus = Record<string, any>;

async function fetchUpstream(): Promise<{
  ok: boolean;
  data?: WarStatus | null;
  status: number;
  statusText: string;
}> {
  // 1) Try Arrowhead live API first for freshness
  const ah = await ArrowheadApi.getWarStatus(null);
  if (ah.ok && ah.data) {
    return { ok: true, data: ah.data as any, status: 200, statusText: 'OK' };
  }

  // 2) Fallback to HellHub aggregator
  try {
    const hh = await HellHubApi.getWar();
    if (hh.ok && hh.data) {
      return { ok: true, data: hh.data as any, status: 200, statusText: 'OK' };
    }
    return { ok: false, data: null, status: hh.status, statusText: hh.statusText } as const;
  } catch {
    return { ok: false, data: null, status: 599, statusText: 'FetchError' } as const;
  }
}

export async function GET(req: NextRequest) {
  const { ok, data, status, statusText } = await fetchUpstream();

  const body: WarStatus =
    ok && data
      ? data
      : {
          status: 'Unknown',
          galactic_war: { progress: 0 },
          _fallback: true,
          _error: `Upstream ${status} ${statusText}`,
        };

  return jsonWithETag(req, body, {
    headers: {
      'Cache-Control': `s-maxage=${MAX_AGE}, stale-while-revalidate=${STALE_AGE}`,
    },
  });
}

export async function HEAD() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Cache-Control': `s-maxage=${MAX_AGE}, stale-while-revalidate=${STALE_AGE}`,
    },
  });
}
