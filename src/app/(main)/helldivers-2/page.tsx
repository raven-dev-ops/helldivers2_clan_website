// src/app/(main)/helldivers-2/page.tsx
"use client";

import Link from 'next/link';
import React, { useEffect, useRef, useState } from 'react';
import { FaDiscord, FaTwitch, FaYoutube, FaPlay, FaPause } from 'react-icons/fa';
import { FaTiktok, FaXTwitter } from 'react-icons/fa6';

// --- Import CSS Module ---
import styles from './HelldiversPage.module.css';
import dynamic from 'next/dynamic';

// const YoutubeCarousel = dynamic(() => import('@/app/(main)/helldivers-2/YoutubeCarousel'));
const ReviewsRotator = dynamic(() => import('@/app/(main)/helldivers-2/ReviewsRotator'));

// --- Review Data Structure ---
interface Review { id: number; author: string; title: string; text: string; rating: number; }
const reviews: Review[] = [ /* ... Review data ... */
    { id: 1, author: "joshgiff", title: "A Solid Growing Community", text: "I came across GPT fleet as a helldiver in a different discord server. We were offered to join a server that had a discord bot that would link other servers together to allow divers from across discord to link up and spread democracy together. So far in my experience it has been a safe, active and growing community to meet up and dive together. On times where I am not diving there is usually a group of people socializing in one of the voice chat channels and I have found that helpful for hobbying and hanging with other people. 10/10 would dive with them any day of the week.", rating: 5 },
    { id: 2, author: "charredviolet8771", title: "Democracy Approved", text: "I've been apart of the GPT Fleet for about three or four months now and the community has been so welcoming and encouraging. The folks here have given great advice and taught me so many things about Helldivers 2 that I would have struggled to figure out alone. I don't have to worry about folks being toxic towards me, which is great! I look forward to seeing where this awesome community goes in the future, and I highly recommend it as a place to learn/ hang out with your fellow Helldivers!", rating: 5 },
    { id: 3, author: "silverdolphin01", title: "Great Community", text: "I haven't been able to be as active as I'd like but this is a great community! I would definitely recommend to both new and experienced players!", rating: 5 },
    { id: 4, author: "krieg112", title: "Great, Non-toxic, and Casual", text: "I’ve been in GPT a few months now and I have achieved the server’s partial moderator sort of role. The training program was a great way of connecting to the amazing global community. I’ve not been pressured to play excessively or give up personal time to be involved either. TLDR: Great server with nice staff and members. Highly recommend.", rating: 5 },
    { id: 5, author: "zephthehuman", title: "The best non toxic Helldivers 2 Community I've seen so far", text: "If you are looking for a Helldivers 2 Gaming Clan(s) that isn't filled with raging elitists, trolls or chaos divers, but instead an 18+ sfw mature community, then GPT Fleet is definitely for you! I've been on Discord gaming communities since September 2015 and I know for a fact that this community shines in making it comfortable and welcoming for new players, returning players and veterans alike. Things I've noticed: (personally) ✔️non problematic banter (mostly in vc's) ✔️no name calling or flaming (policy included to prevent that) ✔️a mix of players of different lvls with a focus on community based challenges and it's leaderboard. ✔️a more casual mindset which in turn makes a super helldive more epic than usual ✔️a lot of friendly demeanor ✔️no activity requirements ✔️staff is attentive ✔️well structured server with it's own bots and clan network ✔️here's another checkmark for absolutely no reason!! :D", rating: 5 },
    { id: 6, author: "zolosio", title: "CERTIFICATE OF LEGITNESS", text: "As a member of the GPT Fleet since September 4 of 2024, I can confidently say that the group and members within from newbies to veterans are always VERY supportive and professionally polite. I never have to worry about toxicness 1 bit! or if it's going to be dry or not busy. This Amazing community really strives to be the number one helldivers 2 discord group and it shows, there is plenty and I mean PLENTY of room to grow in rank within the GPT and an endless amount of amazing people I personally love playing with including myself that will help you along the way! Need advice on what loadouts to bring to that next D10, or some coaching on accuracy from one of our top players? Whether you're looking to become the next John helldiver or just another scratch in the paw for freedom, the GPT fleet is definitely the place to be! With everything from community movie night to karaoke it can be as serious or casual as need be. It is definitely thebest community I have ever experienced where your effort doesn't go un-noticed and your always respected and protected. Amazing people honestly -Zolosio", rating: 5 },
    { id: 7, author: "duepulse", title: "GPT Fleet produces the best Helldivers", text: "Joined the fleet back in Aug of last year. Fought with the bravest and greatest that the fleet has to offer. And safe to say that anyone who joins up and is looking for anyone to join you into the frontlines, the fleet is spoiled with choices of very courageous and disciplined Helldivers. This review is approved by the Ministry of Truth", rating: 5 },
    { id: 8, author: "mr.swimson", title: "11/10 experience", text: "love the people, love the vibe, love the bots. Adding my own server with over 2.5k members to the GPT Fleet alliance was one of the best choices I've made. Really opened up doors for people to play together and meet new people across multiple servers. If you're looking for a chill community to hang out, I highly recommend GPT Fleet. All are welcome!!", rating: 5 },
    { id: 9, author: "mrman1594", title: "Best experience", text: "When I first got helldivers 2 I had a hard time knowing how the game works since I join GPT they give me one of the best experience!!!! I highly recommend joining If you’re new or daily player it makes the game so much fun!!!!", rating: 5 },
    { id: 10, author: "shway_maximus", title: "An amazing Helldiver guild curated by the best 10 Star General there is", text: "I joined this community two months ago after leveling to 145 playing solo with randoms. After joining this discord I've met so many great players and I have made many new friends. It's awesome playing with highly competent people consistently. Our glorious leader made it easy for us to set up an LFG channel or join one that is already in session. Everyone is so supportive and we continue to grow everyday.", rating: 5 },
    { id: 11, author: "vetscape", title: "A Fleet To Call Home Away From Super Earth", text: "I started this discord after my brother gifted me the game on steam when it came out. I never heard of Helldivers before. After playing the game, I really enjoyed the weapons mechanics, squad dynamics, and the galactic game master. My goal for GPT Fleet is to have a HD2 focused community that places value on escapism. Join our fleet, play in some squads, experience a fleet weekend event, and come back here and leave an honest review. Check it out. If you see someone in chat, they are probably playing, join up today!", rating: 5 },
    { id: 12, author: "lucian_666", title: "GPT FLEET is Amazing", text: "Ton of veterans from different branches. Great times and the owner of the server is always expanding to the next best thing. I love being here!", rating: 5 },
    { id: 13, author: "theslayestfox", title: "Greatly organized", text: "I love how social this server especially with all the different channels and it really active got events about every week and people playing about everyday always time to grab some hell divers and spread democracy", rating: 5 },
    { id: 14, author: "nocturnalverse", title: "GPT Fleet is a great Helldiver community.", text: "We're looking to be a Helldiver only discord. We welcome new players especially. We're growing slowly but the goal is to always have someone to play with in the style of play that you enjoy. Check it out. If you see someone in chat, they are probably playing, join up today!", rating: 5 },
    { id: 15, author: "corbiskeys", title: "Ode to Freedom", text: `In the digital sea, a fleet does sail,\n"GPT Fleet," where friendships prevail.\nA haven for gamers, a circle so wide,\nWhere laughter and teamwork coincide.\n\nHere, every voice finds a welcoming tune,\nUnder the watchful gaze of the digital moon.\nFrom puzzles to battles, in worlds far and wide,\nBeside every player, a friend to confide.\n\nIn "GPT Fleet," where the banners are unfurled,\nA community thrives in this virtual world.\nNo matter the game, the hour, the quest,\nHere, you're more than a guest.\n\nSo sail into the harbor, where the heart never fleets,\nJoin hands, join games, in the "GPT Fleet."\nFor in this haven of pixels, you'll always find,\nA place to call home, a group of your kind.`, rating: 5 },
    { id: 16, author: "themephs", title: "Unbelievable quality", text: "Thanks to GPT Fleet I can marry my cousins and developed a fentanyl addiction. Keep slaying. Thanks GPT Fleet!", rating: 5 },
    { id: 17, author: "brentielal1123", title: "Democracy", text: "Come in and have fun, friendly people and there to help. Democracy for all and plenty of Bug Juice to go around. Weeky Events going on as well.", rating: 5 },
];

