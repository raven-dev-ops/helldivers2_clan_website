// src/app/components/common/MusicButton.tsx
'use client';

import { useEffect, useRef, useState } from 'react';
import { FaMusic, FaPause } from 'react-icons/fa';
import { logger } from '@/lib/logger';

export default function MusicButton() {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.1);

  useEffect(() => {
    const audio = new Audio('/audio/superearth_anthem.mp3');
    audio.preload = 'none';
    audio.loop = false;
    audio.volume = volume;
    audioRef.current = audio;
    audio
      .play()
      .then(() => setIsPlaying(true))
      .catch((e) => logger.warn('Audio play failed:', e));
    const handleEnded = () => setIsPlaying(false);
    audio.addEventListener('ended', handleEnded);
    return () => {
      audio.removeEventListener('ended', handleEnded);
      audio.pause();
      audioRef.current = null;
    };
  }, [volume]);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
    }
  }, [volume]);

  const togglePlay = async () => {
    if (!audioRef.current) return;
    try {
      if (isPlaying) {
        audioRef.current.pause();
        setIsPlaying(false);
      } else {
        await audioRef.current.play();
        setIsPlaying(true);
      }
    } catch (e) {
      logger.warn('Audio play failed:', e);
    }
  };

  const buttonStyle: React.CSSProperties = {
    position: 'fixed',
    left: '16px',
    bottom: '16px',
    zIndex: 60,
    backgroundColor: 'rgba(30,41,59,0.85)',
    color: '#facc15',
    border: '1px solid #334155',
    borderRadius: 9999,
    padding: '10px 14px',
    display: 'flex',
    alignItems: 'center',
    gap: 8,
    boxShadow: '0 4px 12px rgba(0,0,0,0.25)',
  };

  const sliderStyle: React.CSSProperties = { marginLeft: 8, width: 90 };

  const containerStyle: React.CSSProperties = {
    position: 'fixed',
    left: '16px',
    bottom: '16px',
    zIndex: 60,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    color: '#facc15',
  };

  return (
    <div style={containerStyle}>
      {isPlaying && (
        <div style={{ fontSize: 12, marginBottom: 4, textAlign: 'center' }}>
          Super Earth Anthem – Helldivers 2 OST
        </div>
      )}
      <div style={buttonStyle}>
        <button
          onClick={togglePlay}
          aria-label={isPlaying ? 'Pause music' : 'Play music'}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 8,
            color: 'inherit',
          }}
        >
          {isPlaying ? <FaPause /> : <FaMusic />}
          <span style={{ fontWeight: 700 }}>
            {isPlaying ? 'Pause' : 'Play'}
          </span>
        </button>
        <input
          type="range"
          min={0}
          max={1}
          step={0.05}
          value={volume}
          onChange={(e) => setVolume(parseFloat(e.target.value))}
          aria-label="Music volume"
          style={sliderStyle}
        />
      </div>
    </div>
  );
}
