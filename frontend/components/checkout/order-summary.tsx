import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"

export function OrderSummary() {
  // Mock order summary data
  const summary = {
    items: [
      { name: "Classic Cheeseburger", quantity: 2, price: 19.98 },
      { name: "French Fries", quantity: 1, price: 3.99 },
      { name: "Chocolate Milkshake", quantity: 1, price: 5.99 },
    ],
    subtotal: 29.96,
    deliveryFee: 1.99,
    tax: 2.4,
    total: 34.35,
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Order Summary</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          {summary.items.map((item, index) => (
            <div key={index} className="flex justify-between text-sm">
              <span>
                {item.quantity}x {item.name}
              </span>
              <span>${item.price.toFixed(2)}</span>
            </div>
          ))}
        </div>

        <Separator />

        <div className="space-y-2">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Subtotal</span>
            <span>${summary.subtotal.toFixed(2)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Delivery Fee</span>
            <span>${summary.deliveryFee.toFixed(2)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Tax</span>
            <span>${summary.tax.toFixed(2)}</span>
          </div>
        </div>

        <Separator />

        <div className="flex justify-between font-bold">
          <span>Total</span>
          <span>${summary.total.toFixed(2)}</span>
        </div>
      </CardContent>
      <CardFooter className="flex flex-col space-y-2">
        <Button className="w-full">Place Order</Button>
        <Button variant="outline" asChild className="w-full">
          <Link href="/cart">Back to Cart</Link>
        </Button>
      </CardFooter>
    </Card>
  )
}
