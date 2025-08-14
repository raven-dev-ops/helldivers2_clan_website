import React from 'react';
import { describe, it, expect } from 'vitest';
import { renderToString } from 'react-dom/server';
import MaintenanceBanner from './MaintenanceBanner';

describe('MaintenanceBanner', () => {
  it('does not render when maintenance mode is not enabled', () => {
    process.env.NEXT_PUBLIC_MAINTENANCE_MODE = 'false';
    const html = renderToString(<MaintenanceBanner />);
    expect(html).toBe('');
  });

  it('renders a message when maintenance mode is enabled', () => {
    process.env.NEXT_PUBLIC_MAINTENANCE_MODE = 'true';
    const html = renderToString(<MaintenanceBanner />);
    expect(html).toContain('maintenance');
  });
});
