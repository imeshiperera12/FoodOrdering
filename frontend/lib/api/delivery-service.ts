import axios from "axios"

const API_URL = "http://localhost:5010/api/delivery"

// Create axios instance with base URL
const deliveryApi = axios.create({
  baseURL: API_URL,
})

// Add token to requests if available
deliveryApi.interceptors.request.use((config) => {
  const token = localStorage.getItem("token")
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

export const assignDelivery = async (deliveryData: {
  orderId: string
  deliveryPersonId: string
  userId: string
  deliveryAddress: string
  deliveryFee: number
}) => {
  try {
    const response = await deliveryApi.post("/assign", deliveryData)
    return response.data
  } catch (error) {
    console.error("Error assigning delivery:", error)
    throw new Error("Failed to assign delivery")
  }
}

export const getDeliveriesByPerson = async (deliveryPersonId: string) => {
  try {
    const response = await deliveryApi.get(`/driver/${deliveryPersonId}`)
    return response.data
  } catch (error) {
    console.error(`Error fetching deliveries for person ${deliveryPersonId}:`, error)
    throw new Error("Failed to fetch deliveries")
  }
}

export const updateDeliveryStatus = async (deliveryId: string, status: string) => {
  try {
    const response = await deliveryApi.put(`/status/${deliveryId}`, { status })
    return response.data
  } catch (error) {
    console.error(`Error updating delivery status for ID ${deliveryId}:`, error)
    throw new Error("Failed to update delivery status")
  }
}

export const getDeliveryById = async (deliveryId: string) => {
  try {
    const response = await deliveryApi.get(`/${deliveryId}`)
    return response.data
  } catch (error) {
    console.error(`Error fetching delivery with ID ${deliveryId}:`, error)
    throw new Error("Failed to fetch delivery")
  }
}

export const trackDeliveryByOrderId = async (orderId: string) => {
  try {
    const response = await deliveryApi.get(`/track/${orderId}`)
    return response.data
  } catch (error) {
    console.error(`Error tracking delivery for order ${orderId}:`, error)
    throw new Error("Failed to track delivery")
  }
}

export const getActiveDeliveries = async (deliveryPersonId: string) => {
  try {
    const response = await deliveryApi.get(`/active/driver/${deliveryPersonId}`)
    return response.data
  } catch (error) {
    console.error(`Error fetching active deliveries for person ${deliveryPersonId}:`, error)
    throw new Error("Failed to fetch active deliveries")
  }
}

export const getAllActiveDeliveries = async () => {
  try {
    const response = await deliveryApi.get("/active/all")
    return response.data
  } catch (error) {
    console.error("Error fetching all active deliveries:", error)
    throw new Error("Failed to fetch all active deliveries")
  }
}

export const updateDeliveryEarnings = async (
  deliveryId: string,
  earningsData: {
    actualDeliveryTime: string
    additionalFees: number
  },
) => {
  try {
    const response = await deliveryApi.put(`/earnings/${deliveryId}`, earningsData)
    return response.data
  } catch (error) {
    console.error(`Error updating earnings for delivery ${deliveryId}:`, error)
    throw new Error("Failed to update delivery earnings")
  }
}

export const getDeliveryEarningsHistory = async (deliveryPersonId: string, startDate?: string, endDate?: string) => {
  try {
    let url = `/earnings/${deliveryPersonId}`
    if (startDate && endDate) {
      url += `?startDate=${startDate}&endDate=${endDate}`
    }
    const response = await deliveryApi.get(url)
    return response.data
  } catch (error) {
    console.error(`Error fetching earnings history for person ${deliveryPersonId}:`, error)
    throw new Error("Failed to fetch earnings history")
  }
}

export const rateDelivery = async (deliveryId: string, rating: number, feedback?: string) => {
  try {
    const response = await deliveryApi.post(`/rate/${deliveryId}`, { rating, feedback })
    return response.data
  } catch (error) {
    console.error(`Error rating delivery ${deliveryId}:`, error)
    throw new Error("Failed to rate delivery")
  }
}
