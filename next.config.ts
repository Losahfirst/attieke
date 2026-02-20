import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'i.pinimg.com' },
      { protocol: 'https', hostname: 'abidjanplanet.ci' },
      { protocol: 'https', hostname: 'waki-ci.com' },
    ],
  },
};

export default nextConfig;
