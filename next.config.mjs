/** @type {import('next').NextConfig} */
const nextConfig = { images: {
    domains: ['lh3.googleusercontent.com','res.cloudinary.com'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
        port: '',
        pathname: '/deab9bxab/**',
      },
    ],
  },
  experimental: {
    serverActions: true,
  },};

export default nextConfig;
