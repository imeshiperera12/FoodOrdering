"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { useToast } from "@/components/ui/use-toast"
import { useAuth } from "@/context/auth-context"
import DashboardLayout from "@/components/dashboard-layout"
import { getDeliveryById, updateDeliveryStatus } from "@/lib/api/delivery-service"
import { updateAgentLocation } from "@/lib/api/location-tracker"
import { MapPin, Clock, CheckCircle, Truck, Phone, Navigation, User } from "lucide-react"
import DeliveryMap from "@/components/delivery-map"

export default function DeliveryDetailPage() {
  const { id } = useParams()
  const { user, isAuthenticated } = useAuth()
  const router = useRouter()
  const { toast } = useToast()
  const [delivery, setDelivery] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [progress, setProgress] = useState(0)
  const [isLocationTracking, setIsLocationTracking] = useState(false)

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

    fetchDelivery()
  }, [isAuthenticated, user, router, toast, id])

  const fetchDelivery = async () => {
    if (!id) return

    setIsLoading(true)
    try {
      const data = await getDeliveryById(id as string)
      setDelivery(data)

      // Set progress based on status
      if (data.status === "assigned") setProgress(25)
      else if (data.status === "picked_up") setProgress(50)
      else if (data.status === "delivering") setProgress(75)
      else if (data.status === "delivered") setProgress(100)
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Failed to load delivery",
        description: "There was an error loading the delivery information.",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleStatusUpdate = async (newStatus: string) => {
    try {
      await updateDeliveryStatus(id as string, newStatus)

      // Update local state
      setDelivery((prev) => ({ ...prev, status: newStatus }))

      // Update progress
      if (newStatus === "picked_up") setProgress(50)
      else if (newStatus === "delivering") setProgress(75)
      else if (newStatus === "delivered") setProgress(100)

      toast({
        title: "Status updated",
        description: `Delivery status has been updated to ${newStatus}.`,
      })

      // If delivered, redirect after a short delay
      if (newStatus === "delivered") {
        setTimeout(() => {
          router.push("/dashboard/delivery")
        }, 2000)
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Failed to update status",
        description: "There was an error updating the delivery status. Please try again.",
      })
    }
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

  if (!delivery) {
    return (
      <DashboardLayout>
        <div className="flex flex-col items-center justify-center h-full">
          <h2 className="text-2xl font-bold mb-2">Delivery not found</h2>
          <p className="text-muted-foreground mb-4">
            The delivery you're looking for doesn't exist or you don't have permission to view it.
          </p>
          <Link href="/dashboard/delivery">
            <Button>Back to Dashboard</Button>
          </Link>
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout>
      <div className="flex flex-col gap-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Delivery Details</h1>
            <p className="text-muted-foreground">Order #{delivery.orderId.substring(0, 8)}</p>
          </div>
          <div className="flex items-center gap-4">
            <Button variant={isLocationTracking ? "default" : "outline"} onClick={toggleLocationTracking}>
              {isLocationTracking ? "Stop Sharing Location" : "Share Location"}
            </Button>
            <Link href="/dashboard/delivery">
              <Button variant="outline">Back to Dashboard</Button>
            </Link>
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Delivery Status</CardTitle>
                <CardDescription>Current status of your delivery</CardDescription>
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
                    <div className="flex items-start gap-4">
                      <div
                        className={`rounded-full p-2 ${progress >= 25 ? "bg-primary text-primary-foreground" : "bg-muted"}`}
                      >
                        <CheckCircle className="h-4 w-4" />
                      </div>
                      <div>
                        <p className="font-medium">Order Assigned</p>
                        <p className="text-sm text-muted-foreground">The order has been assigned to you</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-4">
                      <div
                        className={`rounded-full p-2 ${progress >= 50 ? "bg-primary text-primary-foreground" : "bg-muted"}`}
                      >
                        <CheckCircle className="h-4 w-4" />
                      </div>
                      <div>
                        <p className="font-medium">Order Picked Up</p>
                        <p className="text-sm text-muted-foreground">You've picked up the order from the restaurant</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-4">
                      <div
                        className={`rounded-full p-2 ${progress >= 75 ? "bg-primary text-primary-foreground" : "bg-muted"}`}
                      >
                        <Truck className="h-4 w-4" />
                      </div>
                      <div>
                        <p className="font-medium">On the Way</p>
                        <p className="text-sm text-muted-foreground">You're on the way to the customer's location</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-4">
                      <div
                        className={`rounded-full p-2 ${progress >= 100 ? "bg-primary text-primary-foreground" : "bg-muted"}`}
                      >
                        <CheckCircle className="h-4 w-4" />
                      </div>
                      <div>
                        <p className="font-medium">Delivered</p>
                        <p className="text-sm text-muted-foreground">The order has been delivered to the customer</p>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                {delivery.status === "assigned" && (
                  <Button className="w-full" onClick={() => handleStatusUpdate("picked_up")}>
                    Mark as Picked Up
                  </Button>
                )}
                {delivery.status === "picked_up" && (
                  <Button className="w-full" onClick={() => handleStatusUpdate("delivering")}>
                    Start Delivery
                  </Button>
                )}
                {delivery.status === "delivering" && (
                  <Button className="w-full" onClick={() => handleStatusUpdate("delivered")}>
                    Complete Delivery
                  </Button>
                )}
                {delivery.status === "delivered" && (
                  <Button className="w-full" disabled>
                    Delivery Completed
                  </Button>
                )}
              </CardFooter>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Delivery Information</CardTitle>
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
                      <p className="font-medium">Estimated Time</p>
                      <p className="text-sm text-muted-foreground">
                        {delivery.estimatedDeliveryTime || "15-20 minutes"}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <User className="h-5 w-5 text-muted-foreground mt-0.5" />
                    <div>
                      <p className="font-medium">Customer</p>
                      <p className="text-sm text-muted-foreground">{delivery.customerName || "Customer"}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Phone className="h-5 w-5 text-muted-foreground mt-0.5" />
                    <div>
                      <p className="font-medium">Contact Customer</p>
                      <Button variant="outline" size="sm" className="mt-1">
                        Call Customer
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Link
                  href={`https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(delivery.deliveryAddress)}`}
                  target="_blank"
                  className="w-full"
                >
                  <Button variant="outline" className="w-full">
                    <Navigation className="h-4 w-4 mr-2" />
                    Navigate to Customer
                  </Button>
                </Link>
              </CardFooter>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Delivery Map</CardTitle>
              <CardDescription>Real-time location tracking</CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              <div className="aspect-square w-full">
                <DeliveryMap
                  deliveryLocation={delivery.liveLocation || { latitude: 40.7128, longitude: -74.006 }}
                  destinationAddress={delivery.deliveryAddress}
                />
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <div className="text-sm text-muted-foreground">
                {isLocationTracking ? (
                  <span className="flex items-center">
                    <span className="h-2 w-2 rounded-full bg-green-500 mr-2"></span>
                    Live location sharing is active
                  </span>
                ) : (
                  <span className="flex items-center">
                    <span className="h-2 w-2 rounded-full bg-red-500 mr-2"></span>
                    Location sharing is disabled
                  </span>
                )}
              </div>
            </CardFooter>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  )
}
