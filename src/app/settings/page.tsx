// src/app/settings/page.tsx
'use client';

import { useState, useRef, useCallback, KeyboardEvent } from 'react';
import baseStyles from '@/styles/Base.module.css';
import styles from '@/styles/SettingsPage.module.css';
import ProfileEditForm from '@/components/profile/ProfileEditForm';

type TabKey = 'profile' | 'account';
const TABS: TabKey[] = ['profile', 'account'];

export default function SettingsPage() {
  const [tab, setTab] = useState<TabKey>('profile');

  // Keep refs to the tab buttons for keyboard navigation
  const tabRefs = useRef<Record<TabKey, HTMLButtonElement | null>>({
    profile: null,
    account: null,
  });

  const setTabRef = useCallback(
    (key: TabKey) => (el: HTMLButtonElement | null) => {
      tabRefs.current[key] = el; // return void (fixes TS2322)
    },
    []
  );

  const focusTab = useCallback((key: TabKey) => {
    tabRefs.current[key]?.focus();
  }, []);

  const onTabsKeyDown = useCallback(
    (e: KeyboardEvent<HTMLDivElement>) => {
      const idx = TABS.indexOf(tab);
      if (idx === -1) return;

      switch (e.key) {
        case 'ArrowRight': {
          const next = TABS[(idx + 1) % TABS.length];
          setTab(next);
          focusTab(next);
          e.preventDefault();
          break;
        }
        case 'ArrowLeft': {
          const prev = TABS[(idx - 1 + TABS.length) % TABS.length];
          setTab(prev);
          focusTab(prev);
          e.preventDefault();
          break;
        }
        case 'Home': {
          const first = TABS[0];
          setTab(first);
          focusTab(first);
          e.preventDefault();
          break;
        }
        case 'End': {
          const last = TABS[TABS.length - 1];
          setTab(last);
          focusTab(last);
          e.preventDefault();
          break;
        }
      }
    },
    [tab, focusTab]
  );

  return (
    <div className={baseStyles.wrapper}>
      <div className={baseStyles.dividerLayer} />

      <main className={baseStyles.pageContainer} role="main" aria-label="Settings">
        <header className={styles.pageHeader}>
          <h1 className={styles.pageTitle}>Settings</h1>
          <p className={styles.pageSubtitle}>
            Manage your character profile and account preferences.
          </p>
        </header>

        {/* Accessible Tabs */}
        <div
          className={styles.tabs}
          role="tablist"
          aria-label="Settings sections"
          onKeyDown={onTabsKeyDown}
        >
          <button
            ref={setTabRef('profile')}
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
            ref={setTabRef('account')}
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
        </div>

        {/* Panels */}
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
          <h2 className={styles.sectionTitle}>Account</h2>
          <p className={styles.paragraph}>
            Account settings coming soon (email, connected providers, security, etc.).
          </p>
        </section>
      </main>
    </div>
  );
}
