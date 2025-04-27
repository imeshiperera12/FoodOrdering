/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['localhost'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },
  env: {
    // Base URL for API requests
    NEXT_PUBLIC_API_BASE_URL: process.env.NEXT_PUBLIC_API_BASE_URL,
    
    // Auth Service
    NEXT_PUBLIC_AUTH_SERVICE_URL: process.env.NEXT_PUBLIC_AUTH_SERVICE_URL,
    
    // Restaurant Service
    NEXT_PUBLIC_RESTAURANT_SERVICE_URL: process.env.NEXT_PUBLIC_RESTAURANT_SERVICE_URL,
    
    // Order Service
    NEXT_PUBLIC_ORDER_SERVICE_URL: process.env.NEXT_PUBLIC_ORDER_SERVICE_URL,
    
    // Payment Service
    NEXT_PUBLIC_PAYMENT_SERVICE_URL: process.env.NEXT_PUBLIC_PAYMENT_SERVICE_URL,
    
    // Delivery Service
    NEXT_PUBLIC_DELIVERY_SERVICE_URL: process.env.NEXT_PUBLIC_DELIVERY_SERVICE_URL,
    
    // Location Tracker Service
    NEXT_PUBLIC_LOCATION_TRACKER_URL: process.env.NEXT_PUBLIC_LOCATION_TRACKER_URL,
    
    // Notification Service
    NEXT_PUBLIC_NOTIFICATION_SERVICE_URL: process.env.NEXT_PUBLIC_NOTIFICATION_SERVICE_URL,
  },
};

export default nextConfig;
