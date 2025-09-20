// src/lib/authOptions.ts
import type { NextAuthOptions } from 'next-auth';
import DiscordProvider from 'next-auth/providers/discord';
import GoogleProvider from 'next-auth/providers/google';
import { MongoDBAdapter } from '@next-auth/mongodb-adapter';
import getMongoClientPromise from '@/lib/mongodb';

async function refreshDiscordAccessToken(token: any) {
  try {
    if (!token.discordRefreshToken) return token;

    const params = new URLSearchParams({
      client_id: process.env.DISCORD_CLIENT_ID as string,
      client_secret: process.env.DISCORD_CLIENT_SECRET as string,
      grant_type: 'refresh_token',
      refresh_token: token.discordRefreshToken as string,
    });

    const res = await fetch('https://discord.com/api/v10/oauth2/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: params.toString(),
      cache: 'no-store',
    });

    if (!res.ok) {
      // Keep the old token but mark an error so we can re-auth if needed
      return { ...token, discordError: 'refresh_failed' };
    }

    const json = await res.json();
    const now = Math.floor(Date.now() / 1000);

    return {
      ...token,
      discordAccessToken: json.access_token as string,
      discordRefreshToken: (json.refresh_token ?? token.discordRefreshToken) as string,
      discordTokenType: json.token_type as string,
      discordScope: (json.scope ?? token.discordScope) as string,
      discordExpiresAt: now + (json.expires_in as number),
      discordError: undefined,
    };
  } catch {
    return { ...token, discordError: 'refresh_exception' };
  }
}

export const authOptions: NextAuthOptions = {
    adapter: MongoDBAdapter(getMongoClientPromise()),
    providers: [
      DiscordProvider({
        clientId: process.env.DISCORD_CLIENT_ID!,
        clientSecret: process.env.DISCORD_CLIENT_SECRET!,
        // Include members read so we can fetch guild roles via user token
        authorization: {
          params: { scope: 'identify email guilds guilds.members.read' },
        },
      }),
      GoogleProvider({
        clientId: process.env.GOOGLE_CLIENT_ID!,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      }),
    ],
    session: { strategy: 'jwt' },
    callbacks: {
      async jwt({ token, user, account }) {
        // persist our app's user id
        if (user?.id) (token as any).id = user.id;

        // On sign in, stash provider-specific details
        if (account?.provider === 'discord') {
          const now = Math.floor(Date.now() / 1000);
          (token as any).discordAccessToken = account.access_token;
          (token as any).discordRefreshToken = account.refresh_token;
          (token as any).discordTokenType = account.token_type;
          (token as any).discordScope = account.scope;
          (token as any).discordExpiresAt = account.expires_at ?? now + 3600; // fallback 1h
          (token as any).discordUserId = account.providerAccountId;
        }

        // If we already have a Discord token, refresh when expired (grace window 60s)
        if ((token as any).discordAccessToken && (token as any).discordExpiresAt) {
          const willExpireIn =
            (token as any).discordExpiresAt - Math.floor(Date.now() / 1000);
          if (willExpireIn < 60) {
            return await refreshDiscordAccessToken(token);
          }
        }

        return token;
      },

      async session({ session, token }) {
        // expose our app's user id
        if (session.user && (token as any).id) {
          session.user.id = (token as any).id as string;
        }

        // Expose Discord token(s) for server routes/actions
        if ((token as any).discordAccessToken) {
          (session as any).discordAccessToken = (token as any).discordAccessToken as string;
          (session as any).discordScope = (token as any).discordScope as string;
          (session as any).discordUserId = (token as any).discordUserId as string | undefined;

          // Back-compat if some code still reads `session.accessToken`
          (session as any).accessToken = (token as any).discordAccessToken as string;
        }

        return session;
      },
    },
    secret: process.env.NEXTAUTH_SECRET,
    pages: { signIn: '/auth' },
    debug: process.env.NODE_ENV !== 'production',
    events: {
      error(...args) {
        console.error('NextAuth error:', ...args);
      },
    },
  };

export function getAuthOptions(): NextAuthOptions {
  return authOptions;
}
