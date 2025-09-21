import { ObjectId, type Collection, type UpdateFilter } from 'mongodb';
import UserModel from '@/models/User';
import { getMongoClientPromise } from '@/lib/mongodb';
import { logger } from '@/lib/logger';

type Profile = {
  id?: string;
  name: string | null;
  firstName: string | null;
  middleName: string | null;
  lastName: string | null;
  sesName: string | null;
  email: string | null;
  image: string | null;
  division: string | null;
  characterHeightCm: number | null;
  characterWeightKg: number | null;
  homeplanet: string | null;
  background: string | null;
  customAvatarDataUrl: string | null;
  callsign: string | null;
  rankTitle: string | null;
  favoriteWeapon: string | null;
  favoredEnemy: string | null;
  armor: string | null;
  motto: string | null;
  twitchUrl: string | null;
  preferredHeightUnit: string;
  preferredWeightUnit: string;
  meritPoints: number;
  challengeSubmissions: unknown[];
  createdAt?: Date | string | null;
  updatedAt?: Date | string | null;
  discordRoles: any[];
};

export type HistoryEntry = {
  user_id: ObjectId;
  discord_id: string;
  time: Date;
  profile: Profile;
};

export type UserState = {
  _id?: ObjectId;
  user_id: ObjectId;
  discord_id: string;
  last_profile: Profile;
  last_updated: Date;
  history: HistoryEntry[];
};

function getUserStateCollection(db: { collection<T>(name: string): Collection<T> }) {
  return db.collection<UserState>('User_Profiles');
}

export function buildUserResponse(user: any): Profile {
  return {
    id: user?._id?.toString(),
    name: user?.name ?? null,
    firstName: user?.firstName ?? null,
    middleName: user?.middleName ?? null,
    lastName: user?.lastName ?? null,
    sesName: user?.sesName ?? null,
    email: user?.email ?? null,
    image: user?.image ?? null,
    division: user?.division ?? null,
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
    discordRoles: Array.isArray(user?.discordRoles) ? (user.discordRoles as any[]) : [],
    challengeSubmissions: Array.isArray(user?.challengeSubmissions) ? user.challengeSubmissions : [],
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

export async function saveProfileSnapshot(userId: string, user: any, requestId?: string) {
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
    const discordId = typeof discordAccount?.providerAccountId === 'string' ? discordAccount.providerAccountId : '';

    const coll = getUserStateCollection(appDb);

    const profileSnapshot: HistoryEntry = {
      user_id: userObjectId,
      discord_id: discordId,
      time: new Date(),
      profile: buildUserResponse(user),
    };

    const filter = { user_id: userObjectId } as const;

    const update: UpdateFilter<UserState> = {
      $set: {
        user_id: userObjectId,
        discord_id: discordId,
        last_profile: profileSnapshot.profile,
        last_updated: profileSnapshot.time,
      },
      $push: {
        history: profileSnapshot,
      },
    };

    await coll.updateOne(filter, update, { upsert: true });
  } catch (e) {
    logger.error('Failed to write User_Profiles snapshot', { requestId, error: e });
  }
}
