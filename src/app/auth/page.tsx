// src/app/auth/page.tsx
"use client";

import { signIn, useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState, useRef } from 'react';
import { FaDiscord, FaGoogle, FaPlay, FaPause } from 'react-icons/fa';
import Image from 'next/image';
import Link from 'next/link';

// --- Style Objects (Complete and Corrected) ---
const styles = {
  // --- Main container covering viewport ---
  authContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '100vh',
    width: '100%',
    padding: '1rem',
    color: '#e0e0e0',
    position: 'relative',
    overflow: 'hidden',
  } as React.CSSProperties,

  // --- Background video styling ---
  videoBackground: {
    position: 'absolute',
    top: '50%', left: '50%',
    width: 'auto', height: 'auto', // Let browser determine initial size
    minWidth: '100%', minHeight: '100%', // Force cover
    objectFit: 'cover',
    transform: 'translate(-50%, -50%)',
    zIndex: -2,
    filter: 'brightness(0.6)', // Dim the video
  } as React.CSSProperties,

  // --- Dark overlay ---
  overlay: {
    position: 'absolute',
    inset: 0,
    backgroundColor: 'rgba(16, 20, 31, 0.35)', // Semi-transparent overlay
    zIndex: -1,
  } as React.CSSProperties,

  // --- Centered login card ---
  card: {
    display: 'flex', flexDirection: 'column', alignItems: 'center',
    width: '100%', maxWidth: '420px',
    padding: '2.5rem 2rem',
    backgroundColor: 'rgba(30, 41, 59, 0.75)', // Card background
    backdropFilter: 'blur(10px)', // Blur effect
    borderRadius: '1rem',
    border: '1px solid rgba(51, 65, 85, 0.6)',
    boxShadow: '0 10px 30px rgba(0, 0, 0, 0.4)',
    textAlign: 'center',
    position: 'relative', zIndex: 1, // Ensure card is above overlay
  } as React.CSSProperties,

  // --- Logo styling ---
  logo: {
    width: '320px', height: '240px',
    marginBottom: '1.5rem',
    opacity: 0.9,
    objectFit: 'cover', // Scale logo correctly
  } as React.CSSProperties,

  // --- Text styling ---
  title: { fontSize: '2.4rem', fontWeight: 700, marginBottom: '0.5rem', color: '#f0f0f0' } as React.CSSProperties,
  subtitle: { fontSize: '1rem', color: '#a0aec0', marginBottom: '2rem' } as React.CSSProperties,
  footerText: { fontSize: '0.75rem', color: '#718096', marginTop: '2.5rem', textAlign: 'center' as 'center', maxWidth: '400px', position: 'relative', zIndex: 1 } as React.CSSProperties,

  // --- Button styling ---
  buttonGroup: { width: '100%', display: 'flex', flexDirection: 'column' as 'column', gap: '1rem' } as React.CSSProperties,
  buttonBase: { width: '100%', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: '0.75rem', padding: '0.8rem 1rem', border: '1px solid transparent', borderRadius: '0.5rem', fontWeight: 600, fontSize: '0.95rem', cursor: 'pointer', transition: 'all 0.2s ease-in-out', outline: 'none' } as React.CSSProperties,
  buttonIcon: { width: '1.25rem', height: '1.25rem', flexShrink: 0 } as React.CSSProperties,
  discordButton: { backgroundColor: '#5865F2', color: '#ffffff', borderColor: '#5865F2' } as React.CSSProperties,
  discordButtonHover: { backgroundColor: '#4f5bda', borderColor: '#4f5bda', transform: 'translateY(-2px)', boxShadow: '0 6px 12px rgba(88, 101, 242, 0.35)' } as React.CSSProperties,
  googleButton: { backgroundColor: '#ffffff', color: '#374151', borderColor: '#d1d5db' } as React.CSSProperties,
  googleButtonHover: { backgroundColor: '#f9fafb', borderColor: '#c8cdd3', transform: 'translateY(-2px)', boxShadow: '0 6px 12px rgba(0, 0, 0, 0.15)' } as React.CSSProperties,
  buttonFocusVisible: { outline: 'none', boxShadow: '0 0 0 3px rgba(66, 153, 225, 0.6)' } as React.CSSProperties, // Generic focus style

  // --- Loading state styling ---
  loadingOverlay: { position: 'fixed', inset: 0, display: 'flex', justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(15, 23, 42, 0.8)', backdropFilter: 'blur(4px)', zIndex: 50 } as React.CSSProperties,
  loadingText: { fontSize: '1.125rem', color: '#94a3b8' } as React.CSSProperties,

  // --- Audio Controls styling ---
  audioControlsContainer: { position: 'fixed', bottom: '1.5rem', left: '1.5rem', display: 'flex', alignItems: 'flex-end', gap: '0.75rem', zIndex: 10 } as React.CSSProperties,
  audioButtonAndSliderContainer: { position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'center' } as React.CSSProperties,
  audioControl: { backgroundColor: 'rgba(30, 41, 59, 0.6)', backdropFilter: 'blur(5px)', color: '#9ca3af', border: '1px solid rgba(51, 65, 85, 0.5)', borderRadius: '50%', width: '44px', height: '44px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', transition: 'all 0.2s ease', boxShadow: '0 4px 8px rgba(0, 0, 0, 0.3)', flexShrink: 0, outline: 'none', position: 'relative', zIndex: 1 } as React.CSSProperties,
  audioControlHover: { color: '#e0e0e0', backgroundColor: 'rgba(51, 65, 85, 0.8)', transform: 'scale(1.05)' } as React.CSSProperties,
  audioControlFocus: { boxShadow: '0 0 0 3px rgba(66, 153, 225, 0.6)' } as React.CSSProperties, // Focus for audio button
  volumeSliderContainer: { position: 'absolute', bottom: 'calc(100% + 10px)', left: '50%', transform: 'translateX(-50%)', opacity: 0, visibility: 'hidden' as 'hidden', transition: 'opacity 0.3s ease-in-out, visibility 0s linear 0.3s', backgroundColor: 'rgba(30, 41, 59, 0.7)', padding: '10px 5px', borderRadius: '8px', border: '1px solid rgba(51, 65, 85, 0.5)', boxShadow: '0 2px 5px rgba(0,0,0,0.2)', zIndex: 5 } as React.CSSProperties,
  volumeSliderContainerVisible: { opacity: 1, visibility: 'visible' as 'visible', transition: 'opacity 0.3s ease-in-out, visibility 0s linear 0s' } as React.CSSProperties,
  volumeSlider: {
      appearance: 'slider-vertical', // Type augmentation needed (css.d.ts)
      // writingMode: 'vertical-lr', // Type augmentation needed
      width: '8px', height: '100px', cursor: 'pointer',
      backgroundColor: '#4a5568', borderRadius: '4px', outline: 'none', margin: 'auto',
  } as React.CSSProperties,
  audioCredit: { fontSize: '0.7rem', color: 'rgba(200, 200, 200, 0.8)', lineHeight: 1.3, textShadow: '0 1px 2px rgba(0, 0, 0, 0.5)', opacity: 0, visibility: 'hidden' as 'hidden', transition: 'opacity 0.5s ease-in-out, visibility 0s linear 0.5s', maxWidth: '200px' } as React.CSSProperties,
  audioCreditVisible: { opacity: 1, visibility: 'visible' as 'visible', transition: 'opacity 0.5s ease-in-out, visibility 0s linear 0s' } as React.CSSProperties,
  audioCreditLink: { color: 'rgba(165, 243, 252, 0.9)', textDecoration: 'underline', textUnderlineOffset: '2px', display: 'inline', wordBreak: 'break-all' } as React.CSSProperties,
  audioCreditLinkHover: { color: '#a5f3fc' } as React.CSSProperties,
};

