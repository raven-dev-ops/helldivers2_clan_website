// src/app/(main)/helldivers-2/WarMap.tsx
'use client';

import useSWR from 'swr';
import Link from 'next/link';

const fetcher = (url: string) => fetch(url).then((r) => r.json());

export default function WarMap() {
  const { data: status, isLoading: loadingStatus } = useSWR('/api/war/status', fetcher, {
    refreshInterval: 60000,
    revalidateOnFocus: false,
  });
  const { data: info, isLoading: loadingInfo } = useSWR('/api/war/info', fetcher, {
    refreshInterval: 24 * 60 * 60 * 1000,
    revalidateOnFocus: false,
  });

  if (loadingStatus || loadingInfo) return <div>Loading war map…</div>;
  if (!status || !info) return <div>Failed to load war data.</div>;

  // Minimal placeholder: count planets and show a simple list
  const planets = info?.planets ?? [];

  return (
    <div>
      <h3 style={{ fontWeight: 600 }}>Galactic War</h3>
      <p>Planets: {planets.length}</p>
      <ul style={{ maxHeight: 300, overflow: 'auto', paddingLeft: 18 }}>
        {planets.slice(0, 25).map((p: any) => (
          <li key={p.index}>
            {p.name} — biome: {p.biome} — hazards: {(p.environmentals || []).join(', ') || 'none'}
          </li>
        ))}
      </ul>
      <p style={{ marginTop: 8 }}>
        <Link href="/helldivers-2/map">Open full map</Link>
      </p>
    </div>
  );
}