// src/app/(main)/helldivers-2/MajorOrders.tsx
'use client';

import useSWR from 'swr';
import styles from './HelldiversPage.module.css';

const fetcher = (url: string) => fetch(url).then((r) => r.json());

export default function MajorOrders() {
  const { data, isLoading } = useSWR('/api/war/major-orders', fetcher, {
    refreshInterval: 5 * 60 * 1000,
    revalidateOnFocus: false,
  });

  if (isLoading) return <div>Loading Major Orders…</div>;
  if (!data) return <div>No current Major Orders.</div>;

  const orders = Array.isArray(data?.orders)
    ? data.orders
    : data?.data || data || [];

  return (
    <div className={styles.section}>
      <h3 className={styles.sectionTitle}>Major Orders</h3>
      <ul className={`${styles.styledList}`} style={{ paddingLeft: 18 }}>
        {orders.slice(0, 5).map((o: any, idx: number) => {
          const title = o.title || o.text || 'Order';
          const desc = o.description || o.brief || '';
          const expires = new Date(
            o.expires || o.expiration || Date.now()
          ).toLocaleString();
          return (
            <li key={o.id || idx} className={styles.listItem}>
              <div style={{ fontWeight: 600 }}>{title}</div>
              {desc && <div className={styles.paragraph}>{desc}</div>}
              <div className={styles.paragraph} style={{ marginBottom: 0 }}>
                Expires: {expires}
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
