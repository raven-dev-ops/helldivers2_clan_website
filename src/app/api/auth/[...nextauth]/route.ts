// src/app/api/auth/[...nextauth]/route.ts
import NextAuth from 'next-auth';
// Import necessary types from next-auth, using AdapterUser alias for clarity
import type { NextAuthOptions, Session, User as AdapterUser } from 'next-auth'; // Removed Profile, Account as not directly used here
import type { JWT } from 'next-auth/jwt'; // Import JWT type
import DiscordProvider from 'next-auth/providers/discord';
import GoogleProvider from 'next-auth/providers/google';

// --- Import Adapter and Client Promise ---
import { MongoDBAdapter } from "@next-auth/mongodb-adapter";
import clientPromise from "@/lib/dbClientPromise"; // <-- Use the native driver promise

// --- Environment Variable Validation ---
const requiredEnvVars = [
    'DISCORD_CLIENT_ID', 'DISCORD_CLIENT_SECRET',
    'GOOGLE_CLIENT_ID', 'GOOGLE_CLIENT_SECRET',
    'NEXTAUTH_SECRET', 'MONGODB_URI',
    // 'NEXTAUTH_URL' // Recommended for production
];

// Use a more robust check and provide default for NEXTAUTH_SECRET in dev
requiredEnvVars.forEach((varName) => {
    if (!process.env[varName]) {
        if (varName === 'NEXTAUTH_SECRET' && process.env.NODE_ENV !== 'production') {
            console.warn(`\x1b[33m%s\x1b[0m`, `⚠️ WARNING: Environment variable ${varName} is not set. Using default for development.`);
            // Provide a default only for dev secret, others must be set
            if (!process.env.NEXTAUTH_SECRET) process.env.NEXTAUTH_SECRET = 'temp-dev-secret-12345';
        } else {
            // Throw error during build/startup if required vars (except dev secret) are missing
            throw new Error(`Missing required environment variable: ${varName}`);
        }
    }
});

// Ensure NEXTAUTH_URL is set, especially for production OAuth callbacks
if (!process.env.NEXTAUTH_URL && process.env.NODE_ENV === 'production') {
    console.warn(`\x1b[33m%s\x1b[0m`, `⚠️ WARNING: Environment variable NEXTAUTH_URL is not set. OAuth callbacks may fail in production.`);
}


// --- Define Auth Options ---
export const authOptions: NextAuthOptions = {
  // --- Database Adapter ---
  // Connects NextAuth to MongoDB via the official adapter
  // ** Use the imported clientPromise from dbClientPromise.ts **
  adapter: MongoDBAdapter(clientPromise, {
      // Optional: Specify database name if not parsed from MONGODB_URI
      // databaseName: process.env.MONGODB_DB_NAME
      // collections: {} // You can customize collection names here if needed
  }),

  // --- Authentication Providers ---
  providers: [
    DiscordProvider({
      clientId: process.env.DISCORD_CLIENT_ID!,
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
  // Customize JWT and Session objects
  callbacks: {
    // 1. jwt callback: Runs when JWT is created/updated.
    async jwt({ token, user, account, profile, isNewUser }: {
        token: JWT;
        user?: AdapterUser; // User object from database/provider on first sign in
        account?: any; // Provider account info (tokens, etc.)
        profile?: any; // Provider profile info
        isNewUser?: boolean; // Flag for new user registration
    }) {
      // Persist the user's MongoDB _id onto the token on initial sign-in
      if (user?.id) {
        token.id = user.id; // user.id comes from the AdapterUser type (_id from DB)
      }
      // Example: Persist provider access token if needed (e.g., for API calls later)
      // if (account?.access_token) {
      //   token.accessToken = account.access_token;
      // }
      return token; // Return the token (saved in cookie)
    },

    // 2. session callback: Runs when session is accessed.
    async session({ session, token }: { session: Session; token: JWT }) {
      // Add properties from the token (retrieved via JWT strategy) to the session object.
      // Make sure to extend the Session['user'] type in a `next-auth.d.ts` file
      // to include the 'id' property for type safety.
      if (token?.id && session.user) {
        session.user.id = token.id as string; // Add database ID to session.user
      }
      // if (token?.accessToken && session.user) {
      //    (session.user as any).accessToken = token.accessToken; // Example for custom prop
      // }
      return session; // Return the augmented session object
    },
  },

  // --- Other Core Options ---
  secret: process.env.NEXTAUTH_SECRET!, // Non-null assertion OK due to check above
  pages: {
    signIn: '/auth', // Path to your custom sign-in page
    // error: '/auth/error', // Optional error page
    // verifyRequest: '/auth/verify-request', // Optional Email provider page
    // signOut: '/auth/signout', // Optional custom signout page
  },
  // Enable debug logs ONLY in development
  debug: process.env.NODE_ENV === 'development',
};

// --- Export NextAuth Handlers ---
// This sets up the /api/auth/* routes (e.g., /api/auth/signin/discord)
const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };


// --- Type Augmentation (Create this file if it doesn't exist) ---
// File: src/types/next-auth.d.ts
/*
import 'next-auth';
import 'next-auth/jwt';

declare module 'next-auth' {
  // Extend session.user
  interface Session {
    user?: {
      id?: string | null; // Add the id field
    } & DefaultSession['user']; // Keep default fields (name, email, image)
  }

  // Extend the User type returned by the adapter/provider if needed
  interface User {
     // Add custom fields returned from your adapter's user model
     // Example: role?: string;
  }
}

declare module 'next-auth/jwt' {
  // Extend the JWT token payload
  interface JWT {
    id?: string | null; // Add the id field
    // Example: role?: string;
    // Example: accessToken?: string;
  }
}
*/