// Configuration for the application
export const config = {
  // API base URLs
  apiUrls: {
    auth: process.env.NEXT_PUBLIC_AUTH_API_URL || "http://localhost:5007/api/auth",
    order: process.env.NEXT_PUBLIC_ORDER_API_URL || "http://localhost:5001/api/orders",
    restaurant: process.env.NEXT_PUBLIC_RESTAURANT_API_URL || "http://localhost:5008/api/restaurant",
    payment: process.env.NEXT_PUBLIC_PAYMENT_API_URL || "http://localhost:5004/api/payments",
    delivery: process.env.NEXT_PUBLIC_DELIVERY_API_URL || "http://localhost:5010/api/delivery",
    location: process.env.NEXT_PUBLIC_LOCATION_API_URL || "http://localhost:5009/api/location",
    notification: process.env.NEXT_PUBLIC_NOTIFICATION_API_URL || "http://localhost:5003/api/notifications",
  },

  // Stripe configuration
  stripe: {
    publishableKey: process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || "",
  },

  // Application settings
  app: {
    name: "FoodHub",
    description: "A complete food ordering and delivery platform",
  },

  // Default pagination settings
  pagination: {
    defaultLimit: 10,
    maxLimit: 50,
  },
}
