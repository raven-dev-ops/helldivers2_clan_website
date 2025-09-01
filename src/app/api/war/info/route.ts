// src/app/api/war/info/route.ts
import { NextResponse } from 'next/server';

export const runtime = 'edge';            // optional: faster cold starts
export const revalidate = 60;             // 60s for fresher data during dev

const MAX_AGE = 60;                       // 60s CDN cache
const UPSTREAM = 'https://helldiverstrainingmanual.com/api/v1/war/info';
const UA = 'GPT-Fleet-CommunitySite/1.0';

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
  const ac = new AbortController();
  const timer = setTimeout(() => ac.abort(), 8000); // 8s timeout

  try {
    const res = await fetch(UPSTREAM, {
      headers: {
        'User-Agent': UA,
        Accept: 'application/json',
      },
      // cache via Next’s ISR; CDN cache headers are set on the response below
      next: { revalidate: MAX_AGE },
      cache: 'force-cache',
      signal: ac.signal,
    });

    const ct = res.headers.get('content-type') || '';
    const isJSON = ct.includes('application/json');

    let data: any;
    if (isJSON) {
      try {
        data = await res.json();
      } catch {
        // fall through to error path below
      }
    }

    return { ok: res.ok && !!data, data, status: res.status, statusText: res.statusText };
  } finally {
    clearTimeout(timer);
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
