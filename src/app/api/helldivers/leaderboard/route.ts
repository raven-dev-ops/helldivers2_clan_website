// src/app/api/helldivers/leaderboard/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { fetchHelldiversLeaderboard, VALID_SORT_FIELDS, type SortField } from '@/lib/helldiversLeaderboard';


export async function GET(req: NextRequest) {
  try {
    const url = new URL(req.url);
    const sortByParam = (url.searchParams.get('sortBy') || 'Kills') as SortField;
    const sortDirParam = (url.searchParams.get('sortDir') || 'desc').toLowerCase();
    const limitParam = parseInt(url.searchParams.get('limit') || '100', 10);

    const sortBy: SortField = VALID_SORT_FIELDS.includes(sortByParam) ? sortByParam : 'Kills';
    const sortDir: 1 | -1 = sortDirParam === 'asc' ? 1 : -1;
    const limit = Number.isFinite(limitParam) && limitParam > 0 ? Math.min(limitParam, 500) : 100;

    const data = await fetchHelldiversLeaderboard({ sortBy, sortDir: sortDir === 1 ? 'asc' : 'desc', limit });
    return NextResponse.json(data);
  } catch (error: any) {
    console.error('Error fetching helldivers leaderboard:', error);
    return NextResponse.json({ error: 'Failed to fetch leaderboard' }, { status: 500 });
  }
}