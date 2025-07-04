// src/lib/authOptions.ts
import type { NextAuthOptions, Session } from 'next-auth';
import type { JWT } from 'next-auth/jwt';
import DiscordProvider from 'next-auth/providers/discord';
import GoogleProvider from 'next-auth/providers/google';
import { AdapterUser } from 'next-auth/adapters';
import { MongoDBAdapter } from '@next-auth/mongodb-adapter';

import clientPromise from '@/lib/mongoClientPromise'; // ✅ Use the consistent shared client

export const authOptions: NextAuthOptions = {
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
  session: {
    strategy: 'jwt',
  },
  callbacks: {
    async jwt({ token, user }) {
      // ✅ Stronger type: user?.id must exist to set token.id
      if (user) {
        token.id = (user as AdapterUser).id;
      }
      return token;
    },
    async session({ session, token }) {
      // ✅ Add id to session.user if available
      if (session.user && token?.id) {
        (session.user as { id: string }).id = token.id as string;
      }
      return session;
    },
  },
  pages: {
    signIn: '/auth',
  },
  secret: process.env.NEXTAUTH_SECRET,
  debug: process.env.NODE_ENV === 'development',
};
