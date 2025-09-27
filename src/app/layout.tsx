// src/app/layout.tsx

'use client';

import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import { Inter } from 'next/font/google';
import '@/styles/globals.css';
import { ThemeProvider } from '@/components/common/ThemeProvider';
import MusicButton from '@/components/common/MusicButton';
import { SessionProvider } from 'next-auth/react';

// New: layout chrome
import Navbar from '@/components/common/Navbar';
import AlertBar from '@/components/common/AlertBar';
import Footer from '@/components/common/Footer';

const inter = Inter({ subsets: ['latin'] });

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const base = (process.env.NEXT_PUBLIC_MEDIA_CDN_BASE_URL || '').replace(/\/$/, '');
  const videoSrc = `${base}/videos/gpd_background.mp4`;

  return (
    <html lang="en" className={inter.className} suppressHydrationWarning>
      <head>
        <link rel="preload" as="video" href={videoSrc} type="video/mp4" />
      </head>
      <body className="bg-white text-slate-900 dark:bg-slate-900 dark:text-slate-100 min-h-screen flex flex-col">
        {/* Background video */}
        <video
          src={videoSrc}
          autoPlay
          loop
          muted
          playsInline
          preload="metadata"
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            zIndex: -3,
            filter: 'brightness(0.6)',
          }}
        />

        <ThemeProvider>
          <SessionProvider>
            {/* Top nav + global alerts */}
            <Navbar />
            <AlertBar />

            {/* Page content */}
            {children}

            {/* Global footer */}
            <Footer />
          </SessionProvider>
        </ThemeProvider>

        {/* Floating music control (overlay) */}
        <MusicButton />
      </body>
    </html>
  );
}
