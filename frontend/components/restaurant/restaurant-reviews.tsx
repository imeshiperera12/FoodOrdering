"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Star, ThumbsUp } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Progress } from "@/components/ui/progress"

// Mock reviews data
const getReviews = (id: string) => ({
  id,
  averageRating: 4.8,
  totalReviews: 243,
  ratingDistribution: [
    { rating: 5, count: 180, percentage: 74 },
    { rating: 4, count: 45, percentage: 19 },
    { rating: 3, count: 10, percentage: 4 },
    { rating: 2, count: 5, percentage: 2 },
    { rating: 1, count: 3, percentage: 1 },
  ],
  reviews: [
    {
      id: "1",
      user: {
        name: "John D.",
        avatar: "/placeholder.svg?height=40&width=40",
      },
      rating: 5,
      date: "2 days ago",
      comment: "Amazing burgers! The Classic Cheeseburger was juicy and flavorful. Fast delivery too!",
      helpful: 12,
    },
    {
      id: "2",
      user: {
        name: "Sarah M.",
        avatar: "/placeholder.svg?height=40&width=40",
      },
      rating: 4,
      date: "1 week ago",
      comment: "Good food, but delivery took a bit longer than expected. Would order again though.",
      helpful: 5,
    },
    {
      id: "3",
      user: {
        name: "Mike T.",
        avatar: "/placeholder.svg?height=40&width=40",
      },
      rating: 5,
      date: "2 weeks ago",
      comment: "Best burgers in town! The fries were perfectly crispy too.",
      helpful: 8,
    },
  ],
})

export function RestaurantReviews({ id }: { id: string }) {
  const data = getReviews(id)
  const [expandedReviews, setExpandedReviews] = useState(false)
  const [helpfulReviews, setHelpfulReviews] = useState<string[]>([])

  const displayedReviews = expandedReviews ? data.reviews : data.reviews.slice(0, 2)

  const handleMarkHelpful = (reviewId: string) => {
    if (!helpfulReviews.includes(reviewId)) {
      setHelpfulReviews([...helpfulReviews, reviewId])
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Reviews</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-center mb-6">
          <div className="text-4xl font-bold mr-4">{data.averageRating}</div>
          <div className="flex-grow">
            <div className="flex items-center mb-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  className={`h-5 w-5 ${star <= Math.round(data.averageRating) ? "text-yellow-500 fill-yellow-500" : "text-muted-foreground"}`}
                />
              ))}
              <span className="ml-2 text-sm text-muted-foreground">{data.totalReviews} reviews</span>
            </div>

            <div className="space-y-1">
              {data.ratingDistribution.map((item) => (
                <div key={item.rating} className="flex items-center text-sm">
                  <span className="w-8">{item.rating} ★</span>
                  <Progress value={item.percentage} className="h-2 flex-grow mx-2" />
                  <span className="w-8 text-right">{item.percentage}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-4">
          {displayedReviews.map((review) => (
            <div key={review.id} className="border-b pb-4 last:border-0">
              <div className="flex justify-between mb-2">
                <div className="flex items-center">
                  <Avatar className="h-8 w-8 mr-2">
                    <AvatarImage src={review.user.avatar || "/placeholder.svg"} alt={review.user.name} />
                    <AvatarFallback>{review.user.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="font-medium">{review.user.name}</div>
                    <div className="text-xs text-muted-foreground">{review.date}</div>
                  </div>
                </div>
                <div className="flex">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      className={`h-4 w-4 ${star <= review.rating ? "text-yellow-500 fill-yellow-500" : "text-muted-foreground"}`}
                    />
                  ))}
                </div>
              </div>

              <p className="text-sm mb-2">{review.comment}</p>

              <Button
                variant="ghost"
                size="sm"
                className="text-xs flex items-center"
                onClick={() => handleMarkHelpful(review.id)}
                disabled={helpfulReviews.includes(review.id)}
              >
                <ThumbsUp className="h-3 w-3 mr-1" />
                Helpful ({helpfulReviews.includes(review.id) ? review.helpful + 1 : review.helpful})
              </Button>
            </div>
          ))}
        </div>

        {data.reviews.length > 2 && (
          <Button variant="outline" className="w-full mt-4" onClick={() => setExpandedReviews(!expandedReviews)}>
            {expandedReviews ? "Show Less" : "Show More Reviews"}
          </Button>
        )}
      </CardContent>
    </Card>
  )
}
