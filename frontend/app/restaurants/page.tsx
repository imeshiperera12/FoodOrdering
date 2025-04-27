import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { RestaurantFilters } from "@/components/restaurants/restaurant-filters"
import { RestaurantList } from "@/components/restaurants/restaurant-list"
import { SearchBar } from "@/components/restaurants/search-bar"

export default function RestaurantsPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">Restaurants Near You</h1>
        <SearchBar />
        <div className="flex flex-col md:flex-row gap-6 mt-6">
          <div className="w-full md:w-1/4">
            <RestaurantFilters />
          </div>
          <div className="w-full md:w-3/4">
            <RestaurantList />
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
