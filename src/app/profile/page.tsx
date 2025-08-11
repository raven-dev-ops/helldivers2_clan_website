'use client';

import { useEffect, useMemo, useState } from 'react';
import { useSession } from 'next-auth/react';
import styled from 'styled-components';
import Link from 'next/link';

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
  width: 120px; height: 120px; border-radius: 50%; object-fit: cover; border: 2px solid #475569;
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
