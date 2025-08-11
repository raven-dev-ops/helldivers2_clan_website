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
        const res = await fetch('/api/users/me');
        const data = await res.json();
        setUserData(data);
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

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12, marginBottom: 12 }}>
        <h1 className="academy-page-title" style={{ marginBottom: 0 }}>
          {userData?.name || 'Your Profile'} {allSevenComplete && <span title="All 7 challenges submitted">⭐</span>}
        </h1>
        <div style={{ display: 'flex', gap: 8 }}>
          <Link href="/settings" className="btn btn-primary" style={{ textDecoration: 'none' }}>Edit Profile</Link>
          <button className="btn btn-secondary" onClick={() => setIsSubmitModalOpen(true)}>Submit Challenge</button>
        </div>
      </div>

      <section className="content-section">
        <h2 className="content-section-title with-border-bottom">Overview</h2>
        <div style={{ display: 'flex', gap: 16, alignItems: 'center', flexWrap: 'wrap' }}>
          <img
            src={userData?.customAvatarDataUrl || userData?.image || '/images/avatar-default.png'}
            alt="Avatar"
            style={{ width: 160, height: 160, borderRadius: '50%', objectFit: 'cover', border: '2px solid #475569' }}
          />
          <div style={{ display: 'grid', gridTemplateColumns: '180px 1fr', gap: 12, minWidth: 280 }}>
            <strong>Height (cm)</strong>
            <span>{userData?.characterHeightCm ?? '—'}</span>
            <strong>Weight (kg)</strong>
            <span>{userData?.characterWeightKg ?? '—'}</span>
            <strong>Homeplanet</strong>
            <span>{userData?.homeplanet ?? '—'}</span>
          </div>
        </div>
        <div style={{ marginTop: 12 }}>
          <strong>Background</strong>
          <p style={{ marginTop: 6 }} className="text-paragraph">{userData?.background || '—'}</p>
        </div>
      </section>

      <section className="content-section">
        <h2 className="content-section-title with-border-bottom">Your Rankings</h2>
        {userData?.name ? (
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12 }}>
            <span className="inline-code">Solo: {findRankAndRow(soloData?.results || [], userData.name).rank ?? '—'}</span>
            <span className="inline-code">Monthly: {findRankAndRow(monthData?.results || [], userData.name).rank ?? '—'}</span>
            <span className="inline-code">Total: {findRankAndRow(totalData?.results || [], userData.name).rank ?? '—'}</span>
            <span className="inline-code">Average: {findRankAndRow(avgData?.results || [], userData.name).rank ?? '—'}</span>
          </div>
        ) : (
          <p className="text-paragraph">Set your profile name to see your leaderboard rankings.</p>
        )}
      </section>

      <section className="content-section">
        <h2 className="content-section-title with-border-bottom">Challenge Submissions</h2>
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
        <p className="text-paragraph" style={{ marginTop: 8 }}>To add or update submissions, use the Edit Profile button.</p>
      </section>

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