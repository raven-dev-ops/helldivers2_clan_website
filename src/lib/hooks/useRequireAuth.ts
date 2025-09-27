// src/hooks/useRequireAuth.ts
'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import type { Route } from 'next';

const toSameOriginPath = (raw: string): string => {
  if (raw.startsWith('/')) return raw;
  return '/';
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
          ? `${window.location.pathname}${window.location.search}${window.location.hash}`
          : '/';

      const params = new URLSearchParams({
        callbackUrl: toSameOriginPath(returnTo),
      });

      router.push((`/auth?${params.toString()}` as Route));
    }
  }, [status, router]);

  return { status };
}
