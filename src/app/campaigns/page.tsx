// src/app/(main)/helldivers-2/campaigns/page.tsx
'use client';

import React, { useState } from 'react';
import { FaChevronDown } from 'react-icons/fa';
import base from '../styles/HelldiversBase.module.css';
import exp from '@/components/common/Expanders.module.css';
import code from '@/components/common/CodeBlocks.module.css';
import SubmitCampaignModal from '@/components/campaigns/SubmitCampaignModal';
import YoutubeCarouselPlaceholder from '@/components/campaigns/YoutubeCarouselCampaigns';

interface PrestigeMissionData {
  id: string;
  title: string;
  details: string;
}

const prestigeMissions: PrestigeMissionData[] = [
  {
    id: 'level-8',
    title: 'JH8 Terminid Spawn Camp',
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
    title: 'JH9 Automaton Hell Strike',
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
    title: 'JH10 Lethal Pacifist',
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
    title: 'JH11 Total Area Scorching',
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

/**
 * Map of campaign ID -> list of public YouTube URLs (watch/shorts/share/embed).
 * The placeholder will convert these to embed URLs automatically.
 */
const campaignVideoUrls: Record<string, string[]> = {
  'level-8': [
    // 'https://youtu.be/xxxxxxxxxxx',
    // 'https://www.youtube.com/watch?v=xxxxxxxxxxx',
  ],
  'level-9': [],
  'level-10': [],
  'level-11': [],
};

export default function CampaignsPage() {
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});
  const [isSubmitModalOpen, setIsSubmitModalOpen] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const toggleExpansion = (id: string) => {
    setExpanded((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <div className={base.wrapper}>
      <div className={base.dividerLayer} />
      <div className={base.pageContainer}>
        <section className={base.section} id="gpt-campaign-missions">
          <h2 className={base.sectionTitle}>GPT Prestige Operations</h2>

          <div className={base.subsectionCard}>
            <h3 className={base.subHeading}>Rules & Requirements</h3>
            <ul className={`${base.styledList} ${base.decimal}`}>
              <li className={base.listItem}>
                If it&apos;s on the map, it&apos;s in play unless the specific
                challenge level states otherwise.
              </li>
              <li className={base.listItem}>
                Video submissions must be one continuous, unedited recording. No
                cuts, splits, or speed-ups.
              </li>
              <li className={base.listItem}>
                Mission privacy must be set to Invite Only.
              </li>
            </ul>
          </div>

          <div className={base.subsectionCard}>
            <h3 className={base.subHeading}>John Helldiver Campaigns</h3>

            {prestigeMissions.map((mission) => {
              const isExpanded = !!expanded[mission.id];
              const videosForMission = campaignVideoUrls[mission.id] || [];

              return (
                <div
                  key={mission.id}
                  className={exp.challengeLevelContainer}
                  id={mission.id}
                  style={{ scrollMarginTop: 96 }}
                >
                  <div
                    className={`${exp.challengeHeader} ${!isExpanded ? exp.noBorderBottom : ''}`}
                    onClick={() => toggleExpansion(mission.id)}
                    role="button"
                    aria-expanded={isExpanded}
                    aria-controls={`mission-content-${mission.id}`}
                    tabIndex={0}
                    onKeyDown={(e) =>
                      (e.key === 'Enter' || e.key === ' ') &&
                      toggleExpansion(mission.id)
                    }
                  >
                    <h4 className={base.subHeading}>{mission.title}</h4>
                    <FaChevronDown
                      className={`${exp.expandIcon} ${isExpanded ? exp.rotated : ''}`}
                      aria-hidden="true"
                    />
                  </div>

                  <div
                    id={`mission-content-${mission.id}`}
                    className={`${exp.challengeDetailsContent} ${isExpanded ? exp.expanded : ''}`}
                  >
                    <pre className={code.codeBlock}>{mission.details}</pre>

                    {/* YouTube carousel/placeholder fed by string URLs */}
                    <YoutubeCarouselPlaceholder
                      videoUrls={videosForMission}
                      title={mission.title}
                    />
                  </div>
                </div>
              );
            })}
          </div>

          <div style={{ display: 'flex', justifyContent: 'center', marginTop: 16 }}>
            <button
              className="btn btn-secondary"
              onClick={() => {
                setMessage(null);
                setIsSubmitModalOpen(true);
              }}
            >
              Submit Campaign
            </button>
          </div>
        </section>

        {message && (
          <p className={base.paragraph} style={{ textAlign: 'center' }}>
            {message}
          </p>
        )}

        <SubmitCampaignModal
          isOpen={isSubmitModalOpen}
          onClose={() => setIsSubmitModalOpen(false)}
          onSubmitted={(msg) => setMessage(msg)}
          missions={prestigeMissions}
        />
      </div>
    </div>
  );
}
