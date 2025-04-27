// Base URL for API requests
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000"

// Helper function for making API requests
async function fetchAPI(endpoint: string, options: RequestInit = {}) {
  const url = `${API_BASE_URL}${endpoint}`

  const defaultHeaders = {
    "Content-Type": "application/json",
  }

  // Get token from localStorage if available (client-side only)
  let token = null
  if (typeof window !== "undefined") {
    token = localStorage.getItem("token")
  }

  const headers = {
    ...defaultHeaders,
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers,
  }

  try {
    const response = await fetch(url, {
      ...options,
      headers,
    })

    if (!response.ok) {
      // Handle error responses
      const error = await response.json().catch(() => ({}))
      throw new Error(error.message || `Error ${response.status}: ${response.statusText}`)
    }

    return response.json()
  } catch (error) {
    console.error("API request failed:", error)
    throw error
  }
}

// Auth Service API (port 5007)
export const authAPI = {
  register: (userData: any) =>
    fetchAPI("/api/auth/register", {
      method: "POST",
      body: JSON.stringify(userData),
    }),

  login: (email: string, password: string) =>
    fetchAPI("/api/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    }),

  getUserById: (userId: string) => fetchAPI(`/api/auth/${userId}`),

  updateProfile: (userData: any) =>
    fetchAPI("/api/auth/profile", {
      method: "PUT",
      body: JSON.stringify(userData),
    }),

  addFavorite: (restaurantId: string) =>
    fetchAPI("/api/auth/favorites", {
      method: "POST",
      body: JSON.stringify({ restaurantId }),
    }),

  getFavorites: () => fetchAPI("/api/auth/favorites"),

  removeFavorite: (restaurantId: string) =>
    fetchAPI(`/api/auth/favorites/${restaurantId}`, {
      method: "DELETE",
    }),

  getAllUsers: () => fetchAPI("/api/auth/users"),

  updateUserStatus: (userId: string, status: boolean) =>
    fetchAPI(`/api/auth/users/${userId}/status`, {
      method: "PATCH",
      body: JSON.stringify({ status }),
    }),
}

// Restaurant Service API (port 5008)
export const restaurantAPI = {
  getRestaurants: (params?: any) => {
    const queryString = params ? `?${new URLSearchParams(params).toString()}` : ""
    return fetchAPI(`/api/restaurant${queryString}`)
  },

  getRestaurantById: (id: string) => fetchAPI(`/api/restaurant/${id}`),

  createRestaurant: (restaurantData: any) =>
    fetchAPI("/api/restaurant", {
      method: "POST",
      body: JSON.stringify(restaurantData),
    }),

  updateRestaurantAvailability: (id: string, isAvailable: boolean) =>
    fetchAPI(`/api/restaurant/${id}/availability`, {
      method: "PATCH",
      body: JSON.stringify({ isAvailable }),
    }),

  verifyRestaurant: (id: string) =>
    fetchAPI(`/api/restaurant/${id}/verify`, {
      method: "PATCH",
    }),

  // Menu operations
  addMenuItem: (restaurantId: string, menuData: any) =>
    fetchAPI(`/api/restaurant/${restaurantId}/menu`, {
      method: "POST",
      body: JSON.stringify(menuData),
    }),

  updateMenuItem: (restaurantId: string, menuId: string, menuData: any) =>
    fetchAPI(`/api/restaurant/${restaurantId}/menu/${menuId}`, {
      method: "PUT",
      body: JSON.stringify(menuData),
    }),

  deleteMenuItem: (restaurantId: string, menuId: string) =>
    fetchAPI(`/api/restaurant/${restaurantId}/menu/${menuId}`, {
      method: "DELETE",
    }),
}

// Order Service API (port 5001)
export const orderAPI = {
  createOrder: (orderData: any) =>
    fetchAPI("/api/orders", {
      method: "POST",
      body: JSON.stringify(orderData),
    }),

  getOrders: () => fetchAPI("/api/orders"),

  getOrderById: (id: string) => fetchAPI(`/api/orders/${id}`),

  updateOrder: (id: string, orderData: any) =>
    fetchAPI(`/api/orders/${id}`, {
      method: "PUT",
      body: JSON.stringify(orderData),
    }),

  updateCustomerOrder: (orderId: string, orderData: any) =>
    fetchAPI(`/api/orders/customer/${orderId}`, {
      method: "PUT",
      body: JSON.stringify(orderData),
    }),

  deleteOrder: (id: string) =>
    fetchAPI(`/api/orders/${id}`, {
      method: "DELETE",
    }),

  getOrdersByCustomer: (customerId: string) => fetchAPI(`/api/orders/customer/${customerId}`),

  getOrdersByStatus: (status: string) => fetchAPI(`/api/orders/status/${status}`),

  getOrdersByRestaurant: (restaurantId: string) => fetchAPI(`/api/orders/restaurant/${restaurantId}`),

  getRestaurantStats: (restaurantId: string) => fetchAPI(`/api/orders/stats/${restaurantId}`),

  rateOrder: (orderId: string, rating: number, review: string) =>
    fetchAPI(`/api/orders/${orderId}/rate`, {
      method: "POST",
      body: JSON.stringify({ rating, review }),
    }),

  getAdminStats: () => fetchAPI("/api/orders/admin/stats"),
}

// Payment Service API (port 5004)
export const paymentAPI = {
  createPayment: (paymentData: any) =>
    fetchAPI("/api/payments/create", {
      method: "POST",
      body: JSON.stringify(paymentData),
    }),

  getPaymentHistory: (userId: string) => fetchAPI(`/api/payments/history/${userId}`),

  getPaymentDetails: (paymentId: string) => fetchAPI(`/api/payments/${paymentId}`),

  confirmPayment: (paymentId: string) =>
    fetchAPI(`/api/payments/confirm/${paymentId}`, {
      method: "PUT",
    }),

  handlePaymentFailure: (paymentId: string, reason: string) =>
    fetchAPI(`/api/payments/failure/${paymentId}`, {
      method: "PUT",
      body: JSON.stringify({ reason }),
    }),

  getAdminPaymentStats: () => fetchAPI("/api/payments/stats/admin"),
}

// Delivery Service API (port 5010)
export const deliveryAPI = {
  assignDelivery: (deliveryData: any) =>
    fetchAPI("/api/delivery/assign", {
      method: "POST",
      body: JSON.stringify(deliveryData),
    }),

  getDeliveriesByDriver: (driverId: string) => fetchAPI(`/api/delivery/driver/${driverId}`),

  updateDeliveryStatus: (deliveryId: string, status: string) =>
    fetchAPI(`/api/delivery/status/${deliveryId}`, {
      method: "PUT",
      body: JSON.stringify({ status }),
    }),

  getDeliveryById: (deliveryId: string) => fetchAPI(`/api/delivery/${deliveryId}`),

  trackDelivery: (orderId: string) => fetchAPI(`/api/delivery/track/${orderId}`),

  getActiveDeliveriesForDriver: (driverId: string) => fetchAPI(`/api/delivery/active/driver/${driverId}`),

  getAllActiveDeliveries: () => fetchAPI("/api/delivery/active/all"),

  updateDeliveryEarnings: (deliveryId: string, earnings: number) =>
    fetchAPI(`/api/delivery/earnings/${deliveryId}`, {
      method: "PUT",
      body: JSON.stringify({ earnings }),
    }),

  getDeliveryEarningsHistory: (driverId: string, startDate: string, endDate: string) =>
    fetchAPI(`/api/delivery/earnings/${driverId}?startDate=${startDate}&endDate=${endDate}`),

  rateDelivery: (deliveryId: string, rating: number, review: string) =>
    fetchAPI(`/api/delivery/rate/${deliveryId}`, {
      method: "POST",
      body: JSON.stringify({ rating, review }),
    }),
}

// Location Tracker API (port 5009)
export const locationAPI = {
  getDeliveryPersonLocation: (agentId: string) => fetchAPI(`/api/location/${agentId}`),

  updateDeliveryPersonLocation: (agentId: string, latitude: number, longitude: number) =>
    fetchAPI("/api/location", {
      method: "POST",
      body: JSON.stringify({ agentId, latitude, longitude }),
    }),
}

// Notification Service API (port 5003)
export const notificationAPI = {
  sendNotification: (notificationData: any) =>
    fetchAPI("/api/notifications", {
      method: "POST",
      body: JSON.stringify(notificationData),
    }),
}
