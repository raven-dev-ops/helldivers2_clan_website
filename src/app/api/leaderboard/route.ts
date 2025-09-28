// src/app/api/leaderboard/route.ts
export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
export const revalidate = 0;
export const fetchCache = 'default-no-store';

import { NextRequest, NextResponse } from 'next/server';
import { jsonWithETag } from '@/lib/httpCache';
import {
  fetchHelldiversLeaderboard,
  VALID_SORT_FIELDS,
  type SortField,
  type LeaderboardScope,
} from '@/lib/helldiversLeaderboard';
import { logger } from '@/lib/logger';

// Acceptable scopes for this single-scope endpoint
const VALID_SCOPES = new Set<LeaderboardScope>([
  'day',
  'week',
  'month',
  'lifetime',
  'solo',
  'squad',
]);

function parseIntSafe(v: string | null): number | undefined {
  if (!v) return undefined;
  const n = Number.parseInt(v, 10);
  return Number.isFinite(n) ? n : undefined;
}

export async function GET(req: NextRequest) {
  try {
    const url = new URL(req.url);

    // sortBy (default Kills), sortDir (default desc), limit (default 100)
    const sortByRaw = (url.searchParams.get('sortBy') || 'Kills') as SortField;
    const sortBy: SortField = VALID_SORT_FIELDS.includes(sortByRaw) ? sortByRaw : 'Kills';

    const sortDirParam = (url.searchParams.get('sortDir') || 'desc').toLowerCase();
    const sortDir: 'asc' | 'desc' = sortDirParam === 'asc' ? 'asc' : 'desc';

    const limitReq = parseIntSafe(url.searchParams.get('limit')) ?? 100;
    const limit = Math.min(Math.max(limitReq, 1), 1000);

    // scope (default month)
    const scopeRaw = (url.searchParams.get('scope') || 'month').toLowerCase() as LeaderboardScope;
    const scope: LeaderboardScope = VALID_SCOPES.has(scopeRaw) ? scopeRaw : 'month';

    // optional month/year for "month" scope
    let month = parseIntSafe(url.searchParams.get('month'));
    let year = parseIntSafe(url.searchParams.get('year'));

    // sanitize month/year
    if (month !== undefined) month = Math.min(Math.max(month, 1), 12);
    if (year !== undefined) year = Math.min(Math.max(year, 1970), 9999);

    // Only pass month/year to the fetcher when the scope is month
    const data = await fetchHelldiversLeaderboard({
      sortBy,
      sortDir,
      limit,
      scope,
      month: scope === 'month' ? month : undefined,
      year: scope === 'month' ? year : undefined,
    });

    return jsonWithETag(req, data, {
      headers: {
        'Cache-Control': 'public, max-age=30, s-maxage=60, stale-while-revalidate=300',
      },
    });
  } catch (error: unknown) {
    logger.error('Error fetching helldivers leaderboard:', error);
    return NextResponse.json(
      { error: 'Failed to fetch leaderboard' },
      { status: 500 }
    );
  }
}
