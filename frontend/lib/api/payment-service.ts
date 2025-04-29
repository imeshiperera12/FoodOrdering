import axios from "axios"

const API_URL = process.env.NEXT_PUBLIC_PAYMENT_API_URL || "http://localhost:5004/api/payments"

// Create axios instance with base URL
const paymentApi = axios.create({
  baseURL: API_URL,
})

// Add token to requests if available
paymentApi.interceptors.request.use((config) => {
  const token = localStorage.getItem("token")
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

export const createPayment = async (paymentData: {
  orderId: string
  userId: string
  amount: number
  paymentMethod: string
}) => {
  try {
    const response = await paymentApi.post("/create", paymentData)
    return response.data
  } catch (error) {
    console.error("Error creating payment:", error)
    throw new Error("Failed to create payment")
  }
}

export const confirmPayment = async (paymentId: string) => {
  try {
    const response = await paymentApi.put(`/confirm/${paymentId}`)
    return response.data
  } catch (error) {
    console.error(`Error confirming payment ${paymentId}:`, error)
    throw new Error("Failed to confirm payment")
  }
}

export const getPaymentById = async (paymentId: string) => {
  try {
    const response = await paymentApi.get(`/${paymentId}`)
    return response.data
  } catch (error) {
    console.error(`Error fetching payment with ID ${paymentId}:`, error)
    throw new Error("Failed to fetch payment")
  }
}

export const getUserPayments = async (userId: string) => {
  try {
    const response = await paymentApi.get(`/history/${userId}`)
    return response.data
  } catch (error) {
    console.error(`Error fetching payment history for user ${userId}:`, error)
    throw new Error("Failed to fetch user payments")
  }
}

export const handlePaymentFailure = async (paymentId: string, reason: string) => {
  try {
    const response = await paymentApi.put(`/failure/${paymentId}`, { reason })
    return response.data
  } catch (error) {
    console.error(`Error handling payment failure for ID ${paymentId}:`, error)
    throw new Error("Failed to handle payment failure")
  }
}

export const getPaymentStats = async () => {
  try {
    const response = await paymentApi.get("/stats/admin")
    return response.data
  } catch (error) {
    console.error("Error fetching payment stats:", error)
    throw new Error("Failed to fetch payment stats")
  }
}
