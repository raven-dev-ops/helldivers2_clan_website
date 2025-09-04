// src/app/layout.tsx
'use client';

import type { Metadata } from 'next';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import { Inter } from 'next/font/google';
import './globals.css';
import StyledComponentsRegistry from '@/app/components/StyledComponentsRegistry';
import { ThemeProvider } from '@/app/providers/ThemeProvider';
import MusicButton from '@/app/components/common/MusicButton';
import GoogleAnalytics from '@/app/components/common/GoogleAnalytics';
import { SessionProvider } from 'next-auth/react';

const inter = Inter({ subsets: ['latin'] });

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const base = (process.env.NEXT_PUBLIC_MEDIA_CDN_BASE_URL || '').replace(/\/$/, '');
  const videoSrc = `${base}/videos/gpd_background.mp4`;

  return (
    <html
      lang="en"
      className={`${inter.className}`}
      suppressHydrationWarning
    >
      <head>
        <meta name="google-adsense-account" content="ca-pub-9638852588228916" />
        <script src="https://accounts.google.com/gsi/client" async />
        <link rel="preload" as="video" href={videoSrc} type="video/mp4" />
        <GoogleAnalytics />
      </head>
      <body className="bg-white text-slate-900 dark:bg-slate-900 dark:text-slate-100 min-h-screen flex flex-col">
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
        <StyledComponentsRegistry>
          <ThemeProvider>
            <SessionProvider>{children}</SessionProvider>
          </ThemeProvider>
        </StyledComponentsRegistry>
        <MusicButton />
      </body>
    </html>
  );
}
