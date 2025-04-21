// src/components/common/ThemeToggle.tsx
"use client"; // This component needs client-side hooks and interaction

import { useState, useEffect } from 'react';
import { FaSun, FaMoon } from 'react-icons/fa'; // Example icons

// Enum for theme values for better type safety
enum Theme {
  Light = 'light',
  Dark = 'dark',
}

export default function ThemeToggle() {
  // State to hold the current theme, initializes to null until hydration
  const [theme, setTheme] = useState<Theme | null>(null);

  // Effect to set the initial theme based on localStorage or OS preference
  useEffect(() => {
    const storedTheme = localStorage.getItem('theme') as Theme | null;
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

    // Determine initial theme: stored preference > OS preference > default (light)
    const initialTheme = storedTheme || (prefersDark ? Theme.Dark : Theme.Light);
    setTheme(initialTheme);

  }, []); // Empty dependency array ensures this runs only once on mount

  // Effect to apply the theme class to the <html> element and save preference
  useEffect(() => {
    if (theme) {
      const root = document.documentElement; // Get the <html> element
      if (theme === Theme.Dark) {
        root.classList.add('dark');
      } else {
        root.classList.remove('dark');
      }
      // Save the user's preference to localStorage
      localStorage.setItem('theme', theme);
    }
  }, [theme]); // Re-run this effect whenever the theme state changes

  // Handler to toggle the theme
  const toggleTheme = () => {
    setTheme((prevTheme) => (prevTheme === Theme.Light ? Theme.Dark : Theme.Light));
  };

  // Don't render the button until the theme is determined client-side
  // to avoid hydration mismatch (server renders light, client might switch to dark)
  if (theme === null) {
    // Optionally render a placeholder or nothing
    return <div className="w-8 h-8" aria-hidden="true"></div>; // Placeholder with same size
  }

  // Render the button
  return (
    <button
      onClick={toggleTheme}
      aria-label={`Switch to ${theme === Theme.Light ? 'dark' : 'light'} mode`}
      title={`Switch to ${theme === Theme.Light ? 'dark' : 'light'} mode`}
      className="p-2 rounded-full text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] hover:bg-[var(--color-surface-alt)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary-focus)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--color-background)] transition-colors duration-200"
    >
      {theme === Theme.Light ? (
        <FaMoon className="w-5 h-5" aria-hidden="true" /> // Show Moon icon in light mode
      ) : (
        <FaSun className="w-5 h-5" aria-hidden="true" /> // Show Sun icon in dark mode
      )}
    </button>
  );
}