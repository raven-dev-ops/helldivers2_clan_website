// src/app/(main)/helldivers-2/leaderboard/page.tsx
import React from 'react';
import nextDynamic from 'next/dynamic';
import Link from 'next/link';

const Leaderboard = nextDynamic(() => import('@/app/(main)/helldivers-2/LeaderboardServer'));

export const dynamic = 'force-dynamic';

export default function HelldiversLeaderboardPage() {
  return (
    <div className="content-section">
      <h1 className="content-section-title with-border-bottom">Community Leaderboards</h1>
      <p className="text-paragraph" style={{ marginBottom: 16 }}>
        Search by name at the top of each leaderboard and sort by any column.
      </p>
      <Leaderboard />
      <div style={{ marginTop: 24 }}>
        <Link href="/helldivers-2" className="link">← Back to Helldivers 2</Link>
      </div>
    </div>
  );
}