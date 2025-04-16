// src/app/layout.tsx

import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import AuthProvider from "@/components/providers/AuthProvider"; // Create this component
import Navbar from "@/components/common/Navbar";
import Footer from "@/components/common/Footer";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Galactic Phantom Division",
  description: "Zero Point for the Galaxy's Elite",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-[#1a1a2e] text-[#e0e0e0]`}>
        <AuthProvider> {/* SessionProvider wrapper */}
          <div className="flex flex-col min-h-screen">
             <Navbar />
             <main className="flex-grow container mx-auto px-4 py-8">
               {children}
             </main>
             <Footer />
          </div>
        </AuthProvider>
      </body>
    </html>
  );
}