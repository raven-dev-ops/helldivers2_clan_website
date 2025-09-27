// src/app/profile/me/page.tsx
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

  // Server-side data fetches
  const now = new Date();
  const qs = new URLSearchParams({
    scopes: 'solo,month,lifetime',
    sortBy: 'Kills',
    sortDir: 'desc',
    limit: '1000',
    month: String(now.getUTCMonth() + 1),
    year: String(now.getUTCFullYear()),
  }).toString();

  const [me, last, batch] = await Promise.all([
    fetchJSON<any>('/api/users/me?include=avatar,submissions'),
    (async () => {
      try {
        return await fetchJSON<any>('/api/users/profile/last');
      } catch {
        return { last_profile: null };
      }
    })(),
    fetchJSON<BatchResult>(`/api/helldivers/leaderboard/batch?${qs}`),
  ]);

  const userData = { ...me, lastProfile: last?.last_profile ?? null };

  return <ProfileView session={session} userData={userData} batch={batch} />;
}
