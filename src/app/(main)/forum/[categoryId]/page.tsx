// src/app/(main)/forum/[categoryId]/page.tsx
import Link from 'next/link';
import { notFound } from 'next/navigation';
import mongoose from 'mongoose';
import dbConnect from '@/lib/dbConnect'; // Adjust path

// --- Ensure User Model is imported BEFORE models that reference it ---
import UserModel, { IUser } from '@/models/User'; // ADJUST PATH

// --- Import other models ---
import ForumCategoryModel, { IForumCategory } from '@/models/ForumCategory'; // ADJUST PATH
import ForumThreadModel, { IForumThread } from '@/models/ForumThread'; // ADJUST PATH

// --- Import utilities ---
import { formatDistanceToNow } from 'date-fns';
import PaginationControls from '@/components/forum/PaginationControls'; // ADJUST PATH

// --- Use direct dompurify import ---
import DOMPurify from 'dompurify';
// NOTE: If server-side rendering fails with window/document errors,
// more complex handling (like JSDOM wrapper or isomorphic-dompurify debugging) is needed.

// --- Configuration ---
const THREADS_PER_PAGE = 15;

// --- Interfaces & Types ---
interface CategoryPageProps {
  params: { categoryId: string; };
  searchParams?: { page?: string; };
}
// Helper types remain the same as before
type PopulatedThread = Omit<IForumThread, 'authorId' | 'categoryId' | 'createdAt' | 'updatedAt' | 'lastActivity'> & {
    _id: string;
    authorId: Pick<IUser, '_id' | 'name'> | null;
    replyCount: number;
    lastActivity: string;
    createdAt: string;
};
interface CategoryData {
    category: (Omit<IForumCategory, '_id'> & { _id: string }) | null;
    threads: PopulatedThread[];
    totalThreads: number;
}

// --- Data Fetching Function ---
async function getCategoryData(categoryId: string, page: number): Promise<CategoryData> {
  if (!mongoose.Types.ObjectId.isValid(categoryId)) {
    console.warn(`Invalid categoryId format: ${categoryId}`);
    return { category: null, threads: [], totalThreads: 0 };
  }
  try {
    await dbConnect();
    const skipAmount = Math.max(0, (page - 1)) * THREADS_PER_PAGE;
    const [category, threads, totalThreads] = await Promise.all([
      ForumCategoryModel.findById(categoryId).lean(),
      ForumThreadModel.find({ categoryId: categoryId })
        .sort({ isSticky: -1, lastActivity: -1 })
        .skip(skipAmount)
        .limit(THREADS_PER_PAGE)
        .populate<{ authorId: Pick<IUser, '_id' | 'name'> | null }>('authorId', 'name')
        .select('-__v')
        .lean(),
      ForumThreadModel.countDocuments({ categoryId: categoryId })
    ]);
    if (!category) {
      return { category: null, threads: [], totalThreads: 0 };
    }
    return JSON.parse(JSON.stringify({ category, threads, totalThreads }));
  } catch (error) {
    if (error instanceof mongoose.Error.MissingSchemaError) {
        console.error("MissingSchemaError: Ensure UserModel is loaded before ForumThreadModel populates.", error);
    } else if (error instanceof Error) {
        console.error(`Failed to fetch category data ${categoryId}:`, error.message);
    } else {
         console.error(`Unknown error fetching category data ${categoryId}:`, error);
    }
    return { category: null, threads: [], totalThreads: 0 };
  }
}

// --- Page Component ---
export default async function CategoryPage({ params, searchParams }: CategoryPageProps) {
  const { categoryId } = params;
  const currentPage = Math.max(1, Number(searchParams?.page) || 1);
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

      {/* Header */}
      <div className="flex flex-wrap justify-between items-center gap-4 mb-6 border-b border-slate-300 dark:border-slate-700 pb-3">
        <div className="flex-grow">
            <h1 className="text-2xl sm:text-3xl font-bold break-words">{category.name}</h1>
            {category.description && (
                <p className="mt-1 text-sm text-slate-600 dark:text-slate-400 max-w-prose"
                   // --- Use direct DOMPurify import ---
                   dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(category.description || '') }} />
            )}
        </div>
         <Link href={`/forum/${categoryId}/new-thread`}
            className="bg-blue-600 text-white py-2 px-4 rounded font-semibold hover:bg-blue-700 dark:hover:bg-blue-500 text-sm transition duration-150 whitespace-nowrap shadow-sm hover:shadow">
             Create New Thread
         </Link>
      </div>

      {/* Threads List or Not Found Message */}
      {threads.length === 0 ? (
        <p className="text-slate-600 dark:text-slate-400 py-10 text-center text-lg">
            No threads have been created in this category yet.
        </p>
      ) : (
        <>
          {/* Optional Header Row */}
          <div className="hidden md:flex px-3 py-2 text-xs font-semibold text-slate-500 dark:text-slate-400 border-b dark:border-slate-700 mb-2">
              <div className="flex-grow pl-2">Thread / Started By</div>
              <div className="w-20 text-center flex-shrink-0">Replies</div>
              <div className="w-40 text-right flex-shrink-0 pr-2">Last Activity</div>
          </div>

          {/* List of Threads */}
          <div className="space-y-2">
            {threads.map((thread) => (
              <Link
                href={`/forum/${categoryId}/${thread._id}`}
                key={thread._id}
                className="flex flex-col md:flex-row items-start md:items-center gap-2 md:gap-4 p-3 bg-slate-100 dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-200 dark:hover:bg-slate-700/60 transition duration-150 ease-in-out shadow-sm hover:shadow-md focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 dark:focus-visible:ring-blue-400 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-slate-900"
              >
                {/* Thread Info */}
                <div className="flex-grow">
                  <h2 className="text-lg font-medium text-blue-600 dark:text-blue-400 break-words">
                    {thread.title || 'Untitled Thread'}
                  </h2>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                    by {thread.authorId?.name ?? 'Unknown User'}
                    {thread.createdAt && ( <> {' · '} {formatDistanceToNow(new Date(thread.createdAt), { addSuffix: true })} </> )}
                  </p>
                </div>
                {/* Stats */}
                <div className="w-full md:w-20 text-left md:text-center text-sm flex-shrink-0 pt-1 md:pt-0">
                    <span className="md:hidden font-semibold text-xs">Replies: </span>
                    {thread.replyCount ?? 0}
                </div>
                 <div className="w-full md:w-40 text-left md:text-right text-xs text-slate-500 dark:text-slate-400 flex-shrink-0">
                     <span className="md:hidden font-semibold">Last Activity: </span>
                     {thread.lastActivity ? formatDistanceToNow(new Date(thread.lastActivity), { addSuffix: true }) : 'N/A'}
                 </div>
              </Link>
            ))}
          </div>

          {/* Pagination */}
          <PaginationControls
              currentPage={currentPage}
              totalPages={totalPages}
              basePath={`/forum/${categoryId}`}
              className="pt-4"
           />
        </>
      )}
    </main>
  );
}