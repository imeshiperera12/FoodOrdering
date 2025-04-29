"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useToast } from "@/components/ui/use-toast"
import { useAuth } from "@/context/auth-context"
import { getCustomerOrders } from "@/lib/api/order-service"
import { UtensilsCrossed, Clock, CheckCircle, Truck } from "lucide-react"

interface OrderItem {
  name: string
  quantity: number
  price: number
}

interface Order {
  _id: string
  customerId: string
  restaurantId: string
  items: OrderItem[]
  totalAmount: number
  status: string
  createdAt: string
}

export default function OrdersPage() {
  const { user, isAuthenticated } = useAuth()
  const { toast } = useToast()
  const [orders, setOrders] = useState<Order[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function fetchOrders() {
      if (!isAuthenticated || !user) {
        setIsLoading(false)
        return
      }

      try {
        const fetchedOrders = await getCustomerOrders(user.id)
        setOrders(fetchedOrders)
      } catch (error) {
        toast({
          variant: "destructive",
          title: "Failed to load orders",
          description: "There was an error loading your orders. Please try again.",
        })
      } finally {
        setIsLoading(false)
      }
    }

    fetchOrders()
  }, [isAuthenticated, user, toast])

  if (!isAuthenticated) {
    return (
      <div className="flex min-h-screen flex-col">
        <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <div className="container flex h-16 items-center justify-between">
            <Link href="/" className="flex items-center gap-2">
              <UtensilsCrossed className="h-6 w-6" />
              <span className="text-xl font-bold">FoodHub</span>
            </Link>
            <div className="flex items-center gap-4">
              <Link href="/login">
                <Button variant="outline" size="sm">
                  Log in
                </Button>
              </Link>
              <Link href="/register">
                <Button size="sm">Sign up</Button>
              </Link>
            </div>
          </div>
        </header>
        <main className="flex-1 py-12">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <h1 className="text-3xl font-bold mb-4">Please Log In</h1>
              <p className="text-muted-foreground mb-6">You need to be logged in to view your orders.</p>
              <Link href="/login">
                <Button>Log In</Button>
              </Link>
            </div>
          </div>
        </main>
      </div>
    )
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "Pending":
        return <Clock className="h-5 w-5 text-yellow-500" />
      case "Confirmed":
        return <CheckCircle className="h-5 w-5 text-green-500" />
      case "Delivered":
        return <Truck className="h-5 w-5 text-blue-500" />
      default:
        return <Clock className="h-5 w-5 text-muted-foreground" />
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(date)
  }

  const pendingOrders = orders.filter((order) => order.status === "Pending")
  const confirmedOrders = orders.filter((order) => order.status === "Confirmed")
  const deliveredOrders = orders.filter((order) => order.status === "Delivered")

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
            <Link href="/cart" className="text-sm font-medium">
              Cart
            </Link>
            <Link href="/profile" className="text-sm font-medium">
              Profile
            </Link>
          </nav>
          <div className="flex items-center gap-4">
            <Link href="/profile">
              <Button variant="ghost" size="sm">
                {user?.name}
              </Button>
            </Link>
          </div>
        </div>
      </header>
      <main className="flex-1 py-12">
        <div className="container px-4 md:px-6">
          <h1 className="text-3xl font-bold mb-6">Your Orders</h1>

          {isLoading ? (
            <div className="flex justify-center py-12">
              <p>Loading your orders...</p>
            </div>
          ) : orders.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <h2 className="text-xl font-semibold mb-2">No orders yet</h2>
              <p className="text-muted-foreground mb-6">
                You haven't placed any orders yet. Start ordering delicious food!
              </p>
              <Link href="/restaurants">
                <Button>Browse Restaurants</Button>
              </Link>
            </div>
          ) : (
            <Tabs defaultValue="all">
              <TabsList className="mb-6">
                <TabsTrigger value="all">All Orders ({orders.length})</TabsTrigger>
                <TabsTrigger value="pending">Pending ({pendingOrders.length})</TabsTrigger>
                <TabsTrigger value="confirmed">Confirmed ({confirmedOrders.length})</TabsTrigger>
                <TabsTrigger value="delivered">Delivered ({deliveredOrders.length})</TabsTrigger>
              </TabsList>

              <TabsContent value="all" className="space-y-6">
                {orders.map((order) => (
                  <OrderCard key={order._id} order={order} />
                ))}
              </TabsContent>

              <TabsContent value="pending" className="space-y-6">
                {pendingOrders.length > 0 ? (
                  pendingOrders.map((order) => <OrderCard key={order._id} order={order} />)
                ) : (
                  <p className="text-center py-6 text-muted-foreground">No pending orders</p>
                )}
              </TabsContent>

              <TabsContent value="confirmed" className="space-y-6">
                {confirmedOrders.length > 0 ? (
                  confirmedOrders.map((order) => <OrderCard key={order._id} order={order} />)
                ) : (
                  <p className="text-center py-6 text-muted-foreground">No confirmed orders</p>
                )}
              </TabsContent>

              <TabsContent value="delivered" className="space-y-6">
                {deliveredOrders.length > 0 ? (
                  deliveredOrders.map((order) => <OrderCard key={order._id} order={order} />)
                ) : (
                  <p className="text-center py-6 text-muted-foreground">No delivered orders</p>
                )}
              </TabsContent>
            </Tabs>
          )}
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
          <div className="flex flex-col gap-2 md:flex-row md:gap-12">
            <div className="space-y-2">
              <h4 className="text-sm font-medium">Company</h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link href="/about" className="text-muted-foreground hover:underline">
                    About
                  </Link>
                </li>
                <li>
                  <Link href="/contact" className="text-muted-foreground hover:underline">
                    Contact
                  </Link>
                </li>
              </ul>
            </div>
            <div className="space-y-2">
              <h4 className="text-sm font-medium">Legal</h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link href="/terms" className="text-muted-foreground hover:underline">
                    Terms
                  </Link>
                </li>
                <li>
                  <Link href="/privacy" className="text-muted-foreground hover:underline">
                    Privacy
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}

function OrderCard({ order }: { order: Order }) {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Order #{order._id.substring(0, 8)}</CardTitle>
            <CardDescription>
              {new Date(order.createdAt).toLocaleDateString()} at {new Date(order.createdAt).toLocaleTimeString()}
            </CardDescription>
          </div>
          <div className="flex items-center gap-2">
            {order.status === "Pending" && <Clock className="h-5 w-5 text-yellow-500" />}
            {order.status === "Confirmed" && <CheckCircle className="h-5 w-5 text-green-500" />}
            {order.status === "Delivered" && <Truck className="h-5 w-5 text-blue-500" />}
            <span
              className={`text-sm font-medium ${
                order.status === "Pending"
                  ? "text-yellow-500"
                  : order.status === "Confirmed"
                    ? "text-green-500"
                    : "text-blue-500"
              }`}
            >
              {order.status}
            </span>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <h3 className="font-medium mb-2">Items</h3>
            <ul className="space-y-2">
              {order.items.map((item, index) => (
                <li key={index} className="flex justify-between text-sm">
                  <span>
                    {item.quantity} x {item.name}
                  </span>
                  <span>${(item.price * item.quantity).toFixed(2)}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="flex justify-between font-medium">
            <span>Total</span>
            <span>${order.totalAmount.toFixed(2)}</span>
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Link href={`/orders/${order._id}`}>
          <Button variant="outline">View Details</Button>
        </Link>
        {order.status === "Delivered" && (
          <Link href={`/orders/${order._id}/review`}>
            <Button>Leave Review</Button>
          </Link>
        )}
      </CardFooter>
    </Card>
  )
}
