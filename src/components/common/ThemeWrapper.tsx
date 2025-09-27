'use client';
import { useEffect } from 'react';

type Theme = 'light' | 'dark' | 'system';

export default function ThemeWrapper({
  initialTheme = 'system',
  children,
}: {
  initialTheme?: Theme;
  children: React.ReactNode;
}) {
  useEffect(() => {
    // Determine the final theme on the client
    const stored = (typeof window !== 'undefined' &&
      localStorage.getItem('theme')) as Theme | null;
    const pref: Theme = stored || initialTheme;

    const resolve = (t: Theme) => {
      if (t === 'system') {
        return window.matchMedia?.('(prefers-color-scheme: dark)').matches
          ? 'dark'
          : 'light';
      }
      return t;
    };

    const apply = (t: Theme) => {
      const resolved = resolve(t);
      document.documentElement.classList.toggle('dark', resolved === 'dark');
      try {
        // keep both cookie and localStorage in sync
        document.cookie = `theme=${t}; Path=/; Max-Age=31536000; SameSite=Lax`;
        localStorage.setItem('theme', t);
      } catch {}
    };

    apply(pref);

    // Listen to OS changes only when using "system"
    const mm = window.matchMedia?.('(prefers-color-scheme: dark)');
    const handler = () => {
      const current =
        (localStorage.getItem('theme') as Theme | null) || initialTheme;
      if (current === 'system') apply('system');
    };
    mm?.addEventListener?.('change', handler);
    return () => mm?.removeEventListener?.('change', handler);
  }, [initialTheme]);

  return <>{children}</>;
}
