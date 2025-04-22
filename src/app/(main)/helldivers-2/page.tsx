// src/app/(main)/helldivers-2/page.tsx
"use client";

import Image from 'next/image';
import Link from 'next/link';
import React, { useState, useEffect } from 'react';
import { FaStar } from 'react-icons/fa';

// --- Review Data Structure & Data ---
interface Review { id: number; author: string; title: string; text: string; rating: number; }
const reviews: Review[] = [
    { id: 1, author: "joshgiff", title: "A Solid Growing Community", text: "Safe, active and growing community...", rating: 5 },
    { id: 2, author: "charredviolet8771", title: "Democracy Approved", text: "Community has been so welcoming...", rating: 5 },
    { id: 3, author: "silverdolphin01", title: "Great Community", text: "Great community! Recommend to new and experienced...", rating: 5 },
    { id: 4, author: "krieg112", title: "Great, Non-toxic, and Casual", text: "Training program was a great way of connecting...", rating: 5 },
    { id: 5, author: "zephthehuman", title: "Best non toxic Helldivers 2 Community", text: "If you are looking for a ... mature community...", rating: 5 },
    { id: 11, author: "vetscape", title: "A Fleet To Call Home...", text: "My goal for GPT Fleet is to have a HD2 focused community...", rating: 5 },
];

// --- Style Object (Reduced for Layout Handled by CSS) ---
const styles = {
    pageContainer: {
        maxWidth: '1200px', margin: '0 auto', padding: '2rem 1rem 4rem',
        color: 'var(--color-text-primary, #e0e0e0)',
    },
    mainTitle: { fontSize: 'clamp(2.2rem, 6vw, 3rem)', fontWeight: 700, textAlign: 'center', marginBottom: '0.5rem', color: 'var(--color-primary, #00bcd4)' } as React.CSSProperties,
    subTitle: { fontSize: 'clamp(1.1rem, 3vw, 1.3rem)', textAlign: 'center', color: 'var(--color-text-secondary, #b0bec5)', marginBottom: '2.5rem' } as React.CSSProperties,

    // --- Top Section: Styles for elements INSIDE columns ---
    // Note: Flex layout (display, direction, gap, width%) is now in globals.css

    // Left Column Content Styles
    disboardLink: { // Style for the Disboard link appearance
        display: 'block', // Ensures it takes its own line if needed
        textAlign: 'center', // Center text within the link block
        fontSize: '0.9rem',
        color: 'var(--color-primary-hover, #0097a7)',
        textDecoration: 'underline',
        textUnderlineOffset: '3px',
        marginTop: '0.5rem', // Add some space above it
        // Hover handled by browser default or add a specific class + :hover rule in globals.css if needed
    } as React.CSSProperties,
    discordServerText: { // Style for the small discord.gg text
        fontSize: '0.8rem',
        color: 'var(--color-text-muted, #64748b)',
        marginTop: '0.5rem',
        textAlign: 'center',
    } as React.CSSProperties,

    // Right Column Content Styles (Video Wrapper)
    videoEmbedWrapper: { // Keep aspect ratio wrapper styles
        position: 'relative', paddingBottom: '56.25%', height: 0, overflow: 'hidden',
        borderRadius: 'var(--border-radius-lg, 0.75rem)',
        boxShadow: '0 10px 20px rgba(0,0,0,0.3)',
        border: '1px solid var(--color-border, #334155)',
        width: '100%', // Make wrapper fill the right column
    } as React.CSSProperties,
    videoIframe: { // Keep iframe absolute positioning
        position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', border: 'none'
    } as React.CSSProperties,

    // --- Review Carousel (Keep as before, centered with margin) ---
    reviewContainer: {
        position: 'relative', maxWidth: '550px', minHeight: '170px',
        display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1.5rem 2rem',
        backgroundColor: 'var(--color-surface-alt, rgba(51, 65, 85, 0.5))',
        borderRadius: 'var(--border-radius-lg, 0.75rem)', border: '1px solid var(--color-border, #334155)', textAlign: 'left',
        boxShadow: '0 4px 10px rgba(0,0,0,0.2)',
        margin: '2.5rem auto 3rem', // Center horizontally, add top/bottom margin
    } as React.CSSProperties,
    reviewContent: { width: '100%', opacity: 1, transition: 'opacity 0.6s ease-in-out' },
    reviewContentHidden: { opacity: 0 },
    reviewStars: { display: 'flex', gap: '0.25rem', color: '#facc15', marginBottom: '0.5rem' },
    reviewTitle: { fontSize: '1.1rem', fontWeight: 600, color: 'var(--color-text-primary, #e0e0e0)', marginBottom: '0.5rem' },
    // VVVVVV  CORRECTED LINE BELOW VVVVVV
    reviewText: {
        fontSize: '0.9rem',
        color: 'var(--color-text-secondary, #b0bec5)',
        fontStyle: 'italic',
        marginBottom: '0.75rem',
        lineHeight: 1.5,
        maxHeight: '6em',
        overflow: 'hidden',
        position: 'relative'
    } as React.CSSProperties, // <--- Added type assertion here
    // ^^^^^^ CORRECTED LINE ABOVE ^^^^^^
    reviewAuthor: { fontSize: '0.8rem', color: 'var(--color-text-muted, #64748b)', textAlign: 'right', marginTop: 'auto' } as React.CSSProperties, // Also added assertion here for consistency

    // --- Content Sections (Keep styling as before) ---
    section: {
        marginBottom: '3rem', padding: '1.5rem 2rem',
        backgroundColor: 'var(--color-surface, rgba(30, 41, 59, 0.5))',
        borderRadius: 'var(--border-radius-lg, 0.75rem)',
        boxShadow: '0 4px 10px rgba(0,0,0,0.15)',
        border: '1px solid var(--color-border, #334155)',
    } as React.CSSProperties,
    sectionTitle: { fontSize: 'clamp(1.5rem, 4vw, 1.8rem)', fontWeight: 600, marginBottom: '1.5rem', color: 'var(--color-primary, #00bcd4)', borderBottom: '1px solid var(--color-border)', paddingBottom: '0.5rem' } as React.CSSProperties,
    paragraph: { color: 'var(--color-text-secondary, #b0bec5)', marginBottom: '1rem', lineHeight: 1.7 } as React.CSSProperties,
    strongText: { fontWeight: 600, color: 'var(--color-primary, #00bcd4)' } as React.CSSProperties,
    link: { color: 'var(--color-primary-hover, #0097a7)', textDecoration: 'underline', textUnderlineOffset: '2px' } as React.CSSProperties, // Generic link style
    codeBlock: {
        backgroundColor: 'var(--color-background-alt, #1a1a2e)', border: '1px solid var(--color-border)',
        borderRadius: 'var(--border-radius-md)', padding: '1rem', fontSize: '0.9rem',
        fontFamily: 'var(--font-mono, monospace)', whiteSpace: 'pre-wrap', overflowX: 'auto',
        marginBottom: '1rem', color: 'var(--color-text-secondary)',
    } as React.CSSProperties,
    subHeading: { fontSize: '1.2rem', fontWeight: 600, color: 'var(--color-text-primary)', marginTop: '1.5rem', marginBottom: '0.75rem' } as React.CSSProperties,
    ruleList: { listStyleType: 'decimal', paddingLeft: '1.5rem', marginBottom: '1rem', color: 'var(--color-text-secondary)' } as React.CSSProperties,
    ruleListItem: { marginBottom: '0.5rem', lineHeight: 1.6 } as React.CSSProperties,
    challengeLevel: { fontSize: '1rem', fontWeight: 700, color: 'var(--color-primary)', marginTop: '1.5rem', marginBottom: '0.5rem', borderTop: '1px dashed var(--color-border)', paddingTop: '1rem' } as React.CSSProperties,
};

