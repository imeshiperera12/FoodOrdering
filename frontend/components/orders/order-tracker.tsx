"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CheckCircle2, Truck, Utensils } from "lucide-react"
import { orderAPI, deliveryAPI, locationAPI } from "@/lib/api"

type OrderStatus = "pending" | "confirmed" | "preparing" | "in_transit" | "delivered" | "cancelled"

type OrderStep = {
  id: string
  label: string
  time: string
  completed: boolean
}

type OrderTrackerProps = {
  orderId: string
}

export function OrderTracker({ orderId }: OrderTrackerProps) {
  const [orderStatus, setOrderStatus] = useState<OrderStatus | null>(null)
  const [estimatedDelivery, setEstimatedDelivery] = useState<string>("")
  const [currentTime, setCurrentTime] = useState<string>("")
  const [steps, setSteps] = useState<OrderStep[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [deliveryId, setDeliveryId] = useState<string | null>(null)
  const [driverId, setDriverId] = useState<string | null>(null)

  // Fetch order status
  useEffect(() => {
    const fetchOrderStatus = async () => {
      try {
        setLoading(true)
        const orderData = await orderAPI.getOrderById(orderId)

        setOrderStatus(orderData.status)

        // Format estimated delivery time
        const estimatedTime = new Date(orderData.estimatedDeliveryTime || Date.now() + 45 * 60000)
        setEstimatedDelivery(estimatedTime.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }))

        // Set current time
        setCurrentTime(new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }))

        // Create steps based on status
        const orderSteps: OrderStep[] = [
          {
            id: "placed",
            label: "Order Placed",
            time: new Date(orderData.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
            completed: true,
          },
          {
            id: "confirmed",
            label: "Order Confirmed",
            time: orderData.confirmedAt
              ? new Date(orderData.confirmedAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
              : "Pending",
            completed: ["confirmed", "preparing", "in_transit", "delivered"].includes(orderData.status),
          },
          {
            id: "preparing",
            label: "Preparing",
            time: orderData.preparingAt
              ? new Date(orderData.preparingAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
              : "Pending",
            completed: ["preparing", "in_transit", "delivered"].includes(orderData.status),
          },
          {
            id: "in_transit",
            label: "Out for Delivery",
            time: orderData.inTransitAt
              ? new Date(orderData.inTransitAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
              : "Pending",
            completed: ["in_transit", "delivered"].includes(orderData.status),
          },
          {
            id: "delivered",
            label: "Delivered",
            time: orderData.deliveredAt
              ? new Date(orderData.deliveredAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
              : estimatedTime.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
            completed: orderData.status === "delivered",
          },
        ]

        setSteps(orderSteps)

        // If order is in transit, fetch delivery info
        if (orderData.status === "in_transit" || orderData.status === "delivered") {
          try {
            const deliveryData = await deliveryAPI.trackDelivery(orderId)
            setDeliveryId(deliveryData._id)
            setDriverId(deliveryData.deliveryPersonId)
          } catch (err) {
            console.error("Failed to fetch delivery data:", err)
          }
        }

        setError(null)
      } catch (err) {
        console.error("Failed to fetch order status:", err)
        setError("Failed to load order status. Please try again later.")
      } finally {
        setLoading(false)
      }
    }

    fetchOrderStatus()

    // Set up polling for order status updates
    const intervalId = setInterval(() => {
      fetchOrderStatus()
      setCurrentTime(new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }))
    }, 30000) // Poll every 30 seconds

    return () => clearInterval(intervalId)
  }, [orderId])

  // Set up real-time location tracking if delivery is in progress
  useEffect(() => {
    if (!driverId || orderStatus !== "in_transit") return

    // In a real app, this would use WebSockets for real-time updates
    const locationInterval = setInterval(async () => {
      try {
        const locationData = await locationAPI.getDeliveryPersonLocation(driverId)
        console.log("Driver location updated:", locationData)
        // This would update a map component in a real app
      } catch (err) {
        console.error("Failed to fetch driver location:", err)
      }
    }, 10000) // Update every 10 seconds

    return () => clearInterval(locationInterval)
  }, [driverId, orderStatus])

  if (loading) {
    return (
      <Card className="mb-6">
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>Track Your Order</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex justify-center py-8">
            <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (error) {
    return (
      <Card className="mb-6">
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>Track Your Order</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-center text-red-500 py-4">{error}</div>
        </CardContent>
      </Card>
    )
  }

  const getStatusBadge = () => {
    switch (orderStatus) {
      case "pending":
        return <Badge className="bg-blue-500">Order Placed</Badge>
      case "confirmed":
        return <Badge className="bg-blue-500">Order Confirmed</Badge>
      case "preparing":
        return <Badge className="bg-yellow-500">Preparing</Badge>
      case "in_transit":
        return <Badge className="bg-purple-500">Out for Delivery</Badge>
      case "delivered":
        return <Badge className="bg-green-500">Delivered</Badge>
      case "cancelled":
        return (
          <Badge variant="outline" className="text-red-500 border-red-500">
            Cancelled
          </Badge>
        )
      default:
        return null
    }
  }

  return (
    <Card className="mb-6">
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle>Track Your Order</CardTitle>
          {getStatusBadge()}
        </div>
      </CardHeader>
      <CardContent>
        <div className="mb-6">
          <div className="flex justify-between items-center mb-2">
            <div className="text-sm text-muted-foreground">Estimated Delivery</div>
            <div className="text-sm text-muted-foreground">Current Time</div>
          </div>
          <div className="flex justify-between items-center">
            <div className="font-bold">{estimatedDelivery}</div>
            <div>{currentTime}</div>
          </div>
        </div>

        <div className="relative">
          {/* Progress line */}
          <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-muted" />

          {/* Steps */}
          <div className="space-y-8">
            {steps.map((step, index) => {
              const Icon =
                index === 0
                  ? CheckCircle2
                  : index === 1
                    ? CheckCircle2
                    : index === 2
                      ? Utensils
                      : index === 3
                        ? Truck
                        : CheckCircle2

              return (
                <div key={step.id} className="relative flex items-start">
                  <div
                    className={`absolute left-4 -translate-x-1/2 mt-1 h-8 w-8 rounded-full flex items-center justify-center ${
                      step.completed ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
                    }`}
                  >
                    <Icon className="h-5 w-5" />
                  </div>
                  <div className="ml-10">
                    <div className="font-medium">{step.label}</div>
                    <div className="text-sm text-muted-foreground">{step.time}</div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
