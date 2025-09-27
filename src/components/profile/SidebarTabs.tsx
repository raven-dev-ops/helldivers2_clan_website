'use client';

import styles from '@/components/profile/Profile.module.css';

export type InfoTab =
  | 'roles'
  | 'awards'
  | 'squad'
  | 'rankings'
  | 'activity'
  | 'linked'
  | 'merit';

export default function SidebarTabs({
  active,
  onChange,
}: {
  active: InfoTab;
  onChange: (tab: InfoTab) => void;
}) {
  const btn = (tab: InfoTab, label: string) => (
    <button
      key={tab}
      className={styles.sidebarButton}
      onClick={() => onChange(tab)}
      aria-pressed={active === tab}
    >
      {label}
    </button>
  );

  return (
    <aside className={styles.sidebar}>
      {btn('roles', 'Roles')}
      {btn('awards', 'Awards')}
      {btn('squad', 'Squad')}
      {btn('rankings', 'Rankings')}
      {btn('activity', 'Activity')}
      {btn('merit', 'Merit')}
      {btn('linked', 'Linked')}
    </aside>
  );
}
