// src/components/StyledComponentsRegistry.tsx
'use client';

import React, { useState } from 'react';
import {
  ServerStyleSheet,
  StyleSheetManager,
  createGlobalStyle,
} from 'styled-components';

/** 1) Define your global styles here */
const GlobalStyle = createGlobalStyle`
  *, *::before, *::after {
    box-sizing: border-box;
  }
  html, body {
    margin: 0;
    padding: 0;
    background-color: #1a1a2e;
    color: #e0e0e0;
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
    scroll-behavior: smooth;
  }
  a {
    color: #00bcd4;
    text-decoration: none;
    transition: color 0.3s ease;
    &:hover { color: #0097a7; }
  }
`;

/** 2) Wrap everything in the styled‑components SSR manager */
export default function StyledComponentsRegistry({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sheet] = useState(() => new ServerStyleSheet());
  return (
    <StyleSheetManager sheet={sheet.instance}>
      <>
        <GlobalStyle />
        {children}
        {sheet.getStyleElement()}
      </>
    </StyleSheetManager>
  );
}
