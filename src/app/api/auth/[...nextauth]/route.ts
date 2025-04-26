// src/app/api/auth/[...nextauth]/route.ts
import NextAuth from 'next-auth';
import type { NextAuthOptions, Session, User as AdapterUser } from 'next-auth';
import type { JWT } from 'next-auth/jwt';
import DiscordProvider from 'next-auth/providers/discord';
import GoogleProvider from 'next-auth/providers/google';

// --- Import Adapter and Client Promise ---
import { MongoDBAdapter } from "@next-auth/mongodb-adapter";
import clientPromise from "@/lib/dbClientPromise"; // Ensure this path is correct

// --- Environment Variable Validation ---
const requiredEnvVars = [
    'DISCORD_CLIENT_ID', 'DISCORD_CLIENT_SECRET',
    'GOOGLE_CLIENT_ID', 'GOOGLE_CLIENT_SECRET',
    'NEXTAUTH_SECRET', 'MONGODB_URI',
];
requiredEnvVars.forEach((varName) => {
    if (!process.env[varName]) {
        if (varName === 'NEXTAUTH_SECRET' && process.env.NODE_ENV !== 'production') {
            console.warn(`\x1b[33m%s\x1b[0m`, `⚠️ WARNING: Environment variable ${varName} is not set. Using default for development.`);
            if (!process.env.NEXTAUTH_SECRET) process.env.NEXTAUTH_SECRET = 'temp-dev-secret-12345';
        } else {
            throw new Error(`Missing required environment variable: ${varName}`);
        }
    }
});
if (!process.env.NEXTAUTH_URL && process.env.NODE_ENV === 'production') {
    console.warn(`\x1b[33m%s\x1b[0m`, `⚠️ WARNING: Environment variable NEXTAUTH_URL is not set. OAuth callbacks may fail in production.`);
}


// --- Define Auth Options (REMOVE 'export' from this line) ---
const authOptions: NextAuthOptions = { // <<<<< REMOVED 'export' HERE
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
    strategy: "jwt", // Using JWT sessions, adapter handles User/Account persistence
  },
  callbacks: {
    // JWT callback adds DB user ID to the token
    async jwt({ token, user }) { // Simplified params when adapter is used with JWT
      // On initial sign-in, 'user' is the DB user object from the adapter.
      if (user?.id) {
        token.id = user.id; // Add DB user ID (_id) to JWT token
        // token.role = user.role // Add role if defined on DB User and needed in token
      }
      return token;
    },
    // Session callback adds properties from token to the session object
    async session({ session, token }) {
      // 'token' has the 'id' (and potentially 'role') added in the jwt callback.
      // The Session interface must be augmented in next-auth.d.ts
      if (token?.id && session.user) {
        session.user.id = token.id as string; // Add DB user ID to session
        // session.user.role = token.role // Add role if defined on token and needed in session
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

// --- Export NextAuth Handlers ---
// Initialize NextAuth with the options defined above
const handler = NextAuth(authOptions);
// Export only the handlers for GET/POST requests
export { handler as GET, handler as POST };


// --- Type Augmentation Reminder ---
// IMPORTANT: You MUST have a correctly defined src/types/next-auth.d.ts file
//            for the session callback to work without type errors and for
//            client-side code to recognize session.user.id.
//
// Create/ensure src/types/next-auth.d.ts contains:
/*
import { DefaultSession, DefaultUser } from "next-auth";
import { DefaultJWT, JWT } from "next-auth/jwt";

declare module "next-auth/jwt" {
  // Add fields from JWT callback to token payload
  interface JWT extends DefaultJWT {
    id: string; // Non-optional ID from DB user
    // role?: string;
  }
}

declare module "next-auth" {
  // Add fields from Session callback to session.user
  interface Session {
    user: {
      id: string; // Non-optional ID from DB user
      // role?: string;
    } & DefaultSession["user"]; // Keep default fields
  }

  // Optional: Extend User type if adapter provides extra fields needed in JWT callback
  // interface User extends DefaultUser {
  //   role?: string;
  // }
}
*/