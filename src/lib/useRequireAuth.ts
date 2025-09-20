'use client';

import { useSession, signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import type { Route } from 'next';

/**
 * Example: Hook for protected routes.
 * Redirect unauthenticated users to the in-app auth page instead of the raw
 * NextAuth API endpoint so navigation stays within the typed-route system.
 */
const DEFAULT_REDIRECT: Route = '/auth';

export default function useRequireAuth(redirectTo: Route = DEFAULT_REDIRECT) {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push(redirectTo);

      // Option 2: Use next-auth's signIn with a callback
      // signIn(undefined, { callbackUrl: redirectTo });
    }
  }, [router, status, redirectTo]);

  return { session, status };
}
