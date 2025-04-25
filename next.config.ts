// next.config.ts
import { NextConfig } from 'next';

const nextConfig: NextConfig = {
  compiler: { styledComponents: true },
  eslint: {
    // disables eslint errors from failing `next build`
    ignoreDuringBuilds: true,
  },
  images: {
    remotePatterns: [
      // Keep your existing patterns
      { protocol: 'https', hostname: '**.behance.net' },
      { protocol: 'https', hostname: 'visitarrakis.com' },

      // --- Add the Fourthwall CDN hostname ---
      {
        protocol: 'https',
        hostname: 'cdn.fourthwall.com',
        // Optional: Add pathname if you want to restrict it further,
        // otherwise it allows any path on this hostname.
        // pathname: '/customization/**',
      },
      // --- End of addition ---

    ],
    // Remove the older 'domains' array if you had it
    // domains: [],
  },
};

export default nextConfig;