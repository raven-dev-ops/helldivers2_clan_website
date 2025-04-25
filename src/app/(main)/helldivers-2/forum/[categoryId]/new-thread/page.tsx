// src/app/(main)/helldivers-2/forum/[categoryId]/new-thread/page.tsx
import Link from 'next/link';
import { notFound } from 'next/navigation';
import mongoose from 'mongoose';
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route"; // Adjust path
import dbConnect from '@/lib/dbConnect';
import ForumCategoryModel from '@/models/ForumCategory';
import NewThreadForm from '@/components/forum/NewThreadForm'; // Adjust path

interface NewThreadPageProps {
    params: {
      categoryId: string;
    };
}

// Fetch category name for display
async function getCategoryName(categoryId: string): Promise<string | null> {
    if (!mongoose.Types.ObjectId.isValid(categoryId)) {
        return null;
    }
    await dbConnect();
    try {
        const category = await ForumCategoryModel.findById(categoryId, 'name').lean();
        return category?.name || null;
    } catch (error) {
        console.error("Failed to fetch category name:", error);
        return null;
    }
}

export default async function NewThreadPage({ params }: NewThreadPageProps) {
    const { categoryId } = params;
    const session = await getServerSession(authOptions);

    // Require login to create thread
    if (!session?.user) {
        // Or redirect to login with callbackUrl
        return (
             <main className="container mx-auto py-8 px-4">
                <h1 className="text-2xl font-bold mb-4">Authentication Required</h1>
                <p className="text-slate-600 dark:text-slate-400">
                    You must be logged in to create a new thread. Please{' '}
                    <Link href={`/api/auth/signin?callbackUrl=/forum/${categoryId}/new-thread`} className="text-blue-600 hover:underline">
                        sign in
                    </Link>
                    .
                </p>
            </main>
        );
    }

    const categoryName = await getCategoryName(categoryId);

    if (!categoryName) {
        notFound(); // Category doesn't exist
    }

    return (
        <main className="container mx-auto py-8 px-4 text-slate-900 dark:text-slate-100">
             {/* Breadcrumbs */}
            <div className="mb-4 text-sm text-slate-500 dark:text-slate-400">
                <Link href="/forum" className="hover:underline">Forum</Link>
                {' > '}
                <Link href={`/forum/${categoryId}`} className="hover:underline">{categoryName}</Link>
                {' > '}
                <span>Create New Thread</span>
            </div>

            <h1 className="text-3xl font-bold mb-6 border-b border-slate-300 dark:border-slate-700 pb-2">
                Create New Thread in {categoryName}
            </h1>

            {/* Render the Client Component form */}
            <NewThreadForm categoryId={categoryId} />

        </main>
    );
}