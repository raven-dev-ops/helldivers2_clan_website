// src/components/common/ThemeToggle.tsx
'use client';

import { useTheme } from '@/app/providers/ThemeProvider';
import { FaSun, FaMoon } from 'react-icons/fa';

enum Theme {
    Light = 'light',
    Dark = 'dark',
}

export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      aria-label={`Switch to ${theme === Theme.Light ? 'dark' : 'light'} mode`}
      title={`Switch to ${theme === Theme.Light ? 'dark' : 'light'} mode`}
      className="p-2 rounded-full text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] hover:bg-[var(--color-surface-alt)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary-focus)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--color-background)] transition-colors duration-200"
    >
      {theme === Theme.Light ? (
        <FaMoon className="w-5 h-5" aria-hidden="true" />
      ) : (
        <FaSun className="w-5 h-5" aria-hidden="true" />
      )}
    </button>
  );
}
