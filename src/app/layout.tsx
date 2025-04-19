import { Inter } from 'next/font/google';
import { createGlobalStyle } from 'styled-components';
import StyledComponentsRegistry from './registry';
import AuthProvider from '@/components/providers/AuthProvider';
import Navbar from '@/components/common/Navbar';
import Footer from '@/components/common/Footer';

const inter = Inter({ subsets: ['latin'] });

const GlobalStyle = createGlobalStyle`
  *, *::before, *::after {
    box-sizing: border-box;
  }
  html, body {
    margin: 0;
    padding: 0;
    background-color: #1a1a2e;
    color: #e0e0e0;
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
    scroll-behavior: smooth;
  }
  a {
    color: #00bcd4;
    text-decoration: none;
    transition: color 0.3s ease;
    &:hover {
      color: #0097a7;
    }
  }
`;

export const metadata = {
  title: 'Galactic Phantom Division',
  description: 'Forge your legend in the cosmos.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={inter.className}>
      <body>
        <StyledComponentsRegistry>
          <GlobalStyle />

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
