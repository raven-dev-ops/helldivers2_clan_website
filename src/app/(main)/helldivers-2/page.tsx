// src/app/(main)/helldivers-2/page.tsx
"use client";

import Link from 'next/link';
import React, { useState, useEffect } from 'react';
import { FaStar, FaDiscord } from 'react-icons/fa';

// Import Swiper React components
import { Swiper, SwiperSlide } from 'swiper/react';
// Import Swiper modules
import { Navigation, Pagination, Autoplay, EffectFade } from 'swiper/modules';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/effect-fade';

// --- Review Data Structure ---
interface Review { id: number; author: string; title: string; text: string; rating: number; }
const reviews: Review[] = [
    { id: 1, author: "joshgiff", title: "A Solid Growing Community", text: "Safe, active and growing community...", rating: 5 },
    { id: 2, author: "charredviolet8771", title: "Democracy Approved", text: "Community has been so welcoming...", rating: 5 },
    { id: 3, author: "silverdolphin01", title: "Great Community", text: "Great community! Recommend to new and experienced...", rating: 5 },
    { id: 4, author: "krieg112", title: "Great, Non-toxic, and Casual", text: "Training program was a great way of connecting...", rating: 5 },
    { id: 5, author: "zephthehuman", title: "Best non toxic Helldivers 2 Community", text: "If you are looking for a ... mature community...", rating: 5 },
    { id: 11, author: "vetscape", title: "A Fleet To Call Home...", text: "My goal for GPT Fleet is to have a HD2 focused community...", rating: 5 },
];

// --- YouTube Video Interface ---
interface YoutubeVideo {
    id: string;
    embedUrl: string;
}

// --- YouTube Video Data ---
const youtubeVideos: YoutubeVideo[] = [
    { id: '6NjteKyQJRg', embedUrl: 'https://www.youtube.com/embed/JLWX6PYgjxk?si=i3gVqDJiO3xScEyY' },
    { id: 'oYAwQdu6lVw', embedUrl: 'https://www.youtube.com/embed/ea6P191gXLg?si=CrIYJ1TEHfO-UKn1' },
    { id: 'R1UvBhGz0oY', embedUrl: 'https://www.youtube.com/embed/6NjteKyQJRg?si=ThN7AHNjwjGgI_XR' },
    { id: 'pDnmRhQyW9o', embedUrl: 'https://www.youtube.com/embed/SKFyu2stYw8?si=95wk_DMZ7rn2PxGw' },
    { id: 'dQw4w9WgXcQ', embedUrl: 'https://www.youtube.com/embed/9dYRl9Y4q_4?si=Oo7dKJ5WKXSi9FJX' },
    { id: 'xvFZjo5PgG0', embedUrl: 'https://www.youtube.com/embed/iWDBkxTq4TI?si=KoizyAQCQ7KXrJWc' },
];

