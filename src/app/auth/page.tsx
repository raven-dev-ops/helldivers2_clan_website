// src/app/auth/page.tsx
"use client";

import { signIn, useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState, useRef } from 'react';
import { FaDiscord, FaGoogle, FaPlay, FaPause } from 'react-icons/fa'; // Correct icons
import Image from 'next/image';
import Link from 'next/link';

// --- Style Objects ---
// Assume these exist as defined in the previous correct answer
const styles = {
  authContainer: { display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', width: '100%', padding: '1rem', color: '#e0e0e0', position: 'relative', overflow: 'hidden' } as React.CSSProperties,
  videoBackground: { position: 'absolute', top: '50%', left: '50%', width: 'auto', height: 'auto', minWidth: '100%', minHeight: '100%', objectFit: 'cover', transform: 'translate(-50%, -50%)', zIndex: -2, filter: 'brightness(0.6)' } as React.CSSProperties,
  overlay: { position: 'absolute', inset: 0, backgroundColor: 'rgba(16, 20, 31, 0.65)', zIndex: -1 } as React.CSSProperties,
  card: { display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%', maxWidth: '420px', padding: '2.5rem 2rem', backgroundColor: 'rgba(30, 41, 59, 0.7)', backdropFilter: 'blur(8px)', borderRadius: '1rem', border: '1px solid rgba(51, 65, 85, 0.6)', boxShadow: '0 10px 30px rgba(0, 0, 0, 0.4)', textAlign: 'center', position: 'relative', zIndex: 1 } as React.CSSProperties,
  logo: { width: '70px', height: '70px', marginBottom: '1.5rem', opacity: 0.9 } as React.CSSProperties,
  title: { fontSize: '1.8rem', fontWeight: 700, marginBottom: '0.5rem', color: '#f0f0f0' } as React.CSSProperties,
  subtitle: { fontSize: '1rem', color: '#a0aec0', marginBottom: '2rem' } as React.CSSProperties,
  buttonGroup: { width: '100%', display: 'flex', flexDirection: 'column' as 'column', gap: '1rem' } as React.CSSProperties,
  buttonBase: { width: '100%', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: '0.75rem', padding: '0.8rem 1rem', border: '1px solid transparent', borderRadius: '0.5rem', fontWeight: 600, fontSize: '0.95rem', cursor: 'pointer', transition: 'all 0.2s ease-in-out', outline: 'none' } as React.CSSProperties,
  discordButton: { backgroundColor: '#5865F2', color: '#ffffff', borderColor: '#5865F2' } as React.CSSProperties,
  discordButtonHover: { backgroundColor: '#4f5bda', borderColor: '#4f5bda', transform: 'translateY(-2px)', boxShadow: '0 6px 12px rgba(88, 101, 242, 0.35)' } as React.CSSProperties,
  googleButton: { backgroundColor: '#ffffff', color: '#374151', borderColor: '#d1d5db' } as React.CSSProperties,
  googleButtonHover: { backgroundColor: '#f9fafb', borderColor: '#c8cdd3', transform: 'translateY(-2px)', boxShadow: '0 6px 12px rgba(0, 0, 0, 0.15)' } as React.CSSProperties,
  buttonFocusVisible: { outline: 'none', boxShadow: '0 0 0 3px rgba(66, 153, 225, 0.6)' } as React.CSSProperties,
  buttonIcon: { width: '1.25rem', height: '1.25rem', flexShrink: 0 } as React.CSSProperties,
  footerText: { fontSize: '0.75rem', color: '#718096', marginTop: '2.5rem', textAlign: 'center' as 'center', maxWidth: '400px', position: 'relative', zIndex: 1 } as React.CSSProperties,
  loadingOverlay: { position: 'fixed', inset: 0, display: 'flex', justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(15, 23, 42, 0.8)', backdropFilter: 'blur(4px)', zIndex: 50 } as React.CSSProperties,
  loadingText: { fontSize: '1.125rem', color: '#94a3b8' } as React.CSSProperties,
  audioControlsContainer: { position: 'fixed', bottom: '1.5rem', left: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.75rem', zIndex: 10 } as React.CSSProperties,
  audioControl: { backgroundColor: 'rgba(30, 41, 59, 0.6)', backdropFilter: 'blur(5px)', color: '#9ca3af', border: '1px solid rgba(51, 65, 85, 0.5)', borderRadius: '50%', width: '44px', height: '44px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', transition: 'all 0.2s ease', boxShadow: '0 4px 8px rgba(0, 0, 0, 0.3)', flexShrink: 0 } as React.CSSProperties,
  audioControlHover: { color: '#e0e0e0', backgroundColor: 'rgba(51, 65, 85, 0.8)', transform: 'scale(1.05)' } as React.CSSProperties,
  audioCredit: { fontSize: '0.7rem', color: 'rgba(200, 200, 200, 0.8)', lineHeight: 1.3, textShadow: '0 1px 2px rgba(0, 0, 0, 0.5)', opacity: 0, visibility: 'hidden' as 'hidden', transition: 'opacity 0.5s ease-in-out, visibility 0s linear 0.5s', maxWidth: '200px' } as React.CSSProperties,
  audioCreditVisible: { opacity: 1, visibility: 'visible' as 'visible', transition: 'opacity 0.5s ease-in-out, visibility 0s linear 0s' } as React.CSSProperties,
  audioCreditLink: { color: 'rgba(165, 243, 252, 0.9)', textDecoration: 'underline', textUnderlineOffset: '2px', display: 'inline', wordBreak: 'break-all' } as React.CSSProperties,
  audioCreditLinkHover: { color: '#a5f3fc' } as React.CSSProperties,
};


const ANTHEM_YOUTUBE_URL = "https://youtu.be/Q9pkh4Z39nE?si=2v5e1EEBKdoVC6YW";

export default function AuthPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const audioRef = useRef<HTMLAudioElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  // Hover/Focus States
  const [discordHover, setDiscordHover] = useState(false);
  const [discordFocus, setDiscordFocus] = useState(false);
  const [googleHover, setGoogleHover] = useState(false);
  const [googleFocus, setGoogleFocus] = useState(false);
  const [audioControlHover, setAudioControlHover] = useState(false);
  const [anthemLinkHover, setAnthemLinkHover] = useState(false);

  // Audio State
  const [isPlaying, setIsPlaying] = useState(false);
  const [userInteracted, setUserInteracted] = useState(false);

  // Function to mark user interaction
  const handleInteraction = () => {
    if (!userInteracted) {
      console.log("User interaction detected.");
      setUserInteracted(true);
      // Try playing video again if it was blocked
      if (videoRef.current && videoRef.current.paused) {
        videoRef.current.play().catch(e => console.error("Video play error after interaction:", e));
      }
    }
  };

  // Auth Redirect Effect
  useEffect(() => {
    if (status === 'authenticated') {
      router.replace('/');
    }
  }, [status, router]);

  // Video Playback Attempt on Mount
  useEffect(() => {
      const videoElement = videoRef.current;
      if (videoElement) {
          videoElement.muted = true;
          videoElement.playsInline = true;
          console.log("Attempting to play video...");
          // Add a check to see if it's already playing to avoid unnecessary calls
          if (videoElement.paused) {
            videoElement.play().catch(error => {
                console.warn("Video autoplay was potentially blocked. Requires user interaction.", error);
            });
          }
      }
  }, []); // Run only once

  // Audio Toggle Handler
  const handlePlayToggle = () => {
    handleInteraction(); // Ensure interaction is registered
    const audioElement = audioRef.current;
    if (!audioElement) return;

    if (isPlaying) {
      audioElement.pause();
      setIsPlaying(false);
      console.log("Audio paused");
    } else {
      audioElement.play()
        .then(() => {
          setIsPlaying(true);
          console.log("Audio playing");
        })
        .catch(error => {
          setIsPlaying(false);
          console.error("Audio play failed:", error);
          if (!userInteracted) {
              alert("Click anywhere on the page first to enable audio playback, then try playing again.");
          } else {
              alert("Could not play audio. Please check browser permissions or try again.");
          }
        });
    }
  };

  // Render loading state
  if (status === 'loading') {
    return <div style={styles.loadingOverlay}><p style={styles.loadingText}>Loading Session...</p></div>;
  }

  // Render sign-in options only if unauthenticated
  if (status === 'unauthenticated') {
    const discordFinalStyle = { ...styles.buttonBase, ...styles.discordButton, ...(discordHover ? styles.discordButtonHover : {}), ...(discordFocus ? styles.buttonFocusVisible : {}) };
    const googleFinalStyle = { ...styles.buttonBase, ...styles.googleButton, ...(googleHover ? styles.googleButtonHover : {}), ...(googleFocus ? styles.buttonFocusVisible : {}) };
    const audioControlFinalStyle = { ...styles.audioControl, ...(audioControlHover ? styles.audioControlHover : {}) };
    const audioCreditFinalStyle = { ...styles.audioCredit, ...(isPlaying ? styles.audioCreditVisible : {}) }; // Visibility based on isPlaying
    const audioCreditLinkFinalStyle = { ...styles.audioCreditLink, ...(anthemLinkHover ? styles.audioCreditLinkHover : {}) };

    return (
      // Main container with interaction handler
      <div style={styles.authContainer} onClick={handleInteraction}>

        {/* --- Video Background Section --- */}
        <video
            ref={videoRef}
            autoPlay
            loop
            muted // Keep muted for background video
            playsInline
            style={styles.videoBackground}
            key="bg-video" // Key can help React manage the element
            onCanPlay={() => console.log("Video ready to play")} // More specific event
            onError={(e) => console.error("Video Error Event:", e)} // Log the event object
        >
          {/* Verify this path points to public/videos/gpd_background.mp4 */}
          <source src="/videos/gpd_background.mp4" type="video/mp4" />
          Your browser does not support the video tag.
        </video>
        <div style={styles.overlay}></div>
        {/* --- End Video Background --- */}


        {/* --- Login Card Section --- */}
        <div style={styles.card}>
          <Image src="/placeholder.png" alt="GPD Logo" width={70} height={70} style={styles.logo} priority />
          <h1 style={styles.title}>Access Network Terminal</h1>
          <p style={styles.subtitle}>Authenticate using a secure channel.</p>
          <div style={styles.buttonGroup}>
            {/* Provider Buttons */}
            <button onClick={() => { handleInteraction(); signIn('discord', { callbackUrl: '/' }); }} style={discordFinalStyle} onMouseEnter={() => setDiscordHover(true)} onMouseLeave={() => setDiscordHover(false)} onFocus={() => setDiscordFocus(true)} onBlur={() => setDiscordFocus(false)}>
              <FaDiscord style={styles.buttonIcon} /> Continue with Discord
            </button>
            <button onClick={() => { handleInteraction(); signIn('google', { callbackUrl: '/' }); }} style={googleFinalStyle} onMouseEnter={() => setGoogleHover(true)} onMouseLeave={() => setGoogleHover(false)} onFocus={() => setGoogleFocus(true)} onBlur={() => setGoogleFocus(false)}>
              <FaGoogle style={styles.buttonIcon} /> Continue with Google
            </button>
          </div>
        </div>
        {/* --- End Login Card --- */}


        {/* --- Footer Text --- */}
        <p style={styles.footerText}>Unauthorized access is monitored. System use implies consent.</p>


        {/* --- Audio Section --- */}
        <audio ref={audioRef} loop preload="auto">
           {/* Verify this path points to public/audio/superearth_anthem.mp3 (or .mp4) */}
          <source src="/audio/superearth_anthem.mp3" type="audio/mpeg" />
          {/* Adjust type if using mp4: <source src="/audio/superearth_anthem.mp4" type="audio/mp4" /> */}
          Your browser does not support the audio element.
        </audio>

        <div style={styles.audioControlsContainer}>
            {/* Play/Pause Button */}
            <button
              style={audioControlFinalStyle}
              onClick={handlePlayToggle}
              onMouseEnter={() => setAudioControlHover(true)}
              onMouseLeave={() => setAudioControlHover(false)}
              aria-label={isPlaying ? "Pause background music" : "Play background music"}
              title={isPlaying ? "Pause background music" : "Play background music"}
            >
              {isPlaying ? <FaPause className="w-5 h-5" /> : <FaPlay className="w-5 h-5" />}
            </button>

            {/* Credit Text */}
            <div style={audioCreditFinalStyle}>
                <strong>Super Earth National Anthem</strong><br />
                Ross Tregenza<br />
                <small>Helldivers 2 (Original Soundtrack)</small><br/>
                <Link href={ANTHEM_YOUTUBE_URL} target="_blank" rel="noopener noreferrer" style={audioCreditLinkFinalStyle} onMouseEnter={() => setAnthemLinkHover(true)} onMouseLeave={() => setAnthemLinkHover(false)} title="Listen on YouTube (opens new tab)">
                    (Listen)
                </Link>
            </div>
        </div>
         {/* --- End Audio Section --- */}

      </div> // End authContainer
    );
  }

  // Return null if authenticated (redirect will happen) or in other states
  return null;
}