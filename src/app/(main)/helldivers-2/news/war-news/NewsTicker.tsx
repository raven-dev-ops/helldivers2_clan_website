'use client';

import useSWR from 'swr';
import styles from './HelldiversBase.module.css';

type ApiNewsItem = {
  id?: string | number;
  title?: string;
  message?: string;
  url?: string;
  link?: string;
  planet?: string;
  sector?: string;
  faction?: string;
  severity?: string;
  source?: string;
  // dates
  time?: string | number;
  published?: string | number;
  updatedAt?: string | number;
  createdAt?: string | number;
  timestamp?: string | number;
};

type ApiResponse = { news?: ApiNewsItem[] };

type UINews = {
  id: string;
  title: string;
  message?: string;
  date: Date;
  url?: string;
  meta?: string;
};

const fetcher = async (url: string): Promise<ApiResponse> => {
  const res = await fetch(url, {
    cache: 'no-store',
    headers: { Accept: 'application/json' },
  });
  if (!res.ok) throw new Error(`News fetch failed (${res.status})`);
  return res.json();
};

const asString = (v: unknown) =>
  typeof v === 'string' && v.trim().length ? v.trim() : undefined;

const pickDate = (n: ApiNewsItem): Date => {
  const raw =
    (n as any).time ??
    n.published ??
    n.timestamp ??
    n.updatedAt ??
    n.createdAt ??
    Date.now();
  const d = new Date(raw as any);
  return isNaN(d.getTime()) ? new Date() : d;
};

const normalize = (n: ApiNewsItem): UINews => {
  const date = pickDate(n);
  const title =
    asString(n.title) ??
    asString((n as any).headline) ??
    asString(n.message)?.split('\n')[0]?.slice(0, 120) ??
    'War News';
  const message = asString(n.message);
  const bits = [
    asString(n.planet),
    asString(n.sector),
    asString(n.faction),
    asString(n.severity),
    asString(n.source),
  ].filter(Boolean) as string[];
  const url = asString(n.url) ?? asString(n.link);

  return {
    id: String(n.id ?? `${title}-${date.getTime()}`),
    title,
    message,
    date,
    url,
    meta: bits.length ? bits.join(' · ') : undefined,
  };
};

const formatDateTime = (d: Date) =>
  new Intl.DateTimeFormat(undefined, {
    year: 'numeric',
    month: 'short',
    day: '2-digit',
    hour: 'numeric',
    minute: '2-digit',
  }).format(d);

export default function NewsTicker() {
  const { data, isLoading, error } = useSWR<ApiResponse>(
    '/api/war-news', // ✅ use your new proxy route
    fetcher,
    {
      refreshInterval: 5 * 60 * 1000,
      revalidateOnFocus: false,
    }
  );

  if (isLoading) return <div>Loading war news…</div>;
  if (error) return <div>Couldn’t load war news.</div>;

  const items: ApiNewsItem[] = Array.isArray(data?.news) ? data!.news! : [];
  const uiItems = items.map(normalize).sort((a, b) => b.date.getTime() - a.date.getTime());
  const top = uiItems.slice(0, 10);

  if (!top.length) return <div>No war news available.</div>;

  return (
    <div className={styles.section}>
      <h3 className={styles.sectionTitle}>War News</h3>
      <ul className={styles.styledList} style={{ paddingLeft: 18 }}>
        {top.map((n) => (
          <li key={n.id} className={styles.listItem}>
            <div style={{ fontWeight: 700, lineHeight: 1.25 }}>
              {n.url ? (
                <a href={n.url} target="_blank" rel="noreferrer">
                  {n.title}
                </a>
              ) : (
                n.title
              )}
            </div>

            {n.meta && (
              <div className={styles.paragraph} style={{ opacity: 0.9 }}>
                {n.meta}
              </div>
            )}

            {n.message && <div className={styles.paragraph}>{n.message}</div>}

            <div className={styles.paragraph} style={{ marginBottom: 0 }}>
              {formatDateTime(n.date)}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
