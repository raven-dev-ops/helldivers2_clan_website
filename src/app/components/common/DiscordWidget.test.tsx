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

  it('renders placeholder when no server ID is given', () => {
    const html = renderToString(<DiscordWidget serverId="" />);
    expect(html).toContain('Discord widget not configured');
  });
});
