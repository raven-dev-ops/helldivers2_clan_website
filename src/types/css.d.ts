// src/types/css.d.ts

import 'react';

declare module 'react' {
  interface CSSProperties {
    // Add properties that might be missing or need broader types
    appearance?: 'none' | 'auto' | 'slider-vertical' | (string & {}); // Allow standard values + slider-vertical + any string
    writingMode?: 'horizontal-tb' | 'vertical-rl' | 'vertical-lr' | 'sideways-rl' | 'sideways-lr' | (string & {}); // Allow standard values + any string
    // Add any other non-standard CSS properties you might use here
    // Example: backdropFilter?: string; (already often included, but just as an example)
  }
}