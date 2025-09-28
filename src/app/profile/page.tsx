// src/app/profile/page.tsx

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
export const revalidate = 0;

export const metadata = { title: 'Character Sheet' };

import ProfileClient from '@/components/profile/ProfileClient';
import styles from '@/styles/ProfilePage.module.css';

export default function ProfilePage() {
  return (
    <div className={styles.gridContainer}>
      <main className={styles.content} role="main" aria-label="Character sheet">
        <h1 className={styles.contentTitle}>Character Sheet</h1>
        <ProfileClient />
      </main>
    </div>
  );
}
