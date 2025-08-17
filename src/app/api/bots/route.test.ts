import { describe, it, expect } from 'vitest';
import { POST } from './route';

describe('POST /api/bots', () => {
  it('creates a bot when payload is valid', async () => {
    const req = new Request('http://localhost', {
      method: 'POST',
      body: JSON.stringify({ name: 'Test Bot' }),
    });
    const res = await POST(req as any);
    expect(res.status).toBe(201);
  });

  it('returns 400 for invalid payload', async () => {
    const req = new Request('http://localhost', {
      method: 'POST',
      body: JSON.stringify({}),
    });
    const res = await POST(req as any);
    expect(res.status).toBe(400);
  });
});
