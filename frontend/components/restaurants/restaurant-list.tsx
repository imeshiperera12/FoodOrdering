"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Star, Clock, DollarSign } from "lucide-react";
import { restaurantAPI } from "@/lib/api";
import { Skeleton } from "@/components/ui/skeleton";

type Restaurant = {
  _id: string;
  name: string;
  image: string;
  rating: number;
  reviewCount: number;
  cuisine: string;
  deliveryTime: string;
  deliveryFee: string;
  priceLevel: number;
  featured: boolean;
  isVerified: boolean;
  isAvailable: boolean;
};

export function RestaurantList({ filters = {} }: { filters?: any }) {
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchRestaurants = async () => {
      try {
        setLoading(true);
        const data = await restaurantAPI.getRestaurants(filters);
        setRestaurants(data);
        setError(null);
      } catch (err) {
        console.error("Failed to fetch restaurants:", err);
        setError("Failed to load restaurants. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchRestaurants();
  }, [filters]);

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <Card key={i} className="h-full overflow-hidden">
            <Skeleton className="h-48 w-full" />
            <CardContent className="p-4">
              <Skeleton className="h-6 w-3/4 mb-2" />
              <Skeleton className="h-4 w-1/2 mb-2" />
              <Skeleton className="h-4 w-1/4 mb-2" />
              <Skeleton className="h-4 w-3/4" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (error) {
    return <div className="text-center text-red-500 py-8">{error}</div>;
  }

  if (restaurants.length === 0) {
    return (
      <div className="text-center py-8">
        No restaurants found matching your criteria.
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {restaurants.map((restaurant) => (
        <Link href={`/restaurants/${restaurant._id}`} key={restaurant._id}>
        <Card className="h-full overflow-hidden hover:shadow-md transition-shadow">
          <div className="relative h-48 w-full">
            <Image
              src={restaurant.image || "/images/restaurant-placeholder.jpg"}
              alt={restaurant.name}
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw" // Added sizes prop
              className="object-cover"
            />
            {restaurant.featured && <Badge className="absolute top-2 left-2 bg-primary">Featured</Badge>}
            {!restaurant.isAvailable && (
              <div className="absolute inset-0 bg-black/70 flex items-center justify-center">
                <Badge variant="outline" className="text-white border-white text-lg">
                  Closed
                </Badge>
              </div>
            )}
          </div>
          <CardContent className="p-4">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-bold text-lg mb-1">{restaurant.name}</h3>
                <p className="text-muted-foreground text-sm mb-2">{restaurant.cuisine}</p>
              </div>
              <div className="flex items-center">
                <Star className="h-4 w-4 text-yellow-500 fill-yellow-500 mr-1" />
                <span className="text-sm font-medium">{restaurant.rating}</span>
              </div>
            </div>
      
            <div className="flex items-center text-sm text-muted-foreground mb-2">
              <Clock className="h-4 w-4 mr-1" />
              <span className="mr-3">{restaurant.deliveryTime}</span>
              <span className="mr-3">•</span>
              <span>{restaurant.deliveryFee} delivery</span>
            </div>
      
            <div className="flex items-center text-sm">
              {Array(restaurant.priceLevel)
                .fill(0)
                .map((_, i) => (
                  <DollarSign key={i} className="h-3 w-3 text-muted-foreground" />
                ))}
            </div>
          </CardContent>
        </Card>
      </Link>
      
      ))}
    </div>
  );
}
