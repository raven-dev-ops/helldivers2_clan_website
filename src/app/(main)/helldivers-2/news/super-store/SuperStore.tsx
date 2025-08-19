// src/app/(main)/helldivers-2/SuperStore.tsx
'use client';
/* eslint-disable @next/next/no-img-element */

import useSWR from 'swr';
import styles from './HelldiversBase.module.css';

const fetcher = (url: string) => fetch(url).then((r) => r.json());

export default function SuperStore() {
  const { data, isLoading } = useSWR('/api/store/rotation', fetcher, {
    refreshInterval: 5 * 60 * 1000,
    revalidateOnFocus: false,
  });

  if (isLoading) return <div>Loading Super Store…</div>;
  if (!data?.rotation) return <div>No current rotation. Check back later.</div>;

  const { rotation, items } = data;
  const starts = new Date(rotation.starts_at).toLocaleString();
  const ends = new Date(rotation.ends_at).toLocaleString();

  return (
    <div className={styles.section}>
      <h3 className={styles.sectionTitle}>Super Store</h3>
      <p className={styles.paragraph}>
        Last updated window: {starts} → {ends}
      </p>
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill,minmax(180px,1fr))',
          gap: 12,
        }}
      >
        {items?.map((it: any) => (
          <div
            key={it._id}
            style={{
              border: '1px solid #e5e7eb',
              borderRadius: 8,
              padding: 12,
            }}
          >
            <img
              src={it.image_url}
              alt={it.name}
              style={{
                width: '100%',
                height: 120,
                objectFit: 'cover',
                borderRadius: 6,
              }}
              loading="lazy"
            />
            <div style={{ marginTop: 8, fontWeight: 600 }}>{it.name}</div>
            <div style={{ color: '#374151' }}>{it.type}</div>
            <div style={{ marginTop: 6 }}>Price: {it.price_sc} SC</div>
          </div>
        ))}
      </div>
      <p style={{ marginTop: 8, fontSize: 12, color: '#6b7280' }}>
        Unofficial; refreshed by community.
      </p>
    </div>
  );
}
