'use client';

import useSWR from 'swr';
import styles from '@/app/(main)/helldivers-2/HelldiversBase.module.css';

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

const parseDateValue = (raw: unknown): Date | null => {
  if (raw == null) return null;
  if (typeof raw === 'number') {
    const n = raw;
    const ms = n < 1e12 ? (n > 1e9 ? n * 1000 : NaN) : n;
    const d = new Date(ms);
    return isNaN(d.getTime()) ? null : d;
  }
  if (typeof raw === 'string') {
    const s = raw.trim();
    if (!s) return null;
    if (/^\d+$/.test(s)) {
      const n = Number(s);
      const ms = n < 1e12 ? (n > 1e9 ? n * 1000 : NaN) : n;
      const d = new Date(ms);
      return isNaN(d.getTime()) ? null : d;
    }
    if (s.includes('T') || s.includes('-') || s.includes('/')) {
      const d = new Date(s);
      return isNaN(d.getTime()) ? null : d;
    }
    return null;
  }
  return null;
};

const pickDate = (n: ApiNewsItem): Date => {
  const candidates: Array<unknown> = [
    (n as any).published,
    (n as any).timestamp,
    (n as any).updatedAt,
    (n as any).createdAt,
    (n as any).time,
  ];
  for (const c of candidates) {
    const d = parseDateValue(c);
    if (d) return d;
  }
  return new Date();
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
      // Poll more frequently and revalidate on window focus for freshness
      refreshInterval: 60 * 1000,
      revalidateOnFocus: true,
    }
  );

  if (isLoading) return <div>Loading war news…</div>;
  if (error) return <div>Couldn’t load war news.</div>;

  // Normalize and sort newest-first to ensure correct order regardless of API
  const items: UINews[] = Array.isArray(data?.news)
    ? data!.news.map(normalize).sort((a, b) => b.date.getTime() - a.date.getTime())
    : [];

  return (
    <pre style={{ whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>
      {JSON.stringify({ news: items }, null, 2)}
    </pre>
  );
}
