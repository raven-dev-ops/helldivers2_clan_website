// src/lib/arrowhead.ts
// Lightweight client for Arrowhead's live game endpoints

const DEFAULT_BASE = 'https://api.live.prod.thehelldiversgame.com/api';
const USER_AGENT = 'GPT-Fleet-CommunitySite/1.0';

type FetchJsonResult<T> = {
  ok: boolean;
  status: number;
  statusText: string;
  data?: T | null;
};

function getBaseUrl(): string {
  return process.env.ARROWHEAD_API_BASE || DEFAULT_BASE;
}

async function fetchJson<T = any>(path: string, init?: RequestInit, timeoutMs = 8000): Promise<FetchJsonResult<T>> {
  const ac = new AbortController();
  const timer = setTimeout(() => ac.abort(), timeoutMs);
  try {
    const res = await fetch(`${getBaseUrl()}${path}`, {
      headers: {
        'User-Agent': USER_AGENT,
        Accept: 'application/json',
        ...(init?.headers || {}),
      },
      cache: 'no-store',
      ...init,
      signal: ac.signal,
    });

    const ct = res.headers.get('content-type') || '';
    if (!ct.includes('application/json')) {
      return { ok: false, status: res.status, statusText: res.statusText, data: null };
    }
    let data: any = null;
    try {
      data = await res.json();
    } catch {
      /* ignore parse errors */
    }
    return { ok: res.ok && !!data, status: res.status, statusText: res.statusText, data };
  } catch (e: any) {
    return { ok: false, status: 599, statusText: e?.name || 'FetchError', data: null };
  } finally {
    clearTimeout(timer);
  }
}

export async function getCurrentWarId(): Promise<number | null> {
  const r = await fetchJson('/WarSeason/current/WarID');
  if (!r.ok) return null;
  const value = r.data as any;
  if (typeof value === 'number') return value;
  if (value && typeof value.warId === 'number') return value.warId;
  if (value && typeof value.id === 'number') return value.id;
  return null;
}

async function ensureWarId(warId?: number | string | null): Promise<number | null> {
  if (typeof warId === 'number') return warId;
  if (typeof warId === 'string' && warId.trim()) {
    const n = Number(warId);
    return Number.isFinite(n) ? n : null;
  }
  return getCurrentWarId();
}

export async function getWarStatus(warId?: number | string | null): Promise<FetchJsonResult<any>> {
  const id = await ensureWarId(warId);
  if (id == null) return { ok: false, status: 400, statusText: 'NoWarId', data: null };
  return fetchJson(`/WarSeason/${id}/Status`);
}

export async function getWarInfo(warId?: number | string | null): Promise<FetchJsonResult<any>> {
  const id = await ensureWarId(warId);
  if (id == null) return { ok: false, status: 400, statusText: 'NoWarId', data: null };
  return fetchJson(`/WarSeason/${id}/Info`);
}

export async function getNewsFeed(warId?: number | string | null): Promise<FetchJsonResult<any[]>> {
  const id = await ensureWarId(warId);
  if (id == null) return { ok: false, status: 400, statusText: 'NoWarId', data: null };
  return fetchJson(`/NewsFeed/${id}`);
}

export async function getAssignments(warId?: number | string | null): Promise<FetchJsonResult<any>> {
  const id = await ensureWarId(warId);
  if (id == null) return { ok: false, status: 400, statusText: 'NoWarId', data: null };
  return fetchJson(`/v2/Assignment/War/${id}`);
}

export async function getWarSummary(warId?: number | string | null): Promise<FetchJsonResult<any>> {
  const id = await ensureWarId(warId);
  if (id == null) return { ok: false, status: 400, statusText: 'NoWarId', data: null };
  return fetchJson(`/Stats/War/${id}/Summary`);
}

export const ArrowheadApi = {
  getBaseUrl,
  getCurrentWarId,
  getWarStatus,
  getWarInfo,
  getNewsFeed,
  getAssignments,
  getWarSummary,
};

export default ArrowheadApi;

