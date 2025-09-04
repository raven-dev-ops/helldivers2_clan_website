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
import styles from './Profile.module.css'; // Import the new CSS module
import baseStyles from '../helldivers-2/HelldiversBase.module.css';

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

  useEffect(() => {
    if (status === 'authenticated') {
      (async () => {
        setLoading(true);
        const [resMe, resLast] = await Promise.all([
          fetch('/api/users/me?include=avatar,submissions'),
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
    return <div className={baseStyles.pageContainer}>Loading profile…</div>;
  }
  if (!session) {
    return (
      <div className={baseStyles.pageContainer}>
        <p>
          Please <a href="/auth">sign in</a> to view your profile.
        </p>
      </div>
    );
  }

  const renderContent = () => {
    switch (infoTab) {
      case 'roles':
        return (
          <div>
            <h3 className={styles.contentTitle}>Discord Roles</h3>
            {Array.isArray(userData?.discordRoles) &&
            userData.discordRoles.length > 0 ? (
              <div>
                {userData.discordRoles.map((r: any) => (
                  <span key={r.id} className={styles.chip}>
                    {r.name}
                  </span>
                ))}
              </div>
            ) : (
              <p>No Discord roles detected. Roles are synced automatically when you join the Discord server and link your account.</p>
            )}
          </div>
        );
      case 'awards':
        return (
          <div>
            <h3 className={styles.contentTitle}>Awards</h3>
            {allSevenComplete ? (
              <span className={styles.chip}>All 7 Challenges Complete ⭐</span>
            ) : (
              <p>No awards yet.</p>
            )}
          </div>
        );
        case 'squad':
            return (
              <div>
                <h3 className={styles.contentTitle}>Squad</h3>
                <p>Coming soon.</p>
              </div>
            );
      case 'rankings':
        return (
          <div>
            <h3 className={styles.contentTitle}>Leaderboard Rankings</h3>
            {userData?.name ? (
              <div className={styles.statGrid}>
                <div className={styles.statCard}>
                  <div className={styles.statLabel}>Solo</div>
                  <div className={styles.statValue}>
                    {findRankAndRow(soloData?.results || [], userData.name).rank ?? '—'}
                  </div>
                </div>
                <div className={styles.statCard}>
                  <div className={styles.statLabel}>Monthly</div>
                  <div className={styles.statValue}>
                    {findRankAndRow(monthData?.results || [], userData.name).rank ?? '—'}
                  </div>
                </div>
                <div className={styles.statCard}>
                  <div className={styles.statLabel}>Lifetime</div>
                  <div className={styles.statValue}>
                    {findRankAndRow(lifetimeData?.results || [], userData.name).rank ?? '—'}
                  </div>
                </div>
                <div className={styles.statCard}>
                  <div className={styles.statLabel}>Grade</div>
                  <div className={styles.statValue}>{computeGrade() ?? '—'}</div>
                </div>
              </div>
            ) : (
              <p>Set your profile name to see your leaderboard rankings.</p>
            )}
          </div>
        );
      case 'activity':
        // ... activity content
        return <div><h3 className={styles.contentTitle}>Activity</h3><p>Coming soon.</p></div>;
      case 'merit':
        return (
            <div>
                <h3 className={styles.contentTitle}>Merit</h3>
                <div className={styles.statGrid}>
                    <div className={styles.statCard}>
                        <div className={styles.statLabel}>Merit Points</div>
                        <div className={styles.statValue}>{userData?.meritPoints ?? 0}</div>
                    </div>
                </div>
            </div>
        );
      case 'linked':
        return (
          <div>
            <h3 className={styles.contentTitle}>Linked Accounts</h3>
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
              <p>No accounts linked.</p>
            )}
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className={baseStyles.wrapper}>
      <div className={baseStyles.dividerLayer} />
      <div className={baseStyles.pageContainer}>
        <header className={styles.profileHeader}>
          <div className={styles.avatar}>
            <img
              src={userData?.customAvatarDataUrl || userData?.image || '/images/avatar-default.png'}
              alt="Avatar"
            />
          </div>
          <div className={styles.profileInfo}>
            <h1 className={styles.profileName}>
              {userData?.name || 'Unnamed Diver'}
            </h1>
            <p className={styles.profileSubtitle}>
                {userData?.rankTitle || 'Cadet'}
            </p>
            <div className={styles.profileActions}>
                <Link href="/settings" className={styles.button}>Edit Profile</Link>
            </div>
          </div>
        </header>

        <div className={styles.gridContainer}>
          <aside className={styles.sidebar}>
            <button
              className={styles.sidebarButton}
              onClick={() => setInfoTab('roles')}
              aria-pressed={infoTab === 'roles'}
            >
              Roles
            </button>
            <button
              className={styles.sidebarButton}
              onClick={() => setInfoTab('awards')}
              aria-pressed={infoTab === 'awards'}
            >
              Awards
            </button>
            <button
              className={styles.sidebarButton}
              onClick={() => setInfoTab('squad')}
              aria-pressed={infoTab === 'squad'}
            >
              Squad
            </button>
            <button
              className={styles.sidebarButton}
              onClick={() => setInfoTab('rankings')}
              aria-pressed={infoTab === 'rankings'}
            >
              Rankings
            </button>
            <button
              className={styles.sidebarButton}
              onClick={() => setInfoTab('activity')}
              aria-pressed={infoTab === 'activity'}
            >
              Activity
            </button>
            <button
              className={styles.sidebarButton}
              onClick={() => setInfoTab('merit')}
              aria-pressed={infoTab === 'merit'}
            >
              Merit
            </button>
            <button
              className={styles.sidebarButton}
              onClick={() => setInfoTab('linked')}
              aria-pressed={infoTab === 'linked'}
            >
              Linked
            </button>
          </aside>

          <main className={styles.content}>
            {renderContent()}
          </main>
        </div>

        <section className={`${baseStyles.section} ${styles.content}`}>
            <h2 className={baseStyles.sectionTitle}>GPT Career</h2>
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
                            className={styles.chip}
                            style={{
                                background: complete
                                ? 'rgba(180, 140, 0, 0.2)'
                                : 'rgba(0,0,0,0.2)',
                                color: complete ? '#f59e0b' : '#94a3b8',
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
                            className={styles.chip}
                            style={{
                            background: complete
                                ? 'rgba(180, 140, 0, 0.2)'
                                : 'rgba(0,0,0,0.2)',
                                color: complete ? '#f59e0b' : '#94a3b8',
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
