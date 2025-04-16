// src/app/layout.tsx

import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import AuthProvider from "@/components/providers/AuthProvider";
import Navbar from "@/components/common/Navbar";
import Footer from "@/components/common/Footer";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Galactic Phantom Division - Zero Point of Elite Helldivers",
  description: "Forge your legend in the cosmos. Join the elite. Conquer the stars.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="scroll-smooth">
      <body
        className={`${inter.className} relative min-h-screen flex flex-col text-[#e0e0e0]`}
      >
        {/* 
          1. Background Setup
             - Example: space-themed background with cover & fixed attachment for slight parallax feel
             - If you prefer just a gradient, remove the bg-[url('/images/space-bg.jpg')] and use
               bg-gradient-to-b from-[#1a1a2e] to-[#282842] or your custom gradient classes
        */}
        <div
          className="
            absolute inset-0 
            bg-black/50        /* dark overlay to ensure content stands out */
            -z-10
          "
        />
        <div
          className="
            absolute inset-0
            bg-[url('/images/space-bg.png')]  /* or your own background image */
            bg-cover bg-center bg-fixed
            -z-20
          "
        />
        
        <AuthProvider>
          <Navbar />

          {/* 
            2. Main Content
               - Optionally, add a backdrop-blur and transparent background on larger screens
               - If you prefer full-width content with no blur effect, you can remove the "bg-black/30 backdrop-blur-sm" classes
          */}
          <main className="flex-grow container mx-auto px-4 py-8 relative z-10">
            <div className="bg-black/30 backdrop-blur-sm rounded-lg p-6">
              {children}
            </div>
          </main>

          <Footer />
        </AuthProvider>
      </body>
    </html>
  );
}
