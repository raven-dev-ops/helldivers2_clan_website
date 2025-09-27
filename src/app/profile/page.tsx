// src/app/profile/page.tsx

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
export const revalidate = 0;

// (Optional) SEO
export const metadata = {
  title: 'Profile',
};

import ProfileClient from '@/components/profile/ProfileClient';

export default function ProfilePage() {
  return <ProfileClient />;
}
