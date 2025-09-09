'use client';
/* eslint-disable @next/next/no-img-element */

import { useEffect, useMemo, useRef, useState } from 'react';
import { useSession } from 'next-auth/react';
import useSWR from 'swr';
import baseStyles from '../helldivers-2/HelldiversBase.module.css';
import styles from '@/components/profile/Profile.module.css';

import ProfileHeader from '@/components/profile/ProfileHeader';
import SidebarTabs, { type InfoTab } from '@/components/profile/SidebarTabs';
import {
  RolesSection,
  AwardsSection,
  SquadSection,
  RankingsSection,
  ActivitySection,
  MeritSection,
  LinkedSection,
} from '@/components/profile/Sections';
import CareerSummary from '@/components/profile/CareerSummary';

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

const fetcher = (url: string) => fetch(url).then((r) => r.json());

export default function ProfilePage() {
  const { data: session, status } = useSession();
  const [userData, setUserData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const savedRankingOnce = useRef(false);

  // Leaderboards batch (solo, month, lifetime)
  const now = new Date();
  const qsBatch = new URLSearchParams({
    scopes: 'solo,month,lifetime',
    sortBy: 'Kills',
    sortDir: 'desc',
    limit: '1000',
    month: String(now.getUTCMonth() + 1),
    year: String(now.getUTCFullYear()),
  }).toString();
  const { data: batchData } = useSWR(`/api/helldivers/leaderboard/batch?${qsBatch}`, fetcher);
  const soloData = batchData?.solo;
  const monthData = batchData?.month;
  const lifetimeData = batchData?.lifetime;

  // Load profile
  useEffect(() => {
    if (status === 'authenticated') {
      (async () => {
        setLoading(true);
        const [resMe, resLast] = await Promise.all([
          fetch('/api/users/me?include=avatar,submissions'),
          fetch('/api/users/profile/last'),
        ]);
        const me = await resMe.json();
        const last = resLast.ok ? await resLast.json() : { last_profile: null };
        const lastProfile = last?.last_profile || null;
        setUserData({ ...me, lastProfile });
        setLoading(false);
      })();
    }
  }, [status]);

  // All seven challenges complete?
  const allSevenComplete = useMemo(() => {
    const submissions = userData?.challengeSubmissions || [];
    let count = 0;
    for (let lvl = 1; lvl <= 7; lvl++) {
      const s = submissions.find((x: any) => x.level === lvl);
      if (s && (s.youtubeUrl || s.witnessName || s.witnessDiscordId)) count++;
    }
    return count === 7;
  }, [userData]);

  // Tabs
  const [infoTab, setInfoTab] = useState<InfoTab>('roles');

  // Helpers
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
    const total = findRankAndRow(lifetimeData?.results || [], userData.name).row;
    const month = findRankAndRow(monthData?.results || [], userData.name).row;
    const solo = findRankAndRow(soloData?.results || [], userData.name).row;
    const row = total || month || solo;
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

  // Persist rankings once/visit
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

  const submissions = userData?.challengeSubmissions || [];
  const campaignCompletions: string[] =
    userData?.campaignCompletions || userData?.lastProfile?.campaignCompletions || [];

  return (
    <div className={baseStyles.wrapper}>
      <div className={baseStyles.dividerLayer} />
      <div className={baseStyles.pageContainer}>
        <ProfileHeader
          name={userData?.name}
          rankTitle={userData?.rankTitle}
          avatarUrl={userData?.customAvatarDataUrl || userData?.image}
        />

        <div className={styles.gridContainer}>
          <SidebarTabs active={infoTab} onChange={setInfoTab} />

          <main className={styles.content}>
            {infoTab === 'roles' && <RolesSection roles={userData?.discordRoles} />}
            {infoTab === 'awards' && <AwardsSection allSevenComplete={allSevenComplete} />}
            {infoTab === 'squad' && <SquadSection />}
            {infoTab === 'rankings' && (
              <RankingsSection
                name={userData?.name}
                soloRows={soloData?.results || []}
                monthRows={monthData?.results || []}
                lifetimeRows={lifetimeData?.results || []}
                findRankAndRow={findRankAndRow}
                grade={computeGrade()}
              />
            )}
            {infoTab === 'activity' && <ActivitySection />}
            {infoTab === 'merit' && <MeritSection meritPoints={userData?.meritPoints ?? 0} />}
            {infoTab === 'linked' && <LinkedSection twitchUrl={userData?.twitchUrl} />}
          </main>
        </div>

        <CareerSummary
          submissions={submissions}
          campaignCompletions={campaignCompletions}
          challengeLabels={CHALLENGE_LEVEL_LABELS}
          campaignLabels={CAMPAIGN_MISSION_LABELS}
        />
      </div>
    </div>
  );
}
