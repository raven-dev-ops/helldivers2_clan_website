// src/app/api/discord/roles/route.ts
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { getAuthOptions } from '@/lib/authOptions';
import getMongoClientPromise from '@/lib/mongoClientPromise';
import { ObjectId } from 'mongodb';

const GUILD_ID = '1214787549655203862';

export async function GET() {
  const session = await getServerSession(getAuthOptions());
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'unauthorized' }, { status: 401 });
  }

  const BOT_TOKEN = process.env.DISCORD_BOT_TOKEN;
  if (!BOT_TOKEN) {
    // Gracefully degrade if bot token is not set
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

  // Fetch member
  const memberRes = await fetch(
    `https://discord.com/api/v10/guilds/${GUILD_ID}/members/${discordUserId}`,
    {
      headers: { Authorization: `Bot ${BOT_TOKEN}` },
      cache: 'no-store',
    }
  );

  if (memberRes.status === 404) {
    return NextResponse.json({ roles: [], isMember: false });
  }
  if (!memberRes.ok) {
    const text = await memberRes.text().catch(() => '');
    return NextResponse.json(
      { error: 'discord_error', details: text },
      { status: 502 }
    );
  }
  const member = await memberRes.json();
  const roleIds: string[] = member.roles || [];

  // Fetch guild roles to map names
  const rolesRes = await fetch(
    `https://discord.com/api/v10/guilds/${GUILD_ID}/roles`,
    {
      headers: { Authorization: `Bot ${BOT_TOKEN}` },
      cache: 'no-store',
    }
  );
  if (!rolesRes.ok) {
    return NextResponse.json({ roleIds, roles: [], isMember: true });
  }
  const guildRoles: Array<
    { id: string; name: string } & Record<string, unknown>
  > = await rolesRes.json();
  const idToName = new Map(guildRoles.map((r) => [r.id, r.name] as const));
  const roles = roleIds
    .map((id) => ({ id, name: idToName.get(id) || id }))
    // Optionally filter @everyone
    .filter((r) => r.name !== '@everyone');

  return NextResponse.json({ roles, isMember: true });
}
