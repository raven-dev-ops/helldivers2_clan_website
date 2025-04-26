// src/lib/authOptions.ts
import type { NextAuthOptions, Session, User as AdapterUser } from 'next-auth';
import type { JWT } from 'next-auth/jwt';
import DiscordProvider from 'next-auth/providers/discord';
import GoogleProvider from 'next-auth/providers/google';

// --- Import Adapter and Client Promise ---
import { MongoDBAdapter } from "@next-auth/mongodb-adapter";
import clientPromise from "@/lib/dbClientPromise"; // Ensure this path is correct

// Define Auth Options (and EXPORT it from here)
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
    // JWT callback adds DB user ID to the token
    async jwt({ token, user }) {
      if (user?.id) {
        token.id = user.id;
        // token.role = user.role // If needed
      }
      return token;
    },
    // Session callback adds properties from token to the session object
    async session({ session, token }) {
      if (token?.id && session.user) {
        session.user.id = token.id as string;
        // session.user.role = token.role // If needed
      }
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET!, // Assumes validation happens elsewhere or is set
  pages: {
    signIn: '/auth',
  },
  debug: process.env.NODE_ENV === 'development',
};

// Note: Environment variable validation should ideally happen
// before this object is defined or used, perhaps in the files that import it
// or in a separate initialization script/check.