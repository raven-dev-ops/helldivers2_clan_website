// src/app/(main)/helldivers-2/forum/[categoryId]/[threadId]/page.tsx (Updated)
import Link from 'next/link';
import { notFound } from 'next/navigation';
import mongoose from 'mongoose';
import Image from 'next/image';
import dbConnect from '@/lib/dbConnect';
import ForumThreadModel, { IForumThread } from '@/models/ForumThread';
import ForumPostModel, { IForumPost } from '@/models/ForumPost';
import UserModel, { IUser } from '@/models/User';
import * as DOMPurify from 'isomorphic-dompurify';
import { formatDistanceToNow } from 'date-fns';
import { getServerSession } from "next-auth/next"; // For checking login status
import { authOptions } from "@/app/api/auth/[...nextauth]/route"; // Adjust path
import ReplyForm from '@/components/forum/ReplyForm'; // Import Reply Form
import PaginationControls from '@/components/forum/PaginationControls'; // Import Pagination

const POSTS_PER_PAGE = 10; // Configurable

interface ThreadPageProps {
  params: {
    categoryId: string;
    threadId: string;
  };
   searchParams?: { // For pagination
    page?: string;
  };
}

// Updated Helper types
type PopulatedPost = Omit<IForumPost, 'authorId' | 'threadId'> & {
    _id: string;
    authorId: Pick<IUser, '_id' | 'name' | 'image'> | null;
    createdAt: string | Date; // Allow string after JSON parse
};
type PopulatedThreadData = Omit<IForumThread, 'authorId' | 'categoryId'> & {
    _id: string;
    categoryId: string; // Ensure string for comparison
    authorId: Pick<IUser, '_id' | 'name' | 'image'> | null;
    categoryName?: string;
};

async function getThreadData(threadId: string, page: number): Promise<{
    thread: PopulatedThreadData | null;
    posts: PopulatedPost[];
    totalPosts: number;
}> {
  if (!mongoose.Types.ObjectId.isValid(threadId)) {
    return { thread: null, posts: [], totalPosts: 0 };
  }

  await dbConnect();
  try {
    const skipAmount = (page - 1) * POSTS_PER_PAGE;

    const [thread, posts, totalPosts] = await Promise.all([
      ForumThreadModel.findById(threadId)
        .populate<{ authorId: Pick<IUser, '_id' | 'name' | 'image'> | null }>('authorId', 'name image')
        .lean(),
      ForumPostModel.find({ threadId: threadId })
        .sort({ createdAt: 1 }) // Chronological
        .skip(skipAmount)
        .limit(POSTS_PER_PAGE)
        .populate<{ authorId: Pick<IUser, '_id' | 'name' | 'image'> | null }>('authorId', 'name image')
        .lean(),
      ForumPostModel.countDocuments({ threadId: threadId })
    ]);

    if (!thread) {
      return { thread: null, posts: [], totalPosts: 0 };
    }

    // Ensure categoryId is string for comparison
    const serializableThread = {
        ...thread,
        categoryId: thread.categoryId.toString(),
    };

    return JSON.parse(JSON.stringify({ thread: serializableThread, posts, totalPosts }));

  } catch (error) {
    console.error(`Failed to fetch data for thread ${threadId}:`, error);
    return { thread: null, posts: [], totalPosts: 0 };
  }
}


