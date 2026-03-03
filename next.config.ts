import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'i.pinimg.com' },
      { protocol: 'https', hostname: 'abidjanplanet.ci' },
      { protocol: 'https', hostname: 'waki-ci.com' },
      { protocol: 'https', hostname: 'www.umnews.org' },
      { protocol: 'https', hostname: 'images.unsplash.com' },
      { protocol: 'https', hostname: 'ichef.bbci.co.uk' },
      { protocol: 'https', hostname: 'www.mangeonsbien.com' },
      { protocol: 'https', hostname: 'media-files.abidjan.net' },
      { protocol: 'https', hostname: 'upload.wikimedia.org' },
      { protocol: 'https', hostname: 'www.afrik.com' },
    ],
  },
};

export default nextConfig;
