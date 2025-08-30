// next.config.ts
import type { NextConfig } from 'next';
import { withSentryConfig } from '@sentry/nextjs';

const securityHeaders = [
  { key: 'X-Content-Type-Options', value: 'nosniff' },
  { key: 'Strict-Transport-Security', value: 'max-age=63072000; includeSubDomains; preload' },
  { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
  { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
];

const nextConfig: NextConfig = {
  compiler: { styledComponents: true },
  eslint: { ignoreDuringBuilds: false },
  typedRoutes: true,
  reactStrictMode: true,
  poweredByHeader: false, // remove `x-powered-by`

  images: {
    remotePatterns: [
      { protocol: 'https', hostname: '**.behance.net' },
      { protocol: 'https', hostname: 'visitarrakis.com' },
      { protocol: 'https', hostname: 'cdn.fourthwall.com' },
      { protocol: 'https', hostname: 'static-cdn.jtvnw.net' },
      { protocol: 'https', hostname: 'cdn.discordapp.com' },
    ],
  },

  async headers() {
    return [
      // Global security headers everywhere
      { source: '/:path*', headers: securityHeaders },

      // Next build assets (CSS/JS): long cache + nosniff
      {
        source: '/_next/static/:path*',
        headers: [
          { key: 'Cache-Control', value: 'public, max-age=31536000, immutable' },
          { key: 'X-Content-Type-Options', value: 'nosniff' },
        ],
      },

      // Next media (fonts, etc.)
      {
        source: '/_next/static/media/:path*',
        headers: [
          { key: 'Cache-Control', value: 'public, max-age=31536000, immutable' },
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          // keep if fonts may be consumed cross-origin
          { key: 'Access-Control-Allow-Origin', value: '*' },
        ],
      },

      // Public images (shorter TTL unless you version filenames)
      {
        source: '/images/:path*',
        headers: [
          { key: 'Cache-Control', value: 'public, max-age=86400' }, // 1 day
          { key: 'X-Content-Type-Options', value: 'nosniff' },
        ],
      },

      // Your long-cache media buckets (add nosniff)
      {
        source: '/videos/:path*',
        headers: [
          { key: 'Cache-Control', value: 'public, max-age=31536000, immutable' },
          { key: 'X-Content-Type-Options', value: 'nosniff' },
        ],
      },
      {
        source: '/audio/:path*',
        headers: [
          { key: 'Cache-Control', value: 'public, max-age=31536000, immutable' },
          { key: 'X-Content-Type-Options', value: 'nosniff' },
        ],
      },
    ];
  },
};

export default withSentryConfig(nextConfig, { silent: true });
