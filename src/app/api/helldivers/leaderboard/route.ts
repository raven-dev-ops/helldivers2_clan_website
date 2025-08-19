// src/app/api/helldivers/leaderboard/route.ts
import { NextRequest, NextResponse } from 'next/server';
import {
  fetchHelldiversLeaderboard,
  VALID_SORT_FIELDS,
  type SortField,
} from '@/lib/helldiversLeaderboard';
import { logger } from '@/lib/logger';

export async function GET(req: NextRequest) {
  try {
    const url = new URL(req.url);
    const sortByParam = (url.searchParams.get('sortBy') ||
      'Kills') as SortField;
    const sortDirParam = (
      url.searchParams.get('sortDir') || 'desc'
    ).toLowerCase();
    const limitParam = parseInt(url.searchParams.get('limit') || '100', 10);
    const scopeParam = (url.searchParams.get('scope') || 'month').toLowerCase();
    const monthParam = url.searchParams.get('month');
    const yearParam = url.searchParams.get('year');

    const sortBy: SortField = VALID_SORT_FIELDS.includes(sortByParam)
      ? sortByParam
      : 'Kills';
    const sortDir: 1 | -1 = sortDirParam === 'asc' ? 1 : -1;
    const limit =
      Number.isFinite(limitParam) && limitParam > 0
        ? Math.min(limitParam, 1000)
        : 100;

    const scope =
      scopeParam === 'lifetime'
        ? 'lifetime'
        : scopeParam === 'solo'
          ? 'solo'
          : scopeParam === 'week'
            ? 'week'
            : scopeParam === 'day'
              ? 'day'
              : 'month';
    const month = monthParam ? parseInt(monthParam, 10) : undefined;
    const year = yearParam ? parseInt(yearParam, 10) : undefined;

    const data = await fetchHelldiversLeaderboard({
      sortBy,
      sortDir: sortDir === 1 ? 'asc' : 'desc',
      limit,
      scope,
      month,
      year,
    });
    return NextResponse.json(data, {
      headers: {
        'Cache-Control': 's-maxage=60, stale-while-revalidate=300',
      },
    });
  } catch (error: any) {
    logger.error('Error fetching helldivers leaderboard:', error);
    return NextResponse.json(
      { error: 'Failed to fetch leaderboard' },
      { status: 500 }
    );
  }
}
