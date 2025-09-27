// src/app/profile/me/page.tsx

// Force runtime rendering (no SSG/ISR) so DB/env are only needed at request time
export const dynamic = 'force-dynamic';
export const revalidate = 0;
export const runtime = 'nodejs';

// Belt & suspenders: touching headers() also forces dynamic rendering
import { headers } from 'next/headers';
headers();

import { getServerSession } from 'next-auth';
import { getAuthOptions } from '@/lib/authOptions';
import ProfileView from '@/components/profile/ProfileView';

type BatchResult = {
  solo?: any;
  month?: any;
  lifetime?: any;
};

async function fetchJSON<T>(url: string, init?: RequestInit): Promise<T> {
  const res = await fetch(url, { ...init, cache: 'no-store' });
  if (!res.ok) throw new Error(`${url} -> ${res.status}`);
  return res.json() as Promise<T>;
}

export default async function ProfilePage() {
  const session = await getServerSession(getAuthOptions());

  if (!session) {
    return (
      <div className="container mx-auto px-4 py-8">
        <p>
          Please <a href="/auth">sign in</a> to view your profile.
        </p>
      </div>
    );
  }

  // Server-side data fetches (no call to /api/users/profile/last)
  const now = new Date();
  const qs = new URLSearchParams({
    scopes: 'solo,month,lifetime',
    sortBy: 'Kills',
    sortDir: 'desc',
    limit: '1000',
    month: String(now.getUTCMonth() + 1),
    year: String(now.getUTCFullYear()),
  }).toString();

  const [me, batch] = await Promise.all([
    fetchJSON<any>('/api/users/me?include=avatar,submissions'),
    fetchJSON<BatchResult>(`/api/helldivers/leaderboard/batch?${qs}`),
  ]);

  const userData = me;

  return <ProfileView session={session} userData={userData} batch={batch} />;
}
