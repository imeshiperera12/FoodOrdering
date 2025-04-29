"use client"

import { useState } from "react"
import { Star } from "lucide-react"

interface StarRatingProps {
  rating: number
  onChange: (rating: number) => void
  size?: "small" | "medium" | "large"
  readOnly?: boolean
}

export function StarRating({ rating, onChange, size = "medium", readOnly = false }: StarRatingProps) {
  const [hoverRating, setHoverRating] = useState(0)

  const sizeClass = {
    small: "h-4 w-4",
    medium: "h-5 w-5",
    large: "h-6 w-6",
  }[size]

  const containerClass = {
    small: "gap-1",
    medium: "gap-1.5",
    large: "gap-2",
  }[size]

  return (
    <div className={`flex items-center ${containerClass}`} onMouseLeave={() => !readOnly && setHoverRating(0)}>
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          className={`${sizeClass} cursor-pointer ${
            (hoverRating || rating) >= star ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
          } ${readOnly ? "cursor-default" : "cursor-pointer"}`}
          onClick={() => !readOnly && onChange(star)}
          onMouseEnter={() => !readOnly && setHoverRating(star)}
        />
      ))}
    </div>
  )
}
