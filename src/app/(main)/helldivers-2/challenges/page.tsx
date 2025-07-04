// src/app/(main)/helldivers-2/challenges/page.tsx
"use client";

import React, { useState } from 'react';
import { FaChevronDown, FaChevronUp } from 'react-icons/fa';

// --- Import CSS Module ---
import styles from '../HelldiversPage.module.css'; // Assuming styles are shared or copied

// --- John Helldiver Challenge Data ---
interface ChallengeLevelData {
    id: string;
    levelTitle: string;
    details: string;
}

const challengeLevels: ChallengeLevelData[] = [
     { id: 'level-0', levelTitle: 'LEVEL 0 - Basic Clearance', details: `MISSION TYPE: Eradicate Automaton Forces (Fortress) / Purge Hatcheries (Mega Nest)\nOBJECTIVE:    Complete the main objective.\nREQUIREMENTS: Solo\nEXTRACT:      Required` },
     { id: 'level-1', levelTitle: 'LEVEL 1 - Sabotage Proficiency', details: `MISSION TYPE: Sabotage Air Base / Destroy Command Bunkers / Sabotage Supply Bases (Orbital Cannon / Nuke Nursery)\nOBJECTIVE:    Complete the main objective.\nREQUIREMENTS: Solo\nEXTRACT:      Required` },
     { id: 'level-2', levelTitle: 'LEVEL 2 - Resource Denial', details: `MISSION TYPE: Sabotage Air Base / Destroy Command Bunkers / Sabotage Supply Bases (Orbital Cannon / Nuke Nursery)\nOBJECTIVE:    Complete the main objective.\nREQUIREMENTS:\n  - Solo\n  - No Stratagems (Eagle, Orbital, Support Wpns, Backpacks)\n  - No Resupply pod usage\nEXTRACT:      Required` },
     { id: 'level-3', levelTitle: 'LEVEL 3 - ICBM Control', details: `MISSION TYPE: Launch ICBM\nOBJECTIVE:    Complete the main objective (Launch ICBM).\nREQUIREMENTS:\n  - Solo\n  - No Stratagems (Eagle, Orbital, Support Wpns, Backpacks)\nEXTRACT:      Required` },
     { id: 'level-4', levelTitle: 'LEVEL 4 - Flawless ICBM', details: `MISSION TYPE: Launch ICBM\nOBJECTIVE:    Complete the main objective.\nREQUIREMENTS:\n  - Solo\n  - No Stratagems\n  - No Resupply pod usage\n  - No Deaths\nEXTRACT:      Required` },
     { id: 'level-5', levelTitle: 'LEVEL 5 - Perfect Survey', details: `MISSION TYPE: Conduct Geological Survey\nOBJECTIVE:    Complete the main objective.\nREQUIREMENTS:\n  - Solo\n  - No Deaths\nEXTRACT:      Required` },
     { id: 'level-6', levelTitle: 'LEVEL 6 - Eagle Ace', details: `MISSION TYPE: Retrieve Essential Personnel (Capture Flag / Civilian Evac)\nOBJECTIVE:    Complete the main objective.\nREQUIREMENTS:\n  - Solo\n  - Only Eagle Stratagems allowed (Airstrike, 500kg, Strafing, etc.)\n    (NO Orbitals, NO Support Wpns/Backpacks unless found)\nEXTRACT:      Required` },
     { id: 'level-7', levelTitle: 'LEVEL 7 - The Purist', details: `MISSION TYPE: Launch ICBM\n\nOBJECTIVE:\n  - Complete the main objective (Launch ICBM)\n  - Complete ALL 5 possible Side Objectives\n    (e.g., SEAF Artillery, Radar Tower, Stalker Lairs, Jammers, Mortars, etc.)\n\nREQUIREMENTS:\n  - Solo\n  - No Stratagems (Eagles, Orbitals, Support Weapons, Backpacks called down)\n  - No Deaths\n  - No Resupply pod usage\n  - Cannot use any Support Weapons found in the mission\n    (e.g., dropped Autocannon, Railgun).\n  - EXCEPTION: SG-8S Slugger found in world IS allowed.\n\nLOADOUT:\n  - Primary:   JAR-5 Dominator (Constitution Rifle)\n  - Secondary: P-6 Senator Revolver\n  - Grenade:   G-3 Throwing Knife\n\nEXTRACT:      Required` },
     { id: 'level-8', levelTitle: 'LEVEL 8 - PRESTIGE #1: Terminid Spawn Camp', details: `MISSION TYPE: Sabotage Supply Bases (Nuke Nursery) OR Purge Hatcheries (Terminid Drill)\n\nOBJECTIVE:    Full Clear\n  - Complete Main Objective\n  - Complete ALL Side Objectives\n  - Destroy ALL Fabricators / Bug Holes\n\nREQUIRED LOADOUT:\n  - Armor:     B-01 Tactical\n  - Primary:   AR-23E Liberator Explosive (Adjudicator)\n  - Secondary: GP-31 Grenade Pistol (Verdict)\n  - Grenade:   G-12 High Explosive (Impact)\n\nREQUIRED STRATAGEMS:\n  - Eagle Strafing Run\n  - Eagle Airstrike\n  - Orbital Precision Strike\n  - RS-422 Railgun\n\nREQUIREMENTS:\n  - Solo\nEXTRACT:      Required` },
     { id: 'level-9', levelTitle: 'LEVEL 9 - PRESTIGE #2: Automaton Hell Strike', details: `MISSION TYPE: Sabotage Supply Bases (Neutralize Orbital Cannons)\n\nOBJECTIVE:    Full Clear\n  - Complete Main Objective\n  - Complete ALL Side Objectives\n  - Destroy ALL Fabricators\n\nREQUIREMENTS:\n  - Solo\n  - No Deaths\n\nREQUIRED LOADOUT:\n  - Armor:     FS-05 Marksman (Exterminator)\n  - Primary:   PLAS-1 Scorcher (Plasma Punisher)\n  - Secondary: P-6 Senator Revolver\n  - Grenade:   G-10 Incendiary (Thermite)\n\nREQUIRED STRATAGEMS:\n  - Eagle Airstrike\n  - Orbital 120MM HE Barrage\n  - RS-422 Railgun\n  - A/MLS-4X Rocket Sentry\n\nEXTRACT:      Required` },
];

