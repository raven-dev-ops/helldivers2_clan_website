// src/app/(main)/dune-awakening/merch/page.tsx
import React from 'react';
import styles from '../PlaceholderPage.module.css'; // Go up one directory

export default async function DuneMerchPage() {
  return (
    <main className={styles.pageContainer}>
      <h1 className={styles.pageTitle}>Dune: Awakening Merch</h1>
      <p className={styles.introText}>
        Acquire official GPT alliance gear themed for the harsh deserts of Arrakis. Spice must flow!
      </p>
      <p className={styles.placeholderText}>
        The Dune: Awakening merchandise collection is being curated. Watch this space!
      </p>
    </main>
  );
}