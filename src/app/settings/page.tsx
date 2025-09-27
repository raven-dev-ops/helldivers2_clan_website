// src/app/settings/page.tsx
'use client';

import { useState } from 'react';
import baseStyles from '@/styles/Base.module.css';
import styles from '@/styles/SettingsPage.module.css';
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

        <nav className={styles.tabs} role="tablist" aria-label="Settings tabs">
          <button
            type="button"
            role="tab"
            aria-selected={tab === 'profile'}
            aria-controls="panel-profile"
            id="tab-profile"
            tabIndex={tab === 'profile' ? 0 : -1}
            className={`${styles.tab} ${tab === 'profile' ? styles.tabActive : ''}`}
            onClick={() => setTab('profile')}
          >
            Profile
          </button>

          <button
            type="button"
            role="tab"
            aria-selected={tab === 'account'}
            aria-controls="panel-account"
            id="tab-account"
            tabIndex={tab === 'account' ? 0 : -1}
            className={`${styles.tab} ${tab === 'account' ? styles.tabActive : ''}`}
            onClick={() => setTab('account')}
          >
            Account
          </button>
        </nav>

        <section
          id="panel-profile"
          role="tabpanel"
          aria-labelledby="tab-profile"
          hidden={tab !== 'profile'}
          className={styles.panel}
        >
          <ProfileEditForm />
        </section>

        <section
          id="panel-account"
          role="tabpanel"
          aria-labelledby="tab-account"
          hidden={tab !== 'account'}
          className={`${styles.panel} ${styles.accountPanel}`}
        >
          <h3 className={baseStyles.sectionTitle}>Account</h3>
          <p className={baseStyles.paragraph}>
            Account settings coming soon. (Email, connected providers, security, etc.)
          </p>
        </section>
      </div>
    </div>
  );
}
