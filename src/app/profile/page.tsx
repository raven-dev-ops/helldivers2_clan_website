// src/app/profile/page.tsx

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
export const revalidate = 0;

export const metadata = { title: 'Profile' };

import ProfileClient from '@/components/profile/ProfileClient';
import styles from '@/styles/ProfilePage.module.css';

export default function ProfilePage() {
  return (
    <div className={styles.gridContainer}>
      {/* Optional sidebar slot (buttons, nav, etc.) */}
      <aside className={styles.sidebar}>
        {/* Example buttons — remove or replace */}
        <button className={styles.sidebarButton} aria-pressed="true">Overview</button>
        <button className={styles.sidebarButton}>Stats</button>
        <button className={styles.sidebarButton}>Settings</button>
      </aside>

      {/* Main content area uses your styled card surface */}
      <main className={styles.content}>
        <h2 className={styles.contentTitle}>My Profile</h2>
        <ProfileClient />
      </main>
    </div>
  );
}
