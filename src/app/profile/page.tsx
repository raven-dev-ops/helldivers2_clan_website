// src/app/profile/page.tsx

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
export const revalidate = 0;

export const metadata = { title: 'Character Sheet' };

import ProfileClient from '@/components/profile/ProfileClient';
import base from '@/styles/Base.module.css';
import styles from '@/styles/ProfilePage.module.css';

export default function ProfilePage() {
  return (
    <div className={base.wrapper}>
      <div className={base.dividerLayer} />

      <main className={base.pageContainer} role="main" aria-label="Character sheet">
        {/* Card container to match the rest of the site */}
        <section className={styles.content} aria-labelledby="character-title">
          <h1 id="character-title" className={styles.contentTitle}>
            Character Sheet
          </h1>

          {/* The client-side sheet/editor/view */}
          <ProfileClient />
        </section>
      </main>
    </div>
  );
}
