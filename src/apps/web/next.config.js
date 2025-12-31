/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  transpilePackages: ['@vactit/ui', '@vactit/config', '@vactit/types'],
  eslint: {
    ignoreDuringBuilds: true,
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
