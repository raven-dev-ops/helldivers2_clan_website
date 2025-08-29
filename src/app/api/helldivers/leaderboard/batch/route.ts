// src/app/api/helldivers/leaderboard/batch/route.ts
import { NextRequest, NextResponse } from 'next/server';
import {
  fetchHelldiversLeaderboard,
  VALID_SORT_FIELDS,
  type SortField,
  type LeaderboardScope,
} from '@/lib/helldiversLeaderboard';
import { logger } from '@/lib/logger';

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

    const results = await Promise.all(
      scopes.map((scope) =>
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
    const out: Record<string, any> = {};
    scopes.forEach((s, i) => {
      out[s] = results[i];
    });
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
