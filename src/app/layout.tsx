// src/app/layout.tsx (FIXED - Ensure NO Whitespace)
import type { Metadata } from "next";
import { Inter } from 'next/font/google';
import './globals.css'; // Your global styles
import StyledComponentsRegistry from '@/components/StyledComponentsRegistry'; // Adjust path if needed
import AuthProvider from '@/components/providers/AuthProvider'; // Adjust path if needed

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
    <html lang="en" className={`${inter.className} dark`}>
      {/* NO WHITESPACE HERE */}
      <head>
        {/* Head content (meta tags, links) goes here. No whitespace directly inside <head> either. */}
      </head>
      {/* NO WHITESPACE HERE */}
      <body className="bg-slate-900 text-slate-100 min-h-screen flex flex-col">
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
      </body>
      {/* NO WHITESPACE HERE */}
    </html>
  );
}