// --- Background video + audio styles (borrowed from auth page) ---
const bgStyles = {
  container: {
    position: 'relative' as const,
    minHeight: '100vh',
    width: '100%',
    overflow: 'hidden',
  },
  videoBackground: {
    position: 'absolute' as const,
    top: '50%', left: '50%',
    width: 'auto', height: 'auto',
    minWidth: '100%', minHeight: '100%',
    objectFit: 'cover' as const,
    transform: 'translate(-50%, -50%)',
    zIndex: -2 as const,
    filter: 'brightness(0.6)',
  },
  overlay: { position: 'absolute' as const, inset: 0, backgroundColor: 'rgba(16, 20, 31, 0.35)', zIndex: -1 as const },
  audioControlsContainer: { position: 'fixed' as const, bottom: '1.5rem', left: '1.5rem', display: 'flex', alignItems: 'flex-end', gap: '0.75rem', zIndex: 10 },
  audioButtonAndSliderContainer: { position: 'relative' as const, display: 'flex', flexDirection: 'column' as const, alignItems: 'center' },
  audioControl: { backgroundColor: 'rgba(30, 41, 59, 0.6)', backdropFilter: 'blur(5px)', color: '#9ca3af', border: '1px solid rgba(51, 65, 85, 0.5)', borderRadius: '50%', width: '44px', height: '44px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', transition: 'all 0.2s ease', boxShadow: '0 4px 8px rgba(0, 0, 0, 0.3)', flexShrink: 0, outline: 'none', position: 'relative' as const, zIndex: 1 },
  audioControlHover: { color: '#e0e0e0', backgroundColor: 'rgba(51, 65, 85, 0.8)', transform: 'scale(1.05)' },
  audioControlFocus: { boxShadow: '0 0 0 3px rgba(66, 153, 225, 0.6)' },
  volumeSliderContainer: { position: 'absolute' as const, bottom: 'calc(100% + 10px)', left: '50%', transform: 'translateX(-50%)', opacity: 0, visibility: 'hidden' as const, transition: 'opacity 0.3s ease-in-out, visibility 0s linear 0.3s', backgroundColor: 'rgba(30, 41, 59, 0.7)', padding: '10px 5px', borderRadius: '8px', border: '1px solid rgba(51, 65, 85, 0.5)', boxShadow: '0 2px 5px rgba(0,0,0,0.2)', zIndex: 5 },
  volumeSliderContainerVisible: { opacity: 1, visibility: 'visible' as const, transition: 'opacity 0.3s ease-in-out, visibility 0s linear 0s' },
  volumeSlider: { appearance: 'slider-vertical', width: '8px', height: '100px', cursor: 'pointer', backgroundColor: '#4a5568', borderRadius: '4px', outline: 'none', margin: 'auto' } as React.CSSProperties,
  audioCredit: { fontSize: '0.7rem', color: 'rgba(200, 200, 200, 0.8)', lineHeight: 1.3, textShadow: '0 1px 2px rgba(0, 0, 0, 0.5)', opacity: 0, visibility: 'hidden' as const, transition: 'opacity 0.5s ease-in-out, visibility 0s linear 0.5s', maxWidth: '200px' },
  audioCreditVisible: { opacity: 1, visibility: 'visible' as const, transition: 'opacity 0.5s ease-in-out, visibility 0s linear 0s' },
  audioCreditLink: { color: 'rgba(165, 243, 252, 0.9)', textDecoration: 'underline', textUnderlineOffset: '2px', display: 'inline', wordBreak: 'break-all' },
  audioCreditLinkHover: { color: '#a5f3fc' },
} as const;

