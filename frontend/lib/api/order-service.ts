import axios from "axios"

const API_URL = "http://localhost:5001/api/orders"

// Create axios instance with base URL
const orderApi = axios.create({
  baseURL: API_URL,
})

// Add token to requests if available
orderApi.interceptors.request.use((config) => {
  const token = localStorage.getItem("token")
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

export const createOrder = async (orderData: any) => {
  try {
    const response = await orderApi.post("/", orderData)
    return response.data
  } catch (error) {
    console.error("Error creating order:", error)
    throw new Error("Failed to create order")
  }
}

export const getCustomerOrders = async (customerId: string) => {
  try {
    const response = await orderApi.get(`/customer/${customerId}`)
    return response.data
  } catch (error) {
    console.error("Error fetching customer orders:", error)
    throw new Error("Failed to fetch orders")
  }
}

export const getOrderById = async (orderId: string) => {
  try {
    const response = await orderApi.get(`/${orderId}`)
    return response.data
  } catch (error) {
    console.error(`Error fetching order with ID ${orderId}:`, error)
    throw new Error("Failed to fetch order")
  }
}

export const updateOrderStatus = async (orderId: string, status: string) => {
  try {
    const response = await orderApi.put(`/${orderId}`, { status })
    return response.data
  } catch (error) {
    console.error(`Error updating order status for ID ${orderId}:`, error)
    throw new Error("Failed to update order status")
  }
}

export const updateOrder = async (orderId: string, orderData: any) => {
  try {
    const response = await orderApi.put(`/customer/${orderId}`, orderData)
    return response.data
  } catch (error) {
    console.error(`Error updating order with ID ${orderId}:`, error)
    throw new Error("Failed to update order")
  }
}

export const deleteOrder = async (orderId: string) => {
  try {
    const response = await orderApi.delete(`/${orderId}`)
    return response.data
  } catch (error) {
    console.error(`Error deleting order with ID ${orderId}:`, error)
    throw new Error("Failed to delete order")
  }
}

export const getOrdersByStatus = async (status: string) => {
  try {
    const response = await orderApi.get(`/status/${status}`)
    return response.data
  } catch (error) {
    console.error(`Error fetching orders with status ${status}:`, error)
    throw new Error("Failed to fetch orders by status")
  }
}

export const getOrdersByRestaurant = async (restaurantId: string) => {
  try {
    const response = await orderApi.get(`/restaurant/${restaurantId}`)
    return response.data
  } catch (error) {
    console.error(`Error fetching orders for restaurant ${restaurantId}:`, error)
    throw new Error("Failed to fetch restaurant orders")
  }
}

export const getRestaurantOrderStats = async (restaurantId: string) => {
  try {
    const response = await orderApi.get(`/stats/${restaurantId}`)
    return response.data
  } catch (error) {
    console.error(`Error fetching order stats for restaurant ${restaurantId}:`, error)
    throw new Error("Failed to fetch restaurant order stats")
  }
}

export const getAllOrderStats = async () => {
  try {
    const response = await orderApi.get("/admin/stats")
    return response.data
  } catch (error) {
    console.error("Error fetching all order stats:", error)
    throw new Error("Failed to fetch order stats")
  }
}

export const rateOrder = async (orderId: string, rating: number, review?: string) => {
  try {
    const response = await orderApi.post(`/${orderId}/rate`, { rating, review })
    return response.data
  } catch (error) {
    console.error(`Error rating order ${orderId}:`, error)
    throw new Error("Failed to submit rating")
  }
}
