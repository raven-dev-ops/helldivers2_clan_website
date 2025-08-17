import React from 'react';
import { describe, it, expect } from 'vitest';
import { renderToString } from 'react-dom/server';
import DiscordWidget from './DiscordWidget';

describe('DiscordWidget', () => {
  it('renders iframe with provided server ID', () => {
    const html = renderToString(<DiscordWidget serverId="123" />);
    expect(html).toContain('https://discord.com/widget?id=123');
    expect(html).toContain('iframe');
  });

  it('uses default server ID when none is provided', () => {
    const html = renderToString(<DiscordWidget />);
    expect(html).toContain('https://discord.com/widget?id=1214787549655203862');
  });
});
