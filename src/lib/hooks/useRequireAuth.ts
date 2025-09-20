// src/hooks/useRequireAuth.ts
'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import type { Route } from 'next';

const toSameOriginPath = (raw: string): string => {
  if (!raw.startsWith('/')) {
    return '/';
  }

  const [pathWithoutQuery] = raw.split('?');
  const [cleanPath] = pathWithoutQuery.split('#');

  return cleanPath || '/';
};

/**
 * Client-side hook to require authentication.
 * If the user is not authenticated, they will be redirected to the sign-in page.
 */
export function useRequireAuth() {
  const { status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === 'unauthenticated') {
      const returnTo =
        typeof window !== 'undefined'
          ? `${window.location.pathname}${window.location.search}`
          : '/';

      router.push({
        pathname: '/auth' as Route,
        query: { callbackUrl: toSameOriginPath(returnTo) },
      });
    }
  }, [status, router]);

  return { status };
}
