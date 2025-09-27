"use client";

import { useState } from 'react';
import baseStyles from './styles/AppPage.module.css';
import styles from './Settings.module.css';
import ProfileEditForm from './ProfileEditForm';

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState('profile');

  const renderContent = () => {
    switch (activeTab) {
      case 'profile':
        return <ProfileEditForm />;
      // Add other settings sections here
      default:
        return null;
    }
  };

  return (
    <div className={baseStyles.wrapper}>
        <div className={baseStyles.dividerLayer} />
        <div className={baseStyles.pageContainer}>
            <header className={styles.settingsHeader}>
                <h1 className={styles.settingsTitle}>Settings</h1>
                <p className={styles.settingsSubtitle}>
                    Manage your account and profile settings.
                </p>
            </header>

            <div className={styles.gridContainer}>
                <aside className={styles.sidebar}>
                    <button
                        className={styles.sidebarButton}
                        onClick={() => setActiveTab('profile')}
                        aria-pressed={activeTab === 'profile'}
                    >
                        Profile
                    </button>
                    {/* Add other settings tabs here */}
                </aside>

                <main className={styles.content}>
                    {renderContent()}
                </main>
            </div>
        </div>
    </div>
  );
}
