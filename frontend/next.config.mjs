/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  async rewrites() {
    return [
      {
        source: '/api/auth/:path*',
        destination: 'http://localhost:5007/api/auth/:path*',
      },
      {
        source: '/api/orders/:path*',
        destination: 'http://localhost:5001/api/orders/:path*',
      },
      {
        source: '/api/restaurant/:path*',
        destination: 'http://localhost:5008/api/restaurant/:path*',
      },
      {
        source: '/api/payments/:path*',
        destination: 'http://localhost:5004/api/payments/:path*',
      },
      {
        source: '/api/delivery/:path*',
        destination: 'http://localhost:5010/api/delivery/:path*',
      },
      {
        source: '/api/location/:path*',
        destination: 'http://localhost:5009/api/location/:path*',
      },
      {
        source: '/api/notifications/:path*',
        destination: 'http://localhost:5003/api/notifications/:path*',
      },
    ]
  },
  images: {
    domains: ['example.com', 'randomuser.me'],
    unoptimized: true,
  },
}

export default nextConfig
