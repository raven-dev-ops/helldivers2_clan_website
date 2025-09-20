import { ObjectId } from 'mongodb';
import UserModel from '@/models/User';
import getMongoClientPromise from '@/lib/mongodb';
import { logger } from '@/lib/logger';

export function buildUserResponse(user: any) {
  return {
    id: user?._id?.toString(),
    name: user?.name,
    firstName: user?.firstName ?? null,
    middleName: user?.middleName ?? null,
    lastName: user?.lastName ?? null,
    email: user?.email,
    image: user?.image,
    division: user?.division || null,
    characterHeightCm: user?.characterHeightCm ?? null,
    characterWeightKg: user?.characterWeightKg ?? null,
    homeplanet: user?.homeplanet ?? null,
    background: user?.background ?? null,
    customAvatarDataUrl: user?.customAvatarDataUrl ?? null,
    callsign: user?.callsign ?? null,
    rankTitle: user?.rankTitle ?? null,
    favoriteWeapon: user?.favoriteWeapon ?? null,
    armor: user?.armor ?? null,
    motto: user?.motto ?? null,
    favoredEnemy: user?.favoredEnemy ?? null,
    meritPoints: user?.meritPoints ?? 0,
    twitchUrl: user?.twitchUrl ?? null,
    preferredHeightUnit: user?.preferredHeightUnit ?? 'cm',
    preferredWeightUnit: user?.preferredWeightUnit ?? 'kg',
    discordRoles: Array.isArray(user?.discordRoles) ? user.discordRoles : [],
    challengeSubmissions: user?.challengeSubmissions ?? [],
    createdAt: user?.createdAt,
    updatedAt: user?.updatedAt,
  };
}

export async function upsertChallengeSubmission(userId: string, submission: any) {
  await UserModel.updateOne(
    { _id: userId, 'challengeSubmissions.level': submission.level },
    { $set: { 'challengeSubmissions.$': submission } }
  );
  await UserModel.updateOne(
    { _id: userId, 'challengeSubmissions.level': { $ne: submission.level } },
    { $push: { challengeSubmissions: submission } }
  );
}

export async function saveProfileSnapshot(userId: string, user: any) {
  try {
    const client = await getMongoClientPromise();
    const db = client.db();
    const appDb = client.db(process.env.MONGODB_DB || 'GPTHellbot');
    const accounts = db.collection('accounts');
    const userObjectId = new ObjectId(userId);
    const discordAccount = await accounts.findOne({
      userId: userObjectId,
      provider: 'discord',
    });
    const discordId = discordAccount?.providerAccountId || null;
    const profileSnapshot = {
      user_id: userObjectId,
      discord_id: discordId,
      time: new Date(),
      profile: buildUserResponse(user),
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
    logger.error('Failed to write User_Profiles snapshot', e);
  }
}