const ANTHEM_YOUTUBE_URL = "https://youtu.be/Q9pkh4Z39nE?si=2v5e1EEBKdoVC6YW";

export default function AuthPage() {
  // --- State and Refs ---
  const { data: session, status } = useSession();
  const router = useRouter();
  const audioRef = useRef<HTMLAudioElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [discordHover, setDiscordHover] = useState(false);
  const [discordFocus, setDiscordFocus] = useState(false);
  const [googleHover, setGoogleHover] = useState(false);
  const [googleFocus, setGoogleFocus] = useState(false);
  const [audioControlHover, setAudioControlHover] = useState(false);
  const [audioControlFocus, setAudioControlFocus] = useState(false); // Focus state for audio button
  const [anthemLinkHover, setAnthemLinkHover] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [userInteracted, setUserInteracted] = useState(false);
  const [volume, setVolume] = useState(0.15);
  const [showVolumeSlider, setShowVolumeSlider] = useState(false);

  // --- Functions ---
  const handleInteraction = () => {
    if (!userInteracted) {
      console.log("User interaction detected.");
      setUserInteracted(true);
      if (audioRef.current) audioRef.current.volume = volume;
      if (videoRef.current && videoRef.current.paused) {
        videoRef.current.play().catch(e => console.error("Video play error after interaction:", e));
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
             playPromise.then(() => setIsPlaying(true))
                .catch(error => {
                    setIsPlaying(false); console.error("Audio play failed:", error);
                    alert(userInteracted ? "Could not play audio." : "Click page to enable audio.");
                });
          } else { setIsPlaying(true); }
      } else {
          console.warn("Audio not ready."); alert("Audio loading, try again.");
      }
    }
  };

  const handleVolumeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      setVolume(parseFloat(event.target.value));
  };

  // --- Effects ---
  useEffect(() => { // Auth Redirect
    if (status === 'authenticated') router.replace('/');
  }, [status, router]);

  useEffect(() => { // Video Play Attempt
      const videoElement = videoRef.current;
      if (videoElement) {
          videoElement.muted = true; videoElement.playsInline = true;
          if (videoElement.paused) videoElement.play().catch(e => console.warn("Video autoplay potentially blocked.", e));
      }
  }, []);

  useEffect(() => { // Sync Volume State
      if (audioRef.current) audioRef.current.volume = volume;
  }, [volume]);

  // --- Render Logic ---
  if (status === 'loading') {
    return <div style={styles.loadingOverlay}><p style={styles.loadingText}>Loading Session...</p></div>;
  }

  if (status === 'unauthenticated') {
    // Combine styles conditionally
    const discordFinalStyle = { ...styles.buttonBase, ...styles.discordButton, ...(discordHover ? styles.discordButtonHover : {}), ...(discordFocus ? styles.buttonFocusVisible : {}) };
    const googleFinalStyle = { ...styles.buttonBase, ...styles.googleButton, ...(googleHover ? styles.googleButtonHover : {}), ...(googleFocus ? styles.buttonFocusVisible : {}) };
    const audioControlFinalStyle = { ...styles.audioControl, ...(audioControlHover ? styles.audioControlHover : {}), ...(audioControlFocus ? styles.audioControlFocus : {}) }; // Use specific focus style
    const audioCreditFinalStyle = { ...styles.audioCredit, ...(isPlaying ? styles.audioCreditVisible : {}) };
    const audioCreditLinkFinalStyle = { ...styles.audioCreditLink, ...(anthemLinkHover ? styles.audioCreditLinkHover : {}) };
    const volumeSliderContainerFinalStyle = {...styles.volumeSliderContainer, ...(showVolumeSlider ? styles.volumeSliderContainerVisible : {})};

    return (
      <div style={styles.authContainer} onClick={handleInteraction}>
        {/* Background Video */}
        <video ref={videoRef} autoPlay loop muted playsInline style={styles.videoBackground} key="bg-video" onCanPlay={() => console.log("Video ready")} onError={(e) => console.error("Video Error Event:", e)}>
          <source src="/videos/gpd_background.mp4" type="video/mp4" /> {/* VERIFY PATH */}
          Your browser does not support the video tag.
        </video>
        <div style={styles.overlay}></div>

        {/* Login Card */}
        <div style={styles.card}>
          <Image src="/images/gpd_logo0.png" alt="GPD Logo" width={1080} height={1080} style={styles.logo} priority /> {/* VERIFY PATH */}
          <h1 style={styles.title}>Galactic Phantom Division</h1>
          <p style={styles.subtitle}>Authenticate using a secure account.</p>
          <div style={styles.buttonGroup}>
            <button onClick={() => { handleInteraction(); signIn('discord', { callbackUrl: '/' }); }} style={discordFinalStyle} onMouseEnter={() => setDiscordHover(true)} onMouseLeave={() => setDiscordHover(false)} onFocus={() => setDiscordFocus(true)} onBlur={() => setDiscordFocus(false)}>
              <FaDiscord style={styles.buttonIcon} /> Continue with Discord
            </button>
            <button onClick={() => { handleInteraction(); signIn('google', { callbackUrl: '/' }); }} style={googleFinalStyle} onMouseEnter={() => setGoogleHover(true)} onMouseLeave={() => setGoogleHover(false)} onFocus={() => setGoogleFocus(true)} onBlur={() => setGoogleFocus(false)}>
              <FaGoogle style={styles.buttonIcon} /> Continue with Google
            </button>
          </div>
        </div>

        {/* Footer Text */}
        <p style={styles.footerText}>Unauthorized access is monitored. System use implies consent.</p>

        {/* Audio Player */}
        <audio ref={audioRef} loop preload="auto">
          <source src="/audio/superearth_anthem.mp3" type="audio/mpeg" /> {/* VERIFY PATH & TYPE */}
          Your browser does not support the audio element.
        </audio>

        {/* Audio Controls */}
        <div style={styles.audioControlsContainer}>
            <div style={styles.audioButtonAndSliderContainer} onMouseEnter={() => setShowVolumeSlider(true)} onMouseLeave={() => setShowVolumeSlider(false)}>
                <div style={volumeSliderContainerFinalStyle}>
                   <input type="range" min="0" max="1" step="0.01" value={volume} onChange={handleVolumeChange} style={styles.volumeSlider} aria-label="Volume" />
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

  // Fallback
  return null;
}