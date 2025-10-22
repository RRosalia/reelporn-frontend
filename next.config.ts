import type { NextConfig } from "next";
import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin('./src/i18n/request.ts');

const nextConfig: NextConfig = {
  output: 'standalone',
  experimental: {
    turbopackFileSystemCacheForDev: true,
    optimizePackageImports: ['bootstrap-icons'],
    // Force Webpack in test mode to allow Babel instrumentation for code coverage
    ...(process.env.NEXT_PRIVATE_TEST_MODE === '1' && {
      turbo: undefined as any
    }),
  },
  skipMiddlewareUrlNormalize: true,
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
