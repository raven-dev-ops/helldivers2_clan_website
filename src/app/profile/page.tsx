// src/app/profile/page.tsx

export const runtime = 'nodejs';        
export const dynamic = 'force-dynamic'; 
export const revalidate = 0;            

// Just import the client component directly.
// Since ProfileClient has 'use client' at the top, Next will treat it as a client boundary.
import ProfileClient from '@/components/profile/ProfileClient';

// (Optional) metadata
export const metadata = {
  title: 'My Profile',
};

export default function ProfilePage() {
  return <ProfileClient />;
}
