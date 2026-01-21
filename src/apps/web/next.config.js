/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  transpilePackages: ['@vactit/ui', '@vactit/config', '@vactit/types'],
  eslint: {
    ignoreDuringBuilds: true,
  },
  // Experimental optimizations for faster navigation
  experimental: {
    // Enable optimistic client cache for faster back/forward navigation
    optimisticClientCache: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "mbfmmvhkqmdxqsqduqlz.supabase.co",
        pathname: "/storage/v1/object/**",
      },
    ],
  },
};

module.exports = nextConfig;

