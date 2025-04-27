import Image from "next/image"
import { Star, Clock, DollarSign, MapPin } from "lucide-react"
import { Badge } from "@/components/ui/badge"

type RestaurantProps = {
  restaurant: {
    _id: string
    name: string
    coverImage: string
    logo: string
    rating: number
    reviewCount: number
    cuisine: string
    address: string
    deliveryTime: string
    deliveryFee: string
    priceLevel: number
    isAvailable: boolean
  }
}

export function RestaurantHeader({ restaurant }: RestaurantProps) {
  return (
    <div className="relative">
      <div className="h-48 md:h-64 w-full relative">
        <Image
          src={restaurant.coverImage || "/images/restaurant-cover-placeholder.png"}
          alt={restaurant.name}
          fill
          className="object-cover"
        />
        <div className="absolute inset-0 bg-black/30"></div>
      </div>

      <div className="container mx-auto px-4">
        <div className="relative -mt-16 bg-background rounded-lg shadow-lg p-6 flex flex-col md:flex-row gap-6">
          <div className="relative h-24 w-24 rounded-lg overflow-hidden border-4 border-background -mt-12 md:mt-0">
            <Image
              src={restaurant.logo || "/images/restaurant-logo-placeholder.png"}
              alt={restaurant.name}
              fill
              className="object-cover"
            />
          </div>

          <div className="flex-grow">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between">
              <div>
                <div className="flex items-center">
                  <h1 className="text-2xl font-bold mr-2">{restaurant.name}</h1>
                  {restaurant.isAvailable ? (
                    <Badge className="bg-green-500">Open</Badge>
                  ) : (
                    <Badge variant="outline" className="text-red-500 border-red-500">
                      Closed
                    </Badge>
                  )}
                </div>
                <p className="text-muted-foreground">{restaurant.cuisine}</p>
              </div>

              <div className="flex items-center mt-2 md:mt-0">
                <div className="flex items-center bg-primary/10 text-primary rounded-full px-3 py-1 mr-2">
                  <Star className="h-4 w-4 fill-primary mr-1" />
                  <span className="font-medium">{restaurant.rating}</span>
                  <span className="text-xs ml-1">({restaurant.reviewCount})</span>
                </div>

                <div className="flex">
                  {Array(restaurant.priceLevel)
                    .fill(0)
                    .map((_, i) => (
                      <DollarSign key={i} className="h-4 w-4" />
                    ))}
                </div>
              </div>
            </div>

            <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-6 mt-4 text-sm text-muted-foreground">
              <div className="flex items-center">
                <MapPin className="h-4 w-4 mr-1" />
                {restaurant.address}
              </div>

              <div className="flex items-center">
                <Clock className="h-4 w-4 mr-1" />
                {restaurant.deliveryTime}
              </div>

              <div>{restaurant.deliveryFee} delivery fee</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
