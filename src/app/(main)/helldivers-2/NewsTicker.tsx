// src/app/(main)/helldivers-2/NewsTicker.tsx
'use client';

import useSWR from 'swr';
import styles from './HelldiversPage.module.css';

const fetcher = (url: string) => fetch(url).then((r) => r.json());

export default function NewsTicker() {
  const { data, isLoading } = useSWR('/api/news', fetcher, {
    refreshInterval: 5 * 60 * 1000,
    revalidateOnFocus: false,
  });

  if (isLoading) return <div>Loading news…</div>;
  if (!data) return <div>No news available.</div>;

  const items = Array.isArray(data?.news) ? data.news : (data?.data || data || []);

  return (
    <div className={styles.section}>
      <h3 className={styles.sectionTitle}>War News</h3>
      <ul className={`${styles.styledList}`} style={{ paddingLeft: 18 }}>
        {items.slice(0, 10).map((n: any, idx: number) => (
          <li key={n.id || idx} className={styles.listItem}>
            <div style={{ fontWeight: 600 }}>{n.title || n.message || 'Update'}</div>
            <div className={styles.paragraph} style={{ marginBottom: 0 }}>
              {new Date(n.published || n.timestamp || Date.now()).toLocaleString()}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}