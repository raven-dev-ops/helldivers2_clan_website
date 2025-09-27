// src/app/(main)/helldivers-2/leaderboard/page.tsx
import LeaderboardServer from '@/app/components/LeaderboardServer';
import styles from '../HelldiversBase.module.css';

export default function LeaderboardPage() {
  return (
    <div className={styles.wrapper}>
      <div className={styles.dividerLayer} />
      <div className={styles.pageContainer}>
        <LeaderboardServer />
      </div>
    </div>
  );
}
