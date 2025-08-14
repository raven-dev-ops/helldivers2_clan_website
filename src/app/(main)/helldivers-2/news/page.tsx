// src/app/(main)/helldivers-2/news/page.tsx
// Redirect the base Intel route to the War News page.  Each Intel API now has
// its own dedicated page so visiting `/news` directly should take the user to
// the most commonly accessed one.

import { redirect } from 'next/navigation';

export default function IntelIndexPage() {
  redirect('/helldivers-2/news/war-news');
}

