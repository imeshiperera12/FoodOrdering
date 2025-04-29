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
import { Package, DollarSign, Users, Store, TrendingUp, AlertCircle } from "lucide-react"

export default function AdminDashboard() {
  const { user, isAuthenticated } = useAuth()
  const router = useRouter()
  const { toast } = useToast()
  const [stats, setStats] = useState({
    totalOrders: 0,
    pendingOrders: 0,
    confirmedOrders: 0,
    deliveredOrders: 0,
    recentOrders: 0,
    totalRevenue: 0,
    totalUsers: 0,
    totalRestaurants: 0,
    pendingRestaurants: 0,
  })
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/login")
      return
    }

    if (user?.role !== "admin") {
      toast({
        variant: "destructive",
        title: "Access denied",
        description: "You don't have permission to access this page.",
      })
      router.push("/")
      return
    }

    // Fetch admin stats
    setStats({
      totalOrders: 1245,
      pendingOrders: 32,
      confirmedOrders: 58,
      deliveredOrders: 1155,
      recentOrders: 87,
      totalRevenue: 28456.75,
      totalUsers: 543,
      totalRestaurants: 48,
      pendingRestaurants: 5,
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
          <h1 className="text-3xl font-bold">Admin Dashboard</h1>
          <div className="flex gap-2">
            <Link href="/dashboard/admin/restaurants/pending">
              <Button variant="outline">
                <AlertCircle className="mr-2 h-4 w-4" />
                Pending Approvals ({stats.pendingRestaurants})
              </Button>
            </Link>
            <Link href="/dashboard/admin/reports">
              <Button>
                <TrendingUp className="mr-2 h-4 w-4" />
                View Reports
              </Button>
            </Link>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
              <Package className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalOrders}</div>
              <p className="text-xs text-muted-foreground">+{stats.recentOrders} in the last 24 hours</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${stats.totalRevenue.toFixed(2)}</div>
              <p className="text-xs text-muted-foreground">+$1,245.80 from last month</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Users</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalUsers}</div>
              <p className="text-xs text-muted-foreground">+24 new users this week</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Restaurants</CardTitle>
              <Store className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalRestaurants}</div>
              <p className="text-xs text-muted-foreground">{stats.pendingRestaurants} pending approval</p>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="orders">
          <TabsList>
            <TabsTrigger value="orders">Orders</TabsTrigger>
            <TabsTrigger value="restaurants">Restaurants</TabsTrigger>
            <TabsTrigger value="users">Users</TabsTrigger>
          </TabsList>
          <TabsContent value="orders" className="space-y-4 mt-4">
            <Card>
              <CardHeader>
                <CardTitle>Order Management</CardTitle>
                <CardDescription>Manage all orders across the platform</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-3 gap-4">
                    <div className="rounded-lg border p-3 text-center">
                      <p className="text-sm font-medium text-muted-foreground">Pending</p>
                      <p className="text-2xl font-bold">{stats.pendingOrders}</p>
                    </div>
                    <div className="rounded-lg border p-3 text-center">
                      <p className="text-sm font-medium text-muted-foreground">Confirmed</p>
                      <p className="text-2xl font-bold">{stats.confirmedOrders}</p>
                    </div>
                    <div className="rounded-lg border p-3 text-center">
                      <p className="text-sm font-medium text-muted-foreground">Delivered</p>
                      <p className="text-2xl font-bold">{stats.deliveredOrders}</p>
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Link href="/dashboard/admin/orders" className="w-full">
                  <Button className="w-full">View All Orders</Button>
                </Link>
              </CardFooter>
            </Card>
          </TabsContent>
          <TabsContent value="restaurants" className="space-y-4 mt-4">
            <Card>
              <CardHeader>
                <CardTitle>Restaurant Management</CardTitle>
                <CardDescription>Manage all restaurants on the platform</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="rounded-lg border p-3 text-center">
                      <p className="text-sm font-medium text-muted-foreground">Active Restaurants</p>
                      <p className="text-2xl font-bold">{stats.totalRestaurants - stats.pendingRestaurants}</p>
                    </div>
                    <div className="rounded-lg border p-3 text-center">
                      <p className="text-sm font-medium text-muted-foreground">Pending Approval</p>
                      <p className="text-2xl font-bold">{stats.pendingRestaurants}</p>
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex gap-2">
                <Link href="/dashboard/admin/restaurants" className="flex-1">
                  <Button variant="outline" className="w-full">
                    View All Restaurants
                  </Button>
                </Link>
                <Link href="/dashboard/admin/restaurants/pending" className="flex-1">
                  <Button className="w-full">Review Pending</Button>
                </Link>
              </CardFooter>
            </Card>
          </TabsContent>
          <TabsContent value="users" className="space-y-4 mt-4">
            <Card>
              <CardHeader>
                <CardTitle>User Management</CardTitle>
                <CardDescription>Manage all users on the platform</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-3 gap-4">
                    <div className="rounded-lg border p-3 text-center">
                      <p className="text-sm font-medium text-muted-foreground">Customers</p>
                      <p className="text-2xl font-bold">412</p>
                    </div>
                    <div className="rounded-lg border p-3 text-center">
                      <p className="text-sm font-medium text-muted-foreground">Restaurant Owners</p>
                      <p className="text-2xl font-bold">48</p>
                    </div>
                    <div className="rounded-lg border p-3 text-center">
                      <p className="text-sm font-medium text-muted-foreground">Delivery Personnel</p>
                      <p className="text-2xl font-bold">83</p>
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Link href="/dashboard/admin/users" className="w-full">
                  <Button className="w-full">Manage Users</Button>
                </Link>
              </CardFooter>
            </Card>
          </TabsContent>
        </Tabs>

        <div className="grid gap-4 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Recent Activities</CardTitle>
              <CardDescription>Latest activities on the platform</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="font-medium">New Restaurant Registration</p>
                    <p className="text-sm text-muted-foreground">Spice Garden requested approval</p>
                  </div>
                  <span className="text-sm text-muted-foreground">10 minutes ago</span>
                </div>
                <div className="flex justify-between items-center">
                  <div>
                    <p className="font-medium">User Complaint</p>
                    <p className="text-sm text-muted-foreground">Delivery issue reported by user #12345</p>
                  </div>
                  <span className="text-sm text-muted-foreground">1 hour ago</span>
                </div>
                <div className="flex justify-between items-center">
                  <div>
                    <p className="font-medium">Payment Refund</p>
                    <p className="text-sm text-muted-foreground">Refund processed for order #67890</p>
                  </div>
                  <span className="text-sm text-muted-foreground">3 hours ago</span>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Link href="/dashboard/admin/activities" className="w-full">
                <Button variant="outline" className="w-full">
                  View All Activities
                </Button>
              </Link>
            </CardFooter>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>System Status</CardTitle>
              <CardDescription>Status of all microservices</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <p className="font-medium">Auth Service</p>
                  <span className="inline-flex items-center rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800">
                    Operational
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <p className="font-medium">Order Service</p>
                  <span className="inline-flex items-center rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800">
                    Operational
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <p className="font-medium">Payment Service</p>
                  <span className="inline-flex items-center rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800">
                    Operational
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <p className="font-medium">Delivery Service</p>
                  <span className="inline-flex items-center rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800">
                    Operational
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <p className="font-medium">Notification Service</p>
                  <span className="inline-flex items-center rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800">
                    Operational
                  </span>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Link href="/dashboard/admin/system" className="w-full">
                <Button variant="outline" className="w-full">
                  System Dashboard
                </Button>
              </Link>
            </CardFooter>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  )
}
