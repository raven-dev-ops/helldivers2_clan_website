// src/app/(main)/settings/page.tsx
"use client";

import type { CSSProperties } from 'react';
import styles from '../helldivers-2/HelldiversPage.module.css';
import ProfileEditForm from '@/app/components/forum/ProfileEditForm';
import StatsSubmitForm from '@/app/components/forum/StatsSubmitForm';

const videoStyle: CSSProperties = {
  position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', objectFit: 'cover', zIndex: -2, filter: 'brightness(0.6)'
};
const overlayStyle: CSSProperties = {
  position: 'fixed', inset: 0, backgroundColor: 'rgba(16, 20, 31, 0.35)', zIndex: -1
};

export default function SettingsPage() {
  return (
    <div className={styles.pageContainer}>
      {/* Background Video and Overlay */}
      <video autoPlay loop muted playsInline style={videoStyle} key="bg-video-settings">
        <source src="/videos/gpd_background.mp4" type="video/mp4" />
      </video>
      <div style={overlayStyle} />

      <h1 className="academy-page-title left-with-backdrop">Settings</h1>

      <section className="content-section">
        <h2 className="content-section-title with-border-bottom">Edit Profile</h2>
        <ProfileEditForm />
      </section>

      <section className="content-section">
        <h2 className="content-section-title with-border-bottom">Submit Stats</h2>
        <StatsSubmitForm />
      </section>
    </div>
  );
}