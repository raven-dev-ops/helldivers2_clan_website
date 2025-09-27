// src/lib/httpCache.ts

/* ---------------------------------------------------------
 * Minimal HTTP cache with TTL, stale-while-revalidate (SWR),
 * request de-duping, and conditional requests (ETag/Last-Modified).
 * -------------------------------------------------------- */

export type Key = string | Record<string, unknown>;

export type SerializeKey = (key: Key) => string;

export type CacheEntry<T> = {
  value: T;
  // absolute times in ms since epoch
  createdAt: number;
  expiresAt: number; // hard TTL
  staleAt?: number;  // soft TTL for SWR (serve stale, revalidate in background)
  etag?: string | null;
  lastModified?: string | null;
};

export type GetOptions = {
  now?: number;
};

export type SetOptions = {
  ttlMs: number;            // hard expiration
  swrMs?: number;           // soft expiration window (serve stale while revalidating)
  etag?: string | null;
  lastModified?: string | null;
  now?: number;
};

export type GetOrSetOptions<T> = Omit<SetOptions, "etag" | "lastModified"> & {
  // Optional function to produce a value (e.g., fetch) when cache miss or refresh is needed.
  fetcher: () => Promise<{ value: T; etag?: string | null; lastModified?: string | null }>;
  // If true, allow returning stale value immediately and revalidate in background.
  allowStale?: boolean;
  // Optional signal to cancel fetcher calls.
  signal?: AbortSignal;
};

export interface HttpCache<T = unknown> {
  get(key: Key, opts?: GetOptions): CacheEntry<T> | null;
  set(key: Key, value: T, opts: SetOptions): CacheEntry<T>;
  del(key: Key): void;
  clear(): void;
  getOrSet(key: Key, opts: GetOrSetOptions<T>): Promise<T>;
}

const defaultSerializeKey: SerializeKey = (key) =>
  typeof key === "string" ? key : stableStringify(key);

// Deterministic JSON stringify (order object keys)
function stableStringify(obj: unknown): string {
  if (obj === null || typeof obj !== "object") return JSON.stringify(obj);
  if (Array.isArray(obj)) return `[${obj.map(stableStringify).join(",")}]`;
  const entries = Object.entries(obj as Record<string, unknown>)
    .sort(([a], [b]) => (a < b ? -1 : a > b ? 1 : 0))
    .map(([k, v]) => `"${k}":${stableStringify(v)}`);
  return `{${entries.join(",")}}`;
}

type InflightMap<T> = Map<string, Promise<T>>;

export function createHttpCache<T = unknown>(serializeKey: SerializeKey = defaultSerializeKey): HttpCache<T> {
  const store = new Map<string, CacheEntry<T>>();
  const inflight: InflightMap<T> = new Map();

  const getNow = () => Date.now();

  function get(key: Key, opts?: GetOptions): CacheEntry<T> | null {
    const k = serializeKey(key);
    const entry = store.get(k);
    if (!entry) return null;

    const now = opts?.now ?? getNow();
    if (entry.expiresAt <= now) {
      // Hard expired
      store.delete(k);
      return null;
    }
    // Fresh or within SWR window
    return entry;
  }

  function set(key: Key, value: T, opts: SetOptions): CacheEntry<T> {
    const k = serializeKey(key);
    const now = opts.now ?? getNow();
    const entry: CacheEntry<T> = {
      value,
      createdAt: now,
      expiresAt: now + opts.ttlMs,
      staleAt: opts.swrMs ? now + opts.swrMs : undefined,
      etag: opts.etag ?? null,
      lastModified: opts.lastModified ?? null,
    };
    store.set(k, entry);
    return entry;
  }

  function del(key: Key) {
    store.delete(serializeKey(key));
  }

  function clear() {
    store.clear();
  }

  async function getOrSet(key: Key, opts: GetOrSetOptions<T>): Promise<T> {
    const k = serializeKey(key);
    const now = opts.now ?? getNow();
    const existing = store.get(k);

    // Fresh?
    if (existing && existing.expiresAt > now && (!existing.staleAt || existing.staleAt > now)) {
      return existing.value;
    }

    // Stale but SWR allowed?
    if (existing && existing.expiresAt > now && existing.staleAt && existing.staleAt <= now && opts.allowStale) {
      // If a fetch is not already inflight, start one in background
      if (!inflight.has(k)) {
        const p = opts
          .fetcher()
          .then(({ value, etag, lastModified }) => {
            set(k, value, {
              ttlMs: opts.ttlMs,
              swrMs: opts.swrMs,
              etag,
              lastModified,
              now,
            });
            return value;
          })
          .finally(() => {
            inflight.delete(k);
          });
        inflight.set(k, p);
      }
      // Return stale immediately
      return existing.value;
    }

    // Cache miss or refresh needed; de-dupe concurrent calls
    if (inflight.has(k)) {
      return inflight.get(k)!;
    }

    const promise = (async () => {
      const { value, etag, lastModified } = await opts.fetcher();
      set(k, value, {
        ttlMs: opts.ttlMs,
        swrMs: opts.swrMs,
        etag,
        lastModified,
        now,
      });
      return value;
    })()
      .finally(() => inflight.delete(k));

    inflight.set(k, promise);
    return promise;
  }

  return { get, set, del, clear, getOrSet };
}

/* ---------------------------------------------------------
 * Optional: helper that wraps fetch() with caching + 304 reuse
 * -------------------------------------------------------- */

export type FetchWithCacheOptions = {
  cache: HttpCache<ResponseLike>;
  // Cache key (defaults to URL + method + sorted headers relevant to cache)
  key?: Key;
  // TTLs
  ttlMs: number;
  swrMs?: number;
  // Only cache safe idempotent requests by default
  cacheableMethods?: Array<"GET" | "HEAD">;
  // Request info
  requestInit?: RequestInit;
  // Optional: override fetch implementation (for testing)
  fetchImpl?: typeof fetch;
};

