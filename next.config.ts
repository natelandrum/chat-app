import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Allow images from specific domains
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'lh3.googleusercontent.com',
        port: '',
      },
    ],
  },
};

export default nextConfig;
