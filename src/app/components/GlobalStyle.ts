'use client';

import { createGlobalStyle } from 'styled-components';

const GlobalStyle = createGlobalStyle`
  *,
  *::before,
  *::after {
    box-sizing: border-box;
  }

  body {
    margin: 0;
    padding: 0;
    background-color: ${(p) => p.theme.background};
    color: ${(p) => p.theme.text};
    font-family: sans-serif;
  }

  a {
    color: ${(p) => p.theme.accent};
    text-decoration: none;
  }
`;

export default GlobalStyle;
