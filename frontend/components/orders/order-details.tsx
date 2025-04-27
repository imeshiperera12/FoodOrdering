import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"

// Mock order details
const getOrderDetails = (orderId: string) => ({
  id: orderId,
  orderNumber: "ORD-12345",
  restaurant: "Burger Palace",
  date: "June 15, 2023",
  time: "11:30 AM",
  items: [
    { name: "Classic Cheeseburger", quantity: 2, price: 19.98, options: ["Regular size", "Extra Cheese"] },
    { name: "French Fries", quantity: 1, price: 3.99, options: ["Large size"] },
    { name: "Chocolate Milkshake", quantity: 1, price: 5.99, options: ["Regular size"] },
  ],
  subtotal: 29.96,
  deliveryFee: 1.99,
  tax: 2.4,
  total: 34.35,
  paymentMethod: "Credit Card (ending in 1234)",
  deliveryAddress: "123 Main St, Apt 4B, New York, NY 10001",
})

export function OrderDetails({ orderId }: { orderId: string }) {
  const order = getOrderDetails(orderId)

  return (
    <Card>
      <CardHeader>
        <CardTitle>Order Details</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <div className="text-sm text-muted-foreground">Order Number</div>
            <div className="font-medium">{order.orderNumber}</div>
          </div>
          <div>
            <div className="text-sm text-muted-foreground">Restaurant</div>
            <div className="font-medium">{order.restaurant}</div>
          </div>
          <div>
            <div className="text-sm text-muted-foreground">Date</div>
            <div className="font-medium">{order.date}</div>
          </div>
          <div>
            <div className="text-sm text-muted-foreground">Time</div>
            <div className="font-medium">{order.time}</div>
          </div>
        </div>

        <Separator />

        <div>
          <h3 className="font-medium mb-2">Items</h3>
          <div className="space-y-2">
            {order.items.map((item, index) => (
              <div key={index} className="flex justify-between">
                <div>
                  <div>
                    {item.quantity}x {item.name}
                  </div>
                  <div className="text-xs text-muted-foreground">{item.options.join(", ")}</div>
                </div>
                <div>${item.price.toFixed(2)}</div>
              </div>
            ))}
          </div>
        </div>

        <Separator />

        <div className="space-y-2">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Subtotal</span>
            <span>${order.subtotal.toFixed(2)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Delivery Fee</span>
            <span>${order.deliveryFee.toFixed(2)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Tax</span>
            <span>${order.tax.toFixed(2)}</span>
          </div>
          <div className="flex justify-between font-bold">
            <span>Total</span>
            <span>${order.total.toFixed(2)}</span>
          </div>
        </div>

        <Separator />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <div className="text-sm text-muted-foreground">Payment Method</div>
            <div className="font-medium">{order.paymentMethod}</div>
          </div>
          <div>
            <div className="text-sm text-muted-foreground">Delivery Address</div>
            <div className="font-medium">{order.deliveryAddress}</div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
