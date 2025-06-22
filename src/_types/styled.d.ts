// styled.d.ts
import 'styled-components';

// Declare what your theme object looks like:
declare module 'styled-components' {
  export interface DefaultTheme {
    background: string;
    text: string;
    accent: string;
  }
}
