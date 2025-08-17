// src/app/(main)/helldivers-2/academy/page.tsx
'use client';

import styles from '../HelldiversPage.module.css';

export default function AcademyPage() {
  return (
    <div className={styles.pageContainer}>
      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Academy</h2>
        <p className={styles.paragraph}>
          Welcome to the GPT Academy. Select a training module from the
          navigation.
        </p>
      </section>
    </div>
  );
}
