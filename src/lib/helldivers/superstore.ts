// src/lib/helldivers/superstore.ts
import { fetchJsonWithRevalidate } from '@/lib/helldivers/fetch';

export type SuperstoreItem = Record<string, any>;

export type SuperstoreSet = {
  id: string;
  title: string;
  items: SuperstoreItem[];
};

export type SuperstorePayload = {
  rotationEndsAt?: string; // ISO
  rotatingSets: SuperstoreSet[]; // up to 6
  permanentCatalog: SuperstoreItem[];
};

const MAX_SETS = 6;

function toISO(dateLike: any): string | undefined {
  const d = new Date(dateLike ?? Date.now());
  return isNaN(d.getTime()) ? undefined : d.toISOString();
}

function asString(v: unknown) {
  return typeof v === 'string' && v.trim() ? v.trim() : undefined;
}

/** Normalizes a variety of upstream shapes into our canonical payload. */
function normalize(json: any): SuperstorePayload {
  if (!json || typeof json !== 'object') {
    return { rotatingSets: [], permanentCatalog: [] };
  }

  // Try to discover rotation end
  const rotationEndsAt =
    toISO(json.rotationEndsAt || json.endsAt || json.rotation?.endsAt || json.nextRotation || json.expiresAt) ||
    toISO(Date.now() + 48 * 60 * 60 * 1000);

  // Find rotating sets (various aliases)
  let sets: any[] = [];
  if (Array.isArray(json.rotatingSets)) sets = json.rotatingSets;
  else if (Array.isArray(json.sets)) sets = json.sets;
  else if (Array.isArray(json.rotation?.sets)) sets = json.rotation.sets;
  else if (Array.isArray(json.rotation)) sets = json.rotation;

  const rotatingSets: SuperstoreSet[] = sets.slice(0, MAX_SETS).map((s: any, i: number) => {
    const title = asString(s.title || s.name || s.header || `Set ${i + 1}`) || `Set ${i + 1}`;
    const id = asString(s.id || s.slug || `${title}-${i}`) || `${title}-${i}`;
    const items: SuperstoreItem[] = Array.isArray(s.items)
      ? s.items
      : Array.isArray(s.contents)
      ? s.contents
      : Array.isArray(s.products)
      ? s.products
      : [];
    return { id: String(id), title, items };
  });

  const permanentCatalogSrc =
    (Array.isArray(json.permanentCatalog) && json.permanentCatalog) ||
    (Array.isArray(json.catalog) && json.catalog) ||
    (Array.isArray(json.allItems) && json.allItems) ||
    [];

  return {
    rotationEndsAt,
    rotatingSets,
    permanentCatalog: permanentCatalogSrc,
  };
}

/**
 * Fetches the Superstore page (JSON preferred) and returns a normalized payload.
 * Set SUPERSTORE_UPSTREAM to a JSON endpoint or proxy for the rotating page.
 */
export async function fetchSuperstore(): Promise<{
  ok: boolean;
  data: SuperstorePayload;
  status: number;
  statusText: string;
}> {
  const upstream = process.env.SUPERSTORE_UPSTREAM;
  if (!upstream) {
    return {
      ok: false,
      status: 503,
      statusText: 'NoUpstreamConfigured',
      data: { rotatingSets: [], permanentCatalog: [] },
    } as const;
  }

  try {
    const { response, data } = await fetchJsonWithRevalidate<any>(upstream, {
      revalidateSeconds: 30,
      headers: { 'User-Agent': 'GPT-Fleet-CommunitySite/1.0' },
    });
    if (!response.ok || !data) {
      return {
        ok: false,
        status: response.status,
        statusText: response.statusText,
        data: { rotatingSets: [], permanentCatalog: [] },
      } as const;
    }
    return {
      ok: true,
      status: 200,
      statusText: 'OK',
      data: normalize(data),
    } as const;
  } catch (e: any) {
    return {
      ok: false,
      status: 599,
      statusText: e?.name || 'FetchError',
      data: { rotatingSets: [], permanentCatalog: [] },
    } as const;
  }
}

