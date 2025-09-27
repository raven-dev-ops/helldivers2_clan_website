// src/app/profile/me/page.tsx

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
export const revalidate = 0;

// (Optional) SEO
export const metadata = {
  title: 'My Profile',
};

import ProfileClient from '@/components/profile/ProfileClient';

export default function ProfileMePage() {
  return <ProfileClient />;
}
