'use client';

import useSWR from 'swr';
import styles from './HelldiversBase.module.css';

const fetcher = (url: string) =>
  fetch(url, { headers: { Accept: 'application/json' } }).then((r) => r.json());

type MajorOrder = {
  id: string;
  title: string;
  description?: string;
  expires?: string; // ISO
  progress?: number; // 0..1
  goal?: number;
  reward?: string;
  source?: string;
};

const pct = (p?: number) =>
  typeof p === 'number' && isFinite(p) ? Math.max(0, Math.min(100, Math.round(p * 100))) : undefined;

const formatDateTime = (iso?: string) => {
  if (!iso) return 'Unknown';
  const d = new Date(iso);
  if (isNaN(d.getTime())) return 'Unknown';
  return new Intl.DateTimeFormat(undefined, {
    year: 'numeric',
    month: 'short',
    day: '2-digit',
    hour: 'numeric',
    minute: '2-digit',
  }).format(d);
};

const timeLeft = (iso?: string) => {
  if (!iso) return '';
  const ms = new Date(iso).getTime() - Date.now();
  if (!isFinite(ms)) return '';
  if (ms <= 0) return 'Expired';
  const mins = Math.floor(ms / 60000);
  const d = Math.floor(mins / (60 * 24));
  const h = Math.floor((mins % (60 * 24)) / 60);
  const m = mins % 60;
  if (d) return `${d}d ${h}h left`;
  if (h) return `${h}h ${m}m left`;
  return `${m}m left`;
};

export default function MajorOrders() {
  const { data, isLoading, error } = useSWR<{ orders?: MajorOrder[] }>(
    '/api/war/major-orders',
    fetcher,
    {
      refreshInterval: 5 * 60 * 1000,
      revalidateOnFocus: false,
    }
  );

  if (isLoading) return <div>Loading Major Orders…</div>;
  if (error) return <div>Couldn’t load Major Orders.</div>;

  const orders = Array.isArray(data?.orders) ? (data!.orders as MajorOrder[]) : [];

  if (!orders.length) return <div className={styles.section}>No current Major Orders.</div>;

  return (
    <div className={styles.section}>
      <h3 className={styles.sectionTitle}>Major Orders</h3>
      <ul className={styles.styledList} style={{ paddingLeft: 18 }}>
        {orders.slice(0, 5).map((o, idx) => {
          const progressPct = pct(o.progress);
          return (
            <li key={o.id || idx} className={styles.listItem}>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, flexWrap: 'wrap' }}>
                <div style={{ fontWeight: 600 }}>{o.title || 'Major Order'}</div>
                {o.reward && (
                  <span
                    style={{
                      marginLeft: 6,
                      fontSize: '0.8rem',
                      padding: '0.15rem 0.5rem',
                      borderRadius: 999,
                      border: '1px solid var(--color-border)',
                      background: 'var(--color-surface-alt)',
                      color: 'var(--color-text-secondary)',
                    }}
                  >
                    Reward: {o.reward}
                  </span>
                )}
              </div>

              {o.description && <div className={styles.paragraph}>{o.description}</div>}

              {typeof progressPct === 'number' && (
                <div
                  aria-label="Progress"
                  role="progressbar"
                  aria-valuemin={0}
                  aria-valuemax={100}
                  aria-valuenow={progressPct}
                  style={{ margin: '0.25rem 0 0.5rem' }}
                >
                  <div
                    style={{
                      height: 8,
                      borderRadius: 999,
                      background: 'rgba(255,255,255,0.08)',
                      border: '1px solid var(--color-border)',
                      overflow: 'hidden',
                    }}
                  >
                    <div
                      style={{
                        width: `${progressPct}%`,
                        height: '100%',
                        background: 'var(--color-primary)',
                      }}
                    />
                  </div>
                  <div
                    className={styles.paragraph}
                    style={{ marginTop: 4, marginBottom: 0, opacity: 0.85 }}
                  >
                    Progress: {progressPct}%
                    {o.goal ? ` · Goal: ${o.goal}` : ''}
                  </div>
                </div>
              )}

              <div className={styles.paragraph} style={{ marginBottom: 0 }}>
                Expires: {formatDateTime(o.expires)} {`(${timeLeft(o.expires)})`}
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
