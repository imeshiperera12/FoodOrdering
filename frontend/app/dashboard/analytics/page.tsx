"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useToast } from "@/components/ui/use-toast"
import { useAuth } from "@/context/auth-context"
import DashboardLayout from "@/components/dashboard-layout"
import { DateRangePicker } from "@/components/date-range-picker"
import { getAllOrderStats } from "@/lib/api/order-service"
import { getRestaurantOrderStats } from "@/lib/api/order-service"
import { getPaymentStats } from "@/lib/api/payment-service"
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts"
import { DollarSign, ShoppingBag, Users, TrendingUp, ArrowUpRight, ArrowDownRight } from "lucide-react"

export default function AnalyticsDashboard() {
  const { user, isAuthenticated } = useAuth()
  const router = useRouter()
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(true)
  const [dateRange, setDateRange] = useState({
    from: new Date(new Date().setDate(new Date().getDate() - 30)),
    to: new Date(),
  })
  const [stats, setStats] = useState({
    orders: {
      total: 0,
      completed: 0,
      cancelled: 0,
      revenue: 0,
      averageOrderValue: 0,
      dailyOrders: [],
      ordersByStatus: [],
      topRestaurants: [],
      topItems: [],
    },
    payments: {
      total: 0,
      byMethod: [],
      refunds: 0,
    },
    users: {
      total: 0,
      new: 0,
      active: 0,
    },
  })

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/login")
      return
    }

    const fetchStats = async () => {
      setIsLoading(true)
      try {
        let orderStats

        if (user?.role === "admin") {
          orderStats = await getAllOrderStats()
        } else if (user?.role === "restaurant_admin") {
          orderStats = await getRestaurantOrderStats(user.restaurantId)
        } else {
          toast({
            variant: "destructive",
            title: "Access denied",
            description: "You don't have permission to access analytics.",
          })
          router.push("/")
          return
        }

        const paymentStats = await getPaymentStats()

        // Combine stats
        setStats({
          orders: {
            total: orderStats.totalOrders || 0,
            completed: orderStats.completedOrders || 0,
            cancelled: orderStats.cancelledOrders || 0,
            revenue: orderStats.totalRevenue || 0,
            averageOrderValue: orderStats.averageOrderValue || 0,
            dailyOrders: orderStats.dailyOrders || [],
            ordersByStatus: [
              { name: "Pending", value: orderStats.pendingOrders || 0 },
              { name: "Confirmed", value: orderStats.confirmedOrders || 0 },
              { name: "Preparing", value: orderStats.preparingOrders || 0 },
              { name: "Ready", value: orderStats.readyOrders || 0 },
              { name: "Delivering", value: orderStats.deliveringOrders || 0 },
              { name: "Delivered", value: orderStats.deliveredOrders || 0 },
              { name: "Cancelled", value: orderStats.cancelledOrders || 0 },
            ],
            topRestaurants: orderStats.topRestaurants || [],
            topItems: orderStats.topItems || [],
          },
          payments: {
            total: paymentStats.totalPayments || 0,
            byMethod: paymentStats.paymentsByMethod || [],
            refunds: paymentStats.totalRefunds || 0,
          },
          users: {
            total: orderStats.totalCustomers || 0,
            new: orderStats.newCustomers || 0,
            active: orderStats.activeCustomers || 0,
          },
        })
      } catch (error) {
        console.error("Error fetching analytics:", error)
        toast({
          variant: "destructive",
          title: "Failed to load analytics",
          description: "There was an error loading the analytics data.",
        })
      } finally {
        setIsLoading(false)
      }
    }

    fetchStats()
  }, [isAuthenticated, user, router, toast, dateRange])

  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884D8", "#82CA9D", "#FF6B6B"]

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-full">
          <p>Loading analytics...</p>
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout>
      <div className="flex flex-col gap-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">Analytics Dashboard</h1>
          <DateRangePicker value={dateRange} onChange={setDateRange} />
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
              <ShoppingBag className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.orders.total}</div>
              <div className="flex items-center pt-1 text-xs text-muted-foreground">
                <span className="flex items-center text-green-500">
                  <ArrowUpRight className="mr-1 h-3 w-3" />
                  12%
                </span>
                <span className="ml-1">from last month</span>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${stats.orders.revenue.toFixed(2)}</div>
              <div className="flex items-center pt-1 text-xs text-muted-foreground">
                <span className="flex items-center text-green-500">
                  <ArrowUpRight className="mr-1 h-3 w-3" />
                  8.2%
                </span>
                <span className="ml-1">from last month</span>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Average Order Value</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${stats.orders.averageOrderValue.toFixed(2)}</div>
              <div className="flex items-center pt-1 text-xs text-muted-foreground">
                <span className="flex items-center text-red-500">
                  <ArrowDownRight className="mr-1 h-3 w-3" />
                  3.1%
                </span>
                <span className="ml-1">from last month</span>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Users</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.users.active}</div>
              <div className="flex items-center pt-1 text-xs text-muted-foreground">
                <span className="flex items-center text-green-500">
                  <ArrowUpRight className="mr-1 h-3 w-3" />
                  18%
                </span>
                <span className="ml-1">from last month</span>
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="orders">
          <TabsList>
            <TabsTrigger value="orders">Orders</TabsTrigger>
            <TabsTrigger value="revenue">Revenue</TabsTrigger>
            <TabsTrigger value="customers">Customers</TabsTrigger>
          </TabsList>

          <TabsContent value="orders" className="space-y-4 mt-4">
            <div className="grid gap-4 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>Daily Orders</CardTitle>
                  <CardDescription>Number of orders per day</CardDescription>
                </CardHeader>
                <CardContent className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={stats.orders.dailyOrders} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="date" />
                      <YAxis />
                      <Tooltip />
                      <Area type="monotone" dataKey="orders" stroke="#8884d8" fill="#8884d8" fillOpacity={0.3} />
                    </AreaChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Orders by Status</CardTitle>
                  <CardDescription>Distribution of orders by status</CardDescription>
                </CardHeader>
                <CardContent className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={stats.orders.ordersByStatus}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      >
                        {stats.orders.ordersByStatus.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Top Selling Items</CardTitle>
                <CardDescription>Most popular items by order count</CardDescription>
              </CardHeader>
              <CardContent className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={stats.orders.topItems} margin={{ top: 20, right: 30, left: 20, bottom: 60 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" angle={-45} textAnchor="end" height={70} />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="count" name="Order Count" fill="#8884d8" />
                    <Bar dataKey="revenue" name="Revenue ($)" fill="#82ca9d" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="revenue" className="space-y-4 mt-4">
            <div className="grid gap-4 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>Revenue Trend</CardTitle>
                  <CardDescription>Daily revenue over time</CardDescription>
                </CardHeader>
                <CardContent className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={stats.orders.dailyOrders} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="date" />
                      <YAxis />
                      <Tooltip />
                      <Line type="monotone" dataKey="revenue" stroke="#82ca9d" activeDot={{ r: 8 }} />
                    </LineChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Payment Methods</CardTitle>
                  <CardDescription>Distribution of payment methods</CardDescription>
                </CardHeader>
                <CardContent className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={stats.payments.byMethod}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      >
                        {stats.payments.byMethod.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Top Restaurants by Revenue</CardTitle>
                <CardDescription>Highest earning restaurants</CardDescription>
              </CardHeader>
              <CardContent className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={stats.orders.topRestaurants} margin={{ top: 20, right: 30, left: 20, bottom: 60 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" angle={-45} textAnchor="end" height={70} />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="revenue" name="Revenue ($)" fill="#82ca9d" />
                    <Bar dataKey="orders" name="Order Count" fill="#8884d8" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="customers" className="space-y-4 mt-4">
            <div className="grid gap-4 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>New Customers</CardTitle>
                  <CardDescription>New customer registrations over time</CardDescription>
                </CardHeader>
                <CardContent className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={stats.orders.dailyOrders} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="date" />
                      <YAxis />
                      <Tooltip />
                      <Area type="monotone" dataKey="newCustomers" stroke="#FF8042" fill="#FF8042" fillOpacity={0.3} />
                    </AreaChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Customer Retention</CardTitle>
                  <CardDescription>Returning vs. new customers</CardDescription>
                </CardHeader>
                <CardContent className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={[
                          { name: "New Customers", value: stats.users.new },
                          { name: "Returning Customers", value: stats.users.active - stats.users.new },
                        ]}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      >
                        <Cell fill="#0088FE" />
                        <Cell fill="#00C49F" />
                      </Pie>
                      <Tooltip />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  )
}
