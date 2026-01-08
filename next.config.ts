import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactStrictMode: true,
  images: {
    domains: ['images.unsplash.com', 'intranetproject.test'],
  },
  experimental: {
    serverActions: {
      bodySizeLimit: '10mb',
    },
    // Increased body size limit for middleware/proxy to prevent truncation
    // See: https://nextjs.org/docs/app/api-reference/config/next-config-js/proxyClientMaxBodySize
    proxyClientMaxBodySize: '10mb',
  },
};

export default nextConfig;
