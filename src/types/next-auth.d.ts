// src/types/next-auth.d.ts

import NextAuth, { DefaultSession, DefaultUser, Session as NextAuthSession } from "next-auth";
import { JWT, DefaultJWT } from "next-auth/jwt";

// --- Extend JWT Type ---
// Add custom properties to the token object returned by the `jwt` callback
declare module "next-auth/jwt" {
  interface JWT extends DefaultJWT {
    /** The user's database ID (_id as string) */
    id?: string;
    /** Example: The user's role */
    role?: string;
    // Add any other properties you persist on the token
  }
}

// --- Extend Session Type ---
// Add custom properties to the session object returned by `useSession`, `getSession`, etc.
declare module "next-auth" {
  interface Session {
    user: {
      /** The user's database ID (_id as string) */
      id: string; // Make ID non-optional on the final session user if always present
      /** Example: The user's role */
      role?: string;
    } & DefaultSession["user"]; // Merge with default fields (name, email, image)
  }

  // Optional: Extend the User type passed to the JWT callback from the adapter/provider
  // This helps if your adapter provides extra fields directly on the `user` object
  // during the jwt callback's initial sign-in execution.
  // interface User extends DefaultUser {
  //   role?: string; // Example: If your DB user model has 'role'
  // }
}