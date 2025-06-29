     /** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: [
      'media.wired.com',
      'static.vecteezy.com',
      'images.unsplash.com',
      'cdn.pixabay.com',
      'img.freepik.com',
      'media.istockphoto.com',
      'assets.bwbx.io',
      'www.reuters.com',
      'www.bloomberg.com',
      'www.cnbc.com',
      'www.wsj.com',
      'www.ft.com',
      'www.nytimes.com'
    ],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },
  // Disable ESLint during production builds
  eslint: {
    ignoreDuringBuilds: true,
  },
  // Disable TypeScript errors during production builds
  typescript: {
    ignoreBuildErrors: true,
  },
  // Load environment variables from parent directory
  env: {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000'
  },
};

export default nextConfig;
