// src/app/components/leaderboard/HelldiversLeaderboard.tsx
'use client';

import React, { useEffect, useMemo, useState } from 'react';

type SortField = 'Kills' | 'Accuracy' | 'Shots Fired' | 'Shots Hit' | 'Deaths' | 'player_name' | 'clan_name' | 'submitted_at' | 'Avg Kills' | 'Avg Shots Fired' | 'Avg Shots Hit' | 'Avg Deaths';

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
  // Optional averages for lifetime scope
  AvgKills?: number;
  AvgShotsFired?: number;
  AvgShotsHit?: number;
  AvgDeaths?: number;
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

// Moved outside to avoid remounting on each parent render (prevents input blur)
function LeaderboardTableSection({
  title,
  rows,
  loading,
  error,
  activeSort,
  onSort,
  showAverages,
  showTotals = true,
  searchTerm,
  onSearch,
}: {
  title: string;
  rows: LeaderboardRow[];
  loading: boolean;
  error: string | null;
  activeSort: { sortBy: SortField; sortDir: SortDir };
  onSort: (f: SortField) => void;
  showAverages?: boolean;
  showTotals?: boolean;
  searchTerm: string;
  onSearch: (v: string) => void;
}) {
  const hasAverages = showAverages && rows.length > 0 && (
    typeof rows[0].AvgKills === 'number' || typeof rows[0].AvgShotsFired === 'number' || typeof rows[0].AvgShotsHit === 'number' || typeof rows[0].AvgDeaths === 'number'
  );

  const normalizedQuery = searchTerm.trim().toLowerCase();
  const filteredRows = normalizedQuery
    ? rows.filter(r => (r.player_name || '').toLowerCase().includes(normalizedQuery))
    : rows;

  const totalColumns = 2 /* rank, player */
    + 1 /* accuracy */
    + (showTotals ? 4 : 0) /* totals: kills, shots fired, shots hit, deaths */
    + (hasAverages ? 4 : 0) /* averages: avg kills, avg shots fired, avg shots hit, avg deaths */;

  return (
    <section className="content-section">
      <h2 className="content-section-title with-border-bottom leaderboard-title">{title}</h2>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12, marginBottom: 12 }}>
        <input
          aria-label={`Search ${title} by player name`}
          placeholder="Search by player name..."
          value={searchTerm}
          onChange={(e) => onSearch(e.target.value)}
          className="input"
          style={{ maxWidth: 320 }}
        />
      </div>
      {error && <p className="text-paragraph">Error: {error}</p>}
      {loading ? (
        <p className="text-paragraph">Loading leaderboard…</p>
      ) : (
        <div className="table-container">
          <table className="table">
            <thead>
              <tr>
                <th className="th text-center col-rank" style={{ width: 56 }}>#</th>
                <th className="th col-player">
                  <HeaderButton label="Player" sortKey="player_name" activeSort={activeSort} onSort={onSort} />
                </th>
                {showTotals && (
                  <th className="th text-right col-kills">
                    <HeaderButton label="Kills" sortKey="Kills" activeSort={activeSort} onSort={onSort} />
                  </th>
                )}
                {hasAverages && (
                  <th className="th text-right col-avg-kills">
                    <HeaderButton label="Avg Kills" sortKey="Avg Kills" activeSort={activeSort} onSort={onSort} />
                  </th>
                )}
                <th className="th text-right col-accuracy">
                  <HeaderButton label="Accuracy" sortKey="Accuracy" activeSort={activeSort} onSort={onSort} />
                </th>
                {showTotals && (
                  <th className="th text-right col-shots-fired">
                    <HeaderButton label="Shots Fired" sortKey="Shots Fired" activeSort={activeSort} onSort={onSort} />
                  </th>
                )}
                {hasAverages && (
                  <th className="th text-right col-avg-shots-fired">
                    <HeaderButton label="Avg Shots Fired" sortKey="Avg Shots Fired" activeSort={activeSort} onSort={onSort} />
                  </th>
                )}
                {showTotals && (
                  <th className="th text-right col-shots-hit">
                    <HeaderButton label="Shots Hit" sortKey="Shots Hit" activeSort={activeSort} onSort={onSort} />
                  </th>
                )}
                {hasAverages && (
                  <th className="th text-right col-avg-shots-hit">
                    <HeaderButton label="Avg Shots Hit" sortKey="Avg Shots Hit" activeSort={activeSort} onSort={onSort} />
                  </th>
                )}
                {showTotals && (
                  <th className="th text-right col-deaths">
                    <HeaderButton label="Deaths" sortKey="Deaths" activeSort={activeSort} onSort={onSort} />
                  </th>
                )}
                {hasAverages && (
                  <th className="th text-right col-avg-deaths">
                    <HeaderButton label="Avg Deaths" sortKey="Avg Deaths" activeSort={activeSort} onSort={onSort} />
                  </th>
                )}
              </tr>
            </thead>
            <tbody>
              {filteredRows.map((row) => (
                <tr key={row.id}>
                  <td className="td text-center col-rank">{row.rank}</td>
                  <td className="td col-player">{row.player_name}</td>
                  {showTotals && <td className="td text-right col-kills">{row.Kills}</td>}
                  {hasAverages && <td className="td text-right col-avg-kills">{typeof row.AvgKills === 'number' ? row.AvgKills.toFixed(1) : ''}</td>}
                  <td className="td text-right col-accuracy">{row.Accuracy}</td>
                  {showTotals && <td className="td text-right col-shots-fired">{row.ShotsFired}</td>}
                  {hasAverages && <td className="td text-right col-avg-shots-fired">{typeof row.AvgShotsFired === 'number' ? row.AvgShotsFired.toFixed(1) : ''}</td>}
                  {showTotals && <td className="td text-right col-shots-hit">{row.ShotsHit}</td>}
                  {hasAverages && <td className="td text-right col-avg-shots-hit">{typeof row.AvgShotsHit === 'number' ? row.AvgShotsHit.toFixed(1) : ''}</td>}
                  {showTotals && <td className="td text-right col-deaths">{row.Deaths}</td>}
                  {hasAverages && <td className="td text-right col-avg-deaths">{typeof row.AvgDeaths === 'number' ? row.AvgDeaths.toFixed(1) : ''}</td>}
                </tr>
              ))}
              {!filteredRows.length && (
                <tr>
                  <td className="td" colSpan={totalColumns}>No matching players.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </section>
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

  const [monthSearch, setMonthSearch] = useState<string>('');
  const [lifetimeTotalsSearch, setLifetimeTotalsSearch] = useState<string>('');
  const [lifetimeAveragesSearch, setLifetimeAveragesSearch] = useState<string>('');

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
        const params = new URLSearchParams({ sortBy: monthSortBy, sortDir: monthSortDir, limit: '100', scope: 'month', month: String(now.getUTCMonth() + 1), year: String(now.getUTCFullYear()) });
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
        const params = new URLSearchParams({ sortBy: lifetimeSortBy, sortDir: lifetimeSortDir, limit: '1000', scope: 'lifetime' });
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

  return (
    <div>
      <LeaderboardTableSection
        title="Monthly Leaderboard"
        rows={monthData}
        loading={monthLoading}
        error={monthError}
        activeSort={monthActiveSort}
        onSort={toggleMonthSort}
        showAverages={false}
        showTotals={true}
        searchTerm={monthSearch}
        onSearch={setMonthSearch}
      />

      <LeaderboardTableSection
        title="Total Leaderboard"
        rows={lifetimeData}
        loading={lifetimeLoading}
        error={lifetimeError}
        activeSort={lifetimeActiveSort}
        onSort={toggleLifetimeSort}
        showAverages={false}
        showTotals={true}
        searchTerm={lifetimeTotalsSearch}
        onSearch={setLifetimeTotalsSearch}
      />

      <LeaderboardTableSection
        title="Average Leaderboard"
        rows={lifetimeData}
        loading={lifetimeLoading}
        error={lifetimeError}
        activeSort={lifetimeActiveSort}
        onSort={toggleLifetimeSort}
        showAverages={true}
        showTotals={false}
        searchTerm={lifetimeAveragesSearch}
        onSearch={setLifetimeAveragesSearch}
      />
    </div>
  );
}