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
  const protocol = host.includes('localhost') || host.includes('127.0.0.1') ? 'http' : 'https';

  const augustParams = new URLSearchParams({ sortBy, sortDir, limit: String(limit), scope: 'month', month: '8', year: String(new Date().getUTCFullYear()) }).toString();
  const augustUrl = `${protocol}://${host}/api/helldivers/leaderboard?${augustParams}`;

  const lifetimeParams = new URLSearchParams({ sortBy, sortDir, limit: String(limit), scope: 'lifetime' }).toString();
  const lifetimeUrl = `${protocol}://${host}/api/helldivers/leaderboard?${lifetimeParams}`;

  const [augustRes, lifetimeRes] = await Promise.all([
    fetch(augustUrl, { cache: 'no-store' }),
    fetch(lifetimeUrl, { cache: 'no-store' }),
  ]);

  const augustData = augustRes.ok ? await augustRes.json() : undefined;
  const lifetimeData = lifetimeRes.ok ? await lifetimeRes.json() : undefined;

  return (
    <HelldiversLeaderboard initialMonthData={augustData} initialLifetimeData={lifetimeData} />
  );
}