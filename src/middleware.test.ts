import { describe, it, expect, beforeEach } from 'vitest';
import middleware, { __rateLimitStore } from './middleware';
import { NextRequest } from 'next/server';

const createRequest = () => {
  const req = new NextRequest('http://localhost/api/test');
  (req as any).ip = '127.0.0.1';
  return req;
};

describe('rate limiting middleware', () => {
  beforeEach(() => {
    __rateLimitStore.clear();
  });

  it('throttles after exceeding limit', async () => {
    for (let i = 0; i < 10; i++) {
      const res = await middleware(createRequest());
      expect(res.status).toBe(200);
    }
    const res = await middleware(createRequest());
    expect(res.status).toBe(429);
  });
});
