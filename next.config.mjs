import bundleAnalyzer from '@next/bundle-analyzer';
import withPWA from 'next-pwa';

const isProd = process.env.NODE_ENV === 'production';
const withBundleAnalyzer = bundleAnalyzer({
  enabled: process.env.ANALYZE === 'true',
});

const config = {
  reactStrictMode: false,
  runtimeCaching: [
    {
      urlPattern: /^\/$/,
      handler: 'NetworkFirst',
      options: {
        cacheName: 'start-url',
        expiration: {
          maxEntries: 1,
        },
        networkTimeoutSeconds: 10,
        plugins: [
          {
            handlerDidError: async () => {
               return caches.match('/offline.html');
            },
          },
        ],
      },
    },
  ],
  pwa: {
    dest: 'public', 
    register: true,
    skipWaiting: true,
    disable: process.env.NODE_ENV !== 'production', 
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  experimental: {
    optimizePackageImports: ['@mantine/core', '@mantine/hooks'],
  },
  bundleAnalyzer: {
    enabled: isProd,
  },
};

export default withBundleAnalyzer(withPWA(config));
