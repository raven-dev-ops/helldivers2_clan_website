// src/app/(main)/helldivers-2/LeaderboardServer.tsx
import React from 'react';
import { headers } from 'next/headers';
import HelldiversLeaderboard from '@/app/components/leaderboard/HelldiversLeaderboard';

export const dynamic = 'force-dynamic';

async function fetchLeaderboard() {
  // Next 15: headers() returns a Promise<ReadonlyHeaders>
  const h = await headers();
  const proto = h.get('x-forwarded-proto') ?? 'https';
  const host =
    h.get('x-forwarded-host') ??
    h.get('host') ??
    process.env.NEXT_PUBLIC_SITE_HOST;
  const base = `${proto}://${host}`;
  const res = await fetch(
    `${base}/api/helldivers/leaderboard/batch?scopes=day,week,month,lifetime,solo,squad&sortBy=Kills&sortDir=desc&limit=100`,
    { cache: 'no-store' }
  );
  if (!res.ok) {
    throw new Error('Failed to fetch leaderboard');
  }
  return res.json();
}

export default async function LeaderboardServer() {
  const data = await fetchLeaderboard();
  return <HelldiversLeaderboard initialData={data} />;
}
