// src/app/(main)/profile/layout.tsx
'use client';

import AuthProvider from '@/app/components/providers/AuthProvider';

export default function ProfileLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <AuthProvider>{children}</AuthProvider>;
}
