'use client';

import useSWR from 'swr';
import styles from '@/app/(main)/helldivers-2/HelldiversBase.module.css';

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

  return (
    <pre style={{ whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>
      {JSON.stringify(data ?? null, null, 2)}
    </pre>
  );
}
