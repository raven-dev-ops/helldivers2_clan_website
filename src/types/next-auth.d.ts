// src/types/next-auth.d.ts

import NextAuth, { DefaultSession } from "next-auth";
import { JWT as DefaultJWT } from "next-auth/jwt";

declare module "next-auth" {
  interface Session extends DefaultSession {
    user: (DefaultSession["user"] & {
      id: string;
    }) | null;
    // Optional: expose provider tokens you added in callbacks
    discordAccessToken?: string;
    discordScope?: string;
    discordUserId?: string;
    accessToken?: string; // back-compat alias if you used it elsewhere
  }

  // If you read `user.id` in `jwt` callback's `user` param and want it typed:
  interface User {
    id: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT extends DefaultJWT {
    id?: string;

    // Your Discord extras from jwt() callback
    discordAccessToken?: string;
    discordRefreshToken?: string;
    discordTokenType?: string;
    discordScope?: string;
    discordExpiresAt?: number;
    discordUserId?: string;
    discordError?: "refresh_failed" | "refresh_exception";
  }
}
