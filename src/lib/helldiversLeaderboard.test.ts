import { describe, it, expect, vi } from 'vitest';

vi.mock('@/lib/mongoClientPromise', () => ({
  default: vi.fn(),
}));

import { getMonthRange } from './helldiversLeaderboard';

describe('getMonthRange', () => {
  it('returns correct start and end for January 2024', () => {
    const { start, end } = getMonthRange(0, 2024);
    expect(start.toISOString()).toBe('2024-01-01T00:00:00.000Z');
    expect(end.toISOString()).toBe('2024-02-01T00:00:00.000Z');
  });

  it('handles leap year February correctly', () => {
    const { start, end } = getMonthRange(1, 2024);
    expect(start.toISOString()).toBe('2024-02-01T00:00:00.000Z');
    expect(end.toISOString()).toBe('2024-03-01T00:00:00.000Z');
  });
});
