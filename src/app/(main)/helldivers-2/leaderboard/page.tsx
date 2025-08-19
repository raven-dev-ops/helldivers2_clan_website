// src/app/(main)/helldivers-2/leaderboard/page.tsx
import LeaderboardServer from '@/app/(main)/helldivers-2/LeaderboardServer';
import styles from '../HelldiversBase.module.css';

export default function LeaderboardPage() {
  return (
    <div className={styles.pageContainer}>
      <LeaderboardServer />
    </div>
  );
}
