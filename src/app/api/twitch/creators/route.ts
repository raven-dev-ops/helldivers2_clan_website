import { NextRequest, NextResponse } from 'next/server';
import { fetchTwitchCreators } from '@/lib/twitch';
import { jsonWithETag } from '@/lib/httpCache';

type CacheEntry = { data: any; expiresAt: number };
const globalForCache = globalThis as unknown as { __twitch_creators_cache__?: CacheEntry };
const TTL_MS = 10 * 60_000; // 10 minutes

function getCached(): CacheEntry | null {
  try {
    const c = globalForCache.__twitch_creators_cache__;
    if (c && c.expiresAt > Date.now()) return c;
    return null;
  } catch { return null; }
}

function setCached(data: any) {
  try {
    globalForCache.__twitch_creators_cache__ = { data, expiresAt: Date.now() + TTL_MS };
  } catch {}
}

export async function GET(req: NextRequest) {
  const cached = getCached();
  if (cached) {
    return jsonWithETag(req, cached.data, {
      headers: { 'Cache-Control': 'public, max-age=300, stale-while-revalidate=600' },
    });
  }

  // Soft timeout wrapper
  const withTimeout = async <T,>(p: Promise<T>, ms = 5000): Promise<T | null> => {
    let timer: any;
    return await Promise.race([
      p.finally(() => clearTimeout(timer)),
      new Promise<T | null>((resolve) => {
        timer = setTimeout(() => resolve(null), ms);
      }),
    ]);
  };

  const creatorsData = await withTimeout(fetchTwitchCreators());
  if (creatorsData) setCached(creatorsData);

  // Serve last-good on failure
  const data = creatorsData ?? getCached()?.data ?? [];
  return jsonWithETag(req, data, {
    headers: { 'Cache-Control': 'public, max-age=300, stale-while-revalidate=600' },
  });
}
