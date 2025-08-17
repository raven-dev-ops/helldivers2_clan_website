import { describe, it, expect, vi, beforeEach } from 'vitest';
import mongoose from 'mongoose';

vi.mock('next-auth/next', () => ({ getServerSession: vi.fn() }));
vi.mock('@/lib/authOptions', () => ({ getAuthOptions: vi.fn(() => ({})) }));
vi.mock('@/lib/dbConnect', () => ({ default: vi.fn() }));
vi.mock('@/lib/logger', () => ({ logger: { error: vi.fn(), info: vi.fn(), warn: vi.fn() } }));
vi.mock('@/models/BotApplication', () => {
  return {
    default: class {
      static findOne = vi.fn();
      save = vi.fn();
      constructor(public data: any) {}
    },
  };
});

import { POST } from './route';
import BotApplicationModel from '@/models/BotApplication';
import { getServerSession } from 'next-auth/next';
const getServerSessionMock = getServerSession as unknown as ReturnType<typeof vi.fn>;

describe('POST /api/applications', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('returns 201 on successful application', async () => {
    getServerSessionMock.mockResolvedValue({ user: { id: new mongoose.Types.ObjectId().toString() } });
    (BotApplicationModel.findOne as any).mockResolvedValue(null);
    const request = new Request('http://localhost', {
      method: 'POST',
      body: JSON.stringify({ botIdentifier: 'bot123' }),
    });
    const response = await POST(request);
    expect(response.status).toBe(201);
    const body = await response.json();
    expect(body.message).toBe('Application submitted successfully!');
  });

  it('returns 401 when user is unauthorized', async () => {
    getServerSessionMock.mockResolvedValue(null);
    const request = new Request('http://localhost', {
      method: 'POST',
      body: JSON.stringify({ botIdentifier: 'bot123' }),
    });
    const response = await POST(request);
    expect(response.status).toBe(401);
  });
});
