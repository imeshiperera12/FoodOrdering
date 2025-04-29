"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { CardElement, useStripe, useElements, Elements } from "@stripe/react-stripe-js"
import { loadStripe } from "@stripe/stripe-js"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Check, CreditCard } from "lucide-react"
import { createPayment, confirmPayment } from "@/lib/api/payment-service"

// Initialize Stripe with your publishable key
const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY as string)

interface CheckoutFormProps {
  orderId: string
  userId: string
  amount: number
  onSuccess: () => void
  onCancel: () => void
}

function CheckoutForm({ orderId, userId, amount, onSuccess, onCancel }: CheckoutFormProps) {
  const stripe = useStripe()
  const elements = useElements()
  const [isLoading, setIsLoading] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)
  const [isComplete, setIsComplete] = useState(false)
  const [paymentError, setPaymentError] = useState<string | null>(null)
  const [paymentId, setPaymentId] = useState<string | null>(null)

  useEffect(() => {
    // Create a payment record when the component mounts
    const createPaymentIntent = async () => {
      try {
        const payment = await createPayment({
          orderId,
          userId,
          amount,
          paymentMethod: "stripe",
        })
        setPaymentId(payment._id || payment.id)
      } catch (error) {
        console.error("Error creating payment:", error)
        setPaymentError("Failed to set up payment. Please try again.")
      }
    }

    createPaymentIntent()
  }, [orderId, userId, amount])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!stripe || !elements || !paymentId) {
      return
    }

    setIsLoading(true)
    setPaymentError(null)

    try {
      const cardElement = elements.getElement(CardElement)
      if (!cardElement) {
        throw new Error("Card element not found")
      }

      setIsProcessing(true)

      // Create a payment method
      const { error, paymentMethod } = await stripe.createPaymentMethod({
        type: "card",
        card: cardElement,
      })

      if (error) {
        throw new Error(error.message)
      }

      // In a real app, you would use confirmCardPayment with a client secret
      // For this demo, we'll simulate a successful payment
      await confirmPayment(paymentId)

      setIsComplete(true)
      setTimeout(() => {
        onSuccess()
      }, 2000)
    } catch (error) {
      console.error("Payment error:", error)
      setPaymentError(error instanceof Error ? error.message : "An unknown error occurred")
    } finally {
      setIsLoading(false)
      setIsProcessing(false)
    }
  }

  if (isComplete) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader>
            <div className="flex items-center justify-center">
              <div className="rounded-full bg-green-100 p-3">
                <Check className="h-8 w-8 text-green-600" />
              </div>
            </div>
            <CardTitle className="text-center mt-4">Payment Successful</CardTitle>
            <CardDescription className="text-center">Your payment has been processed successfully.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 text-center">
              <p className="font-medium">Order #{orderId.substring(0, 8)}</p>
              <p className="text-2xl font-bold">${(amount / 100).toFixed(2)}</p>
            </div>
          </CardContent>
          <CardFooter>
            <p className="text-center w-full text-sm text-muted-foreground">
              You will be redirected to your orders page...
            </p>
          </CardFooter>
        </Card>
      </div>
    )
  }

  if (isProcessing) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-center">Processing Payment</CardTitle>
            <CardDescription className="text-center">Please wait while we process your payment...</CardDescription>
          </CardHeader>
          <CardContent className="flex justify-center py-8">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
          </CardContent>
          <CardFooter>
            <p className="text-center w-full text-sm text-muted-foreground">
              This will only take a moment. Please do not close this window.
            </p>
          </CardFooter>
        </Card>
      </div>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <CreditCard className="mr-2 h-5 w-5" />
          Card Payment
        </CardTitle>
        <CardDescription>Enter your card details to complete your order</CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          <div className="border rounded-md p-4">
            <CardElement
              options={{
                style: {
                  base: {
                    fontSize: "16px",
                    color: "#424770",
                    "::placeholder": {
                      color: "#aab7c4",
                    },
                  },
                  invalid: {
                    color: "#9e2146",
                  },
                },
              }}
            />
          </div>

          <div className="text-sm text-muted-foreground">
            <p>Test Card: 4242 4242 4242 4242</p>
            <p>Expiry: Any future date</p>
            <p>CVC: Any 3 digits</p>
            <p>ZIP: Any 5 digits</p>
          </div>

          {paymentError && <div className="text-sm font-medium text-destructive">{paymentError}</div>}

          <div className="rounded-lg bg-muted p-4">
            <div className="flex justify-between">
              <span className="text-sm font-medium">Total Amount</span>
              <span className="text-sm font-bold">${(amount / 100).toFixed(2)}</span>
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex flex-col gap-2">
          <Button type="submit" className="w-full" disabled={isLoading || !stripe}>
            {isLoading ? "Processing..." : `Pay $${(amount / 100).toFixed(2)}`}
          </Button>
          <Button type="button" variant="ghost" className="w-full" onClick={onCancel}>
            Cancel
          </Button>
        </CardFooter>
      </form>
    </Card>
  )
}

export default function StripeCheckout(props: CheckoutFormProps) {
  return (
    <Elements stripe={stripePromise}>
      <CheckoutForm {...props} />
    </Elements>
  )
}
