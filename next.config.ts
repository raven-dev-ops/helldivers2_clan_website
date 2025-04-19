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
      { protocol: 'https', hostname: '**.behance.net' },
      { protocol: 'https', hostname: 'visitarrakis.com' },
    ],
  },
};

export default nextConfig;
