// src/app/(main)/helldivers-2/challenges/page.tsx
"use client";

import React, { useState } from 'react';
import { FaChevronDown } from 'react-icons/fa';
import SubmitChallengeModal from '@/app/components/challenges/SubmitChallengeModal';

// --- Import CSS Module ---
import styles from '../HelldiversPage.module.css'; // Assuming styles are shared or copied

// --- John Helldiver Challenge Data ---
interface ChallengeLevelData {
    id: string;
    levelTitle: string;
    details: string;
}

const johnHelldiverLevels: ChallengeLevelData[] = [
     { id: 'level-0', levelTitle: 'Basic Clearance', details: `#FORTRESS / MEGA NEST – Solo Base
Extract Required` },
     { id: 'level-1', levelTitle: 'Sabotage Proficiency', details: `#SABOTAGE MISSION (Command Bunker, Airfield, Orbital Cannon, Nuke Nursery, Purge Hatchery)
No special restrictions
Extract Required` },
     { id: 'level-2', levelTitle: 'Resource Denial', details: `#SABOTAGE MISSION (Command Bunker, Airfield, Orbital Cannon, Nuke Nursery, Purge Hatchery)
No Stratagems
No Resupply
Extract Required` },
     { id: 'level-3', levelTitle: 'ICBM Control', details: `#ICBM
No Stratagems
Extract Required` },
     { id: 'level-4', levelTitle: 'Flawless ICBM', details: `#ICBM
No Stratagems
No Resupply
No Deaths
Extract Required` },
     { id: 'level-5', levelTitle: 'Perfect Survey', details: `#Geological Survey
No Deaths
Extract Required` },
     { id: 'level-6', levelTitle: 'Eagle Ace', details: `#Capture Flag
Eagles Only
Extract Required` },
     { id: 'level-7', levelTitle: 'The Purist', details: `#ICBM
No Stratagems
Constitution Rifle + Senator with Throwing Knives
No Deaths
No Resupply
All 5 Side Objectives Completed (Jammers, Mortar Emplacements, etc.)
Extract Required
No support weapons found in the mission can be used
Exception: Break Action Shotgun is allowed` },
];


// --- Main Component ---
export default function HelldiverChallengesPage() {
    const [expandedChallenges, setExpandedChallenges] = useState<Record<string, boolean>>({});
    const [isSubmitModalOpen, setIsSubmitModalOpen] = useState<boolean>(false);

    const toggleExpansion = (id: string) => {
        setExpandedChallenges(prev => ({ ...prev, [id]: !prev[id] }));
    };

    return (
        // Apply styles from the imported module
        <div className={styles.pageContainer}>
            {/* === John Helldiver Missions === */}
            <section className={styles.section} id="john-helldiver-missions">
                 <h2 className={styles.sectionTitle}>John Helldiver Missions</h2>
                 <div className={styles.subsectionCard}>
                    <h3 className={styles.subHeading}>Rules & Requirements</h3>
                    <ul className={`${styles.styledList} ${styles.decimal}`}>
                        <li className={styles.listItem}>If it's on the map, it's in play unless the specific challenge level states otherwise.</li>
                        <li className={styles.listItem}>Video submissions must be one continuous, unedited recording. No cuts, splits, or speed-ups.</li>
                        <li className={styles.listItem}>Mission privacy must be set to Invite Only.</li>
                    </ul>
                 </div>

                 <div className={styles.subsectionCard}>
                   <h3 className={styles.subHeading}>Challenge Levels</h3>
                   {johnHelldiverLevels.map((challenge) => {
                       const isExpanded = !!expandedChallenges[challenge.id];
                       return (
                           <div key={challenge.id} className={styles.challengeLevelContainer} id={challenge.id} style={{ scrollMarginTop: 96 }}>
                               <div
                                   className={`${styles.challengeHeader} ${!isExpanded ? styles.noBorderBottom : ''}`}
                                   onClick={() => toggleExpansion(challenge.id)}
                                   role="button" aria-expanded={isExpanded} aria-controls={`challenge-content-${challenge.id}`}
                                   tabIndex={0} onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && toggleExpansion(challenge.id)}
                               >
                                   <h4 className={styles.challengeLevelTitle}>{challenge.levelTitle}</h4>
                                   <FaChevronDown className={`${styles.expandIcon} ${isExpanded ? styles.rotated : ''}`} aria-hidden="true"/>
                               </div>
                               <div
                                   id={`challenge-content-${challenge.id}`}
                                   className={`${styles.challengeDetailsContent} ${isExpanded ? styles.expanded : ''}`}
                               >
                                   <pre className={styles.codeBlock}>{challenge.details}</pre>
                               </div>
                           </div>
                       );
                   })}
                 </div>

                 <div style={{ display: 'flex', justifyContent: 'center', marginTop: 16 }}>
                   <button className="btn btn-secondary" onClick={() => setIsSubmitModalOpen(true)}>Submit Challenge</button>
                 </div>
            </section>

            <SubmitChallengeModal
              isOpen={isSubmitModalOpen}
              onClose={() => setIsSubmitModalOpen(false)}
              onSubmitted={() => setIsSubmitModalOpen(false)}
            />
        </div>
    );
}
// This is a new file for the Helldivers 2 Challenges page.
