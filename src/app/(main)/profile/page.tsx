'use client';
/* eslint-disable @next/next/no-img-element */

import {
  useEffect,
  useMemo,
  useRef,
  useState,
  type CSSProperties,
} from 'react';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import useSWR from 'swr';
import { FaTwitch } from 'react-icons/fa';
import styles from '../helldivers-2/HelldiversBase.module.css';

const overlayStyle: CSSProperties = {
  position: 'fixed',
  inset: 0,
  backgroundColor: 'rgba(16, 20, 31, 0.35)',
  zIndex: -1,
};

// Challenge names (levels 1-7) as in Challenges menu
const CHALLENGE_LEVEL_LABELS: string[] = [
  'Sabotage Proficiency',
  'Resource Denial',
  'ICBM Control',
  'Flawless ICBM',
  'Perfect Survey',
  'Eagle Ace',
  'The Purist',
];

const CAMPAIGN_MISSION_LABELS: string[] = [
  'Terminid Spawn Camp',
  'Automaton Hell Strike',
  'Lethal Pacifist',
  'Total Area Scorching',
];

export default function ProfilePage() {
  const { data: session, status } = useSession();
  const [userData, setUserData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const savedRankingOnce = useRef(false);

  const fetcher = (url: string) => fetch(url).then((r) => r.json());
  const now = new Date();
  const qsBatch = new URLSearchParams({
    scopes: 'solo,month,lifetime',
    sortBy: 'Kills',
    sortDir: 'desc',
    limit: '1000',
    month: String(now.getUTCMonth() + 1),
    year: String(now.getUTCFullYear()),
  }).toString();
  const { data: batchData } = useSWR(
    `/api/helldivers/leaderboard/batch?${qsBatch}`,
    fetcher
  );
  const soloData = batchData?.solo;
  const monthData = batchData?.month;
  const lifetimeData = batchData?.lifetime;

  const [syncingRoles, setSyncingRoles] = useState(false);
  const [syncRolesError, setSyncRolesError] = useState<string | null>(null);
  const [syncRolesMessage, setSyncRolesMessage] = useState<string | null>(null);

  useEffect(() => {
    if (status === 'authenticated') {
      (async () => {
        setLoading(true);
        const [resMe, resLast] = await Promise.all([
          fetch('/api/users/me'),
          fetch('/api/users/profile/last'),
        ]);
        const data = await resMe.json();
        const last = resLast.ok ? await resLast.json() : { last_profile: null };
        const lastProfile = last?.last_profile || null;
        setUserData({ ...data, lastProfile });
        setLoading(false);
      })();
    }
  }, [status]);

  const allSevenComplete = useMemo(() => {
    const submissions = userData?.challengeSubmissions || [];
    let count = 0;
    for (let lvl = 1; lvl <= 7; lvl++) {
      const s = submissions.find((x: any) => x.level === lvl);
      if (s && (s.youtubeUrl || s.witnessName || s.witnessDiscordId)) count++;
    }
    return count === 7;
  }, [userData]);

  const handleSyncRoles = async () => {
    setSyncRolesError(null);
    setSyncRolesMessage(null);
    setSyncingRoles(true);
    try {
      const res = await fetch('/api/discord/roles');
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || 'Failed to fetch roles');
      if (!data.isMember) {
        throw new Error('Join the Discord server and link your account.');
      }
      const roles = Array.isArray(data.roles) ? data.roles : [];
      await fetch('/api/users/me', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ discordRoles: roles }),
      });
      setUserData((prev: any) => ({ ...prev, discordRoles: roles }));
      setSyncRolesMessage('Roles synced');
    } catch (e) {
      setSyncRolesError(
        e instanceof Error ? e.message : 'Failed to sync roles'
      );
    } finally {
      setSyncingRoles(false);
    }
  };

  const [infoTab, setInfoTab] = useState<
    'roles' | 'awards' | 'squad' | 'rankings' | 'activity' | 'linked' | 'merit'
  >('roles');

  const findRankAndRow = (rows: any[], name: string) => {
    const idx = (rows || []).findIndex(
      (r) => (r.player_name || '').toLowerCase() === name.toLowerCase()
    );
    return idx >= 0
      ? { rank: rows[idx].rank || idx + 1, row: rows[idx] }
      : { rank: null, row: null };
  };

  const computeGrade = (): string | null => {
    if (!userData?.name) return null;
    const total = findRankAndRow(
      lifetimeData?.results || [],
      userData.name
    ).row;
    const month = findRankAndRow(monthData?.results || [], userData.name).row;
    const solo = findRankAndRow(soloData?.results || [], userData.name).row;
    const row = total || month || solo;
    if (!row) return null;
    const accuracyRaw = row.Accuracy as string | undefined;
    const accuracyNum = accuracyRaw
      ? parseFloat(accuracyRaw.replace('%', ''))
      : Number.NaN;
    if (Number.isFinite(accuracyNum)) {
      if (accuracyNum >= 75) return 'S';
      if (accuracyNum >= 65) return 'A';
      if (accuracyNum >= 50) return 'B';
      if (accuracyNum >= 35) return 'C';
      return 'D';
    }
    return null;
  };

  // Unit helpers and derived display values; prefer lastProfile snapshot when available
  const preferredHeightUnit: 'cm' | 'in' =
    userData?.lastProfile?.preferredHeightUnit === 'in'
      ? 'in'
      : userData?.preferredHeightUnit === 'in'
        ? 'in'
        : 'cm';
  const preferredWeightUnit: 'kg' | 'lb' =
    userData?.lastProfile?.preferredWeightUnit === 'lb'
      ? 'lb'
      : userData?.preferredWeightUnit === 'lb'
        ? 'lb'
        : 'kg';
  const heightLabel = `Height (${preferredHeightUnit})`;
  const weightLabel = `Weight (${preferredWeightUnit})`;
  const heightDisplay = (() => {
    const cmVal =
      userData?.lastProfile?.characterHeightCm ?? userData?.characterHeightCm;
    if (cmVal == null) return '—';
    if (preferredHeightUnit === 'cm') return cmVal;
    const inches = Math.round(Number(cmVal) / 2.54);
    return inches;
  })();
  const weightDisplay = (() => {
    const kgVal =
      userData?.lastProfile?.characterWeightKg ?? userData?.characterWeightKg;
    if (kgVal == null) return '—';
    if (preferredWeightUnit === 'kg') return kgVal;
    const lbs = Math.round(Number(kgVal) * 2.2046226218);
    return lbs;
  })();

  // Save current rankings into User_Profiles once per visit
  useEffect(() => {
    const name = userData?.name;
    if (!name || savedRankingOnce.current) return;
    const solo = findRankAndRow(soloData?.results || [], name);
    const month = findRankAndRow(monthData?.results || [], name);
    const total = findRankAndRow(lifetimeData?.results || [], name);
    const entries = [
      { scope: 'solo', rank: solo.rank, stats: solo.row },
      { scope: 'month', rank: month.rank, stats: month.row },
      { scope: 'lifetime', rank: total.rank, stats: total.row },
    ].filter((e) => e.rank != null && e.stats);

    if (entries.length > 0) {
      savedRankingOnce.current = true;
      fetch('/api/users/profile/ranking', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ entries }),
      }).catch(() => {});
    }
  }, [userData?.name, soloData, monthData, lifetimeData]);

  if (status === 'loading' || loading) {
    return <div className={styles.pageContainer}>Loading profile…</div>;
  }
  if (!session) {
    return (
      <div className={styles.pageContainer}>
        <p>
          Please <a href="/auth">sign in</a> to view your profile.
        </p>
      </div>
    );
  }

  return (
    <div className={styles.wrapper}>
      {/* Background Video and Overlay */}
      <div style={overlayStyle} />
      <div className={styles.dividerLayer} />
      <div className={styles.pageContainer}>
        {/* Welcome title removed per requirements */}

        <section className="content-section">
          <h2 className="content-section-title with-border-bottom">
            Character Overview
          </h2>
          <div className="avatar-row">
            <div className="avatar-col">
              <div className="avatar">
                <img
                  src={
                    userData?.customAvatarDataUrl ||
                    userData?.image ||
                    '/images/avatar-default.png'
                  }
                  alt="Avatar"
                  loading="lazy"
                />
              </div>
            </div>
            <div className="avatar-fields">
              <div className="field field-sm">
                <strong className="label" style={{ color: '#f59e0b' }}>
                  Name
                </strong>
                <span
                  style={{
                    color: '#cbd5e1',
                    background: 'rgba(148,163,184,0.12)',
                    padding: '2px 8px',
                    borderRadius: 6,
                    width: '100%',
                  }}
                >
                  {[
                    userData?.lastProfile?.firstName,
                    userData?.lastProfile?.middleName,
                    userData?.lastProfile?.lastName,
                  ]
                    .filter(Boolean)
                    .join(' ') ||
                    [
                      userData?.firstName,
                      userData?.middleName,
                      userData?.lastName,
                    ]
                      .filter(Boolean)
                      .join(' ') ||
                    '—'}
                </span>
              </div>
              <div className="field field-sm">
                <strong className="label" style={{ color: '#f59e0b' }}>
                  {heightLabel}
                </strong>
                <span
                  style={{
                    color: '#cbd5e1',
                    background: 'rgba(148,163,184,0.12)',
                    padding: '2px 8px',
                    borderRadius: 6,
                    width: '100%',
                  }}
                >
                  {heightDisplay}
                </span>
              </div>
              <div className="field field-sm">
                <strong className="label" style={{ color: '#f59e0b' }}>
                  {weightLabel}
                </strong>
                <span
                  style={{
                    color: '#cbd5e1',
                    background: 'rgba(148,163,184,0.12)',
                    padding: '2px 8px',
                    borderRadius: 6,
                    width: '100%',
                  }}
                >
                  {weightDisplay}
                </span>
              </div>
              <div className="field field-sm">
                <strong className="label" style={{ color: '#f59e0b' }}>
                  Homeplanet
                </strong>
                <span
                  style={{
                    color: '#cbd5e1',
                    background: 'rgba(148,163,184,0.12)',
                    padding: '2px 8px',
                    borderRadius: 6,
                    width: '100%',
                  }}
                >
                  {userData?.homeplanet ?? '—'}
                </span>
              </div>
              <div className="field field-sm">
                <strong className="label" style={{ color: '#f59e0b' }}>
                  Callsign
                </strong>
                <span
                  style={{
                    color: '#cbd5e1',
                    background: 'rgba(148,163,184,0.12)',
                    padding: '2px 8px',
                    borderRadius: 6,
                    width: '100%',
                  }}
                >
                  {userData?.callsign ?? '—'}
                </span>
              </div>
              <div className="field field-sm">
                <strong className="label" style={{ color: '#f59e0b' }}>
                  Rank
                </strong>
                <span
                  style={{
                    color: '#cbd5e1',
                    background: 'rgba(148,163,184,0.12)',
                    padding: '2px 8px',
                    borderRadius: 6,
                    width: '100%',
                  }}
                >
                  {userData?.rankTitle ?? '—'}
                </span>
              </div>
              <div className="field field-sm">
                <strong className="label" style={{ color: '#f59e0b' }}>
                  Favorite Weapon
                </strong>
                <span
                  style={{
                    color: '#cbd5e1',
                    background: 'rgba(148,163,184,0.12)',
                    padding: '2px 8px',
                    borderRadius: 6,
                    width: '100%',
                  }}
                >
                  {userData?.favoriteWeapon ?? '—'}
                </span>
              </div>
              <div className="field field-sm">
                <strong className="label" style={{ color: '#f59e0b' }}>
                  Armor
                </strong>
                <span
                  style={{
                    color: '#cbd5e1',
                    background: 'rgba(148,163,184,0.12)',
                    padding: '2px 8px',
                    borderRadius: 6,
                    width: '100%',
                  }}
                >
                  {userData?.armor ?? '—'}
                </span>
              </div>
              <div className="field field-sm">
                <strong className="label" style={{ color: '#f59e0b' }}>
                  Motto
                </strong>
                <span
                  style={{
                    color: '#cbd5e1',
                    background: 'rgba(148,163,184,0.12)',
                    padding: '2px 8px',
                    borderRadius: 6,
                    width: '100%',
                  }}
                >
                  {userData?.motto ?? '—'}
                </span>
              </div>
              <div className="field field-sm">
                <strong className="label" style={{ color: '#f59e0b' }}>
                  Favored Enemy
                </strong>
                <span
                  style={{
                    color: '#cbd5e1',
                    background: 'rgba(148,163,184,0.12)',
                    padding: '2px 8px',
                    borderRadius: 6,
                    width: '100%',
                  }}
                >
                  {userData?.favoredEnemy ?? '—'}
                </span>
              </div>
              <div style={{ gridColumn: '1 / -1', marginTop: 8 }}>
                <strong className="label" style={{ color: '#f59e0b' }}>
                  Background
                </strong>
                <div
                  style={{
                    color: '#cbd5e1',
                    background: 'rgba(148,163,184,0.12)',
                    padding: '2px 8px',
                    borderRadius: 6,
                    marginTop: 6,
                  }}
                  className="text-paragraph"
                >
                  {userData?.background || '—'}
                </div>
              </div>
            </div>
          </div>
          <div
            style={{ display: 'flex', justifyContent: 'center', marginTop: 16 }}
          >
            <Link
              href="/settings"
              className="btn btn-primary"
              style={{ textDecoration: 'none' }}
            >
              Settings
            </Link>
          </div>
        </section>

        <section className="content-section">
          <div style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
            <button
              className="btn btn-secondary"
              onClick={() => setInfoTab('roles')}
              aria-pressed={infoTab === 'roles'}
            >
              Roles
            </button>
            <button
              className="btn btn-secondary"
              onClick={() => setInfoTab('awards')}
              aria-pressed={infoTab === 'awards'}
            >
              Awards
            </button>
            <button
              className="btn btn-secondary"
              onClick={() => setInfoTab('squad')}
              aria-pressed={infoTab === 'squad'}
            >
              Squad
            </button>
            <button
              className="btn btn-secondary"
              onClick={() => setInfoTab('rankings')}
              aria-pressed={infoTab === 'rankings'}
            >
              Rankings
            </button>
            <button
              className="btn btn-secondary"
              onClick={() => setInfoTab('activity')}
              aria-pressed={infoTab === 'activity'}
            >
              Activity
            </button>
            <button
              className="btn btn-secondary"
              onClick={() => setInfoTab('merit')}
              aria-pressed={infoTab === 'merit'}
            >
              Merit
            </button>
            <button
              className="btn btn-secondary"
              onClick={() => setInfoTab('linked')}
              aria-pressed={infoTab === 'linked'}
            >
              Linked
            </button>
          </div>

          {infoTab === 'roles' && (
            <div className="roles">
              <button
                className="btn btn-primary"
                onClick={handleSyncRoles}
                disabled={syncingRoles}
                style={{ marginBottom: 12 }}
              >
                {syncingRoles ? 'Syncing…' : 'Sync Discord Roles'}
              </button>
              {syncRolesError && (
                <p className="text-paragraph" style={{ color: '#f87171' }}>
                  {syncRolesError}
                </p>
              )}
              {syncRolesMessage && (
                <p className="text-paragraph" style={{ color: '#4ade80' }}>
                  {syncRolesMessage}
                </p>
              )}
              {Array.isArray(userData?.discordRoles) &&
              userData.discordRoles.length > 0 ? (
                <div className="role-chips">
                  {userData.discordRoles.map((r: any) => (
                    <span key={r.id} className="chip">
                      {r.name}
                    </span>
                  ))}
                </div>
              ) : (
                <p className="text-paragraph">
                  No Discord roles detected. Link your Discord and join the
                  server to see roles.
                </p>
              )}
            </div>
          )}

          {infoTab === 'awards' && (
            <div>
              {allSevenComplete ? (
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                  <span
                    className="inline-code"
                    title="All 7 challenges submitted"
                  >
                    All 7 Challenges Complete ⭐
                  </span>
                </div>
              ) : (
                <p className="text-paragraph">No awards yet.</p>
              )}
            </div>
          )}

          {infoTab === 'squad' && (
            <p className="text-paragraph">Coming soon.</p>
          )}

          {infoTab === 'rankings' && (
            <div>
              {userData?.name ? (
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12 }}>
                  <span className="inline-code">
                    Solo:{' '}
                    {findRankAndRow(soloData?.results || [], userData.name)
                      .rank ?? '—'}
                  </span>
                  <span className="inline-code">
                    Monthly:{' '}
                    {findRankAndRow(monthData?.results || [], userData.name)
                      .rank ?? '—'}
                  </span>
                  <span className="inline-code">
                    Yearly:{' '}
                    {findRankAndRow(lifetimeData?.results || [], userData.name)
                      .rank ?? '—'}
                  </span>
                  <span className="inline-code">
                    Grade: {computeGrade() ?? '—'}
                  </span>
                  <span className="inline-code">
                    Clearance: {userData?.rankTitle ?? '—'}
                  </span>
                </div>
              ) : (
                <p className="text-paragraph">
                  Set your profile name to see your leaderboard rankings.
                </p>
              )}
            </div>
          )}

          {infoTab === 'activity' && (
            <div>
              {(() => {
                const lastStats =
                  userData?.lastProfile?.lastStats ||
                  userData?.lastProfile?.last_stats ||
                  null;
                const time =
                  lastStats?.time ||
                  lastStats?.submittedAt ||
                  lastStats?.timestamp;
                if (time) {
                  const dt = new Date(time);
                  return (
                    <div>
                      <p className="text-paragraph">
                        Last stats submission: {dt.toLocaleString()}
                      </p>
                      {'kills' in (lastStats || {}) ||
                      'deaths' in (lastStats || {}) ||
                      'assists' in (lastStats || {}) ? (
                        <div
                          style={{ display: 'flex', flexWrap: 'wrap', gap: 12 }}
                        >
                          {'kills' in lastStats && (
                            <span className="inline-code">
                              Kills: {lastStats.kills}
                            </span>
                          )}
                          {'deaths' in lastStats && (
                            <span className="inline-code">
                              Deaths: {lastStats.deaths}
                            </span>
                          )}
                          {'assists' in lastStats && (
                            <span className="inline-code">
                              Assists: {lastStats.assists}
                            </span>
                          )}
                        </div>
                      ) : null}
                    </div>
                  );
                }
                return (
                  <p className="text-paragraph">
                    No stats submissions recorded.
                  </p>
                );
              })()}
            </div>
          )}
          {infoTab === 'merit' && (
            <div>
              <p className="text-paragraph">
                Merit Points: {userData?.meritPoints ?? 0}
              </p>
            </div>
          )}
          {infoTab === 'linked' && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              {userData?.twitchUrl ? (
                <a
                  href={userData.twitchUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Twitch"
                >
                  <FaTwitch size={24} color="#a970ff" />
                </a>
              ) : (
                <p className="text-paragraph">No accounts linked.</p>
              )}
            </div>
          )}
        </section>
        <section className="content-section">
          <h2 className="content-section-title with-border-bottom">
            GPT Career
          </h2>
          {(() => {
            const submissions = userData?.challengeSubmissions || [];
            let challengeCompleted = 0;
            CHALLENGE_LEVEL_LABELS.forEach((_, i) => {
              const lvl = i + 1;
              const s = submissions.find((x: any) => x.level === lvl);
              if (s && (s.youtubeUrl || s.witnessName || s.witnessDiscordId))
                challengeCompleted++;
            });
            const campaignCompletions: string[] =
              userData?.campaignCompletions ||
              userData?.lastProfile?.campaignCompletions ||
              [];
            const campaignSet = new Set(campaignCompletions);
            const campaignCompleted = campaignSet.size;
            return (
              <div>
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: 8,
                  }}
                >
                  <strong style={{ color: '#f59e0b' }}>Challenges</strong>
                  <span style={{ color: '#f59e0b', fontWeight: 600 }}>
                    {challengeCompleted}/{CHALLENGE_LEVEL_LABELS.length}
                  </span>
                </div>
                <div
                  style={{
                    display: 'flex',
                    flexWrap: 'wrap',
                    gap: 8,
                    marginBottom: 16,
                  }}
                >
                  {CHALLENGE_LEVEL_LABELS.map((label, i) => {
                    const lvl = i + 1;
                    const s = submissions.find((x: any) => x.level === lvl);
                    const complete = !!(
                      s &&
                      (s.youtubeUrl || s.witnessName || s.witnessDiscordId)
                    );
                    return (
                      <span
                        key={lvl}
                        style={{
                          padding: '0.35rem 0.6rem',
                          borderRadius: 8,
                          border: '1px solid #334155',
                          background: complete
                            ? 'rgba(180, 140, 0, 0.2)'
                            : 'rgba(0,0,0,0.2)',
                          color: complete ? '#f59e0b' : '#94a3b8',
                          fontWeight: 600,
                        }}
                      >
                        {label}
                      </span>
                    );
                  })}
                </div>
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: 8,
                  }}
                >
                  <strong style={{ color: '#f59e0b' }}>Campaign</strong>
                  <span style={{ color: '#f59e0b', fontWeight: 600 }}>
                    {campaignCompleted}/{CAMPAIGN_MISSION_LABELS.length}
                  </span>
                </div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                  {CAMPAIGN_MISSION_LABELS.map((label) => {
                    const complete = campaignSet.has(label);
                    return (
                      <span
                        key={label}
                        style={{
                          padding: '0.35rem 0.6rem',
                          borderRadius: 8,
                          border: '1px solid #334155',
                          background: complete
                            ? 'rgba(180, 140, 0, 0.2)'
                            : 'rgba(0,0,0,0.2)',
                          color: complete ? '#f59e0b' : '#94a3b8',
                          fontWeight: 600,
                        }}
                      >
                        {label}
                      </span>
                    );
                  })}
                </div>
              </div>
            );
          })()}
        </section>
      </div>
    </div>
  );
}
