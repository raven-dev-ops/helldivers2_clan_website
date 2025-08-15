// src/app/layout.tsx
import type { Metadata } from "next";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { Inter } from "next/font/google";
import Script from "next/script";
import { cookies } from "next/headers";
import "./globals.css";
import StyledComponentsRegistry from "@/app/components/StyledComponentsRegistry";
import AuthProvider from "@/app/components/providers/AuthProvider";
import MusicButton from "@/app/components/common/MusicButton";
import GoogleAnalytics from "@/app/components/common/GoogleAnalytics";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Galactic Phantom Division",
  description: "Forge your legend in the cosmos.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  // 1) Server decides a stable initial theme from cookie
  const cookieTheme = (cookies().get("theme")?.value ??
    "system") as "light" | "dark" | "system";
  const serverDark = cookieTheme === "dark"; // only render dark when explicitly set

  return (
    <html
      lang="en"
      className={`${inter.className}${serverDark ? " dark" : ""}`}
      suppressHydrationWarning
    >
      <head>
        <meta name="google-adsense-account" content="ca-pub-9638852588228916" />
        <script src="https://accounts.google.com/gsi/client" async />
        {/* 2) Client bootstrap: resolve final theme ASAP and sync cookie+localStorage */}
        <Script id="theme-script" strategy="beforeInteractive">
          {`(function(){
              try {
                var t = localStorage.getItem('theme') || '${cookieTheme}';
                if (t === 'system') {
                  t = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
                }
                if (t === 'dark') document.documentElement.classList.add('dark');
                else document.documentElement.classList.remove('dark');
                // keep cookie in sync (stores original choice if present)
                var stored = localStorage.getItem('theme') || '${cookieTheme}';
                document.cookie = 'theme=' + stored + '; Path=/; Max-Age=31536000; SameSite=Lax';
              } catch(e) {}
            })();`}
        </Script>
        <GoogleAnalytics />
      </head>
      <body className="bg-white text-slate-900 dark:bg-slate-900 dark:text-slate-100 min-h-screen flex flex-col">
        <StyledComponentsRegistry>
          <AuthProvider>{children}</AuthProvider>
        </StyledComponentsRegistry>
        <MusicButton />
      </body>
    </html>
  );
}
