'use client';
import React from 'react';
import styles from '@/styles/MaintenanceBanner.module.css';

export default function MaintenanceBanner() {
  if (process.env.NEXT_PUBLIC_MAINTENANCE_MODE !== 'true') return null;
  return (
    <div className={styles.banner} role="status">
      The site is under maintenance. Some features may be unavailable.
    </div>
  );
}
