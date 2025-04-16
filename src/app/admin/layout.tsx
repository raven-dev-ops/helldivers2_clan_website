// src/app/admin/layout.tsx

import React from 'react';
import Link from 'next/link';

export const metadata = {
  title: "Admin Dashboard",
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex">
      {/* Sidebar / Nav */}
      <aside className="bg-gray-800 text-white w-64 p-4 flex flex-col">
        <h2 className="text-xl font-bold mb-4">Admin Dashboard</h2>
        <nav className="space-y-2">
          <Link href="/admin" className="block hover:underline">
            Overview
          </Link>
          <Link href="/admin/audit" className="block hover:underline">
            Audit
          </Link>
          <Link href="/admin/content" className="block hover:underline">
            Content
          </Link>
          <Link href="/admin/stats" className="block hover:underline">
            Stats
          </Link>
          <Link href="/admin/users" className="block hover:underline">
            Users
          </Link>
        </nav>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 bg-gray-100 p-6">
        {children}
      </main>
    </div>
  );
}
