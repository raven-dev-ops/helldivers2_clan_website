// src/app/api/auth/[...nextauth]/route.ts
import NextAuth from 'next-auth';
// Import necessary types from next-auth, using AdapterUser alias for clarity
import type { NextAuthOptions, Session, User as AdapterUser, Profile, Account } from 'next-auth';
import type { JWT } from 'next-auth/jwt'; // Import JWT type
import DiscordProvider from 'next-auth/providers/discord';
import GoogleProvider from 'next-auth/providers/google';

// --- Import Adapter and Client Promise ---
import { MongoDBAdapter } from "@next-auth/mongodb-adapter";
// Ensure this path correctly points to your MongoDB client utility
import clientPromise from "@/lib/mongodb";

// --- Environment Variable Validation ---
const requiredEnvVars = [
    'DISCORD_CLIENT_ID', 'DISCORD_CLIENT_SECRET',
    'GOOGLE_CLIENT_ID', 'GOOGLE_CLIENT_SECRET',
    'NEXTAUTH_SECRET', 'MONGODB_URI',
    // 'NEXTAUTH_URL' // Recommended for production
];

requiredEnvVars.forEach((varName) => {
    if (!process.env[varName]) {
        if (varName === 'NEXTAUTH_SECRET' && process.env.NODE_ENV !== 'production') {
            console.warn(`\x1b[33m%s\x1b[0m`, `⚠️ WARNING: Environment variable ${varName} is not set. Using insecure temp value.`);
        } else if (varName === 'NEXTAUTH_URL' && process.env.NODE_ENV !== 'production') {
             console.warn(`\x1b[33m%s\x1b[0m`, `⚠️ WARNING: Environment variable ${varName} is not set. Recommended.`);
        } else {
            // Throw error during build/startup if required vars are missing
            throw new Error(`Missing required environment variable: ${varName}`);
        }
    }
});

// --- Define Auth Options ---
export const authOptions: NextAuthOptions = {
  // --- Database Adapter ---
  // Connects NextAuth to MongoDB via the official adapter
  adapter: MongoDBAdapter(clientPromise, {
      // Optional: Specify database name if not parsed from MONGODB_URI
      // databaseName: process.env.MONGODB_DB_NAME
  }),

  // --- Authentication Providers ---
  providers: [
    DiscordProvider({
      clientId: process.env.DISCORD_CLIENT_ID!, // Non-null assertion because we checked above
      clientSecret: process.env.DISCORD_CLIENT_SECRET!,
      // Optional: Define required Discord scopes
      // authorization: { params: { scope: 'identify email guilds' } },
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      // Optional: Define required Google scopes
      // authorization: { params: { scope: 'openid email profile' } },
    }),
    // Add other providers here if needed
  ],

  // --- Session Strategy ---
  session: {
    // Use JSON Web Tokens (JWT) stored in a cookie.
    strategy: "jwt",
    // Optional: Session duration settings (in seconds)
    // maxAge: 30 * 24 * 60 * 60, // 30 days (default)
    // updateAge: 24 * 60 * 60, // 1 day (default)
  },

  // --- Callbacks ---
  // Customize JWT and Session objects to include database ID
  callbacks: {
    // 1. jwt callback: Runs when JWT is created/updated.
    async jwt({ token, user }: { token: JWT; user?: AdapterUser }) {
      // On initial sign-in, the 'user' object from the adapter contains the DB user info.
      if (user?.id) {
        // Add the MongoDB _id (as string) to the token.
        token.id = user.id;
        // Add other data to token if needed (e.g., role)
        // token.role = (user as any).role || 'user'; // Requires User model/type extension
      }
      return token; // Return the token (saved in cookie)
    },

    // 2. session callback: Runs when session is accessed.
    async session({ session, token }: { session: Session; token: JWT }) {
      // Add properties from the token (retrieved via JWT strategy) to the session object.
      if (token?.id && session.user) {
        // Add the database ID (_id string) to the session object.
        // Type safety relies on extending Session in types/next-auth.d.ts
        session.user.id = token.id;
      }
      // Add role if it exists on the token
      // if (token?.role && session.user) {
      //   session.user.role = token.role as string; // Type assertion needed if type not extended
      // }
      return session; // Return the augmented session object
    },
  },

  // --- Other Core Options ---
  secret: process.env.NEXTAUTH_SECRET, // Secret for signing/encrypting tokens/cookies
  pages: {
    signIn: '/auth', // Path to your custom sign-in page
    // error: '/auth/error', // Optional error page
  },
  // Enable debug logs in development environment
  debug: process.env.NODE_ENV === 'development',
};

// --- Export NextAuth Handlers ---
// This sets up the /api/auth/* routes (e.g., /api/auth/signin/discord)
const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
