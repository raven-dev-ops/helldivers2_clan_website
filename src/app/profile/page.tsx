'use client';

import { useEffect, useMemo, useState } from 'react';
import { useSession, signIn, signOut } from 'next-auth/react';
import styled from 'styled-components';

const ProfileContainer = styled.div`
  min-height: 60vh;
  background-color: #0f172a;
  color: #e2e8f0;
  padding: 2rem;
`;
const Section = styled.section`
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
const Input = styled.input`
  background: #0b1220;
  border: 1px solid #334155;
  border-radius: 8px;
  color: #e2e8f0;
  padding: 0.5rem 0.75rem;
`;
const TextArea = styled.textarea`
  background: #0b1220;
  border: 1px solid #334155;
  border-radius: 8px;
  color: #e2e8f0;
  padding: 0.5rem 0.75rem;
  min-height: 100px;
`;
const Button = styled.button`
  background: #f59e0b;
  color: #0f172a;
  font-weight: 700;
  border: none;
  border-radius: 8px;
  padding: 0.5rem 0.85rem;
  cursor: pointer;
  &:disabled { opacity: 0.6; cursor: not-allowed; }
`;
const Avatar = styled.img`
  width: 120px; height: 120px; border-radius: 50%; object-fit: cover; border: 2px solid #475569;
`;
const Star = styled.span`
  font-size: 24px; margin-left: 8px;
