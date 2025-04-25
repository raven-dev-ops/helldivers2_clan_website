// next.config.ts
import { NextConfig } from 'next';

const nextConfig: NextConfig = {
  compiler: { styledComponents: true },
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    remotePatterns: [
      // Keep your existing patterns
      { protocol: 'https', hostname: '**.behance.net' },
      { protocol: 'https', hostname: 'visitarrakis.com' },
      { protocol: 'https', hostname: 'cdn.fourthwall.com' }, // Keep this one

      // --- Add the Twitch CDN hostname ---
      {
        protocol: 'https',
        hostname: 'static-cdn.jtvnw.net', // <-- Add this hostname
        // pathname: '/jtv_user_pictures/**', // Optional: Restrict path if desired
      },
      // --- End of addition ---

    ],
  },
};

export default nextConfig;