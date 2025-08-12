// src/app/api/users/me/route.ts
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { getAuthOptions } from '@/lib/authOptions';
import dbConnect from '@/lib/dbConnect';
import UserModel from '@/models/User';
import getMongoClientPromise from '@/lib/mongoClientPromise';
import { ObjectId } from 'mongodb';

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
    const GUILD_ID = '1214787549655203862';
    if (BOT_TOKEN) {
      const client = await getMongoClientPromise();
      const db = client.db();
      const account = await db.collection('accounts').findOne({
        userId: new ObjectId(session.user.id),
        provider: 'discord',
      });
      const discordUserId = account?.providerAccountId as string | undefined;
      if (discordUserId) {
        const memberRes = await fetch(`https://discord.com/api/v10/guilds/${GUILD_ID}/members/${discordUserId}`, {
          headers: { Authorization: `Bot ${BOT_TOKEN}` },
          cache: 'no-store',
        });
        if (memberRes.ok) {
          const member = await memberRes.json();
          const roleIds: string[] = member.roles || [];

          const rolesRes = await fetch(`https://discord.com/api/v10/guilds/${GUILD_ID}/roles`, {
            headers: { Authorization: `Bot ${BOT_TOKEN}` },
            cache: 'no-store',
          });
          if (rolesRes.ok) {
            const guildRoles: Array<{ id: string; name: string } & Record<string, unknown>> = await rolesRes.json();
            const idToName = new Map(guildRoles.map((r) => [r.id, r.name] as const));
            const roles = roleIds
              .map((id) => ({ id, name: idToName.get(id) || id }))
              .filter((r) => r.name !== '@everyone');

            // Persist if different from stored value
            const existing = Array.isArray(user.discordRoles) ? user.discordRoles : [];
            const sameLength = existing.length === roles.length;
            const same = sameLength && existing.every((e) => roles.some((r) => r.id === e.id && r.name === e.name));
            if (!same) {
              await UserModel.updateOne({ _id: session.user.id }, { $set: { discordRoles: roles } });
            }
          }
        }
      }
    }
  } catch (e) {
    // ignore errors
  }

  // Re-read to include potentially synced roles
  const fresh = await UserModel.findById(session.user.id).lean();

  return NextResponse.json({
    id: fresh!._id.toString(),
    name: fresh!.name,
    firstName: fresh!.firstName ?? null,
    middleName: fresh!.middleName ?? null,
    lastName: fresh!.lastName ?? null,
    email: fresh!.email,
    image: fresh!.image,
    division: fresh!.division || null,
    characterHeightCm: fresh!.characterHeightCm ?? null,
    characterWeightKg: fresh!.characterWeightKg ?? null,
    homeplanet: fresh!.homeplanet ?? null,
    background: fresh!.background ?? null,
    customAvatarDataUrl: fresh!.customAvatarDataUrl ?? null,
    callsign: fresh!.callsign ?? null,
    rankTitle: fresh!.rankTitle ?? null,
    favoriteWeapon: fresh!.favoriteWeapon ?? null,
    armor: fresh!.armor ?? null,
    motto: fresh!.motto ?? null,
    favoredEnemy: fresh!.favoredEnemy ?? null,
    preferredHeightUnit: fresh!.preferredHeightUnit ?? 'cm',
    preferredWeightUnit: fresh!.preferredWeightUnit ?? 'kg',
    // include roles
    discordRoles: Array.isArray(fresh!.discordRoles) ? fresh!.discordRoles : [],
    challengeSubmissions: fresh!.challengeSubmissions ?? [],
    createdAt: fresh!.createdAt,
    updatedAt: fresh!.updatedAt,
  });
}

