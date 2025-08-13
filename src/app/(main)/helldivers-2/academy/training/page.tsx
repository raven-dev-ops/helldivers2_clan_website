// src/app/(main)/helldivers-2/academy/training/page.tsx
"use client";

import styles from '../../HelldiversPage.module.css';

export default function TrainingPage() {
  return (
    <div className={styles.pageContainer}>
      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Training</h2>
        <p className={styles.paragraph}>Sample training content.</p>
      </section>
    </div>
  );
}
