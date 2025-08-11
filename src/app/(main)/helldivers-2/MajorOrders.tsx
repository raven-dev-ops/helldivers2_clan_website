// src/app/(main)/helldivers-2/MajorOrders.tsx
'use client';

import useSWR from 'swr';

const fetcher = (url: string) => fetch(url).then((r) => r.json());

export default function MajorOrders() {
  const { data, isLoading } = useSWR('/api/war/major-orders', fetcher, {
    refreshInterval: 5 * 60 * 1000,
    revalidateOnFocus: false,
  });

  if (isLoading) return <div>Loading Major Orders…</div>;
  if (!data) return <div>No current Major Orders.</div>;

  const orders = Array.isArray(data?.orders) ? data.orders : (data?.data || data || []);

  return (
    <div>
      <h3 style={{ fontWeight: 600 }}>Major Orders</h3>
      <ul style={{ paddingLeft: 18 }}>
        {orders.slice(0, 5).map((o: any, idx: number) => (
          <li key={o.id || idx}>
            {o.title || o.text || 'Order'} — {new Date(o.expires || o.expiration || Date.now()).toLocaleString()}
          </li>
        ))}
      </ul>
    </div>
  );
}