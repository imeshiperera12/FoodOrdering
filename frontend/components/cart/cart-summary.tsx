"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import { useCart } from "@/contexts/cart-context"
import { useState } from "react"

export function CartSummary() {
  const { getCartTotal } = useCart()
  const [promoCode, setPromoCode] = useState("")
  const [discount, setDiscount] = useState(0)

  const subtotal = getCartTotal()
  const deliveryFee = 1.99
  const tax = subtotal * 0.08 // 8% tax
  const total = subtotal + deliveryFee + tax - discount

  const handleApplyPromo = () => {
    // In a real app, this would validate the promo code with the backend
    if (promoCode.toLowerCase() === "welcome10") {
      const discountAmount = subtotal * 0.1 // 10% discount
      setDiscount(discountAmount)
      alert("Promo code applied successfully!")
    } else {
      alert("Invalid promo code")
      setDiscount(0)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Order Summary</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Subtotal</span>
            <span>${subtotal.toFixed(2)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Delivery Fee</span>
            <span>${deliveryFee.toFixed(2)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Tax</span>
            <span>${tax.toFixed(2)}</span>
          </div>
          {discount > 0 && (
            <div className="flex justify-between text-green-500">
              <span>Discount</span>
              <span>-${discount.toFixed(2)}</span>
            </div>
          )}
        </div>

        <Separator />

        <div className="flex justify-between font-bold">
          <span>Total</span>
          <span>${total.toFixed(2)}</span>
        </div>

        <div className="pt-4">
          <div className="flex gap-2">
            <Input placeholder="Promo code" value={promoCode} onChange={(e) => setPromoCode(e.target.value)} />
            <Button variant="outline" onClick={handleApplyPromo}>
              Apply
            </Button>
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <Button asChild className="w-full">
          <Link href="/checkout">Proceed to Checkout</Link>
        </Button>
      </CardFooter>
    </Card>
  )
}
