/** @type {import('next').NextConfig} */

// Shop is paused while supply & delivery are sorted out.
// Set to false (or delete the redirects block) to switch it back on.
const SHOP_PAUSED = true;

const nextConfig = {
  images: {
    remotePatterns: [{ protocol: 'https', hostname: 'firebasestorage.googleapis.com' }],
  },
  experimental: { serverActions: {} },
  async redirects() {
    if (!SHOP_PAUSED) return [];
    return [
      { source: '/products', destination: '/services', permanent: false },
      { source: '/products/:path*', destination: '/services', permanent: false },
      { source: '/cart', destination: '/services', permanent: false },
      { source: '/checkout', destination: '/services', permanent: false },
      { source: '/checkout/:path*', destination: '/services', permanent: false },
    ];
  },
};

module.exports = nextConfig;
