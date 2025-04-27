"use client"

import { useEffect, useState } from "react"
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { RestaurantHeader } from "@/components/restaurant/restaurant-header"
import { MenuCategories } from "@/components/restaurant/menu-categories"
import { MenuItems } from "@/components/restaurant/menu-items"
import { RestaurantInfo } from "@/components/restaurant/restaurant-info"
import { RestaurantReviews } from "@/components/restaurant/restaurant-reviews"
import { restaurantAPI } from "@/lib/api"
import { Skeleton } from "@/components/ui/skeleton"

export default function RestaurantPage({ params }: { params: { id: string } }) {
  const [restaurant, setRestaurant] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchRestaurant = async () => {
      try {
        setLoading(true)
        const data = await restaurantAPI.getRestaurantById(params.id)
        setRestaurant(data)
        setError(null)
      } catch (err) {
        console.error("Failed to fetch restaurant:", err)
        setError("Failed to load restaurant details. Please try again later.")
      } finally {
        setLoading(false)
      }
    }

    fetchRestaurant()
  }, [params.id])

  if (loading) {
    return (
      <div className="flex min-h-screen flex-col">
        <Header />
        <main className="flex-1">
          <div className="h-64 w-full bg-muted/30"></div>
          <div className="container mx-auto px-4 py-8">
            <div className="flex flex-col lg:flex-row gap-8">
              <div className="w-full lg:w-2/3">
                <Skeleton className="h-12 w-full mb-6" />
                <Skeleton className="h-[400px] w-full" />
              </div>
              <div className="w-full lg:w-1/3">
                <Skeleton className="h-[300px] w-full mb-6" />
                <Skeleton className="h-[400px] w-full" />
              </div>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex min-h-screen flex-col">
        <Header />
        <main className="flex-1 container mx-auto px-4 py-8">
          <div className="text-center text-red-500 py-16">{error}</div>
        </main>
        <Footer />
      </div>
    )
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        <RestaurantHeader restaurant={restaurant} />
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col lg:flex-row gap-8">
            <div className="w-full lg:w-2/3">
              <MenuCategories categories={restaurant.menuCategories || []} />
              <MenuItems
                items={restaurant.menuItems || []}
                restaurantId={restaurant._id}
                restaurantName={restaurant.name}
              />
            </div>
            <div className="w-full lg:w-1/3">
              <RestaurantInfo restaurant={restaurant} />
              <RestaurantReviews restaurantId={restaurant._id} />
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
