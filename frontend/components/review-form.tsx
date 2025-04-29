"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/components/ui/use-toast"
import { rateOrder } from "@/lib/api/order-service"
import { rateDelivery } from "@/lib/api/delivery-service"
import { StarRating } from "@/components/star-rating"

const reviewSchema = z.object({
  foodRating: z.number().min(1, "Please rate the food").max(5),
  deliveryRating: z.number().min(1, "Please rate the delivery").max(5),
  comment: z.string().max(500, "Comment must be less than 500 characters"),
})

interface ReviewFormProps {
  orderId: string
  deliveryId?: string
  restaurantId: string
  onSuccess?: () => void
}

export default function ReviewForm({ orderId, deliveryId, restaurantId, onSuccess }: ReviewFormProps) {
  const router = useRouter()
  const { toast } = useToast()
  const [isSubmitting, setIsSubmitting] = useState(false)

  const form = useForm<z.infer<typeof reviewSchema>>({
    resolver: zodResolver(reviewSchema),
    defaultValues: {
      foodRating: 0,
      deliveryRating: 0,
      comment: "",
    },
  })

  async function onSubmit(values: z.infer<typeof reviewSchema>) {
    setIsSubmitting(true)
    try {
      // Submit food/restaurant rating
      await rateOrder(orderId, values.foodRating, values.comment)

      // Submit delivery rating if available
      if (deliveryId) {
        await rateDelivery(deliveryId, values.deliveryRating)
      }

      toast({
        title: "Review submitted",
        description: "Thank you for your feedback!",
      })

      if (onSuccess) {
        onSuccess()
      } else {
        router.push("/orders")
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to submit review. Please try again.",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="foodRating"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Food Quality</FormLabel>
              <FormControl>
                <StarRating rating={field.value} onChange={field.onChange} size="large" />
              </FormControl>
              <FormDescription>How would you rate the quality of the food?</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        {deliveryId && (
          <FormField
            control={form.control}
            name="deliveryRating"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Delivery Service</FormLabel>
                <FormControl>
                  <StarRating rating={field.value} onChange={field.onChange} size="large" />
                </FormControl>
                <FormDescription>How would you rate the delivery service?</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        )}

        <FormField
          control={form.control}
          name="comment"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Comments</FormLabel>
              <FormControl>
                <Textarea placeholder="Share your experience with this order..." className="resize-none" {...field} />
              </FormControl>
              <FormDescription>Your feedback helps us improve our service.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-end gap-4">
          <Button type="button" variant="outline" onClick={() => router.back()} disabled={isSubmitting}>
            Cancel
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Submitting..." : "Submit Review"}
          </Button>
        </div>
      </form>
    </Form>
  )
}
