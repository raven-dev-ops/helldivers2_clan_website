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
  return NextResponse.json({
    id: user._id.toString(),
    name: user.name,
    email: user.email,
    image: user.image,
    division: user.division || null,
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
    challengeSubmissions: user.challengeSubmissions ?? [],
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
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
    const fields = ['name', 'characterHeightCm', 'characterWeightKg', 'homeplanet', 'background', 'division', 'callsign', 'rankTitle', 'favoriteWeapon', 'armor', 'motto'];
    for (const key of fields) {
      const value = form.get(key);
      if (value !== null && value !== undefined && value !== '') {
        if (key === 'characterHeightCm' || key === 'characterWeightKg') {
          const num = Number(value);
          if (!Number.isNaN(num)) updates[key] = num; else updates[key] = null;
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
  } else {
    const body = await req.json().catch(() => ({}));
    const {
      name,
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
      challengeSubmission,
    } = body || {};

    if (name !== undefined) updates.name = String(name);
    if (characterHeightCm !== undefined) updates.characterHeightCm = Number(characterHeightCm) || null;
    if (characterWeightKg !== undefined) updates.characterWeightKg = Number(characterWeightKg) || null;
    if (homeplanet !== undefined) updates.homeplanet = homeplanet ?? null;
    if (background !== undefined) updates.background = background ?? null;
    if (division !== undefined) updates.division = division ?? null;
    if (customAvatarDataUrl) updates.customAvatarDataUrl = String(customAvatarDataUrl);
    if (callsign !== undefined) updates.callsign = callsign ?? null;
    if (rankTitle !== undefined) updates.rankTitle = rankTitle ?? null;
    if (favoriteWeapon !== undefined) updates.favoriteWeapon = favoriteWeapon ?? null;
    if (armor !== undefined) updates.armor = armor ?? null;
    if (motto !== undefined) updates.motto = motto ?? null;

    if (challengeSubmission?.level >= 1 && challengeSubmission?.level <= 7) {
      const level = Number(challengeSubmission.level);
      const submission = {
        level,
        youtubeUrl: challengeSubmission.youtubeUrl ?? null,
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
  }

  if (Object.keys(updates).length > 0) {
    await UserModel.updateOne({ _id: session.user.id }, { $set: updates });
  }

  const updated = await UserModel.findById(session.user.id).lean();
  return NextResponse.json({
    id: updated?._id.toString(),
    name: updated?.name,
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
    challengeSubmissions: updated?.challengeSubmissions ?? [],
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
