// src/app/layout.tsx (FIXED - Ensure NO Whitespace)
import type { Metadata } from "next";
import 'swiper/css'; // Import base Swiper CSS
import 'swiper/css/navigation'; // Import Swiper Navigation module CSS
import 'swiper/css/pagination'; // Import Swiper Pagination module CSS
import { Inter } from 'next/font/google';
import Script from 'next/script';
import './globals.css'; // Your global styles
import StyledComponentsRegistry from '@/app/components/StyledComponentsRegistry'; // Adjust path if needed
import AuthProvider from '@/app/components/providers/AuthProvider'; // Adjust path if needed
import MusicButton from '@/app/components/common/MusicButton';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Galactic Phantom Division',
  description: 'Forge your legend in the cosmos.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Ensure NO characters, spaces, or newlines are direct children of <html>
  // outside of <head> or <body>
  return (
    <html lang="en" className={inter.className}>
      {/* NO WHITESPACE HERE */}
      <head>
        <meta name="google-adsense-account" content="ca-pub-9638852588228916"></meta>
        <script src="https://accounts.google.com/gsi/client" async></script>
        <Script id="theme-script" strategy="beforeInteractive">
          {`
            const stored = localStorage.getItem('theme');
            const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
            if (stored === 'dark' || (!stored && prefersDark)) {
              document.documentElement.classList.add('dark');
            }
          `}
        </Script>
        {/* Head content (meta tags, links) goes here. No whitespace directly inside <head> either. */}
      </head>
      {/* NO WHITESPACE HERE */}
      <body className="bg-white text-slate-900 dark:bg-slate-900 dark:text-slate-100 min-h-screen flex flex-col">
        {/* NO WHITESPACE HERE */}
        <StyledComponentsRegistry>
          {/* NO WHITESPACE HERE */}
          <AuthProvider>
            {/* NO WHITESPACE HERE */}
            {children}
            {/* NO WHITESPACE HERE */}
          </AuthProvider>
          {/* NO WHITESPACE HERE */}
        </StyledComponentsRegistry>
        {/* NO WHITESPACE HERE */}
        <MusicButton />
      </body>
      {/* NO WHITESPACE HERE */}
    </html>
  );
}