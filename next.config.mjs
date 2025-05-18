import withPWA from 'next-pwa';
import runtimeCaching from 'next-pwa/cache.js';

const config = {
  reactStrictMode: false,
  pwa: {
    dest: 'public',
    sw: 'sw.js',
    register: true,
    skipWaiting: true,
    disable: process.env.NODE_ENV !== 'production',
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
  eslint: {
    ignoreDuringBuilds: true,
  },
  experimental: {
    optimizePackageImports: ['@mantine/core', '@mantine/hooks'],
  },
};

export default withPWA(config);
