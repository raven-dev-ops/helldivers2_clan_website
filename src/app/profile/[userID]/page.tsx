// src/app/(main)/profile/[userId]/page.tsx
import mongoose from 'mongoose';
import dbConnect from '@/lib/dbConnect';
import UserModel, { IUser } from '@/models/User';
import ForumThreadModel from '@/models/ForumThread';
import ForumPostModel from '@/models/ForumPost';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { format } from 'date-fns';

async function getUserProfile(userId: string) {
  if (!mongoose.Types.ObjectId.isValid(userId)) return null;
  await dbConnect();

  try {
    const user = await UserModel.findById(userId).lean();
    if (!user) return null;

    const recentThreads = await ForumThreadModel
      .find({ authorId: userId })
      .sort({ createdAt: -1 })
      .limit(5)
      .select('title categoryId createdAt')
      .lean();

    return JSON.parse(JSON.stringify({ user, recentThreads }));
  } catch (error) {
    console.error('Error fetching profile:', error);
    return null;
  }
}

export default async function ProfilePage(
  { params }: { params: Promise<{ userId: string }> }
) {
  const { userId } = await params;
  const profileData = await getUserProfile(userId);

  if (!profileData) {
    notFound();
  }

  const { user, recentThreads } = profileData;

  return (
    <main className="container mx-auto py-8 px-4">
      <div className="bg-white dark:bg-slate-800 p-6 rounded-lg shadow-md border dark:border-slate-700 flex items-center gap-6 mb-8">
        <Image
          src={user.image || '/images/default-avatar.png'}
          alt={`${user.name}'s Avatar`}
          width={100}
          height={100}
          className="rounded-full object-cover border-2 border-slate-300 dark:border-slate-600"
        />
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100">
            {user.name || 'User'}
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Member since:{' '}
            {user.createdAt
              ? format(new Date(user.createdAt), 'MMMM d, yyyy')
              : 'N/A'}
          </p>
        </div>
      </div>

      <h2 className="text-2xl font-semibold mb-4 text-slate-900 dark:text-slate-100">
        Recent Threads
      </h2>
      {recentThreads.length > 0 ? (
        <ul className="space-y-2">
          {recentThreads.map((thread: any) => (
            <li
              key={thread._id}
              className="p-2 bg-slate-100 dark:bg-slate-800/50 rounded border dark:border-slate-700"
            >
              <Link
                href={`/forum/${thread.categoryId}/${thread._id}`}
                className="text-blue-600 dark:text-blue-400 hover:underline"
              >
                {thread.title}
              </Link>
              <span className="text-xs text-slate-500 dark:text-slate-400 ml-2">
                ({format(new Date(thread.createdAt), 'MMM d, yyyy')})
              </span>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-slate-600 dark:text-slate-400">
          No threads started yet.
        </p>
      )}

      {/* TODO: Add recent posts section similarly */}
    </main>
  );
}
