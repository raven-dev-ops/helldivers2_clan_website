// src/app/components/settings/page.tsx
"use client";

import React from 'react';
// Import the form components from the app directory
import ProfileEditForm from "src/app/components/forum/ProfileEditForm";
import StatsSubmitForm from "src/app/components/forum/StatsSubmitForm";

export default function SettingsPage() {
  return (
    <main className="max-w-5xl mx-auto py-8 px-4 bg-slate-900 text-slate-100 min-h-[60vh]">
      <h1 className="text-3xl font-extrabold mb-6">Settings</h1>

      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-3">Edit Profile</h2>
        <ProfileEditForm />
      </section>

      <section>
        <h2 className="text-xl font-semibold mb-3">Submit Stats</h2>
        <StatsSubmitForm />
      </section>
    </main>
  );
}
