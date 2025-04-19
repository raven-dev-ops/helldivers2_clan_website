// src/app/layout.tsx
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import styles from "./layout.module.css";
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
    <html lang="en">
      <body className={`${inter.className} ${styles.rootBody}`}>
        <div className={styles.overlayDark} />
        <div className={styles.backgroundImage} />

        <AuthProvider>
          <Navbar />

          <main className={styles.mainContainer}>
            <div className={styles.contentWrapper}>
              {children}
            </div>
          </main>

          <Footer />
        </AuthProvider>
      </body>
    </html>
  );
}
