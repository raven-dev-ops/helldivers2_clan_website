// next.config.ts
import type { NextConfig } from 'next';
import { withSentryConfig } from '@sentry/nextjs';

const nextConfig: NextConfig = {
  compiler: { styledComponents: true },
  eslint: { ignoreDuringBuilds: false },
  typedRoutes: true,
  reactStrictMode: true,

  images: {
    remotePatterns: [
      { protocol: 'https', hostname: '**.behance.net' },
      { protocol: 'https', hostname: 'visitarrakis.com' },
      { protocol: 'https', hostname: 'cdn.fourthwall.com' },
      { protocol: 'https', hostname: 'static-cdn.jtvnw.net' },
      { protocol: 'https', hostname: 'cdn.discordapp.com' },
      // add more HTTPS hosts here if you embed new sources
    ],
  },

  async headers() {
    return [
      // 🔒 Global security headers (fix mixed content + harden defaults)
      {
        source: '/:path*',
        headers: [
          // Force long-term HTTPS for your whole site
          { key: 'Strict-Transport-Security', value: 'max-age=31536000; includeSubDomains; preload' },
          // Auto-upgrade any accidental http:// requests to https://
          { key: 'Content-Security-Policy', value: 'upgrade-insecure-requests' },
          // Sensible secure defaults
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          { key: 'X-Content-Type-Options', value: 'nosniff' },
        ],
      },

      // 📦 Long caching for big static assets
      {
        source: '/videos/:path*',
        headers: [{ key: 'Cache-Control', value: 'public, max-age=31536000, immutable' }],
      },
      {
        source: '/audio/:path*',
        headers: [{ key: 'Cache-Control', value: 'public, max-age=31536000, immutable' }],
      },
      // (optional) add similar cache for images if you want:
      // {
      //   source: '/images/:path*',
      //   headers: [{ key: 'Cache-Control', value: 'public, max-age=31536000, immutable' }],
      // },
    ];
  },

  // (optional) enforce HTTPS at the app layer if you ever serve over plain HTTP
  // async redirects() {
  //   return [
  //     {
  //       source: '/:path*',
  //       has: [{ type: 'header', key: 'x-forwarded-proto', value: 'http' }],
  //       destination: 'https://gptfleet.com/:path*',
  //       permanent: true,
  //     },
  //   ];
  // },
};

export default withSentryConfig(nextConfig, { silent: true });
