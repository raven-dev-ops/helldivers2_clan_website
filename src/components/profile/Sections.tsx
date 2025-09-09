'use client';

import styles from './Profile.module.css';

export function RolesSection({ roles }: { roles?: Array<{ id: string; name: string }> }) {
  return (
    <div>
      <h3 className={styles.contentTitle}>Discord Roles</h3>
      {Array.isArray(roles) && roles.length > 0 ? (
        <div>
          {roles.map((r) => (
            <span key={r.id} className={styles.chip}>
              {r.name}
            </span>
          ))}
        </div>
      ) : (
        <p>
          No Discord roles detected. Roles are synced automatically when you join the Discord
          server and link your account.
        </p>
      )}
    </div>
  );
}

export function AwardsSection({ allSevenComplete }: { allSevenComplete: boolean }) {
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
}

export function SquadSection() {
  return (
    <div>
      <h3 className={styles.contentTitle}>Squad</h3>
      <p>Coming soon.</p>
    </div>
  );
}

export function RankingsSection({
  name,
  soloRows,
  monthRows,
  lifetimeRows,
  findRankAndRow,
  grade,
}: {
  name?: string | null;
  soloRows: any[];
  monthRows: any[];
  lifetimeRows: any[];
  findRankAndRow: (rows: any[], n: string) => { rank: number | null; row: any };
  grade: string | null;
}) {
  if (!name) {
    return (
      <div>
        <h3 className={styles.contentTitle}>Leaderboard Rankings</h3>
        <p>Set your profile name to see your leaderboard rankings.</p>
      </div>
    );
  }

  const solo = findRankAndRow(soloRows, name).rank ?? '—';
  const month = findRankAndRow(monthRows, name).rank ?? '—';
  const lifetime = findRankAndRow(lifetimeRows, name).rank ?? '—';

  return (
    <div>
      <h3 className={styles.contentTitle}>Leaderboard Rankings</h3>
      <div className={styles.statGrid}>
        <div className={styles.statCard}>
          <div className={styles.statLabel}>Solo</div>
          <div className={styles.statValue}>{solo}</div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statLabel}>Monthly</div>
          <div className={styles.statValue}>{month}</div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statLabel}>Lifetime</div>
          <div className={styles.statValue}>{lifetime}</div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statLabel}>Grade</div>
          <div className={styles.statValue}>{grade ?? '—'}</div>
        </div>
      </div>
    </div>
  );
}

export function ActivitySection() {
  return (
    <div>
      <h3 className={styles.contentTitle}>Activity</h3>
      <p>Coming soon.</p>
    </div>
  );
}

export function MeritSection({ meritPoints = 0 }: { meritPoints?: number }) {
  return (
    <div>
      <h3 className={styles.contentTitle}>Merit</h3>
      <div className={styles.statGrid}>
        <div className={styles.statCard}>
          <div className={styles.statLabel}>Merit Points</div>
          <div className={styles.statValue}>{meritPoints}</div>
        </div>
      </div>
    </div>
  );
}

export function LinkedSection({ twitchUrl }: { twitchUrl?: string | null }) {
  return (
    <div>
      <h3 className={styles.contentTitle}>Linked Accounts</h3>
      {twitchUrl ? (
        <a href={twitchUrl} target="_blank" rel="noopener noreferrer" aria-label="Twitch">
          {/* keep icon external to avoid importing here if you prefer */}
          <span className={styles.chip}>Twitch</span>
        </a>
      ) : (
        <p>No accounts linked.</p>
      )}
    </div>
  );
}
