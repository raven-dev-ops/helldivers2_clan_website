import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { getAuthOptions } from '@/lib/authOptions';
import { getUserGuildMember, getGuildRolesViaBot, postDiscordWebhook } from '@/lib/discord';

export const dynamic = 'force-dynamic'; // never cache
export const runtime = 'nodejs';

export async function GET() {
  const session = await getServerSession(getAuthOptions());
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'unauthorized' }, { status: 401 });
  }

  const guildId = process.env.DISCORD_GUILD_ID;
  if (!guildId) {
    return NextResponse.json({ error: 'server_misconfig', detail: 'DISCORD_GUILD_ID missing' }, { status: 500 });
  }

  const discordAccessToken = (session as any).discordAccessToken as string | undefined;
  if (!discordAccessToken) {
    await postDiscordWebhook(`🚫 No Discord access token for user ${session.user.id}`);
    return NextResponse.json({ roles: [], reason: 'no_discord_token' }, { headers: { 'Cache-Control': 'no-store' } });
  }

  const member = await getUserGuildMember(discordAccessToken, guildId);
  if ('error' in member) {
    await postDiscordWebhook(`❌ Role read failed for user ${session.user.id} — ${member.error}${member.status ? ` (${member.status})` : ''}`);
    return NextResponse.json({ roles: [], error: member.error, status: member.status }, { status: member.status ?? 502 });
  }

  const roleIds = (member.roles ?? []) as string[];

  // Optional: map IDs → names using a bot token (if provided)
  let namedRoles = roleIds.map((id) => ({ id, name: null as string | null }));
  const botRoles = await getGuildRolesViaBot(guildId, process.env.DISCORD_BOT_TOKEN).catch(() => null);
  if (botRoles?.length) {
    const nameMap = Object.fromEntries(botRoles.map((r) => [r.id, r.name]));
    namedRoles = roleIds.map((id) => ({ id, name: nameMap[id] ?? null }));
  }

  await postDiscordWebhook(`✅ Synced ${roleIds.length} roles for user ${session.user.id}`);

  return NextResponse.json(
    {
      roles: roleIds,
      namedRoles,
      guildMember: { user: member.user, nick: member.nick ?? null },
    },
    { headers: { 'Cache-Control': 'no-store' } }
  );
}
