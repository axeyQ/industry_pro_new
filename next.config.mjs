/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['res.cloudinary.com', 'lh3.googleusercontent.com'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
        port: '',
        pathname: '/deab9bxab/**',
      },
    ],
  },  eslint: {
    ignoreDuringBuilds: true, // Add this line
  },
}


export default nextConfig;
