import type { NextConfig } from "next";

/** @type {import('next').NextConfig} */
const nextConfig: NextConfig = {
  output: 'export',
  basePath: '/prompt-builder',
  assetPrefix: '/prompt-builder/',
  images: {
    unoptimized: true,
  },
  trailingSlash: true,
  distDir: 'build',
};

export default nextConfig;
