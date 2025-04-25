// src/app/(main)/forum/search/page.tsx (Partial)
import dbConnect from '@/lib/dbConnect';
import ForumThreadModel from '@/models/ForumThread';
import ForumPostModel from '@/models/ForumPost'; // If searching posts too
import Link from 'next/link';

async function searchForum(query: string) {
    if (!query) return { threads: [], posts: [] }; // Basic query check
    await dbConnect();
    try {
        // Search threads based on title
        const threads = await ForumThreadModel.find(
            { $text: { $search: query } },
            { score: { $meta: "textScore" } } // Add relevance score
        )
        .sort({ score: { $meta: "textScore" } }) // Sort by relevance
        .limit(20) // Limit results
        .populate('categoryId', 'name') // Get category info
        .lean();

        // Optionally search posts too (more complex to display context)
        // const posts = await ForumPostModel.find(...)

        return JSON.parse(JSON.stringify({ threads, posts: [] })); // Return results
    } catch (error) {
        console.error("Search error:", error);
        return { threads: [], posts: [] };
    }
}

export default async function SearchResultsPage({ searchParams }: { searchParams?: { q?: string } }) {
    const query = searchParams?.q || '';
    const results = await searchForum(query);

    return (
        <main className="container mx-auto py-8 px-4">
            <h1 className="text-2xl font-bold mb-4">Search Results for: "{query}"</h1>
            {/* Display Thread Results */}
            <h2 className="text-xl font-semibold mt-6 mb-3">Threads</h2>
            {results.threads.length > 0 ? (
                <ul className="space-y-2">
                    {results.threads.map((thread: any) => (
                       <li key={thread._id} className="...">
                            <Link href={`/forum/${thread.categoryId?._id || 'unknown'}/${thread._id}`} className="text-blue-600 hover:underline">{thread.title}</Link>
                            {/* Add category name, snippet, etc. */}
                       </li>
                    ))}
                </ul>
            ) : (
                <p>No threads found matching your query.</p>
            )}
             {/* TODO: Display Post Results */}
        </main>
    );
}