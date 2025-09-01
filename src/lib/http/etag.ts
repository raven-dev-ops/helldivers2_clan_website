// src/lib/http/etag.ts
import { createHash } from 'crypto';

export function strongETagFrom(data: unknown): string {
  const json = typeof data === 'string' ? data : JSON.stringify(data);
  const hash = createHash('sha256').update(json).digest('base64');
  return `"sha256-${hash}"`;
}

export type CacheHeadersOptions = {
  maxAgeSeconds?: number;
  staleWhileRevalidateSeconds?: number;
};

export function cacheHeaders({
  maxAgeSeconds = 30,
  staleWhileRevalidateSeconds = 300,
}: CacheHeadersOptions = {}) {
  return {
    'Cache-Control': `public, max-age=${maxAgeSeconds}, stale-while-revalidate=${staleWhileRevalidateSeconds}`,
    Vary: 'Accept-Encoding',
  } as Record<string, string>;
}

