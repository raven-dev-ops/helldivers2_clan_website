// src/components/partners/PartnerIcon.tsx (or similar path)
'use client'; // Mark as Client Component

import React, { useState } from 'react';
import Image from 'next/image';
import { FaDiscord } from 'react-icons/fa';
import { logger } from '@/lib/logger';

interface PartnerIconProps {
  src: string | null;
  alt: string;
  iconStyle: React.CSSProperties; // Pass styles from parent
  placeholderStyle: React.CSSProperties; // Pass styles from parent
}

export default function PartnerIcon({
  src,
  alt,
  iconStyle,
  placeholderStyle,
}: PartnerIconProps) {
  const [imgError, setImgError] = useState(false);

  // If src is null/empty or an error occurred, show placeholder
  if (!src || imgError) {
    return (
      <div style={placeholderStyle}>
        <FaDiscord aria-hidden="true" />
      </div>
    );
  }

  return (
    <Image
      src={src}
      alt={alt}
      width={64} // Keep fixed dimensions for layout consistency
      height={64}
      style={iconStyle}
      onError={() => {
        logger.warn(`Failed to load image: ${src}`);
        setImgError(true); // Set error state to trigger placeholder render
      }}
      priority={false} // Usually logos aren't highest priority
    />
  );
}
