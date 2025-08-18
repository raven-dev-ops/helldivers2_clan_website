// src/app/api/war/major-orders/route.ts
import { NextResponse } from 'next/server';

export const runtime = 'edge';          // optional: faster cold starts
export const revalidate = 300;          // 5 min

const MAX_AGE = 300;                    // 5 min
const UPSTREAM = 'https://helldiverstrainingmanual.com/api/v1/war/major-orders';
const UA = 'GPT-Fleet-CommunitySite/1.0';

type RawOrder = Record<string, any>;
type MajorOrder = {
  id: string;
  title: string;
  description?: string;
  expires?: string;     // ISO
  progress?: number;    // 0..1 or absolute (depends on upstream)
  goal?: number;
  reward?: string;
  source: 'Helldivers Training Manual';
};

type ApiShape = { orders: MajorOrder[] };

const asString = (v: unknown) => (typeof v === 'string' && v.trim() ? v.trim() : undefined);
const toISO = (v: any) => {
  const d = new Date(v);
  return isNaN(d.getTime()) ? undefined : d.toISOString();
};

function normalize(raw: RawOrder, i: number): MajorOrder {
  const title =
    asString(raw.title) ??
    asString(raw.name) ??
    asString(raw.headline) ??
    'Major Order';

  return {
    id: String(raw.id ?? `${title}-${raw.expires ?? raw.expiry ?? i}`),
    title,
    description: asString(raw.description ?? raw.body ?? raw.text),
    expires: toISO(raw.expires ?? raw.expiry ?? raw.endTime ?? raw.expiresAt ?? raw.end),
    progress:
      typeof raw.progress === 'number'
        ? raw.progress
        : typeof raw.current === 'number' && typeof raw.goal === 'number'
        ? raw.current / Math.max(1, raw.goal)
        : undefined,
    goal:
      typeof raw.goal === 'number'
        ? raw.goal
        : typeof raw.target === 'number'
        ? raw.target
        : undefined,
    reward: asString(raw.reward ?? raw.rewards?.[0]?.name),
    source: 'Helldivers Training Manual',
  };
}

async function fetchUpstream() {
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
      return { ok: false, status: r.status, statusText: r.statusText, data: null as any };
    }

    const json = await r.json();
    return { ok: r.ok, status: r.status, statusText: r.statusText, data: json };
  } catch (e: any) {
    return { ok: false, status: 599, statusText: e?.name || 'FetchError', data: null as any };
  } finally {
    clearTimeout(timer);
  }
}

export async function GET() {
  const { ok, data, status, statusText } = await fetchUpstream();

  const rawList: RawOrder[] = Array.isArray(data)
    ? data
    : Array.isArray(data?.orders)
    ? data.orders
    : [];

  const orders: MajorOrder[] =
    ok && rawList.length
      ? rawList.map(normalize)
      : [
          {
            id: 'sample-1',
            title: 'Secure 10 planets for Super Earth',
            description: 'Liberate any planets to contribute.',
            expires: new Date(Date.now() + 86_400_000).toISOString(),
            source: 'Helldivers Training Manual',
            progress: 0,
            goal: 10,
          },
        ];

  const body: ApiShape =
    ok && rawList.length ? { orders } : { orders, _fallback: true as any, _error: `Upstream ${status} ${statusText}` } as any;

  const headers = {
    'Cache-Control': `s-maxage=${MAX_AGE}, stale-while-revalidate=${MAX_AGE}`,
    'Content-Type': 'application/json; charset=utf-8',
  };

  return NextResponse.json(body, { status: 200, headers });
}

export async function HEAD() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Cache-Control': `s-maxage=${MAX_AGE}, stale-while-revalidate=${MAX_AGE}`,
    },
  });
}
