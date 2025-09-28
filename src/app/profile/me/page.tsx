// src/app/profile/me/page.tsx

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
export const revalidate = 0;

export const metadata = { title: 'My Profile' };

import ProfileClient from '@/components/profile/ProfileClient';
import styles from '@/styles/ProfilePage.module.css';

export default function ProfileMePage() {
  return (
    <div className={styles.gridContainer}>
      <aside className={styles.sidebar}>
        <button className={styles.sidebarButton} aria-pressed="true">Overview</button>
        <button className={styles.sidebarButton}>Stats</button>
        <button className={styles.sidebarButton}>Settings</button>
      </aside>

      <main className={styles.content}>
        <h2 className={styles.contentTitle}>My Profile</h2>
        <ProfileClient />
      </main>
    </div>
  );
}
