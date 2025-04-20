// src/app/(main)/forum/[categoryId]/[threadId]/page.tsx
import Link from 'next/link';
import { notFound } from 'next/navigation';
import mongoose from 'mongoose';
import Image from 'next/image';
import dbConnect from '@/lib/dbConnect'; // Adjust path if needed
import ForumThreadModel, { IForumThread } from '@/models/ForumThread'; // Adjust path
import ForumPostModel, { IForumPost } from '@/models/ForumPost'; // Adjust path
import UserModel, { IUser } from '@/models/User'; // Adjust path

// --- Correct Import for isomorphic-dompurify ---
import DOMPurify from 'isomorphic-dompurify';
// --- Correct Import for date-fns ---
import { formatDistanceToNow } from 'date-fns';

interface ThreadPageProps {
  params: {
    categoryId: string;
    threadId: string;
  };
}

// Helper types (keep as before)
type PopulatedPost = Omit<IForumPost, 'authorId'> & {
    _id: string;
    authorId: Pick<IUser, '_id' | 'name' | 'image'> | null;
};
type PopulatedThreadData = Omit<IForumThread, 'authorId'> & {
    _id: string;
    authorId: Pick<IUser, '_id' | 'name' | 'image'> | null;
    categoryName?: string;
};

// getThreadData function (keep as before)
async function getThreadData(threadId: string): Promise<{
    thread: PopulatedThreadData | null;
    posts: PopulatedPost[];
}> {
  if (!mongoose.Types.ObjectId.isValid(threadId)) {
    return { thread: null, posts: [] };
  }

  await dbConnect();
  try {
    const [thread, posts] = await Promise.all([
      ForumThreadModel.findById(threadId)
        .populate<{ authorId: Pick<IUser, '_id' | 'name' | 'image'> | null }>('authorId', 'name image')
        .lean(),
      ForumPostModel.find({ threadId: threadId })
        .sort({ createdAt: 1 })
        .populate<{ authorId: Pick<IUser, '_id' | 'name' | 'image'> | null }>('authorId', 'name image')
        .lean()
    ]);

    if (!thread) {
      return { thread: null, posts: [] };
    }
    // Ensure data is plain objects before returning from server component boundary if needed
    return JSON.parse(JSON.stringify({ thread, posts }));

  } catch (error) {
    console.error(`Failed to fetch data for thread ${threadId}:`, error);
    return { thread: null, posts: [] };
  }
}


// --- Page Component ---
export default async function ThreadPage({ params }: ThreadPageProps) {
  const { categoryId, threadId } = params;
  const { thread, posts } = await getThreadData(threadId);

  if (!thread) {
    notFound();
  }

  // Optional check if thread belongs to category
  if (thread.categoryId.toString() !== categoryId) {
      console.warn(`Thread ${threadId} accessed via incorrect category ${categoryId}`);
      // notFound(); // Or redirect
  }

  return (
    <main className="container mx-auto py-8 px-4 text-slate-900 dark:text-slate-100">
       {/* Breadcrumbs */}
       <div className="mb-4 text-sm text-slate-500 dark:text-slate-400">
          <Link href="/forum" className="hover:underline">Forum</Link>
          {' > '}
          {/* Fetch category name separately if needed for breadcrumb */}
          <Link href={`/forum/${categoryId}`} className="hover:underline">Category</Link>
          {' > '}
          {/* Truncate long titles */}
          <span className="truncate inline-block max-w-xs sm:max-w-md align-middle">{thread.title}</span>
      </div>

      {/* Thread Title & Reply Button */}
      <div className="flex justify-between items-start mb-6 border-b border-slate-300 dark:border-slate-700 pb-3">
        <h1 className="text-2xl lg:text-3xl font-bold flex-grow mr-4 break-words">
          {thread.title}
        </h1>
         <button
            type="button"
            // TODO: Implement reply functionality
            className="bg-blue-600 text-white py-2 px-4 rounded font-semibold hover:bg-blue-700 dark:hover:bg-blue-500 text-sm transition duration-150 flex-shrink-0">
             Reply
         </button>
      </div>

      {/* Posts List */}
      <div className="space-y-6">
        {posts.map((post, index) => (
          <article key={post._id} id={`post-${post._id}`} className="flex flex-col sm:flex-row gap-4 p-4 bg-slate-50 dark:bg-slate-800/50 rounded-lg border border-slate-200 dark:border-slate-700 shadow-sm">
            {/* Author Info Sidebar */}
            <aside className="flex-shrink-0 w-full sm:w-36 md:w-48 text-center sm:text-left border-b sm:border-b-0 sm:border-r border-slate-200 dark:border-slate-700 pb-3 sm:pb-0 sm:pr-4">
              <div className="flex flex-row sm:flex-col items-center sm:items-start gap-3">
                <Image
                  src={post.authorId?.image || '/images/default-avatar.png'} // Provide a fallback avatar
                  alt={post.authorId ? `${post.authorId.name}'s Avatar` : 'User Avatar'}
                  width={64}
                  height={64}
                  className="rounded-full object-cover flex-shrink-0" // Prevent image shrinking strangely
                />
                <div className="flex-grow">
                    <p className="font-semibold text-blue-700 dark:text-blue-400 break-words">
                      {post.authorId?.name ?? 'Unknown User'}
                    </p>
                    {/* Placeholder for User Title/Role */}
                    {/* <p className="text-xs text-slate-500 dark:text-slate-400">Galactic Recruit</p> */}
                </div>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 pt-2 border-t border-slate-200 dark:border-slate-700 sm:border-t-0">
                 {post.createdAt ? `Posted ${formatDistanceToNow(new Date(post.createdAt), { addSuffix: true })}` : ''}
              </p>
               <Link href={`#post-${post._id}`} className="text-xs text-slate-400 hover:underline block mt-1" aria-label={`Link to post number ${index + 1}`}>
                   # {index + 1}
               </Link>
            </aside>

            {/* Post Content */}
            <div
                className="flex-grow prose prose-sm dark:prose-invert max-w-none prose-img:rounded-md prose-img:max-w-full prose-a:text-blue-600 dark:prose-a:text-blue-400 hover:prose-a:underline prose-blockquote:border-l-blue-500 dark:prose-blockquote:border-l-blue-400 prose-code:before:content-none prose-code:after:content-none"
                // --- Correct Usage of isomorphic-dompurify ---
                dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(post.content || '') }} // Use default import's sanitize method
                // --- End Correct Usage ---
            />
          </article>
        ))}
        {/* TODO: Add Pagination for Posts */}
      </div>

      {/* Reply Form Placeholder */}
      <section className="mt-12 pt-6 border-t border-slate-300 dark:border-slate-700">
          <h2 className="text-xl font-semibold mb-4">Post a Reply</h2>
          {/* TODO: Add a Post Reply Form Component (needs to be a Client Component) */}
          <div className="p-6 bg-slate-100 dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700">
            <p className="text-slate-500 dark:text-slate-400 text-center">
              Replying requires a form component.
            </p>
          </div>
      </section>
    </main>
  );
}