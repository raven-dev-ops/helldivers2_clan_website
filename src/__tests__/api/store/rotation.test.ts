import { describe, it, expect, vi, beforeEach } from 'vitest';

vi.mock('@/lib/helldivers/superstore', async (orig) => {
  const actual = await (orig as any)();
  return {
    ...actual,
    fetchSuperstore: vi.fn(),
  };
});

import { fetchSuperstore } from '@/lib/helldivers/superstore';
import { GET } from '@/app/api/store/rotation/route';

describe('/api/store/rotation', () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  it('returns normalized shape with at most 6 rotating sets and SWR headers', async () => {
    const sets = Array.from({ length: 8 }).map((_, i) => ({
      id: `set-${i + 1}`,
      title: `Set ${i + 1}`,
      items: [{ sku: `item-${i + 1}-a` }, { sku: `item-${i + 1}-b` }],
    }));

    (fetchSuperstore as any).mockResolvedValue({
      ok: true,
      status: 200,
      statusText: 'OK',
      data: {
        rotationEndsAt: new Date(Date.now() + 1000 * 60 * 60).toISOString(),
        rotatingSets: sets,
        permanentCatalog: [{ sku: 'perm-1' }],
      },
    });

    const res = await GET();
    expect(res.status).toBe(200);

    const cc = res.headers.get('cache-control') || '';
    expect(cc.toLowerCase()).toContain('stale-while-revalidate');

    const json = (await res.json()) as any;
    expect(json).toHaveProperty('rotationEndsAt');
    expect(typeof json.rotationEndsAt).toBe('string');
    expect(Array.isArray(json.rotatingSets)).toBe(true);
    expect(json.rotatingSets.length).toBeLessThanOrEqual(6);
    expect(Array.isArray(json.permanentCatalog)).toBe(true);
    expect(json.permanentCatalog.length).toBeGreaterThan(0);
  });

  it('guards with empty arrays and short cache when upstream empty', async () => {
    (fetchSuperstore as any).mockResolvedValue({
      ok: false,
      status: 502,
      statusText: 'Bad Gateway',
      data: { rotatingSets: [], permanentCatalog: [] },
    });

    const res = await GET();
    expect(res.status).toBe(200);
    const cc = res.headers.get('cache-control') || '';
    expect(cc).toContain('max-age=60');
    expect(cc.toLowerCase()).toContain('stale-while-revalidate=300');
    const body = await res.json();
    expect(body.rotatingSets).toEqual([]);
    expect(body.permanentCatalog).toEqual([]);
  });
});

