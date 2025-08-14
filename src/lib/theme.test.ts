import { describe, it, expect } from 'vitest';
import { themes, defaultTheme, helldiversTheme } from './theme';

describe('themes', () => {
  it('includes default and helldivers-2 themes', () => {
    expect(themes.default).toEqual(defaultTheme);
    expect(themes['helldivers-2']).toEqual(helldiversTheme);
  });
});
