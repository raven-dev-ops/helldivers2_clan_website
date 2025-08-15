'use client';
import React from 'react';

type Props = {
  /** Optional override; defaults to GPD server */
  serverId?: string;
  theme?: 'dark' | 'light';
  width?: number | string;
  height?: number | string;
};

export default function DiscordWidget({
  serverId,
  theme = 'dark',
  width = 350,
  height = 500,
}: Props) {
  const id = serverId ?? '1214787549655203862';

  return (
    <iframe
      src={`https://discord.com/widget?id=${id}&theme=${theme}`}
      width={width}
      height={height}
      frameBorder={0}
      sandbox="allow-popups allow-popups-to-escape-sandbox allow-same-origin allow-scripts"
      style={{ border: 'none', borderRadius: 8 }}
    />
  );
}
