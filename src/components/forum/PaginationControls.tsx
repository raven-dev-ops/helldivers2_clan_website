// src/components/forum/PaginationControls.tsx
"use client"; // This component uses client-side hooks

import Link from 'next/link';
import { useSearchParams } from 'next/navigation'; // Only searchParams needed here now
import { FaChevronLeft, FaChevronRight, FaAngleDoubleLeft, FaAngleDoubleRight } from 'react-icons/fa'; // Added icons for First/Last

interface PaginationControlsProps {
  currentPage: number;
  totalPages: number;
  basePath: string; // Base path for the links (e.g., /forum/categoryId or /forum/categoryId/threadId)
  className?: string; // Optional additional class names
}

export default function PaginationControls({
  currentPage,
  totalPages,
  basePath,
  className = ""
}: PaginationControlsProps) {

  const searchParams = useSearchParams(); // Hook to get current search parameters

  // --- Helper function to create URLs for page numbers ---
  const createPageURL = (pageNumber: number | string): string => {
    // Create a new URLSearchParams object from the current ones
    const params = new URLSearchParams(Array.from(searchParams.entries()));
    // Set the 'page' parameter
    params.set('page', pageNumber.toString());
    // Ensure basePath doesn't end with a slash before adding query string
    const safeBasePath = basePath.endsWith('/') ? basePath.slice(0, -1) : basePath;
    // Construct the full URL
    return `${safeBasePath}?${params.toString()}`;
  };

  // --- Don't render controls if only one page or fewer ---
  if (totalPages <= 1) {
    return null;
  }

  // --- Configuration for how many page numbers to display ---
  const MAX_VISIBLE_PAGES = 7; // Max total buttons (excluding prev/next/first/last) - Adjust as needed
  const SIDE_BUTTON_COUNT = 1; // Number of buttons immediately next to current page

  let pageNumbers: (number | '...')[] = [];

  // --- Logic to generate the list of page numbers and ellipses ---
  if (totalPages <= MAX_VISIBLE_PAGES) {
    // If total pages is small enough, show all page numbers
    pageNumbers = Array.from({ length: totalPages }, (_, i) => i + 1);
  } else {
    // If many pages, calculate which numbers to show with ellipses
    pageNumbers.push(1); // Always show the first page

    // Calculate the range of pages to display around the current page
    const startRange = Math.max(2, currentPage - SIDE_BUTTON_COUNT);
    const endRange = Math.min(totalPages - 1, currentPage + SIDE_BUTTON_COUNT);

    // Add ellipsis before the range if needed
    if (startRange > 2) {
      pageNumbers.push('...');
    }

    // Add the page numbers in the calculated range
    for (let i = startRange; i <= endRange; i++) {
      pageNumbers.push(i);
    }

    // Add ellipsis after the range if needed
    if (endRange < totalPages - 1) {
      pageNumbers.push('...');
    }

    // Always show the last page
    pageNumbers.push(totalPages);
  }

  // --- Render the Pagination Navigation ---
  return (
    <nav aria-label="Pagination" className={`flex flex-wrap justify-center items-center gap-1 sm:gap-2 mt-8 ${className}`}>
      {/* First Page Button */}
      <Link
        href={createPageURL(1)}
        className={`inline-flex items-center justify-center px-2 py-1.5 border border-slate-300 dark:border-slate-600 rounded-md text-sm font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 transition ${
          currentPage === 1 ? 'opacity-50 pointer-events-none' : ''
        }`}
        aria-disabled={currentPage === 1}
        tabIndex={currentPage === 1 ? -1 : undefined}
        aria-label="Go to first page"
        scroll={false} // Prevent scroll to top
      >
        <FaAngleDoubleLeft className="h-4 w-4" />
      </Link>

      {/* Previous Page Button */}
      <Link
        href={createPageURL(currentPage - 1)}
        className={`inline-flex items-center justify-center pl-2 pr-3 py-1.5 border border-slate-300 dark:border-slate-600 rounded-md text-sm font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 transition ${
          currentPage === 1 ? 'opacity-50 pointer-events-none' : ''
        }`}
        aria-disabled={currentPage === 1}
        tabIndex={currentPage === 1 ? -1 : undefined}
        aria-label="Go to previous page"
        scroll={false}
      >
        <FaChevronLeft className="mr-1 h-3 w-3" />
        Prev
      </Link>

      {/* Page Number Buttons/Ellipses */}
      <div className="flex items-center gap-1">
        {pageNumbers.map((pageNum, index) =>
          pageNum === '...' ? (
            // Render ellipsis as non-interactive span
            <span
              key={`ellipsis-${index}`}
              className="px-1 sm:px-3 py-1.5 text-sm text-slate-500 dark:text-slate-400"
              aria-hidden="true" // Hide ellipsis from screen readers
            >
              ...
            </span>
          ) : (
            // Render page number link
            <Link
              key={pageNum}
              href={createPageURL(pageNum)}
              className={`inline-flex items-center justify-center w-9 h-9 border rounded-md text-sm font-medium transition ${
                pageNum === currentPage
                  ? 'bg-blue-600 border-blue-600 text-white pointer-events-none shadow-md' // Active state
                  : 'border-slate-300 dark:border-slate-600 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700' // Default state
              }`}
              aria-current={pageNum === currentPage ? 'page' : undefined} // Indicate current page for accessibility
              aria-label={`Go to page ${pageNum}`}
              scroll={false}
            >
              {pageNum}
            </Link>
          )
        )}
      </div>

      {/* Next Page Button */}
      <Link
        href={createPageURL(currentPage + 1)}
        className={`inline-flex items-center justify-center pl-3 pr-2 py-1.5 border border-slate-300 dark:border-slate-600 rounded-md text-sm font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 transition ${
          currentPage === totalPages ? 'opacity-50 pointer-events-none' : ''
        }`}
        aria-disabled={currentPage === totalPages}
        tabIndex={currentPage === totalPages ? -1 : undefined}
        aria-label="Go to next page"
        scroll={false}
      >
        Next
        <FaChevronRight className="ml-1 h-3 w-3" />
      </Link>

       {/* Last Page Button */}
      <Link
        href={createPageURL(totalPages)}
        className={`inline-flex items-center justify-center px-2 py-1.5 border border-slate-300 dark:border-slate-600 rounded-md text-sm font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 transition ${
          currentPage === totalPages ? 'opacity-50 pointer-events-none' : ''
        }`}
        aria-disabled={currentPage === totalPages}
        tabIndex={currentPage === totalPages ? -1 : undefined}
        aria-label="Go to last page"
        scroll={false}
      >
        <FaAngleDoubleRight className="h-4 w-4" />
      </Link>
    </nav>
  );
}