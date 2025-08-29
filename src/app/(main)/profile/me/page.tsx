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

import base from '../../helldivers-2/HelldiversBase.module.css';
import s from '@/app/components/forum/ProfileForm.module.css'; // reuse Settings layout styles

const videoStyle: CSSProperties = {
  position: 'fixed',
  top: 0,
  left: 0,
  width: '100%',
  height: '100%',
  objectFit: 'cover',
  zIndex: -2,
  filter: 'brightness(0.6)',
};
const overlayStyle: CSSProperties = {
  position: 'fixed',
  inset: 0,
  backgroundColor: 'rgba(16, 20, 31, 0.35)',
  zIndex: -1,
};

// Persist the same background preference used on Settings:
const STORAGE_KEY = 'gpd:bg:motion';

const CHALLENGE_LEVEL_LABELS = [
  'Sabotage Proficiency',
  'Resource Denial',
  'ICBM Control',
  'Flawless ICBM',
  'Perfect Survey',
  'Eagle Ace',
  'The Purist',
];

const CAMPAIGN_MISSION_LABELS = [
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

  const [bgEnabled, setBgEnabled] = useState(true);
  useEffect(() => {
    const saved =
      typeof window !== 'undefined' ? localStorage.getItem(STORAGE_KEY) : null;
    if (saved === 'on' || saved === 'off') setBgEnabled(saved === 'on');
    else {
      const prefersReduced =
        typeof window !== 'undefined' &&
        window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
      setBgEnabled(!prefersReduced);
    }
  }, []);

  const fetcher = (url: string) =>
    fetch(url, { cache: 'no-store' }).then((r) => r.json());
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

  // Preferred unit & derived numbers (prefer last snapshot if present)
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

  const heightDisplay = (() => {
    const cmVal =
      userData?.lastProfile?.characterHeightCm ?? userData?.characterHeightCm;
    if (cmVal == null) return '—';
    if (preferredHeightUnit === 'cm') return `${cmVal} cm`;
    const inches = Math.round(Number(cmVal) / 2.54);
    return `${inches} in`;
  })();

  const weightDisplay = (() => {
    const kgVal =
      userData?.lastProfile?.characterWeightKg ?? userData?.characterWeightKg;
    if (kgVal == null) return '—';
    if (preferredWeightUnit === 'kg') return `${kgVal} kg`;
    const lbs = Math.round(Number(kgVal) * 2.2046226218);
    return `${lbs} lb`;
  })();

  // Persist one snapshot of ranking to server
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
    return <div className={base.pageContainer}>Loading profile…</div>;
  }
  if (!session) {
    return (
      <div className={base.pageContainer}>
        <p>
          Please <a href="/auth">sign in</a> to view your profile.
        </p>
      </div>
    );
  }

  const displayName =
    [
      userData?.lastProfile?.firstName,
      userData?.lastProfile?.middleName,
      userData?.lastProfile?.lastName,
    ]
      .filter(Boolean)
      .join(' ') ||
    [userData?.firstName, userData?.middleName, userData?.lastName]
      .filter(Boolean)
      .join(' ') ||
    '—';

  const sesName = userData?.lastProfile?.sesName ?? userData?.sesName ?? '—';

  const chip = (label: string) => (
    <span
      key={label}
      style={{
        padding: '0.35rem 0.6rem',
        borderRadius: 8,
        border: '1px solid #334155',
        background: 'rgba(0,0,0,0.2)',
        color: '#94a3b8',
        fontWeight: 600,
      }}
    >
      {label}
    </span>
  );

  return (
    <div
      className={base.pageContainer}
      style={{ position: 'relative', zIndex: 0 }}
    >
      {bgEnabled && (
        <>
          <video
            autoPlay
            loop
            muted
            playsInline
            style={videoStyle}
            key="bg-video-profile"
          >
            <source src="/videos/gpd_background.mp4" type="video/mp4" />
          </video>
          <div style={overlayStyle} />
        </>
      )}

      {/* CHARACTER SHEET */}
      <section
        className="content-section"
        style={{ position: 'relative', zIndex: 1 }}
      >
        <h2 className="content-section-title with-border-bottom">
          Character Sheet
        </h2>

        <div className={s.layout}>
          {/* Sidebar (matches Settings look) */}
          <aside className={s.sidebar}>
            <div className={s.avatar}>
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

            <Link
              href="/settings"
              className="btn btn-primary"
              style={{ textDecoration: 'none', textAlign: 'center' }}
            >
              Edit Profile
            </Link>

            <section className={s.section}>
              <h3 className={s.sectionTitle}>Linked</h3>
              {userData?.twitchUrl ? (
                <a
                  href={userData.twitchUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 8,
                  }}
                >
                  <FaTwitch size={20} color="#a970ff" /> Twitch
                </a>
              ) : (
                <p className="text-paragraph">No accounts linked.</p>
              )}
            </section>
          </aside>

          {/* Main card stack */}
          <main>
            {/* Identity */}
            <section className={s.section}>
              <h3 className={s.sectionTitle}>Identity</h3>
              <div className={`${s.grid} cols2`}>
                <div className={`field field-sm ${s.full}`}>
                  <strong className="label">Name</strong>
                  <div
                    style={{
                      color: '#cbd5e1',
                      background: 'rgba(148,163,184,0.12)',
                      padding: '6px 10px',
                      borderRadius: 6,
                    }}
                  >
                    {displayName}
                  </div>
                </div>

                <div className="field field-sm">
                  <strong className="label">S.E.S. (Destroyer) Name</strong>
                  <div
                    style={{
                      color: '#cbd5e1',
                      background: 'rgba(148,163,184,0.12)',
                      padding: '6px 10px',
                      borderRadius: 6,
                    }}
                  >
                    {sesName}
                  </div>
                </div>

                <div className="field field-sm">
                  <strong className="label">Callsign</strong>
                  <div
                    style={{
                      color: '#cbd5e1',
                      background: 'rgba(148,163,184,0.12)',
                      padding: '6px 10px',
                      borderRadius: 6,
                    }}
                  >
                    {userData?.callsign ?? '—'}
                  </div>
                </div>

                <div className="field field-sm">
                  <strong className="label">Rank</strong>
                  <div
                    style={{
                      color: '#cbd5e1',
                      background: 'rgba(148,163,184,0.12)',
                      padding: '6px 10px',
                      borderRadius: 6,
                    }}
                  >
                    {userData?.rankTitle ?? '—'}
                  </div>
                </div>

                <div className="field field-sm">
                  <strong className="label">Homeplanet</strong>
                  <div
                    style={{
                      color: '#cbd5e1',
                      background: 'rgba(148,163,184,0.12)',
                      padding: '6px 10px',
                      borderRadius: 6,
                    }}
                  >
                    {userData?.homeplanet ?? '—'}
                  </div>
                </div>
              </div>
            </section>

            {/* Character Stats */}
            <section className={s.section}>
              <h3 className={s.sectionTitle}>Character Stats</h3>
              <div className={`${s.grid} cols3`}>
                <div className="field field-sm">
                  <strong className="label">Height</strong>
                  <div
                    style={{
                      color: '#cbd5e1',
                      background: 'rgba(148,163,184,0.12)',
                      padding: '6px 10px',
                      borderRadius: 6,
                    }}
                  >
                    {heightDisplay}
                  </div>
                </div>

                <div className="field field-sm">
                  <strong className="label">Weight</strong>
                  <div
                    style={{
                      color: '#cbd5e1',
                      background: 'rgba(148,163,184,0.12)',
                      padding: '6px 10px',
                      borderRadius: 6,
                    }}
                  >
                    {weightDisplay}
                  </div>
                </div>

                <div className="field field-sm">
                  <strong className="label">Favored Enemy</strong>
                  <div
                    style={{
                      color: '#cbd5e1',
                      background: 'rgba(148,163,184,0.12)',
                      padding: '6px 10px',
                      borderRadius: 6,
                    }}
                  >
                    {userData?.favoredEnemy ?? '—'}
                  </div>
                </div>
              </div>
            </section>

            {/* Loadout & Motto */}
            <section className={s.section}>
              <h3 className={s.sectionTitle}>Loadout & Motto</h3>
              <div className={`${s.grid} cols3`}>
                <div className="field field-sm">
                  <strong className="label">Favorite Weapon</strong>
                  <div
                    style={{
                      color: '#cbd5e1',
                      background: 'rgba(148,163,184,0.12)',
                      padding: '6px 10px',
                      borderRadius: 6,
                    }}
                  >
                    {userData?.favoriteWeapon ?? '—'}
                  </div>
                </div>
                <div className="field field-sm">
                  <strong className="label">Armor</strong>
                  <div
                    style={{
                      color: '#cbd5e1',
                      background: 'rgba(148,163,184,0.12)',
                      padding: '6px 10px',
                      borderRadius: 6,
                    }}
                  >
                    {userData?.armor ?? '—'}
                  </div>
                </div>
                <div className={`field field-sm ${s.full}`}>
                  <strong className="label">Motto</strong>
                  <div
                    style={{
                      color: '#cbd5e1',
                      background: 'rgba(148,163,184,0.12)',
                      padding: '6px 10px',
                      borderRadius: 6,
                    }}
                  >
                    {userData?.motto ?? '—'}
                  </div>
                </div>
              </div>
            </section>

            {/* Biography */}
            <section className={s.section}>
              <h3 className={s.sectionTitle}>Roleplay Bio</h3>
              <div className={s.grid}>
                <div className={`field field-sm ${s.full}`}>
                  <strong className="label">Background</strong>
                  <div
                    className="text-paragraph"
                    style={{
                      color: '#cbd5e1',
                      background: 'rgba(148,163,184,0.12)',
                      padding: '10px 12px',
                      borderRadius: 6,
                    }}
                  >
                    {userData?.background || '—'}
                  </div>
                </div>
              </div>
            </section>

            {/* Career & Rankings */}
            <section className={s.section}>
              <h3 className={s.sectionTitle}>Career & Rankings</h3>
              {userData?.name ? (
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12 }}>
                  {chip(
                    `Solo: ${findRankAndRow(soloData?.results || [], userData.name).rank ?? '—'}`
                  )}
                  {chip(
                    `Monthly: ${findRankAndRow(monthData?.results || [], userData.name).rank ?? '—'}`
                  )}
                  {chip(
                    `Yearly: ${findRankAndRow(lifetimeData?.results || [], userData.name).rank ?? '—'}`
                  )}
                  {chip(`Grade: ${computeGrade() ?? '—'}`)}
                  {chip(`Clearance: ${userData?.rankTitle ?? '—'}`)}
                </div>
              ) : (
                <p className="text-paragraph">
                  Set your profile name to see your leaderboard rankings.
                </p>
              )}
            </section>

            {/* Awards */}
            <section className={s.section}>
              <h3 className={s.sectionTitle}>Awards</h3>
              <div style={{ display: 'grid', gap: '1rem' }}>
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
                      {(() => {
                        const submissions =
                          userData?.challengeSubmissions || [];
                        let c = 0;
                        for (let i = 1; i <= 7; i++) {
                          const s = submissions.find((x: any) => x.level === i);
                          if (
                            s &&
                            (s.youtubeUrl ||
                              s.witnessName ||
                              s.witnessDiscordId)
                          )
                            c++;
                        }
                        return `${c}/${CHALLENGE_LEVEL_LABELS.length}`;
                      })()}
                    </span>
                  </div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                    {CHALLENGE_LEVEL_LABELS.map((label, i) => {
                      const lvl = i + 1;
                      const s = (userData?.challengeSubmissions || []).find(
                        (x: any) => x.level === lvl
                      );
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
                </div>

                <div>
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
                      {(() => {
                        const cs: string[] =
                          userData?.campaignCompletions ||
                          userData?.lastProfile?.campaignCompletions ||
                          [];
                        const set = new Set(cs);
                        return `${set.size}/${CAMPAIGN_MISSION_LABELS.length}`;
                      })()}
                    </span>
                  </div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                    {CAMPAIGN_MISSION_LABELS.map((label) => {
                      const cs: string[] =
                        userData?.campaignCompletions ||
                        userData?.lastProfile?.campaignCompletions ||
                        [];
                      const set = new Set(cs);
                      const complete = set.has(label);
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
              </div>
            </section>

            {/* Activity */}
            <section className={s.section}>
              <h3 className={s.sectionTitle}>Activity</h3>
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
                          {'kills' in lastStats &&
                            chip(`Kills: ${lastStats.kills}`)}
                          {'deaths' in lastStats &&
                            chip(`Deaths: ${lastStats.deaths}`)}
                          {'assists' in lastStats &&
                            chip(`Assists: ${lastStats.assists}`)}
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
            </section>
          </main>
        </div>
      </section>
    </div>
  );
}
