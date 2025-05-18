import withPWA from 'next-pwa';
import runtimeCaching from 'next-pwa/cache.js';
import bundleAnalyzer from '@next/bundle-analyzer';

const isProd = process.env.NODE_ENV === 'production';

const withBundleAnalyzer = bundleAnalyzer({
  enabled: process.env.ANALYZE === 'true',
});

const nextConfig = {
  reactStrictMode: false,
  experimental: {
    optimizePackageImports: ['@mantine/core', '@mantine/hooks'],
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  pwa: {
    dest: 'public',
    sw: 'sw.js',
    register: true,
    skipWaiting: true,
    disable: !isProd,
    runtimeCaching: [
      {
        urlPattern: /^\/$/,
        handler: 'NetworkFirst',
        options: {
          cacheName: 'start-url',
          networkTimeoutSeconds: 10,
          expiration: {
            maxEntries: 1,
          },
        },
      },
      {
        urlPattern: /^https?.*/,
        handler: 'NetworkFirst',
        options: {
          cacheName: 'http-cache',
          networkTimeoutSeconds: 10,
          expiration: {
            maxEntries: 50,
            maxAgeSeconds: 7 * 24 * 60 * 60, // 1 week
          },
        },
      },
      {
        urlPattern: /\/offline\.html$/,
        handler: 'CacheOnly',
        options: {
          cacheName: 'offline-cache',
        },
      },
    ],
    fallback: {
      document: '/offline.html',
    },
  },
};

export default withBundleAnalyzer(withPWA(nextConfig));
