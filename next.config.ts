import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'export',
  basePath: '/prompt-builder',
  assetPrefix: '/prompt-builder',
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
