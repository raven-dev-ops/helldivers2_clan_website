// src/app/actions/forumActions.ts
"use server";

import { z } from "zod";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/authOptions";
import mongoose from "mongoose";
import dbConnect from "@/lib/dbConnect";
import ForumThreadModel from "@/models/ForumThread";
import ForumPostModel from "@/models/ForumPost";
import UserModel from "@/models/User";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import createDOMPurify from "isomorphic-dompurify";
import { JSDOM } from "jsdom";

// ---- Server-side DOMPurify setup ----
const windowForPurify = new JSDOM("").window;
const DOMPurify = createDOMPurify(windowForPurify);

// --- Validation Schemas ---
const EditPostSchema = z.object({
  postId: z.string().refine((val) => mongoose.Types.ObjectId.isValid(val)),
  content: z.string().trim().min(10).max(10000),
});

const DeletePostSchema = z.object({
  postId: z.string().refine((val) => mongoose.Types.ObjectId.isValid(val)),
});

const EditThreadSchema = z.object({
  threadId: z.string().refine((val) => mongoose.Types.ObjectId.isValid(val)),
  title: z.string().trim().min(5).max(150),
});

const DeleteThreadSchema = z.object({
  threadId: z.string().refine((val) => mongoose.Types.ObjectId.isValid(val)),
});

// --- Edit Post Action ---
export async function editPost(prevState: any, formData: FormData) {
  await dbConnect();
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return { status: 'error', message: 'Authentication required.' };

  const validation = EditPostSchema.safeParse({
    postId: formData.get('postId'),
    content: formData.get('content'),
  });

  if (!validation.success) {
    return {
      status: 'error',
      message: 'Invalid input.',
      errors: validation.error.flatten().fieldErrors,
    };
  }

  const { postId, content } = validation.data;
  const userId = new mongoose.Types.ObjectId(session.user.id);

  try {
    const post = await ForumPostModel.findById(postId);
    if (!post) return { status: 'error', message: 'Post not found.' };

    // --- Permission Check ---
    const user = await UserModel.findById(userId);
    const isAdmin = user?.role === 'admin';
    if (!post.authorId?.equals(userId) && !isAdmin) {
      return { status: 'error', message: 'Permission denied.' };
    }
    // --- End Permission Check ---

    // Sanitize user input
    const sanitizedContent = DOMPurify.sanitize(content);
    post.content = sanitizedContent;
    await post.save();

    revalidatePath(`/forum/[categoryId]/${post.threadId}`, 'page');
    return { status: 'success', message: 'Post updated!' };

  } catch (error) {
    console.error("Error editing post:", error);
    return { status: 'error', message: 'Database error editing post.' };
  }
}

// --- Delete Post Action ---
export async function deletePost(prevState: any, formData: FormData) {
  await dbConnect();
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return { status: 'error', message: 'Authentication required.' };

  const validation = DeletePostSchema.safeParse({ postId: formData.get('postId') });
  if (!validation.success) return { status: 'error', message: 'Invalid Post ID.' };

  const { postId } = validation.data;
  const userId = new mongoose.Types.ObjectId(session.user.id);

  try {
    const post = await ForumPostModel.findById(postId);
    if (!post) return { status: 'error', message: 'Post not found.' };

    // --- Permission Check ---
    const user = await UserModel.findById(userId);
    const isAdmin = user?.role === 'admin';
    if (!post.authorId?.equals(userId) && !isAdmin) {
      return { status: 'error', message: 'Permission denied.' };
    }

    await ForumPostModel.findByIdAndDelete(postId);
    await ForumThreadModel.findByIdAndUpdate(post.threadId, { $inc: { replyCount: -1 } });

    revalidatePath(`/forum/[categoryId]/${post.threadId}`, 'page');
    return { status: 'success', message: 'Post deleted.' };

  } catch (error) {
    console.error("Error deleting post:", error);
    return { status: 'error', message: 'Database error deleting post.' };
  }
}

// --- Delete Thread Action ---
export async function deleteThread(prevState: any, formData: FormData) {
  await dbConnect();
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return { status: 'error', message: 'Authentication required.' };

  const validation = DeleteThreadSchema.safeParse({ threadId: formData.get('threadId') });
  if (!validation.success) return { status: 'error', message: 'Invalid Thread ID.' };

  const { threadId } = validation.data;
  const userId = new mongoose.Types.ObjectId(session.user.id);
  const threadObjectId = new mongoose.Types.ObjectId(threadId);

  try {
    const thread = await ForumThreadModel.findById(threadObjectId);
    if (!thread) return { status: 'error', message: 'Thread not found.' };

    // --- Permission Check (Author or Admin/Mod) ---
    const user = await UserModel.findById(userId);
    const canDelete = user?.role === 'admin' || user?.role === 'moderator';
    if (!thread.authorId?.equals(userId) && !canDelete) {
      return { status: 'error', message: 'Permission denied.' };
    }

    await ForumPostModel.deleteMany({ threadId: threadObjectId });
    await ForumThreadModel.findByIdAndDelete(threadObjectId);

    revalidatePath(`/forum/${thread.categoryId}`);
    revalidatePath('/forum');

    redirect(`/forum/${thread.categoryId}`);

  } catch (error) {
    console.error("Error deleting thread:", error);
    return { status: 'error', message: 'Database error deleting thread.' };
  }
}

// TODO: Implement editThread similarly...
export async function editThread(prevState: any, formData: FormData) {
  await dbConnect();
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return { status: 'error', message: 'Authentication required.' };

  const validation = EditThreadSchema.safeParse({
    threadId: formData.get('threadId'),
    title: formData.get('title'),
  });

  if (!validation.success) {
    return {
      status: 'error',
      message: 'Invalid input.',
      errors: validation.error.flatten().fieldErrors,
    };
  }

  const { threadId, title } = validation.data;
  const userId = new mongoose.Types.ObjectId(session.user.id);
  const threadObjectId = new mongoose.Types.ObjectId(threadId);

  try {
    const thread = await ForumThreadModel.findById(threadObjectId);
    if (!thread) return { status: 'error', message: 'Thread not found.' };

    // --- Permission Check (Author or Admin/Mod) ---
    const user = await UserModel.findById(userId);
    const canEdit = user?.role === 'admin' || user?.role === 'moderator';
    if (!thread.authorId?.equals(userId) && !canEdit) {
      return { status: 'error', message: 'Permission denied.' };
    }

    // Sanitize user input
    const sanitizedTitle = DOMPurify.sanitize(title);
    thread.title = sanitizedTitle;
    await thread.save();

    revalidatePath(`/forum/[categoryId]/${threadId}`, 'page');
    revalidatePath(`/forum/${thread.categoryId}`);
    return { status: 'success', message: 'Thread updated!' };

  } catch (error) {
    console.error("Error editing thread:", error);
    return { status: 'error', message: 'Database error editing thread.' };
  }
}