const ANTHEM_YOUTUBE_URL = "https://youtu.be/Q9pkh4Z39nE?si=2v5e1EEBKdoVC6YW";

export default function HelldiversPage() {
    const discordServerLink = "https://discord.gg/gptfleet";
    // Placeholder social links; replace with real profiles if available
    const youtubeLink = "#";
    const twitchLink = "#";
    const tiktokLink = "#";
    const xLink = "#";

    // Audio State/Refs (mirrors auth page)
    const audioRef = useRef<HTMLAudioElement>(null);
    const videoRef = useRef<HTMLVideoElement>(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [userInteracted, setUserInteracted] = useState(false);
    const [volume, setVolume] = useState(0.15);
    const [showVolumeSlider, setShowVolumeSlider] = useState(false);
    const [audioControlHover, setAudioControlHover] = useState(false);
    const [audioControlFocus, setAudioControlFocus] = useState(false);
    const [anthemLinkHover, setAnthemLinkHover] = useState(false);

    const handleInteraction = () => {
        if (!userInteracted) {
            setUserInteracted(true);
            if (audioRef.current) audioRef.current.volume = volume;
            if (videoRef.current && videoRef.current.paused) {
                videoRef.current.play().catch(() => {});
            }
        }
    };

    const handlePlayToggle = () => {
        if (!userInteracted) handleInteraction();
        const audioElement = audioRef.current;
        if (!audioElement) return;
        if (isPlaying) {
            audioElement.pause(); setIsPlaying(false);
        } else {
            if (audioElement.readyState >= 2) {
                const playPromise = audioElement.play();
                if (playPromise !== undefined) {
                    playPromise.then(() => setIsPlaying(true)).catch(() => { setIsPlaying(false); alert(userInteracted ? "Could not play audio." : "Click page to enable audio."); });
                } else { setIsPlaying(true); }
            } else {
                alert("Audio loading, try again.");
            }
        }
    };

    const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => { setVolume(parseFloat(e.target.value)); };

    useEffect(() => {
        const videoElement = videoRef.current;
        if (videoElement) {
            videoElement.muted = true; videoElement.playsInline = true;
            if (videoElement.paused) videoElement.play().catch(() => {});
        }
    }, []);

    useEffect(() => { if (audioRef.current) audioRef.current.volume = volume; }, [volume]);

    const audioControlFinalStyle = { ...bgStyles.audioControl, ...(audioControlHover ? bgStyles.audioControlHover : {}), ...(audioControlFocus ? bgStyles.audioControlFocus : {}) };
    const audioCreditFinalStyle = { ...bgStyles.audioCredit, ...(isPlaying ? bgStyles.audioCreditVisible : {}) };
    const audioCreditLinkFinalStyle = { ...bgStyles.audioCreditLink, ...(anthemLinkHover ? bgStyles.audioCreditLinkHover : {}) };
    const volumeSliderContainerFinalStyle = { ...bgStyles.volumeSliderContainer, ...(showVolumeSlider ? bgStyles.volumeSliderContainerVisible : {}) };

    return (
        <div style={bgStyles.container} onClick={handleInteraction}>
            {/* Background Video */}
            <video ref={videoRef} autoPlay loop muted playsInline style={bgStyles.videoBackground} key="bg-video">
                <source src="/videos/gpd_background.mp4" type="video/mp4" />
                Your browser does not support the video tag.
            </video>
            <div style={bgStyles.overlay}></div>

            {/* Page Content */}
            <div className={styles.pageContainer}>
                {/* === About (Split) Section: Text left, GIF right === */}
                <section className={`${styles.section} ${styles.splitSection}`}>
                    <div className={styles.splitText}>
                        <h2 className={styles.sectionTitle}>
                            GPT HELLDIVERS 2
                            <span className={styles.socialIconsGroup}>
                                <Link href={discordServerLink} target="_blank" rel="noopener noreferrer" aria-label="Join the GPT Discord" title="Join the GPT Discord" className={styles.socialIconLink}>
                                    <FaDiscord className={styles.socialIcon} />
                                </Link>
                                <Link href={youtubeLink} target="_blank" rel="noopener noreferrer" aria-label="YouTube" title="YouTube" className={styles.socialIconLink}>
                                    <FaYoutube className={styles.socialIcon} />
                                </Link>
                                <Link href={twitchLink} target="_blank" rel="noopener noreferrer" aria-label="Twitch" title="Twitch" className={styles.socialIconLink}>
                                    <FaTwitch className={styles.socialIcon} />
                                </Link>
                                <Link href={tiktokLink} target="_blank" rel="noopener noreferrer" aria-label="TikTok" title="TikTok" className={styles.socialIconLink}>
                                    <FaTiktok className={styles.socialIcon} />
                                </Link>
                                <Link href={xLink} target="_blank" rel="noopener noreferrer" aria-label="X (Twitter)" title="X (Twitter)" className={styles.socialIconLink}>
                                    <FaXTwitter className={styles.socialIcon} />
                                </Link>
                            </span>
                        </h2>
                        <p className={styles.paragraph}> Welcome to the Galactic Phantom Taskforce (GPT) Helldivers 2 Division! We are a rapidly growing, multi-game community focused on creating a non-toxic, mature, and fun environment for gamers. Whether you're a fresh recruit dropping onto Malevelon Creek for the first time or a seasoned Super Citizen spreading managed democracy across the galaxy, you have a place here. </p>
                        <p className={styles.paragraph}> Our core values center around respect, teamwork, and enjoying the game together. We value every member and strive to provide an inclusive space where players can coordinate missions, share strategies, showcase their triumphs (and epic fails!), and simply hang out. We utilize Discord extensively for communication, LFG (Looking For Group), and organizing community events. Join us today! </p>
                    </div>
                    <div className={styles.splitImage}>
                        <img src="/images/ultrasad.gif" alt="Ultra Sad Helldiver" className={styles.centeredImage} />
                    </div>
                </section>

                {/* === New to the Fight (Split) Section: Text left, GIF right === */}
                <section className={`${styles.section} ${styles.splitSection}`}> {/* removed styles.reverse to move GIF to right */}
                    <div className={styles.splitText}>
                        <h2 className={styles.sectionTitle}>New to the Fight?</h2>
                        <p className={styles.paragraph}> Just bought the game? Feeling overwhelmed by Bile Titans or Hulks? Don't worry, we've all been there! GPT offers a supportive environment for new players. Ask questions, team up with experienced members who can show you the ropes (and the best ways to avoid friendly fire... mostly!), and learn the basics without fear of judgment. </p>
                        <p className={styles.paragraph}> We have dedicated channels for LFG, tips, and loadout discussions. Joining voice chat is encouraged for better coordination during missions, but not mandatory if you prefer text. Find squadmates for anything from trivial difficulty farming to your first Helldive attempt! </p>
                    </div>
                    <div className={styles.splitImage}>
                        <img src="/images/helldiver_poster.gif" alt="New to the Fight" className={styles.centeredImage} />
                    </div>
                </section>

                {/* === Veterans (Split) Section: Text left, GIF right === */}
                <section className={`${styles.section} ${styles.splitSection}`}>
                    <div className={styles.splitText}>
                        <h2 className={styles.sectionTitle}>Seasoned Veterans Welcome!</h2>
                        <p className={styles.paragraph}> Think you've seen it all? Mastered the art of the 500kg bomb? Looking for a consistent group to tackle Difficulty 9+ operations and coordinate advanced strategies? GPT is home to many experienced Helldivers eager to push the limits and contribute to the Galactic War effort effectively. </p>
                        <p className={styles.paragraph}> Coordinate multi-squad planetary operations, share your high-level strategies, participate in community-organized challenges (like the John Helldiver Course!), or simply find reliable teammates who understand the importance of covering flanks and calling out patrols. Help mentor newer players or form elite squads for the toughest challenges the galaxy throws at us. </p>
                    </div>
                    <div className={styles.splitImage}>
                        <img src="/images/veteran_image.gif" alt="Seasoned Helldiver Veteran" className={styles.centeredImage} />
                    </div>
                </section>

                {/* === Reviews Section === */}
                <ReviewsRotator reviews={reviews} reviewSourceLink={"https://disboard.org/server/1214787549655203862"} />
            </div>

            {/* Audio Player */}
            <audio ref={audioRef} loop preload="auto">
                <source src="/audio/superearth_anthem.mp3" type="audio/mpeg" />
                Your browser does not support the audio element.
            </audio>

            {/* Audio Controls */}
            <div style={bgStyles.audioControlsContainer}>
                <div style={bgStyles.audioButtonAndSliderContainer} onMouseEnter={() => setShowVolumeSlider(true)} onMouseLeave={() => setShowVolumeSlider(false)}>
                    <div style={volumeSliderContainerFinalStyle}>
                        <input type="range" min="0" max="1" step="0.01" value={volume} onChange={handleVolumeChange} style={bgStyles.volumeSlider} aria-label="Volume" />
                    </div>
                    <button
                        style={audioControlFinalStyle}
                        onClick={handlePlayToggle}
                        onMouseEnter={() => setAudioControlHover(true)}
                        onMouseLeave={() => setAudioControlHover(false)}
                        onFocus={() => setAudioControlFocus(true)}
                        onBlur={() => setAudioControlFocus(false)}
                        aria-label={isPlaying ? "Pause music" : "Play music"}
                        title={isPlaying ? "Pause music" : "Play music"}
                    >
                        {isPlaying ? <FaPause className="w-5 h-5" /> : <FaPlay className="w-5 h-5" />}
                    </button>
                </div>
                <div style={audioCreditFinalStyle}>
                    <strong>Super Earth National Anthem</strong><br /> Ross Tregenza<br /> <small>Helldivers 2 (OST)</small><br/>
                    <Link href={ANTHEM_YOUTUBE_URL} target="_blank" rel="noopener noreferrer" style={audioCreditLinkFinalStyle} onMouseEnter={() => setAnthemLinkHover(true)} onMouseLeave={() => setAnthemLinkHover(false)} title="Listen on YouTube"> (Listen) </Link>
                </div>
            </div>
        </div>
    );
}