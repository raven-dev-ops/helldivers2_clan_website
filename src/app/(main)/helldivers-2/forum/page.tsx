// src/app/(main)/forum/page.tsx (Corrected)
import Link from 'next/link';
import dbConnect from '@/lib/dbConnect'; // Adjust path if needed
import ForumCategoryModel, { IForumCategory } from '@/models/ForumCategory'; // Adjust path

// --- Import the factory function from isomorphic-dompurify ---
import createDOMPurify from 'isomorphic-dompurify';

// Function to fetch categories (Keep as before)
async function getCategories(): Promise<(Omit<IForumCategory, '_id' | 'createdAt' | 'updatedAt'> & { _id: string; createdAt: string; updatedAt: string })[]> {
  try {
    await dbConnect(); // Ensure connection is ready
    const categories = await ForumCategoryModel.find({})
      .sort({ name: 1 }) // Sort alphabetically
      .lean(); // Use .lean() for performance
    return JSON.parse(JSON.stringify(categories)); // Basic serialization
  } catch (error) {
    console.error("Failed to fetch forum categories:", error);
    return []; // Return empty array on error
  }
}

// --- Page Component ---
export default async function ForumHomePage() {
  // Fetch categories when the page component runs on the server
  const categories = await getCategories();

  // --- Create the DOMPurify instance within the component ---
  // Rename the variable holding the instance for clarity
  const purifier = createDOMPurify();

  return (
    // Main container with padding and text colors
    <main className="container mx-auto py-8 px-4 text-slate-900 dark:text-slate-100">
      {/* Page Title */}
      <h1 className="text-3xl font-bold mb-6 border-b border-slate-300 dark:border-slate-700 pb-2">
        Forum Categories
      </h1>

      {/* Conditional Rendering: Categories List or Not Found Message */}
      {categories.length === 0 ? (
        <p className="text-slate-600 dark:text-slate-400 py-10 text-center">
          No forum categories found. Perhaps create one? {/* Or check DB content */}
        </p>
      ) : (
        // List container
        <div className="space-y-4">
          {categories.map((category) => (
            // Link each category item
            <Link
              href={`/forum/${category._id}`}
              key={category._id}
              className="block p-4 bg-slate-100 dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-200 dark:hover:bg-slate-700/60 transition duration-150 ease-in-out shadow-sm hover:shadow-md focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 dark:focus-visible:ring-blue-400 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-slate-900"
              aria-label={`View category: ${category.name}`}
            >
              {/* Category Name */}
              <h2 className="text-xl font-semibold text-blue-600 dark:text-blue-400 mb-1">
                {category.name}
              </h2>
              {/* Category Description (Sanitized) */}
              {category.description && (
                 <p
                    className="text-sm text-slate-600 dark:text-slate-400 max-w-prose" // Limit width for readability
                    // --- Use the created instance's sanitize method ---
                    // VVVVVV CORRECTED LINE BELOW VVVVVV
                    dangerouslySetInnerHTML={{ __html: purifier.sanitize(category.description || '') }}
                    // ^^^^^^ CORRECTED LINE ABOVE ^^^^^^
                 />
              )}
            </Link>
          ))}
        </div>
      )}
    </main>
  );
}