export async function PUT(req: Request) {
  const session = await getServerSession(getAuthOptions());
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'unauthorized' }, { status: 401 });
  }
  await dbConnect();

  const contentType = req.headers.get('content-type') || '';

  let updates: any = {};

  if (contentType.includes('multipart/form-data')) {
    const form = await req.formData();
    const fields = ['name', 'firstName', 'middleName', 'lastName', 'characterHeightCm', 'characterWeightKg', 'homeplanet', 'background', 'division', 'callsign', 'rankTitle', 'favoriteWeapon', 'armor', 'motto', 'favoredEnemy', 'preferredHeightUnit', 'preferredWeightUnit'];
    for (const key of fields) {
      const value = form.get(key);
      if (value !== null && value !== undefined && value !== '') {
        if (key === 'characterHeightCm' || key === 'characterWeightKg') {
          const num = Number(value);
          if (!Number.isNaN(num)) updates[key] = num; else updates[key] = null;
        } else if (key === 'preferredHeightUnit' && (value === 'cm' || value === 'in')) {
          updates.preferredHeightUnit = value;
        } else if (key === 'preferredWeightUnit' && (value === 'kg' || value === 'lb')) {
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

    // Challenge submission (single level upsert)
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
        // Upsert by level
        await UserModel.updateOne(
          { _id: session.user.id, 'challengeSubmissions.level': level },
          { $set: { 'challengeSubmissions.$': submission } },
        );
        // If not found, push
        await UserModel.updateOne(
          { _id: session.user.id, 'challengeSubmissions.level': { $ne: level } },
          { $push: { challengeSubmissions: submission } },
        );
      }
    }

    // Optional: accept discordRoles from form as JSON string
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
      preferredHeightUnit,
      preferredWeightUnit,
      challengeSubmission,
      // accept roles in JSON
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
    if (customAvatarDataUrl) updates.customAvatarDataUrl = String(customAvatarDataUrl);
    if (callsign !== undefined) updates.callsign = callsign ?? null;
    if (rankTitle !== undefined) updates.rankTitle = rankTitle ?? null;
    if (favoriteWeapon !== undefined) updates.favoriteWeapon = favoriteWeapon ?? null;
    if (armor !== undefined) updates.armor = armor ?? null;
    if (motto !== undefined) updates.motto = motto ?? null;
        if (favoredEnemy !== undefined) updates.favoredEnemy = favoredEnemy ?? null;
    if (preferredHeightUnit === 'cm' || preferredHeightUnit === 'in') updates.preferredHeightUnit = preferredHeightUnit;
    if (preferredWeightUnit === 'kg' || preferredWeightUnit === 'lb') updates.preferredWeightUnit = preferredWeightUnit;
 
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
        { $set: { 'challengeSubmissions.$': submission } },
      );
      await UserModel.updateOne(
        { _id: session.user.id, 'challengeSubmissions.level': { $ne: level } },
        { $push: { challengeSubmissions: submission } },
      );
    }

    if (discordRoles !== undefined && Array.isArray(discordRoles)) {
      updates.discordRoles = discordRoles;
    }
  }

  if (Object.keys(updates).length > 0) {
    await UserModel.updateOne({ _id: session.user.id }, { $set: updates }, { upsert: true });
  }

  const updated = await UserModel.findById(session.user.id).lean();

  // Save snapshot to User_Profiles collection with discord_id and time
  try {
    const client = await getMongoClientPromise();
    const db = client.db();
    const appDb = client.db(process.env.MONGODB_DB || 'GPTHellbot');
    const accounts = db.collection('accounts');
    const userObjectId = new ObjectId(session.user.id);
    const discordAccount = await accounts.findOne({ userId: userObjectId, provider: 'discord' });
    const discordId = discordAccount?.providerAccountId || null;
    const profileSnapshot = {
      user_id: userObjectId,
      discord_id: discordId,
      time: new Date(),
      profile: {
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
         preferredHeightUnit: updated?.preferredHeightUnit ?? 'cm',
         preferredWeightUnit: updated?.preferredWeightUnit ?? 'kg',
         challengeSubmissions: updated?.challengeSubmissions ?? [],
         discordRoles: Array.isArray(updated?.discordRoles) ? updated?.discordRoles : [],
      },
    };
    await appDb.collection('User_Profiles').updateOne(
      { user_id: userObjectId },
      {
        $set: {
          user_id: userObjectId,
          discord_id: discordId,
          last_profile: profileSnapshot.profile,
          last_updated: profileSnapshot.time,
        },
        $push: { history: profileSnapshot },
      },
      { upsert: true }
    );
  } catch (e) {
    console.error('Failed to write User_Profiles snapshot', e);
  }
  return NextResponse.json({
    id: updated?._id.toString(),
    name: updated?.name,
    firstName: updated?.firstName ?? null,
    middleName: updated?.middleName ?? null,
    lastName: updated?.lastName ?? null,
    email: updated?.email,
    image: updated?.image,
    division: updated?.division || null,
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
    preferredHeightUnit: updated?.preferredHeightUnit ?? 'cm',
    preferredWeightUnit: updated?.preferredWeightUnit ?? 'kg',
    challengeSubmissions: updated?.challengeSubmissions ?? [],
    // include roles
    discordRoles: Array.isArray(updated?.discordRoles) ? updated?.discordRoles : [],
    createdAt: updated?.createdAt,
    updatedAt: updated?.updatedAt,
  });
}

export async function DELETE() {
  const session = await getServerSession(getAuthOptions());
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'unauthorized' }, { status: 401 });
  }

  await dbConnect();
  const userId = new ObjectId(session.user.id);

  // Remove user document
  await UserModel.deleteOne({ _id: userId });

  // Remove NextAuth accounts and sessions
  const client = await getMongoClientPromise();
  const db = client.db();
  await Promise.all([
    db.collection('accounts').deleteMany({ userId }),
    db.collection('sessions').deleteMany({ userId }),
    db.collection('verificationTokens').deleteMany({}), // safety no-op; collection may be empty
  ]);

  return NextResponse.json({ ok: true });
}
