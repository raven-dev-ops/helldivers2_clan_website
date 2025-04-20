// src/components/forum/PaginationControls.tsx
"use client"; // Needs client hooks for navigation

import Link from 'next/link';
import { usePathname, useSearchParams } from 'next/navigation';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';

interface PaginationControlsProps {
  currentPage: number;
  totalPages: number;
  basePath: string; // e.g., /forum/categoryId or /forum/categoryId/threadId
  className?: string;
}

export default function PaginationControls({
  currentPage,
  totalPages,
  basePath,
  className = ""
}: PaginationControlsProps) {

  const pathname = usePathname(); // Correct hook for App Router path
  const searchParams = useSearchParams(); // Correct hook for search params

  const createPageURL = (pageNumber: number | string) => {
    const params = new URLSearchParams(searchParams); // Get existing params
    params.set('page', pageNumber.toString());
    return `${basePath}?${params.toString()}`; // Use basePath prop
  };

  if (totalPages <= 1) {
    return null; // Don't render pagination if only one page
  }

  const showEllipsisThreshold = 5; // Show ellipsis if more than this many pages total
  const sideButtonCount = 1; // Show 1 button directly adjacent to current page

  let pageNumbers: (number | '...')[] = [];

  if (totalPages <= showEllipsisThreshold + 2) { // Show all pages if not too many
    pageNumbers = Array.from({ length: totalPages }, (_, i) => i + 1);
  } else {
    // Always show first page
    pageNumbers.push(1);

    // Calculate range around current page
    const startRange = Math.max(2, currentPage - sideButtonCount);
    const endRange = Math.min(totalPages - 1, currentPage + sideButtonCount);

    // Ellipsis before range if needed
    if (startRange > 2) {
      pageNumbers.push('...');
    }

    // Pages around current page
    for (let i = startRange; i <= endRange; i++) {
      pageNumbers.push(i);
    }

    // Ellipsis after range if needed
    if (endRange < totalPages - 1) {
      pageNumbers.push('...');
    }

    // Always show last page
    pageNumbers.push(totalPages);
  }


  return (
    <nav aria-label="Pagination" className={`flex justify-center items-center gap-2 mt-8 ${className}`}>
      {/* Previous Button */}
      <Link
        href={createPageURL(currentPage - 1)}
        className={`inline-flex items-center justify-center px-3 py-1.5 border border-slate-300 dark:border-slate-600 rounded-md text-sm font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 transition ${
          currentPage === 1 ? 'opacity-50 pointer-events-none' : ''
        }`}
        aria-disabled={currentPage === 1}
        tabIndex={currentPage === 1 ? -1 : undefined}
      >
        <FaChevronLeft className="mr-1 h-3 w-3" />
        Previous
      </Link>

      {/* Page Numbers */}
      <div className="flex items-center gap-1">
          {pageNumbers.map((pageNum, index) =>
            pageNum === '...' ? (
                <span key={`ellipsis-${index}`} className="px-3 py-1.5 text-sm text-slate-500 dark:text-slate-400">...</span>
            ) : (
                <Link
                    key={pageNum}
                    href={createPageURL(pageNum)}
                    className={`inline-flex items-center justify-center w-9 h-9 border rounded-md text-sm font-medium transition ${
                        pageNum === currentPage
                        ? 'bg-blue-600 border-blue-600 text-white pointer-events-none'
                        : 'border-slate-300 dark:border-slate-600 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700'
                    }`}
                    aria-current={pageNum === currentPage ? 'page' : undefined}
                >
                    {pageNum}
                </Link>
            )
          )}
      </div>


      {/* Next Button */}
      <Link
        href={createPageURL(currentPage + 1)}
        className={`inline-flex items-center justify-center px-3 py-1.5 border border-slate-300 dark:border-slate-600 rounded-md text-sm font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 transition ${
          currentPage === totalPages ? 'opacity-50 pointer-events-none' : ''
        }`}
        aria-disabled={currentPage === totalPages}
        tabIndex={currentPage === totalPages ? -1 : undefined}
      >
        Next
        <FaChevronRight className="ml-1 h-3 w-3" />
      </Link>
    </nav>
  );
}