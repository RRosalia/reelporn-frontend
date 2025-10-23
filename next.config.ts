import type { NextConfig } from "next";
import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin('./src/i18n/request.ts');

const nextConfig: NextConfig = {
  output: 'standalone',
  experimental: {
    turbopackFileSystemCacheForDev: true,
    optimizePackageImports: ['bootstrap-icons'],
  },
  skipMiddlewareUrlNormalize: true,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'cdn.reelporn.ai',
        pathname: '/images/**',
      },
    ],
  },
  async rewrites() {
    return {
      beforeFiles: [
        // Bypass i18n middleware for XML files
        {
          source: '/:path*.xml',
          destination: '/:path*.xml',
        },
      ],
      afterFiles: [
        {
          source: '/2257',
          destination: '/section2257',
        },
        {
          source: '/:locale/2257',
          destination: '/:locale/section2257',
        },
      ],
    };
  },
};

export default withNextIntl(nextConfig);
