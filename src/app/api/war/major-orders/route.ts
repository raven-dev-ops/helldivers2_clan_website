// src/app/api/war/major-orders/route.ts
import { NextResponse } from 'next/server';
import { HellHubApi } from '@/lib/hellhub';
import { ArrowheadApi } from '@/lib/arrowhead';

export const runtime = 'edge';          // optional: faster cold starts
export const revalidate = 0;            // disable route cache; rely on headers
export const dynamic = 'force-dynamic';
export const fetchCache = 'default-no-store';

const MAX_AGE = 60;                     // 60s CDN cache for freshness

type RawOrder = Record<string, any>;
type MajorOrder = {
  id: string;
  title: string;
  description?: string;
  expires?: string;     // ISO
  progress?: number;    // 0..1 or absolute (depends on upstream)
  goal?: number;
  reward?: string;
  source?: string;
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
    source: asString((raw as any).source) ?? 'HellHub / Arrowhead',
  };
}

async function fetchUpstream() {
  // Prefer Arrowhead assignments by war for freshness
  const ah = await ArrowheadApi.getAssignments(null);
  if (ah.ok && ah.data) {
    return { ok: true, status: 200, statusText: 'OK', data: ah.data } as const;
  }
  // Fallback to HellHub assignments/major orders if available
  const hh = await HellHubApi.getAssignments();
  if (hh.ok && hh.data) {
    return { ok: true, status: 200, statusText: 'OK', data: hh.data } as const;
  }
  return { ok: false, status: hh.status, statusText: hh.statusText, data: null as any } as const;
}

export async function GET() {
  const { ok, data, status, statusText } = await fetchUpstream();

  const rawList: RawOrder[] = Array.isArray(data)
    ? data
    : Array.isArray((data as any)?.orders)
    ? (data as any).orders
    : Array.isArray((data as any)?.assignments)
    ? (data as any).assignments
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
            source: 'Sample',
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
