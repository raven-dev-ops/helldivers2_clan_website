import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { getAuthOptions } from '@/lib/authOptions';
import { getUserGuildMember, getGuildRolesViaBot } from '@/lib/discord';
import { rateLimitOrResponse } from '@/lib/rateLimit';

export const dynamic = 'force-dynamic'; // never cache
export const runtime = 'nodejs';

// Simple per-user in-memory cache (resets on dyno restart)
type RolesCache = { roles: string[]; namedRoles: Array<{ id: string; name: string | null }>; guildMember: any; expiresAt: number };
const rolesCache = new Map<string, RolesCache>();
const ROLES_TTL_MS = 5 * 60_000; // 5 minutes

export async function GET(req: NextRequest) {
  const limited = await rateLimitOrResponse(req, { bucket: 'discord-roles', windowMs: 60_000, max: 10 });
  if (limited) return limited;

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
    return NextResponse.json(
      { roles: [], namedRoles: [], isMember: false, reason: 'no_discord_token' },
      { headers: { 'Cache-Control': 'private, max-age=60', Vary: 'Cookie' } }
    );
  }

  // Serve from cache if fresh
  const cached = rolesCache.get(session.user.id);
  if (cached && cached.expiresAt > Date.now()) {
    return NextResponse.json(
      { roles: cached.roles, namedRoles: cached.namedRoles, guildMember: cached.guildMember, isMember: true },
      { headers: { 'Cache-Control': 'private, max-age=300', Vary: 'Cookie' } }
    );
  }

  const member = await getUserGuildMember(discordAccessToken, guildId);
  if ('error' in member) {
    return NextResponse.json(
      { roles: [], namedRoles: [], isMember: false, error: member.error, status: member.status },
      { status: member.status ?? 502, headers: { 'Cache-Control': 'private, max-age=60', Vary: 'Cookie' } }
    );
  }

  const roleIds = (member.roles ?? []) as string[];

  // Optional: map IDs → names using a bot token (if provided)
  let namedRoles = roleIds.map((id) => ({ id, name: null as string | null }));
  const botRoles = await getGuildRolesViaBot(guildId, process.env.DISCORD_BOT_TOKEN).catch(() => null);
  if (botRoles?.length) {
    const nameMap = Object.fromEntries(botRoles.map((r) => [r.id, r.name]));
    namedRoles = roleIds.map((id) => ({ id, name: nameMap[id] ?? null }));
  }

  const payload = {
    roles: roleIds,
    namedRoles,
    guildMember: { user: member.user, nick: member.nick ?? null },
  };
  rolesCache.set(session.user.id, { roles: roleIds, namedRoles, guildMember: payload.guildMember, expiresAt: Date.now() + ROLES_TTL_MS });

  return NextResponse.json(
    { ...payload, isMember: true },
    { headers: { 'Cache-Control': 'private, max-age=300', Vary: 'Cookie' } }
  );
}
