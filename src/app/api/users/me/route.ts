// src/app/api/users/me/route.ts
export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
export const revalidate = 0;

import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { getAuthOptions } from '@/lib/authOptions';
import dbConnect from '@/lib/dbConnect';
import UserModel from '@/models/User';
import { getMongoClient } from '@/lib/mongodb';
import { ObjectId } from 'mongodb';
import { logger } from '@/lib/logger';
import { jsonWithETag } from '@/lib/httpCache';

type Cached = { data: Record<string, unknown>; expires: number };
const userCache = new Map<string, Cached>();

/** small JSON helper with default private cache + vary cookie */
function json(
  data: any,
  init?: { status?: number; headers?: Record<string, string> },
  requestId?: string
) {
  return NextResponse.json(data, {
    status: init?.status,
    headers: {
      'Cache-Control': 'private, max-age=60',
      Vary: 'Cookie',
      ...(requestId ? { 'X-Request-ID': requestId } : {}),
      ...(init?.headers ?? {}),
    },
  });
}

function cryptoRandomId(): string {
  try {
    const arr = new Uint8Array(16);
    crypto.getRandomValues(arr);
    return Array.from(arr).map((b) => b.toString(16).padStart(2, '0')).join('');
  } catch {
    return Math.random().toString(16).slice(2) + Date.now().toString(16);
  }
}

/** GET /api/users/me — session-scoped profile (cached for 60s, ETag, selective fields) */
export async function GET(req: NextRequest) {
  const rid = req.headers.get('x-request-id') || cryptoRandomId();
  const startedAt = Date.now();

  try {
    const t0 = Date.now();
    const session = await getServerSession(getAuthOptions());
    const tAuth = Date.now() - t0;
    if (!session?.user?.id) return json({ error: 'unauthorized' }, { status: 401 }, rid);

    // Parse include query: e.g., ?include=avatar,submissions
    const { searchParams } = new URL(req.url);
    const includeParam = (searchParams.get('include') || '').trim();
    const includeSet = new Set(
      includeParam
        .split(',')
        .map((s) => s.trim().toLowerCase())
        .filter(Boolean)
    );
    const includeKey = Array.from(includeSet).sort().join(',');

    // Memory cache (per instance)
    const now = Date.now();
    const cacheKey = `${session.user.id}|${includeKey}`;
    const cached = userCache.get(cacheKey);
    if (cached && cached.expires > now) {
      const sizeBytes = Buffer.byteLength(JSON.stringify(cached.data));
      logger.info('users.me cache hit', { requestId: rid, sizeBytes });
      return jsonWithETag(req, cached.data, {
        headers: {
          'Cache-Control': 'private, max-age=60, stale-while-revalidate=600',
          Vary: 'Cookie',
          ...(rid ? { 'X-Request-ID': rid } : {}),
        },
      });
    }

    const t1 = Date.now();
    await dbConnect();
    const tDbConnect = Date.now() - t1;

    const t2 = Date.now();
    const baseFields = [
      'name',
      'firstName',
      'middleName',
      'lastName',
      'sesName',
      'email',
      'image',
      'division',
      'characterHeightCm',
      'characterWeightKg',
      'homeplanet',
      'background',
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
      'createdAt',
      'updatedAt',
    ];
    if (includeSet.has('avatar')) baseFields.push('customAvatarDataUrl');
    if (includeSet.has('submissions')) baseFields.push('challengeSubmissions');

    const user = await UserModel.findById(session.user.id)
      .select(baseFields.join(' '))
      .lean();

    const tDbQuery = Date.now() - t2;

    if (!user) return json({ error: 'not_found' }, { status: 404 }, rid);

    // Build response; include heavy fields only when requested
    const data: Record<string, unknown> = {
      id: user._id.toString(),
      name: user.name,
      firstName: user.firstName ?? null,
      middleName: user.middleName ?? null,
      lastName: user.lastName ?? null,
      email: user.email,
      image: user.image,
      sesName: user.sesName ?? null,
      division: user.division ?? null,
      characterHeightCm: user.characterHeightCm ?? null,
      characterWeightKg: user.characterWeightKg ?? null,
      homeplanet: user.homeplanet ?? null,
      background: user.background ?? null,
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
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };

    // Avatar meta only (no base64)
    if (includeSet.has('avatar')) {
      data.avatar = {
        hasCustom: !!user.customAvatarDataUrl,
        endpoint: '/api/users/me/avatar',
        sizeHint: user.customAvatarDataUrl ? user.customAvatarDataUrl.length : 0,
      };
    }

    // Slim + cap submissions
    if (includeSet.has('submissions')) {
      const raw = Array.isArray(user.challengeSubmissions) ? user.challengeSubmissions : [];
      data.challengeSubmissions = raw
        .slice(-10)
        .map((s: any) => ({
          level: s.level,
          youtubeUrl: s.youtubeUrl ?? null,
          twitchUrl: s.twitchUrl ?? null,
          witnessName: s.witnessName ?? null,
          witnessDiscordId: s.witnessDiscordId ?? null,
          createdAt: s.createdAt ?? null,
        }));
    }

    userCache.set(cacheKey, { data, expires: now + 60_000 });

    const totalMs = Date.now() - startedAt;
    const sizeBytes = Buffer.byteLength(JSON.stringify(data));
    logger.info('users.me timings', {
      requestId: rid,
      timings: {
        authMs: tAuth,
        dbConnectMs: tDbConnect,
        dbQueryMs: tDbQuery,
        serializeMs: Date.now() - t2 - tDbQuery,
        totalMs,
      },
      sizeBytes,
      include: includeKey,
    });
    const WARN_MS = 200;
    if (totalMs > WARN_MS) {
      logger.warn('users.me slow', {
        requestId: rid,
        timings: { totalMs },
        thresholdMs: WARN_MS,
        include: includeKey,
      });
    }

    return jsonWithETag(req, data, {
      headers: {
        'Cache-Control': 'private, max-age=60, stale-while-revalidate=600',
        Vary: 'Cookie',
        ...(rid ? { 'X-Request-ID': rid } : {}),
      },
    });
  } catch (err) {
    logger.error('users.me GET error', { requestId: rid, error: String(err) });
    return json({ error: 'internal_error' }, { status: 500 }, rid);
  }
}

