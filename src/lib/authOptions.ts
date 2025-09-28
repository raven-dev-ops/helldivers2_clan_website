// src/lib/authOptions.ts
import type { NextAuthOptions } from 'next-auth';
import Discord from 'next-auth/providers/discord';
import Google from 'next-auth/providers/google';
import dbConnect from '@/lib/dbConnect';
import UserModel from '@/models/User';

export function getAuthOptions(): NextAuthOptions {
  const providers = [
    Discord({
      clientId: process.env.DISCORD_CLIENT_ID ?? '',
      clientSecret: process.env.DISCORD_CLIENT_SECRET ?? '',
    }),
    // Remove if you don’t use Google:
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID ?? '',
      clientSecret: process.env.GOOGLE_CLIENT_SECRET ?? '',
    }),
  ];

  return {
    // ✅ No adapter — pure JWT sessions
    session: { strategy: 'jwt' },
    secret: process.env.NEXTAUTH_SECRET,

    providers,

    callbacks: {
      // Inject the user id into the session object for convenience
      async session({ session, token }) {
        if (session?.user && token?.sub) {
          session.user.id = token.sub;
        }
        return session;
      },
      async jwt({ token }) {
        return token;
      },
    },

    events: {
      // Upsert a user record in your MongoDB when someone signs in
      async signIn({ user, account, profile }) {
        try {
          await dbConnect();
          // Minimal upsert based on email (tweak to your schema)
          await UserModel.findOneAndUpdate(
            { email: user.email },
            {
              $setOnInsert: {
                email: user.email,
                createdAt: new Date(),
              },
              $set: {
                name: user.name ?? null,
                image: user.image ?? null,
                lastLoginAt: new Date(),
                // Track seen providers (optional)
                providers: account?.provider
                  ? { [account.provider]: true }
                  : undefined,
              },
            },
            { upsert: true, new: true }
          ).lean();
        } catch (err) {
          // Returning false blocks sign-in; we generally don’t want that for a DB hiccup.
          // So just log and continue.
          console.error('signIn upsert error:', err);
        }
      },
    },
  };
}
