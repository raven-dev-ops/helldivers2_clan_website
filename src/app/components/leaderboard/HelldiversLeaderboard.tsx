// src/app/components/leaderboard/HelldiversLeaderboard.tsx
'use client';

import React, { useEffect, useMemo, useState } from 'react';

type SortField =
  | 'Kills'
  | 'Accuracy'
  | 'Shots Fired'
  | 'Shots Hit'
  | 'Deaths'
  | 'player_name'
  | 'clan_name'
  | 'submitted_at'
  | 'Avg Kills'
  | 'Avg Shots Fired'
  | 'Avg Shots Hit'
  | 'Avg Deaths';

type SortDir = 'asc' | 'desc';

function getWeekNumber(d: Date) {
  const date = new Date(
    Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate())
  );
  const dayNum = date.getUTCDay() || 7;
  date.setUTCDate(date.getUTCDate() + 4 - dayNum);
  const yearStart = new Date(Date.UTC(date.getUTCFullYear(), 0, 1));
  return Math.ceil(((date.getTime() - yearStart.getTime()) / 86400000 + 1) / 7);
}

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
  onSort,
}: {
  label: string;
  sortKey: SortField;
  activeSort: { sortBy: SortField; sortDir: SortDir };
  onSort: (field: SortField) => void;
}) {
  const isActive = activeSort.sortBy === sortKey;
  const arrow = isActive ? (activeSort.sortDir === 'asc' ? '▲' : '▼') : '↕';
  return (
    <button
      className="table-sort-button"
      onClick={() => onSort(sortKey)}
      aria-label={`Sort by ${label}`}
    >
      <span>{label}</span>
      <span className="table-sort-arrow" aria-hidden>
        {arrow}
      </span>
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
  sectionId,
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
  sectionId?: string;
}) {
  const hasAverages =
    showAverages &&
    rows.length > 0 &&
    (typeof rows[0].AvgKills === 'number' ||
      typeof rows[0].AvgShotsFired === 'number' ||
      typeof rows[0].AvgShotsHit === 'number' ||
      typeof rows[0].AvgDeaths === 'number');

  const normalizedQuery = searchTerm.trim().toLowerCase();
  const filteredRows = normalizedQuery
    ? rows.filter((r) =>
        (r.player_name || '').toLowerCase().includes(normalizedQuery)
      )
    : rows;

  const totalColumns =
    2 /* rank, player */ +
    1 /* accuracy */ +
    (showTotals ? 4 : 0) /* totals: kills, shots fired, shots hit, deaths */ +
    (hasAverages
      ? 4
      : 0); /* averages: avg kills, avg shots fired, avg shots hit, avg deaths */

  return (
    <section id={sectionId} className="content-section">
      <h2 className="content-section-title with-border-bottom leaderboard-title">
        {title}
      </h2>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          gap: 12,
          marginBottom: 12,
        }}
      >
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
                <th className="th text-center col-rank" style={{ width: 56 }}>
                  #
                </th>
                <th className="th col-player">
                  <HeaderButton
                    label="Player"
                    sortKey="player_name"
                    activeSort={activeSort}
                    onSort={onSort}
                  />
                </th>
                {showTotals && (
                  <th className="th text-right col-kills">
                    <HeaderButton
                      label="Kills"
                      sortKey="Kills"
                      activeSort={activeSort}
                      onSort={onSort}
                    />
                  </th>
                )}
                {hasAverages && (
                  <th className="th text-right col-avg-kills">
                    <HeaderButton
                      label="Avg Kills"
                      sortKey="Avg Kills"
                      activeSort={activeSort}
                      onSort={onSort}
                    />
                  </th>
                )}
                <th className="th text-right col-accuracy">
                  <HeaderButton
                    label="Accuracy"
                    sortKey="Accuracy"
                    activeSort={activeSort}
                    onSort={onSort}
                  />
                </th>
                {showTotals && (
                  <th className="th text-right col-shots-fired">
                    <HeaderButton
                      label="Shots Fired"
                      sortKey="Shots Fired"
                      activeSort={activeSort}
                      onSort={onSort}
                    />
                  </th>
                )}
                {hasAverages && (
                  <th className="th text-right col-avg-shots-fired">
                    <HeaderButton
                      label="Avg Shots Fired"
                      sortKey="Avg Shots Fired"
                      activeSort={activeSort}
                      onSort={onSort}
                    />
                  </th>
                )}
                {showTotals && (
                  <th className="th text-right col-shots-hit">
                    <HeaderButton
                      label="Shots Hit"
                      sortKey="Shots Hit"
                      activeSort={activeSort}
                      onSort={onSort}
                    />
                  </th>
                )}
                {hasAverages && (
                  <th className="th text-right col-avg-shots-hit">
                    <HeaderButton
                      label="Avg Shots Hit"
                      sortKey="Avg Shots Hit"
                      activeSort={activeSort}
                      onSort={onSort}
                    />
                  </th>
                )}
                {showTotals && (
                  <th className="th text-right col-deaths">
                    <HeaderButton
                      label="Deaths"
                      sortKey="Deaths"
                      activeSort={activeSort}
                      onSort={onSort}
                    />
                  </th>
                )}
                {hasAverages && (
                  <th className="th text-right col-avg-deaths">
                    <HeaderButton
                      label="Avg Deaths"
                      sortKey="Avg Deaths"
                      activeSort={activeSort}
                      onSort={onSort}
                    />
                  </th>
                )}
              </tr>
            </thead>
            <tbody>
              {filteredRows.map((row) => (
                <tr key={row.id}>
                  <td className="td text-center col-rank">{row.rank}</td>
                  <td className="td col-player">{row.player_name}</td>
                  {showTotals && (
                    <td className="td text-right col-kills">{row.Kills}</td>
                  )}
                  {hasAverages && (
                    <td className="td text-right col-avg-kills">
                      {typeof row.AvgKills === 'number'
                        ? row.AvgKills.toFixed(1)
                        : ''}
                    </td>
                  )}
                  <td className="td text-right col-accuracy">{row.Accuracy}</td>
                  {showTotals && (
                    <td className="td text-right col-shots-fired">
                      {row.ShotsFired}
                    </td>
                  )}
                  {hasAverages && (
                    <td className="td text-right col-avg-shots-fired">
                      {typeof row.AvgShotsFired === 'number'
                        ? row.AvgShotsFired.toFixed(1)
                        : ''}
                    </td>
                  )}
                  {showTotals && (
                    <td className="td text-right col-shots-hit">
                      {row.ShotsHit}
                    </td>
                  )}
                  {hasAverages && (
                    <td className="td text-right col-avg-shots-hit">
                      {typeof row.AvgShotsHit === 'number'
                        ? row.AvgShotsHit.toFixed(1)
                        : ''}
                    </td>
                  )}
                  {showTotals && (
                    <td className="td text-right col-deaths">{row.Deaths}</td>
                  )}
                  {hasAverages && (
                    <td className="td text-right col-avg-deaths">
                      {typeof row.AvgDeaths === 'number'
                        ? row.AvgDeaths.toFixed(1)
                        : ''}
                    </td>
                  )}
                </tr>
              ))}
              {!filteredRows.length && (
                <tr>
                  <td className="td" colSpan={totalColumns}>
                    No matching players.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}

export default function HelldiversLeaderboard({
  initialMonthData,
  initialYearlyData,
  initialWeekData,
  initialDayData,
}: {
  initialMonthData?: {
    sortBy: SortField;
    sortDir: SortDir;
    limit: number;
    results: LeaderboardRow[];
  };
  initialYearlyData?: {
    sortBy: SortField;
    sortDir: SortDir;
    limit: number;
    results: LeaderboardRow[];
  };
  initialWeekData?: {
    sortBy: SortField;
    sortDir: SortDir;
    limit: number;
    results: LeaderboardRow[];
  };
  initialDayData?: {
    sortBy: SortField;
    sortDir: SortDir;
    limit: number;
    results: LeaderboardRow[];
  };
}) {
  const [monthData, setMonthData] = useState<LeaderboardRow[]>(
    initialMonthData?.results || []
  );
  const [yearlyData, setYearlyData] = useState<LeaderboardRow[]>(
    initialYearlyData?.results || []
  );
  const [weekData, setWeekData] = useState<LeaderboardRow[]>(
    initialWeekData?.results || []
  );
  const [dayData, setDayData] = useState<LeaderboardRow[]>(
    initialDayData?.results || []
  );

  const [monthLoading, setMonthLoading] = useState<boolean>(!initialMonthData);
  const [yearlyLoading, setYearlyLoading] =
    useState<boolean>(!initialYearlyData);
  const [weekLoading, setWeekLoading] = useState<boolean>(!initialWeekData);
  const [dayLoading, setDayLoading] = useState<boolean>(!initialDayData);

  const [monthError, setMonthError] = useState<string | null>(null);
  const [yearlyError, setYearlyError] = useState<string | null>(null);
  const [weekError, setWeekError] = useState<string | null>(null);
  const [dayError, setDayError] = useState<string | null>(null);

  const [monthSortBy, setMonthSortBy] = useState<SortField>(
    initialMonthData?.sortBy || 'Kills'
  );
  const [monthSortDir, setMonthSortDir] = useState<SortDir>(
    initialMonthData?.sortDir || 'desc'
  );
  const [yearlySortBy, setYearlySortBy] = useState<SortField>(
    initialYearlyData?.sortBy || 'Kills'
  );
  const [yearlySortDir, setYearlySortDir] = useState<SortDir>(
    initialYearlyData?.sortDir || 'desc'
  );
  const [weekSortBy, setWeekSortBy] = useState<SortField>(
    initialWeekData?.sortBy || 'Kills'
  );
  const [weekSortDir, setWeekSortDir] = useState<SortDir>(
    initialWeekData?.sortDir || 'desc'
  );
  const [daySortBy, setDaySortBy] = useState<SortField>(
    initialDayData?.sortBy || 'Kills'
  );
  const [daySortDir, setDaySortDir] = useState<SortDir>(
    initialDayData?.sortDir || 'desc'
  );

  const [monthSearch, setMonthSearch] = useState<string>('');
  const [yearlyTotalsSearch, setYearlyTotalsSearch] = useState<string>('');
  const [weekSearch, setWeekSearch] = useState<string>('');
  const [daySearch, setDaySearch] = useState<string>('');

  const toggleMonthSort = (field: SortField) => {
    if (field === monthSortBy) {
      setMonthSortDir((prev) => (prev === 'asc' ? 'desc' : 'asc'));
    } else {
      setMonthSortBy(field);
      setMonthSortDir(
        field === 'player_name' || field === 'clan_name' ? 'asc' : 'desc'
      );
    }
  };

  const toggleYearlySort = (field: SortField) => {
    if (field === yearlySortBy) {
      setYearlySortDir((prev) => (prev === 'asc' ? 'desc' : 'asc'));
    } else {
      setYearlySortBy(field);
      setYearlySortDir(
        field === 'player_name' || field === 'clan_name' ? 'asc' : 'desc'
      );
    }
  };

  const toggleWeekSort = (field: SortField) => {
    if (field === weekSortBy) {
      setWeekSortDir((prev) => (prev === 'asc' ? 'desc' : 'asc'));
    } else {
      setWeekSortBy(field);
      setWeekSortDir(
        field === 'player_name' || field === 'clan_name' ? 'asc' : 'desc'
      );
    }
  };

  const toggleDaySort = (field: SortField) => {
    if (field === daySortBy) {
      setDaySortDir((prev) => (prev === 'asc' ? 'desc' : 'asc'));
    } else {
      setDaySortBy(field);
      setDaySortDir(
        field === 'player_name' || field === 'clan_name' ? 'asc' : 'desc'
      );
    }
  };

  useEffect(() => {
    let isCancelled = false;
    async function fetchMonth() {
      setMonthLoading(true);
      setMonthError(null);
      try {
        const now = new Date();
        const params = new URLSearchParams({
          sortBy: monthSortBy,
          sortDir: monthSortDir,
          limit: '100',
          scope: 'month',
          month: String(now.getUTCMonth() + 1),
          year: String(now.getUTCFullYear()),
        });
        const res = await fetch(
          `/api/helldivers/leaderboard?${params.toString()}`,
          { cache: 'no-store' }
        );
        if (!res.ok) throw new Error(`Request failed: ${res.status}`);
        const payload = await res.json();
        if (!isCancelled) setMonthData(payload.results || []);
      } catch (e: any) {
        if (!isCancelled)
          setMonthError(e?.message || 'Failed to load leaderboard');
      } finally {
        if (!isCancelled) setMonthLoading(false);
      }
    }
    fetchMonth();
    return () => {
      isCancelled = true;
    };
  }, [monthSortBy, monthSortDir]);

  useEffect(() => {
    let isCancelled = false;
    async function fetchWeek() {
      setWeekLoading(true);
      setWeekError(null);
      try {
        const params = new URLSearchParams({
          sortBy: weekSortBy,
          sortDir: weekSortDir,
          limit: '100',
          scope: 'week',
        });
        const res = await fetch(
          `/api/helldivers/leaderboard?${params.toString()}`,
          { cache: 'no-store' }
        );
        if (!res.ok) throw new Error(`Request failed: ${res.status}`);
        const payload = await res.json();
        if (!isCancelled) setWeekData(payload.results || []);
      } catch (e: any) {
        if (!isCancelled)
          setWeekError(e?.message || 'Failed to load leaderboard');
      } finally {
        if (!isCancelled) setWeekLoading(false);
      }
    }
    fetchWeek();
    return () => {
      isCancelled = true;
    };
  }, [weekSortBy, weekSortDir]);

  useEffect(() => {
    let isCancelled = false;
    async function fetchDay() {
      setDayLoading(true);
      setDayError(null);
      try {
        const params = new URLSearchParams({
          sortBy: daySortBy,
          sortDir: daySortDir,
          limit: '100',
          scope: 'day',
        });
        const res = await fetch(
          `/api/helldivers/leaderboard?${params.toString()}`,
          { cache: 'no-store' }
        );
        if (!res.ok) throw new Error(`Request failed: ${res.status}`);
        const payload = await res.json();
        if (!isCancelled) setDayData(payload.results || []);
      } catch (e: any) {
        if (!isCancelled)
          setDayError(e?.message || 'Failed to load leaderboard');
      } finally {
        if (!isCancelled) setDayLoading(false);
      }
    }
    fetchDay();
    return () => {
      isCancelled = true;
    };
  }, [daySortBy, daySortDir]);

  useEffect(() => {
    let isCancelled = false;
    async function fetchYearly() {
      setYearlyLoading(true);
      setYearlyError(null);
      try {
        const params = new URLSearchParams({
          sortBy: yearlySortBy,
          sortDir: yearlySortDir,
          limit: '1000',
          scope: 'lifetime',
          year: '2025',
        });
        const res = await fetch(
          `/api/helldivers/leaderboard?${params.toString()}`,
          { cache: 'no-store' }
        );
        if (!res.ok) throw new Error(`Request failed: ${res.status}`);
        const payload = await res.json();
        if (!isCancelled) setYearlyData(payload.results || []);
      } catch (e: any) {
        if (!isCancelled)
          setYearlyError(e?.message || 'Failed to load leaderboard');
      } finally {
        if (!isCancelled) setYearlyLoading(false);
      }
    }
    fetchYearly();
    return () => {
      isCancelled = true;
    };
  }, [yearlySortBy, yearlySortDir]);

  const monthActiveSort = useMemo(
    () => ({ sortBy: monthSortBy, sortDir: monthSortDir }),
    [monthSortBy, monthSortDir]
  );
  const yearActiveSort = useMemo(
    () => ({ sortBy: yearlySortBy, sortDir: yearlySortDir }),
    [yearlySortBy, yearlySortDir]
  );
  const weekActiveSort = useMemo(
    () => ({ sortBy: weekSortBy, sortDir: weekSortDir }),
    [weekSortBy, weekSortDir]
  );
  const dayActiveSort = useMemo(
    () => ({ sortBy: daySortBy, sortDir: daySortDir }),
    [daySortBy, daySortDir]
  );

  const [activeTab, setActiveTab] = useState<
    'daily' | 'weekly' | 'monthly' | 'yearly'
  >('daily');

  useEffect(() => {
    const setTabFromHash = () => {
      const hash = window.location.hash.replace('#', '');
      if (
        hash === 'daily' ||
        hash === 'weekly' ||
        hash === 'monthly' ||
        hash === 'yearly'
      ) {
        setActiveTab(hash as typeof activeTab);
      }
    };

    setTabFromHash();
    window.addEventListener('hashchange', setTabFromHash);
    return () => window.removeEventListener('hashchange', setTabFromHash);
  }, []);
  useEffect(() => {
    window.location.hash = activeTab;
  }, [activeTab]);
  const now = new Date();
  const yearlyTitle = 'Yearly Leaderboard - 2025';
  const monthTitle = `Monthly Leaderboard - ${now.toLocaleString('default', {
    month: 'long',
  })} ${now.getUTCFullYear()}`;
  const dayTitle = `Daily Leaderboard - ${now.toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  })}`;
  const weekTitle = `Weekly Leaderboard - Week ${getWeekNumber(now)} of ${now.getUTCFullYear()}`;

  return (
    <div>
      <div style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
        <button
          className="btn btn-secondary"
          onClick={() => setActiveTab('daily')}
          aria-pressed={activeTab === 'daily'}
        >
          Daily
        </button>
        <button
          className="btn btn-secondary"
          onClick={() => setActiveTab('weekly')}
          aria-pressed={activeTab === 'weekly'}
        >
          Weekly
        </button>
        <button
          className="btn btn-secondary"
          onClick={() => setActiveTab('monthly')}
          aria-pressed={activeTab === 'monthly'}
        >
          Monthly
        </button>
        <button
          className="btn btn-secondary"
          onClick={() => setActiveTab('yearly')}
          aria-pressed={activeTab === 'yearly'}
        >
          Yearly
        </button>
      </div>

      {activeTab === 'daily' && (
        <LeaderboardTableSection
          title={dayTitle}
          rows={dayData}
          loading={dayLoading}
          error={dayError}
          activeSort={dayActiveSort}
          onSort={toggleDaySort}
          showAverages={false}
          showTotals={true}
          searchTerm={daySearch}
          onSearch={setDaySearch}
          sectionId="daily"
        />
      )}

      {activeTab === 'weekly' && (
        <LeaderboardTableSection
          title={weekTitle}
          rows={weekData}
          loading={weekLoading}
          error={weekError}
          activeSort={weekActiveSort}
          onSort={toggleWeekSort}
          showAverages={false}
          showTotals={true}
          searchTerm={weekSearch}
          onSearch={setWeekSearch}
          sectionId="weekly"
        />
      )}

      {activeTab === 'monthly' && (
        <LeaderboardTableSection
          title={monthTitle}
          rows={monthData}
          loading={monthLoading}
          error={monthError}
          activeSort={monthActiveSort}
          onSort={toggleMonthSort}
          showAverages={false}
          showTotals={true}
          searchTerm={monthSearch}
          onSearch={setMonthSearch}
          sectionId="monthly"
        />
      )}

      {activeTab === 'yearly' && (
        <LeaderboardTableSection
          title={yearlyTitle}
          rows={yearlyData}
          loading={yearlyLoading}
          error={yearlyError}
          activeSort={yearActiveSort}
          onSort={toggleYearlySort}
          showAverages={false}
          showTotals={true}
          searchTerm={yearlyTotalsSearch}
          onSearch={setYearlyTotalsSearch}
          sectionId="yearly"
        />
      )}
    </div>
  );
}
