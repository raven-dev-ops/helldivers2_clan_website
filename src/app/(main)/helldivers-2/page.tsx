// src/app/(main)/helldivers-2/page.tsx
"use client";

import Link from 'next/link';
import React, { useState, useEffect } from 'react';
import { FaStar, FaDiscord, FaChevronDown, FaChevronUp } from 'react-icons/fa'; // Added Chevrons

// Import Swiper React components
import { Swiper, SwiperSlide } from 'swiper/react';
// Import Swiper modules
import { Navigation, EffectFade } from 'swiper/modules';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/navigation';
// import 'swiper/css/pagination'; // Not used
import 'swiper/css/effect-fade';

// --- Review Data Structure ---
interface Review { id: number; author: string; title: string; text: string; rating: number; }
const reviews: Review[] = [
    // --- Review Data (Keep as is) ---
    { id: 1, author: "joshgiff", title: "A Solid Growing Community", text: "I came across GPT fleet as a helldiver in a different discord server. We were offered to join a server that had a discord bot that would link other servers together to allow divers from across discord to link up and spread democracy together. So far in my experience it has been a safe, active and growing community to meet up and dive together. On times where I am not diving there is usually a group of people socializing in one of the voice chat channels and I have found that helpful for hobbying and hanging with other people. 10/10 would dive with them any day of the week.", rating: 5 },
    { id: 2, author: "charredviolet8771", title: "Democracy Approved", text: "I've been apart of the GPT Fleet for about three or four months now and the community has been so welcoming and encouraging. The folks here have given great advice and taught me so many things about Helldivers 2 that I would have struggled to figure out alone. I don't have to worry about folks being toxic towards me, which is great! I look forward to seeing where this awesome community goes in the future, and I highly recommend it as a place to learn/ hang out with your fellow Helldivers!", rating: 5 },
    { id: 3, author: "silverdolphin01", title: "Great Community", text: "I haven't been able to be as active as I'd like but this is a great community! I would definitely recommend to both new and experienced players!", rating: 5 },
    { id: 4, author: "krieg112", title: "Great, Non-toxic, and Casual", text: "I’ve been in GPT a few months now and I have achieved the server’s partial moderator sort of role. The training program was a great way of connecting to the amazing global community. I’ve not been pressured to play excessively or give up personal time to be involved either. TLDR: Great server with nice staff and members. Highly recommend.", rating: 5 },
    { id: 5, author: "zephthehuman", title: "The best non toxic Helldivers 2 Community I've seen so far", text: "If you are looking for a Helldivers 2 Gaming Clan(s) that isn't filled with raging elitists, trolls or chaos divers, but instead an 18+ sfw mature community, then GPT Fleet is definitely for you! I've been on Discord gaming communities since September 2015 and I know for a fact that this community shines in making it comfortable and welcoming for new players, returning players and veterans alike. Things I've noticed: (personally) ✔️non problematic banter (mostly in vc's) ✔️no name calling or flaming (policy included to prevent that) ✔️a mix of players of different lvls with a focus on community based challenges and it's leaderboard. ✔️a more casual mindset which in turn makes the missions more lighthearted, less serious but still enough to make a super helldive more epic than usual ✔️a lot of friendly demeanor ✔️no activity requirements ✔️staff is attentive ✔️well structured server with it's own bots and clan network ✔️here's another checkmark for absolutely no reason!! :D", rating: 5 },
    { id: 6, author: "zolosio", title: "CERTIFICATE OF LEGITNESS", text: "As a member of the GPT Fleet since September 4 of 2024, I can confidently say that the group and members within from newbies to veterans are always VERY supportive and professionally polite. I never have to worry about toxicness 1 bit! or if it's going to be dry or not busy. This Amazing community really strives to be the number one helldivers 2 discord group and it shows, there is plenty and I mean PLENTY of room to grow in rank within the GPT and an endless amount of amazing people I personally love playing with including myself that will help you along the way! Need advice on what loadouts to bring to that next D10, or some coaching on accuracy from one of our top players? Whether you're looking to become the next John helldiver or just another scratch in the paw for freedom, the GPT fleet is definitely the place to be! With everything from community movie night to karaoke it can be as serious or casual as need be. It is definitely thebest community I have ever experienced where your effort doesn't go un-noticed and your always respected and protected. Amazing people honestly -Zolosio", rating: 5 },
    { id: 7, author: "duepulse", title: "GPT Fleet produces the best Helldivers", text: "Joined the fleet back in Aug of last year. Fought with the bravest and greatest that the fleet has to offer. And safe to say that anyone who joins up and is looking for anyone to join you into the frontlines, the fleet is spoiled with choices of very courageous and disciplined Helldivers. This review is approved by the Ministry of Truth", rating: 5 },
    { id: 8, author: "mr.swimson", title: "11/10 experience", text: "love the people, love the vibe, love the bots. Adding my own server with over 2.5k members to the GPT Fleet alliance was one of the best choices I've made. Really opened up doors for people to play together and meet new people across multiple servers. If you're looking for a chill community to hang out, I highly recommend GPT Fleet. All are welcome!!", rating: 5 },
    { id: 9, author: "mrman1594", title: "Best experience", text: "When I first got helldivers 2 I had a hard time knowing how the game works since I join GPT they give me one of the best experience!!!! I highly recommend joining If you’re new or daily player it makes the game so much fun!!!!", rating: 5 },
    { id: 10, author: "shway_maximus", title: "An amazing Helldiver guild curated by the best 10 Star General there is", text: "I joined this community two months ago after leveling to 145 playing solo with randoms. After joining this discord I've met so many great players and I have made many new friends. It's awesome playing with highly competent people consistently. Our glorious leader made it easy for us to set up an LFG channel or join one that is already in session. Everyone is so supportive and we continue to grow everyday.", rating: 5 },
    { id: 11, author: "vetscape", title: "A Fleet To Call Home Away From Super Earth", text: "I started this discord after my brother gifted me the game on steam when it came out. I never heard of Helldivers before. After playing the game, I really enjoyed the weapons mechanics, squad dynamics, and the galactic game master. My goal for GPT Fleet is to have a HD2 focused community that places value on escapism. Join our fleet, play in some squads, experience a fleet weekend event, and come back here and leave an honest review. Let us know how we can improve and catch up the latest fleet news on our youtube or X: @gptfleet", rating: 5 },
    { id: 12, author: "lucian_666", title: "GPT FLEET is Amazing", text: "Ton of veterans from different branches. Great times and the owner of the server is always expanding to the next best thing. I love being here!", rating: 5 },
    { id: 13, author: "theslayestfox", title: "Greatly organized", text: "I love how social this server especially with all the different channels and it really active got events about every week and people playing about everyday always time to grab some hell divers and spread democracy", rating: 5 },
    { id: 14, author: "nocturnalverse", title: "GPT Fleet is a great Helldiver community.", text: "We're looking to be a Helldiver only discord. We welcome new players especially. We're growing slowly but the goal is to always have someone to play with in the style of play that you enjoy. Check it out. If you see someone in chat, they are probably playing, join up today!", rating: 5 },
    { id: 15, author: "corbiskeys", title: "Ode to Freedom", text: `In the digital sea, a fleet does sail,\n"GPT Fleet," where friendships prevail.\nA haven for gamers, a circle so wide,\nWhere laughter and teamwork coincide.\n\nHere, every voice finds a welcoming tune,\nUnder the watchful gaze of the digital moon.\nFrom puzzles to battles, in worlds far and wide,\nBeside every player, a friend to confide.\n\nIn "GPT Fleet," where the banners are unfurled,\nA community thrives in this virtual world.\nNo matter the game, the hour, the quest,\nHere, you're more than a guest.\n\nSo sail into the harbor, where the heart never fleets,\nJoin hands, join games, in the "GPT Fleet."\nFor in this haven of pixels, you'll always find,\nA place to call home, a group of your kind.`, rating: 5 },
    { id: 16, author: "themephs", title: "Unbelievable quality", text: "Thanks to GPT Fleet I can marry my cousins and developed a fentanyl addiction. Keep slaying. Thanks GPT Fleet!", rating: 5 },
    { id: 17, author: "brentielal1123", title: "Democracy", text: "Come in and have fun, friendly people and there to help. Democracy for all and plenty of Bug Juice to go around. Weeky Events going on as well.", rating: 5 },
];

