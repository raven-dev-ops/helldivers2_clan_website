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
  const params = new URLSearchParams({ sortBy, sortDir, limit: String(limit) }).toString();
  const url = `${protocol}://${host}/api/helldivers/leaderboard?${params}`;

  const res = await fetch(url, { cache: 'no-store' });
  if (!res.ok) {
    return <HelldiversLeaderboard initialData={undefined} />;
  }
  const initial = await res.json();
  return (
    <HelldiversLeaderboard initialData={initial} />
  );
}