"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { useToast } from "@/components/ui/use-toast"
import { useAuth } from "@/context/auth-context"
import { trackDeliveryByOrderId } from "@/lib/api/delivery-service"
import { getOrderById } from "@/lib/api/order-service"
import { UtensilsCrossed, MapPin, Clock, Truck, Phone, ArrowLeft, MessageCircle } from "lucide-react"
import DeliveryMap from "@/components/delivery-map"
import OrderTimeline from "@/components/order-timeline"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { io } from "socket.io-client"

export default function TrackOrderPage() {
  const { id } = useParams()
  const { user, isAuthenticated } = useAuth()
  const { toast } = useToast()
  const [delivery, setDelivery] = useState<any>(null)
  const [order, setOrder] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [progress, setProgress] = useState(0)
  const [estimatedTime, setEstimatedTime] = useState<string | null>(null)

  useEffect(() => {
    if (!isAuthenticated) {
      return
    }

    const fetchOrderAndDelivery = async () => {
      try {
        // Fetch order details
        const orderData = await getOrderById(id as string)
        setOrder(orderData)

        // Fetch delivery tracking info
        const deliveryData = await trackDeliveryByOrderId(id as string)
        setDelivery(deliveryData)

        // Set progress based on status
        if (orderData.status === "confirmed") setProgress(25)
        else if (orderData.status === "preparing") setProgress(40)
        else if (deliveryData.status === "assigned") setProgress(50)
        else if (deliveryData.status === "picked_up") setProgress(75)
        else if (deliveryData.status === "delivering") setProgress(90)
        else if (deliveryData.status === "delivered") setProgress(100)

        // Calculate estimated delivery time
        if (deliveryData.estimatedDeliveryTime) {
          const estimatedDelivery = new Date(deliveryData.estimatedDeliveryTime)
          const now = new Date()
          const diffMinutes = Math.round((estimatedDelivery.getTime() - now.getTime()) / 60000)

          if (diffMinutes > 0) {
            setEstimatedTime(`${diffMinutes} minutes`)
          } else {
            setEstimatedTime("Any moment now")
          }
        } else {
          setEstimatedTime("15-20 minutes")
        }
      } catch (error) {
        toast({
          variant: "destructive",
          title: "Failed to load tracking information",
          description: "There was an error loading the order tracking information.",
        })
      } finally {
        setIsLoading(false)
      }
    }

    fetchOrderAndDelivery()

    // Set up socket connection for real-time updates
    const socket = io(process.env.NEXT_PUBLIC_NOTIFICATION_API_URL || "")

    socket.on("connect", () => {
      console.log("Connected to notification server")
      socket.emit("join", { orderId: id, userId: user?.id })
    })

    socket.on("orderUpdate", (data) => {
      if (data.orderId === id) {
        fetchOrderAndDelivery()
        toast({
          title: "Order Update",
          description: data.message,
        })
      }
    })

    socket.on("locationUpdate", (data) => {
      if (data.orderId === id) {
        setDelivery((prev) => ({
          ...prev,
          liveLocation: data.location,
        }))
      }
    })

    // Set up polling for updates every 30 seconds as fallback
    const interval = setInterval(fetchOrderAndDelivery, 30000)

    return () => {
      clearInterval(interval)
      socket.disconnect()
    }
  }, [id, isAuthenticated, toast, user?.id])

  if (isLoading) {
    return (
      <div className="flex min-h-screen flex-col">
        <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <div className="container flex h-16 items-center">
            <Link href="/" className="flex items-center gap-2">
              <UtensilsCrossed className="h-6 w-6" />
              <span className="text-xl font-bold">FoodHub</span>
            </Link>
          </div>
        </header>
        <main className="flex-1 py-12">
          <div className="container px-4 md:px-6">
            <div className="flex items-center justify-center h-full">
              <p>Loading tracking information...</p>
            </div>
          </div>
        </main>
      </div>
    )
  }

  const getStatusBadge = () => {
    if (!order) return null

    let color = ""
    switch (order.status) {
      case "pending":
        color = "bg-yellow-100 text-yellow-800"
        break
      case "confirmed":
        color = "bg-blue-100 text-blue-800"
        break
      case "preparing":
        color = "bg-purple-100 text-purple-800"
        break
      case "ready":
        color = "bg-green-100 text-green-800"
        break
      case "delivered":
        color = "bg-green-100 text-green-800"
        break
      case "cancelled":
        color = "bg-red-100 text-red-800"
        break
      default:
        color = "bg-gray-100 text-gray-800"
    }

    return <Badge className={`${color} capitalize`}>{order.status.replace("_", " ")}</Badge>
  }

  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <UtensilsCrossed className="h-6 w-6" />
            <span className="text-xl font-bold">FoodHub</span>
          </Link>
          <nav className="hidden md:flex gap-6">
            <Link href="/restaurants" className="text-sm font-medium">
              Restaurants
            </Link>
            <Link href="/orders" className="text-sm font-medium">
              Orders
            </Link>
            <Link href="/profile" className="text-sm font-medium">
              Profile
            </Link>
          </nav>
        </div>
      </header>
      <main className="flex-1 py-8">
        <div className="container px-4 md:px-6">
          <div className="mb-6 flex items-center">
            <Link href="/orders" className="mr-4">
              <Button variant="ghost" size="icon">
                <ArrowLeft className="h-4 w-4" />
                <span className="sr-only">Back to orders</span>
              </Button>
            </Link>
            <div>
              <h1 className="text-2xl font-bold">Order #{id}</h1>
              <div className="flex items-center gap-2 mt-1">
                {getStatusBadge()}
                <span className="text-sm text-muted-foreground">
                  {order?.createdAt ? new Date(order.createdAt).toLocaleString() : ""}
                </span>
              </div>
            </div>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            <div className="md:col-span-2 space-y-6">
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle>Live Tracking</CardTitle>
                  <CardDescription>Real-time location of your delivery</CardDescription>
                </CardHeader>
                <CardContent className="p-0">
                  <div className="aspect-video w-full">
                    {delivery?.liveLocation ? (
                      <DeliveryMap
                        deliveryLocation={delivery.liveLocation}
                        destinationAddress={delivery.deliveryAddress}
                        restaurantLocation={order?.restaurant?.location}
                      />
                    ) : (
                      <div className="flex items-center justify-center h-full bg-muted">
                        <p className="text-muted-foreground">Waiting for delivery person to start the journey</p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Order Timeline</CardTitle>
                </CardHeader>
                <CardContent>
                  <OrderTimeline order={order} delivery={delivery} />
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Order Details</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <h3 className="font-medium mb-2">Items</h3>
                      <div className="space-y-2">
                        {order?.items?.map((item: any, index: number) => (
                          <div key={index} className="flex justify-between">
                            <div>
                              <span>{item.quantity}x </span>
                              <span>{item.name}</span>
                            </div>
                            <span>${(item.price * item.quantity).toFixed(2)}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <Separator />

                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span>Subtotal</span>
                        <span>${order?.subtotal?.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Delivery Fee</span>
                        <span>${order?.deliveryFee?.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Tax</span>
                        <span>${order?.tax?.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between font-bold">
                        <span>Total</span>
                        <span>${order?.total?.toFixed(2)}</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Delivery Status</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div>
                      <div className="flex justify-between mb-2">
                        <span className="text-sm font-medium">Progress</span>
                        <span className="text-sm font-medium">{progress}%</span>
                      </div>
                      <Progress value={progress} className="h-2" />
                    </div>

                    <div className="space-y-4">
                      <div className="flex items-start gap-3">
                        <Clock className="h-5 w-5 text-muted-foreground mt-0.5" />
                        <div>
                          <p className="font-medium">Estimated Delivery</p>
                          <p className="text-sm text-muted-foreground">{estimatedTime}</p>
                        </div>
                      </div>

                      <div className="flex items-start gap-3">
                        <MapPin className="h-5 w-5 text-muted-foreground mt-0.5" />
                        <div>
                          <p className="font-medium">Delivery Address</p>
                          <p className="text-sm text-muted-foreground">
                            {delivery?.deliveryAddress || order?.deliveryAddress}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {delivery?.deliveryPerson && (
                <Card>
                  <CardHeader>
                    <CardTitle>Delivery Person</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center gap-4 mb-4">
                      <div className="h-12 w-12 rounded-full bg-muted flex items-center justify-center">
                        {delivery.deliveryPerson.image ? (
                          <img
                            src={delivery.deliveryPerson.image || "/placeholder.svg"}
                            alt={delivery.deliveryPerson.name}
                            className="h-12 w-12 rounded-full object-cover"
                          />
                        ) : (
                          <Truck className="h-6 w-6" />
                        )}
                      </div>
                      <div>
                        <p className="font-medium">{delivery.deliveryPerson.name}</p>
                        <p className="text-sm text-muted-foreground">Delivery Partner</p>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <Button className="flex-1" variant="outline">
                        <Phone className="h-4 w-4 mr-2" />
                        Call
                      </Button>
                      <Button className="flex-1" variant="outline">
                        <MessageCircle className="h-4 w-4 mr-2" />
                        Message
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )}

              <Card>
                <CardHeader>
                  <CardTitle>Restaurant</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-4 mb-4">
                    <div className="h-12 w-12 rounded-full bg-muted flex items-center justify-center">
                      {order?.restaurant?.image ? (
                        <img
                          src={order.restaurant.image || "/placeholder.svg"}
                          alt={order.restaurant.name}
                          className="h-12 w-12 rounded-full object-cover"
                        />
                      ) : (
                        <UtensilsCrossed className="h-6 w-6" />
                      )}
                    </div>
                    <div>
                      <p className="font-medium">{order?.restaurant?.name}</p>
                      <p className="text-sm text-muted-foreground">{order?.restaurant?.address}</p>
                    </div>
                  </div>

                  <Button className="w-full" variant="outline">
                    <Phone className="h-4 w-4 mr-2" />
                    Contact Restaurant
                  </Button>
                </CardContent>
              </Card>

              {order?.status === "delivered" && (
                <Card>
                  <CardHeader>
                    <CardTitle>Rate Your Order</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Link href={`/orders/${id}/review`}>
                      <Button className="w-full">Leave a Review</Button>
                    </Link>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </div>
      </main>
      <footer className="border-t">
        <div className="container flex flex-col gap-4 py-10 md:flex-row md:gap-8">
          <div className="flex-1 space-y-4">
            <div className="flex items-center gap-2">
              <UtensilsCrossed className="h-6 w-6" />
              <span className="text-xl font-bold">FoodHub</span>
            </div>
            <p className="text-sm text-muted-foreground">Delicious food delivered to your door</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
