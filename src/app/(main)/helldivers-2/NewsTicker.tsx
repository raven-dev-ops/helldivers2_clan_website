// src/app/(main)/helldivers-2/NewsTicker.tsx
'use client';

import useSWR from 'swr';

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
    <div>
      <h3 style={{ fontWeight: 600 }}>War News</h3>
      <ul style={{ paddingLeft: 18 }}>
        {items.slice(0, 10).map((n: any, idx: number) => (
          <li key={n.id || idx}>
            {n.title || n.message || 'Update'} — {new Date(n.published || n.timestamp || Date.now()).toLocaleString()}
          </li>
        ))}
      </ul>
    </div>
  );
}