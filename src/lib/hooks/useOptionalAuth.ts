// src/hooks/useOptionalAuth.ts
"use client";

import { useSession } from "next-auth/react";

/**
 * Client-side hook to get the user's session data if available.
 * Does NOT redirect unauthenticated users.
 */
export function useOptionalAuth() {
  const { data: session, status } = useSession();

  return {
    session,
    status, // 'authenticated' | 'unauthenticated' | 'loading'
    user: session?.user,
  };
}
