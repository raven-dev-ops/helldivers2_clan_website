// src/app/(main)/helldivers-2/campaigns/page.tsx
"use client";

import React, { useState } from 'react';
import { FaChevronDown } from 'react-icons/fa';
import styles from '../HelldiversPage.module.css';

interface PrestigeMissionData {
  id: string;
  title: string;
  details: string;
  link?: string;
}

const prestigeMissions: PrestigeMissionData[] = [
  {
    id: 'level-8',
    title: 'Prestige #1: Terminid Spawn Camp',
    link: 'https://youtu.be/eZfzyR0ecjs?si=ncTuMW_IZ02K1lP7',
    details: `Nuke Nursery Hive Drill Mission
Full Clear (Main Objective, Sub Objective, All Nests)
Must Extract

Required Loadout:
Armor: B-01 Tactical
Primary: Adjudicator
Secondary: Verdict
Grenade: Impact

Required Stratagems:
Strafing Run
Eagle Airstrike
Orbital Precision Strike
Railgun`,
  },
  {
    id: 'level-9',
    title: 'Prestige #2: Automaton Hell Strike',
    link: 'https://youtu.be/hn5lxqgN940?si=ztszXK0vMaFNBE3g',
    details: `Neutralize Orbital Cannons
Full Clear (Main Objective, Sub Objectives, All Enemies)
No Deaths

Required Loadout:
Armor: Exterminator
Primary: Plasma Punisher
Secondary: Senator
Grenade: Thermite

Required Stratagems:
Eagle Airstrike
120mm HE Barrage
Railgun
Rocket Sentry`,
  },
  {
    id: 'level-10',
    title: 'Prestige #3: Lethal Pacifist',
    link: 'https://youtu.be/S8MJ7Q9VHlo',
    details: `ICBM
Full Clear (Main Objective, Sub Objectives, All Enemies)
No Deaths
No Shots Fired

Required Loadout:
Armor: Any
Primary: Any
Secondary: Any Melee Weapon
Grenade: Thermite

Required Stratagems:
No Weapon Stratagems
Orbital Precision Strike
Eagle Strafing Run
Any Sentry`,
  },
  {
    id: 'level-11',
    title: 'Prestige #4: Total Area Scorching',
    link: 'https://youtu.be/JOucNd0dNOI',
    details: `Command Bunkers
Full Clear (Main Objective, Sub Objective)

Required Loadout:
Armor: Any
Primary: SG-8P Punisher Plasma
Secondary: P-113 Verdict
Grenade: G-123 Thermite

Required Stratagems:
Eagle Strafing Run
Orbital Barrage (120mm, 380mm, or Walking Barrage)
Orbital Precision Strike
Mortar Sentry`,
  },
];

export default function CampaignsPage() {
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});

  const toggleExpansion = (id: string) => {
    setExpanded(prev => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <div className={styles.pageContainer}>
      <section className={styles.section} id="gpt-campaign-missions">
        <h2 className={styles.sectionTitle}>GPT Campaign Missions</h2>
        <div className={styles.subsectionCard}>
          <h3 className={styles.subHeading}>Prestige Missions</h3>
          {prestigeMissions.map((mission) => {
            const isExpanded = !!expanded[mission.id];
            return (
              <div key={mission.id} className={styles.challengeLevelContainer} id={mission.id} style={{ scrollMarginTop: 96 }}>
                <div
                  className={`${styles.challengeHeader} ${!isExpanded ? styles.noBorderBottom : ''}`}
                  onClick={() => toggleExpansion(mission.id)}
                  role="button" aria-expanded={isExpanded} aria-controls={`mission-content-${mission.id}`}
                  tabIndex={0} onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && toggleExpansion(mission.id)}
                >
                  <h4 className={styles.challengeLevelTitle}>{mission.title}</h4>
                  <FaChevronDown className={`${styles.expandIcon} ${isExpanded ? styles.rotated : ''}`} aria-hidden="true"/>
                </div>
                <div id={`mission-content-${mission.id}`} className={`${styles.challengeDetailsContent} ${isExpanded ? styles.expanded : ''}`}>
                  <pre className={styles.codeBlock}>{mission.details}</pre>
                  {mission.link && (
                    <p className={styles.paragraph}>
                      Proof/Video: <a href={mission.link} target="_blank" rel="noopener noreferrer" className={styles.link}>Watch</a>
                    </p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}
