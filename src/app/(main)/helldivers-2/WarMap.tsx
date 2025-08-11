// src/app/(main)/helldivers-2/WarMap.tsx
'use client';

import useSWR from 'swr';
import Link from 'next/link';
import styles from './HelldiversPage.module.css';

const fetcher = (url: string) => fetch(url).then((r) => r.json());

export default function WarMap() {
  const { data: status, isLoading: loadingStatus } = useSWR('/api/war/status', fetcher, {
    refreshInterval: 60000,
    revalidateOnFocus: false,
  });
  const { data: info, isLoading: loadingInfo } = useSWR('/api/war/info', fetcher, {
    refreshInterval: 24 * 60 * 60 * 1000,
    revalidateOnFocus: false,
  });

  if (loadingStatus || loadingInfo) return <div>Loading war map…</div>;
  if (!status || !info) return <div>Failed to load war data.</div>;

  // Minimal placeholder: count planets and show a simple list
  const planets = info?.planets ?? info?.data?.planets ?? [];

  return (
    <div className={styles.section}>
      <h3 className={styles.sectionTitle}>Galactic War</h3>
      <p className={styles.paragraph}>Planets: {Array.isArray(planets) ? planets.length : 0}</p>
      <ul className={`${styles.styledList}`} style={{ maxHeight: 300, overflow: 'auto', paddingLeft: 18 }}>
        {Array.isArray(planets) && planets.slice(0, 25).map((p: any) => (
          <li key={p.index ?? p.id ?? p.name} className={styles.listItem}>
            <div style={{ fontWeight: 600 }}>{p.name || 'Unknown Planet'}</div>
            <div className={styles.paragraph} style={{ marginBottom: 0 }}>
              biome: {p.biome || 'unknown'} — hazards: {Array.isArray(p.environmentals) ? (p.environmentals.join(', ') || 'none') : 'none'}
            </div>
          </li>
        ))}
      </ul>
      <p className={styles.paragraph} style={{ marginTop: 8 }}>
        <Link href="/helldivers-2/map" className={styles.link}>Open full map</Link>
      </p>
    </div>
  );
}