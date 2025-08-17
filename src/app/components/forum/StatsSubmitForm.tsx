// src/app/components/forum/StatsSubmitForm.tsx
'use client';

import { useEffect, useState } from 'react';

interface LeaderboardRow {
  rank: number;
  player_name: string;
}

export default function StatsSubmitForm() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [userName, setUserName] = useState<string | null>(null);

  const [soloRank, setSoloRank] = useState<number | null>(null);
  const [monthRank, setMonthRank] = useState<number | null>(null);
  const [lifetimeRank, setLifetimeRank] = useState<number | null>(null);
  const [averageRank, setAverageRank] = useState<number | null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        setLoading(true);
        setError(null);
        const meRes = await fetch('/api/users/me', { cache: 'no-store' });
        if (!meRes.ok) throw new Error('Failed to load user');
        const me = await meRes.json();
        if (cancelled) return;
        const name = me?.name || null;
        setUserName(name);
        if (!name) {
          setLoading(false);
          return;
        }

        const now = new Date();
        const qsSolo = new URLSearchParams({
          scope: 'solo',
          sortBy: 'Kills',
          sortDir: 'desc',
          limit: '1000',
        }).toString();
        const qsMonth = new URLSearchParams({
          scope: 'month',
          sortBy: 'Kills',
          sortDir: 'desc',
          limit: '1000',
          month: String(now.getUTCMonth() + 1),
          year: String(now.getUTCFullYear()),
        }).toString();
        const qsLifetime = new URLSearchParams({
          scope: 'lifetime',
          sortBy: 'Kills',
          sortDir: 'desc',
          limit: '1000',
        }).toString();
        const qsAvg = new URLSearchParams({
          scope: 'lifetime',
          sortBy: 'Avg Kills',
          sortDir: 'desc',
          limit: '1000',
        }).toString();

        const [soloRes, monthRes, lifetimeRes, avgRes] = await Promise.all([
          fetch(`/api/helldivers/leaderboard?${qsSolo}`, { cache: 'no-store' }),
          fetch(`/api/helldivers/leaderboard?${qsMonth}`, {
            cache: 'no-store',
          }),
          fetch(`/api/helldivers/leaderboard?${qsLifetime}`, {
            cache: 'no-store',
          }),
          fetch(`/api/helldivers/leaderboard?${qsAvg}`, { cache: 'no-store' }),
        ]);

        const [soloJson, monthJson, lifetimeJson, avgJson] = await Promise.all([
          soloRes.ok ? soloRes.json() : Promise.resolve({ results: [] }),
          monthRes.ok ? monthRes.json() : Promise.resolve({ results: [] }),
          lifetimeRes.ok
            ? lifetimeRes.json()
            : Promise.resolve({ results: [] }),
          avgRes.ok ? avgRes.json() : Promise.resolve({ results: [] }),
        ]);

        if (cancelled) return;
        const findRank = (rows: LeaderboardRow[], name: string) => {
          const idx = (rows || []).findIndex(
            (r) => (r.player_name || '').toLowerCase() === name.toLowerCase()
          );
          return idx >= 0 ? rows[idx].rank || idx + 1 : null;
        };

        setSoloRank(findRank(soloJson.results || [], name));
        setMonthRank(findRank(monthJson.results || [], name));
        setLifetimeRank(findRank(lifetimeJson.results || [], name));
        setAverageRank(findRank(avgJson.results || [], name));
      } catch (e: any) {
        if (!cancelled) setError(e?.message || 'Failed to load rankings');
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <form className="card form-grid">
      <div>
        <h3 style={{ marginBottom: 8 }}>Your Rankings</h3>
        {loading ? (
          <p className="muted">Loading…</p>
        ) : error ? (
          <p className="muted">{error}</p>
        ) : !userName ? (
          <p className="muted">
            Set your profile name to see your leaderboard rankings.
          </p>
        ) : (
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: '0.75rem',
            }}
          >
            <div className="field">
              <span className="label">Solo</span>
              <div>{soloRank ?? '—'}</div>
            </div>
            <div className="field">
              <span className="label">Monthly</span>
              <div>{monthRank ?? '—'}</div>
            </div>
            <div className="field">
              <span className="label">Lifetime</span>
              <div>{lifetimeRank ?? '—'}</div>
            </div>
            <div className="field">
              <span className="label">Average (Avg Kills)</span>
              <div>{averageRank ?? '—'}</div>
            </div>
          </div>
        )}
      </div>
    </form>
  );
}
