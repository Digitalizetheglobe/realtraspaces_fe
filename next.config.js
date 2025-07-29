// next.config.js

/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    // Warning: This allows production builds to successfully complete even if
    // your project has ESLint errors.
    ignoreDuringBuilds: true,
  },
  images: {
    unoptimized: true,
    domains: [
      'example.com', // Add any other domains your images come from
    ],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'unsplash.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'api.realtraspaces.com',
        port: '',
        pathname: '/**',
      },
      // {
      //   protocol: 'http',
      //   hostname: 'localhost',
      //   port: '8000',
      //   pathname: '/**',
      // },
    ],
  },
};

module.exports = nextConfig;