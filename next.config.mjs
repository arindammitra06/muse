import bundleAnalyzer from '@next/bundle-analyzer';
import withPWA from 'next-pwa';

const isProd = process.env.NODE_ENV === 'production';
const withBundleAnalyzer = bundleAnalyzer({
  enabled: process.env.ANALYZE === 'true',
});

const config = {
  reactStrictMode: false,
  pwa: {
    dest: 'public', 
    disable: process.env.NODE_ENV !== 'production', 
    register: true,
    skipWaiting: true,
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
