// src/app/(main)/helldivers-2/leaderboard/page.tsx
<<<<<<< HEAD:src/app/leaderboard/page.tsx
import LeaderboardServer from '@/components/LeaderboardServer';
import styles from '@/styles/Base.module.css';
=======
import LeaderboardServer from '@/components/leaderboard/LeaderboardServer';
import styles from '../styles/HelldiversBase.module.css';
>>>>>>> main:src/app/(main)/helldivers-2/leaderboard/page.tsx

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
