// src/lib/helldivers/fetch.ts
// Shared fetch wrapper that enables Next.js per-request caching with revalidation.
// Docs: https://nextjs.org/docs/app/building-your-application/caching#revalidating-data

export type FetchWithRevalidateOptions = RequestInit & {
  revalidateSeconds?: number;
  timeoutMs?: number;
};

/**
 * Fetches a resource with Next.js revalidation enabled (default 30s).
 * Returns the native Response so callers can parse as needed and inspect headers.
 */
export async function fetchWithRevalidate(
  url: string,
  init?: FetchWithRevalidateOptions
): Promise<Response> {
  const revalidateSeconds = init?.revalidateSeconds ?? 30;
  const timeoutMs = init?.timeoutMs ?? 10_000;

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const res = await fetch(url, {
      ...init,
      // Ensure JSON-friendly defaults while allowing overrides
      headers: {
        Accept: 'application/json',
        ...(init?.headers || {}),
      },
      // Enable Next.js revalidation on the resource
      next: { revalidate: revalidateSeconds, ...(init as any)?.next },
      signal: controller.signal,
    } as RequestInit);

    return res;
  } finally {
    clearTimeout(timer);
  }
}

/** Convenience helper that returns parsed JSON if content-type matches, else null. */
export async function fetchJsonWithRevalidate<T = any>(
  url: string,
  init?: FetchWithRevalidateOptions
): Promise<{ response: Response; data: T | null }> {
  const response = await fetchWithRevalidate(url, init);
  const contentType = response.headers.get('content-type') || '';
  if (!contentType.includes('application/json')) {
    return { response, data: null };
  }
  let data: T | null = null;
  try {
    data = (await response.json()) as T;
  } catch {
    data = null;
  }
  return { response, data };
}

export default fetchWithRevalidate;

