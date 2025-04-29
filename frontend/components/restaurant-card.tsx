import Link from "next/link"
import Image from "next/image"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Star } from "lucide-react"

interface RestaurantCardProps {
  restaurant: {
    _id: string
    name: string
    cuisine: string
    rating: number
    reviewCount: number
    image?: string
  }
}

export default function RestaurantCard({ restaurant }: RestaurantCardProps) {
  return (
    <Link href={`/restaurants/${restaurant._id}`}>
      <Card className="overflow-hidden transition-all hover:shadow-md">
        <div className="aspect-video relative">
          <Image
            src={restaurant.image || "/placeholder.svg?height=225&width=400"}
            alt={restaurant.name}
            fill
            className="object-cover"
          />
        </div>
        <CardContent className="p-4">
          <h3 className="text-lg font-bold">{restaurant.name}</h3>
          <p className="text-sm text-muted-foreground">{restaurant.cuisine}</p>
        </CardContent>
        <CardFooter className="flex items-center p-4 pt-0">
          <div className="flex items-center">
            <Star className="h-4 w-4 fill-primary text-primary" />
            <span className="ml-1 text-sm font-medium">{restaurant.rating.toFixed(1)}</span>
            <span className="ml-1 text-xs text-muted-foreground">({restaurant.reviewCount} reviews)</span>
          </div>
        </CardFooter>
      </Card>
    </Link>
  )
}
