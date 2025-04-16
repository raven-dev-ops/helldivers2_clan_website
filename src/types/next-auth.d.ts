// src/types/next-auth.d.ts  (or src/next-auth.d.ts)

import NextAuth, { DefaultSession, DefaultUser } from "next-auth";
import { JWT, DefaultJWT } from "next-auth/jwt";

// Extend the built-in session/user types to include your custom properties
// Make sure these properties match what you added in the callbacks!

declare module "next-auth/jwt" {
  /** Returned by the `jwt` callback and `getToken`, when using JWT sessions */
  interface JWT extends DefaultJWT {
    /** User ID */
    id?: string;
    /** User Role */
    role?: string; // Add your role property
  }
}

declare module "next-auth" {
  /**
   * Returned by `useSession`, `getSession` and received as a prop on the `SessionProvider` React Context
   */
  interface Session {
    user: {
      /** The user's id. */
      id?: string;
      /** The user's role. */
      role?: string; // Add your role property
    } & DefaultSession["user"]; // Keep the default properties like name, email, image
  }

  /**
   * The shape of the user object returned in the OAuth providers' `profile` callback,
   * or the second parameter of the `session` callback, when using a database.
   * Also Defines the shape of the user object passed to the `jwt` callback's `user` parameter on initial sign-in.
   */
  // interface User extends DefaultUser {
  //   // You can add properties here if they come directly from the provider profile
  //   // or if you augment the User object when using a database adapter.
  //   role?: string;
  // }
}