"use client"

import { useEffect, useRef, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { MapPin, Navigation } from "lucide-react"
import { deliveryAPI, locationAPI } from "@/lib/api"
import { Button } from "@/components/ui/button"

type DeliveryMapProps = {
  orderId: string
}

type Location = {
  lat: number
  lng: number
}

type DeliveryInfo = {
  _id: string
  orderId: string
  deliveryPersonId: string
  deliveryPersonName: string
  deliveryPersonPhone: string
  restaurantLocation: Location
  customerLocation: Location
  deliveryPersonLocation: Location | null
}

export function DeliveryMap({ orderId }: DeliveryMapProps) {
  const mapRef = useRef<HTMLDivElement>(null)
  const [isMapLoaded, setIsMapLoaded] = useState(false)
  const [deliveryInfo, setDeliveryInfo] = useState<DeliveryInfo | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchDeliveryInfo = async () => {
      try {
        setLoading(true)

        // Get delivery tracking info
        const deliveryData = await deliveryAPI.trackDelivery(orderId)

        if (!deliveryData) {
          setError("Delivery information not available yet")
          return
        }

        // Get delivery person's current location
        let driverLocation = null
        if (deliveryData.deliveryPersonId) {
          try {
            const locationData = await locationAPI.getDeliveryPersonLocation(deliveryData.deliveryPersonId)
            if (locationData) {
              driverLocation = {
                lat: locationData.latitude,
                lng: locationData.longitude,
              }
            }
          } catch (err) {
            console.error("Failed to fetch driver location:", err)
          }
        }

        setDeliveryInfo({
          _id: deliveryData._id,
          orderId: deliveryData.orderId,
          deliveryPersonId: deliveryData.deliveryPersonId,
          deliveryPersonName: deliveryData.deliveryPersonName,
          deliveryPersonPhone: deliveryData.deliveryPersonPhone,
          restaurantLocation: deliveryData.restaurantLocation,
          customerLocation: deliveryData.customerLocation,
          deliveryPersonLocation: driverLocation,
        })

        setError(null)

        // Simulate map loading
        setTimeout(() => {
          setIsMapLoaded(true)
        }, 1000)
      } catch (err) {
        console.error("Failed to fetch delivery info:", err)
        setError("Failed to load delivery information. Please try again later.")
      } finally {
        setLoading(false)
      }
    }

    fetchDeliveryInfo()

    // Set up polling for location updates
    const intervalId = setInterval(async () => {
      if (!deliveryInfo?.deliveryPersonId) return

      try {
        const locationData = await locationAPI.getDeliveryPersonLocation(deliveryInfo.deliveryPersonId)
        if (locationData) {
          setDeliveryInfo((prev) => {
            if (!prev) return prev
            return {
              ...prev,
              deliveryPersonLocation: {
                lat: locationData.latitude,
                lng: locationData.longitude,
              },
            }
          })
        }
      } catch (err) {
        console.error("Failed to update driver location:", err)
      }
    }, 10000) // Update every 10 seconds

    return () => clearInterval(intervalId)
  }, [orderId])

  const handleCallDriver = () => {
    if (deliveryInfo?.deliveryPersonPhone) {
      window.location.href = `tel:${deliveryInfo.deliveryPersonPhone}`
    }
  }

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Delivery Location</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[300px] bg-muted rounded-md mb-4 flex items-center justify-center">
            <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Delivery Location</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[300px] bg-muted rounded-md mb-4 flex items-center justify-center">
            <p className="text-muted-foreground">{error}</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (!deliveryInfo) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Delivery Location</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[300px] bg-muted rounded-md mb-4 flex items-center justify-center">
            <p className="text-muted-foreground">Delivery information not available</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Delivery Location</CardTitle>
      </CardHeader>
      <CardContent>
        <div ref={mapRef} className="h-[300px] bg-muted rounded-md mb-4 relative overflow-hidden">
          {!isMapLoaded ? (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
            </div>
          ) : (
            <div className="absolute inset-0 bg-[url('/images/map-background.png')] bg-cover bg-center">
              {/* Restaurant marker */}
              <div className="absolute left-1/4 top-1/3 transform -translate-x-1/2 -translate-y-1/2">
                <div className="bg-primary text-primary-foreground rounded-full p-2">
                  <MapPin className="h-5 w-5" />
                </div>
                <div className="mt-1 bg-background text-xs px-2 py-1 rounded shadow">Restaurant</div>
              </div>

              {/* Driver marker */}
              {deliveryInfo.deliveryPersonLocation && (
                <div className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2">
                  <div className="bg-blue-500 text-white rounded-full p-2">
                    <Navigation className="h-5 w-5" />
                  </div>
                  <div className="mt-1 bg-background text-xs px-2 py-1 rounded shadow">Driver</div>
                </div>
              )}

              {/* Customer marker */}
              <div className="absolute right-1/4 top-2/3 transform -translate-x-1/2 -translate-y-1/2">
                <div className="bg-green-500 text-white rounded-full p-2">
                  <MapPin className="h-5 w-5" />
                </div>
                <div className="mt-1 bg-background text-xs px-2 py-1 rounded shadow">You</div>
              </div>
            </div>
          )}
        </div>

        <div className="space-y-4">
          <div>
            <h3 className="font-medium text-sm text-muted-foreground">Driver</h3>
            <p>{deliveryInfo.deliveryPersonName}</p>
            <div className="flex items-center mt-2">
              <Button variant="outline" size="sm" onClick={handleCallDriver}>
                Call Driver
              </Button>
            </div>
          </div>

          <div>
            <h3 className="font-medium text-sm text-muted-foreground">Delivery Address</h3>
            <p>123 Main St, New York, NY 10001</p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
