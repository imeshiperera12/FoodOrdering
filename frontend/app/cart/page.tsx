"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { useToast } from "@/components/ui/use-toast"
import { useCart } from "@/context/cart-context"
import { useAuth } from "@/context/auth-context"
import { createOrder } from "@/lib/api/order-service"
import { Minus, Plus, ShoppingCart, Trash2, UtensilsCrossed } from "lucide-react"

export default function CartPage() {
  const { items, totalAmount, addToCart, removeFromCart, clearCart } = useCart()
  const { user, isAuthenticated } = useAuth()
  const router = useRouter()
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)

  const handleCheckout = async () => {
    if (!isAuthenticated) {
      toast({
        title: "Please log in",
        description: "You need to be logged in to place an order.",
        variant: "destructive",
      })
      router.push("/login")
      return
    }

    if (items.length === 0) {
      toast({
        title: "Empty cart",
        description: "Your cart is empty. Add some items before checking out.",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)
    try {
      // Group items by restaurant
      const restaurantItems = items.reduce((acc, item) => {
        if (!acc[item.restaurantId]) {
          acc[item.restaurantId] = {
            restaurantId: item.restaurantId,
            restaurantName: item.restaurantName,
            items: [],
            totalAmount: 0,
          }
        }
        acc[item.restaurantId].items.push({
          name: item.name,
          quantity: item.quantity,
          price: item.price,
        })
        acc[item.restaurantId].totalAmount += item.price * item.quantity
        return acc
      }, {})

      // Create an order for each restaurant
      for (const restaurantId in restaurantItems) {
        const orderData = {
          customerId: user.id,
          restaurantId,
          items: restaurantItems[restaurantId].items,
          totalAmount: restaurantItems[restaurantId].totalAmount,
        }
        await createOrder(orderData)
      }

      clearCart()
      toast({
        title: "Order placed successfully",
        description: "Your order has been placed and is being processed.",
      })
      router.push("/orders")
    } catch (error) {
      toast({
        title: "Failed to place order",
        description: "There was an error placing your order. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

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
            <Link href="/about" className="text-sm font-medium">
              About
            </Link>
            <Link href="/contact" className="text-sm font-medium">
              Contact
            </Link>
          </nav>
          <div className="flex items-center gap-4">
            {isAuthenticated ? (
              <>
                <Link href="/orders">
                  <Button variant="ghost" size="sm">
                    My Orders
                  </Button>
                </Link>
                <Link href="/profile">
                  <Button variant="ghost" size="sm">
                    Profile
                  </Button>
                </Link>
              </>
            ) : (
              <>
                <Link href="/login">
                  <Button variant="outline" size="sm">
                    Log in
                  </Button>
                </Link>
                <Link href="/register">
                  <Button size="sm">Sign up</Button>
                </Link>
              </>
            )}
          </div>
        </div>
      </header>
      <main className="flex-1 py-12">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col gap-8 md:flex-row">
            <div className="flex-1">
              <h1 className="text-3xl font-bold mb-6">Your Cart</h1>
              {items.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <ShoppingCart className="h-12 w-12 text-muted-foreground mb-4" />
                  <h2 className="text-xl font-semibold">Your cart is empty</h2>
                  <p className="text-muted-foreground mt-2">Add some delicious items from our restaurants</p>
                  <Link href="/restaurants" className="mt-6">
                    <Button>Browse Restaurants</Button>
                  </Link>
                </div>
              ) : (
                <div className="space-y-4">
                  {/* Group items by restaurant */}
                  {Object.entries(
                    items.reduce((acc, item) => {
                      if (!acc[item.restaurantId]) {
                        acc[item.restaurantId] = {
                          restaurantName: item.restaurantName,
                          items: [],
                        }
                      }
                      acc[item.restaurantId].items.push(item)
                      return acc
                    }, {}),
                  ).map(([restaurantId, { restaurantName, items: restaurantItems }]) => (
                    <Card key={restaurantId} className="overflow-hidden">
                      <CardHeader className="bg-muted/50 py-3">
                        <CardTitle className="text-lg">{restaurantName}</CardTitle>
                      </CardHeader>
                      <CardContent className="p-0">
                        <ul className="divide-y">
                          {restaurantItems.map((item) => (
                            <li key={item.id} className="flex items-center justify-between p-4">
                              <div className="flex-1">
                                <h3 className="font-medium">{item.name}</h3>
                                <p className="text-sm text-muted-foreground">
                                  ${item.price.toFixed(2)} x {item.quantity}
                                </p>
                              </div>
                              <div className="flex items-center gap-2">
                                <Button
                                  variant="outline"
                                  size="icon"
                                  className="h-8 w-8"
                                  onClick={() => removeFromCart(item.id)}
                                >
                                  <Minus className="h-4 w-4" />
                                </Button>
                                <span className="w-8 text-center">{item.quantity}</span>
                                <Button
                                  variant="outline"
                                  size="icon"
                                  className="h-8 w-8"
                                  onClick={() => addToCart(item)}
                                >
                                  <Plus className="h-4 w-4" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-8 w-8 text-destructive"
                                  onClick={() => {
                                    for (let i = 0; i < item.quantity; i++) {
                                      removeFromCart(item.id)
                                    }
                                  }}
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </div>
                            </li>
                          ))}
                        </ul>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </div>
            <div className="md:w-80">
              <Card>
                <CardHeader>
                  <CardTitle>Order Summary</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between">
                      <span>Subtotal</span>
                      <span>${totalAmount.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Delivery Fee</span>
                      <span>${items.length > 0 ? "2.50" : "0.00"}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Tax</span>
                      <span>${(totalAmount * 0.1).toFixed(2)}</span>
                    </div>
                    <Separator />
                    <div className="flex justify-between font-bold">
                      <span>Total</span>
                      <span>${(totalAmount + (items.length > 0 ? 2.5 : 0) + totalAmount * 0.1).toFixed(2)}</span>
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button className="w-full" onClick={handleCheckout} disabled={items.length === 0 || isLoading}>
                    {isLoading ? "Processing..." : "Checkout"}
                  </Button>
                </CardFooter>
              </Card>
            </div>
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
