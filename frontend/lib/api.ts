// lib/api.ts
"use client"

// Helper function for making API requests
async function fetchAPI(baseUrl: string, endpoint: string, options: RequestInit = {}) {
  const url = `${baseUrl}${endpoint}`;

  const defaultHeaders = {
    "Content-Type": "application/json",
  };

  let token = null;
  if (typeof window !== "undefined") {
    token = localStorage.getItem("token");
  }

  const headers = {
    ...defaultHeaders,
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers,
  };

  try {
    const response = await fetch(url, {
      ...options,
      headers,
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new Error(error.message || `Error ${response.status}: ${response.statusText}`);
    }

    return response.json();
  } catch (error) {
    console.error("API request failed:", error);
    throw error;
  }
}

// Service base URLs
const AUTH_API = process.env.NEXT_PUBLIC_AUTH_API!;
const RESTAURANT_API = process.env.NEXT_PUBLIC_RESTAURANT_API!;
const ORDER_API = process.env.NEXT_PUBLIC_ORDER_API!;
const PAYMENT_API = process.env.NEXT_PUBLIC_PAYMENT_API!;
const DELIVERY_API = process.env.NEXT_PUBLIC_DELIVERY_API!;
const LOCATION_API = process.env.NEXT_PUBLIC_LOCATION_API!;
const NOTIFICATION_API = process.env.NEXT_PUBLIC_NOTIFICATION_API!;

// ---------------- AUTH SERVICE ----------------
export const authAPI = {
  register: (userData: any) => fetchAPI(AUTH_API, "/api/auth/register", { method: "POST", body: JSON.stringify(userData) }),
  login: (email: string, password: string) => fetchAPI(AUTH_API, "/api/auth/login", { method: "POST", body: JSON.stringify({ email, password }) }),
  getUserById: (userId: string) => fetchAPI(AUTH_API, `/api/auth/${userId}`),
  updateProfile: (userData: any) => fetchAPI(AUTH_API, "/api/auth/profile", { method: "PUT", body: JSON.stringify(userData) }),
  addFavorite: (restaurantId: string) => fetchAPI(AUTH_API, "/api/auth/favorites", { method: "POST", body: JSON.stringify({ restaurantId }) }),
  getFavorites: () => fetchAPI(AUTH_API, "/api/auth/favorites"),
  removeFavorite: (restaurantId: string) => fetchAPI(AUTH_API, `/api/auth/favorites/${restaurantId}`, { method: "DELETE" }),
  getAllUsers: () => fetchAPI(AUTH_API, "/api/auth/users"),
  updateUserStatus: (userId: string, isActive: boolean) => fetchAPI(AUTH_API, `/api/auth/users/${userId}/status`, { method: "PATCH", body: JSON.stringify({ isActive }) }),
};

// ---------------- RESTAURANT SERVICE ----------------
export const restaurantAPI = {
  getRestaurants: (params?: any) => {
    const queryString = params ? `?${new URLSearchParams(params).toString()}` : "";
    return fetchAPI(RESTAURANT_API, `/api/restaurant${queryString}`);
  },
  getRestaurantById: (id: string) => fetchAPI(RESTAURANT_API, `/api/restaurant/${id}`),
  createRestaurant: (data: any) => fetchAPI(RESTAURANT_API, "/api/restaurant", { method: "POST", body: JSON.stringify(data) }),
  updateRestaurantAvailability: (id: string, isAvailable: boolean) => fetchAPI(RESTAURANT_API, `/api/restaurant/${id}/availability`, { method: "PATCH", body: JSON.stringify({ isAvailable }) }),
  verifyRestaurant: (id: string) => fetchAPI(RESTAURANT_API, `/api/restaurant/${id}/verify`, { method: "PATCH" }),
  addMenuItem: (restaurantId: string, menuData: any) => fetchAPI(RESTAURANT_API, `/api/restaurant/${restaurantId}/menu`, { method: "POST", body: JSON.stringify(menuData) }),
  updateMenuItem: (restaurantId: string, menuId: string, menuData: any) => fetchAPI(RESTAURANT_API, `/api/restaurant/${restaurantId}/menu/${menuId}`, { method: "PUT", body: JSON.stringify(menuData) }),
  deleteMenuItem: (restaurantId: string, menuId: string) => fetchAPI(RESTAURANT_API, `/api/restaurant/${restaurantId}/menu/${menuId}`, { method: "DELETE" }),
};

// ---------------- ORDER SERVICE ----------------
export const orderAPI = {
  createOrder: (data: any) => fetchAPI(ORDER_API, "/api/orders", { method: "POST", body: JSON.stringify(data) }),
  getOrders: () => fetchAPI(ORDER_API, "/api/orders"),
  getOrderById: (id: string) => fetchAPI(ORDER_API, `/api/orders/${id}`),
  updateOrder: (id: string, data: any) => fetchAPI(ORDER_API, `/api/orders/${id}`, { method: "PUT", body: JSON.stringify(data) }),
  deleteOrder: (id: string) => fetchAPI(ORDER_API, `/api/orders/${id}`, { method: "DELETE" }),
  getOrdersByCustomer: (customerId: string) => fetchAPI(ORDER_API, `/api/orders/customer/${customerId}`),
  getOrdersByStatus: (status: string) => fetchAPI(ORDER_API, `/api/orders/status/${status}`),
  getOrdersByRestaurant: (restaurantId: string) => fetchAPI(ORDER_API, `/api/orders/restaurant/${restaurantId}`),
  rateOrder: (orderId: string, rating: number, review: string) => fetchAPI(ORDER_API, `/api/orders/${orderId}/rate`, { method: "POST", body: JSON.stringify({ rating, review }) }),
  getAdminStats: () => fetchAPI(ORDER_API, "/api/orders/admin/stats"),
};

// ---------------- PAYMENT SERVICE ----------------
export const paymentAPI = {
  createPayment: (data: any) => fetchAPI(PAYMENT_API, "/api/payments/create", { method: "POST", body: JSON.stringify(data) }),
  getPaymentHistory: (userId: string) => fetchAPI(PAYMENT_API, `/api/payments/history/${userId}`),
  getPaymentDetails: (paymentId: string) => fetchAPI(PAYMENT_API, `/api/payments/${paymentId}`),
  confirmPayment: (paymentId: string) => fetchAPI(PAYMENT_API, `/api/payments/confirm/${paymentId}`, { method: "PUT" }),
  handlePaymentFailure: (paymentId: string, reason: string) => fetchAPI(PAYMENT_API, `/api/payments/failure/${paymentId}`, { method: "PUT", body: JSON.stringify({ reason }) }),
  getAdminPaymentStats: () => fetchAPI(PAYMENT_API, "/api/payments/stats/admin"),
};

// ---------------- DELIVERY SERVICE ----------------
export const deliveryAPI = {
  assignDelivery: (data: any) => fetchAPI(DELIVERY_API, "/api/delivery/assign", { method: "POST", body: JSON.stringify(data) }),
  getDeliveriesByDriver: (driverId: string) => fetchAPI(DELIVERY_API, `/api/delivery/driver/${driverId}`),
  updateDeliveryStatus: (deliveryId: string, status: string) => fetchAPI(DELIVERY_API, `/api/delivery/status/${deliveryId}`, { method: "PUT", body: JSON.stringify({ status }) }),
  trackDelivery: (orderId: string) => fetchAPI(DELIVERY_API, `/api/delivery/track/${orderId}`),
  rateDelivery: (deliveryId: string, rating: number, review: string) => fetchAPI(DELIVERY_API, `/api/delivery/rate/${deliveryId}`, { method: "POST", body: JSON.stringify({ rating, review }) }),
};

// ---------------- LOCATION TRACKER SERVICE ----------------
export const locationAPI = {
  getDeliveryPersonLocation: (agentId: string) => fetchAPI(LOCATION_API, `/api/location/${agentId}`),
  updateDeliveryPersonLocation: (agentId: string, latitude: number, longitude: number) => fetchAPI(LOCATION_API, `/api/location`, { method: "POST", body: JSON.stringify({ agentId, latitude, longitude }) }),
};

// ---------------- NOTIFICATION SERVICE ----------------
export const notificationAPI = {
  sendNotification: (data: any) => fetchAPI(NOTIFICATION_API, `/api/notifications`, { method: "POST", body: JSON.stringify(data) }),
};
