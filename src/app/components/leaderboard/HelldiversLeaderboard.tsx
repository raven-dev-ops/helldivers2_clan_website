// src/app/components/leaderboard/HelldiversLeaderboard.tsx
'use client';

import React, { useEffect, useMemo, useState } from 'react';

type SortField = 'Kills' | 'Accuracy' | 'Shots Fired' | 'Shots Hit' | 'Deaths' | 'player_name' | 'clan_name' | 'submitted_at';

type SortDir = 'asc' | 'desc';

interface LeaderboardRow {
  rank: number;
  id: string;
  player_name: string;
  Kills: number | string;
  Accuracy: string;
  ShotsFired: number;
  ShotsHit: number;
  Deaths: number | string;
  clan_name?: string;
  submitted_at?: string | Date | null;
}

function HeaderButton({
  label,
  sortKey,
  activeSort,
  onSort
}: {
  label: string;
  sortKey: SortField;
  activeSort: { sortBy: SortField; sortDir: SortDir };
  onSort: (field: SortField) => void;
}) {
  const isActive = activeSort.sortBy === sortKey;
  const arrow = isActive ? (activeSort.sortDir === 'asc' ? '▲' : '▼') : '↕';
  return (
    <button className="table-sort-button" onClick={() => onSort(sortKey)} aria-label={`Sort by ${label}`}>
      <span>{label}</span>
      <span className="table-sort-arrow" aria-hidden>{arrow}</span>
    </button>
  );
}

export default function HelldiversLeaderboard() {
  const [data, setData] = useState<LeaderboardRow[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<SortField>('Kills');
  const [sortDir, setSortDir] = useState<SortDir>('desc');

  const toggleSort = (field: SortField) => {
    if (field === sortBy) {
      setSortDir(prev => (prev === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortBy(field);
      setSortDir(field === 'player_name' || field === 'clan_name' ? 'asc' : 'desc');
    }
  };

  useEffect(() => {
    let isCancelled = false;
    async function fetchData() {
      setLoading(true);
      setError(null);
      try {
        const params = new URLSearchParams({ sortBy, sortDir, limit: '100' });
        const res = await fetch(`/api/helldivers/leaderboard?${params.toString()}`, { cache: 'no-store' });
        if (!res.ok) throw new Error(`Request failed: ${res.status}`);
        const payload = await res.json();
        if (!isCancelled) {
          setData(payload.results || []);
        }
      } catch (e: any) {
        if (!isCancelled) setError(e?.message || 'Failed to load leaderboard');
      } finally {
        if (!isCancelled) setLoading(false);
      }
    }
    fetchData();
    return () => { isCancelled = true; };
  }, [sortBy, sortDir]);

  const activeSort = useMemo(() => ({ sortBy, sortDir }), [sortBy, sortDir]);

  return (
    <section className="content-section">
      <h2 className="content-section-title with-border-bottom">Helldivers Leaderboard</h2>
      {error && <p className="text-paragraph">Error: {error}</p>}
      {loading ? (
        <p className="text-paragraph">Loading leaderboard…</p>
      ) : (
        <div className="table-container">
          <table className="table">
            <thead>
              <tr>
                <th className="th text-center" style={{ width: 64 }}>#</th>
                <th className="th">
                  <HeaderButton label="Player" sortKey="player_name" activeSort={activeSort} onSort={toggleSort} />
                </th>
                <th className="th text-right">
                  <HeaderButton label="Kills" sortKey="Kills" activeSort={activeSort} onSort={toggleSort} />
                </th>
                <th className="th text-right">
                  <HeaderButton label="Accuracy" sortKey="Accuracy" activeSort={activeSort} onSort={toggleSort} />
                </th>
                <th className="th text-right">
                  <HeaderButton label="Shots Fired" sortKey="Shots Fired" activeSort={activeSort} onSort={toggleSort} />
                </th>
                <th className="th text-right">
                  <HeaderButton label="Shots Hit" sortKey="Shots Hit" activeSort={activeSort} onSort={toggleSort} />
                </th>
                <th className="th text-right">
                  <HeaderButton label="Deaths" sortKey="Deaths" activeSort={activeSort} onSort={toggleSort} />
                </th>
                <th className="th">
                  <HeaderButton label="Clan" sortKey="clan_name" activeSort={activeSort} onSort={toggleSort} />
                </th>
                <th className="th">Submitted</th>
              </tr>
            </thead>
            <tbody>
              {data.map((row) => (
                <tr key={row.id}>
                  <td className="td text-center">{row.rank}</td>
                  <td className="td">{row.player_name}</td>
                  <td className="td text-right">{row.Kills}</td>
                  <td className="td text-right">{row.Accuracy}</td>
                  <td className="td text-right">{row.ShotsFired}</td>
                  <td className="td text-right">{row.ShotsHit}</td>
                  <td className="td text-right">{row.Deaths}</td>
                  <td className="td">{row.clan_name || ''}</td>
                  <td className="td">{row.submitted_at ? new Date(row.submitted_at).toLocaleString() : ''}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}