// src/app/(main)/forum/[categoryId]/page.tsx
import Link from 'next/link';
import { notFound } from 'next/navigation';
import mongoose from 'mongoose';
import dbConnect from '@/lib/dbConnect';
import ForumCategoryModel, { IForumCategory } from '@/models/ForumCategory';
import ForumThreadModel, { IForumThread } from '@/models/ForumThread';
import UserModel, { IUser } from '@/models/User'; // Assuming User model exists
import { sanitize } from 'isomorphic-dompurify';
import { formatDistanceToNow } from 'date-fns'; // For relative time formatting

interface CategoryPageProps {
  params: {
    categoryId: string;
  };
}

// Helper type for populated thread
type PopulatedThread = Omit<IForumThread, 'authorId'> & {
    _id: string;
    authorId: Pick<IUser, '_id' | 'name' | 'image'> | null; // Select fields needed
    // Add reply count / last post info if needed in schema/query
    replyCount?: number; // Example
    lastActivity?: Date; // Example
};

async function getCategoryData(categoryId: string): Promise<{
    category: (IForumCategory & { _id: string }) | null;
    threads: PopulatedThread[];
}> {
  if (!mongoose.Types.ObjectId.isValid(categoryId)) {
    return { category: null, threads: [] };
  }

  await dbConnect();
  try {
    // Fetch category and threads concurrently
    const [category, threads] = await Promise.all([
      ForumCategoryModel.findById(categoryId).lean(),
      ForumThreadModel.find({ categoryId: categoryId })
        .sort({ updatedAt: -1 }) // Show recently updated threads first
        .populate<{ authorId: Pick<IUser, '_id' | 'name'> | null }>('authorId', 'name') // Populate author name only
        .lean()
        // TODO: Add population/aggregation for reply count and last post info later
    ]);

    if (!category) {
        return { category: null, threads: [] };
    }

    // Basic serialization check
    return JSON.parse(JSON.stringify({ category, threads }));

  } catch (error) {
    console.error(`Failed to fetch data for category ${categoryId}:`, error);
    return { category: null, threads: [] }; // Return empty on error
  }
}


export default async function CategoryPage({ params }: CategoryPageProps) {
  const { categoryId } = params;
  const { category, threads } = await getCategoryData(categoryId);

  if (!category) {
    notFound(); // Trigger 404 page if category doesn't exist
  }

  return (
    <main className="container mx-auto py-8 px-4 text-slate-900 dark:text-slate-100">
      {/* Breadcrumbs */}
      <div className="mb-4 text-sm text-slate-500 dark:text-slate-400">
          <Link href="/forum" className="hover:underline">Forum</Link>
          {' > '}
          <span>{category.name}</span>
      </div>

      <div className="flex justify-between items-center mb-6 border-b border-slate-300 dark:border-slate-700 pb-2">
        <div>
            <h1 className="text-3xl font-bold">
                {category.name}
            </h1>
            {category.description && (
                <p
                className="mt-1 text-sm text-slate-600 dark:text-slate-400"
                dangerouslySetInnerHTML={{ __html: sanitize(category.description) }}
                />
            )}
        </div>
         {/* Placeholder for Create Thread Button */}
         <Link href={`/forum/${categoryId}/new-thread`} /* Needs page/modal */
            className="bg-blue-600 text-white py-2 px-4 rounded font-semibold hover:bg-blue-700 dark:hover:bg-blue-500 text-sm transition duration-150">
             Create Thread
         </Link>
      </div>

      {threads.length === 0 ? (
        <p className="text-slate-600 dark:text-slate-400 py-6 text-center">
            No threads found in this category yet. Be the first to start one!
        </p>
      ) : (
        <div className="space-y-3">
          {threads.map((thread) => (
            <Link
              href={`/forum/${categoryId}/${thread._id}`}
              key={thread._id}
              className="flex items-center p-3 bg-slate-100 dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-200 dark:hover:bg-slate-700/60 transition duration-150 ease-in-out shadow-sm hover:shadow-md"
            >
              {/* TODO: Add icon based on thread status (sticky, locked, etc.) */}
              <div className="flex-grow">
                <h2 className="text-lg font-medium text-blue-600 dark:text-blue-400">
                  {thread.title}
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  Started by {thread.authorId?.name ?? 'Unknown User'}
                  {thread.updatedAt && (
                     <>
                      {' · '}
                      Last activity {formatDistanceToNow(new Date(thread.updatedAt), { addSuffix: true })}
                     </>
                  )}
                </p>
              </div>
              <div className="text-right text-sm ml-4 flex-shrink-0">
                 {/* TODO: Display Reply Count and Views */}
                {/* <p>Replies: {thread.replyCount ?? 0}</p> */}
                {/* <p>Views: ...</p> */}
                <span className="text-slate-500 dark:text-slate-400 text-xs block">{new Date(thread.createdAt!).toLocaleDateString()}</span>
              </div>
            </Link>
          ))}
          {/* TODO: Add Pagination */}
        </div>
      )}
    </main>
  );
}

// Optional: Generate static paths if categories don't change often
// export async function generateStaticParams() { ... }