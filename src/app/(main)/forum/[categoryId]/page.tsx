// src/app/(main)/forum/[categoryId]/page.tsx (Updated)
import Link from 'next/link';
import { notFound } from 'next/navigation';
import mongoose from 'mongoose';
import dbConnect from '@/lib/dbConnect';
import ForumCategoryModel, { IForumCategory } from '@/models/ForumCategory';
import ForumThreadModel, { IForumThread } from '@/models/ForumThread';
import UserModel, { IUser } from '@/models/User';
import * as DOMPurify from 'isomorphic-dompurify';
import { formatDistanceToNow } from 'date-fns';
import PaginationControls from '@/components/forum/PaginationControls'; // Create this component

const THREADS_PER_PAGE = 15; // Configurable

interface CategoryPageProps {
  params: {
    categoryId: string;
  };
  searchParams?: { // For pagination
    page?: string;
  };
}

// Updated Helper type
type PopulatedThread = Omit<IForumThread, 'authorId'> & {
    _id: string;
    authorId: Pick<IUser, '_id' | 'name' | 'image'> | null;
    replyCount: number;
    lastActivity: Date | string; // Allow string after JSON parse
    createdAt: Date | string;
};

async function getCategoryData(categoryId: string, page: number): Promise<{
    category: (IForumCategory & { _id: string }) | null;
    threads: PopulatedThread[];
    totalThreads: number;
}> {
  if (!mongoose.Types.ObjectId.isValid(categoryId)) {
    return { category: null, threads: [], totalThreads: 0 };
  }

  await dbConnect();
  try {
    const skipAmount = (page - 1) * THREADS_PER_PAGE;

    // Fetch category, threads, and total count concurrently
    const [category, threads, totalThreads] = await Promise.all([
      ForumCategoryModel.findById(categoryId).lean(),
      ForumThreadModel.find({ categoryId: categoryId })
        .sort({ lastActivity: -1 }) // Sort by most recent activity
        .skip(skipAmount)
        .limit(THREADS_PER_PAGE)
        .populate<{ authorId: Pick<IUser, '_id' | 'name'> | null }>('authorId', 'name')
        .lean(),
      ForumThreadModel.countDocuments({ categoryId: categoryId })
    ]);

    if (!category) {
      return { category: null, threads: [], totalThreads: 0 };
    }

    return JSON.parse(JSON.stringify({ category, threads, totalThreads }));

  } catch (error) {
    console.error(`Failed to fetch data for category ${categoryId}:`, error);
    return { category: null, threads: [], totalThreads: 0 };
  }
}

export default async function CategoryPage({ params, searchParams }: CategoryPageProps) {
  const { categoryId } = params;
  const currentPage = Number(searchParams?.page) || 1;
  const { category, threads, totalThreads } = await getCategoryData(categoryId, currentPage);

  if (!category) {
    notFound();
  }

  const totalPages = Math.ceil(totalThreads / THREADS_PER_PAGE);

  return (
    <main className="container mx-auto py-8 px-4 text-slate-900 dark:text-slate-100">
      {/* Breadcrumbs */}
      <div className="mb-4 text-sm text-slate-500 dark:text-slate-400">
          <Link href="/forum" className="hover:underline">Forum</Link>
          {' > '}
          <span>{category.name}</span>
      </div>

      <div className="flex flex-wrap justify-between items-center gap-4 mb-6 border-b border-slate-300 dark:border-slate-700 pb-3">
        <div>
            <h1 className="text-3xl font-bold">{category.name}</h1>
            {category.description && (
                <p className="mt-1 text-sm text-slate-600 dark:text-slate-400"
                   dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(category.description) }} />
            )}
        </div>
         {/* Create Thread Button */}
         <Link href={`/forum/${categoryId}/new-thread`}
            className="bg-blue-600 text-white py-2 px-4 rounded font-semibold hover:bg-blue-700 dark:hover:bg-blue-500 text-sm transition duration-150 whitespace-nowrap">
             Create New Thread
         </Link>
      </div>

      {threads.length === 0 ? (
        <p className="text-slate-600 dark:text-slate-400 py-6 text-center">No threads found in this category yet.</p>
      ) : (
        <>
          {/* Header Row (Optional) */}
          <div className="hidden md:flex px-3 py-2 text-xs font-semibold text-slate-500 dark:text-slate-400 border-b dark:border-slate-700 mb-2">
              <div className="flex-grow">Thread / Author</div>
              <div className="w-20 text-center">Replies</div>
              <div className="w-40 text-right">Last Activity</div>
          </div>

          {/* Threads List */}
          <div className="space-y-2">
            {threads.map((thread) => (
              <Link
                href={`/forum/${categoryId}/${thread._id}`}
                key={thread._id}
                className="flex flex-col md:flex-row items-start md:items-center gap-2 md:gap-4 p-3 bg-slate-100 dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-200 dark:hover:bg-slate-700/60 transition duration-150 ease-in-out shadow-sm hover:shadow-md"
              >
                <div className="flex-grow">
                  <h2 className="text-lg font-medium text-blue-600 dark:text-blue-400 break-words">
                    {thread.title}
                  </h2>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                    by {thread.authorId?.name ?? 'Unknown User'}
                    {' · '}
                    {formatDistanceToNow(new Date(thread.createdAt), { addSuffix: true })}
                  </p>
                </div>
                <div className="w-full md:w-20 text-left md:text-center text-sm flex-shrink-0">
                    <span className="md:hidden font-semibold">Replies: </span>
                    {thread.replyCount ?? 0}
                </div>
                 <div className="w-full md:w-40 text-left md:text-right text-xs text-slate-500 dark:text-slate-400 flex-shrink-0">
                     <span className="md:hidden font-semibold">Last Activity: </span>
                     {formatDistanceToNow(new Date(thread.lastActivity), { addSuffix: true })}
                 </div>
              </Link>
            ))}
          </div>

          {/* Pagination */}
          <PaginationControls
              currentPage={currentPage}
              totalPages={totalPages}
              basePath={`/forum/${categoryId}`}
           />
        </>
      )}
    </main>
  );
}