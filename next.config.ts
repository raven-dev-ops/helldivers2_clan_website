// next.config.ts
// Removed import { NextConfig } - Not strictly needed for this simple config object type
// import { NextConfig } from 'next'; // Keep if you use more complex NextConfig features elsewhere

const nextConfig = { // Use implicit type or explicitly add :NextConfig if preferred
  compiler: { styledComponents: true },
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    remotePatterns: [
      // Keep your existing patterns
      { protocol: 'https', hostname: '**.behance.net' },
      { protocol: 'https', hostname: 'visitarrakis.com' },
      { protocol: 'https', hostname: 'cdn.fourthwall.com' },
      { protocol: 'https', hostname: 'static-cdn.jtvnw.net' }, // Keep Twitch CDN

      // --- Add Discord CDN Hostnames ---
      {
        protocol: 'https',
        hostname: 'cdn.discordapp.com', // <-- Add this hostname
        // Optional: Restrict pathnames if desired
        // pathname: '/icons/**', // Allow server icons
        // pathname: '/avatars/**', // Allow user avatars
        // pathname: '/embed/avatars/**', // Allow default avatars
      },
      // Sometimes Discord might use other CDNs like images.discordapp.net
      // Add more if you encounter images from different Discord domains
      // {
      //   protocol: 'https',
      //   hostname: 'images.discordapp.net',
      // },
      // --- End of Discord Addition ---

    ],
  },
  // Add any other configurations you might have
  // reactStrictMode: true,
};

export default nextConfig;