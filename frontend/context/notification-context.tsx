"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { useAuth } from "@/context/auth-context"
import { getNotificationsByUser, markAsRead, getUnreadCount } from "@/lib/api/notification-service"

export interface Notification {
  _id: string
  userId: string
  type: "order_update" | "delivery_update" | "promotion" | "system"
  title: string
  message: string
  read: boolean
  createdAt: string
  data?: {
    orderId?: string
    restaurantId?: string
    deliveryId?: string
    [key: string]: any
  }
}

interface NotificationContextType {
  notifications: Notification[]
  unreadCount: number
  isLoading: boolean
  markNotificationAsRead: (id: string) => Promise<void>
  markAllAsRead: () => Promise<void>
  refreshNotifications: () => Promise<void>
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined)

export function NotificationProvider({ children }: { children: ReactNode }) {
  const { user, isAuthenticated } = useAuth()
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [unreadCount, setUnreadCount] = useState(0)
  const [isLoading, setIsLoading] = useState(false)

  const fetchNotifications = async () => {
    if (!isAuthenticated || !user) return

    setIsLoading(true)
    try {
      const fetchedNotifications = await getNotificationsByUser(user.id)
      setNotifications(fetchedNotifications)

      const count = await getUnreadCount(user.id)
      setUnreadCount(count)
    } catch (error) {
      console.error("Failed to fetch notifications:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const markNotificationAsRead = async (id: string) => {
    try {
      await markAsRead(id)
      setNotifications((prev) =>
        prev.map((notification) => (notification._id === id ? { ...notification, read: true } : notification)),
      )
      setUnreadCount((prev) => Math.max(0, prev - 1))
    } catch (error) {
      console.error("Failed to mark notification as read:", error)
    }
  }

  const markAllAsRead = async () => {
    try {
      const promises = notifications
        .filter((notification) => !notification.read)
        .map((notification) => markAsRead(notification._id))

      await Promise.all(promises)

      setNotifications((prev) => prev.map((notification) => ({ ...notification, read: true })))
      setUnreadCount(0)
    } catch (error) {
      console.error("Failed to mark all notifications as read:", error)
    }
  }

  // Initial fetch
  useEffect(() => {
    if (isAuthenticated && user) {
      fetchNotifications()
    }
  }, [isAuthenticated, user])

  // Set up WebSocket connection for real-time notifications
  useEffect(() => {
    if (!isAuthenticated || !user) return

    // This is a mock implementation since we don't have an actual WebSocket server
    // In a real implementation, you would connect to your WebSocket server
    const mockWebSocketSetup = () => {
      console.log("Setting up WebSocket connection for notifications...")

      // Mock receiving a new notification every 30 seconds
      const interval = setInterval(() => {
        const mockTypes = ["order_update", "delivery_update", "promotion", "system"] as const
        const randomType = mockTypes[Math.floor(Math.random() * mockTypes.length)]

        const mockNotification: Notification = {
          _id: `mock-${Date.now()}`,
          userId: user.id,
          type: randomType,
          title: `New ${randomType.replace("_", " ")}`,
          message: `This is a mock ${randomType.replace("_", " ")} notification.`,
          read: false,
          createdAt: new Date().toISOString(),
          data: {},
        }

        // Add mock data based on notification type
        if (randomType === "order_update") {
          mockNotification.title = "Order status updated"
          mockNotification.message = "Your order has been confirmed and is being prepared."
          mockNotification.data = { orderId: `order-${Math.floor(Math.random() * 1000)}` }
        } else if (randomType === "delivery_update") {
          mockNotification.title = "Delivery update"
          mockNotification.message = "Your order is on the way! Estimated delivery in 15 minutes."
          mockNotification.data = {
            orderId: `order-${Math.floor(Math.random() * 1000)}`,
            deliveryId: `delivery-${Math.floor(Math.random() * 1000)}`,
          }
        }

        setNotifications((prev) => [mockNotification, ...prev])
        setUnreadCount((prev) => prev + 1)
      }, 30000) // Every 30 seconds

      return () => clearInterval(interval)
    }

    const cleanup = mockWebSocketSetup()

    return () => {
      if (cleanup) cleanup()
    }
  }, [isAuthenticated, user])

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        unreadCount,
        isLoading,
        markNotificationAsRead,
        markAllAsRead,
        refreshNotifications: fetchNotifications,
      }}
    >
      {children}
    </NotificationContext.Provider>
  )
}

export function useNotifications() {
  const context = useContext(NotificationContext)
  if (context === undefined) {
    throw new Error("useNotifications must be used within a NotificationProvider")
  }
  return context
}
