// src/app/(main)/helldivers-2/profile/[userID]/page.tsx

import mongoose from 'mongoose';
import dbConnect from '@/lib/dbConnect';
import UserModel from '@/models/User';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import { format } from 'date-fns';
import { logger } from '@/lib/logger';

type UserProfileData = {
  user: Record<string, unknown> & { createdAt?: string | Date };
};

async function getUserProfile(userID: string): Promise<UserProfileData | null> {
  if (!mongoose.Types.ObjectId.isValid(userID)) return null;
  await dbConnect();

  try {
    const user = await UserModel.findById(userID).lean();
    if (!user) return null;

    // Serialize ObjectId/Date for edge/runtime safety
    return JSON.parse(JSON.stringify({ user })) as UserProfileData;
  } catch (error) {
    logger.error('Error fetching profile:', error);
    return null;
  }
}

export default async function ProfilePage({
  params,
}: {
  params: { userID: string };
}) {
  const { userID } = params;
  const profileData = await getUserProfile(userID);

  if (!profileData) {
    notFound();
  }

  const { user } = profileData as any;

  const heightUnit: 'cm' | 'in' =
    user?.preferredHeightUnit === 'in' ? 'in' : 'cm';
  const weightUnit: 'kg' | 'lb' =
    user?.preferredWeightUnit === 'lb' ? 'lb' : 'kg';

  const heightDisplay = (() => {
    const cmVal = user?.characterHeightCm;
    if (cmVal == null) return '—';
    if (heightUnit === 'cm') return cmVal;
    return Math.round(Number(cmVal) / 2.54);
  })();

  const weightDisplay = (() => {
    const kgVal = user?.characterWeightKg;
    if (kgVal == null) return '—';
    if (weightUnit === 'kg') return kgVal;
    return Math.round(Number(kgVal) * 2.2046226218);
  })();

  const displayName =
    user?.name ||
    [user?.firstName, user?.middleName, user?.lastName]
      .filter(Boolean)
      .join(' ') ||
    'User';

  return (
    <main className="container mx-auto py-8 px-4">
      <div className="bg-white dark:bg-slate-800 p-6 rounded-lg shadow-md border dark:border-slate-700 flex items-center gap-6 mb-8">
        <Image
          src={
            user?.customAvatarDataUrl ||
            user?.image ||
            '/images/avatar-default.png'
          }
          alt={`${displayName}'s Avatar`}
          width={160}
          height={160}
          className="rounded-full object-cover border-2 border-slate-300 dark:border-slate-600"
        />

        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100">
            {displayName}
          </h1>

          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Member since{' '}
            {user?.createdAt
              ? format(new Date(user.createdAt), 'MMMM d, yyyy')
              : 'N/A'}
          </p>

          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Height ({heightUnit}): {heightDisplay} · Weight ({weightUnit}):{' '}
            {weightDisplay}
          </p>
        </div>
      </div>
    </main>
  );
}