// --- Style Object ---
const styles = {
    pageContainer: {
        maxWidth: '1200px', margin: '0 auto', padding: '0 1rem 4rem',
        color: 'var(--color-text-primary, #e0e0e0)',
    },
    youtubeCarouselContainer: {
        marginBottom: '3rem', maxWidth: '1024px', marginLeft: 'auto', marginRight: 'auto',
        paddingTop: '2rem',
    },
    youtubeSlide: {
        position: 'relative', paddingBottom: '56.25%', height: 0, overflow: 'hidden',
        borderRadius: 'var(--border-radius-lg, 0.75rem)',
        boxShadow: '0 10px 20px rgba(0,0,0,0.3)',
        border: '1px solid var(--color-border, #334155)',
        backgroundColor: '#111',
    } as React.CSSProperties,
    youtubeIframe: {
        position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', border: 'none'
    } as React.CSSProperties,
    discordIconLink: {
        display: 'inline-block', marginLeft: '0.75rem', verticalAlign: 'middle',
        color: 'var(--color-primary)',
        transition: 'color 0.2s ease, transform 0.2s ease',
    } as React.CSSProperties,
    discordIconLinkHover: {
        color: 'var(--color-primary-hover)', transform: 'scale(1.1)',
    } as React.CSSProperties,
    discordIcon: {
        width: '1em', height: '1em',
    } as React.CSSProperties,
    reviewContainer: {
        position: 'relative', maxWidth: '550px', minHeight: '170px',
        display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1.5rem 2rem',
        backgroundColor: 'var(--color-surface-alt)',
        borderRadius: 'var(--border-radius-lg)', border: '1px solid var(--color-border)', textAlign: 'left',
        boxShadow: '0 4px 10px rgba(0,0,0,0.2)',
    } as React.CSSProperties,
    reviewContent: { width: '100%', opacity: 1, transition: 'opacity 0.6s ease-in-out' } as React.CSSProperties,
    reviewContentHidden: { opacity: 0 } as React.CSSProperties,
    reviewStars: { display: 'flex', gap: '0.25rem', color: '#facc15', marginBottom: '0.5rem' } as React.CSSProperties,
    reviewTitle: { fontSize: '1.1rem', fontWeight: 600, color: 'var(--color-text-primary)', marginBottom: '0.5rem' } as React.CSSProperties,
    reviewText: {
        fontSize: '0.9rem', color: 'var(--color-text-secondary)', fontStyle: 'italic',
        marginBottom: '0.75rem', lineHeight: 1.5, maxHeight: '6em', overflow: 'hidden', position: 'relative'
    } as React.CSSProperties,
    reviewAuthor: { fontSize: '0.8rem', color: 'var(--color-text-muted)', textAlign: 'right', marginTop: 'auto' } as React.CSSProperties,
    disboardLinkBottom: {
        display: 'block', textAlign: 'center', fontSize: '0.9rem',
        color: 'var(--color-primary-hover)', textDecoration: 'underline', textUnderlineOffset: '3px',
        marginTop: '1rem',
    } as React.CSSProperties,
    section: {
        marginBottom: '3rem', padding: '2rem',
        backgroundColor: 'var(--color-surface)',
        borderRadius: 'var(--border-radius-lg)',
        boxShadow: '0 4px 10px rgba(0,0,0,0.15)',
        border: '1px solid var(--color-border)',
    } as React.CSSProperties,
    sectionTitle: {
        fontSize: 'clamp(1.5rem, 4vw, 1.8rem)', fontWeight: 600, marginBottom: '1.5rem',
        color: 'var(--color-primary)', borderBottom: '1px solid var(--color-border)', paddingBottom: '0.75rem',
        display: 'flex', alignItems: 'center',
    } as React.CSSProperties,
    paragraph: { color: 'var(--color-text-secondary)', marginBottom: '1.25rem', lineHeight: 1.7 } as React.CSSProperties,
    strongText: { fontWeight: 600, color: 'var(--color-primary)' } as React.CSSProperties,
    link: { color: 'var(--color-primary-hover)', textDecoration: 'underline', textUnderlineOffset: '2px' } as React.CSSProperties,
    codeBlock: {
        backgroundColor: 'var(--color-background-alt)', border: '1px solid var(--color-border)',
        borderRadius: 'var(--border-radius-md)', padding: '1rem', fontSize: '0.9rem',
        fontFamily: 'var(--font-mono)', whiteSpace: 'pre-wrap', overflowX: 'auto',
        marginBottom: '0', // Remove bottom margin, handled by wrapper
        color: 'var(--color-text-secondary)',
        lineHeight: 1.5, // Adjust line height for readability
    } as React.CSSProperties,
    subHeading: { fontSize: '1.25rem', fontWeight: 600, color: 'var(--color-text-primary)', marginTop: '2rem', marginBottom: '1rem' } as React.CSSProperties,
    ruleList: { listStyleType: 'decimal', paddingLeft: '1.75rem', marginBottom: '1.5rem', color: 'var(--color-text-secondary)' } as React.CSSProperties,
    ruleListItem: { marginBottom: '0.6rem', lineHeight: 1.6 } as React.CSSProperties,
    challengeLevel: {
        fontSize: '1.1rem', fontWeight: 700, color: 'var(--color-primary)',
        marginTop: '0', // Remove top margin, handled by wrapper/border
        marginBottom: '0.75rem', // Space below heading
        borderTop: '1px dashed var(--color-border)',
        paddingTop: '1.5rem', // Space above heading text
    } as React.CSSProperties,
    challengeLevelWrapper: {
        marginBottom: '2rem', // Increased space between challenge blocks
    } as React.CSSProperties,
};

