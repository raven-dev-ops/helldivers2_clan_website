// src/app/(main)/forum/page.tsx
import Link from 'next/link';
import dbConnect from '@/lib/dbConnect'; // Adjust path if needed
import ForumCategoryModel, { IForumCategory } from '@/models/ForumCategory'; // Adjust path
import { sanitize } from 'isomorphic-dompurify'; // For sanitizing description if it allows HTML

// Function to fetch categories (can be moved to a separate lib/actions file)
async function getCategories() {
  await dbConnect();
  try {
    const categories = await ForumCategoryModel.find({})
      .sort({ name: 1 }) // Sort alphabetically
      .lean(); // Use .lean() for performance with server components
    // Basic serialization check (lean helps, but good practice for complex objects)
    return JSON.parse(JSON.stringify(categories)) as (IForumCategory & { _id: string })[];
  } catch (error) {
    console.error("Failed to fetch forum categories:", error);
    return []; // Return empty array on error
  }
}

export default async function ForumHomePage() {
  const categories = await getCategories();

  return (
    // Using theme colors similar to previous examples
    <main className="container mx-auto py-8 px-4 text-slate-900 dark:text-slate-100">
      <h1 className="text-3xl font-bold mb-6 border-b border-slate-300 dark:border-slate-700 pb-2">
        Forum Categories
      </h1>

      {categories.length === 0 ? (
        <p className="text-slate-600 dark:text-slate-400">No forum categories found.</p>
      ) : (
        <div className="space-y-4">
          {categories.map((category) => (
            <Link
              href={`/forum/${category._id}`}
              key={category._id}
              className="block p-4 bg-slate-100 dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-200 dark:hover:bg-slate-700/60 transition duration-150 ease-in-out shadow-sm hover:shadow-md"
            >
              <h2 className="text-xl font-semibold text-blue-600 dark:text-blue-400 mb-1">
                {category.name}
              </h2>
              {category.description && (
                 // Sanitize description if it might contain user-generated HTML
                 <p
                    className="text-sm text-slate-600 dark:text-slate-400"
                    dangerouslySetInnerHTML={{ __html: sanitize(category.description) }}
                 />
                 // Or if plain text:
                 // <p className="text-sm text-slate-600 dark:text-slate-400">{category.description}</p>
              )}
            </Link>
          ))}
        </div>
      )}
    </main>
  );
}