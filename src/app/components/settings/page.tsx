// src/app/components/settings/page.tsx
"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function LegacySettingsRedirect() {
  const router = useRouter();
  useEffect(() => {
    router.replace('/settings');
  }, [router]);
  return null;
}
