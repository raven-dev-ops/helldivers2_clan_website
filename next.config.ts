// next.config.ts
import type { NextConfig } from 'next';
import { withSentryConfig } from '@sentry/nextjs';

const securityHeaders = () => {
  // NOTE: Adjust allow-lists as needed when you see CSP console warnings.
  const csp = [
    "default-src 'self'",
    "img-src 'self' data: https:",
    "media-src 'self' https:",
    "font-src 'self' data: https:",
    "connect-src 'self' https:",
    // 'unsafe-inline' is a starter fallback; refine with nonces/hashes as you harden.
    "script-src 'self' 'unsafe-inline' https:",
    "style-src 'self' 'unsafe-inline' https:"
  ].join('; ');

  const headers = [
    { key: 'X-Content-Type-Options', value: 'nosniff' },
    { key: 'X-Frame-Options', value: 'DENY' },
    { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
    { key: 'Permissions-Policy', value: 'geolocation=(), camera=(), microphone=()' },
    { key: 'Content-Security-Policy', value: csp },
  ];

  // Enable HSTS for HTTPS environments. If you serve HTTP locally, it’s harmless.
  headers.push({
    key: 'Strict-Transport-Security',
    value: 'max-age=31536000; includeSubDomains; preload',
  });

  return headers;
};

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
      { source: '/:path*', headers: securityHeaders() },

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
