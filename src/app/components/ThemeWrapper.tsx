'use client';

import { useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';
import { ThemeProvider } from 'styled-components';
import { themes } from '@/lib/theme'; // Or wherever you keep it
import GlobalStyle from '@/app/components/GlobalStyle';

export default function ThemeWrapper({ children }: { children: React.ReactNode }) {
  const { status } = useSession();
  const [currentThemeKey, setCurrentThemeKey] = useState('default');

  useEffect(() => {
    if (status === 'authenticated') {
      fetch('/api/users/me')
        .then((r) => r.json())
        .then((user) => {
          // If your API returns something like { division: 'helldivers-2' }, 
          // store that key
          setCurrentThemeKey(user?.division ?? 'default');
        })
        .catch(() => {
          setCurrentThemeKey('default');
        });
    } else {
      // Not authenticated? Just use the default theme.
      setCurrentThemeKey('default');
    }
  }, [status]);

  // If the key doesn’t exist in `themes`, default back to 'default'
  const themeToUse = themes[currentThemeKey] || themes.default;

  return (
    <ThemeProvider theme={themeToUse}>
      <GlobalStyle />
      {children}
    </ThemeProvider>
  );
}
