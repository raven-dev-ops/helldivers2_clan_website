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

export default function HelldiversLeaderboard({ initialMonthData, initialLifetimeData }: { initialMonthData?: { sortBy: SortField; sortDir: SortDir; limit: number; results: LeaderboardRow[] }, initialLifetimeData?: { sortBy: SortField; sortDir: SortDir; limit: number; results: LeaderboardRow[] } }) {
  const [monthData, setMonthData] = useState<LeaderboardRow[]>(initialMonthData?.results || []);
  const [lifetimeData, setLifetimeData] = useState<LeaderboardRow[]>(initialLifetimeData?.results || []);

  const [monthLoading, setMonthLoading] = useState<boolean>(!initialMonthData);
  const [lifetimeLoading, setLifetimeLoading] = useState<boolean>(!initialLifetimeData);

  const [monthError, setMonthError] = useState<string | null>(null);
  const [lifetimeError, setLifetimeError] = useState<string | null>(null);

  const [monthSortBy, setMonthSortBy] = useState<SortField>(initialMonthData?.sortBy || 'Kills');
  const [monthSortDir, setMonthSortDir] = useState<SortDir>(initialMonthData?.sortDir || 'desc');

  const [lifetimeSortBy, setLifetimeSortBy] = useState<SortField>(initialLifetimeData?.sortBy || 'Kills');
  const [lifetimeSortDir, setLifetimeSortDir] = useState<SortDir>(initialLifetimeData?.sortDir || 'desc');

  const toggleMonthSort = (field: SortField) => {
    if (field === monthSortBy) {
      setMonthSortDir(prev => (prev === 'asc' ? 'desc' : 'asc'));
    } else {
      setMonthSortBy(field);
      setMonthSortDir(field === 'player_name' || field === 'clan_name' ? 'asc' : 'desc');
    }
  };

  const toggleLifetimeSort = (field: SortField) => {
    if (field === lifetimeSortBy) {
      setLifetimeSortDir(prev => (prev === 'asc' ? 'desc' : 'asc'));
    } else {
      setLifetimeSortBy(field);
      setLifetimeSortDir(field === 'player_name' || field === 'clan_name' ? 'asc' : 'desc');
    }
  };

  useEffect(() => {
    let isCancelled = false;
    async function fetchMonth() {
      setMonthLoading(true);
      setMonthError(null);
      try {
        const now = new Date();
        const params = new URLSearchParams({ sortBy: monthSortBy, sortDir: monthSortDir, limit: '100', scope: 'month', month: '8', year: String(now.getUTCFullYear()) });
        const res = await fetch(`/api/helldivers/leaderboard?${params.toString()}`, { cache: 'no-store' });
        if (!res.ok) throw new Error(`Request failed: ${res.status}`);
        const payload = await res.json();
        if (!isCancelled) setMonthData(payload.results || []);
      } catch (e: any) {
        if (!isCancelled) setMonthError(e?.message || 'Failed to load leaderboard');
      } finally {
        if (!isCancelled) setMonthLoading(false);
      }
    }
    fetchMonth();
    return () => { isCancelled = true; };
  }, [monthSortBy, monthSortDir]);

  useEffect(() => {
    let isCancelled = false;
    async function fetchLifetime() {
      setLifetimeLoading(true);
      setLifetimeError(null);
      try {
        const params = new URLSearchParams({ sortBy: lifetimeSortBy, sortDir: lifetimeSortDir, limit: '100', scope: 'lifetime' });
        const res = await fetch(`/api/helldivers/leaderboard?${params.toString()}`, { cache: 'no-store' });
        if (!res.ok) throw new Error(`Request failed: ${res.status}`);
        const payload = await res.json();
        if (!isCancelled) setLifetimeData(payload.results || []);
      } catch (e: any) {
        if (!isCancelled) setLifetimeError(e?.message || 'Failed to load leaderboard');
      } finally {
        if (!isCancelled) setLifetimeLoading(false);
      }
    }
    fetchLifetime();
    return () => { isCancelled = true; };
  }, [lifetimeSortBy, lifetimeSortDir]);

  const monthActiveSort = useMemo(() => ({ sortBy: monthSortBy, sortDir: monthSortDir }), [monthSortBy, monthSortDir]);
  const lifetimeActiveSort = useMemo(() => ({ sortBy: lifetimeSortBy, sortDir: lifetimeSortDir }), [lifetimeSortBy, lifetimeSortDir]);

  function Table({ title, rows, loading, error, activeSort, onSort }: { title: string; rows: LeaderboardRow[]; loading: boolean; error: string | null; activeSort: { sortBy: SortField; sortDir: SortDir }; onSort: (f: SortField) => void }) {
    return (
      <section className="content-section">
        <h2 className="content-section-title with-border-bottom">{title}</h2>
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
                    <HeaderButton label="Player" sortKey="player_name" activeSort={activeSort} onSort={onSort} />
                  </th>
                  <th className="th text-right">
                    <HeaderButton label="Kills" sortKey="Kills" activeSort={activeSort} onSort={onSort} />
                  </th>
                  <th className="th text-right">
                    <HeaderButton label="Accuracy" sortKey="Accuracy" activeSort={activeSort} onSort={onSort} />
                  </th>
                  <th className="th text-right">
                    <HeaderButton label="Shots Fired" sortKey="Shots Fired" activeSort={activeSort} onSort={onSort} />
                  </th>
                  <th className="th text-right">
                    <HeaderButton label="Shots Hit" sortKey="Shots Hit" activeSort={activeSort} onSort={onSort} />
                  </th>
                  <th className="th text-right">
                    <HeaderButton label="Deaths" sortKey="Deaths" activeSort={activeSort} onSort={onSort} />
                  </th>
                  <th className="th">
                    <HeaderButton label="Clan" sortKey="clan_name" activeSort={activeSort} onSort={onSort} />
                  </th>
                  <th className="th">Submitted</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((row) => (
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

  return (
    <div>
      <Table
        title="August Leaderboard"
        rows={monthData}
        loading={monthLoading}
        error={monthError}
        activeSort={monthActiveSort}
        onSort={toggleMonthSort}
      />

      <Table
        title="Lifetime Leaderboard"
        rows={lifetimeData}
        loading={lifetimeLoading}
        error={lifetimeError}
        activeSort={lifetimeActiveSort}
        onSort={toggleLifetimeSort}
      />
    </div>
  );
}