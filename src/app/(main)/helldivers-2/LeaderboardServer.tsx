// src/app/(main)/helldivers-2/LeaderboardServer.tsx
import 'server-only';
import React from 'react';
import { headers } from 'next/headers';
import HelldiversLeaderboard from '@/app/components/leaderboard/HelldiversLeaderboard';

export const dynamic = 'force-dynamic';

export default async function LeaderboardServer({
  sortBy = 'Kills',
  sortDir = 'desc',
  limit = 100,
}: {
  sortBy?: string;
  sortDir?: 'asc' | 'desc';
  limit?: number;
}) {
  const hdrs = await headers();
  const host = hdrs.get('host') || 'localhost:3000';
  const protocol =
    host.includes('localhost') || host.includes('127.0.0.1') ? 'http' : 'https';

  const now = new Date();
  const monthParams = new URLSearchParams({
    sortBy,
    sortDir,
    limit: String(limit),
    scope: 'month',
    month: String(now.getUTCMonth() + 1),
    year: String(now.getUTCFullYear()),
  }).toString();
  const monthUrl = `${protocol}://${host}/api/helldivers/leaderboard?${monthParams}`;

  const weekParams = new URLSearchParams({
    sortBy,
    sortDir,
    limit: String(limit),
    scope: 'week',
  }).toString();
  const weekUrl = `${protocol}://${host}/api/helldivers/leaderboard?${weekParams}`;

  const dayParams = new URLSearchParams({
    sortBy,
    sortDir,
    limit: String(limit),
    scope: 'day',
  }).toString();
  const dayUrl = `${protocol}://${host}/api/helldivers/leaderboard?${dayParams}`;

  const yearlyParams = new URLSearchParams({
    sortBy,
    sortDir,
    limit: String(limit),
    scope: 'lifetime',
    year: '2025',
  }).toString();
  const yearlyUrl = `${protocol}://${host}/api/helldivers/leaderboard?${yearlyParams}`;
  const [monthRes, weekRes, dayRes, yearlyRes] = await Promise.all([
    fetch(monthUrl, { cache: 'no-store' }),
    fetch(weekUrl, { cache: 'no-store' }),
    fetch(dayUrl, { cache: 'no-store' }),
    fetch(yearlyUrl, { cache: 'no-store' }),
  ]);

  const monthData = monthRes.ok ? await monthRes.json() : undefined;
  const weekData = weekRes.ok ? await weekRes.json() : undefined;
  const dayData = dayRes.ok ? await dayRes.json() : undefined;
  const yearlyData = yearlyRes.ok ? await yearlyRes.json() : undefined;

  return (
    <HelldiversLeaderboard
      initialMonthData={monthData}
      initialYearlyData={yearlyData}
      initialWeekData={weekData}
      initialDayData={dayData}
    />
  );
}
