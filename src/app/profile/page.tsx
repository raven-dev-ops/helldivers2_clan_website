// src/app/profile/me/page.tsx

import dynamic from 'next/dynamic';

const ProfileClient = dynamic(
  () => import('@/components/profile/ProfileClient'),
  { ssr: false, loading: () => <div className="container mx-auto px-4 py-8">Loading…</div> }
);

export const runtime = 'nodejs';

export const metadata = {
  title: 'My Profile',
};

export default function ProfilePage() {
  return <ProfileClient />;
}
