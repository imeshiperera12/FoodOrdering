"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useToast } from "@/components/ui/use-toast"
import { useAuth } from "@/context/auth-context"
import DashboardLayout from "@/components/dashboard-layout"
import { PlusCircle, Package, DollarSign, Star } from "lucide-react"

export default function RestaurantDashboard() {
  const { user, isAuthenticated } = useAuth()
  const router = useRouter()
  const { toast } = useToast()
  const [stats, setStats] = useState({
    totalOrders: 0,
    todayOrders: 0,
    pendingOrders: 0,
    confirmedOrders: 0,
    deliveredOrders: 0,
    totalRevenue: 0,
  })
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/login")
      return
    }

    if (user?.role !== "restaurant_admin") {
      toast({
        variant: "destructive",
        title: "Access denied",
        description: "You don't have permission to access this page.",
      })
      router.push("/")
      return
    }

    // Fetch restaurant stats
    setStats({
      totalOrders: 156,
      todayOrders: 12,
      pendingOrders: 5,
      confirmedOrders: 7,
      deliveredOrders: 144,
      totalRevenue: 3245.75,
    })
    setIsLoading(false)
  }, [isAuthenticated, user, router, toast])

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
          <h1 className="text-3xl font-bold">Restaurant Dashboard</h1>
          <Link href="/dashboard/restaurant/menu/add">
            <Button>
              <PlusCircle className="mr-2 h-4 w-4" />
              Add Menu Item
            </Button>
          </Link>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
              <Package className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalOrders}</div>
              <p className="text-xs text-muted-foreground">All time orders</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Today's Orders</CardTitle>
              <Package className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.todayOrders}</div>
              <p className="text-xs text-muted-foreground">+{stats.todayOrders} from yesterday</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${stats.totalRevenue.toFixed(2)}</div>
              <p className="text-xs text-muted-foreground">+$245.65 from last month</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Customer Rating</CardTitle>
              <Star className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">4.8</div>
              <p className="text-xs text-muted-foreground">+0.2 from last month</p>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="pending">
          <TabsList>
            <TabsTrigger value="pending">Pending Orders ({stats.pendingOrders})</TabsTrigger>
            <TabsTrigger value="confirmed">Confirmed Orders ({stats.confirmedOrders})</TabsTrigger>
            <TabsTrigger value="delivered">Delivered Orders ({stats.deliveredOrders})</TabsTrigger>
          </TabsList>
          <TabsContent value="pending" className="space-y-4 mt-4">
            <Card>
              <CardHeader>
                <CardTitle>Order #12345</CardTitle>
                <CardDescription>Placed 10 minutes ago</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>1 x Margherita Pizza</span>
                    <span>$12.99</span>
                  </div>
                  <div className="flex justify-between">
                    <span>2 x Garlic Bread</span>
                    <span>$7.98</span>
                  </div>
                  <div className="flex justify-between font-bold mt-4">
                    <span>Total</span>
                    <span>$20.97</span>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button variant="outline">Reject</Button>
                <Button>Confirm Order</Button>
              </CardFooter>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Order #12346</CardTitle>
                <CardDescription>Placed 15 minutes ago</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>1 x Pepperoni Pizza</span>
                    <span>$14.99</span>
                  </div>
                  <div className="flex justify-between">
                    <span>1 x Caesar Salad</span>
                    <span>$8.99</span>
                  </div>
                  <div className="flex justify-between font-bold mt-4">
                    <span>Total</span>
                    <span>$23.98</span>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button variant="outline">Reject</Button>
                <Button>Confirm Order</Button>
              </CardFooter>
            </Card>
          </TabsContent>
          <TabsContent value="confirmed" className="space-y-4 mt-4">
            <Card>
              <CardHeader>
                <CardTitle>Order #12343</CardTitle>
                <CardDescription>Confirmed 30 minutes ago</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>2 x Vegetarian Pizza</span>
                    <span>$25.98</span>
                  </div>
                  <div className="flex justify-between">
                    <span>1 x Tiramisu</span>
                    <span>$6.99</span>
                  </div>
                  <div className="flex justify-between font-bold mt-4">
                    <span>Total</span>
                    <span>$32.97</span>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button className="w-full">Mark as Ready for Delivery</Button>
              </CardFooter>
            </Card>
          </TabsContent>
          <TabsContent value="delivered" className="mt-4">
            <Card>
              <CardHeader>
                <CardTitle>Recent Deliveries</CardTitle>
                <CardDescription>Orders that have been delivered</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="font-medium">Order #12340</p>
                      <p className="text-sm text-muted-foreground">Delivered yesterday</p>
                    </div>
                    <span className="font-medium">$28.45</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="font-medium">Order #12339</p>
                      <p className="text-sm text-muted-foreground">Delivered yesterday</p>
                    </div>
                    <span className="font-medium">$35.20</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="font-medium">Order #12338</p>
                      <p className="text-sm text-muted-foreground">Delivered 2 days ago</p>
                    </div>
                    <span className="font-medium">$18.75</span>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Link href="/dashboard/restaurant/orders/history" className="w-full">
                  <Button variant="outline" className="w-full">
                    View All Delivered Orders
                  </Button>
                </Link>
              </CardFooter>
            </Card>
          </TabsContent>
        </Tabs>

        <div className="grid gap-4 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Menu Management</CardTitle>
              <CardDescription>Manage your restaurant's menu items</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                You currently have 24 active menu items. Keep your menu updated to attract more customers.
              </p>
            </CardContent>
            <CardFooter>
              <Link href="/dashboard/restaurant/menu" className="w-full">
                <Button variant="outline" className="w-full">
                  Manage Menu
                </Button>
              </Link>
            </CardFooter>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Restaurant Settings</CardTitle>
              <CardDescription>Update your restaurant information</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Keep your restaurant details up to date, including opening hours, contact information, and more.
              </p>
            </CardContent>
            <CardFooter>
              <Link href="/dashboard/restaurant/settings" className="w-full">
                <Button variant="outline" className="w-full">
                  Update Settings
                </Button>
              </Link>
            </CardFooter>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  )
}
