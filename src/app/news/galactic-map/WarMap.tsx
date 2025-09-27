'use client';

import useSWR from 'swr';
import Link from 'next/link';
import styles from '@/app/(main)/helldivers-2/HelldiversBase.module.css';

const fetcher = (url: string) =>
  fetch(url, { cache: 'no-store', headers: { Accept: 'application/json' } }).then((r) => r.json());

export default function WarMap() {
  const { data: status, isLoading: loadingStatus, error: statusErr } = useSWR(
    '/api/war/status',
    fetcher,
    { refreshInterval: 60_000, revalidateOnFocus: true }
  );
  const { data: info, isLoading: loadingInfo, error: infoErr } = useSWR(
    '/api/war/info',
    fetcher,
    { refreshInterval: 5 * 60 * 1000, revalidateOnFocus: true }
  );

  if (loadingStatus || loadingInfo) return <div>Loading war map…</div>;
  if (statusErr || infoErr) return <div>Failed to load war data.</div>;
  if (!status || !info) return <div>Failed to load war data.</div>;

  return (
    <pre style={{ whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>
      {JSON.stringify({ status, info }, null, 2)}
    </pre>
  );
}
