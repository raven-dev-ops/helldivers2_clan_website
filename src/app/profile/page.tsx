// src/app/profile/me/page.tsx

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
export const revalidate = 0;

import ProfileClient from '@/components/profile/ProfileClient';

export default function ProfileMePage() {
  return <ProfileClient />;
}