/** PUT /api/users/me — update profile (multipart or JSON) */
export async function PUT(req: NextRequest) {
  const rid = req.headers.get('x-request-id') || cryptoRandomId();

  try {
    const session = await getServerSession(getAuthOptions());
    if (!session?.user?.id) return json({ error: 'unauthorized' }, { status: 401 }, rid);

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
        'sesName',
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
        } else if (key === 'preferredHeightUnit' && (value === 'cm' || value === 'in')) {
          updates.preferredHeightUnit = value;
        } else if (key === 'preferredWeightUnit' && (value === 'kg' || value === 'lb')) {
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
          logger.warn?.('Avatar skipped: too large', { requestId: rid });
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

          // Try update-in-place; if no match, push
          const res1 = await UserModel.updateOne(
            { _id: session.user.id, 'challengeSubmissions.level': level },
            { $set: { 'challengeSubmissions.$': submission } }
          );
          if (res1.matchedCount === 0) {
            await UserModel.updateOne(
              { _id: session.user.id, 'challengeSubmissions.level': { $ne: level } },
              { $push: { challengeSubmissions: submission } },
              { upsert: true }
            );
          }
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
        sesName,
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
      if (sesName !== undefined) updates.sesName = sesName ?? null;

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

        const res1 = await UserModel.updateOne(
          { _id: session.user.id, 'challengeSubmissions.level': level },
          { $set: { 'challengeSubmissions.$': submission } }
        );
        if (res1.matchedCount === 0) {
          await UserModel.updateOne(
            { _id: session.user.id, 'challengeSubmissions.level': { $ne: level } },
            { $push: { challengeSubmissions: submission } },
            { upsert: true }
          );
        }
      }

      // SECURITY: do NOT accept discordRoles from client
    }

    if (Object.keys(updates).length > 0) {
      await UserModel.updateOne({ _id: session.user.id }, { $set: updates }, { upsert: true });
    }

    const updated = await UserModel.findById(session.user.id).lean();

    // Snapshot to User_Profiles collection (best-effort)
    try {
      const client = await getMongoClient();
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
        sesName: updated?.sesName ?? null,
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
          $set: {
            user_id: userObjectId,
            discord_id: discordId,
            last_profile: profile,
            last_updated: new Date(),
          },
          $push: {
            history: {
              user_id: userObjectId,
              discord_id: discordId,
              time: new Date(),
              profile,
            },
          },
        },
        { upsert: true }
      );
    } catch (e) {
      logger.error('Failed to write User_Profiles snapshot', { requestId: rid, error: String(e) });
    }

    // Invalidate all cached variants (any includeKey) for this user
    for (const key of Array.from(userCache.keys())) {
      if (key === session.user.id || key.startsWith(`${session.user.id}|`)) {
        userCache.delete(key);
      }
    }

    // Slim + cap submissions in PUT response too
    const submissionsSlim = Array.isArray(updated?.challengeSubmissions)
      ? updated!.challengeSubmissions.slice(-10).map((s: any) => ({
          level: s.level,
          youtubeUrl: s.youtubeUrl ?? null,
          twitchUrl: s.twitchUrl ?? null,
          witnessName: s.witnessName ?? null,
          witnessDiscordId: s.witnessDiscordId ?? null,
          createdAt: s.createdAt ?? null,
        }))
      : [];

    return json(
      {
        id: updated?._id.toString(),
        name: updated?.name,
        firstName: updated?.firstName ?? null,
        middleName: updated?.middleName ?? null,
        lastName: updated?.lastName ?? null,
        sesName: updated?.sesName ?? null,
        email: updated?.email,
        image: updated?.image,
        division: updated?.division ?? null,
        characterHeightCm: updated?.characterHeightCm ?? null,
        characterWeightKg: updated?.characterWeightKg ?? null,
        homeplanet: updated?.homeplanet ?? null,
        background: updated?.background ?? null,
        // no base64 here:
        avatar: {
          hasCustom: !!updated?.customAvatarDataUrl,
          endpoint: '/api/users/me/avatar',
          sizeHint: updated?.customAvatarDataUrl ? updated.customAvatarDataUrl.length : 0,
        },
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
        challengeSubmissions: submissionsSlim,
        discordRoles: Array.isArray(updated?.discordRoles) ? updated?.discordRoles : [],
        createdAt: updated?.createdAt,
        updatedAt: updated?.updatedAt,
      },
      undefined,
      rid
    );
  } catch (err) {
    logger.error('users.me PUT error', { requestId: rid, error: String(err) });
    return json({ error: 'internal_error' }, { status: 500 }, rid);
  }
}

