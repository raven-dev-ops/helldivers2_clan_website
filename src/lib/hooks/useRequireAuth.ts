// src/hooks/useRequireAuth.ts
'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

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

      const authHref = {
        pathname: '/auth' as const,
        query: { callbackUrl: returnTo },
      } satisfies Parameters<typeof router.push>[0];

      router.push(authHref);
    }
  }, [status, router]);

  return { status };
}
