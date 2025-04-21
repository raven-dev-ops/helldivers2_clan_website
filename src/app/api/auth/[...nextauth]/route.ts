// src/app/api/auth/[...nextauth]/route.ts
import NextAuth from 'next-auth';
import type { NextAuthOptions, Session as NextAuthSession, User as NextAuthUser } from 'next-auth';
import type { JWT } from 'next-auth/jwt';
import DiscordProvider from 'next-auth/providers/discord';
import GoogleProvider from 'next-auth/providers/google';

// --- Import Adapter and Client Promise ---
import { MongoDBAdapter } from "@next-auth/mongodb-adapter";
import clientPromise from "@/lib/mongodb"; // Adjust path if needed

// --- Import your User model if needed for role checking ---
// import UserModel from '@/models/User'; // Adjust path

export const authOptions: NextAuthOptions = {
  // --- Configure the Adapter ---
  adapter: MongoDBAdapter(clientPromise, {
      // Optional: Specify database name if not in MONGODB_URI
      // databaseName: process.env.MONGODB_DB_NAME
      collections: {
        // Optional: Specify custom collection names if needed
        // Users: 'users',
        // Accounts: 'accounts',
        // Sessions: 'sessions',
        // VerificationTokens: 'verification_tokens',
      }
  }),

  // --- Configure Providers ---
  providers: [
    DiscordProvider({
      clientId: process.env.DISCORD_CLIENT_ID!,
      clientSecret: process.env.DISCORD_CLIENT_SECRET!,
      // Optional: Request specific scopes if needed beyond default
      // authorization: { params: { scope: 'identify email guilds' } },
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    // Add other providers if needed
  ],

  // --- Session Strategy ---
  session: {
    strategy: 'jwt', // Use JWT to store session info, allows custom callbacks
  },

  // --- Callbacks ---
  callbacks: {
    // 1. JWT Callback: Called when token is created/updated
    async jwt({ token, user, account, profile }) {
      // On initial sign in (when 'user' object from adapter is available)
      if (user) {
        // --- Persist the MongoDB _id (user.id) to the token ---
        token.id = user.id;
        // You could fetch the user role from DB here if not provided by adapter 'user' object
        // const dbUser = await UserModel.findById(user.id).select('role').lean();
        // token.role = dbUser?.role || 'user';
      }
      return token;
    },

    // 2. Session Callback: Called when session is accessed
    async session({ session, token }) {
      // Add the id (and any other properties like role) from the token to the session.user object
      if (token?.id && session.user) {
        // --- Assign the Database ID (from token) to session.user.id ---
        session.user.id = token.id as string;
      }
      // Example: Add role
      // if (token?.role && session.user) {
      //   session.user.role = token.role as string;
      // }
      return session;
    },
  },

  // --- Other Options ---
  pages: {
    signIn: '/auth', // Your custom sign-in page
    // signOut: '/auth/signout',
    // error: '/auth/error', // Error code passed in query string as ?error=
    // verifyRequest: '/auth/verify-request', // (used for email provider)
    // newUser: '/auth/new-user' // New users will be directed here on first sign in (leave the property out to disable)
  },
  secret: process.env.NEXTAUTH_SECRET, // Essential for JWT signing
  // Enable debug logs in development for troubleshooting
  debug: process.env.NODE_ENV === 'development',
};

// --- Export Handlers ---
const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };

// --- Extend Session/User Types (Optional but Recommended) ---
// Create a types/next-auth.d.ts file if you haven't
/*
// types/next-auth.d.ts
import NextAuth, { DefaultSession, DefaultUser } from "next-auth"
import { JWT } from "next-auth/jwt"

declare module "next-auth" {
  interface Session {
    user: {
      id: string; // Add the id property
      role?: string; // Add role if using it
    } & DefaultSession["user"] // Keep existing properties like name, email, image
  }
  // Optionally extend the User type if adapter provides more fields initially
  // interface User extends DefaultUser {
  //   role?: string;
  // }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string; // Add id to the token
    role?: string; // Add role if using it
  }
}
*/