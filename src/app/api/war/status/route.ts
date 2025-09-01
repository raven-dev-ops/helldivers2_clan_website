// src/app/api/war/status/route.ts
import { NextResponse } from 'next/server';
import { HellHubApi } from '@/lib/hellhub';
import { ArrowheadApi } from '@/lib/arrowhead';

export const runtime = 'edge';          // faster startup (optional)
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
  // 1) Try HellHub aggregator first
  try {
    const hh = await HellHubApi.getWar();
    if (hh.ok && hh.data) {
      return { ok: true, data: hh.data as any, status: 200, statusText: 'OK' };
    }
  } catch {}

  // 2) Fallback to Arrowhead live API
  const ah = await ArrowheadApi.getWarStatus(null);
  if (ah.ok && ah.data) {
    return { ok: true, data: ah.data as any, status: 200, statusText: 'OK' };
  }
  return { ok: false, data: null, status: ah.status, statusText: ah.statusText };
}

export async function GET() {
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

  const headers = {
    'Cache-Control': `s-maxage=${MAX_AGE}, stale-while-revalidate=${STALE_AGE}`,
    'Content-Type': 'application/json; charset=utf-8',
  };

  return NextResponse.json(body, { status: 200, headers });
}

export async function HEAD() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Cache-Control': `s-maxage=${MAX_AGE}, stale-while-revalidate=${STALE_AGE}`,
    },
  });
}
