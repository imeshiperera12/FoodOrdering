import axios from "axios"

const API_URL = "http://localhost:5003/api/notifications"

// Create axios instance with base URL
const notificationApi = axios.create({
  baseURL: API_URL,
})

// Add token to requests if available
notificationApi.interceptors.request.use((config) => {
  const token = localStorage.getItem("token")
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

export const createNotification = async (notificationData: {
  userId: string
  type: "email" | "sms" | "push"
  content: string
  phone?: string
  email?: string
}) => {
  try {
    const response = await notificationApi.post("/", notificationData)
    return response.data
  } catch (error) {
    console.error("Error creating notification:", error)
    throw new Error("Failed to create notification")
  }
}

export const getNotificationsByUser = async (userId: string) => {
  try {
    const response = await notificationApi.get(`/user/${userId}`)
    return response.data
  } catch (error) {
    console.error(`Error fetching notifications for user ${userId}:`, error)
    throw new Error("Failed to fetch notifications")
  }
}

export const markAsRead = async (notificationId: string) => {
  try {
    const response = await notificationApi.put(`/read/${notificationId}`)
    return response.data
  } catch (error) {
    console.error(`Error marking notification ${notificationId} as read:`, error)
    throw new Error("Failed to mark notification as read")
  }
}

export const deleteNotification = async (notificationId: string) => {
  try {
    const response = await notificationApi.delete(`/${notificationId}`)
    return response.data
  } catch (error) {
    console.error(`Error deleting notification ${notificationId}:`, error)
    throw new Error("Failed to delete notification")
  }
}

export const getUnreadCount = async (userId: string) => {
  try {
    const response = await notificationApi.get(`/unread/${userId}`)
    return response.data.unreadCount
  } catch (error) {
    console.error(`Error fetching unread count for user ${userId}:`, error)
    throw new Error("Failed to fetch unread count")
  }
}

export const sendOrderNotification = async (userId: string, orderId: string, status: string) => {
  try {
    const content = `Your order #${orderId} has been ${status}.`
    const response = await notificationApi.post("/", {
      userId,
      type: "sms", // or "email" or "push"
      content,
    })
    return response.data
  } catch (error) {
    console.error(`Error sending order notification for order ${orderId}:`, error)
    // Don't throw here to prevent blocking the main flow if notification fails
    return null
  }
}