export default async function ThreadPage({ params, searchParams }: ThreadPageProps) {
  const { categoryId, threadId } = params;
  const currentPage = Number(searchParams?.page) || 1;
  const session = await getServerSession(authOptions); // Get session server-side

  const { thread, posts, totalPosts } = await getThreadData(threadId, currentPage);

  if (!thread) {
    notFound();
  }

  if (thread.categoryId !== categoryId) {
      console.warn(`Thread ${threadId} accessed via incorrect category ${categoryId}. Actual: ${thread.categoryId}`);
      // Redirect or notFound() if strict routing needed
  }

  const totalPages = Math.ceil(totalPosts / POSTS_PER_PAGE);

  return (
    <main className="container mx-auto py-8 px-4 text-slate-900 dark:text-slate-100">
       {/* Breadcrumbs */}
       <div className="mb-4 text-sm text-slate-500 dark:text-slate-400">
          <Link href="/forum" className="hover:underline">Forum</Link>
          {' > '}
          {/* Need category name - fetch separately or pass via thread? */}
          <Link href={`/forum/${categoryId}`} className="hover:underline">Category</Link>
          {' > '}
          <span className="truncate inline-block max-w-xs sm:max-w-md align-middle">{thread.title}</span>
      </div>

      {/* Thread Title & Reply Button */}
      <div className="flex flex-wrap justify-between items-start gap-4 mb-6 border-b border-slate-300 dark:border-slate-700 pb-3">
        <h1 className="text-2xl lg:text-3xl font-bold flex-grow mr-4 break-words">
          {thread.title}
        </h1>
         <button
            type="button"
            onClick={() => {
                // Basic scroll to reply form
                document.getElementById('reply-section')?.scrollIntoView({ behavior: 'smooth' });
            }}
            className="bg-blue-600 text-white py-2 px-4 rounded font-semibold hover:bg-blue-700 dark:hover:bg-blue-500 text-sm transition duration-150 flex-shrink-0">
             Reply
         </button>
      </div>

        {/* Pagination (Top) */}
       <PaginationControls
            currentPage={currentPage}
            totalPages={totalPages}
            basePath={`/forum/${categoryId}/${threadId}`}
            className="mb-6"
        />

      {/* Posts List */}
      {posts.length > 0 ? (
        <div className="space-y-6">
            {posts.map((post, index) => (
            <article key={post._id} id={`post-${post._id}`} className="flex flex-col sm:flex-row gap-4 p-4 bg-slate-50 dark:bg-slate-800/50 rounded-lg border border-slate-200 dark:border-slate-700 shadow-sm">
                {/* Author Info */}
                <aside className="flex-shrink-0 w-full sm:w-36 md:w-48 text-center sm:text-left border-b sm:border-b-0 sm:border-r border-slate-200 dark:border-slate-700 pb-3 sm:pb-0 sm:pr-4">
                    <div className="flex flex-row sm:flex-col items-center sm:items-start gap-3">
                    <Image
                        src={post.authorId?.image || '/images/default-avatar.png'}
                        alt={post.authorId ? `${post.authorId.name}'s Avatar` : 'User Avatar'}
                        width={64} height={64} className="rounded-full object-cover flex-shrink-0"
                    />
                    <div className="flex-grow">
                        <p className="font-semibold text-blue-700 dark:text-blue-400 break-words">
                        {post.authorId?.name ?? 'Unknown User'}
                        </p>
                    </div>
                    </div>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 pt-2 border-t border-slate-200 dark:border-slate-700 sm:border-t-0">
                    {post.createdAt ? `Posted ${formatDistanceToNow(new Date(post.createdAt), { addSuffix: true })}` : ''}
                    </p>
                    <Link href={`#post-${post._id}`} className="text-xs text-slate-400 hover:underline block mt-1" aria-label={`Link to post number ${(currentPage - 1) * POSTS_PER_PAGE + index + 1}`}>
                        # {(currentPage - 1) * POSTS_PER_PAGE + index + 1}
                    </Link>
                </aside>
                {/* Post Content */}
                <div
                    className="flex-grow prose prose-sm dark:prose-invert max-w-none prose-img:rounded-md prose-img:max-w-full prose-a:text-blue-600 dark:prose-a:text-blue-400 hover:prose-a:underline prose-blockquote:border-l-blue-500 dark:prose-blockquote:border-l-blue-400 prose-code:before:content-none prose-code:after:content-none"
                    dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(post.content || '') }}
                />
            </article>
            ))}
        </div>
       ) : (
         <p className="text-slate-600 dark:text-slate-400 py-6 text-center">No posts found in this thread yet.</p>
       )}

        {/* Pagination (Bottom) */}
       <PaginationControls
            currentPage={currentPage}
            totalPages={totalPages}
            basePath={`/forum/${categoryId}/${threadId}`}
            className="mt-8"
        />


      {/* Reply Form Section */}
      <section id="reply-section" className="mt-12 pt-6 border-t border-slate-300 dark:border-slate-700 scroll-mt-20"> {/* scroll-mt for scrollIntoView offset */}
          <h2 className="text-xl font-semibold mb-4">Post a Reply</h2>
          {session?.user ? (
             <ReplyForm threadId={threadId} />
          ) : (
             <div className="p-6 bg-slate-100 dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 text-center">
                <p className="text-slate-600 dark:text-slate-400">
                    You must be{' '}
                     <Link href={`/api/auth/signin?callbackUrl=/forum/${categoryId}/${threadId}`} className="text-blue-600 hover:underline">
                        signed in
                    </Link>
                    {' '}to post a reply.
                </p>
             </div>
          )}
      </section>
    </main>
  );
}