export default function HelldiversPage() {
    const discordServerLink = "https://discord.gg/gptfleet";
    const reviewSourceLink = "https://disboard.org/server/1214787549655203862";
    const twitchTeamLink = "#"; // Replace if needed

    // State for Review Carousel
    const [currentReviewIndex, setCurrentReviewIndex] = useState(0);
    const [isReviewVisible, setIsReviewVisible] = useState(true);
    // No longer need discordBtnHover state as hover is handled by CSS

    // Effect for Cycling Reviews
    useEffect(() => {
        const intervalId = setInterval(() => {
            setIsReviewVisible(false);
            setTimeout(() => {
                setCurrentReviewIndex((prevIndex) => (prevIndex + 1) % reviews.length);
                setIsReviewVisible(true);
            }, 600);
        }, 10000);
        return () => clearInterval(intervalId);
    }, []);

    const currentReview = reviews[currentReviewIndex];

    // No longer need discordFinalStyle variable

    return (
        <div style={styles.pageContainer}>

             {/* --- Top Section: Links (Left) & Video (Right) --- */}
             {/* Apply the CSS class from globals.css */}
             <div className="helldivers-top-section">

                {/* Left Column - Apply CSS class */}
                <div className="helldivers-left-column">
                    <Link
                        href={discordServerLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        // Apply the specific button class from globals.css
                        className="helldivers-discord-button"
                        // Remove inline style for the button itself
                    >
                        Join the GPT Discord
                    </Link>
                    {/* Use inline style for the small text */}
                    <p style={styles.discordServerText}>discord.gg/gptfleet</p>

                    {reviewSourceLink && (
                        <Link
                            href={reviewSourceLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            // Use inline style for specific link appearance
                            style={styles.disboardLink}
                        >
                            View Community Reviews on Disboard
                        </Link>
                    )}
                </div>

                {/* Right Column - Apply CSS class */}
                <div className="helldivers-right-column">
                    {/* Use inline styles for the wrapper and iframe as before */}
                    <div style={styles.videoEmbedWrapper}>
                        <iframe
                            style={styles.videoIframe}
                            src="https://www.youtube.com/embed/6NjteKyQJRg?si=ThN7AHNjwjGgI_XR"
                            title="YouTube video player"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                            allowFullScreen
                            referrerPolicy="strict-origin-when-cross-origin"
                        ></iframe>
                    </div>
                    {/* Add second video if needed */}
                    {/* <div style={{...styles.videoEmbedWrapper, marginTop: '2rem'}}> ... iframe ... </div> */}
                </div>

            </div>
            {/* --- End Top Section --- */}


            {/* Page Header (Positioned below top section) */}
            <h1 style={styles.mainTitle}>Helldivers 2 Division</h1>
            <p style={styles.subTitle}>Galactic Phantom Taskforce (GPT)</p>


             {/* Review Carousel (Positioned below title/subtitle) */}
             <div style={styles.reviewContainer}>
                <div style={{...styles.reviewContent, ...(!isReviewVisible && styles.reviewContentHidden)}}>
                    {currentReview && (
                        <>
                            <div style={styles.reviewStars}>
                                {Array.from({ length: currentReview.rating }).map((_, i) => ( <FaStar key={i} /> ))}
                            </div>
                            <h3 style={styles.reviewTitle}>{currentReview.title}</h3>
                            <p style={styles.reviewText}>"{currentReview.text}"</p>
                            <p style={styles.reviewAuthor}>- {currentReview.author}</p>
                        </>
                    )}
                </div>
             </div>

            {/* --- Content Sections (Keep as before) --- */}
            <section style={styles.section}>
                <h2 style={styles.sectionTitle}>About the Taskforce</h2>
                 {/* Full paragraph content */}
                 <p style={styles.paragraph}>
                     Welcome to the Galactic Phantom Taskforce (GPT) Helldivers 2 Division! We are a rapidly growing, multi-game community focused on creating a non-toxic, mature, and fun environment for gamers. Whether you're a fresh recruit dropping onto Malevelon Creek for the first time or a seasoned Super Citizen spreading managed democracy across the galaxy, you have a place here.
                 </p>
                 <p style={styles.paragraph}>
                     Our core values center around respect, teamwork, and enjoying the game together. We value every member and strive to provide an inclusive space where players can coordinate missions, share strategies, showcase their triumphs (and epic fails!), and simply hang out. We utilize Discord extensively for communication, LFG (Looking For Group), and organizing community events.
                  </p>
            </section>

            {/* JOHN HELLDIVER COURSE SECTION */}
            <section style={styles.section}>
                <h2 style={styles.sectionTitle}>John Helldiver Course & Challenges</h2>
                 {/* Use inline styles as before for specific text elements */}
                 <p style={{...styles.paragraph, fontStyle: 'italic', textAlign: 'center', marginBottom: '1.5rem'}}>
                    <strong style={styles.strongText}>NO SEED FARMING</strong> - HELLDIVERS DO NOT CHERRY PICK MISSIONS TO WIN, WE JUST WIN.
                 </p>
                 <p style={styles.paragraph}>
                     Ready to prove your mettle, Helldiver? The John Helldiver Course is a series of increasingly difficult solo challenges designed to test your skill, strategy, and adherence to Super Earth protocol. You MUST submit your videos in the <code style={{color: 'var(--color-primary)'}}>#🪖｜training</code> channel on our Discord for review and verification by <code style={{color: 'var(--color-primary)'}}>@JOHN HELLDIVER</code>. Respect the community and the challenge rules, or face the consequences (potentially airlocking).
                 </p>
                 <h3 style={styles.subHeading}>Rules & Requirements:</h3>
                 <ul style={styles.ruleList}>
                     <li style={styles.ruleListItem}>If it's on the map, it's in play. This includes SEAF Artillery, SAM sites, static Machine Gun emplacements, discoverable Ammo caches, Break Action Shotguns found in the world, and all mission-specific stratagems (e.g., Hellbomb, Seismic Probe Drill, etc.), *unless* the specific challenge level states otherwise.</li>
                     <li style={styles.ruleListItem}>Video submissions must be one continuous, unedited recording of the entire mission attempt from start to finish (including loading screens if possible, definitely the results screen). No cuts, splits, speed-ups, additional commentary clips, or meme edits are allowed within the gameplay footage.</li>
                     <li style={styles.ruleListItem}>Mission privacy must be set to <strong style={styles.strongText}>Invite Only</strong> to ensure a true solo attempt without random joiners.</li>
                     <li style={styles.ruleListItem}>No missions involving the <strong style={styles.strongText}>Dark Fluid Storage Silo (DSS)</strong> objective are permitted for these challenges.</li>
                 </ul>
                 <h3 style={styles.subHeading}>Order of Difficulty (Super Helldive - Difficulty 9):</h3>
                 <p style={styles.paragraph}>Target enemy faction: Automaton (Bots) or Terminids (Bugs). Note: Shriekers (flying Terminids) are not yet explicitly included or excluded in challenge parameters unless tied to a specific objective like a Nuke Nursery.</p>

                 {/* Challenge Levels - Keep using inline styles for code blocks, levels etc. */}
                <div> <h4 style={styles.challengeLevel}>LEVEL 0 - Basic Clearance</h4> <pre style={styles.codeBlock}>#MISSION TYPE: Eradicate Automaton Forces (Fortress) / Purge Hatcheries (Mega Nest)\n#OBJECTIVE: Complete the main objective.\n#REQUIREMENTS: Solo\n#EXTRACT: Required</pre> </div>
                <div> <h4 style={styles.challengeLevel}>LEVEL 1 - Sabotage Proficiency</h4> <pre style={styles.codeBlock}>#MISSION TYPE: Sabotage Air Base / Destroy Command Bunkers / Sabotage Supply Bases (Orbital Cannon / Nuke Nursery)\n#OBJECTIVE: Complete the main objective.\n#REQUIREMENTS: Solo\n#EXTRACT: Required</pre> </div>
                <div> <h4 style={styles.challengeLevel}>LEVEL 2 - Resource Denial</h4> <pre style={styles.codeBlock}>#MISSION TYPE: Sabotage Air Base / Destroy Command Bunkers / Sabotage Supply Bases (Orbital Cannon / Nuke Nursery)\n#OBJECTIVE: Complete the main objective.\n#REQUIREMENTS: Solo, No Stratagems (Eagle, Orbital, Support Wpns, Backpacks), No Resupply pod usage\n#EXTRACT: Required</pre> </div>
                <div> <h4 style={styles.challengeLevel}>LEVEL 3 - ICBM Control</h4> <pre style={styles.codeBlock}>#MISSION TYPE: Launch ICBM\n#OBJECTIVE: Complete the main objective (Launch ICBM).\n#REQUIREMENTS: Solo, No Stratagems (Eagle, Orbital, Support Wpns, Backpacks)\n#EXTRACT: Required</pre> </div>
                <div> <h4 style={styles.challengeLevel}>LEVEL 4 - Flawless ICBM</h4> <pre style={styles.codeBlock}>#MISSION TYPE: Launch ICBM\n#OBJECTIVE: Complete the main objective.\n#REQUIREMENTS: Solo, No Stratagems, No Resupply pod usage, No Deaths\n#EXTRACT: Required</pre> </div>
                <div> <h4 style={styles.challengeLevel}>LEVEL 5 - Perfect Survey</h4> <pre style={styles.codeBlock}>#MISSION TYPE: Conduct Geological Survey\n#OBJECTIVE: Complete the main objective.\n#REQUIREMENTS: Solo, No Deaths\n#EXTRACT: Required</pre> </div>
                <div> <h4 style={styles.challengeLevel}>LEVEL 6 - Eagle Ace</h4> <pre style={styles.codeBlock}>#MISSION TYPE: Retrieve Essential Personnel (Capture Flag / Civilian Evac)\n#OBJECTIVE: Complete the main objective.\n#REQUIREMENTS: Solo, Only Eagle Stratagems allowed (Airstrike, 500kg, Strafing, etc. NO Orbitals, NO Support Wpns/Backpacks unless found)\n#EXTRACT: Required</pre> </div>
                <div>
                     <h4 style={styles.challengeLevel}>LEVEL 7 - The Purist</h4>
                     <pre style={styles.codeBlock}>
#MISSION TYPE: Launch ICBM
#OBJECTIVE: Complete the main objective AND all 5 possible Side Objectives (e.g., SEAF Artillery, Radar Tower, Stalker Lairs, Stratagem Jammers, Mortar Emplacements, Detection Towers, Automaton Fabricators/Bug Holes if not part of main obj).
#REQUIREMENTS:
  - Solo
  - No Stratagems (Eagles, Orbitals, Support Weapons, Backpacks called down)
  - Primary Weapon: JAR-5 Dominator (Constitution Rifle)
  - Secondary Weapon: P-6 Senator Revolver
  - Grenade: G-3 Throwing Knife
  - No Deaths
  - No Resupply pod usage
  - Cannot use any Support Weapons found in the mission (e.g., dropped Autocannon, Railgun).
  - EXCEPTION: The SG-8S Slugger (Break Action Shotgun) found in the world IS allowed.
#EXTRACT: Required
                    </pre>
                 </div>

                 <h3 style={{...styles.subHeading, marginTop: '2.5rem'}}>Prestige Challenges</h3>
                 <p style={styles.paragraph}>(Limit: Only one Prestige Challenge may be completed per John Helldiver graduate. Choose wisely.)</p>

                <div>
                    <h4 style={styles.challengeLevel}>LEVEL 8 - PRESTIGE #1: Spawn Camp</h4>
                    <pre style={styles.codeBlock}>
#MISSION TYPE: Sabotage Supply Bases (Nuke Nursery variant) OR Purge Hatcheries (Terminid Hive Drill)
#OBJECTIVE: Full Clear - Complete Main Objective, ALL Side Objectives, destroy ALL Automaton Fabricators / Bug Holes.
#REQUIREMENTS:
  - Solo
  - Armor: B-01 Tactical
  - Primary: AR-23E Liberator Explosive (Adjudicator)
  - Secondary: GP-31 Grenade Pistol (Verdict)
  - Grenade: G-12 High Explosive (Impact)
  - Stratagems: Must include Eagle Strafing Run, Eagle Airstrike, Orbital Precision Strike, RS-422 Railgun.
#EXTRACT: Required
                    </pre>
                 </div>
                 <div>
                    <h4 style={styles.challengeLevel}>LEVEL 9 - PRESTIGE #2: Hell Strike</h4>
                    <pre style={styles.codeBlock}>
#MISSION TYPE: Sabotage Supply Bases (Neutralize Orbital Cannons variant)
#OBJECTIVE: Full Clear (Main Objective, ALL Side Objectives, ALL Fabricators), No Deaths.
#REQUIREMENTS:
  - Solo
  - Armor: FS-05 Marksman (Exterminator)
  - Primary: PLAS-1 Scorcher (Plasma Punisher)
  - Secondary: P-6 Senator Revolver
  - Grenade: G-10 Incendiary (Thermite)
  - Stratagems: Must include Eagle Airstrike, Orbital 120MM HE Barrage, RS-422 Railgun, A/MLS-4X Rocket Sentry.
#EXTRACT: Required
                    </pre>
                 </div>
            </section>
            {/* END JOHN HELLDIVER COURSE SECTION */}

            {/* --- Other Sections --- */}
            <section style={styles.section}>
                 <h2 style={styles.sectionTitle}>New to the Fight?</h2>
                 <p style={styles.paragraph}>
                    Just bought the game? Feeling overwhelmed by Bile Titans or Hulks? Don't worry, we've all been there! GPT offers a supportive environment for new players. Ask questions, team up with experienced members who can show you the ropes (and the best ways to avoid friendly fire... mostly!), and learn the basics without fear of judgment.
                 </p>
                 <p style={styles.paragraph}>
                     We have dedicated channels for LFG, tips, and loadout discussions. Joining voice chat is encouraged for better coordination during missions, but not mandatory if you prefer text. Find squadmates for anything from trivial difficulty farming to your first Helldive attempt!
                 </p>
            </section>
            <section style={styles.section}>
                 <h2 style={styles.sectionTitle}>Seasoned Veterans Welcome!</h2>
                 <p style={styles.paragraph}>
                    Think you've seen it all? Mastered the art of the 500kg bomb? Looking for a consistent group to tackle Difficulty 9 operations and coordinate advanced strategies? GPT is home to many experienced Helldivers eager to push the limits and contribute to the Galactic War effort effectively.
                 </p>
                 <p style={styles.paragraph}>
                    Coordinate multi-squad planetary operations, share your high-level strategies, participate in community-organized challenges (like the John Helldiver Course!), or simply find reliable teammates who understand the importance of covering flanks and calling out patrols. Help mentor newer players or form elite squads for the toughest challenges the galaxy throws at us.
                 </p>
            </section>

        </div>
    );
}