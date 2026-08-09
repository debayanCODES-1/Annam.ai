import nextPWA from 'next-pwa';

const isProd = process.env.NODE_ENV === 'production';

const nextConfig = nextPWA({
  dest: 'public',
  disable: !isProd,
  register: true,
  skipWaiting: true,
  reactStrictMode: true,
  turbopack: {},
  images: {
    remotePatterns: [],
  },
  typescript: {
    ignoreBuildErrors: false,
  },
});

export default nextConfig;
