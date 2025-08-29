// src/app/api/discord/roles/route.ts
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { getAuthOptions } from '@/lib/authOptions';
import getMongoClientPromise from '@/lib/mongoClientPromise';
import { ObjectId } from 'mongodb';
import { fetchDiscordRoles } from '@/lib/discordRoles';

const GUILD_ID = process.env.DISCORD_GUILD_ID;

export async function GET() {
  const session = await getServerSession(getAuthOptions());
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'unauthorized' }, { status: 401 });
  }

  const BOT_TOKEN = process.env.DISCORD_BOT_TOKEN;
  if (!BOT_TOKEN || !GUILD_ID) {
    // Gracefully degrade if bot token or guild ID is not set
    return NextResponse.json({ roles: [], isMember: false });
  }

  // Look up the user's Discord account to get their Discord user ID
  const client = await getMongoClientPromise();
  const db = client.db();
  const account = await db.collection('accounts').findOne({
    userId: new ObjectId(session.user.id),
    provider: 'discord',
  });

  if (!account?.providerAccountId) {
    return NextResponse.json({ roles: [], isMember: false });
  }

  const discordUserId = account.providerAccountId as string;

  try {
    const { roles, isMember } = await fetchDiscordRoles(
      discordUserId,
      BOT_TOKEN,
      GUILD_ID
    );
    return NextResponse.json({ roles, isMember });
  } catch (err) {
    const details = err instanceof Error ? err.message : '';
    return NextResponse.json(
      { error: 'discord_error', details },
      { status: 502 }
    );
  }
}
