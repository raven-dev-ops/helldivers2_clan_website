// src/lib/hellhub.ts
// Client for the HellHub community API mirror/aggregator
import { fetchWithRevalidate, FetchWithRevalidateOptions } from '@/lib/helldivers/fetch';

const DEFAULT_BASE = 'https://api-hellhub-collective.koyeb.app';
const USER_AGENT = 'GPT-Fleet-CommunitySite/1.0';

type FetchJsonResult<T> = {
  ok: boolean;
  status: number;
  statusText: string;
  data?: T | null;
  rate?: {
    limit?: number;
    remaining?: number;
    reset?: number;
  };
};

function getBaseUrl(): string {
  return process.env.HELLHUB_API_BASE || DEFAULT_BASE;
}

function parseRateHeaders(res: Response) {
  const limit = Number(res.headers.get('x-ratelimit-limit') || res.headers.get('ratelimit-limit'));
  const remaining = Number(res.headers.get('x-ratelimit-remaining') || res.headers.get('ratelimit-remaining'));
  const reset = Number(res.headers.get('x-ratelimit-reset') || res.headers.get('ratelimit-reset'));
  return {
    limit: Number.isFinite(limit) ? limit : undefined,
    remaining: Number.isFinite(remaining) ? remaining : undefined,
    reset: Number.isFinite(reset) ? reset : undefined,
  };
}

async function fetchJson<T = any>(path: string, init?: FetchWithRevalidateOptions): Promise<FetchJsonResult<T>> {
  try {
    const res = await fetchWithRevalidate(`${getBaseUrl()}${path}`, {
      ...init,
      // Default to 30s revalidation unless caller overrides
      revalidateSeconds: init?.revalidateSeconds ?? 30,
      headers: {
        'User-Agent': USER_AGENT,
        ...(init?.headers || {}),
      },
    } as any);
    const rate = parseRateHeaders(res);
    const ct = res.headers.get('content-type') || '';
    if (!ct.includes('application/json')) {
      return { ok: false, status: res.status, statusText: res.statusText, data: null, rate };
    }
    let data: any = null;
    try {
      data = await res.json();
    } catch {}
    return { ok: res.ok && !!data, status: res.status, statusText: res.statusText, data, rate };
  } catch (e: any) {
    return { ok: false, status: 599, statusText: e?.name || 'FetchError', data: null };
  }
}

// High-level helpers reflecting common HellHub endpoints
export function getWar() {
  return fetchJson('/api/war');
}

export function getPlanets(query: string = '') {
  const qs = query ? (query.startsWith('?') ? query : `?${query}`) : '';
  return fetchJson(`/api/planets${qs}`);
}

export function getPlanetStatistics(id: string | number, query: string = '') {
  const qs = query ? (query.startsWith('?') ? query : `?${query}`) : '';
  return fetchJson(`/api/planets/${id}/statistics${qs}`);
}

export function getAssignments(query: string = '') {
  const qs = query ? (query.startsWith('?') ? query : `?${query}`) : '';
  return fetchJson(`/api/assignments${qs}`);
}

export function getEffects(query: string = '') {
  const qs = query ? (query.startsWith('?') ? query : `?${query}`) : '';
  return fetchJson(`/api/effects${qs}`);
}

export async function getNews(query: string = '', init?: FetchWithRevalidateOptions): Promise<FetchJsonResult<any>> {
  const qs = query ? (query.startsWith('?') ? query : `?${query}`) : '';
  // Some mirrors provide news under different paths; try a few in order.
  const candidates = [
    `/api/news${qs}`,
    `/api/war/news${qs}`,
    `/news${qs}`,
  ];

  let last: FetchJsonResult<any> | null = null;
  for (const path of candidates) {
    const res = await fetchJson(path, init);
    last = res;
    const data: any = res.data;
    const arr = Array.isArray(data)
      ? data
      : Array.isArray(data?.news)
      ? data.news
      : Array.isArray(data?.data)
      ? data.data
      : [];
    if (res.ok && arr.length) return res;
  }
  return last || { ok: false, status: 404, statusText: 'NotFound', data: null };
}

export const HellHubApi = {
  getBaseUrl,
  getWar,
  getPlanets,
  getPlanetStatistics,
  getAssignments,
  getEffects,
  getNews,
};

export default HellHubApi;

