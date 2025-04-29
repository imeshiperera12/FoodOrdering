"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Separator } from "@/components/ui/separator"
import { useToast } from "@/components/ui/use-toast"
import { useAuth } from "@/context/auth-context"
import { useCart } from "@/context/cart-context"
import { createOrder } from "@/lib/api/order-service"
import { CreditCard, Wallet } from "lucide-react"
import StripeCheckout from "@/components/stripe-checkout"

const paymentFormSchema = z.object({
  paymentMethod: z.enum(["credit_card", "paypal"]),
})

export default function CheckoutPage() {
  const { user, isAuthenticated } = useAuth()
  const { items, totalAmount, clearCart } = useCart()
  const router = useRouter()
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)
  const [showStripe, setShowStripe] = useState(false)
  const [orderId, setOrderId] = useState<string | null>(null)

  const form = useForm<z.infer<typeof paymentFormSchema>>({
    resolver: zodResolver(paymentFormSchema),
    defaultValues: {
      paymentMethod: "credit_card",
    },
  })

  const watchPaymentMethod = form.watch("paymentMethod")

  async function onSubmit(values: z.infer<typeof paymentFormSchema>) {
    if (!isAuthenticated || !user) {
      toast({
        title: "Please log in",
        description: "You need to be logged in to complete checkout.",
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
      const orderPromises = Object.values(restaurantItems).map(async (restaurantOrder: any) => {
        const orderData = {
          customerId: user.id,
          restaurantId: restaurantOrder.restaurantId,
          items: restaurantOrder.items,
          totalAmount: restaurantOrder.totalAmount,
        }
        return createOrder(orderData)
      })

      const orders = await Promise.all(orderPromises)
      const firstOrder = orders[0]
      setOrderId(firstOrder._id)

      if (values.paymentMethod === "credit_card") {
        // Show Stripe checkout
        setShowStripe(true)
      } else {
        // Handle PayPal checkout (mock implementation)
        await new Promise((resolve) => setTimeout(resolve, 1000))
        clearCart()
        toast({
          title: "Order placed successfully",
          description: "Your order has been placed and is being processed.",
        })
        router.push("/orders")
      }
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

  const handlePaymentSuccess = () => {
    clearCart()
    toast({
      title: "Payment successful",
      description: "Your order has been placed and is being processed.",
    })
    router.push("/orders")
  }

  const handlePaymentCancel = () => {
    setShowStripe(false)
    toast({
      title: "Payment cancelled",
      description: "Your payment was cancelled. You can try again.",
      variant: "destructive",
    })
  }

  if (!isAuthenticated) {
    return (
      <div className="flex min-h-screen flex-col">
        <main className="flex-1 py-12">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <h1 className="text-3xl font-bold mb-4">Please Log In</h1>
              <p className="text-muted-foreground mb-6">You need to be logged in to complete checkout.</p>
              <Link href="/login">
                <Button>Log In</Button>
              </Link>
            </div>
          </div>
        </main>
      </div>
    )
  }

  if (showStripe && orderId) {
    return (
      <div className="container mx-auto py-10">
        <StripeCheckout
          amount={totalAmount + 2.5 + totalAmount * 0.1}
          orderId={orderId}
          userId={user.id}
          onSuccess={handlePaymentSuccess}
          onCancel={handlePaymentCancel}
        />
      </div>
    )
  }

  return (
    <div className="container mx-auto py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Checkout</h1>
        <p className="text-muted-foreground">Complete your order</p>
      </div>

      <div className="grid gap-8 md:grid-cols-2">
        <div>
          <Card>
            <CardHeader>
              <CardTitle>Delivery Address</CardTitle>
              <CardDescription>Where should we deliver your order?</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="rounded-lg border p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">{user.name}</p>
                      <p className="text-sm text-muted-foreground">123 Main St, Apt 4B</p>
                      <p className="text-sm text-muted-foreground">New York, NY 10001</p>
                      <p className="text-sm text-muted-foreground">{user.email}</p>
                    </div>
                    <Button variant="outline" size="sm">
                      Change
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="mt-6">
            <CardHeader>
              <CardTitle>Payment Method</CardTitle>
              <CardDescription>Select your preferred payment method</CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  <FormField
                    control={form.control}
                    name="paymentMethod"
                    render={({ field }) => (
                      <FormItem className="space-y-3">
                        <FormControl>
                          <RadioGroup
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                            className="flex flex-col space-y-3"
                          >
                            <div className="flex items-center space-x-2">
                              <RadioGroupItem value="credit_card" id="credit_card" />
                              <label
                                htmlFor="credit_card"
                                className="flex flex-1 cursor-pointer items-center rounded-md border p-4"
                              >
                                <CreditCard className="mr-3 h-5 w-5" />
                                <div>
                                  <p className="font-medium">Credit Card</p>
                                  <p className="text-sm text-muted-foreground">Pay with Visa, Mastercard, etc.</p>
                                </div>
                              </label>
                            </div>
                            <div className="flex items-center space-x-2">
                              <RadioGroupItem value="paypal" id="paypal" />
                              <label
                                htmlFor="paypal"
                                className="flex flex-1 cursor-pointer items-center rounded-md border p-4"
                              >
                                <Wallet className="mr-3 h-5 w-5" />
                                <div>
                                  <p className="font-medium">PayPal</p>
                                  <p className="text-sm text-muted-foreground">Pay with your PayPal account</p>
                                </div>
                              </label>
                            </div>
                          </RadioGroup>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {watchPaymentMethod === "credit_card" && (
                    <div className="space-y-4">
                      <p className="text-sm text-muted-foreground">
                        You'll be redirected to our secure payment processor after confirming your order.
                      </p>
                    </div>
                  )}

                  <Button type="submit" className="w-full" disabled={isLoading}>
                    {isLoading ? "Processing..." : "Complete Order"}
                  </Button>
                </form>
              </Form>
            </CardContent>
          </Card>
        </div>

        <div>
          <Card>
            <CardHeader>
              <CardTitle>Order Summary</CardTitle>
              <CardDescription>Review your order details</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
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
                  <div key={restaurantId} className="space-y-2">
                    <h3 className="font-medium">{restaurantName}</h3>
                    {restaurantItems.map((item: any) => (
                      <div key={item.id} className="flex justify-between text-sm">
                        <span>
                          {item.quantity} x {item.name}
                        </span>
                        <span>${(item.price * item.quantity).toFixed(2)}</span>
                      </div>
                    ))}
                  </div>
                ))}

                <Separator />

                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span>${totalAmount.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Delivery Fee</span>
                    <span>$2.50</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Tax</span>
                    <span>${(totalAmount * 0.1).toFixed(2)}</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between font-bold">
                    <span>Total</span>
                    <span>${(totalAmount + 2.5 + totalAmount * 0.1).toFixed(2)}</span>
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Link href="/cart" className="w-full">
                <Button variant="outline" className="w-full">
                  Back to Cart
                </Button>
              </Link>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  )
}
