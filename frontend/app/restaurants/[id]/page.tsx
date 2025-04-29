import { Suspense } from "react"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { UtensilsCrossed, Star, Clock, MapPin } from "lucide-react"
import { fetchRestaurantById } from "@/lib/api/restaurant-service"
import AddToCartButton from "@/components/add-to-cart-button"

export default async function RestaurantPage({ params }: { params: { id: string } }) {
  const restaurant = await fetchRestaurantById(params.id)

  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <UtensilsCrossed className="h-6 w-6" />
            <span className="text-xl font-bold">FoodHub</span>
          </Link>
          <nav className="hidden md:flex gap-6">
            <Link href="/restaurants" className="text-sm font-medium">
              Restaurants
            </Link>
            <Link href="/about" className="text-sm font-medium">
              About
            </Link>
            <Link href="/contact" className="text-sm font-medium">
              Contact
            </Link>
          </nav>
          <div className="flex items-center gap-4">
            <Link href="/login">
              <Button variant="outline" size="sm">
                Log in
              </Button>
            </Link>
            <Link href="/register">
              <Button size="sm">Sign up</Button>
            </Link>
          </div>
        </div>
      </header>
      <main className="flex-1">
        <div className="relative h-64 w-full">
          <Image src="/placeholder.svg?height=400&width=1200" alt={restaurant.name} fill className="object-cover" />
          <div className="absolute inset-0 bg-black/50 flex items-end">
            <div className="container p-6">
              <h1 className="text-3xl font-bold text-white">{restaurant.name}</h1>
              <div className="flex items-center gap-4 mt-2">
                <div className="flex items-center text-white">
                  <Star className="h-4 w-4 fill-white text-white mr-1" />
                  <span>{restaurant.rating.toFixed(1)}</span>
                  <span className="ml-1 text-sm">({restaurant.reviewCount} reviews)</span>
                </div>
                <div className="flex items-center text-white">
                  <MapPin className="h-4 w-4 mr-1" />
                  <span>{restaurant.address}</span>
                </div>
                <div className="flex items-center text-white">
                  <Clock className="h-4 w-4 mr-1" />
                  <span>30-45 min</span>
                </div>
              </div>
              <div className="mt-2">
                <span className="inline-block bg-white/20 text-white px-2 py-1 rounded text-sm">
                  {restaurant.cuisine}
                </span>
              </div>
            </div>
          </div>
        </div>
        <section className="py-12">
          <div className="container px-4 md:px-6">
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              <div className="md:col-span-2 lg:col-span-3">
                <h2 className="text-2xl font-bold mb-6">Menu</h2>
                <div className="grid gap-4 md:grid-cols-2">
                  <Suspense fallback={<MenuItemSkeleton count={6} />}>
                    {restaurant.menu && restaurant.menu.length > 0 ? (
                      restaurant.menu.map((item) => (
                        <Card key={item._id} className="overflow-hidden">
                          <div className="flex h-full">
                            <div className="relative h-auto w-1/3">
                              <Image
                                src={item.image || "/placeholder.svg?height=200&width=200"}
                                alt={item.name}
                                fill
                                className="object-cover"
                              />
                            </div>
                            <CardContent className="flex-1 p-4">
                              <div className="flex justify-between">
                                <h3 className="font-bold">{item.name}</h3>
                                <span className="font-bold">${item.price.toFixed(2)}</span>
                              </div>
                              <p className="text-sm text-muted-foreground mt-1 line-clamp-2">{item.description}</p>
                              <div className="mt-4">
                                <AddToCartButton
                                  item={{
                                    id: item._id,
                                    name: item.name,
                                    price: item.price,
                                    restaurantId: restaurant._id,
                                    restaurantName: restaurant.name,
                                  }}
                                />
                              </div>
                            </CardContent>
                          </div>
                        </Card>
                      ))
                    ) : (
                      <div className="col-span-full text-center py-12">
                        <p className="text-muted-foreground">No menu items available.</p>
                      </div>
                    )}
                  </Suspense>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      <footer className="border-t">
        <div className="container flex flex-col gap-4 py-10 md:flex-row md:gap-8">
          <div className="flex-1 space-y-4">
            <div className="flex items-center gap-2">
              <UtensilsCrossed className="h-6 w-6" />
              <span className="text-xl font-bold">FoodHub</span>
            </div>
            <p className="text-sm text-muted-foreground">Delicious food delivered to your door</p>
          </div>
          <div className="flex flex-col gap-2 md:flex-row md:gap-12">
            <div className="space-y-2">
              <h4 className="text-sm font-medium">Company</h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link href="/about" className="text-muted-foreground hover:underline">
                    About
                  </Link>
                </li>
                <li>
                  <Link href="/contact" className="text-muted-foreground hover:underline">
                    Contact
                  </Link>
                </li>
              </ul>
            </div>
            <div className="space-y-2">
              <h4 className="text-sm font-medium">Legal</h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link href="/terms" className="text-muted-foreground hover:underline">
                    Terms
                  </Link>
                </li>
                <li>
                  <Link href="/privacy" className="text-muted-foreground hover:underline">
                    Privacy
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}

function MenuItemSkeleton({ count = 6 }: { count?: number }) {
  return (
    <>
      {Array(count)
        .fill(0)
        .map((_, i) => (
          <div key={i} className="flex space-x-4">
            <Skeleton className="h-24 w-24 rounded-lg" />
            <div className="space-y-2 flex-1">
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-8 w-20 mt-2" />
            </div>
          </div>
        ))}
    </>
  )
}
