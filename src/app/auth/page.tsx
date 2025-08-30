// src/app/auth/page.tsx
'use client';

import { signIn, useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState, useRef } from 'react';
import { FaDiscord, FaPlay, FaPause } from 'react-icons/fa';
import Image from 'next/image';
import Link from 'next/link';
import styles from './Auth.module.css';
import { logger } from '@/lib/logger';
import useCachedVideo from '@/hooks/useCachedVideo';

const ANTHEM_YOUTUBE_URL = 'https://youtu.be/Q9pkh4Z39nE?si=2v5e1EEBKdoVC6YW';

export default function AuthPage() {
  // --- State and Refs ---
  const { status } = useSession();
  const router = useRouter();
  const audioRef = useRef<HTMLAudioElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [userInteracted, setUserInteracted] = useState(false);
  const [volume, setVolume] = useState(0.15);
  const [showVolumeSlider, setShowVolumeSlider] = useState(false);
  const videoSrc = useCachedVideo('/videos/gpd_background.mp4');

  // --- Functions ---
  const handleInteraction = () => {
    if (!userInteracted) {
      logger.info('User interaction detected.');
      setUserInteracted(true);
      if (audioRef.current) audioRef.current.volume = volume;
      if (videoRef.current && videoRef.current.paused) {
        videoRef.current
          .play()
          .catch((e) => logger.error('Video play error after interaction:', e));
      }
    }
  };

  const handlePlayToggle = () => {
    if (!userInteracted) handleInteraction();
    const audioElement = audioRef.current;
    if (!audioElement) return;

    if (isPlaying) {
      audioElement.pause();
      setIsPlaying(false);
    } else {
      if (audioElement.readyState >= 2) {
        const playPromise = audioElement.play();
        if (playPromise !== undefined) {
          playPromise
            .then(() => setIsPlaying(true))
            .catch((error) => {
              setIsPlaying(false);
              logger.error('Audio play failed:', error);
              alert(
                userInteracted
                  ? 'Could not play audio.'
                  : 'Click page to enable audio.'
              );
            });
        } else {
          setIsPlaying(true);
        }
      } else {
        logger.warn('Audio not ready.');
        alert('Audio loading, try again.');
      }
    }
  };

  const handleVolumeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setVolume(parseFloat(event.target.value));
  };

  // --- Effects ---
  useEffect(() => {
    // Auth Redirect
    if (status === 'authenticated') router.replace('/');
  }, [status, router]);

  useEffect(() => {
    // Video Play Attempt
    const videoElement = videoRef.current;
    if (videoElement) {
      videoElement.muted = true;
      videoElement.playsInline = true;
      if (videoElement.paused)
        videoElement
          .play()
          .catch((e) => logger.warn('Video autoplay potentially blocked.', e));
    }
  }, []);

  useEffect(() => {
    // Sync Volume State
    if (audioRef.current) audioRef.current.volume = volume;
  }, [volume]);

  // --- Render Logic ---
  if (status === 'loading') {
    return (
      <div className={styles.loadingOverlay}>
        <p className={styles.loadingText}>Loading Session...</p>
      </div>
    );
  }

  if (status === 'unauthenticated') {
    const volumeSliderClasses = `${styles.volumeSliderContainer} ${
      showVolumeSlider ? styles.volumeSliderContainerVisible : ''
    }`;
    const audioCreditClasses = `${styles.audioCredit} ${
      isPlaying ? styles.audioCreditVisible : ''
    }`;

    return (
      <div className={styles.authContainer} onClick={handleInteraction}>
        {/* Background Video */}
        <video
          ref={videoRef}
          src={videoSrc}
          autoPlay
          loop
          muted
          playsInline
          preload="auto"
          className={styles.videoBackground}
          key="bg-video"
          onCanPlay={() => logger.info('Video ready')}
          onError={(e) => logger.error('Video Error Event:', e)}
        >
          Your browser does not support the video tag.
        </video>
        <div className={styles.overlay}></div>

        {/* Login Card */}
        <div className={styles.card}>
          <Image
            src="/images/gpd_logo0.png"
            alt="GPD Logo"
            width={1080}
            height={1080}
            className={styles.logo}
            priority
          />
          <h1 className={styles.title}>GPT GAMING</h1>
          <p className={styles.subtitle}>Authenticate using Discord.</p>
          <div className={styles.buttonGroup}>
            <button
              onClick={() => {
                handleInteraction();
                signIn('discord', { callbackUrl: '/' });
              }}
              className={styles.discordButton}
            >
              <FaDiscord className={styles.buttonIcon} /> Continue with Discord
            </button>
          </div>
        </div>

        {/* Footer Text */}
        <p className={styles.footerText}>
          Unauthorized access is monitored. System use implies consent.
        </p>

        {/* Audio Player */}
        <audio ref={audioRef} loop preload="auto">
          <source src="/audio/superearth_anthem.mp3" type="audio/mpeg" />
          Your browser does not support the audio element.
        </audio>

        {/* Audio Controls */}
        <div className={styles.audioControlsContainer}>
          <div
            className={styles.audioButtonAndSliderContainer}
            onMouseEnter={() => setShowVolumeSlider(true)}
            onMouseLeave={() => setShowVolumeSlider(false)}
          >
            <div className={volumeSliderClasses}>
              <input
                type="range"
                min="0"
                max="1"
                step="0.01"
                value={volume}
                onChange={handleVolumeChange}
                className={styles.volumeSlider}
                aria-label="Volume"
              />
            </div>
            <button
              className={styles.audioControl}
              onClick={handlePlayToggle}
              aria-label={isPlaying ? 'Pause music' : 'Play music'}
              title={isPlaying ? 'Pause music' : 'Play music'}
            >
              {isPlaying ? (
                <FaPause className="w-5 h-5" />
              ) : (
                <FaPlay className="w-5 h-5" />
              )}
            </button>
          </div>
          <div className={audioCreditClasses}>
            <strong>Super Earth National Anthem</strong>
            <br /> Ross Tregenza
            <br /> <small>Helldivers 2 (OST)</small>
            <br />
            <Link
              href={ANTHEM_YOUTUBE_URL}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.audioCreditLink}
              title="Listen on YouTube"
            >
              (Listen)
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Fallback
  return null;
}
