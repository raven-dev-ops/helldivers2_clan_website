// src/app/api/users/profile/ranking/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { getAuthOptions } from '@/lib/authOptions';
import { getMongoClientPromise } from '@/lib/mongodb';
import { ObjectId } from 'mongodb';
import { logger } from '@/lib/logger';

export async function POST(req: NextRequest) {
  const session = await getServerSession(getAuthOptions());
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'unauthorized' }, { status: 401 });
  }

  const { entries } = await req.json().catch(() => ({ entries: [] }));
  if (!Array.isArray(entries) || entries.length === 0) {
    return NextResponse.json({ ok: true });
  }

  try {
    const client = await getMongoClientPromise();
    const db = client.db();
    const appDb = client.db(process.env.MONGODB_DB || 'GPTHellbot');
    const userObjectId = new ObjectId(session.user.id);
    const accounts = db.collection('accounts');
    const discordAccount = await accounts.findOne({
      userId: userObjectId,
      provider: 'discord',
    });
    const discordId = discordAccount?.providerAccountId || null;

    const now = new Date();
    const normalized = entries.map((e: any) => ({
      scope: e.scope,
      rank: e.rank,
      stats: e.stats || null,
      time: now,
    }));

    await appDb.collection('User_Profiles').updateOne(
      { user_id: userObjectId },
      {
        $set: {
          user_id: userObjectId,
          discord_id: discordId,
          last_ranking_updated: now,
          currentRanking: normalized,
        },
        $push: { rankingHistory: { time: now, entries: normalized } },
      },
      { upsert: true }
    );

    return NextResponse.json({ ok: true });
  } catch (e) {
    logger.error('Failed saving current ranking', e);
    return NextResponse.json({ error: 'failed' }, { status: 500 });
  }
}
