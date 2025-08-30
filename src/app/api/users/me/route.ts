// src/app/api/users/me/route.ts
export const runtime = 'nodejs';

import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { getAuthOptions } from '@/lib/authOptions';
import dbConnect from '@/lib/dbConnect';
import UserModel from '@/models/User';
import getMongoClientPromise from '@/lib/mongoClientPromise';
import { ObjectId } from 'mongodb';
import { logger } from '@/lib/logger';

type Cached = { data: Record<string, unknown>; expires: number };
const userCache = new Map<string, Cached>();

function json(
  data: any,
  init?: { status?: number; headers?: Record<string, string> }
) {
  return NextResponse.json(data, {
    status: init?.status,
    headers: {
      'Cache-Control': 'private, max-age=60',
      Vary: 'Cookie',
      ...(init?.headers ?? {}),
    },
  });
}

/** GET /api/users/me — session-scoped profile (cached for 60s) */
export async function GET() {
  const session = await getServerSession(getAuthOptions());
  if (!session?.user?.id) return json({ error: 'unauthorized' }, { status: 401 });

  const now = Date.now();
  const cached = userCache.get(session.user.id);
  if (cached && cached.expires > now) return json(cached.data);

  await dbConnect();
  const user = await UserModel.findById(session.user.id)
    .select(
      [
        'name',
        'firstName',
        'middleName',
        'lastName',
        'email',
        'image',
        'division',
        'characterHeightCm',
        'characterWeightKg',
        'homeplanet',
        'background',
        'customAvatarDataUrl',
        'callsign',
        'rankTitle',
        'favoriteWeapon',
        'armor',
        'motto',
        'favoredEnemy',
        'meritPoints',
        'twitchUrl',
        'preferredHeightUnit',
        'preferredWeightUnit',
        'discordRoles',
        'challengeSubmissions',
        'createdAt',
        'updatedAt',
      ].join(' ')
    )
    .lean();

  if (!user) return json({ error: 'not_found' }, { status: 404 });

  const data: Record<string, unknown> = {
    id: user._id.toString(),
    name: user.name,
    firstName: user.firstName ?? null,
    middleName: user.middleName ?? null,
    lastName: user.lastName ?? null,
    email: user.email,
    image: user.image,
    division: user.division ?? null,
    characterHeightCm: user.characterHeightCm ?? null,
    characterWeightKg: user.characterWeightKg ?? null,
    homeplanet: user.homeplanet ?? null,
    background: user.background ?? null,
    customAvatarDataUrl: user.customAvatarDataUrl ?? null,
    callsign: user.callsign ?? null,
    rankTitle: user.rankTitle ?? null,
    favoriteWeapon: user.favoriteWeapon ?? null,
    armor: user.armor ?? null,
    motto: user.motto ?? null,
    favoredEnemy: user.favoredEnemy ?? null,
    meritPoints: user.meritPoints ?? 0,
    twitchUrl: user.twitchUrl ?? null,
    preferredHeightUnit: user.preferredHeightUnit ?? 'cm',
    preferredWeightUnit: user.preferredWeightUnit ?? 'kg',
    discordRoles: Array.isArray(user.discordRoles) ? user.discordRoles : [],
    challengeSubmissions: user.challengeSubmissions ?? [],
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
  };

  userCache.set(session.user.id, { data, expires: now + 60_000 });
  return json(data);
}

