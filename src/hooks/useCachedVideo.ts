import { useEffect, useState } from 'react';

/**
 * Fetches a video and stores it in the Cache Storage API for faster
 * subsequent loads. Returns a blob URL for the cached video which can be
 * supplied to a <video> element. Falls back to the original source if the
 * Cache API is unavailable or an error occurs.
 */
export default function useCachedVideo(src: string): string {
  const [cachedSrc, setCachedSrc] = useState(src);

  useEffect(() => {
    let objectUrl: string | null = null;

    async function cacheVideo() {
      if (typeof window === 'undefined' || !('caches' in window)) {
        return;
      }
      try {
        const cache = await caches.open('media-cache');
        let response = await cache.match(src);
        if (!response) {
          await cache.add(src);
          response = await cache.match(src);
        }
        if (response) {
          const blob = await response.blob();
          objectUrl = URL.createObjectURL(blob);
          setCachedSrc(objectUrl);
        }
      } catch (err) {
        console.error('useCachedVideo failed', err);
      }
    }

    cacheVideo();

    return () => {
      if (objectUrl) {
        URL.revokeObjectURL(objectUrl);
      }
    };
  }, [src]);

  return cachedSrc;
}
