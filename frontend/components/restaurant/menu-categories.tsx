"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

// Mock menu categories
const categories = [
  { id: "popular", name: "Popular Items" },
  { id: "starters", name: "Starters" },
  { id: "mains", name: "Main Courses" },
  { id: "burgers", name: "Burgers" },
  { id: "sides", name: "Sides" },
  { id: "desserts", name: "Desserts" },
  { id: "drinks", name: "Drinks" },
]

export function MenuCategories() {
  const [activeCategory, setActiveCategory] = useState("popular")

  return (
    <div className="mb-6 border-b sticky top-16 bg-background z-10">
      <div className="flex overflow-x-auto py-2 gap-2 hide-scrollbar">
        {categories.map((category) => (
          <Button
            key={category.id}
            variant="ghost"
            className={cn(
              "whitespace-nowrap rounded-full",
              activeCategory === category.id &&
                "bg-primary text-primary-foreground hover:bg-primary/90 hover:text-primary-foreground",
            )}
            onClick={() => setActiveCategory(category.id)}
          >
            {category.name}
          </Button>
        ))}
      </div>
    </div>
  )
}
