// src/app/api/helldivers/leaderboard/batch/route.ts
import { NextRequest, NextResponse } from 'next/server';
import {
  fetchHelldiversLeaderboard,
  VALID_SORT_FIELDS,
  type SortField,
  type LeaderboardScope,
} from '@/lib/helldiversLeaderboard';
import { logger } from '@/lib/logger';

// --- Simple in-memory LRU cache -------------------------------------------
interface CacheEntry {
  data: any;
  expiresAt: number;
}

const CACHE_TTL_MS = 60_000; // 1 minute
const MAX_CACHE_ENTRIES = 100;

function getCache(): Map<string, CacheEntry> {
  const globalForCache = globalThis as unknown as {
    __helldivers_batch_cache__?: Map<string, CacheEntry>;
  };
  if (!globalForCache.__helldivers_batch_cache__) {
    globalForCache.__helldivers_batch_cache__ = new Map();
  }
  return globalForCache.__helldivers_batch_cache__;
}

function getFromCache(key: string) {
  const cache = getCache();
  const entry = cache.get(key);
  if (entry && entry.expiresAt > Date.now()) {
    // refresh recency
    cache.delete(key);
    cache.set(key, entry);
    return entry.data;
  }
  if (entry) cache.delete(key);
  return null;
}

function setCache(key: string, data: any) {
  const cache = getCache();
  if (cache.size >= MAX_CACHE_ENTRIES) {
    const oldestKey = cache.keys().next().value as string | undefined;
    if (oldestKey) cache.delete(oldestKey);
  }
  cache.set(key, { data, expiresAt: Date.now() + CACHE_TTL_MS });
}

export async function GET(req: NextRequest) {
  try {
    const url = new URL(req.url);
    const scopesParam = url.searchParams.get('scopes') || '';
    const scopes = scopesParam
      .split(',')
      .map((s) => s.trim().toLowerCase())
      .filter(Boolean) as LeaderboardScope[];
    if (scopes.length === 0) {
      return NextResponse.json(
        { error: 'No scopes provided' },
        { status: 400 }
      );
    }

    const sortByParam = (url.searchParams.get('sortBy') || 'Kills') as SortField;
    const sortDirParam = (url.searchParams.get('sortDir') || 'desc').toLowerCase();
    const limitParam = parseInt(url.searchParams.get('limit') || '100', 10);
    const monthParam = url.searchParams.get('month');
    const yearParam = url.searchParams.get('year');

    const sortBy: SortField = VALID_SORT_FIELDS.includes(sortByParam)
      ? sortByParam
      : 'Kills';
    const sortDir: 'asc' | 'desc' = sortDirParam === 'asc' ? 'asc' : 'desc';
    const limit =
      Number.isFinite(limitParam) && limitParam > 0
        ? Math.min(limitParam, 1000)
        : 100;
    const month = monthParam ? parseInt(monthParam, 10) : undefined;
    const year = yearParam ? parseInt(yearParam, 10) : undefined;

    const out: Record<string, any> = {};
    const fetches: { scope: LeaderboardScope; key: string }[] = [];

    scopes.forEach((scope) => {
      const key = JSON.stringify({
        sortBy,
        sortDir,
        limit,
        scope,
        month,
        year,
      });
      const cached = getFromCache(key);
      if (cached) {
        out[scope] = cached;
      } else {
        fetches.push({ scope, key });
      }
    });

    if (fetches.length > 0) {
      const results = await Promise.all(
        fetches.map(({ scope }) =>
          fetchHelldiversLeaderboard({
            sortBy,
            sortDir,
            limit,
            scope,
            month,
            year,
          })
        )
      );
      results.forEach((res, i) => {
        const { scope, key } = fetches[i];
        out[scope] = res;
        setCache(key, res);
      });
    }

    return NextResponse.json(out, {
      headers: {
        'Cache-Control':
          'public, max-age=30, s-maxage=60, stale-while-revalidate=300',
      },
    });
  } catch (error: any) {
    logger.error('Error fetching helldivers leaderboard batch:', error);
    return NextResponse.json(
      { error: 'Failed to fetch leaderboard batch' },
      { status: 500 }
    );
  }
}
