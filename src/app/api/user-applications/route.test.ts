import { describe, it, expect, vi, beforeEach } from 'vitest';
import mongoose from 'mongoose';

vi.mock('next-auth/next', () => ({ getServerSession: vi.fn() }));
vi.mock('@/lib/authOptions', () => ({ getAuthOptions: vi.fn(() => ({})) }));
vi.mock('@/lib/dbConnect', () => ({ default: vi.fn() }));
vi.mock('@/lib/logger', () => ({
  logger: { error: vi.fn(), info: vi.fn(), warn: vi.fn() },
}));
vi.mock('@/models/UserApplication', () => {
  return {
    default: class {
      save = vi.fn();
      constructor(public data: any) {}
    },
  };
});

import { POST } from './route';
import { getServerSession } from 'next-auth/next';
const getServerSessionMock = getServerSession as unknown as ReturnType<
  typeof vi.fn
>;

describe('POST /api/user-applications', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('returns 201 on successful submission', async () => {
    getServerSessionMock.mockResolvedValue({
      user: { id: new mongoose.Types.ObjectId().toString() },
    });
    const request = new Request('http://localhost', {
      method: 'POST',
      body: JSON.stringify({ type: 'mod', interest: 'help' }),
    });
    const response = await POST(request);
    expect(response.status).toBe(201);
  });

  it('returns 400 on validation error', async () => {
    getServerSessionMock.mockResolvedValue({
      user: { id: new mongoose.Types.ObjectId().toString() },
    });
    const request = new Request('http://localhost', {
      method: 'POST',
      body: JSON.stringify({}),
    });
    const response = await POST(request);
    expect(response.status).toBe(400);
  });

  it('returns 401 when unauthorized', async () => {
    getServerSessionMock.mockResolvedValue(null);
    const request = new Request('http://localhost', {
      method: 'POST',
      body: JSON.stringify({ type: 'mod', interest: 'help' }),
    });
    const response = await POST(request);
    expect(response.status).toBe(401);
  });
});
