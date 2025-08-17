// src/app/(main)/layout.tsx (Cleaned up - Requires classes in globals.css)

import Navbar from '@/app/components/common/Navbar'; // Adjust path if needed
import AlertBar from '@/app/components/common/AlertBar';
import MaintenanceBanner from '@/app/components/common/MaintenanceBanner';
import Footer from '@/app/components/common/Footer'; // Adjust path if needed
// ThemeToggle is inside Navbar or Footer

export default function MainAppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      {' '}
      {/* Fragment inherits flex from RootLayout's body */}
      <MaintenanceBanner />
      <Navbar />
      <AlertBar />
      {/* Apply helper classes from globals.css */}
      {/* Ensure '.container', '.flex-grow', '.py-6', '.relative', '.z-10' are defined */}
      <main className="container flex-grow py-6 relative z-10">
        {/* The main page content renders here */}
        {children}
      </main>
      <Footer />
    </>
  );
}

/*
  Reminder for your src/app/globals.css:

  .container {
    width: 100%;
    max-width: 1200px;
    margin-left: auto;
    margin-right: auto;
    padding-left: var(--spacing-4);
    padding-right: var(--spacing-4);
  }

  .flex-grow { flex-grow: 1; }

  .py-6 { padding-top: var(--spacing-6); padding-bottom: var(--spacing-6); }

  .relative { position: relative; }
  .z-10 { z-index: 10; }

*/
