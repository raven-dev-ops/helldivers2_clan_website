// src/app/layout.tsx
import { Inter } from 'next/font/google';
import StyledComponentsRegistry from '@/components/StyledComponentsRegistry'; // <-- client component
import AuthProvider from '@/components/providers/AuthProvider';
import Navbar from '@/components/common/Navbar';
import Footer from '@/components/common/Footer';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'Galactic Phantom Division',
  description: 'Forge your legend in the cosmos.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={inter.className}>
      <body>
        {/* Wrap your app in the client-only styled-components registry */}
        <StyledComponentsRegistry>
          <AuthProvider>
            <Navbar />
            <main style={{ padding: '2rem', position: 'relative', zIndex: 10 }}>
              {children}
            </main>
            <Footer />
          </AuthProvider>
        </StyledComponentsRegistry>
      </body>
    </html>
  );
}