// --- Main Component ---
export default function HelldiverChallengesPage() {
    const [expandedChallenges, setExpandedChallenges] = useState<Record<string, boolean>>({});

    // Toggle function for challenge expanders
    const toggleChallengeExpansion = (challengeId: string) => {
        setExpandedChallenges(prev => ({
            ...prev,
            [challengeId]: !prev[challengeId]
        }));
    };

    return (
        // Apply styles from the imported module
        <div className={styles.pageContainer}>
            {/* === John Helldiver Course Section === */}
            <section className={styles.section}>
                 <h2 className={styles.sectionTitle}>John Helldiver Course & Challenges</h2>
                 <p className={`${styles.paragraph} ${styles.textItalic}`} style={{textAlign: 'center', marginBottom: '2rem'}}> {/* Use multiple classes */}
                     <strong className={styles.strongText}>NO SEED FARMING</strong> - HELLDIVERS DO NOT CHERRY PICK MISSIONS TO WIN, WE JUST WIN.
                 </p>
                 <p className={styles.paragraph}>
                     Ready to prove your mettle, Helldiver? The John Helldiver Course is a series of increasingly difficult solo challenges designed to test your skill, strategy, and adherence to Super Earth protocol. You MUST submit your videos in the <code className={styles.inlineCode}>#🪖｜training</code> channel on our Discord for review and verification by <code className={styles.inlineCode}>@JOHN HELLDIVER</code>. Respect the community and the challenge rules, or face the consequences (potentially airlocking).
                 </p>
                 {/* Use subsection card for Rules */}
                 <div className={styles.subsectionCard}>
                    <h3 className={styles.subHeading}>Rules & Requirements:</h3> {/* Use SubHeading style */}
                    <ul className={`${styles.styledList} ${styles.decimal}`}> {/* Use List styles */}
                        <li className={styles.listItem}>If it's on the map, it's in play... *unless* the specific challenge level states otherwise.</li>
                        <li className={styles.listItem}>Video submissions must be one continuous, unedited recording... No cuts, splits, speed-ups...</li>
                        <li className={styles.listItem}>Mission privacy must be set to <strong className={styles.strongText}>Invite Only</strong>...</li>
                    </ul>
                 </div>

                 {/* Use subsection card for Difficulty Order */}
                 <div className={styles.subsectionCard}>
                    <h3 className={styles.subHeading}>Order of Difficulty (Super Helldive - Difficulty 10):</h3>
                    <p className={styles.paragraph}>Target enemy faction: Automaton (Bots) or Terminids (Bugs).</p>

                    {/* Challenge Levels as Expanders */}
                    {challengeLevels.map((challenge) => {
                        const isExpanded = !!expandedChallenges[challenge.id];
                        return (
                            <div key={challenge.id} className={styles.challengeLevelContainer}>
                                <div
                                    className={`${styles.challengeHeader} ${!isExpanded ? styles.noBorderBottom : ''}`} /* Add conditional border class */
                                    onClick={() => toggleChallengeExpansion(challenge.id)}
                                    role="button" aria-expanded={isExpanded} aria-controls={`challenge-content-${challenge.id}`}
                                    tabIndex={0} onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && toggleChallengeExpansion(challenge.id)}
                                >
                                    <h4 className={styles.challengeLevelTitle}>{challenge.levelTitle}</h4>
                                    <FaChevronDown className={`${styles.expandIcon} ${isExpanded ? styles.rotated : ''}`} aria-hidden="true"/> {/* Conditional rotation */}
                                </div>
                                <div
                                    id={`challenge-content-${challenge.id}`}
                                    className={`${styles.challengeDetailsContent} ${isExpanded ? styles.expanded : ''}`} /* Conditional expansion */
                                >
                                    {/* Use codeBlock style for preformatted text */}
                                    <pre className={styles.codeBlock}>{challenge.details}</pre>
                                </div>
                            </div>
                        );
                    })}
                 </div>
            </section>
        </div>
    );
}
// This is a new file for the Helldivers 2 Challenges page.
