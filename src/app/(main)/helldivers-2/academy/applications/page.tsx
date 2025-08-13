// src/app/(main)/helldivers-2/academy/applications/page.tsx
"use client";

import styles from '../../HelldiversPage.module.css';

export default function ApplicationsPage() {
  return (
    <div className={styles.pageContainer}>
      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Applications</h2>
        <p className={styles.paragraph}>Sample application instructions.</p>
      </section>
    </div>
  );
}
