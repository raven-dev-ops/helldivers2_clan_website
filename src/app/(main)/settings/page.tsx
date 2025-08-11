// src/app/(main)/settings/page.tsx

import ProfileEditForm from '@/app/components/forum/ProfileEditForm';
import StatsSubmitForm from '@/app/components/forum/StatsSubmitForm';

export default function SettingsPage() {
  return (
    <div className="space-y-8">
      <header>
        <h1 className="text-3xl font-extrabold mb-2">Settings</h1>
        <p className="text-slate-400">Manage your profile and submit your Helldivers 2 stats.</p>
      </header>

      <section>
        <h2 className="text-xl font-semibold mb-3">Edit Profile</h2>
        <ProfileEditForm />
      </section>

      <section>
        <h2 className="text-xl font-semibold mb-3">Submit Stats</h2>
        <StatsSubmitForm />
      </section>
    </div>
  );
}