/** DELETE /api/users/me — delete user + auth artifacts */
export async function DELETE(req: NextRequest) {
  const rid = req.headers.get('x-request-id') || cryptoRandomId();

  try {
    const session = await getServerSession(getAuthOptions());
    if (!session?.user?.id) return json({ error: 'unauthorized' }, { status: 401 }, rid);

    await dbConnect();
    const userId = new ObjectId(session.user.id);

    // Remove user document
    await UserModel.deleteOne({ _id: userId });

    // Remove NextAuth artifacts (collections may not exist if you're JWT-only)
    const client = await getMongoClient();
    const db = client.db();
    await Promise.all([
      db.collection('accounts').deleteMany({ userId }).catch(() => undefined),
      db.collection('sessions').deleteMany({ userId }).catch(() => undefined),
      // Note: verificationTokens are not user-scoped; leave them alone.
    ]);

    // Remove app snapshot
    const appDb = client.db(process.env.MONGODB_DB || 'GPTHellbot');
    await appDb.collection('User_Profiles').deleteOne({ user_id: userId }).catch(() => undefined);

    // Evict cache entries
    for (const key of Array.from(userCache.keys())) {
      if (key === session.user.id || key.startsWith(`${session.user.id}|`)) {
        userCache.delete(key);
      }
    }

    return json({ ok: true }, undefined, rid);
  } catch (err) {
    logger.error('users.me DELETE error', { requestId: rid, error: String(err) });
    return json({ error: 'internal_error' }, { status: 500 }, rid);
  }
}
