// src/lib/authOptions.ts
import type { NextAuthOptions } from 'next-auth';
import DiscordProvider from 'next-auth/providers/discord';
import GoogleProvider from 'next-auth/providers/google';
import { MongoDBAdapter } from '@next-auth/mongodb-adapter';
import getMongoClientPromise from '@/lib/mongoClientPromise';

export function getAuthOptions(): NextAuthOptions {
  return {
    adapter: MongoDBAdapter(getMongoClientPromise()),
    providers: [
      DiscordProvider({
        clientId: process.env.DISCORD_CLIENT_ID!,
        clientSecret: process.env.DISCORD_CLIENT_SECRET!,
        authorization: {
          params: { scope: 'identify guilds guilds.members.read' },
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
        if (user?.id) token.id = user.id;
        if (account?.access_token) token.accessToken = account.access_token;
        return token;
      },
      async session({ session, token }) {
        if (session.user && token.id) session.user.id = token.id as string;
        if (token.accessToken)
          session.accessToken = token.accessToken as string;
        return session;
      },
    },
    secret: process.env.NEXTAUTH_SECRET,
    pages: { signIn: '/auth' },
    debug: process.env.NODE_ENV === 'development',
  };
}
