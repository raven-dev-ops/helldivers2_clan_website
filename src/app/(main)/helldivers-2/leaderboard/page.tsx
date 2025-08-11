// src/app/(main)/helldivers-2/leaderboard/page.tsx
import dynamic from 'next/dynamic';

const HelldiversLeaderboard = dynamic(() => import('@/app/components/leaderboard/HelldiversLeaderboard'), { ssr: false });

export default function LeaderboardPage() {
  return <HelldiversLeaderboard />;
}