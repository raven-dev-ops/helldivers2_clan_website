'use client';

import { useEffect, useMemo, useState } from 'react';
import { useSession } from 'next-auth/react';
import styled from 'styled-components';
import Link from 'next/link';
import useSWR from 'swr';

const ProfileContainer = styled.div`
  min-height: 60vh;
  background-color: #0f172a;
  color: #e2e8f0;
  padding: 2rem;
`;
const Card = styled.section`
  background: rgba(30, 41, 59, 0.6);
  border: 1px solid rgba(51, 65, 85, 0.6);
  border-radius: 12px;
  padding: 1rem;
  margin-bottom: 1rem;
`;
const Row = styled.div`
  display: grid;
  grid-template-columns: 160px 1fr;
  gap: 0.75rem;
  align-items: center;
  margin-bottom: 0.75rem;
`;
const Avatar = styled.img`
  width: 160px; height: 160px; border-radius: 50%; object-fit: cover; border: 2px solid #475569;
`;
const ButtonLink = styled(Link)`
  background: #f59e0b;
  color: #0f172a;
  font-weight: 700;
  border: none;
  border-radius: 8px;
  padding: 0.5rem 0.85rem;
  cursor: pointer;
  text-decoration: none;
  display: inline-block;
`;
const StatPill = styled.span`
  background: rgba(0,0,0,0.2);
  border: 1px solid #334155;
  border-radius: 8px;
  padding: 0.25rem 0.5rem;
  font-size: 0.85rem;
`;

export default function ProfilePage() {
  const { data: session, status } = useSession();
  const [userData, setUserData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

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

  const findRank = (rows: any[], name: string) => {
    const idx = (rows || []).findIndex(r => (r.player_name || '').toLowerCase() === name.toLowerCase());
    return idx >= 0 ? (rows[idx].rank || idx + 1) : null;
  };

  if (status === 'loading' || loading) {
    return <ProfileContainer>Loading profile…</ProfileContainer>;
  }
  if (!session) {
    return (
      <ProfileContainer>
        <p>Please <a href="/auth">sign in</a> to view your profile.</p>
      </ProfileContainer>
    );
  }

  return (
    <ProfileContainer>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
        <h1 style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          {userData?.name || 'Your Profile'} {allSevenComplete && <span title="All 7 challenges submitted">⭐</span>}
        </h1>
        <ButtonLink href="/settings">Edit Profile</ButtonLink>
      </div>

      <Card>
        <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
          <Avatar src={userData?.customAvatarDataUrl || userData?.image || '/images/avatar-default.png'} alt="Avatar" />
          <div>
            <Row>
              <strong>Height (cm)</strong>
              <span>{userData?.characterHeightCm ?? '—'}</span>
            </Row>
            <Row>
              <strong>Weight (kg)</strong>
              <span>{userData?.characterWeightKg ?? '—'}</span>
            </Row>
            <Row>
              <strong>Homeplanet</strong>
              <span>{userData?.homeplanet ?? '—'}</span>
            </Row>
          </div>
        </div>
        <div style={{ marginTop: 12 }}>
          <strong>Background</strong>
          <p style={{ marginTop: 6, color: '#cbd5e1' }}>{userData?.background || '—'}</p>
        </div>
      </Card>

      <Card>
        <h2>Your Rankings</h2>
        {userData?.name ? (
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12 }}>
            <StatPill>Solo: {findRank(soloData?.results || [], userData.name) ?? '—'}</StatPill>
            <StatPill>Monthly: {findRank(monthData?.results || [], userData.name) ?? '—'}</StatPill>
            <StatPill>Total: {findRank(totalData?.results || [], userData.name) ?? '—'}</StatPill>
            <StatPill>Average: {findRank(avgData?.results || [], userData.name) ?? '—'}</StatPill>
          </div>
        ) : (
          <p style={{ color: '#94a3b8' }}>Set your profile name to see your leaderboard rankings.</p>
        )}
      </Card>

      <Card>
        <h2>Challenge Submissions</h2>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginTop: 8 }}>
          {Array.from({ length: 7 }, (_, i) => i + 1).map((lvl) => {
            const s = (userData?.challengeSubmissions || []).find((x: any) => x.level === lvl);
            const complete = !!(s && (s.youtubeUrl || s.witnessName || s.witnessDiscordId));
            return (
              <StatPill key={lvl}>Level {lvl}: {complete ? '✅' : '—'}</StatPill>
            );
          })}
        </div>
        <p style={{ color: '#94a3b8', marginTop: 8 }}>To add or update submissions, use the Edit Profile button.</p>
      </Card>
    </ProfileContainer>
  );
}