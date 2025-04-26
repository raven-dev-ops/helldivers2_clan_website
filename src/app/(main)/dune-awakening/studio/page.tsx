// src/app/(main)/dune-awakening/studio/page.tsx
import React from 'react';
import styles from '../PlaceholderPage.module.css'; // Go up one directory

export default async function DuneStudioPage() {
  return (
    <main className={styles.pageContainer}>
      <h1 className={styles.pageTitle}>Dune: Awakening Studio</h1>
      <p className={styles.introText}>
        Manage integrations, bots, and community tools specifically for Dune: Awakening within the GPT alliance.
      </p>
      <p className={styles.placeholderText}>
        Studio features for Dune: Awakening are currently under development. Check back soon!
      </p>
    </main>
  );
}