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
};

export default nextConfig;
