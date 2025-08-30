// src/app/api/users/me/get.ts
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { ObjectId } from 'mongodb';
import { getAuthOptions } from '@/lib/authOptions';
import dbConnect from '@/lib/dbConnect';
import UserModel from '@/models/User';
import getMongoClientPromise from '@/lib/mongoClientPromise';
import { fetchDiscordRoles } from '@/lib/discordRoles';
import { buildUserResponse } from './utils';
import { logger } from '@/lib/logger';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const CACHE_HEADERS = { 'Cache-Control': 'private, max-age=60' };

// In-process cooldown to avoid hammering Discord & Mongo.
// (Resets on dyno restart, which is fine.)
const roleSyncCooldownMs = 10 * 60 * 1000;
const lastRoleSyncByUser = new Map<string, number>();

function dueForRoleSync(userId: string) {
  const now = Date.now();
  const last = lastRoleSyncByUser.get(userId) ?? 0;
  if (now - last >= roleSyncCooldownMs) {
    lastRoleSyncByUser.set(userId, now);
    return true;
  }
  return false;
}

async function withTimeout<T>(p: Promise<T>, ms = 8000): Promise<T> {
  return await Promise.race([
    p,
    new Promise<T>((_, rej) =>
      setTimeout(() => rej(new Error('timeout')), ms)
    ),
  ]);
}

function sameRoles(
  a: Array<{ id: string; name?: string | null }> = [],
  b: Array<{ id: string; name?: string | null }> = []
): boolean {
  if (a.length !== b.length) return false;
  // Compare as sets (id+name tuple)
  const key = (r: { id: string; name?: string | null }) => `${r.id}::${r.name ?? ''}`;
  const setA = new Set(a.map(key));
  for (const r of b) if (!setA.has(key(r))) return false;
  return true;
}

export async function GET() {
  const session = await getServerSession(getAuthOptions());
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'unauthorized' }, { status: 401, headers: CACHE_HEADERS });
  }

  await dbConnect();

  const user = await UserModel.findById(session.user.id).lean();
  if (!user) {
    return NextResponse.json({ error: 'not_found' }, { status: 404, headers: CACHE_HEADERS });
  }

  // Try to sync Discord roles (non-fatal). We:
  // - require BOT + GUILD envs,
  // - find the user's Discord account id,
  // - skip if done in the last cooldown window,
  // - only write if changed.
  let rolesChanged = false;
  try {
    const BOT_TOKEN = process.env.DISCORD_BOT_TOKEN;
    const GUILD_ID = process.env.DISCORD_GUILD_ID;

    if (BOT_TOKEN && GUILD_ID && dueForRoleSync(session.user.id)) {
      const client = await getMongoClientPromise();
      // NextAuth collections might be in the default DB; we try default first.
      const defaultDb = client.db();
      const primaryAccount = await defaultDb.collection('accounts').findOne({
        userId: new ObjectId(session.user.id),
        provider: 'discord',
      });

      // Optional fallback: if you store NextAuth in a named DB.
      let account = primaryAccount;
      if (!account && process.env.MONGODB_DB) {
        try {
          const altDb = client.db(process.env.MONGODB_DB);
          account = await altDb.collection('accounts').findOne({
            userId: new ObjectId(session.user.id),
            provider: 'discord',
          });
        } catch {}
      }

      const discordUserId = account?.providerAccountId as string | undefined;

      if (!discordUserId) {
        logger.info?.('Discord sync skipped: no Discord account linked', {
          userId: session.user.id,
        });
      } else {
        // Guard the external call with a short timeout.
        const { roles, isMember } = await withTimeout(
          fetchDiscordRoles(discordUserId, BOT_TOKEN, GUILD_ID),
          8000
        );

        if (!isMember) {
          // If they left the guild, you can choose to clear roles or leave them as-is.
          logger.info?.('User not a member of guild; leaving stored roles unchanged', {
            userId: session.user.id,
          });
        } else {
          const existing =
            Array.isArray(user.discordRoles) ? user.discordRoles : [];
          if (!sameRoles(existing, roles)) {
            await UserModel.updateOne(
              { _id: session.user.id },
              { $set: { discordRoles: roles } }
            );
            rolesChanged = true;
            logger.info?.('Discord roles updated on profile', {
              userId: session.user.id,
              count: roles.length,
            });
          }
        }
      }
    }
  } catch (e: any) {
    logger.error?.('Discord sync error (non-fatal)', {
      userId: session.user.id,
      message: e?.message || String(e),
    });
    // swallow: response should still succeed
  }

  // Only re-fetch if we actually wrote a change.
  const fresh = rolesChanged
    ? await UserModel.findById(session.user.id).lean()
    : user;

  return NextResponse.json(buildUserResponse(fresh), {
    headers: CACHE_HEADERS,
  });
}
