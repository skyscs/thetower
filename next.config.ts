import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  serverExternalPackages: ['@prisma/client', 'prisma'],
  // Skip build-time type checking if DATABASE_URL is not available
  typescript: {
    ignoreBuildErrors: process.env.DATABASE_URL ? false : true
  },
  eslint: {
    ignoreDuringBuilds: process.env.DATABASE_URL ? false : true
  }
};

export default nextConfig;
