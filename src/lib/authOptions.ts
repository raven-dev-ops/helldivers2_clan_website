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
    // Remove this block if you don't use Google
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID ?? '',
      clientSecret: process.env.GOOGLE_CLIENT_SECRET ?? '',
    }),
  ];

  return {
    session: { strategy: 'jwt' },
    secret: process.env.NEXTAUTH_SECRET,
    providers,

    callbacks: {
      async jwt({ token, user }) {
        try {
          // Initial sign-in flow (user is defined only then)
          if (user?.email) {
            await dbConnect();

            const doc = await UserModel.findOneAndUpdate(
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
                },
              },
              { new: true, upsert: true, lean: true }
            );

            if (doc) {
              token.uid = doc._id.toString();
            }
          }

          if (!token.uid && token.email) {
            await dbConnect();
            const existing = await UserModel.findOne({ email: token.email })
              .select('_id')
              .lean();
            if (existing?._id) {
              token.uid = existing._id.toString();
            }
          }
        } catch (e) {
          // Don't block auth on DB hiccups; just leave uid undefined
          console.error('next-auth jwt callback error:', e);
        }

        return token;
      },

      async session({ session, token }) {

        const uid = token?.uid as string | undefined;
        if (session?.user && uid) {
          session.user.id = uid;
        }
        return session;
      },
    },

    events: {
      async signIn({ user }) {
        if (!user?.email) return;
        try {
          await dbConnect();
          await UserModel.updateOne(
            { email: user.email },
            {
              $set: {
                name: user.name ?? null,
                image: user.image ?? null,
                lastLoginAt: new Date(),
              },
            },
            { upsert: true }
          );
        } catch (e) {
          console.error('next-auth signIn event upsert error:', e);
        }
      },
    },
  };
}
