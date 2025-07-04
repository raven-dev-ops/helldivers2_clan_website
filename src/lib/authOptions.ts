import type { NextAuthOptions } from 'next-auth';
import DiscordProvider from 'next-auth/providers/discord';
import GoogleProvider from 'next-auth/providers/google';
import { MongoDBAdapter } from '@next-auth/mongodb-adapter';

import clientPromise from '@/lib/mongoClientPromise';

export function getAuthOptions(): NextAuthOptions {
  return {
    adapter: MongoDBAdapter(clientPromise),
    providers: [
      DiscordProvider({
        clientId: process.env.DISCORD_CLIENT_ID!,
        clientSecret: process.env.DISCORD_CLIENT_SECRET!,
      }),
      GoogleProvider({
        clientId: process.env.GOOGLE_CLIENT_ID!,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      }),
    ],
    session: { strategy: 'jwt' },
    callbacks: {
      async jwt({ token, user }) {
        if (user?.id) token.id = user.id;
        return token;
      },
      async session({ session, token }) {
        if (session.user && token.id) session.user.id = token.id as string;
        return session;
      },
    },
    secret: process.env.NEXTAUTH_SECRET,
    pages: { signIn: '/auth' },
    debug: process.env.NODE_ENV === 'development',
  };
}