// --- Main Component ---
export default function HelldiversPage() {
    const discordServerLink = "https://discord.gg/gptfleet";
    const reviewSourceLink = "https://disboard.org/server/1214787549655203862";

    const [currentReviewIndex, setCurrentReviewIndex] = useState(0);
    const [isReviewVisible, setIsReviewVisible] = useState(true);
    const [discordIconHover, setDiscordIconHover] = useState(false);

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

    const discordIconFinalStyle = {
        ...styles.discordIconLink,
        ...(discordIconHover ? styles.discordIconLinkHover : {})
    };

    // --- Render Logic ---
    return (
        <div style={styles.pageContainer}>

            {/* YouTube Carousel */}
            <div style={styles.youtubeCarouselContainer}>
                <Swiper
                    modules={[Navigation, Pagination, Autoplay, EffectFade]}
                    effect="fade"
                    fadeEffect={{ crossFade: true }}
                    spaceBetween={30}
                    slidesPerView={1}
                    navigation={true}
                    pagination={{ clickable: true }}
                    loop={true}
                    autoplay={{ delay: 6000, disableOnInteraction: false }}
                    className="helldivers-youtube-swiper"
                >
                    {youtubeVideos.map((video) => (
                        <SwiperSlide key={video.id}>
                            <div style={styles.youtubeSlide}>
                                <iframe
                                    style={styles.youtubeIframe}
                                    src={video.embedUrl}
                                    title={`YouTube video player for ${video.id}`}
                                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                                    allowFullScreen
                                    loading="lazy"
                                    referrerPolicy="strict-origin-when-cross-origin"
                                ></iframe>
                            </div>
                        </SwiperSlide>
                    ))}
                </Swiper>
            </div>

            {/* About Section */}
            <section style={styles.section}>
                <h2 style={styles.sectionTitle}>
                    About the Taskforce
                    <Link
                         href={discordServerLink}
                         target="_blank"
                         rel="noopener noreferrer"
                         aria-label="Join the GPT Discord"
                         title="Join the GPT Discord"
                         style={discordIconFinalStyle}
                         onMouseEnter={() => setDiscordIconHover(true)}
                         onMouseLeave={() => setDiscordIconHover(false)}
                    >
                        <FaDiscord style={styles.discordIcon} />
                    </Link>
                </h2>
                 <p style={styles.paragraph}>
                     Welcome to the Galactic Phantom Taskforce (GPT) Helldivers 2 Division! We are a rapidly growing, multi-game community focused on creating a non-toxic, mature, and fun environment for gamers. Whether you're a fresh recruit dropping onto Malevelon Creek for the first time or a seasoned Super Citizen spreading managed democracy across the galaxy, you have a place here.
                 </p>
                 <p style={styles.paragraph}>
                     Our core values center around respect, teamwork, and enjoying the game together. We value every member and strive to provide an inclusive space where players can coordinate missions, share strategies, showcase their triumphs (and epic fails!), and simply hang out. We utilize Discord extensively for communication, LFG (Looking For Group), and organizing community events. Join us today!
                  </p>
            </section>

            {/* John Helldiver Course Section */}
            <section style={styles.section}>
                 <h2 style={styles.sectionTitle}>John Helldiver Course & Challenges</h2>
                 <p style={{...styles.paragraph, fontStyle: 'italic', textAlign: 'center', marginBottom: '2rem'}}>
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
                 </ul>

                 <h3 style={styles.subHeading}>Order of Difficulty (Super Helldive - Difficulty 10):</h3>
                 <p style={styles.paragraph}>Target enemy faction: Automaton (Bots) or Terminids (Bugs).</p>

                 {/* --- Challenge Levels --- */}
                 <div style={styles.challengeLevelWrapper}>
                    <h4 style={styles.challengeLevel}>LEVEL 0 - Basic Clearance</h4>
                    <pre style={styles.codeBlock}>{`
MISSION TYPE: Eradicate Automaton Forces (Fortress) / Purge Hatcheries (Mega Nest)
OBJECTIVE:    Complete the main objective.
REQUIREMENTS: Solo
EXTRACT:      Required
                    `}</pre>
                 </div>
                 <div style={styles.challengeLevelWrapper}>
                    <h4 style={styles.challengeLevel}>LEVEL 1 - Sabotage Proficiency</h4>
                    <pre style={styles.codeBlock}>{`
MISSION TYPE: Sabotage Air Base / Destroy Command Bunkers / Sabotage Supply Bases (Orbital Cannon / Nuke Nursery)
OBJECTIVE:    Complete the main objective.
REQUIREMENTS: Solo
EXTRACT:      Required
                    `}</pre>
                 </div>
                 <div style={styles.challengeLevelWrapper}>
                    <h4 style={styles.challengeLevel}>LEVEL 2 - Resource Denial</h4>
                    <pre style={styles.codeBlock}>{`
MISSION TYPE: Sabotage Air Base / Destroy Command Bunkers / Sabotage Supply Bases (Orbital Cannon / Nuke Nursery)
OBJECTIVE:    Complete the main objective.
REQUIREMENTS:
  - Solo
  - No Stratagems (Eagle, Orbital, Support Wpns, Backpacks)
  - No Resupply pod usage
EXTRACT:      Required
                    `}</pre>
                 </div>
                 <div style={styles.challengeLevelWrapper}>
                    <h4 style={styles.challengeLevel}>LEVEL 3 - ICBM Control</h4>
                    <pre style={styles.codeBlock}>{`
MISSION TYPE: Launch ICBM
OBJECTIVE:    Complete the main objective (Launch ICBM).
REQUIREMENTS:
  - Solo
  - No Stratagems (Eagle, Orbital, Support Wpns, Backpacks)
EXTRACT:      Required
                    `}</pre>
                 </div>
                 <div style={styles.challengeLevelWrapper}>
                    <h4 style={styles.challengeLevel}>LEVEL 4 - Flawless ICBM</h4>
                    <pre style={styles.codeBlock}>{`
MISSION TYPE: Launch ICBM
OBJECTIVE:    Complete the main objective.
REQUIREMENTS:
  - Solo
  - No Stratagems
  - No Resupply pod usage
  - No Deaths
EXTRACT:      Required
                    `}</pre>
                 </div>
                 <div style={styles.challengeLevelWrapper}>
                    <h4 style={styles.challengeLevel}>LEVEL 5 - Perfect Survey</h4>
                    <pre style={styles.codeBlock}>{`
MISSION TYPE: Conduct Geological Survey
OBJECTIVE:    Complete the main objective.
REQUIREMENTS:
  - Solo
  - No Deaths
EXTRACT:      Required
                    `}</pre>
                 </div>
                 <div style={styles.challengeLevelWrapper}>
                    <h4 style={styles.challengeLevel}>LEVEL 6 - Eagle Ace</h4>
                    <pre style={styles.codeBlock}>{`
MISSION TYPE: Retrieve Essential Personnel (Capture Flag / Civilian Evac)
OBJECTIVE:    Complete the main objective.
REQUIREMENTS:
  - Solo
  - Only Eagle Stratagems allowed (Airstrike, 500kg, Strafing, etc.)
    (NO Orbitals, NO Support Wpns/Backpacks unless found)
EXTRACT:      Required
                    `}</pre>
                 </div>
                 <div style={styles.challengeLevelWrapper}>
                     <h4 style={styles.challengeLevel}>LEVEL 7 - The Purist</h4>
                     <pre style={styles.codeBlock}>{`
MISSION TYPE: Launch ICBM

OBJECTIVE:
  - Complete the main objective (Launch ICBM)
  - Complete ALL 5 possible Side Objectives
    (e.g., SEAF Artillery, Radar Tower, Stalker Lairs, Jammers, Mortars, etc.)

REQUIREMENTS:
  - Solo
  - No Stratagems (Eagles, Orbitals, Support Weapons, Backpacks called down)
  - No Deaths
  - No Resupply pod usage
  - Cannot use any Support Weapons found in the mission
    (e.g., dropped Autocannon, Railgun).
  - EXCEPTION: SG-8S Slugger found in world IS allowed.

LOADOUT:
  - Primary:   JAR-5 Dominator (Constitution Rifle)
  - Secondary: P-6 Senator Revolver
  - Grenade:   G-3 Throwing Knife

EXTRACT:      Required
                    `}</pre>
                 </div>

                 <h3 style={{...styles.subHeading, marginTop: '2.5rem'}}>Prestige John Helldiver Challenges</h3>
                 {/* Updated paragraph text */}
                 <p style={styles.paragraph}>Created by John Helldivers.</p>

                <div style={styles.challengeLevelWrapper}>
                    <h4 style={styles.challengeLevel}>LEVEL 8 - PRESTIGE #1: Terminid Spawn Camp</h4>
                    <pre style={styles.codeBlock}>{`
MISSION TYPE: Sabotage Supply Bases (Nuke Nursery) OR Purge Hatcheries (Terminid Drill)

OBJECTIVE:    Full Clear
  - Complete Main Objective
  - Complete ALL Side Objectives
  - Destroy ALL Fabricators / Bug Holes

REQUIRED LOADOUT:
  - Armor:     B-01 Tactical
  - Primary:   AR-23E Liberator Explosive (Adjudicator)
  - Secondary: GP-31 Grenade Pistol (Verdict)
  - Grenade:   G-12 High Explosive (Impact)

REQUIRED STRATAGEMS:
  - Eagle Strafing Run
  - Eagle Airstrike
  - Orbital Precision Strike
  - RS-422 Railgun

REQUIREMENTS:
  - Solo
EXTRACT:      Required
                    `}</pre>
                 </div>
                 <div style={styles.challengeLevelWrapper}>
                    <h4 style={styles.challengeLevel}>LEVEL 9 - PRESTIGE #2: Automaton Hell Strike</h4>
                    <pre style={styles.codeBlock}>{`
MISSION TYPE: Sabotage Supply Bases (Neutralize Orbital Cannons)

OBJECTIVE:    Full Clear
  - Complete Main Objective
  - Complete ALL Side Objectives
  - Destroy ALL Fabricators

REQUIREMENTS:
  - Solo
  - No Deaths

REQUIRED LOADOUT:
  - Armor:     FS-05 Marksman (Exterminator)
  - Primary:   PLAS-1 Scorcher (Plasma Punisher)
  - Secondary: P-6 Senator Revolver
  - Grenade:   G-10 Incendiary (Thermite)

REQUIRED STRATAGEMS:
  - Eagle Airstrike
  - Orbital 120MM HE Barrage
  - RS-422 Railgun
  - A/MLS-4X Rocket Sentry

EXTRACT:      Required
                    `}</pre>
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

            {/* --- Bottom Info Section (Review + Disboard Link) --- */}
            <div className="bottom-info-section">
                {/* Content Wrapper for Review/Disboard */}
                <div className="bottom-info-content-wrapper">
                    {/* Review Carousel */}
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
                    {/* Disboard Link */}
                     {reviewSourceLink && (
                         <Link
                             href={reviewSourceLink}
                             target="_blank"
                             rel="noopener noreferrer"
                             style={styles.disboardLinkBottom}
                         >
                             Disboard Reviews
                         </Link>
                     )}
                </div>
            </div>

        </div> // End pageContainer
    );
}