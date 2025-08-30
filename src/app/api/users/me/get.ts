import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { ObjectId } from 'mongodb';
import { getAuthOptions } from '@/lib/authOptions';
import dbConnect from '@/lib/dbConnect';
import UserModel from '@/models/User';
import getMongoClientPromise from '@/lib/mongoClientPromise';
import { fetchDiscordRoles } from '@/lib/discordRoles';
import { buildUserResponse } from './utils';

export async function GET() {
  const session = await getServerSession(getAuthOptions());
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'unauthorized' }, { status: 401 });
  }

  await dbConnect();
  const user = await UserModel.findById(session.user.id).lean();
  if (!user) return NextResponse.json({ error: 'not_found' }, { status: 404 });

  // Attempt to sync Discord roles into the user profile (non-fatal)
  try {
    const BOT_TOKEN = process.env.DISCORD_BOT_TOKEN;
    const GUILD_ID = process.env.DISCORD_GUILD_ID;
    if (BOT_TOKEN && GUILD_ID) {
      const client = await getMongoClientPromise();
      const db = client.db();
      const account = await db.collection('accounts').findOne({
        userId: new ObjectId(session.user.id),
        provider: 'discord',
      });
      const discordUserId = account?.providerAccountId as string | undefined;
      if (discordUserId) {
        const { roles, isMember } = await fetchDiscordRoles(
          discordUserId,
          BOT_TOKEN,
          GUILD_ID
        );
        if (isMember) {
          const existing = Array.isArray(user.discordRoles)
            ? user.discordRoles
            : [];
          const sameLength = existing.length === roles.length;
          const same =
            sameLength &&
            existing.every((e) =>
              roles.some((r) => r.id === e.id && r.name === e.name)
            );
          if (!same) {
            await UserModel.updateOne(
              { _id: session.user.id },
              { $set: { discordRoles: roles } }
            );
          }
        }
      }
    }
  } catch {
    // ignore errors
  }

  const fresh = await UserModel.findById(session.user.id).lean();
  return NextResponse.json(buildUserResponse(fresh));
}
