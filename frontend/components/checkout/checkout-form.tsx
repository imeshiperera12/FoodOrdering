"use client"

import { Button } from "@/components/ui/button"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { MapPin, Clock } from "lucide-react"
import { useAuth } from "@/contexts/auth-context"
import { useCart } from "@/contexts/cart-context"
import { useToast } from "@/components/ui/use-toast"
import { orderAPI, paymentAPI } from "@/lib/api"

export function CheckoutForm() {
  const [deliveryType, setDeliveryType] = useState("delivery")
  const [paymentMethod, setPaymentMethod] = useState("card")
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    address: "",
    apt: "",
    city: "",
    state: "ny",
    zip: "",
    instructions: "",
    name: "",
    phone: "",
    email: "",
    cardNumber: "",
    expiry: "",
    cvv: "",
    cardName: "",
  })

  const { user } = useAuth()
  const { items, getCartTotal, getRestaurantInfo, clearCart } = useCart()
  const { toast } = useToast()
  const router = useRouter()
  const restaurantInfo = getRestaurantInfo()

  // Prefill form with user data if available
  useEffect(() => {
    if (user) {
      setFormData((prev) => ({
        ...prev,
        name: user.name || prev.name,
        email: user.email || prev.email,
        phone: user.phone || prev.phone,
        address: user.address || prev.address,
      }))
    }
  }, [user])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (items.length === 0) {
      toast({
        title: "Cart is empty",
        description: "Please add items to your cart before checking out",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)

    try {
      // Create order
      const orderData = {
        restaurantId: restaurantInfo?.id,
        items: items.map((item) => ({
          itemId: item.id,
          name: item.name,
          price: item.price,
          quantity: item.quantity,
          options: item.options,
        })),
        deliveryType,
        deliveryAddress:
          deliveryType === "delivery"
            ? {
                address: formData.address,
                apt: formData.apt,
                city: formData.city,
                state: formData.state,
                zip: formData.zip,
              }
            : null,
        deliveryInstructions: formData.instructions,
        contactInfo: {
          name: formData.name,
          phone: formData.phone,
          email: formData.email,
        },
        subtotal: getCartTotal(),
        deliveryFee: deliveryType === "delivery" ? 1.99 : 0,
        tax: getCartTotal() * 0.08,
        total: getCartTotal() + (deliveryType === "delivery" ? 1.99 : 0) + getCartTotal() * 0.08,
      }

      const order = await orderAPI.createOrder(orderData)

      // Process payment
      if (paymentMethod === "card") {
        const paymentData = {
          orderId: order._id,
          amount: order.total,
          paymentMethod: "stripe",
          cardDetails: {
            number: formData.cardNumber,
            expiry: formData.expiry,
            cvc: formData.cvv,
            name: formData.cardName,
          },
        }

        await paymentAPI.createPayment(paymentData)
      }

      // Clear cart and redirect to order confirmation
      clearCart()
      toast({
        title: "Order placed successfully",
        description: "Your order has been placed and is being processed",
      })

      router.push(`/orders/${order._id}/track`)
    } catch (error) {
      console.error("Checkout failed:", error)
      toast({
        title: "Checkout failed",
        description: error instanceof Error ? error.message : "An error occurred during checkout",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <form onSubmit={handleSubmit}>
        <Card>
          <CardHeader>
            <CardTitle>Delivery Options</CardTitle>
          </CardHeader>
          <CardContent>
            <RadioGroup value={deliveryType} onValueChange={setDeliveryType} className="flex flex-col space-y-4">
              <div className="flex items-start space-x-3">
                <RadioGroupItem value="delivery" id="delivery" className="mt-1" />
                <div className="flex-grow">
                  <Label htmlFor="delivery" className="flex items-center text-base font-medium">
                    <MapPin className="h-5 w-5 mr-2" />
                    Delivery
                  </Label>
                  <p className="text-sm text-muted-foreground mt-1">Get your food delivered to your doorstep</p>

                  {deliveryType === "delivery" && (
                    <div className="mt-4 space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="address">Address</Label>
                          <Input
                            id="address"
                            name="address"
                            value={formData.address}
                            onChange={handleChange}
                            placeholder="123 Main St"
                            required={deliveryType === "delivery"}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="apt">Apt/Suite (optional)</Label>
                          <Input
                            id="apt"
                            name="apt"
                            value={formData.apt}
                            onChange={handleChange}
                            placeholder="Apt 4B"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="city">City</Label>
                          <Input
                            id="city"
                            name="city"
                            value={formData.city}
                            onChange={handleChange}
                            placeholder="New York"
                            required={deliveryType === "delivery"}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="state">State</Label>
                          <Select
                            name="state"
                            value={formData.state}
                            onValueChange={(value) => setFormData((prev) => ({ ...prev, state: value }))}
                          >
                            <SelectTrigger id="state">
                              <SelectValue placeholder="Select state" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="ny">New York</SelectItem>
                              <SelectItem value="ca">California</SelectItem>
                              <SelectItem value="tx">Texas</SelectItem>
                              <SelectItem value="fl">Florida</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="zip">ZIP Code</Label>
                          <Input
                            id="zip"
                            name="zip"
                            value={formData.zip}
                            onChange={handleChange}
                            placeholder="10001"
                            required={deliveryType === "delivery"}
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="instructions">Delivery Instructions (optional)</Label>
                        <Textarea
                          id="instructions"
                          name="instructions"
                          value={formData.instructions}
                          onChange={handleChange}
                          placeholder="E.g., Ring doorbell, leave at door, etc."
                        />
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <RadioGroupItem value="pickup" id="pickup" className="mt-1" />
                <div className="flex-grow">
                  <Label htmlFor="pickup" className="flex items-center text-base font-medium">
                    <Clock className="h-5 w-5 mr-2" />
                    Pickup
                  </Label>
                  <p className="text-sm text-muted-foreground mt-1">Pick up your order at the restaurant</p>

                  {deliveryType === "pickup" && (
                    <div className="mt-4">
                      <p className="text-sm mb-2">Pickup Location:</p>
                      <p className="font-medium">{restaurantInfo?.name}</p>
                      <p className="text-sm text-muted-foreground">123 Main St, New York, NY 10001</p>
                      <p className="text-sm text-muted-foreground mt-2">
                        Your order will be ready for pickup in approximately 20-30 minutes.
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </RadioGroup>
          </CardContent>
        </Card>

        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Contact Information</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="John Doe"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number</Label>
                <Input
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="(123) 456-7890"
                  required
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="john.doe@example.com"
                required
              />
            </div>
          </CardContent>
        </Card>

        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Payment Method</CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="card" onValueChange={setPaymentMethod}>
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="card">Credit Card</TabsTrigger>
                <TabsTrigger value="cash">Cash on Delivery</TabsTrigger>
              </TabsList>
              <TabsContent value="card" className="pt-4">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="cardNumber">Card Number</Label>
                    <Input
                      id="cardNumber"
                      name="cardNumber"
                      value={formData.cardNumber}
                      onChange={handleChange}
                      placeholder="1234 5678 9012 3456"
                      required={paymentMethod === "card"}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="expiry">Expiry Date</Label>
                      <Input
                        id="expiry"
                        name="expiry"
                        value={formData.expiry}
                        onChange={handleChange}
                        placeholder="MM/YY"
                        required={paymentMethod === "card"}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="cvv">CVV</Label>
                      <Input
                        id="cvv"
                        name="cvv"
                        value={formData.cvv}
                        onChange={handleChange}
                        placeholder="123"
                        required={paymentMethod === "card"}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="cardName">Name on Card</Label>
                    <Input
                      id="cardName"
                      name="cardName"
                      value={formData.cardName}
                      onChange={handleChange}
                      placeholder="John Doe"
                      required={paymentMethod === "card"}
                    />
                  </div>
                </div>
              </TabsContent>
              <TabsContent value="cash" className="pt-4">
                <div className="bg-muted p-4 rounded-md">
                  <p className="text-sm">
                    You will pay in cash when your order is delivered. Please have the exact amount ready.
                  </p>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        <Button type="submit" className="w-full mt-6" disabled={isLoading}>
          {isLoading ? "Processing..." : "Place Order"}
        </Button>
      </form>
    </div>
  )
}
