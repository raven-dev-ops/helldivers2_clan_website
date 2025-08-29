import { describe, it, expect, vi, afterEach } from 'vitest';
import { fetchDiscordRoles } from './discordRoles';

describe('fetchDiscordRoles', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('returns mapped roles and membership when successful', async () => {
    const fetchMock = vi
      .fn()
      .mockResolvedValueOnce({
        status: 200,
        ok: true,
        json: async () => ({ roles: ['1', '2'] }),
      })
      .mockResolvedValueOnce({
        status: 200,
        ok: true,
        json: async () => [
          { id: '1', name: 'Alpha' },
          { id: '2', name: '@everyone' },
        ],
      });
    vi.stubGlobal('fetch', fetchMock);

    const result = await fetchDiscordRoles('user', 'token', 'guild');
    expect(result).toEqual({ roles: [{ id: '1', name: 'Alpha' }], isMember: true });
    expect(fetchMock).toHaveBeenCalledTimes(2);
  });

  it('returns not a member when member lookup returns 404', async () => {
    const fetchMock = vi.fn().mockResolvedValue({ status: 404, ok: false });
    vi.stubGlobal('fetch', fetchMock);

    const result = await fetchDiscordRoles('user', 'token', 'guild');
    expect(result).toEqual({ roles: [], isMember: false });
    expect(fetchMock).toHaveBeenCalledTimes(1);
  });

  it('throws on other Discord API errors', async () => {
    const fetchMock = vi
      .fn()
      .mockResolvedValue({
        status: 500,
        ok: false,
        text: async () => 'discord down',
      });
    vi.stubGlobal('fetch', fetchMock);

    await expect(
      fetchDiscordRoles('user', 'token', 'guild')
    ).rejects.toThrow('discord down');
  });
});