/** PUT /api/users/me — update profile (multipart or JSON) */
export async function PUT(req: Request) {
  const session = await getServerSession(getAuthOptions());
  if (!session?.user?.id) return json({ error: 'unauthorized' }, { status: 401 });

  await dbConnect();

  const contentType = req.headers.get('content-type') || '';
  const updates: Record<string, unknown> = {};
  const MAX_AVATAR = 2 * 1024 * 1024; // 2MB

  if (contentType.includes('multipart/form-data')) {
    const form = await req.formData();
    const fields = [
      'name',
      'firstName',
      'middleName',
      'lastName',
      'characterHeightCm',
      'characterWeightKg',
      'homeplanet',
      'background',
      'division',
      'callsign',
      'rankTitle',
      'favoriteWeapon',
      'armor',
      'motto',
      'favoredEnemy',
      'meritPoints',
      'twitchUrl',
      'preferredHeightUnit',
      'preferredWeightUnit',
    ] as const;

    for (const key of fields) {
      const value = form.get(key);
      if (value === null || value === undefined || value === '') continue;

      if (key === 'characterHeightCm' || key === 'characterWeightKg') {
        const num = Number(value);
        updates[key] = Number.isFinite(num) ? num : null;
      } else if (key === 'meritPoints') {
        const num = Number(value);
        if (!Number.isNaN(num)) updates.meritPoints = num;
      } else if (
        key === 'preferredHeightUnit' &&
        (value === 'cm' || value === 'in')
      ) {
        updates.preferredHeightUnit = value;
      } else if (
        key === 'preferredWeightUnit' &&
        (value === 'kg' || value === 'lb')
      ) {
        updates.preferredWeightUnit = value;
      } else {
        updates[key] = String(value);
      }
    }

    const avatar = form.get('avatar');
    if (avatar && typeof avatar !== 'string') {
      const file = avatar as File;
      if (file.size > 0 && file.size <= MAX_AVATAR) {
        const buf = Buffer.from(await file.arrayBuffer());
        updates.customAvatarDataUrl = `data:${file.type};base64,${buf.toString('base64')}`;
      } else if (file.size > MAX_AVATAR) {
        logger.warn?.('Avatar skipped: too large');
      }
    }

    // Challenge submission upsert (by level)
    const levelRaw = form.get('challengeLevel');
    if (levelRaw) {
      const level = Number(levelRaw);
      if (level >= 1 && level <= 7) {
        const submission = {
          level,
          youtubeUrl: (form.get('youtubeUrl') || null) as string | null,
          twitchUrl: (form.get('twitchUrl') || null) as string | null,
          witnessName: (form.get('witnessName') || null) as string | null,
          witnessDiscordId: (form.get('witnessDiscordId') || null) as string | null,
          createdAt: new Date(),
        };
        await UserModel.updateOne(
          { _id: session.user.id, 'challengeSubmissions.level': level },
          { $set: { 'challengeSubmissions.$': submission } }
        );
        await UserModel.updateOne(
          { _id: session.user.id, 'challengeSubmissions.level': { $ne: level } },
          { $push: { challengeSubmissions: submission } }
        );
      }
    }

    // SECURITY: do NOT accept discordRoles from client
  } else {
    const body = await req.json().catch(() => ({} as any));
    const {
      name,
      firstName,
      middleName,
      lastName,
      characterHeightCm,
      characterWeightKg,
      homeplanet,
      background,
      customAvatarDataUrl,
      division,
      callsign,
      rankTitle,
      favoriteWeapon,
      armor,
      motto,
      favoredEnemy,
      meritPoints,
      twitchUrl,
      preferredHeightUnit,
      preferredWeightUnit,
      challengeSubmission,
    } = body || {};

    if (name !== undefined) updates.name = String(name);
    if (firstName !== undefined) updates.firstName = firstName ?? null;
    if (middleName !== undefined) updates.middleName = middleName ?? null;
    if (lastName !== undefined) updates.lastName = lastName ?? null;

    if (characterHeightCm !== undefined) {
      const n = Number(characterHeightCm);
      updates.characterHeightCm = Number.isFinite(n) ? n : null;
    }
    if (characterWeightKg !== undefined) {
      const n = Number(characterWeightKg);
      updates.characterWeightKg = Number.isFinite(n) ? n : null;
    }

    if (homeplanet !== undefined) updates.homeplanet = homeplanet ?? null;
    if (background !== undefined) updates.background = background ?? null;
    if (division !== undefined) updates.division = division ?? null;
    if (customAvatarDataUrl) updates.customAvatarDataUrl = String(customAvatarDataUrl);
    if (callsign !== undefined) updates.callsign = callsign ?? null;
    if (rankTitle !== undefined) updates.rankTitle = rankTitle ?? null;
    if (favoriteWeapon !== undefined) updates.favoriteWeapon = favoriteWeapon ?? null;
    if (armor !== undefined) updates.armor = armor ?? null;
    if (motto !== undefined) updates.motto = motto ?? null;
    if (favoredEnemy !== undefined) updates.favoredEnemy = favoredEnemy ?? null;

    if (meritPoints !== undefined) {
      const n = Number(meritPoints);
      if (!Number.isNaN(n)) updates.meritPoints = n;
    }

    if (twitchUrl !== undefined) updates.twitchUrl = twitchUrl ?? null;
    if (preferredHeightUnit === 'cm' || preferredHeightUnit === 'in')
      updates.preferredHeightUnit = preferredHeightUnit;
    if (preferredWeightUnit === 'kg' || preferredWeightUnit === 'lb')
      updates.preferredWeightUnit = preferredWeightUnit;

    if (challengeSubmission?.level >= 1 && challengeSubmission?.level <= 7) {
      const level = Number(challengeSubmission.level);
      const submission = {
        level,
        youtubeUrl: challengeSubmission.youtubeUrl ?? null,
        twitchUrl: challengeSubmission.twitchUrl ?? null,
        witnessName: challengeSubmission.witnessName ?? null,
        witnessDiscordId: challengeSubmission.witnessDiscordId ?? null,
        createdAt: new Date(),
      };
      await UserModel.updateOne(
        { _id: session.user.id, 'challengeSubmissions.level': level },
        { $set: { 'challengeSubmissions.$': submission } }
      );
      await UserModel.updateOne(
        { _id: session.user.id, 'challengeSubmissions.level': { $ne: level } },
        { $push: { challengeSubmissions: submission } }
      );
    }

    // SECURITY: do NOT accept discordRoles from client
  }

  if (Object.keys(updates).length > 0) {
    await UserModel.updateOne({ _id: session.user.id }, { $set: updates }, { upsert: true });
  }

  const updated = await UserModel.findById(session.user.id).lean();

  // Snapshot to User_Profiles collection
  try {
    const client = await getMongoClientPromise();
    const db = client.db();
    const appDb = client.db(process.env.MONGODB_DB || 'GPTHellbot');

    const userObjectId = new ObjectId(session.user.id);
    const accounts = db.collection('accounts');
    const discordAccount = await accounts.findOne({ userId: userObjectId, provider: 'discord' });
    const discordId = discordAccount?.providerAccountId || null;

    const profile = {
      id: updated?._id?.toString(),
      name: updated?.name ?? null,
      firstName: updated?.firstName ?? null,
      middleName: updated?.middleName ?? null,
      lastName: updated?.lastName ?? null,
      division: updated?.division ?? null,
      characterHeightCm: updated?.characterHeightCm ?? null,
      characterWeightKg: updated?.characterWeightKg ?? null,
      homeplanet: updated?.homeplanet ?? null,
      background: updated?.background ?? null,
      callsign: updated?.callsign ?? null,
      rankTitle: updated?.rankTitle ?? null,
      favoriteWeapon: updated?.favoriteWeapon ?? null,
      favoredEnemy: updated?.favoredEnemy ?? null,
      armor: updated?.armor ?? null,
      motto: updated?.motto ?? null,
      twitchUrl: updated?.twitchUrl ?? null,
      preferredHeightUnit: updated?.preferredHeightUnit ?? 'cm',
      preferredWeightUnit: updated?.preferredWeightUnit ?? 'kg',
      meritPoints: updated?.meritPoints ?? 0,
      challengeSubmissions: updated?.challengeSubmissions ?? [],
      discordRoles: Array.isArray(updated?.discordRoles) ? updated?.discordRoles : [],
    };

    await appDb.collection('User_Profiles').updateOne(
      { user_id: userObjectId },
      {
        $set: { user_id: userObjectId, discord_id: discordId, last_profile: profile, last_updated: new Date() },
        $push: { history: { user_id: userObjectId, discord_id: discordId, time: new Date(), profile } },
      },
      { upsert: true }
    );
  } catch (e) {
    logger.error('Failed to write User_Profiles snapshot', e);
  }

  userCache.delete(session.user.id);
  return json({
    id: updated?._id.toString(),
    name: updated?.name,
    firstName: updated?.firstName ?? null,
    middleName: updated?.middleName ?? null,
    lastName: updated?.lastName ?? null,
    email: updated?.email,
    image: updated?.image,
    division: updated?.division ?? null,
    characterHeightCm: updated?.characterHeightCm ?? null,
    characterWeightKg: updated?.characterWeightKg ?? null,
    homeplanet: updated?.homeplanet ?? null,
    background: updated?.background ?? null,
    customAvatarDataUrl: updated?.customAvatarDataUrl ?? null,
    callsign: updated?.callsign ?? null,
    rankTitle: updated?.rankTitle ?? null,
    favoriteWeapon: updated?.favoriteWeapon ?? null,
    armor: updated?.armor ?? null,
    motto: updated?.motto ?? null,
    favoredEnemy: updated?.favoredEnemy ?? null,
    meritPoints: updated?.meritPoints ?? 0,
    twitchUrl: updated?.twitchUrl ?? null,
    preferredHeightUnit: updated?.preferredHeightUnit ?? 'cm',
    preferredWeightUnit: updated?.preferredWeightUnit ?? 'kg',
    challengeSubmissions: updated?.challengeSubmissions ?? [],
    discordRoles: Array.isArray(updated?.discordRoles) ? updated?.discordRoles : [],
    createdAt: updated?.createdAt,
    updatedAt: updated?.updatedAt,
  });
}

/** DELETE /api/users/me — delete user + auth artifacts */
export async function DELETE() {
  const session = await getServerSession(getAuthOptions());
  if (!session?.user?.id) return json({ error: 'unauthorized' }, { status: 401 });

  await dbConnect();
  const userId = new ObjectId(session.user.id);

  // Remove user document
  await UserModel.deleteOne({ _id: userId });

  // Remove NextAuth artifacts
  const client = await getMongoClientPromise();
  const db = client.db();
  await Promise.all([
    db.collection('accounts').deleteMany({ userId }),
    db.collection('sessions').deleteMany({ userId }),
  ]);

  // Remove app snapshot
  const appDb = client.db(process.env.MONGODB_DB || 'GPTHellbot');
  await appDb.collection('User_Profiles').deleteOne({ user_id: userId });

  userCache.delete(session.user.id);
  return json({ ok: true });
}
