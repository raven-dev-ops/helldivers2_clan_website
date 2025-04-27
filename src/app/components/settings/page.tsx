// src/app/components/settings/page.tsx
"use client";

import React from 'react';
// Import the form components from the app directory
import ProfileEditForm from "src/app/components/forum/ProfileEditForm";
import StatsSubmitForm from "src/app/components/forum/StatsSubmitForm";

export default function SettingsPage() {
  return (
    <main className="container mx-auto py-8">
      <h1 className="text-2xl font-bold mb-4">Settings</h1>

      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-2">Edit Profile</h2>
        <ProfileEditForm />
      </section>

      <section>
        <h2 className="text-xl font-semibold mb-2">Submit Stats</h2>
        <StatsSubmitForm />
      </section>
    </main>
  );
}
