import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { getAuthOptions } from '@/lib/authOptions';
import dbConnect from '@/lib/dbConnect';
import UserModel from '@/models/User';
import { upsertChallengeSubmission, buildUserResponse, saveProfileSnapshot } from './utils';

export async function PUT(req: Request) {
  const session = await getServerSession(getAuthOptions());
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'unauthorized' }, { status: 401 });
  }
  await dbConnect();

  const contentType = req.headers.get('content-type') || '';
  const updates: Record<string, unknown> = {};

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
    ];
    for (const key of fields) {
      const value = form.get(key);
      if (value !== null && value !== undefined && value !== '') {
        if (key === 'characterHeightCm' || key === 'characterWeightKg') {
          const num = Number(value);
          updates[key] = Number.isNaN(num) ? null : num;
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
    }
    const avatar = form.get('avatar');
    if (avatar && typeof avatar !== 'string') {
      const file = avatar as File;
      if (file.size > 0) {
        const arrayBuffer = await file.arrayBuffer();
        const base64 = Buffer.from(arrayBuffer).toString('base64');
        const dataUrl = `data:${file.type};base64,${base64}`;
        updates.customAvatarDataUrl = dataUrl;
      }
    }

    const levelRaw = form.get('challengeLevel');
    if (levelRaw) {
      const level = Number(levelRaw);
      if (level >= 1 && level <= 7) {
        const submission = {
          level,
          youtubeUrl: (form.get('youtubeUrl') || null) as string | null,
          twitchUrl: (form.get('twitchUrl') || null) as string | null,
          witnessName: (form.get('witnessName') || null) as string | null,
          witnessDiscordId: (form.get('witnessDiscordId') || null) as
            | string
            | null,
          createdAt: new Date(),
        };
        await upsertChallengeSubmission(session.user.id, submission);
      }
    }

    const rolesRaw = form.get('discordRoles');
    if (rolesRaw && typeof rolesRaw === 'string') {
      try {
        const parsed = JSON.parse(rolesRaw);
        if (Array.isArray(parsed)) updates.discordRoles = parsed;
      } catch {}
    }
  } else {
    const body = await req.json().catch(() => ({}));
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
      discordRoles,
    } = body || {};

    if (name !== undefined) updates.name = String(name);
    if (firstName !== undefined) updates.firstName = firstName ?? null;
    if (middleName !== undefined) updates.middleName = middleName ?? null;
    if (lastName !== undefined) updates.lastName = lastName ?? null;
    if (characterHeightCm !== undefined) {
      const num = Number(characterHeightCm);
      updates.characterHeightCm = Number.isFinite(num) ? num : null;
    }
    if (characterWeightKg !== undefined) {
      const num = Number(characterWeightKg);
      updates.characterWeightKg = Number.isFinite(num) ? num : null;
    }
    if (homeplanet !== undefined) updates.homeplanet = homeplanet ?? null;
    if (background !== undefined) updates.background = background ?? null;
    if (division !== undefined) updates.division = division ?? null;
    if (customAvatarDataUrl)
      updates.customAvatarDataUrl = String(customAvatarDataUrl);
    if (callsign !== undefined) updates.callsign = callsign ?? null;
    if (rankTitle !== undefined) updates.rankTitle = rankTitle ?? null;
    if (favoriteWeapon !== undefined)
      updates.favoriteWeapon = favoriteWeapon ?? null;
    if (armor !== undefined) updates.armor = armor ?? null;
    if (motto !== undefined) updates.motto = motto ?? null;
    if (favoredEnemy !== undefined) updates.favoredEnemy = favoredEnemy ?? null;
    if (meritPoints !== undefined) {
      const num = Number(meritPoints);
      if (!Number.isNaN(num)) updates.meritPoints = num;
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
      await upsertChallengeSubmission(session.user.id, submission);
    }

    if (discordRoles !== undefined && Array.isArray(discordRoles)) {
      updates.discordRoles = discordRoles;
    }
  }

  if (Object.keys(updates).length > 0) {
    await UserModel.updateOne(
      { _id: session.user.id },
      { $set: updates },
      { upsert: true }
    );
  }

  const updated = await UserModel.findById(session.user.id).lean();
  await saveProfileSnapshot(session.user.id, updated);

  return NextResponse.json(buildUserResponse(updated));
}
