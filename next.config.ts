// next.config.js

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
