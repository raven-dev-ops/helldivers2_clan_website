// next.config.ts
import { NextConfig } from 'next';

const nextConfig: NextConfig = {
  // enable styled‑components SWC transform
  compiler: {
    styledComponents: true,
  },

  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**.behance.net',
      },
      {
        protocol: 'https',
        hostname: 'visitarrakis.com',
      },
    ],
  },
};

export default nextConfig;
