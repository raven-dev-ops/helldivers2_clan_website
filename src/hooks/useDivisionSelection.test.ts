/* @vitest-environment jsdom */
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useDivisionSelection } from './useDivisionSelection';

const mockPush = vi.fn();
const mockSignIn = vi.fn();
const mockUseSession = vi.fn();

vi.mock('next/navigation', () => ({
  useRouter: () => ({ push: mockPush }),
}));
vi.mock('next-auth/react', () => ({
  useSession: () => mockUseSession(),
  signIn: (...args: any[]) => mockSignIn(...args),
}));
vi.mock('@/lib/logger', () => ({
  logger: { info: vi.fn(), warn: vi.fn(), error: vi.fn() },
}));

beforeEach(() => {
  mockPush.mockReset();
  mockSignIn.mockReset();
  mockUseSession.mockReset();
  global.fetch = vi.fn();
  global.alert = vi.fn();
});

describe('useDivisionSelection', () => {
  it('navigates when user is authenticated and API succeeds', async () => {
    mockUseSession.mockReturnValue({
      data: { user: { id: '1' } },
      status: 'authenticated',
    });
    (global.fetch as any).mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({}),
    });

    const { result } = renderHook(() => useDivisionSelection());

    await act(async () => {
      await result.current.selectDivision('/helldivers-2');
    });

    expect(mockPush).toHaveBeenCalledWith('/helldivers-2');
    expect(mockSignIn).not.toHaveBeenCalled();
  });

  it('calls signIn when user is unauthenticated', async () => {
    mockUseSession.mockReturnValue({ data: null, status: 'unauthenticated' });
    const { result } = renderHook(() => useDivisionSelection());

    await act(async () => {
      await result.current.selectDivision('/helldivers-2');
    });

    expect(mockSignIn).toHaveBeenCalled();
    expect(mockPush).not.toHaveBeenCalled();
  });
});
