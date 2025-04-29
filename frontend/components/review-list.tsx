"use client"

import { Star } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card, CardContent } from "@/components/ui/card"
import { StarRating } from "@/components/star-rating"

interface Review {
  _id: string
  user: {
    _id: string
    name: string
    image?: string
  }
  rating: number
  comment: string
  createdAt: string
}

interface ReviewListProps {
  reviews: Review[]
  averageRating: number
  totalReviews: number
}

export default function ReviewList({ reviews, averageRating, totalReviews }: ReviewListProps) {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
          <span className="text-xl font-bold">{averageRating.toFixed(1)}</span>
        </div>
        <span className="text-muted-foreground">({totalReviews} reviews)</span>
      </div>

      <div className="space-y-4">
        {reviews.length > 0 ? (
          reviews.map((review) => (
            <Card key={review._id}>
              <CardContent className="p-4">
                <div className="flex justify-between items-start mb-2">
                  <div className="flex items-center gap-2">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={review.user.image || "/placeholder.svg"} alt={review.user.name} />
                      <AvatarFallback>{review.user.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium">{review.user.name}</p>
                      <p className="text-xs text-muted-foreground">{new Date(review.createdAt).toLocaleDateString()}</p>
                    </div>
                  </div>
                  <StarRating rating={review.rating} onChange={() => {}} readOnly size="small" />
                </div>
                <p className="text-sm">{review.comment}</p>
              </CardContent>
            </Card>
          ))
        ) : (
          <p className="text-center text-muted-foreground py-4">No reviews yet</p>
        )}
      </div>
    </div>
  )
}
