import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    domains: ['dbatkwuiwvpoxjjqfdfz.storage.supabase.co', 'images.unsplash.com'],
  },
};

export default nextConfig;
