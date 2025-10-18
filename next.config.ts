import type { NextConfig } from "next";
import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin('./src/i18n/request.ts');

const nextConfig: NextConfig = {
  output: 'standalone',
  // Disable turbopack for production builds (not supported by OpenNext)
  turbo: undefined,
  experimental: {
    // Optimize for i18n
    optimizePackageImports: ['bootstrap-icons'],
    turbo: undefined,
  },
  async rewrites() {
    return [
      {
        source: '/2257',
        destination: '/section2257',
      },
      {
        source: '/:locale/2257',
        destination: '/:locale/section2257',
      },
    ];
  },
};

export default withNextIntl(nextConfig);
