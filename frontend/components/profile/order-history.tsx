import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ArrowRight } from "lucide-react"

// Mock order history data
const orders = [
  {
    id: "1",
    orderNumber: "ORD-12345",
    date: "June 15, 2023",
    time: "11:30 AM",
    restaurant: "Burger Palace",
    items: ["2x Classic Cheeseburger", "1x French Fries", "1x Chocolate Milkshake"],
    total: 34.35,
    status: "delivered",
  },
  {
    id: "2",
    orderNumber: "ORD-12346",
    date: "June 10, 2023",
    time: "7:45 PM",
    restaurant: "Pizza Heaven",
    items: ["1x Pepperoni Pizza", "1x Garlic Bread", "2x Soda"],
    total: 28.5,
    status: "delivered",
  },
  {
    id: "3",
    orderNumber: "ORD-12347",
    date: "June 5, 2023",
    time: "1:15 PM",
    restaurant: "Sushi World",
    items: ["1x California Roll", "1x Spicy Tuna Roll", "1x Miso Soup"],
    total: 42.75,
    status: "delivered",
  },
  {
    id: "4",
    orderNumber: "ORD-12348",
    date: "Today",
    time: "12:10 PM",
    restaurant: "Taco Fiesta",
    items: ["3x Beef Tacos", "1x Nachos", "2x Mexican Soda"],
    total: 31.2,
    status: "in_transit",
  },
]

export function OrderHistory() {
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "placed":
        return <Badge className="bg-blue-500">Order Placed</Badge>
      case "preparing":
        return <Badge className="bg-yellow-500">Preparing</Badge>
      case "in_transit":
        return <Badge className="bg-purple-500">Out for Delivery</Badge>
      case "delivered":
        return <Badge className="bg-green-500">Delivered</Badge>
      default:
        return null
    }
  }

  return (
    <Tabs defaultValue="all">
      <TabsList className="mb-4">
        <TabsTrigger value="all">All Orders</TabsTrigger>
        <TabsTrigger value="active">Active Orders</TabsTrigger>
        <TabsTrigger value="past">Past Orders</TabsTrigger>
      </TabsList>

      <TabsContent value="all" className="space-y-4">
        {orders.map((order) => (
          <Card key={order.id}>
            <CardContent className="p-4">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4">
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-bold">{order.restaurant}</h3>
                    {getStatusBadge(order.status)}
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {order.date} at {order.time}
                  </p>
                </div>
                <div className="mt-2 md:mt-0">
                  <p className="text-sm text-muted-foreground">Order #{order.orderNumber}</p>
                  <p className="font-medium">${order.total.toFixed(2)}</p>
                </div>
              </div>

              <div className="mb-4">
                <h4 className="text-sm font-medium mb-1">Items</h4>
                <ul className="text-sm text-muted-foreground">
                  {order.items.map((item, index) => (
                    <li key={index}>{item}</li>
                  ))}
                </ul>
              </div>

              <div className="flex flex-col sm:flex-row gap-2">
                <Button variant="outline" asChild>
                  <Link href={`/orders/${order.id}`}>Order Details</Link>
                </Button>

                {order.status === "in_transit" && (
                  <Button asChild>
                    <Link href={`/orders/${order.id}/track`} className="flex items-center">
                      Track Order <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                )}

                {order.status === "delivered" && <Button variant="outline">Reorder</Button>}
              </div>
            </CardContent>
          </Card>
        ))}
      </TabsContent>

      <TabsContent value="active" className="space-y-4">
        {orders
          .filter((order) => order.status === "in_transit" || order.status === "preparing" || order.status === "placed")
          .map((order) => (
            <Card key={order.id}>
              <CardContent className="p-4">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4">
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-bold">{order.restaurant}</h3>
                      {getStatusBadge(order.status)}
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {order.date} at {order.time}
                    </p>
                  </div>
                  <div className="mt-2 md:mt-0">
                    <p className="text-sm text-muted-foreground">Order #{order.orderNumber}</p>
                    <p className="font-medium">${order.total.toFixed(2)}</p>
                  </div>
                </div>

                <div className="mb-4">
                  <h4 className="text-sm font-medium mb-1">Items</h4>
                  <ul className="text-sm text-muted-foreground">
                    {order.items.map((item, index) => (
                      <li key={index}>{item}</li>
                    ))}
                  </ul>
                </div>

                <div className="flex flex-col sm:flex-row gap-2">
                  <Button variant="outline" asChild>
                    <Link href={`/orders/${order.id}`}>Order Details</Link>
                  </Button>

                  {order.status === "in_transit" && (
                    <Button asChild>
                      <Link href={`/orders/${order.id}/track`} className="flex items-center">
                        Track Order <ArrowRight className="ml-2 h-4 w-4" />
                      </Link>
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
      </TabsContent>

      <TabsContent value="past" className="space-y-4">
        {orders
          .filter((order) => order.status === "delivered")
          .map((order) => (
            <Card key={order.id}>
              <CardContent className="p-4">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4">
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-bold">{order.restaurant}</h3>
                      {getStatusBadge(order.status)}
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {order.date} at {order.time}
                    </p>
                  </div>
                  <div className="mt-2 md:mt-0">
                    <p className="text-sm text-muted-foreground">Order #{order.orderNumber}</p>
                    <p className="font-medium">${order.total.toFixed(2)}</p>
                  </div>
                </div>

                <div className="mb-4">
                  <h4 className="text-sm font-medium mb-1">Items</h4>
                  <ul className="text-sm text-muted-foreground">
                    {order.items.map((item, index) => (
                      <li key={index}>{item}</li>
                    ))}
                  </ul>
                </div>

                <div className="flex flex-col sm:flex-row gap-2">
                  <Button variant="outline" asChild>
                    <Link href={`/orders/${order.id}`}>Order Details</Link>
                  </Button>
                  <Button variant="outline">Reorder</Button>
                </div>
              </CardContent>
            </Card>
          ))}
      </TabsContent>
    </Tabs>
  )
}
