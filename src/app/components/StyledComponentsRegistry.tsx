// src/components/StyledComponentsRegistry.tsx
'use client' // This MUST be a client component to use hooks

import React, { useState } from 'react'
import { useServerInsertedHTML } from 'next/navigation' // Import the specific hook
import { ServerStyleSheet, StyleSheetManager } from 'styled-components'

// Optional: Keep GlobalStyle definition if you want it here,
// but it's often better in layout.tsx or globals.css if using standard CSS.
// If you keep it, render it *inside* the final return based on environment.
// const GlobalStyle = createGlobalStyle` ... your styles ... `;

export default function StyledComponentsRegistry({
  children,
}: {
  children: React.ReactNode
}) {
  // Only create stylesheet once using lazy initial state
  const [styledComponentsStyleSheet] = useState(() => new ServerStyleSheet())

  useServerInsertedHTML(() => {
    // This hook runs server-side after the component tree renders
    const styles = styledComponentsStyleSheet.getStyleElement()
    // Clear the sheet's tags for the next render cycle
    // Use instance.clearTag() based on styled-components types/recommendations
    // Using @ts-ignore if types cause issues temporarily
    // @ts-ignore
    styledComponentsStyleSheet.instance.clearTag()
    // Return the collected style elements to be inserted into the <head>
    return <>{styles}</>
  })

  // --- Client-Side Rendering ---
  // If window is defined, we are on the client.
  // Return children directly, styles are already in the <head> or managed by client-side styled-components.
  if (typeof window !== 'undefined') {
    return <>{children}</>;
    // Alternatively, if you defined GlobalStyle above:
    // return <> <GlobalStyle /> {children} </>;
  }

  // --- Server-Side Rendering ---
  // Use StyleSheetManager to collect styles during SSR pass
  return (
    <StyleSheetManager sheet={styledComponentsStyleSheet.instance}>
       {/* If you defined GlobalStyle above, render it here too for SSR collection */}
       {/* <GlobalStyle /> */}
       {children}
    </StyleSheetManager>
  )
}