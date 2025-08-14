// src/types/next-auth.d.ts
import { DefaultSession, DefaultUser, Session } from "next-auth";
import { DefaultJWT, JWT } from "next-auth/jwt";

/**
 * Module augmentation for `next-auth/jwt`
 * Adds custom properties to the JWT token.
 */
declare module "next-auth/jwt" {
  interface JWT extends DefaultJWT {
    /** The user's database ID (_id as string). Non-optional after successful sign-in. */
    id: string;
    /** The provider used for the current session */
    provider?: string;
    /** Example: The user's role */
    // role?: string;
  }
}


/**
 * Module augmentation for `next-auth`
 * Adds custom properties to the Session object and the User object used in callbacks.
 */
declare module "next-auth" {
  /**
   * Extends the built-in session.user type
   * Returned by `useSession`, `getSession`, etc.
   */
  interface Session {
    user: {
      /** The user's database ID (_id as string). */
      id: string;
      /** Example: The user's role */
      // role?: string;
    } & DefaultSession["user"]; // Merge with default fields (name, email, image)
  }

  /**
   * Extends the built-in User type
   * Represents the user object passed to callbacks like `signIn`, `jwt` (on initial sign-in).
   * We add the 'id' property in the `signIn` callback.
   */
  interface User extends DefaultUser {
     /** The user's database ID (_id as string), added during signIn. */
     id: string;
     /** Example: User's role */
     // role?: string;
  }
}
