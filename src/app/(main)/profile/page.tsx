'use client';

import { useEffect, useMemo, useRef, useState, type CSSProperties } from 'react';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import useSWR from 'swr';
import styles from '../helldivers-2/HelldiversPage.module.css';

const videoStyle: CSSProperties = {
  position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', objectFit: 'cover', zIndex: -2, filter: 'brightness(0.6)'
};
const overlayStyle: CSSProperties = {
  position: 'fixed', inset: 0, backgroundColor: 'rgba(16, 20, 31, 0.35)', zIndex: -1
};

// Challenge names (levels 1-7) as in Challenges menu
const CHALLENGE_LEVEL_LABELS: string[] = [
  'Sabotage Proficiency',
  'Resource Denial',
  'ICBM Control',
  'Flawless ICBM',
  'Perfect Survey',
  'Eagle Ace',
  'The Purist'
];

function SubmitChallengeModal({
  isOpen,
  onClose,
  onSubmitted,
}: { isOpen: boolean; onClose: () => void; onSubmitted: () => void }) {
  const [level, setLevel] = useState<number>(1);
  const [youtubeUrl, setYoutubeUrl] = useState<string>('');
  const [twitchUrl, setTwitchUrl] = useState<string>('');
  const [witnessName, setWitnessName] = useState<string>('');
  const [saving, setSaving] = useState<boolean>(false);

  if (!isOpen) return null;

  const modalStyle: CSSProperties = { position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 50 };
  const cardStyle: CSSProperties = { background: '#0b1220', color: '#fff', width: 'min(92vw, 640px)', borderRadius: 12, border: '1px solid #334155', padding: 16 };

  const handleSubmit = async () => {
    setSaving(true);
    try {
      const res = await fetch('/api/users/me', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          challengeSubmission: { level, youtubeUrl, twitchUrl, witnessName }
        })
      });
      if (res.ok) onSubmitted();
    } finally {
      setSaving(false);
      onClose();
    }
  };

  return (
    <div style={modalStyle} role="dialog" aria-modal="true" aria-label="Submit Challenge">
      <div style={cardStyle}>
        <h3 style={{ marginTop: 0, marginBottom: 12, fontWeight: 700 }}>Submit Challenge</h3>
        <div style={{ display: 'grid', gap: 12 }}>
          <label className="field">
            <span className="label">Challenge</span>
            <select value={level} onChange={(e) => setLevel(Number(e.target.value))}>
              {CHALLENGE_LEVEL_LABELS.map((label, idx) => (
                <option key={idx + 1} value={idx + 1}>{label} (Level {idx + 1})</option>
              ))}
            </select>
          </label>
          <label className="field">
            <span className="label">YouTube Link</span>
            <input value={youtubeUrl} onChange={(e) => setYoutubeUrl(e.target.value)} placeholder="https://youtube.com/..." />
          </label>
          <label className="field">
            <span className="label">Twitch VOD Link</span>
            <input value={twitchUrl} onChange={(e) => setTwitchUrl(e.target.value)} placeholder="https://twitch.tv/videos/..." />
          </label>
          <label className="field">
            <span className="label">Verified By (John Helldiver)</span>
            <input value={witnessName} onChange={(e) => setWitnessName(e.target.value)} placeholder="Verifier name" />
          </label>
          <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
            <button className="btn btn-secondary" type="button" onClick={onClose} disabled={saving}>Cancel</button>
            <button className="btn btn-primary" type="button" onClick={handleSubmit} disabled={saving}>{saving ? 'Submitting…' : 'Submit'}</button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ProfilePage() {
  const { data: session, status } = useSession();
  const [userData, setUserData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isSubmitModalOpen, setIsSubmitModalOpen] = useState(false);
  const savedRankingOnce = useRef(false);

  const fetcher = (url: string) => fetch(url, { cache: 'no-store' }).then(r => r.json());
  const now = new Date();
  const qsSolo = new URLSearchParams({ scope: 'solo', sortBy: 'Kills', sortDir: 'desc', limit: '1000' }).toString();
  const qsMonth = new URLSearchParams({ scope: 'month', sortBy: 'Kills', sortDir: 'desc', limit: '1000', month: String(now.getUTCMonth() + 1), year: String(now.getUTCFullYear()) }).toString();
  const qsTotal = new URLSearchParams({ scope: 'lifetime', sortBy: 'Kills', sortDir: 'desc', limit: '1000' }).toString();
  const qsAvg = new URLSearchParams({ scope: 'lifetime', sortBy: 'Avg Kills', sortDir: 'desc', limit: '1000' }).toString();
  const { data: soloData } = useSWR(`/api/helldivers/leaderboard?${qsSolo}`, fetcher);
  const { data: monthData } = useSWR(`/api/helldivers/leaderboard?${qsMonth}`, fetcher);
  const { data: totalData } = useSWR(`/api/helldivers/leaderboard?${qsTotal}`, fetcher);
  const { data: avgData } = useSWR(`/api/helldivers/leaderboard?${qsAvg}`, fetcher);

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
    const idx = (rows || []).findIndex(r => (r.player_name || '').toLowerCase() === name.toLowerCase());
    return idx >= 0 ? { rank: (rows[idx].rank || idx + 1), row: rows[idx] } : { rank: null, row: null };
  };

  const computeGrade = (): string | null => {
    if (!userData?.name) return null;
    const total = findRankAndRow(totalData?.results || [], userData.name).row;
    const month = findRankAndRow(monthData?.results || [], userData.name).row;
    const avg = findRankAndRow(avgData?.results || [], userData.name).row;
    const solo = findRankAndRow(soloData?.results || [], userData.name).row;
    const row = total || month || avg || solo;
    if (!row) return null;
    const accuracyRaw = row.Accuracy as string | undefined;
    const accuracyNum = accuracyRaw ? parseFloat(accuracyRaw.replace('%', '')) : Number.NaN;
    if (Number.isFinite(accuracyNum)) {
      if (accuracyNum >= 75) return 'S';
      if (accuracyNum >= 65) return 'A';
      if (accuracyNum >= 50) return 'B';
      if (accuracyNum >= 35) return 'C';
      return 'D';
    }
    return null;
  };

  // Unit helpers and derived display values
  const preferredHeightUnit: 'cm' | 'in' = userData?.preferredHeightUnit === 'in' ? 'in' : 'cm';
  const preferredWeightUnit: 'kg' | 'lb' = userData?.preferredWeightUnit === 'lb' ? 'lb' : 'kg';
  const heightLabel = `Height (${preferredHeightUnit})`;
  const weightLabel = `Weight (${preferredWeightUnit})`;
  const heightDisplay = (() => {
    const cmVal = userData?.characterHeightCm;
    if (cmVal == null) return '—';
    if (preferredHeightUnit === 'cm') return cmVal;
    const inches = Math.round(Number(cmVal) / 2.54);
    return inches;
  })();
  const weightDisplay = (() => {
    const kgVal = userData?.characterWeightKg;
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
    const total = findRankAndRow(totalData?.results || [], name);
    const avg = findRankAndRow(avgData?.results || [], name);

    const entries = [
      { scope: 'solo', rank: solo.rank, stats: solo.row },
      { scope: 'month', rank: month.rank, stats: month.row },
      { scope: 'lifetime', rank: total.rank, stats: total.row },
      { scope: 'average', rank: avg.rank, stats: avg.row },
    ].filter(e => e.rank != null && e.stats);

    if (entries.length > 0) {
      savedRankingOnce.current = true;
      fetch('/api/users/profile/ranking', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ entries })
      }).catch(() => {});
    }
  }, [userData?.name, soloData, monthData, totalData, avgData]);

  if (status === 'loading' || loading) {
    return <div className={styles.pageContainer}>Loading profile…</div>;
  }
  if (!session) {
    return (
      <div className={styles.pageContainer}>
        <p>Please <a href="/auth">sign in</a> to view your profile.</p>
      </div>
    );
  }

  return (
    <div className={styles.pageContainer}>
      {/* Background Video and Overlay */}
      <video autoPlay loop muted playsInline style={videoStyle} key="bg-video-profile">
        <source src="/videos/gpd_background.mp4" type="video/mp4" />
      </video>
      <div style={overlayStyle} />

      {/* Welcome title removed per requirements */}

      <section className="content-section">
        <h2 className="content-section-title with-border-bottom">Character Overview</h2>
        <div style={{ display: 'flex', gap: 16, alignItems: 'flex-start', flexWrap: 'nowrap' }}>
          <img
            src={userData?.customAvatarDataUrl || userData?.image || '/images/avatar-default.png'}
            alt="Avatar"
            style={{ width: 160, height: 160, borderRadius: '50%', objectFit: 'cover', border: '2px solid #475569' }}
          />
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, minmax(200px, 1fr))', gap: 12, minWidth: 280, flex: 1 }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              <strong style={{ color: '#f59e0b' }}>Name</strong>
              <span style={{ color: '#cbd5e1', background: 'rgba(148,163,184,0.12)', padding: '2px 8px', borderRadius: 6 }}>{
                ([userData?.lastProfile?.firstName, userData?.lastProfile?.middleName, userData?.lastProfile?.lastName].filter(Boolean).join(' ') ||
                 [userData?.firstName, userData?.middleName, userData?.lastName].filter(Boolean).join(' ') || '—')
              }</span>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              <strong style={{ color: '#f59e0b' }}>{heightLabel}</strong>
              <span style={{ color: '#cbd5e1', background: 'rgba(148,163,184,0.12)', padding: '2px 8px', borderRadius: 6 }}>{heightDisplay}</span>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              <strong style={{ color: '#f59e0b' }}>{weightLabel}</strong>
              <span style={{ color: '#cbd5e1', background: 'rgba(148,163,184,0.12)', padding: '2px 8px', borderRadius: 6 }}>{weightDisplay}</span>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              <strong style={{ color: '#f59e0b' }}>Homeplanet</strong>
              <span style={{ color: '#cbd5e1', background: 'rgba(148,163,184,0.12)', padding: '2px 8px', borderRadius: 6 }}>{userData?.homeplanet ?? '—'}</span>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              <strong style={{ color: '#f59e0b' }}>Callsign</strong>
              <span style={{ color: '#cbd5e1', background: 'rgba(148,163,184,0.12)', padding: '2px 8px', borderRadius: 6 }}>{userData?.callsign ?? '—'}</span>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              <strong style={{ color: '#f59e0b' }}>Rank</strong>
              <span style={{ color: '#cbd5e1', background: 'rgba(148,163,184,0.12)', padding: '2px 8px', borderRadius: 6 }}>{userData?.rankTitle ?? '—'}</span>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              <strong style={{ color: '#f59e0b' }}>Favorite Weapon</strong>
              <span style={{ color: '#cbd5e1', background: 'rgba(148,163,184,0.12)', padding: '2px 8px', borderRadius: 6 }}>{userData?.favoriteWeapon ?? '—'}</span>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              <strong style={{ color: '#f59e0b' }}>Armor</strong>
              <span style={{ color: '#cbd5e1', background: 'rgba(148,163,184,0.12)', padding: '2px 8px', borderRadius: 6 }}>{userData?.armor ?? '—'}</span>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              <strong style={{ color: '#f59e0b' }}>Motto</strong>
              <span style={{ color: '#cbd5e1', background: 'rgba(148,163,184,0.12)', padding: '2px 8px', borderRadius: 6 }}>{userData?.motto ?? '—'}</span>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              <strong style={{ color: '#f59e0b' }}>Favored Enemy</strong>
              <span style={{ color: '#cbd5e1', background: 'rgba(148,163,184,0.12)', padding: '2px 8px', borderRadius: 6 }}>{userData?.favoredEnemy ?? '—'}</span>
            </div>
            <div style={{ gridColumn: '1 / -1', marginTop: 8 }}>
              <strong style={{ color: '#f59e0b' }}>Background</strong>
              <div style={{ color: '#cbd5e1', background: 'rgba(148,163,184,0.12)', padding: '2px 8px', borderRadius: 6, marginTop: 6 }} className="text-paragraph">{userData?.background || '—'}</div>
            </div>
          </div>
        </div>
      </section>

      <section className="content-section">
        <h2 className="content-section-title with-border-bottom">Your Roles</h2>
        {Array.isArray(userData?.discordRoles) && userData.discordRoles.length > 0 ? (
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
            {userData.discordRoles.map((r: any) => (
              <span key={r.id} className="inline-code">{r.name}</span>
            ))}
          </div>
        ) : (
          <p className="text-paragraph">No Discord roles detected. Link your Discord and join the server to see roles.</p>
        )}
      </section>

      <section className="content-section">
        <h2 className="content-section-title with-border-bottom">Your Awards</h2>
        {allSevenComplete ? (
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
            <span className="inline-code" title="All 7 challenges submitted">All 7 Challenges Complete ⭐</span>
          </div>
        ) : (
          <p className="text-paragraph">No awards yet.</p>
        )}
      </section>

      <section className="content-section">
        <h2 className="content-section-title with-border-bottom">Your Squad</h2>
        <p className="text-paragraph">Coming soon.</p>
      </section>

      <section className="content-section">
        <h2 className="content-section-title with-border-bottom">Your Rankings</h2>
        {userData?.name ? (
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12 }}>
            <span className="inline-code">Solo: {findRankAndRow(soloData?.results || [], userData.name).rank ?? '—'}</span>
            <span className="inline-code">Monthly: {findRankAndRow(monthData?.results || [], userData.name).rank ?? '—'}</span>
            <span className="inline-code">Total: {findRankAndRow(totalData?.results || [], userData.name).rank ?? '—'}</span>
            <span className="inline-code">Average: {findRankAndRow(avgData?.results || [], userData.name).rank ?? '—'}</span>
            <span className="inline-code">Grade: {computeGrade() ?? '—'}</span>
          </div>
        ) : (
          <p className="text-paragraph">Set your profile name to see your leaderboard rankings.</p>
        )}
      </section>

      <section className="content-section">
        <h2 className="content-section-title with-border-bottom">GPT Campaigns</h2>
        <p className="text-paragraph">Coming soon. Explore current <Link href="/helldivers-2/challenges#gpt-campaign-missions">GPT Campaign Missions</Link>.</p>
      </section>

      <section className="content-section">
        <h2 className="content-section-title with-border-bottom">GPT Challenges</h2>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginTop: 8 }}>
          {CHALLENGE_LEVEL_LABELS.map((label, i) => {
            const lvl = i + 1;
            const s = (userData?.challengeSubmissions || []).find((x: any) => x.level === lvl);
            const complete = !!(s && (s.youtubeUrl || s.witnessName || s.witnessDiscordId));
            return (
              <span key={lvl} style={{
                padding: '0.35rem 0.6rem',
                borderRadius: 8,
                border: '1px solid #334155',
                background: complete ? 'rgba(180, 140, 0, 0.2)' : 'rgba(0,0,0,0.2)',
                color: complete ? '#f59e0b' : '#94a3b8',
                fontWeight: 600
              }}>{label}</span>
            );
          })}
        </div>
      </section>

      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8 }}>
        <Link href="/settings" className="btn btn-primary" style={{ textDecoration: 'none' }}>Settings</Link>
        <button className="btn btn-secondary" onClick={() => setIsSubmitModalOpen(true)}>Submit Challenge</button>
      </div>

      <SubmitChallengeModal
        isOpen={isSubmitModalOpen}
        onClose={() => setIsSubmitModalOpen(false)}
        onSubmitted={async () => {
          const res = await fetch('/api/users/me');
          const data = await res.json();
          setUserData(data);
        }}
      />
    </div>
  );
}