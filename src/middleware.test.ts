import { describe, it, expect, beforeEach, vi } from 'vitest';
vi.mock('ioredis', async () => {
  const RedisMock = (await import('ioredis-mock')).default;
  return { default: RedisMock };
});
import middleware, { __rateLimitStore } from './middleware';
import { NextRequest } from 'next/server';

const createRequest = (path: string) =>
  new NextRequest(`http://localhost${path}`, {
    headers: { 'x-forwarded-for': '127.0.0.1' },
  });

describe('rate limiting middleware', () => {
  beforeEach(async () => {
    await __rateLimitStore.flushall();
  });

  it('throttles after exceeding limit', async () => {
    for (let i = 0; i < 10; i++) {
      const res = await middleware(createRequest('/api/test'));
      expect(res.status).toBe(200);
    }
    const res = await middleware(createRequest('/api/test'));
    expect(res.status).toBe(429);
  });

  it('tracks limits per endpoint and scope', async () => {
    for (let i = 0; i < 10; i++) {
      expect((await middleware(createRequest('/api/first'))).status).toBe(200);
      expect((await middleware(createRequest('/api/second'))).status).toBe(200);
    }
    expect((await middleware(createRequest('/api/first'))).status).toBe(429);
    expect((await middleware(createRequest('/api/second'))).status).toBe(429);
    // Different scopes should not share buckets
    await __rateLimitStore.flushall();
    for (let i = 0; i < 10; i++) {
      expect(
        (await middleware(createRequest('/api/first?scope=one'))).status
      ).toBe(200);
      expect(
        (await middleware(createRequest('/api/first?scope=two'))).status
      ).toBe(200);
    }
    expect((await middleware(createRequest('/api/first?scope=one'))).status).toBe(
      429
    );
    expect((await middleware(createRequest('/api/first?scope=two'))).status).toBe(
      429
    );
  });

  it('skips /api/auth routes', async () => {
    for (let i = 0; i < 20; i++) {
      const res = await middleware(createRequest('/api/auth/session'));
      expect(res.status).toBe(200);
    }
    expect(await __rateLimitStore.dbsize()).toBe(0);
  });
});
