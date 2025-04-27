"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"
import { Search, MoreVertical, Eye, Filter, FileDown } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"

// Mock data for orders
const orders = [
  {
    id: "ORD-12345",
    customer: "John Doe",
    restaurant: "Burger Palace",
    date: "2023-06-15 11:30 AM",
    total: 34.35,
    status: "delivered",
    items: [
      { name: "Classic Cheeseburger", quantity: 2, price: 19.98 },
      { name: "French Fries", quantity: 1, price: 3.99 },
      { name: "Chocolate Milkshake", quantity: 1, price: 5.99 },
    ],
    deliveryAddress: "123 Main St, Apt 4B, New York, NY 10001",
    paymentMethod: "Credit Card (ending in 1234)",
  },
  {
    id: "ORD-12346",
    customer: "Jane Smith",
    restaurant: "Pizza Heaven",
    date: "2023-06-15 12:45 PM",
    total: 28.5,
    status: "preparing",
    items: [
      { name: "Pepperoni Pizza", quantity: 1, price: 14.99 },
      { name: "Garlic Bread", quantity: 1, price: 4.99 },
      { name: "Soda", quantity: 2, price: 3.98 },
    ],
    deliveryAddress: "456 Elm St, Brooklyn, NY 11201",
    paymentMethod: "PayPal",
  },
  {
    id: "ORD-12347",
    customer: "Mike Brown",
    restaurant: "Sushi World",
    date: "2023-06-15 1:15 PM",
    total: 42.75,
    status: "in_transit",
    items: [
      { name: "California Roll", quantity: 1, price: 12.99 },
      { name: "Spicy Tuna Roll", quantity: 1, price: 14.99 },
      { name: "Miso Soup", quantity: 1, price: 3.99 },
      { name: "Green Tea", quantity: 2, price: 5.98 },
    ],
    deliveryAddress: "789 Oak St, Queens, NY 11354",
    paymentMethod: "Credit Card (ending in 5678)",
  },
  {
    id: "ORD-12348",
    customer: "Sarah Johnson",
    restaurant: "Taco Fiesta",
    date: "2023-06-15 2:30 PM",
    total: 31.2,
    status: "pending",
    items: [
      { name: "Beef Tacos", quantity: 3, price: 17.97 },
      { name: "Nachos", quantity: 1, price: 8.99 },
      { name: "Mexican Soda", quantity: 2, price: 5.98 },
    ],
    deliveryAddress: "321 Pine St, Bronx, NY 10458",
    paymentMethod: "Cash on Delivery",
  },
  {
    id: "ORD-12349",
    customer: "Alex Wilson",
    restaurant: "Curry Spice",
    date: "2023-06-15 3:45 PM",
    total: 37.9,
    status: "cancelled",
    items: [
      { name: "Chicken Tikka Masala", quantity: 1, price: 16.99 },
      { name: "Garlic Naan", quantity: 2, price: 7.98 },
      { name: "Samosas", quantity: 1, price: 5.99 },
      { name: "Mango Lassi", quantity: 2, price: 7.98 },
    ],
    deliveryAddress: "654 Cedar Blvd, Manhattan, NY 10016",
    paymentMethod: "Credit Card (ending in 9012)",
  },
]

export default function OrdersPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [selectedOrder, setSelectedOrder] = useState<any>(null)
  const [isDetailsDialogOpen, setIsDetailsDialogOpen] = useState(false)

  const handleViewDetails = (order: any) => {
    setSelectedOrder(order)
    setIsDetailsDialogOpen(true)
  }

  const filteredOrders = orders.filter((order) => {
    const matchesSearch =
      order.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.customer.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.restaurant.toLowerCase().includes(searchQuery.toLowerCase())

    const matchesStatus = statusFilter === "all" || order.status === statusFilter

    return matchesSearch && matchesStatus
  })

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return <Badge className="bg-blue-500">Pending</Badge>
      case "preparing":
        return <Badge className="bg-yellow-500">Preparing</Badge>
      case "in_transit":
        return <Badge className="bg-purple-500">In Transit</Badge>
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
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Orders</h1>
          <p className="text-muted-foreground">View and manage all orders on your platform</p>
        </div>
        <Button>
          <FileDown className="h-4 w-4 mr-2" />
          Export Orders
        </Button>
      </div>

      <div className="flex items-center gap-4 flex-col sm:flex-row">
        <div className="relative w-full max-w-md">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search orders..."
            className="pl-8 w-full"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="flex gap-2 w-full sm:w-auto">
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-full sm:w-[180px]">
              <div className="flex items-center">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Status" />
              </div>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="preparing">Preparing</SelectItem>
              <SelectItem value="in_transit">In Transit</SelectItem>
              <SelectItem value="delivered">Delivered</SelectItem>
              <SelectItem value="cancelled">Cancelled</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Order ID</TableHead>
              <TableHead>Customer</TableHead>
              <TableHead className="hidden md:table-cell">Restaurant</TableHead>
              <TableHead className="hidden md:table-cell">Date</TableHead>
              <TableHead>Total</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredOrders.map((order) => (
              <TableRow key={order.id}>
                <TableCell className="font-medium">{order.id}</TableCell>
                <TableCell>{order.customer}</TableCell>
                <TableCell className="hidden md:table-cell">{order.restaurant}</TableCell>
                <TableCell className="hidden md:table-cell">{order.date}</TableCell>
                <TableCell>${order.total.toFixed(2)}</TableCell>
                <TableCell>{getStatusBadge(order.status)}</TableCell>
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => handleViewDetails(order)}>
                        <Eye className="h-4 w-4 mr-2" />
                        View Details
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Order Details Dialog */}
      <Dialog open={isDetailsDialogOpen} onOpenChange={setIsDetailsDialogOpen}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Order Details</DialogTitle>
          </DialogHeader>
          {selectedOrder && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm">Order Information</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Order ID:</span>
                      <span className="font-medium">{selectedOrder.id}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Date:</span>
                      <span>{selectedOrder.date}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Status:</span>
                      <span>{getStatusBadge(selectedOrder.status)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Restaurant:</span>
                      <span>{selectedOrder.restaurant}</span>
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm">Customer Information</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Name:</span>
                      <span className="font-medium">{selectedOrder.customer}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Delivery Address:</span>
                      <span className="text-right">{selectedOrder.deliveryAddress}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Payment Method:</span>
                      <span>{selectedOrder.paymentMethod}</span>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle className="text-sm">Order Items</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {selectedOrder.items.map((item: any, index: number) => (
                      <div key={index} className="flex justify-between">
                        <span>
                          {item.quantity}x {item.name}
                        </span>
                        <span>${item.price.toFixed(2)}</span>
                      </div>
                    ))}
                  </div>

                  <Separator className="my-4" />

                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Subtotal</span>
                      <span>${(selectedOrder.total - 4.39).toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Delivery Fee</span>
                      <span>$1.99</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Tax</span>
                      <span>$2.40</span>
                    </div>
                    <div className="flex justify-between font-bold">
                      <span>Total</span>
                      <span>${selectedOrder.total.toFixed(2)}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
