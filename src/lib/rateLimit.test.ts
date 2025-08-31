import { describe, it, expect } from 'vitest';
import { allow } from '@/lib/rateLimit';

describe('allow (memory fallback)', () => {
  it('limits after max requests in the window', async () => {
    const windowMs = 100;
    const max = 3;
    const ip = '127.0.0.1';
    const bucket = 'test';

    const results: boolean[] = [];
    for (let i = 0; i < 5; i++) {
      const { ok } = await allow({ ip, bucket, windowMs, max });
      results.push(ok);
    }
    expect(results).toEqual([true, true, true, false, false]);
  });
});
