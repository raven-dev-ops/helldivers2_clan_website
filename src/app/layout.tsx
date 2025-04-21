// src/app/layout.tsx (MODIFIED - Root Layout)
import type { Metadata } from "next";
import { Inter } from 'next/font/google';
import './globals.css'; // Global styles
import StyledComponentsRegistry from '@/components/StyledComponentsRegistry'; // Ensure path is correct
import AuthProvider from '@/components/providers/AuthProvider'; // Ensure path is correct

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Galactic Phantom Division',
  description: 'Forge your legend in the cosmos.',
  // Add more metadata as needed
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.className} dark`}> {/* Assuming dark mode base */}
      {/* Apply base body styles directly or via globals.css */}
      <body className="bg-slate-900 text-slate-100 min-h-screen flex flex-col">
        {/* Styled Components Registry needs to wrap content */}
        <StyledComponentsRegistry>
          {/* AuthProvider wraps content to provide session context */}
          <AuthProvider>
              {/* Children will be either the Auth page OR the MainAppLayout */}
              {children}
          </AuthProvider>
        </StyledComponentsRegistry>
      </body>
    </html>
  );
}