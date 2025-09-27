// src/app/profile/me/_client/AwardsClient.tsx
'use client';

import s from '@/styles/ProfileEditForm.module.css';

export default function AwardsClient({
  challengeSubmissions,
  campaignCompletions,
  challengeLabels,
  campaignLabels,
}: {
  challengeSubmissions: any[];
  campaignCompletions: string[];
  challengeLabels: string[];
  campaignLabels: string[];
}) {
  const challengeCount = (() => {
    let c = 0;
    for (let i = 1; i <= 7; i++) {
      const sub = challengeSubmissions.find((x: any) => x.level === i);
      if (sub && (sub.youtubeUrl || sub.witnessName || sub.witnessDiscordId)) c++;
    }
    return c;
  })();

  const campSet = new Set(campaignCompletions);

  const chip = (label: string, complete = false) => (
    <span
      key={label}
      style={{
        padding: '0.35rem 0.6rem',
        borderRadius: 8,
        border: '1px solid #334155',
        background: complete ? 'rgba(180, 140, 0, 0.2)' : 'rgba(0,0,0,0.2)',
        color: complete ? '#f59e0b' : '#94a3b8',
        fontWeight: 600,
      }}
    >
      {label}
    </span>
  );

  return (
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
              {challengeCount}/{challengeLabels.length}
            </span>
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
            {challengeLabels.map((label, i) => {
              const lvl = i + 1;
              const sub = (challengeSubmissions || []).find((x: any) => x.level === lvl);
              const complete = !!(
                sub && (sub.youtubeUrl || sub.witnessName || sub.witnessDiscordId)
              );
              return chip(label, complete);
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
              {new Set(campaignCompletions).size}/{campaignLabels.length}
            </span>
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
            {campaignLabels.map((label) => chip(label, campSet.has(label)))}
          </div>
        </div>
      </div>
    </section>
  );
}