export type ResponseLike = {
  status: number;
  headers: Record<string, string>;
  body: string; // note: you can adapt to ArrayBuffer/JSON as needed
};

function headersToRecord(h: Headers): Record<string, string> {
  const out: Record<string, string> = {};
  h.forEach((v, k) => {
    out[k.toLowerCase()] = v;
  });
  return out;
}

/**
 * Fetch with cache, honoring ETag / Last-Modified if available in cached entry.
 * Stores response body as string. Adjust if you want ArrayBuffer/JSON, etc.
 */
export async function fetchWithHttpCache(
  url: string,
  {
    cache,
    key,
    ttlMs,
    swrMs,
    cacheableMethods = ["GET", "HEAD"],
    requestInit,
    fetchImpl = fetch,
  }: FetchWithCacheOptions
): Promise<ResponseLike> {
  const method = (requestInit?.method ?? "GET").toUpperCase();
  const isCacheable = cacheableMethods.includes(method as "GET" | "HEAD");
  const cacheKey =
    key ??
    {
      url,
      method,
      // If you have auth headers etc., include only cache-relevant ones
      // to avoid cache fragmentation
      vary: ["accept", "accept-encoding"],
    };

  if (!isCacheable) {
    // Bypass cache for non-cacheable methods
    const res = await fetchImpl(url, requestInit);
    const body = await res.text();
    return { status: res.status, headers: headersToRecord(res.headers), body };
  }

  // Try cache
  const entry = cache.get(cacheKey);
  const etag = entry?.etag ?? null;
  const lastMod = entry?.lastModified ?? null;

  // Build conditional headers if we have validators
  const headers = new Headers(requestInit?.headers ?? {});
  if (etag && !headers.has("If-None-Match")) headers.set("If-None-Match", etag);
  if (lastMod && !headers.has("If-Modified-Since")) headers.set("If-Modified-Since", lastMod);

  const getFresh = async (): Promise<ResponseLike> => {
    const res = await fetchImpl(url, { ...requestInit, method, headers });
    if (res.status === 304 && entry) {
      // Not modified—reuse cached value but refresh TTLs
      cache.set(cacheKey, entry.value, {
        ttlMs,
        swrMs,
        etag: entry.etag ?? null,
        lastModified: entry.lastModified ?? null,
      });
      return entry.value;
    }
    const body = await res.text();
    const record = {
      status: res.status,
      headers: headersToRecord(res.headers),
      body,
    } satisfies ResponseLike;

    cache.set(cacheKey, record, {
      ttlMs,
      swrMs,
      etag: res.headers.get("etag"),
      lastModified: res.headers.get("last-modified"),
    });
    return record;
  };

  // SWR path: serve stale if allowed by cache.getOrSet; else fetch fresh
  return cache.getOrSet(cacheKey, {
    ttlMs,
    swrMs,
    allowStale: true,
    fetcher: async () => {
      const fresh = await getFresh();
      // Provide validators back to cache
      return {
        value: fresh,
        etag: fresh.headers["etag"] ?? null,
        lastModified: fresh.headers["last-modified"] ?? null,
      };
    },
  });
}

/* ---------------------------------------------------------
 * Cache-Control header helpers (for API responses / Next.js)
 * -------------------------------------------------------- */

export type CacheControlOptions = {
  maxAge?: number;            // seconds
  sMaxAge?: number;           // seconds (CDN/proxy)
  staleWhileRevalidate?: number; // seconds
  staleIfError?: number;      // seconds
  isPublic?: boolean;         // public vs private
  noStore?: boolean;          // if true, disables caching
};

export function buildCacheControl({
  maxAge,
  sMaxAge,
  staleWhileRevalidate,
  staleIfError,
  isPublic = true,
  noStore = false,
}: CacheControlOptions = {}): string {
  if (noStore) return "no-store";

  const parts: string[] = [isPublic ? "public" : "private"];
  if (typeof maxAge === "number") parts.push(`max-age=${Math.max(0, maxAge)}`);
  if (typeof sMaxAge === "number") parts.push(`s-maxage=${Math.max(0, sMaxAge)}`);
  if (typeof staleWhileRevalidate === "number") parts.push(`stale-while-revalidate=${Math.max(0, staleWhileRevalidate)}`);
  if (typeof staleIfError === "number") parts.push(`stale-if-error=${Math.max(0, staleIfError)}`);
  return parts.join(", ");
}

/* ---------------------------------------------------------
 * Quick usage examples
 * --------------------------------------------------------

 // 1) Create a cache (module-level singleton)
 const httpCache = createHttpCache<ResponseLike>();

 // 2) Use in an API route (Next.js)
 import { NextResponse } from 'next/server';

 export async function GET() {
   const data = await fetchWithHttpCache('https://api.example.com/data', {
     cache: httpCache,
     ttlMs: 60_000,  // 1 min fresh
     swrMs: 300_000, // 5 min serve-stale-while-revalidate
   });

   return new NextResponse(data.body, {
     status: data.status,
     headers: {
       'Content-Type': data.headers['content-type'] ?? 'application/json',
       'Cache-Control': buildCacheControl({ sMaxAge: 60, staleWhileRevalidate: 300 }),
     },
   });
 }

 // 3) Manual getOrSet:
 const value = await httpCache.getOrSet({ url: '/expensive', params: { q: 1 } }, {
   ttlMs: 5_000, swrMs: 30_000,
   fetcher: async () => {
     const data = await someExpensiveCall();
     return { value: data, etag: null, lastModified: null };
   },
   allowStale: true,
 });
*/
