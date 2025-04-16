"use client";

import { useSession, signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

/**
 * Example: Hook for protected routes
 * This will redirect the user to /api/auth/signin if they're unauthenticated.
 * Or you can show a loading state until the session is determined.
 */
export default function useRequireAuth(redirectTo = "/api/auth/signin") {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "unauthenticated") {
      // Option 1: Use next/navigation redirect
      router.push(redirectTo);

      // Option 2: Use next-auth's signIn with a callback
      // signIn(undefined, { callbackUrl: redirectTo });
    }
  }, [router, status, redirectTo]);

  return { session, status };
}
