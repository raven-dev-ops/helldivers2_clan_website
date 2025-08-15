// src/app/layout.tsx
import type { Metadata } from "next";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { Inter } from "next/font/google";
import Script from "next/script";
import { cookies } from "next/headers"; // <-- async in Next 15
import "./globals.css";
import StyledComponentsRegistry from "@/app/components/StyledComponentsRegistry";
import AuthProvider from "@/app/components/providers/AuthProvider";
import MusicButton from "@/app/components/common/MusicButton";
import GoogleAnalytics from "@/app/components/common/GoogleAnalytics";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Galactic Phantom Division | GPT FLEET",
  description: "We are the last Helldivers. Stay free.",
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  // Next 15: cookies() returns a Promise<ReadonlyRequestCookies>
  const cookieStore = await cookies();
  const cookieTheme = (cookieStore.get("theme")?.value ?? "system") as "light" | "dark" | "system";
  const serverDark = cookieTheme === "dark"; // only render dark if explicitly set

  return (
    <html
      lang="en"
      className={`${inter.className}${serverDark ? " dark" : ""}`}
      suppressHydrationWarning
    >
      <head>
        <meta name="google-adsense-account" content="ca-pub-9638852588228916" />
        <script src="https://accounts.google.com/gsi/client" async />
        {/* Bootstrap final theme before hydration; sync cookie + localStorage */}
        <Script id="theme-script" strategy="beforeInteractive">
          {`(function(){
              try {
                var t = localStorage.getItem('theme') || '${cookieTheme}';
                if (t === 'system') {
                  t = (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) ? 'dark' : 'light';
                }
                if (t === 'dark') document.documentElement.classList.add('dark');
                else document.documentElement.classList.remove('dark');
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
