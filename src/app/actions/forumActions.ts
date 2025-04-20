// src/app/actions/forumActions.ts (Additions)
"use server";

import { z } from "zod";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import mongoose from 'mongoose';
import dbConnect from "@/lib/dbConnect";
import ForumThreadModel from "@/models/ForumThread";
import ForumPostModel from "@/models/ForumPost";
import UserModel from "@/models/User"; // Assuming User model has roles
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import * as DOMPurify from 'isomorphic-dompurify';

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
    // Optional: Allow editing first post content? More complex.
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

    if (!validation.success) return { status: 'error', message: 'Invalid input.', errors: validation.error.flatten().fieldErrors };

    const { postId, content } = validation.data;
    const userId = new mongoose.Types.ObjectId(session.user.id);

    try {
        const post = await ForumPostModel.findById(postId);
        if (!post) return { status: 'error', message: 'Post not found.' };

        // --- Permission Check ---
        // Example: Check if user is author OR has admin role
        const user = await UserModel.findById(userId); // Fetch user role if needed
        const isAdmin = user?.role === 'admin'; // Assuming 'role' field exists
        if (!post.authorId?.equals(userId) && !isAdmin) {
             return { status: 'error', message: 'Permission denied.' };
        }
        // --- End Permission Check ---

        const sanitizedContent = DOMPurify.sanitize(content);
        post.content = sanitizedContent;
        // Optionally add an editedAt timestamp
        // post.editedAt = new Date();
        await post.save();

        revalidatePath(`/forum/[categoryId]/${post.threadId}`, 'page'); // Revalidate thread page
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
        const isAdmin = user?.role === 'admin'; // || user?.role === 'moderator';
        if (!post.authorId?.equals(userId) && !isAdmin) {
             return { status: 'error', message: 'Permission denied.' };
        }
         // Prevent deleting the *first* post? Usually deleting the thread is required.
         // const firstPost = await ForumPostModel.findOne({ threadId: post.threadId }).sort({ createdAt: 1 });
         // if (firstPost?._id.equals(post._id)) return { status: 'error', message: 'Cannot delete the first post of a thread.' };
        // --- End Permission Check ---

         // Decrement reply count on thread (only if not first post - complex logic)
        // Consider soft delete instead: add 'isDeleted: true' flag

        await ForumPostModel.findByIdAndDelete(postId);

        // Update thread stats if needed (decrement replyCount, maybe update lastActivity)
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
        const canDelete = user?.role === 'admin' || user?.role === 'moderator'; // Example roles
        if (!thread.authorId?.equals(userId) && !canDelete) {
             return { status: 'error', message: 'Permission denied.' };
        }
        // --- End Permission Check ---

        // Delete all posts within the thread first (important!)
        await ForumPostModel.deleteMany({ threadId: threadObjectId });

        // Delete the thread itself
        await ForumThreadModel.findByIdAndDelete(threadObjectId);

        // Revalidate relevant pages
        revalidatePath(`/forum/${thread.categoryId}`);
        revalidatePath('/forum');

        // Redirect after successful deletion
        redirect(`/forum/${thread.categoryId}`);

    } catch (error) {
        console.error("Error deleting thread:", error);
        return { status: 'error', message: 'Database error deleting thread.' };
    }
}

// Implement editThread similarly...