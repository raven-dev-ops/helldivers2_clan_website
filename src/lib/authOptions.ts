// src/lib/authOptions.ts
import type { NextAuthOptions, Session, User as AdapterUser } from 'next-auth';
import type { JWT } from 'next-auth/jwt';
import DiscordProvider from 'next-auth/providers/discord';
import GoogleProvider from 'next-auth/providers/google';

import { MongoDBAdapter } from "@next-auth/mongodb-adapter";
import { getMongoClientPromise } from "@/lib/dbClientPromise";

// Always call the function to get the client promise
const clientPromise = getMongoClientPromise();

export const authOptions: NextAuthOptions = {
  adapter: MongoDBAdapter(clientPromise, {
      // databaseName: process.env.MONGODB_DB_NAME // Optional
  }),
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
    strategy: "jwt",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user?.id) {
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      if (token?.id && session.user) {
        session.user.id = token.id as string;
      }
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET!,
  pages: {
    signIn: '/auth',
  },
  debug: process.env.NODE_ENV === 'development',
};