`;

interface ChallengeSubmission {
  level: number;
  youtubeUrl?: string | null;
  witnessName?: string | null;
  witnessDiscordId?: string | null;
}

export default function ProfilePage() {
  const { data: session, status } = useSession();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [userData, setUserData] = useState<any>(null);

  const [characterHeightCm, setCharacterHeightCm] = useState<string>('');
  const [characterWeightKg, setCharacterWeightKg] = useState<string>('');
  const [homeplanet, setHomeplanet] = useState<string>('');
  const [background, setBackground] = useState<string>('');
  const [avatarFile, setAvatarFile] = useState<File | null>(null);

  const [challengeEdits, setChallengeEdits] = useState<Record<number, ChallengeSubmission>>({});

  useEffect(() => {
    if (status === 'authenticated') {
      (async () => {
        setLoading(true);
        const res = await fetch('/api/users/me');
        const data = await res.json();
        setUserData(data);
        setCharacterHeightCm(data.characterHeightCm ? String(data.characterHeightCm) : '');
        setCharacterWeightKg(data.characterWeightKg ? String(data.characterWeightKg) : '');
        setHomeplanet(data.homeplanet || '');
        setBackground(data.background || '');
        // initialize challenge edits
        const base: Record<number, ChallengeSubmission> = {};
        for (let lvl = 1; lvl <= 7; lvl++) {
          const existing = (data.challengeSubmissions || []).find((s: any) => s.level === lvl) || {};
          base[lvl] = { level: lvl, youtubeUrl: existing.youtubeUrl || '', witnessName: existing.witnessName || '', witnessDiscordId: existing.witnessDiscordId || '' };
        }
        setChallengeEdits(base);
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

  if (status === 'loading') {
    return <ProfileContainer>Loading session…</ProfileContainer>;
  }

  if (!session) {
    return (
      <ProfileContainer>
        <p>Please <a href="/auth">sign in</a> to view your profile.</p>
      </ProfileContainer>
    );
  }

  const handleSaveProfile = async () => {
    setSaving(true);
    try {
      const form = new FormData();
      if (characterHeightCm) form.append('characterHeightCm', characterHeightCm);
      if (characterWeightKg) form.append('characterWeightKg', characterWeightKg);
      if (homeplanet) form.append('homeplanet', homeplanet);
      if (background) form.append('background', background);
      if (avatarFile) form.append('avatar', avatarFile);
      const res = await fetch('/api/users/me', { method: 'PUT', body: form });
      const data = await res.json();
      setUserData(data);
    } finally {
      setSaving(false);
    }
  };

  const handleSaveChallenge = async (lvl: number) => {
    setSaving(true);
    try {
      const edit = challengeEdits[lvl];
      const form = new FormData();
      form.append('challengeLevel', String(lvl));
      if (edit.youtubeUrl) form.append('youtubeUrl', edit.youtubeUrl);
      if (edit.witnessName) form.append('witnessName', edit.witnessName);
      if (edit.witnessDiscordId) form.append('witnessDiscordId', edit.witnessDiscordId);
      const res = await fetch('/api/users/me', { method: 'PUT', body: form });
      const data = await res.json();
      setUserData(data);
    } finally {
      setSaving(false);
    }
  };

  return (
    <ProfileContainer>
      <h1 style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        {userData?.name || 'Your Profile'}
        {allSevenComplete && <Star title="All 7 challenges submitted">⭐</Star>}
      </h1>

      <Section>
        <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
          <Avatar src={userData?.customAvatarDataUrl || userData?.image || '/images/default-avatar.png'} alt="Avatar" />
          <div>
            <Row>
              <label>Height (cm)</label>
              <Input value={characterHeightCm} onChange={(e) => setCharacterHeightCm(e.target.value)} placeholder="e.g., 180" />
            </Row>
            <Row>
              <label>Weight (kg)</label>
              <Input value={characterWeightKg} onChange={(e) => setCharacterWeightKg(e.target.value)} placeholder="e.g., 80" />
            </Row>
            <Row>
              <label>Homeplanet</label>
              <Input value={homeplanet} onChange={(e) => setHomeplanet(e.target.value)} placeholder="e.g., Super Earth" />
            </Row>
            <Row>
              <label>Background</label>
              <TextArea value={background} onChange={(e) => setBackground(e.target.value)} placeholder="RP background" />
            </Row>
            <Row>
              <label>Profile Picture</label>
              <Input type="file" accept="image/*" onChange={(e) => setAvatarFile(e.target.files?.[0] || null)} />
            </Row>
            <div style={{ display: 'flex', gap: 8 }}>
              <Button onClick={handleSaveProfile} disabled={saving}>{saving ? 'Saving…' : 'Save Profile'}</Button>
            </div>
          </div>
        </div>
      </Section>

      <Section>
        <h2>Challenge Submissions</h2>
        <p style={{ color: '#94a3b8', marginBottom: 12 }}>Provide a YouTube link or a witness name/Discord for each level. Submissions auto-update per level.</p>
        <div style={{ display: 'grid', gap: 12 }}>
          {Array.from({ length: 7 }, (_, i) => i + 1).map((lvl) => (
            <div key={lvl} style={{ border: '1px solid #334155', borderRadius: 8, padding: 12 }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
                <strong>Level {lvl}</strong>
                { (userData?.challengeSubmissions || []).some((s: any) => s.level === lvl && (s.youtubeUrl || s.witnessName || s.witnessDiscordId)) && <span>✅</span> }
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr auto', gap: 8 }}>
                <Input placeholder="YouTube URL" value={challengeEdits[lvl]?.youtubeUrl || ''} onChange={(e) => setChallengeEdits((prev) => ({ ...prev, [lvl]: { ...prev[lvl], youtubeUrl: e.target.value } }))} />
                <Input placeholder="Witness Name" value={challengeEdits[lvl]?.witnessName || ''} onChange={(e) => setChallengeEdits((prev) => ({ ...prev, [lvl]: { ...prev[lvl], witnessName: e.target.value } }))} />
                <Input placeholder="Witness Discord ID" value={challengeEdits[lvl]?.witnessDiscordId || ''} onChange={(e) => setChallengeEdits((prev) => ({ ...prev, [lvl]: { ...prev[lvl], witnessDiscordId: e.target.value } }))} />
                <Button onClick={() => handleSaveChallenge(lvl)} disabled={saving}>Save</Button>
              </div>
            </div>
          ))}
        </div>
      </Section>
    </ProfileContainer>
  );
}
