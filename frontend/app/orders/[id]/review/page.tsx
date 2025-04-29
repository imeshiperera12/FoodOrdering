"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/components/ui/use-toast"
import { useAuth } from "@/context/auth-context"
import { getOrderById } from "@/lib/api/order-service"
import { trackDeliveryByOrderId } from "@/lib/api/delivery-service"
import { UtensilsCrossed, ArrowLeft } from "lucide-react"
import ReviewForm from "@/components/review-form"

export default function OrderReviewPage() {
  const { id } = useParams()
  const { user, isAuthenticated } = useAuth()
  const { toast } = useToast()
  const [order, setOrder] = useState<any>(null)
  const [delivery, setDelivery] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (!isAuthenticated) {
      return
    }

    const fetchOrderAndDelivery = async () => {
      try {
        // Fetch order details
        const orderData = await getOrderById(id as string)
        setOrder(orderData)

        // Fetch delivery info
        try {
          const deliveryData = await trackDeliveryByOrderId(id as string)
          setDelivery(deliveryData)
        } catch (error) {
          console.error("Error fetching delivery data:", error)
          // Continue without delivery data
        }
      } catch (error) {
        toast({
          variant: "destructive",
          title: "Failed to load order information",
          description: "There was an error loading the order information.",
        })
      } finally {
        setIsLoading(false)
      }
    }

    fetchOrderAndDelivery()
  }, [id, isAuthenticated, toast])

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
              <p>Loading order information...</p>
            </div>
          </div>
        </main>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <UtensilsCrossed className="h-6 w-6" />
            <span className="text-xl font-bold">FoodHub</span>
          </Link>
        </div>
      </header>
      <main className="flex-1 py-8">
        <div className="container px-4 md:px-6">
          <div className="mb-6 flex items-center">
            <Link href={`/orders/${id}`} className="mr-4">
              <Button variant="ghost" size="icon">
                <ArrowLeft className="h-4 w-4" />
                <span className="sr-only">Back to order</span>
              </Button>
            </Link>
            <div>
              <h1 className="text-2xl font-bold">Review Your Order</h1>
              <p className="text-muted-foreground">Order #{id}</p>
            </div>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Order Summary</CardTitle>
                <CardDescription>
                  {order?.restaurant?.name} • {new Date(order?.createdAt).toLocaleDateString()}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
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

                  <div className="pt-2 border-t">
                    <div className="flex justify-between font-bold">
                      <span>Total</span>
                      <span>${order?.total?.toFixed(2)}</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Your Review</CardTitle>
                <CardDescription>Share your experience with this order</CardDescription>
              </CardHeader>
              <CardContent>
                <ReviewForm orderId={id as string} deliveryId={delivery?._id} restaurantId={order?.restaurant?._id} />
              </CardContent>
            </Card>
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
