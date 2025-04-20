// theme.ts (or themes.ts)
import { DefaultTheme } from 'styled-components';

export const defaultTheme: DefaultTheme = {
  background: '#1a1a2e',
  text: '#e0e0e0',
  accent: '#00bcd4',
};

export const helldiversTheme: DefaultTheme = {
  background: '#111111',
  text: '#fffeee',
  accent: '#cc3300',
};

export const themes: Record<string, DefaultTheme> = {
  default: defaultTheme,
  'helldivers-2': helldiversTheme,
  // Additional "division" themes as needed...
};
