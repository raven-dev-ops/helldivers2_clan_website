// src/app/api/war/status/route.ts
import { NextResponse } from 'next/server';

export const runtime = 'edge';          // faster startup (optional)
export const revalidate = 60;           // ISR: 60s

const MAX_AGE = 60;                     // CDN cache: 60s
const STALE_AGE = 120;                  // serve stale while revalidating
const UPSTREAM = 'https://helldiverstrainingmanual.com/api/v1/war/status';
const UA = 'GPT-Fleet-CommunitySite/1.0';

type WarStatus = Record<string, any>;

async function fetchUpstream(): Promise<{
  ok: boolean;
  data?: WarStatus | null;
  status: number;
  statusText: string;
}> {
  const ac = new AbortController();
  const timer = setTimeout(() => ac.abort(), 8000); // 8s timeout

  try {
    const r = await fetch(UPSTREAM, {
      headers: { 'User-Agent': UA, Accept: 'application/json' },
      next: { revalidate: MAX_AGE },
      cache: 'force-cache',
      signal: ac.signal,
    });

    const ct = r.headers.get('content-type') || '';
    if (!ct.includes('application/json')) {
      return { ok: false, data: null, status: r.status, statusText: r.statusText };
    }

    let data: any = null;
    try {
      data = await r.json();
    } catch {
      /* ignore parse error -> treat as not ok */
    }

    return { ok: r.ok && !!data, data, status: r.status, statusText: r.statusText };
  } catch (e: any) {
    return { ok: false, data: null, status: 599, statusText: e?.name || 'FetchError' };
  } finally {
    clearTimeout(timer);
  }
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
