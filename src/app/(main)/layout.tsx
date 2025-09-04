// src/app/(main)/layout.tsx
'use client';

import Navbar from '@/app/components/common/Navbar';
import AlertBar from '@/app/components/common/AlertBar';
import MaintenanceBanner from '@/app/components/common/MaintenanceBanner';
import Footer from '@/app/components/common/Footer';
import { SessionProvider } from 'next-auth/react';

export default function MainAppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SessionProvider>
      <MaintenanceBanner />
      <Navbar />
      <AlertBar />
      <main className="container flex-grow py-6 relative z-10">
        {children}
      </main>
      <Footer />
    </SessionProvider>
  );
}
