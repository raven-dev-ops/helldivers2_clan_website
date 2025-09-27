'use client';

import styles from './Profile.module.css';

export default function CareerSummary({
  submissions,
  campaignCompletions,
  challengeLabels,
  campaignLabels,
}: {
  submissions: any[];
  campaignCompletions: string[];
  challengeLabels: string[];
  campaignLabels: string[];
}) {
  const completeCount = (lvlIdx: number) => {
    const lvl = lvlIdx + 1;
    const s = submissions.find((x: any) => x.level === lvl);
    return !!(s && (s.youtubeUrl || s.witnessName || s.witnessDiscordId));
  };

  const challengeCompleted = challengeLabels.reduce(
    (acc, _, i) => acc + (completeCount(i) ? 1 : 0),
    0
  );

  const campaignSet = new Set(campaignCompletions);
  const campaignCompleted = campaignLabels.reduce(
    (acc, label) => acc + (campaignSet.has(label) ? 1 : 0),
    0
  );

  return (
    <section className={styles.content}>
      <h2 className={styles.contentTitle}>GPT Career</h2>

      {/* Challenges */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
        <strong style={{ color: '#f59e0b' }}>Challenges</strong>
        <span style={{ color: '#f59e0b', fontWeight: 600 }}>
          {challengeCompleted}/{challengeLabels.length}
        </span>
      </div>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 16 }}>
        {challengeLabels.map((label, i) => {
          const complete = completeCount(i);
          return (
            <span
              key={label}
              className={styles.chip}
              style={{
                background: complete ? 'rgba(180, 140, 0, 0.2)' : 'rgba(0,0,0,0.2)',
                color: complete ? '#f59e0b' : '#94a3b8',
              }}
            >
              {label}
            </span>
          );
        })}
      </div>

      {/* Campaigns */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
        <strong style={{ color: '#f59e0b' }}>Campaign</strong>
        <span style={{ color: '#f59e0b', fontWeight: 600 }}>
          {campaignCompleted}/{campaignLabels.length}
        </span>
      </div>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
        {campaignLabels.map((label) => {
          const complete = campaignSet.has(label);
          return (
            <span
              key={label}
              className={styles.chip}
              style={{
                background: complete ? 'rgba(180, 140, 0, 0.2)' : 'rgba(0,0,0,0.2)',
                color: complete ? '#f59e0b' : '#94a3b8',
              }}
            >
              {label}
            </span>
          );
        })}
      </div>
    </section>
  );
}