// --- YouTube Video Interface ---
interface YoutubeVideo { id: string; embedUrl: string; }
const youtubeVideos: YoutubeVideo[] = [
    // --- YouTube Video Data (Keep as is) ---
    { id: '6NjteKyQJRg', embedUrl: 'https://www.youtube.com/embed/JLWX6PYgjxk?si=i3gVqDJiO3xScEyY' },
    { id: 'oYAwQdu6lVw', embedUrl: 'https://www.youtube.com/embed/ea6P191gXLg?si=CrIYJ1TEHfO-UKn1' },
    { id: 'R1UvBhGz0oY', embedUrl: 'https://www.youtube.com/embed/6NjteKyQJRg?si=ThN7AHNjwjGgI_XR' },
    { id: 'pDnmRhQyW9o', embedUrl: 'https://www.youtube.com/embed/SKFyu2stYw8?si=95wk_DMZ7rn2PxGw' },
    { id: 'dQw4w9WgXcQ', embedUrl: 'https://www.youtube.com/embed/9dYRl9Y4q_4?si=Oo7dKJ5WKXSi9FJX' },
    { id: 'xvFZjo5PgG0', embedUrl: 'https://www.youtube.com/embed/iWDBkxTq4TI?si=KoizyAQCQ7KXrJWc' },
];

