"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Switch } from "@/components/ui/switch"
import { useToast } from "@/components/ui/use-toast"
import { useAuth } from "@/context/auth-context"
import DashboardLayout from "@/components/dashboard-layout"
import { getDeliveriesByPerson, updateDeliveryStatus } from "@/lib/api/delivery-service"
import { updateAgentLocation } from "@/lib/api/location-tracker"
import { MapPin, Package, Clock, Truck, DollarSign, Navigation } from "lucide-react"

interface Delivery {
  _id: string
  orderId: string
  userId: string
  deliveryPersonId: string
  status: string
  deliveryAddress: string
  estimatedDeliveryTime: string
  actualDeliveryTime?: string
  deliveryFee: number
  createdAt: string
  updatedAt: string
  restaurantName?: string
  customerName?: string
}

export default function DeliveryDashboard() {
  const { user, isAuthenticated } = useAuth()
  const router = useRouter()
  const { toast } = useToast()
  const [activeDeliveries, setActiveDeliveries] = useState<Delivery[]>([])
  const [pastDeliveries, setPastDeliveries] = useState<Delivery[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isAvailable, setIsAvailable] = useState(true)
  const [isLocationTracking, setIsLocationTracking] = useState(false)
  const [earnings, setEarnings] = useState({
    today: 0,
    week: 0,
    month: 0,
    total: 0,
  })

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/login")
      return
    }

    if (user?.role !== "delivery_person") {
      toast({
        variant: "destructive",
        title: "Access denied",
        description: "You don't have permission to access this page.",
      })
      router.push("/")
      return
    }

    fetchDeliveries()
  }, [isAuthenticated, user, router, toast])

  const fetchDeliveries = async () => {
    if (!user) return

    setIsLoading(true)
    try {
      const allDeliveries = await getDeliveriesByPerson(user.id)

      // Split deliveries into active and past
      const active = allDeliveries.filter((d) => ["assigned", "picked_up", "delivering"].includes(d.status))
      const past = allDeliveries.filter((d) => ["delivered", "cancelled"].includes(d.status))

      setActiveDeliveries(active)
      setPastDeliveries(past)

      // Calculate earnings
      calculateEarnings(allDeliveries)
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Failed to load deliveries",
        description: "There was an error loading your deliveries. Please try again.",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const calculateEarnings = (deliveries: Delivery[]) => {
    const now = new Date()
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
    const weekStart = new Date(now)
    weekStart.setDate(now.getDate() - now.getDay())
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1)

    const completedDeliveries = deliveries.filter((d) => d.status === "delivered")

    const todayEarnings = completedDeliveries
      .filter((d) => new Date(d.updatedAt) >= today)
      .reduce((sum, d) => sum + d.deliveryFee, 0)

    const weekEarnings = completedDeliveries
      .filter((d) => new Date(d.updatedAt) >= weekStart)
      .reduce((sum, d) => sum + d.deliveryFee, 0)

    const monthEarnings = completedDeliveries
      .filter((d) => new Date(d.updatedAt) >= monthStart)
      .reduce((sum, d) => sum + d.deliveryFee, 0)

    const totalEarnings = completedDeliveries.reduce((sum, d) => sum + d.deliveryFee, 0)

    setEarnings({
      today: todayEarnings,
      week: weekEarnings,
      month: monthEarnings,
      total: totalEarnings,
    })
  }

  const handleStatusUpdate = async (deliveryId: string, newStatus: string) => {
    try {
      await updateDeliveryStatus(deliveryId, newStatus)

      // Update local state
      setActiveDeliveries((prev) => {
        const updated = prev.map((delivery) => {
          if (delivery._id === deliveryId) {
            return { ...delivery, status: newStatus }
          }
          return delivery
        })

        // If status is "delivered", move to past deliveries
        if (newStatus === "delivered") {
          const deliveredItem = updated.find((d) => d._id === deliveryId)
          if (deliveredItem) {
            setPastDeliveries((prev) => [deliveredItem, ...prev])
            return updated.filter((d) => d._id !== deliveryId)
          }
        }

        return updated
      })

      toast({
        title: "Status updated",
        description: `Delivery status has been updated to ${newStatus}.`,
      })
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Failed to update status",
        description: "There was an error updating the delivery status. Please try again.",
      })
    }
  }

  const toggleAvailability = () => {
    setIsAvailable(!isAvailable)
    toast({
      title: isAvailable ? "You are now offline" : "You are now online",
      description: isAvailable
        ? "You will not receive new delivery requests."
        : "You will now receive new delivery requests.",
    })
  }

  const toggleLocationTracking = () => {
    if (!isLocationTracking) {
      // Start location tracking
      if (navigator.geolocation) {
        const watchId = navigator.geolocation.watchPosition(
          (position) => {
            const { latitude, longitude } = position.coords

            // Update location in the backend
            if (user) {
              updateAgentLocation(user.id, latitude, longitude).catch((error) =>
                console.error("Failed to update location:", error),
              )
            }
          },
          (error) => {
            console.error("Geolocation error:", error)
            toast({
              variant: "destructive",
              title: "Location error",
              description: "Failed to access your location. Please check your device settings.",
            })
            setIsLocationTracking(false)
          },
          { enableHighAccuracy: true, maximumAge: 10000, timeout: 5000 },
        )

        // Store the watch ID to clear it later
        window.locationWatchId = watchId
        setIsLocationTracking(true)

        toast({
          title: "Location tracking enabled",
          description: "Your location is now being shared for deliveries.",
        })
      } else {
        toast({
          variant: "destructive",
          title: "Geolocation not supported",
          description: "Your browser does not support geolocation.",
        })
      }
    } else {
      // Stop location tracking
      if (window.locationWatchId !== undefined) {
        navigator.geolocation.clearWatch(window.locationWatchId)
        window.locationWatchId = undefined
      }
      setIsLocationTracking(false)

      toast({
        title: "Location tracking disabled",
        description: "Your location is no longer being shared.",
      })
    }
  }

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-full">
          <p>Loading...</p>
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout>
      <div className="flex flex-col gap-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">Delivery Dashboard</h1>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Switch checked={isLocationTracking} onCheckedChange={toggleLocationTracking} id="location-tracking" />
              <label htmlFor="location-tracking" className="text-sm font-medium">
                Share Location
              </label>
            </div>
            <div className="flex items-center gap-2">
              <Switch checked={isAvailable} onCheckedChange={toggleAvailability} id="availability" />
              <label htmlFor="availability" className="text-sm font-medium">
                Available for Deliveries
              </label>
            </div>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Today's Earnings</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${earnings.today.toFixed(2)}</div>
              <p className="text-xs text-muted-foreground">From completed deliveries today</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Weekly Earnings</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${earnings.week.toFixed(2)}</div>
              <p className="text-xs text-muted-foreground">From completed deliveries this week</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Monthly Earnings</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${earnings.month.toFixed(2)}</div>
              <p className="text-xs text-muted-foreground">From completed deliveries this month</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Deliveries</CardTitle>
              <Truck className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{activeDeliveries.length}</div>
              <p className="text-xs text-muted-foreground">Deliveries in progress</p>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="active">
          <TabsList>
            <TabsTrigger value="active">Active Deliveries ({activeDeliveries.length})</TabsTrigger>
            <TabsTrigger value="history">Delivery History ({pastDeliveries.length})</TabsTrigger>
          </TabsList>
          <TabsContent value="active" className="space-y-4 mt-4">
            {activeDeliveries.length === 0 ? (
              <Card>
                <CardContent className="flex flex-col items-center justify-center py-12 text-center">
                  <Package className="h-12 w-12 text-muted-foreground mb-4" />
                  <h3 className="text-lg font-medium">No active deliveries</h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    You don't have any active deliveries at the moment.
                  </p>
                </CardContent>
              </Card>
            ) : (
              activeDeliveries.map((delivery) => (
                <Card key={delivery._id}>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle>Order #{delivery.orderId.substring(0, 8)}</CardTitle>
                        <CardDescription>
                          From {delivery.restaurantName || "Restaurant"} to {delivery.customerName || "Customer"}
                        </CardDescription>
                      </div>
                      <div className="flex items-center gap-2">
                        {delivery.status === "assigned" && <Clock className="h-5 w-5 text-yellow-500" />}
                        {delivery.status === "picked_up" && <Package className="h-5 w-5 text-blue-500" />}
                        {delivery.status === "delivering" && <Truck className="h-5 w-5 text-green-500" />}
                        <span
                          className={`text-sm font-medium ${
                            delivery.status === "assigned"
                              ? "text-yellow-500"
                              : delivery.status === "picked_up"
                                ? "text-blue-500"
                                : "text-green-500"
                          }`}
                        >
                          {delivery.status.charAt(0).toUpperCase() + delivery.status.slice(1).replace("_", " ")}
                        </span>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-start gap-3">
                        <MapPin className="h-5 w-5 text-muted-foreground mt-0.5" />
                        <div>
                          <p className="font-medium">Delivery Address</p>
                          <p className="text-sm text-muted-foreground">{delivery.deliveryAddress}</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <Clock className="h-5 w-5 text-muted-foreground mt-0.5" />
                        <div>
                          <p className="font-medium">Estimated Delivery Time</p>
                          <p className="text-sm text-muted-foreground">
                            {delivery.estimatedDeliveryTime || "30-45 minutes"}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <DollarSign className="h-5 w-5 text-muted-foreground mt-0.5" />
                        <div>
                          <p className="font-medium">Delivery Fee</p>
                          <p className="text-sm text-muted-foreground">${delivery.deliveryFee.toFixed(2)}</p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="flex justify-between">
                    <Link href={`/dashboard/delivery/${delivery._id}`}>
                      <Button variant="outline">View Details</Button>
                    </Link>
                    <div className="flex gap-2">
                      {delivery.status === "assigned" && (
                        <Button onClick={() => handleStatusUpdate(delivery._id, "picked_up")}>Mark as Picked Up</Button>
                      )}
                      {delivery.status === "picked_up" && (
                        <Button onClick={() => handleStatusUpdate(delivery._id, "delivering")}>Start Delivery</Button>
                      )}
                      {delivery.status === "delivering" && (
                        <Button onClick={() => handleStatusUpdate(delivery._id, "delivered")}>Complete Delivery</Button>
                      )}
                      <Link
                        href={`https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(delivery.deliveryAddress)}`}
                        target="_blank"
                      >
                        <Button variant="secondary">
                          <Navigation className="h-4 w-4 mr-2" />
                          Navigate
                        </Button>
                      </Link>
                    </div>
                  </CardFooter>
                </Card>
              ))
            )}
          </TabsContent>
          <TabsContent value="history" className="mt-4">
            <Card>
              <CardHeader>
                <CardTitle>Delivery History</CardTitle>
                <CardDescription>Your past deliveries</CardDescription>
              </CardHeader>
              <CardContent>
                {pastDeliveries.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-12 text-center">
                    <Package className="h-12 w-12 text-muted-foreground mb-4" />
                    <h3 className="text-lg font-medium">No delivery history</h3>
                    <p className="text-sm text-muted-foreground mt-1">You haven't completed any deliveries yet.</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {pastDeliveries.slice(0, 10).map((delivery) => (
                      <div key={delivery._id} className="flex justify-between items-center border-b pb-4">
                        <div>
                          <p className="font-medium">Order #{delivery.orderId.substring(0, 8)}</p>
                          <p className="text-sm text-muted-foreground">
                            {new Date(delivery.updatedAt).toLocaleDateString()} at{" "}
                            {new Date(delivery.updatedAt).toLocaleTimeString()}
                          </p>
                          <p className="text-sm text-muted-foreground">{delivery.deliveryAddress}</p>
                        </div>
                        <div className="text-right">
                          <p className="font-medium">${delivery.deliveryFee.toFixed(2)}</p>
                          <p
                            className={`text-sm ${delivery.status === "delivered" ? "text-green-500" : "text-red-500"}`}
                          >
                            {delivery.status.charAt(0).toUpperCase() + delivery.status.slice(1)}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
              <CardFooter>
                <Link href="/dashboard/delivery/history" className="w-full">
                  <Button variant="outline" className="w-full">
                    View All History
                  </Button>
                </Link>
              </CardFooter>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  )
}

// Add this to make the locationWatchId available globally
declare global {
  interface Window {
    locationWatchId?: number
  }
}
