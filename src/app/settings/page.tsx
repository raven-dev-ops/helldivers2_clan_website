// src/app/settings/page.tsx
'use client';

import { useState } from 'react';
import baseStyles from '@/styles/Base.module.css';
import styles from '@/styles/Settings.module.css';
import ProfileEditForm from '@/components/profile/ProfileEditForm';

type TabKey = 'profile' | 'account';

export default function SettingsPage() {
  const [tab, setTab] = useState<TabKey>('profile');

  return (
    <div className={baseStyles.wrapper}>
      <div className={baseStyles.dividerLayer} />

      <div className={`${baseStyles.pageContainer} ${styles.pageWrapper}`}>
        <header className={styles.pageHeader}>
          <h2 className={styles.pageTitle}>Settings</h2>
          <p className={styles.pageSubtitle}>Manage your profile and account preferences.</p>
        </header>

        <nav className={styles.tabs} aria-label="Settings tabs">
          <button
            type="button"
            className={`${styles.tab} ${tab === 'profile' ? styles.tabActive : ''}`}
            onClick={() => setTab('profile')}
            aria-selected={tab === 'profile'}
          >
            Profile
          </button>
          <button
            type="button"
            className={`${styles.tab} ${tab === 'account' ? styles.tabActive : ''}`}
            onClick={() => setTab('account')}
            aria-selected={tab === 'account'}
          >
            Account
          </button>
        </nav>

        <section className={styles.panel}>
          {tab === 'profile' ? (
            <ProfileEditForm />
          ) : (
            <div className={styles.accountPanel}>
              <h3 className={baseStyles.sectionTitle}>Account</h3>
              <p className={baseStyles.paragraph}>
                Account settings coming soon. (Email, connected providers, security, etc.)
              </p>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
