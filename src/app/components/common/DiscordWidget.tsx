'use client';
import React from 'react';

interface DiscordWidgetProps {
  serverId: string;
  theme?: 'dark' | 'light';
  width?: number | string;
  height?: number | string;
}

/**
 * Embeds the Discord server chat widget.
 * Requires the Discord server ID. Optionally customize theme, width, and height.
 */
export default function DiscordWidget({
  serverId,
  theme = 'dark',
  width = 350,
  height = 500,
}: DiscordWidgetProps) {
  if (!serverId) {
    return <p>Discord widget not configured.</p>;
  }

  return (
    <iframe
      src={`https://discord.com/widget?id=${serverId}&theme=${theme}`}
      width={width}
      height={height}
      frameBorder={0}
      sandbox="allow-popups allow-popups-to-escape-sandbox allow-same-origin allow-scripts"
      style={{ border: 'none' }}
    />
  );
}
