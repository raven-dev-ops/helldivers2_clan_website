// src/app/leaderboard/page.tsx
import LeaderboardServer from '@/components/leaderboard/LeaderboardServer';
import styles from '@/styles/LeaderboardPage.module.css';

export default function LeaderboardPage() {
  return (
    <div className={styles.wrapper}>
      <div className={styles.dividerLayer} />
      <main className={styles.mainContainer}>
        <h1 className={styles.pageTitle}>Leaderboard</h1>
        <p className={styles.pageSubtitle}>Updated every 60s</p>
        <LeaderboardServer />
      </main>
    </div>
  );
}
