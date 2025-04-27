"use client"

import { useState } from "react"
import { Slider } from "@/components/ui/slider"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"

// Mock data for filters
const cuisines = [
  { id: "american", label: "American" },
  { id: "italian", label: "Italian" },
  { id: "japanese", label: "Japanese" },
  { id: "mexican", label: "Mexican" },
  { id: "chinese", label: "Chinese" },
  { id: "indian", label: "Indian" },
  { id: "thai", label: "Thai" },
  { id: "mediterranean", label: "Mediterranean" },
]

const dietaryOptions = [
  { id: "vegetarian", label: "Vegetarian" },
  { id: "vegan", label: "Vegan" },
  { id: "gluten-free", label: "Gluten Free" },
  { id: "halal", label: "Halal" },
  { id: "kosher", label: "Kosher" },
]

export function RestaurantFilters() {
  const [priceRange, setPriceRange] = useState([0, 50])
  const [deliveryTime, setDeliveryTime] = useState(45)
  const [selectedCuisines, setSelectedCuisines] = useState<string[]>([])
  const [selectedDietary, setSelectedDietary] = useState<string[]>([])

  const handleCuisineChange = (cuisine: string) => {
    setSelectedCuisines((prev) => (prev.includes(cuisine) ? prev.filter((c) => c !== cuisine) : [...prev, cuisine]))
  }

  const handleDietaryChange = (option: string) => {
    setSelectedDietary((prev) => (prev.includes(option) ? prev.filter((o) => o !== option) : [...prev, option]))
  }

  const handleReset = () => {
    setPriceRange([0, 50])
    setDeliveryTime(45)
    setSelectedCuisines([])
    setSelectedDietary([])
  }

  return (
    <div className="bg-card rounded-lg border p-4">
      <h2 className="font-bold text-lg mb-4">Filters</h2>

      <Accordion type="multiple" defaultValue={["price", "cuisine", "dietary", "delivery"]}>
        <AccordionItem value="price">
          <AccordionTrigger>Price Range</AccordionTrigger>
          <AccordionContent>
            <div className="pt-2 pb-4">
              <Slider value={priceRange} min={0} max={100} step={1} onValueChange={setPriceRange} />
              <div className="flex justify-between mt-2 text-sm">
                <span>${priceRange[0]}</span>
                <span>${priceRange[1]}</span>
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="cuisine">
          <AccordionTrigger>Cuisine</AccordionTrigger>
          <AccordionContent>
            <div className="space-y-2">
              {cuisines.map((cuisine) => (
                <div key={cuisine.id} className="flex items-center space-x-2">
                  <Checkbox
                    id={`cuisine-${cuisine.id}`}
                    checked={selectedCuisines.includes(cuisine.id)}
                    onCheckedChange={() => handleCuisineChange(cuisine.id)}
                  />
                  <Label htmlFor={`cuisine-${cuisine.id}`}>{cuisine.label}</Label>
                </div>
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="dietary">
          <AccordionTrigger>Dietary</AccordionTrigger>
          <AccordionContent>
            <div className="space-y-2">
              {dietaryOptions.map((option) => (
                <div key={option.id} className="flex items-center space-x-2">
                  <Checkbox
                    id={`dietary-${option.id}`}
                    checked={selectedDietary.includes(option.id)}
                    onCheckedChange={() => handleDietaryChange(option.id)}
                  />
                  <Label htmlFor={`dietary-${option.id}`}>{option.label}</Label>
                </div>
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="delivery">
          <AccordionTrigger>Max Delivery Time</AccordionTrigger>
          <AccordionContent>
            <div className="pt-2 pb-4">
              <Slider
                value={[deliveryTime]}
                min={10}
                max={60}
                step={5}
                onValueChange={(value) => setDeliveryTime(value[0])}
              />
              <div className="flex justify-end mt-2 text-sm">
                <span>Up to {deliveryTime} minutes</span>
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>

      <Button variant="outline" className="w-full mt-4" onClick={handleReset}>
        Reset Filters
      </Button>
    </div>
  )
}
