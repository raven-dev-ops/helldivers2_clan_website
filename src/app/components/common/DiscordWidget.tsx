'use client';
import React from 'react';

/**
 * Embeds the Galactic Phantom Division Discord server widget.
 * Preconfigured with your server ID.
 */
export default function DiscordWidget({
  theme = 'dark',
  width = 350,
  height = 500,
}: {
  theme?: 'dark' | 'light';
  width?: number | string;
  height?: number | string;
}) {
  return (
    <iframe
      src={`https://discord.com/widget?id=1214787549655203862&theme=${theme}`}
      width={width}
      height={height}
      frameBorder={0}
      sandbox="allow-popups allow-popups-to-escape-sandbox allow-same-origin allow-scripts"
      style={{ border: 'none', borderRadius: '8px' }}
    />
  );
}
