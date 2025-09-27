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

interface LeaderboardPayload {
  day?: { results: LeaderboardRow[]; error?: number };
  week?: { results: LeaderboardRow[]; error?: number };
  month?: { results: LeaderboardRow[]; error?: number };
  lifetime?: { results: LeaderboardRow[]; error?: number };
  solo?: { results: LeaderboardRow[]; error?: number };
  squad?: { results: LeaderboardRow[]; error?: number };
}

const sortFieldMap: Record<SortField, keyof LeaderboardRow> = {
  Kills: 'Kills',
  Accuracy: 'Accuracy',
  'Shots Fired': 'ShotsFired',
  'Shots Hit': 'ShotsHit',
  Deaths: 'Deaths',
  player_name: 'player_name',
  clan_name: 'clan_name',
  submitted_at: 'submitted_at',
  'Avg Kills': 'AvgKills',
  'Avg Shots Fired': 'AvgShotsFired',
  'Avg Shots Hit': 'AvgShotsHit',
  'Avg Deaths': 'AvgDeaths',
};

function sortRows(
  rows: LeaderboardRow[],
  sortBy: SortField,
  sortDir: SortDir
): LeaderboardRow[] {
  const key = sortFieldMap[sortBy];
  const sorted = [...rows].sort((a, b) => {
    const aVal: any = (a as any)[key];
    const bVal: any = (b as any)[key];
    const toNum = (v: any) => {
      if (typeof v === 'number') return v;
      const n = parseFloat(String(v).replace('%', ''));
      return isNaN(n) ? null : n;
    };
    const aNum = toNum(aVal);
    const bNum = toNum(bVal);
    if (aNum !== null && bNum !== null) {
      return aNum - bNum;
    }
    return String(aVal ?? '').localeCompare(String(bVal ?? ''));
  });
  return sortDir === 'asc' ? sorted : sorted.reverse();
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
  tabsNode,
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
  tabsNode?: React.ReactNode;
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
      {tabsNode}
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
  initialData,
}: {
  initialData: LeaderboardPayload;
}) {
  const [sortBy, setSortBy] = useState<SortField>('Kills');
  const [sortDir, setSortDir] = useState<SortDir>('desc');

  const monthData = useMemo(
    () => sortRows(initialData.month?.results || [], sortBy, sortDir),
    [initialData, sortBy, sortDir]
  );
  const weekData = useMemo(
    () => sortRows(initialData.week?.results || [], sortBy, sortDir),
    [initialData, sortBy, sortDir]
  );
  const dayData = useMemo(
    () => sortRows(initialData.day?.results || [], sortBy, sortDir),
    [initialData, sortBy, sortDir]
  );
  const yearlyData = useMemo(
    () => sortRows(initialData.lifetime?.results || [], sortBy, sortDir),
    [initialData, sortBy, sortDir]
  );
  const soloData = useMemo(
    () => sortRows(initialData.solo?.results || [], sortBy, sortDir),
    [initialData, sortBy, sortDir]
  );
  const squadData = useMemo(
    () => sortRows(initialData.squad?.results || [], sortBy, sortDir),
    [initialData, sortBy, sortDir]
  );

  const monthError = initialData.month?.error
    ? `Request failed: ${initialData.month.error}`
    : null;
  const weekError = initialData.week?.error
    ? `Request failed: ${initialData.week.error}`
    : null;
  const dayError = initialData.day?.error
    ? `Request failed: ${initialData.day.error}`
    : null;
  const yearlyError = initialData.lifetime?.error
    ? `Request failed: ${initialData.lifetime.error}`
    : null;
  const soloError = initialData.solo?.error
    ? `Request failed: ${initialData.solo.error}`
    : null;
  const squadError = initialData.squad?.error
    ? `Request failed: ${initialData.squad.error}`
    : null;

  const isLoading = false;

  const [monthSearch, setMonthSearch] = useState<string>('');
  const [yearlyTotalsSearch, setYearlyTotalsSearch] = useState<string>('');
  const [weekSearch, setWeekSearch] = useState<string>('');
  const [daySearch, setDaySearch] = useState<string>('');
  const [soloSearch, setSoloSearch] = useState<string>('');
  const [squadSearch, setSquadSearch] = useState<string>('');

  const toggleSort = (field: SortField) => {
    if (field === sortBy) {
      setSortDir((prev) => (prev === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortBy(field);
      setSortDir(
        field === 'player_name' || field === 'clan_name' ? 'asc' : 'desc'
      );
    }
  };

  const activeSort = { sortBy, sortDir };

  const [activeTab, setActiveTab] = useState<
    'daily' | 'weekly' | 'monthly' | 'yearly' | 'solo' | 'squad'
  >('daily');

  useEffect(() => {
    const setTabFromHash = () => {
      const hash = window.location.hash.replace('#', '');
      if (
        hash === 'daily' ||
        hash === 'weekly' ||
        hash === 'monthly' ||
        hash === 'yearly' ||
        hash === 'solo' ||
        hash === 'squad'
      ) {
        setActiveTab(hash as typeof activeTab);
      }
    };
    setTabFromHash();
    window.addEventListener('hashchange', setTabFromHash);
    return () => window.removeEventListener('hashchange', setTabFromHash);
  }, []);
  useEffect(() => {
    const hash = `#${activeTab}`;
    if (window.location.hash !== hash) {
      window.history.replaceState(null, '', hash);
    }
  }, [activeTab]);

  const now = new Date();
  const yearlyTitle = 'Yearly Leaderboard - 2025';
  const monthTitle = `Monthly Leaderboard - ${now.toLocaleString('default', { month: 'long' })} ${now.getUTCFullYear()}`;
  const dayTitle = `Daily Leaderboard - ${now.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}`;
  const weekTitle = `Weekly Leaderboard - Week ${getWeekNumber(now)} of ${now.getUTCFullYear()}`;
  const soloTitle = 'Solo Leaderboard';
  const squadTitle = 'Squad Leaderboard';

  return (
    <div>
      {(() => {
        const tabs = (
          <div style={{ display: 'flex', gap: 8, marginBottom: 16, flexWrap: 'wrap' }}>
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
            <button
              className="btn btn-secondary"
              onClick={() => setActiveTab('solo')}
              aria-pressed={activeTab === 'solo'}
            >
              Solo
            </button>
            <button
              className="btn btn-secondary"
              onClick={() => setActiveTab('squad')}
              aria-pressed={activeTab === 'squad'}
            >
              Squad
            </button>
          </div>
        );
        return (
          <>
            {activeTab === 'daily' && (
              <LeaderboardTableSection
                title={dayTitle}
                rows={dayData}
                loading={isLoading}
                error={dayError}
                activeSort={activeSort}
                onSort={toggleSort}
                showAverages={false}
                showTotals={true}
                searchTerm={daySearch}
                onSearch={setDaySearch}
                sectionId="daily"
                tabsNode={tabs}
              />
            )}

            {activeTab === 'weekly' && (
              <LeaderboardTableSection
                title={weekTitle}
                rows={weekData}
                loading={isLoading}
                error={weekError}
                activeSort={activeSort}
                onSort={toggleSort}
                showAverages={false}
                showTotals={true}
                searchTerm={weekSearch}
                onSearch={setWeekSearch}
                sectionId="weekly"
                tabsNode={tabs}
              />
            )}

            {activeTab === 'monthly' && (
              <LeaderboardTableSection
                title={monthTitle}
                rows={monthData}
                loading={isLoading}
                error={monthError}
                activeSort={activeSort}
                onSort={toggleSort}
                showAverages={false}
                showTotals={true}
                searchTerm={monthSearch}
                onSearch={setMonthSearch}
                sectionId="monthly"
                tabsNode={tabs}
              />
            )}

            {activeTab === 'yearly' && (
              <LeaderboardTableSection
                title={yearlyTitle}
                rows={yearlyData}
                loading={isLoading}
                error={yearlyError}
                activeSort={activeSort}
                onSort={toggleSort}
                showAverages={false}
                showTotals={true}
                searchTerm={yearlyTotalsSearch}
                onSearch={setYearlyTotalsSearch}
                sectionId="yearly"
                tabsNode={tabs}
              />
            )}

            {activeTab === 'solo' && (
              <LeaderboardTableSection
                title={soloTitle}
                rows={soloData}
                loading={isLoading}
                error={soloError}
                activeSort={activeSort}
                onSort={toggleSort}
                showAverages={false}
                showTotals={true}
                searchTerm={soloSearch}
                onSearch={setSoloSearch}
                sectionId="solo"
                tabsNode={tabs}
              />
            )}

            {activeTab === 'squad' && (
              <LeaderboardTableSection
                title={squadTitle}
                rows={squadData}
                loading={isLoading}
                error={squadError}
                activeSort={activeSort}
                onSort={toggleSort}
                showAverages={false}
                showTotals={true}
                searchTerm={squadSearch}
                onSearch={setSquadSearch}
                sectionId="squad"
                tabsNode={tabs}
              />
            )}
          </>
        );
      })()}
    </div>
  );
}
