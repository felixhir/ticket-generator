import type { NextConfig } from "next";

const isProd = process.env.NODE_ENV === 'production';

const nextConfig: NextConfig = {
  output: 'export',
  images: { unoptimized: true },
  basePath: isProd ? '/ticket-generator' : '',
  assetPrefix: isProd ? '/ticket-generator/' : '',
  trailingSlash: true,
  publicRuntimeConfig: {
    basePath: isProd ? '/ticket-generator' : '',
  },
};

export default nextConfig;
