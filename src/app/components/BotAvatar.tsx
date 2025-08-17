// src/components/BotAvatar.tsx
'use client'; // Mark this as a Client Component

import React from 'react';
import Image from 'next/image';

interface BotAvatarProps {
  src: string;
  alt: string;
  width: number;
  height: number;
  className?: string; // Allow passing external class names
  fallbackSrc?: string;
}

export default function BotAvatar({
  src,
  alt,
  width,
  height,
  className = '', // Default to empty string
  fallbackSrc = '/images/placeholder.png', // Default fallback in /public
}: BotAvatarProps) {
  const handleError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    const target = e.target as HTMLImageElement;
    target.onerror = null; // Prevent infinite loops
    target.src = fallbackSrc;
    // Add a class to indicate error state if needed for styling
    target.classList.add('avatar-error-state');
    // You could also directly apply styles:
    // target.style.backgroundColor = '#374151'; // Example bg-gray-700
  };

  return (
    <Image
      src={src}
      alt={alt}
      width={width}
      height={height}
      // Combine passed className with base styles
      className={`${className} bg-gray-600`} // Base background for loading
      onError={handleError}
      unoptimized={src.includes('discordapp.com')} // Disable optimization for Discord CDN
    />
  );
}
