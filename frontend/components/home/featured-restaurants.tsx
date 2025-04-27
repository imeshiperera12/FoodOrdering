import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Star, Clock, ArrowRight } from "lucide-react"

// Mock data for featured restaurants
const featuredRestaurants = [
  {
    id: "1",
    name: "Burger Palace",
    image: "/placeholder.svg?height=200&width=300",
    rating: 4.8,
    reviewCount: 243,
    cuisine: "American",
    deliveryTime: "15-25 min",
    deliveryFee: "$1.99",
    featured: true,
  },
  {
    id: "2",
    name: "Pizza Heaven",
    image: "/placeholder.svg?height=200&width=300",
    rating: 4.6,
    reviewCount: 187,
    cuisine: "Italian",
    deliveryTime: "20-30 min",
    deliveryFee: "$2.49",
    featured: true,
  },
  {
    id: "3",
    name: "Sushi World",
    image: "/placeholder.svg?height=200&width=300",
    rating: 4.9,
    reviewCount: 312,
    cuisine: "Japanese",
    deliveryTime: "25-35 min",
    deliveryFee: "$3.99",
    featured: true,
  },
  {
    id: "4",
    name: "Taco Fiesta",
    image: "/placeholder.svg?height=200&width=300",
    rating: 4.7,
    reviewCount: 156,
    cuisine: "Mexican",
    deliveryTime: "15-25 min",
    deliveryFee: "$1.99",
    featured: true,
  },
]

export function FeaturedRestaurants() {
  return (
    <section className="py-16">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-bold">Featured Restaurants</h2>
          <Button variant="ghost" asChild>
            <Link href="/restaurants" className="flex items-center">
              View All <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {featuredRestaurants.map((restaurant) => (
            <Link href={`/restaurants/${restaurant.id}`} key={restaurant.id}>
              <Card className="h-full overflow-hidden hover:shadow-md transition-shadow">
                <div className="relative h-48 w-full">
                  <Image
                    src={restaurant.image || "/placeholder.svg"}
                    alt={restaurant.name}
                    fill
                    className="object-cover"
                  />
                  {restaurant.featured && <Badge className="absolute top-2 left-2 bg-primary">Featured</Badge>}
                </div>
                <CardContent className="p-4">
                  <h3 className="font-bold text-lg mb-1">{restaurant.name}</h3>
                  <p className="text-muted-foreground text-sm mb-2">{restaurant.cuisine}</p>
                  <div className="flex items-center mb-2">
                    <Star className="h-4 w-4 text-yellow-500 fill-yellow-500 mr-1" />
                    <span className="text-sm font-medium mr-1">{restaurant.rating}</span>
                    <span className="text-sm text-muted-foreground">({restaurant.reviewCount})</span>
                  </div>
                </CardContent>
                <CardFooter className="p-4 pt-0 flex justify-between items-center">
                  <div className="flex items-center text-sm text-muted-foreground">
                    <Clock className="h-4 w-4 mr-1" />
                    {restaurant.deliveryTime}
                  </div>
                  <div className="text-sm">{restaurant.deliveryFee}</div>
                </CardFooter>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
