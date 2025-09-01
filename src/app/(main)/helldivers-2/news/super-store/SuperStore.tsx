// src/app/(main)/helldivers-2/SuperStore.tsx
'use client';
/* eslint-disable @next/next/no-img-element */

import useSWR from 'swr';
import styles from '@/app/(main)/helldivers-2/HelldiversBase.module.css';

const fetcher = (url: string) =>
  fetch(url, { cache: 'no-store', headers: { Accept: 'application/json' } }).then((r) => r.json());

export default function SuperStore() {
  const { data, isLoading } = useSWR('/api/store/rotation', fetcher, {
    refreshInterval: 5 * 60 * 1000,
    revalidateOnFocus: true,
  });

  if (isLoading) return <div>Loading Super Store…</div>;
  return (
    <pre style={{ whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>
      {JSON.stringify(data ?? null, null, 2)}
    </pre>
  );
}
