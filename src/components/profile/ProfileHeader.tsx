'use client';
/* eslint-disable @next/next/no-img-element */

import Link from 'next/link';
import styles from './Profile.module.css';

const toUrl = (pathname: string) => ({ pathname });

export default function ProfileHeader({
  name,
  rankTitle,
  avatarUrl,
}: {
  name?: string | null;
  rankTitle?: string | null;
  avatarUrl?: string | null;
}) {
  return (
    <header className={styles.profileHeader}>
      <div className={styles.avatar}>
        <img src={avatarUrl || '/images/avatar-default.png'} alt="Avatar" />
      </div>
      <div className={styles.profileInfo}>
        <h1 className={styles.profileName}>{name || 'Unnamed Diver'}</h1>
        <p className={styles.profileSubtitle}>{rankTitle || 'Cadet'}</p>
        <div className={styles.profileActions}>
          <Link href={toUrl('/settings')} className={styles.button}>
            Edit Profile
          </Link>
        </div>
      </div>
    </header>
  );
}