// --- John Helldiver Challenge Data ---
interface ChallengeLevelData {
    id: string; // e.g., 'level-0'
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

// --- Style Object (Adding styles for expanders) ---
const styles: { [key: string]: React.CSSProperties } = {
    pageContainer: { maxWidth: '1200px', margin: '0 auto', padding: '0 1rem 4rem', color: 'var(--color-text-primary, #e0e0e0)', },
    // YouTube Carousel
    youtubeCarouselContainer: { marginBottom: '3rem', maxWidth: '1024px', marginLeft: 'auto', marginRight: 'auto', paddingTop: '2rem', },
    youtubeSlide: { position: 'relative', paddingBottom: '56.25%', height: 0, overflow: 'hidden', borderRadius: 'var(--border-radius-lg, 0.75rem)', boxShadow: '0 10px 20px rgba(0,0,0,0.3)', border: '1px solid var(--color-border, #334155)', backgroundColor: '#111', },
    youtubeIframe: { position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', border: 'none' },
    // Reviews Section
    reviewSectionContainer: { position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1.5rem', marginTop: '3rem', },
    reviewCardsWrapper: { display: 'flex', gap: '1rem', width: '100%', justifyContent: 'center', alignItems: 'stretch', flexWrap: 'wrap', minHeight: '190px', opacity: 1, transition: 'opacity 0.6s ease-in-out', },
    reviewCardsWrapperHidden: { opacity: 0, },
    individualReviewCard: { flex: '1 1 300px', maxWidth: '350px', display: 'flex', flexDirection: 'column', padding: '1.25rem', backgroundColor: 'var(--color-surface-alt)', borderRadius: 'var(--border-radius-md)', border: '1px solid var(--color-border)', textAlign: 'left', boxShadow: '0 2px 6px rgba(0,0,0,0.15)', },
    reviewStars: { display: 'flex', gap: '0.25rem', color: '#facc15', marginBottom: '0.5rem' },
    reviewTitle: { fontSize: '1rem', fontWeight: 600, color: 'var(--color-text-primary)', marginBottom: '0.5rem', lineHeight: 1.3 },
    reviewText: { fontSize: '0.85rem', color: 'var(--color-text-secondary)', fontStyle: 'italic', marginBottom: '0.75rem', lineHeight: 1.5, flexGrow: 1, whiteSpace: 'pre-line', position: 'relative' },
    reviewAuthor: { fontSize: '0.75rem', color: 'var(--color-text-muted)', textAlign: 'right', marginTop: 'auto', paddingTop: '0.5rem' },
    disboardLinkBottom: { display: 'block', textAlign: 'center', fontSize: '0.9rem', color: 'var(--color-primary-hover)', textDecoration: 'underline', textUnderlineOffset: '3px', marginTop: '0.5rem' },
     // Discord icon
     discordIconLink: { display: 'inline-block', marginLeft: '0.75rem', verticalAlign: 'middle', color: 'var(--color-primary)', transition: 'color 0.2s ease, transform 0.2s ease', },
     discordIconLinkHover: { color: 'var(--color-primary-hover)', transform: 'scale(1.1)', },
     discordIcon: { width: '1em', height: '1em', },
     // General Sections
     section: { marginBottom: '3rem', padding: '2rem', backgroundColor: 'var(--color-surface)', borderRadius: 'var(--border-radius-lg)', boxShadow: '0 4px 10px rgba(0,0,0,0.15)', border: '1px solid var(--color-border)', },
     sectionTitle: { fontSize: 'clamp(1.5rem, 4vw, 1.8rem)', fontWeight: 600, marginBottom: '1.5rem', color: 'var(--color-primary)', borderBottom: '1px solid var(--color-border)', paddingBottom: '0.75rem', display: 'flex', alignItems: 'center', },
     paragraph: { color: 'var(--color-text-secondary)', marginBottom: '1.25rem', lineHeight: 1.7 },
     strongText: { fontWeight: 600, color: 'var(--color-primary)' },
     link: { color: 'var(--color-primary-hover)', textDecoration: 'underline', textUnderlineOffset: '2px' },
     codeBlock: { backgroundColor: 'var(--color-background-alt)', border: '1px solid var(--color-border)', borderRadius: 'var(--border-radius-md)', padding: '1rem', fontSize: '0.9rem', fontFamily: 'var(--font-mono)', whiteSpace: 'pre-wrap', overflowX: 'auto', color: 'var(--color-text-secondary)', lineHeight: 1.5, },
     subHeading: { fontSize: '1.25rem', fontWeight: 600, color: 'var(--color-text-primary)', marginTop: '2rem', marginBottom: '1rem' },
     ruleList: { listStyleType: 'decimal', paddingLeft: '1.75rem', marginBottom: '1.5rem', color: 'var(--color-text-secondary)' },
     ruleListItem: { marginBottom: '0.6rem', lineHeight: 1.6 },

     // --- Styles for Challenge Level Expanders ---
     challengeLevelContainer: { // Wrapper for each collapsible level
         border: '1px solid var(--color-border-alt)',
         borderRadius: 'var(--border-radius-md)',
         marginBottom: '1rem',
         backgroundColor: 'var(--color-surface-alt)', // Slightly different background
         overflow: 'hidden',
     },
     challengeHeader: {
         display: 'flex',
         justifyContent: 'space-between',
         alignItems: 'center',
         padding: '0.8rem 1.25rem', // Slightly less padding
         cursor: 'pointer',
         backgroundColor: 'var(--color-surface)', // Match main section bg
         borderBottom: '1px solid var(--color-border-alt)',
         transition: 'background-color 0.2s ease',
     },
     challengeHeaderHover: {
         backgroundColor: 'var(--color-surface-hover)',
     },
     challengeLevelTitle: { // The "LEVEL X - Title" text
         fontSize: '1.1rem', // Same as old .challengeLevel
         fontWeight: 700, // Same as old .challengeLevel
         color: 'var(--color-primary)', // Use primary color for title
         margin: 0, // Remove default heading margin
     },
      expandIcon: { // Style for the chevron icon
         fontSize: '1.1rem', color: 'var(--color-text-secondary)',
         transition: 'transform 0.3s ease',
     },
     expandIconRotated: {
         transform: 'rotate(180deg)',
     },
     challengeDetailsContent: { // The collapsible content area
        maxHeight: '0', opacity: 0, overflow: 'hidden',
        transition: 'max-height 0.5s ease-out, opacity 0.4s ease-in, padding 0.5s ease-out',
        padding: '0 1.25rem', // Horizontal padding only when collapsed
     },
     challengeDetailsContentExpanded: {
        maxHeight: '1000px', // Adjust max-height as needed
        opacity: 1,
        padding: '1rem 1.25rem 1.25rem', // Padding when expanded
        transition: 'max-height 0.6s ease-in-out, opacity 0.5s ease-in 0.1s, padding 0.6s ease-in-out',
     },
     // --- End Expander Styles ---
};


// --- Main Component ---
export default function HelldiversPage() {
    const discordServerLink = "https://discord.gg/gptfleet";
    const reviewSourceLink = "https://disboard.org/server/1214787549655203862";

    const [currentReviewStartIndex, setCurrentReviewStartIndex] = useState(0);
    const [isReviewVisible, setIsReviewVisible] = useState(true);
    const [discordIconHover, setDiscordIconHover] = useState(false);

    // State for challenge level expansion
    const [expandedChallenges, setExpandedChallenges] = useState<Record<string, boolean>>({});
    // State for challenge header hover
    const [hoveredChallenge, setHoveredChallenge] = useState<string | null>(null);

    // Toggle function for challenge expanders
    const toggleChallengeExpansion = (challengeId: string) => {
        setExpandedChallenges(prev => ({
            ...prev,
            [challengeId]: !prev[challengeId]
        }));
    };


    // Effect for cycling reviews
    useEffect(() => {
        if (reviews.length <= 3) return;
        const intervalId = setInterval(() => {
            setIsReviewVisible(false);
            setTimeout(() => {
                setCurrentReviewStartIndex((prevIndex) => (prevIndex + 3 >= reviews.length ? 0 : prevIndex + 3));
                setIsReviewVisible(true);
            }, 600);
        }, 10000);
        return () => clearInterval(intervalId);
    }, []);

    const reviewsToShow = reviews.slice(currentReviewStartIndex, currentReviewStartIndex + 3);
    const discordIconFinalStyle = { ...styles.discordIconLink, ...(discordIconHover ? styles.discordIconLinkHover : {}) };
    const reviewWrapperFinalStyle = { ...styles.reviewCardsWrapper, ...(!isReviewVisible ? styles.reviewCardsWrapperHidden : {}) };

    // --- Render Logic ---
    return (
        <div style={styles.pageContainer}>

            {/* YouTube Carousel */}
            <div style={styles.youtubeCarouselContainer}>
                <Swiper
                    modules={[Navigation, EffectFade]} effect="fade" fadeEffect={{ crossFade: true }}
                    spaceBetween={30} slidesPerView={1} navigation={true} loop={true} className="helldivers-youtube-swiper"
                >
                    {youtubeVideos.map((video) => (
                        <SwiperSlide key={video.id}>
                            <div style={styles.youtubeSlide}>
                                <iframe style={styles.youtubeIframe} src={video.embedUrl} title={`YouTube video player for ${video.id}`} allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowFullScreen loading="lazy" referrerPolicy="strict-origin-when-cross-origin"></iframe>
                            </div>
                        </SwiperSlide>
                    ))}
                </Swiper>
            </div>

            {/* About Section */}
            <section style={styles.section}>
                <h2 style={styles.sectionTitle}>
                    About GPT HELLDIVERS 2
                    <Link href={discordServerLink} target="_blank" rel="noopener noreferrer" aria-label="Join the GPT Discord" title="Join the GPT Discord" style={discordIconFinalStyle} onMouseEnter={() => setDiscordIconHover(true)} onMouseLeave={() => setDiscordIconHover(false)}>
                        <FaDiscord style={styles.discordIcon} />
                    </Link>
                </h2>
                 <p style={styles.paragraph}> Welcome to the Galactic Phantom Taskforce (GPT) Helldivers 2 Division! We are a rapidly growing, multi-game community focused on creating a non-toxic, mature, and fun environment for gamers. Whether you're a fresh recruit dropping onto Malevelon Creek for the first time or a seasoned Super Citizen spreading managed democracy across the galaxy, you have a place here. </p>
                 <p style={styles.paragraph}> Our core values center around respect, teamwork, and enjoying the game together. We value every member and strive to provide an inclusive space where players can coordinate missions, share strategies, showcase their triumphs (and epic fails!), and simply hang out. We utilize Discord extensively for communication, LFG (Looking For Group), and organizing community events. Join us today! </p>
            </section>

            {/* --- NEW/VETERAN SECTIONS MOVED HERE --- */}
            <section style={styles.section}>
                 <h2 style={styles.sectionTitle}>New to the Fight?</h2>
                 <p style={styles.paragraph}> Just bought the game? Feeling overwhelmed by Bile Titans or Hulks? Don't worry, we've all been there! GPT offers a supportive environment for new players. Ask questions, team up with experienced members who can show you the ropes (and the best ways to avoid friendly fire... mostly!), and learn the basics without fear of judgment. </p>
                 <p style={styles.paragraph}> We have dedicated channels for LFG, tips, and loadout discussions. Joining voice chat is encouraged for better coordination during missions, but not mandatory if you prefer text. Find squadmates for anything from trivial difficulty farming to your first Helldive attempt! </p>
            </section>
            <section style={styles.section}>
                 <h2 style={styles.sectionTitle}>Seasoned Veterans Welcome!</h2>
                 <p style={styles.paragraph}> Think you've seen it all? Mastered the art of the 500kg bomb? Looking for a consistent group to tackle Difficulty 9+ operations and coordinate advanced strategies? GPT is home to many experienced Helldivers eager to push the limits and contribute to the Galactic War effort effectively. </p>
                 <p style={styles.paragraph}> Coordinate multi-squad planetary operations, share your high-level strategies, participate in community-organized challenges (like the John Helldiver Course!), or simply find reliable teammates who understand the importance of covering flanks and calling out patrols. Help mentor newer players or form elite squads for the toughest challenges the galaxy throws at us. </p>
            </section>
            {/* --- END NEW/VETERAN SECTIONS --- */}

            {/* John Helldiver Course Section */}
            <section style={styles.section}>
                 <h2 style={styles.sectionTitle}>John Helldiver Course & Challenges</h2>
                 <p style={{...styles.paragraph, fontStyle: 'italic', textAlign: 'center', marginBottom: '2rem'}}> <strong style={styles.strongText}>NO SEED FARMING</strong> - HELLDIVERS DO NOT CHERRY PICK MISSIONS TO WIN, WE JUST WIN. </p>
                 <p style={styles.paragraph}> Ready to prove your mettle, Helldiver? The John Helldiver Course is a series of increasingly difficult solo challenges designed to test your skill, strategy, and adherence to Super Earth protocol. You MUST submit your videos in the <code style={{color: 'var(--color-primary)'}}>#🪖｜training</code> channel on our Discord for review and verification by <code style={{color: 'var(--color-primary)'}}>@JOHN HELLDIVER</code>. Respect the community and the challenge rules, or face the consequences (potentially airlocking). </p>
                 <h3 style={styles.subHeading}>Rules & Requirements:</h3>
                 <ul style={styles.ruleList}>
                     <li style={styles.ruleListItem}>If it's on the map, it's in play. This includes SEAF Artillery, SAM sites, static Machine Gun emplacements, discoverable Ammo caches, Break Action Shotguns found in the world, and all mission-specific stratagems (e.g., Hellbomb, Seismic Probe Drill, etc.), *unless* the specific challenge level states otherwise.</li>
                     <li style={styles.ruleListItem}>Video submissions must be one continuous, unedited recording of the entire mission attempt from start to finish (including loading screens if possible, definitely the results screen). No cuts, splits, speed-ups, additional commentary clips, or meme edits are allowed within the gameplay footage.</li>
                     <li style={styles.ruleListItem}>Mission privacy must be set to <strong style={styles.strongText}>Invite Only</strong> to ensure a true solo attempt without random joiners.</li>
                 </ul>

                 <h3 style={styles.subHeading}>Order of Difficulty (Super Helldive - Difficulty 10):</h3>
                 <p style={styles.paragraph}>Target enemy faction: Automaton (Bots) or Terminids (Bugs).</p>

                 {/* --- Challenge Levels as Expanders --- */}
                 {challengeLevels.map((challenge) => {
                     const isExpanded = !!expandedChallenges[challenge.id];
                     const isHovered = hoveredChallenge === challenge.id;
                     return (
                        <div key={challenge.id} style={styles.challengeLevelContainer}>
                            <div
                                style={{ ...styles.challengeHeader, ...(isHovered ? styles.challengeHeaderHover : {}), borderBottom: isExpanded ? `1px solid ${styles.challengeHeader.borderBottomColor}` : 'none' }}
                                onClick={() => toggleChallengeExpansion(challenge.id)}
                                onMouseEnter={() => setHoveredChallenge(challenge.id)}
                                onMouseLeave={() => setHoveredChallenge(null)}
                                role="button" aria-expanded={isExpanded} aria-controls={`challenge-content-${challenge.id}`}
                                tabIndex={0} onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && toggleChallengeExpansion(challenge.id)}
                            >
                                <h4 style={styles.challengeLevelTitle}>{challenge.levelTitle}</h4>
                                <FaChevronDown style={{...styles.expandIcon, ...(isExpanded ? styles.expandIconRotated : {})}} aria-hidden="true"/>
                            </div>
                            <div
                                id={`challenge-content-${challenge.id}`}
                                style={{ ...styles.challengeDetailsContent, ...(isExpanded ? styles.challengeDetailsContentExpanded : {}) }}
                            >
                                <pre style={styles.codeBlock}>{challenge.details}</pre>
                            </div>
                        </div>
                     );
                 })}
            </section>
            {/* --- Reviews Section (Remains at Bottom) --- */}
            <div style={styles.reviewSectionContainer}>
                <div style={reviewWrapperFinalStyle}>
                    {reviewsToShow.map((review) => (
                        <div key={review.id} style={styles.individualReviewCard}>
                            <div style={styles.reviewStars}> {Array.from({ length: review.rating }).map((_, i) => (<FaStar key={i} />))} </div>
                            <h3 style={styles.reviewTitle}>{review.title}</h3>
                            <p style={styles.reviewText}>"{review.text}"</p>
                            <p style={styles.reviewAuthor}>- {review.author}</p>
                        </div>
                    ))}
                </div>
                {reviewSourceLink && ( <Link href={reviewSourceLink} target="_blank" rel="noopener noreferrer" style={styles.disboardLinkBottom}> Disboard Reviews </Link> )}
            </div>

        </div> // End pageContainer
    );
}