// next.config.js

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**.behance.net",
      },
      {
        protocol: "https",
        hostname: "visitarrakis.com",
      },
    ],
  },
};

module.exports = nextConfig;
