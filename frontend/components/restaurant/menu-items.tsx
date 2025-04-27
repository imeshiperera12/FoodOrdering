"use client"

import { useState } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Plus, Minus } from "lucide-react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Separator } from "@/components/ui/separator"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { useCart } from "@/contexts/cart-context"

type MenuItem = {
  _id: string
  name: string
  description: string
  price: number
  image: string
  category: string
  popular: boolean
  vegetarian: boolean
  options?: {
    name: string
    choices: {
      name: string
      price: number
    }[]
  }[]
  extras?: {
    name: string
    price: number
  }[]
}

type MenuItemsProps = {
  items: MenuItem[]
  restaurantId: string
  restaurantName: string
}

export function MenuItems({ items, restaurantId, restaurantName }: MenuItemsProps) {
  const [selectedItem, setSelectedItem] = useState<MenuItem | null>(null)
  const [quantity, setQuantity] = useState(1)
  const [selectedOptions, setSelectedOptions] = useState<Record<string, string>>({})
  const [selectedExtras, setSelectedExtras] = useState<string[]>([])
  const { addItem } = useCart()

  const handleOpenItem = (item: MenuItem) => {
    setSelectedItem(item)
    setQuantity(1)

    // Initialize selected options with default values
    const initialOptions: Record<string, string> = {}
    item.options?.forEach((option) => {
      if (option.choices.length > 0) {
        initialOptions[option.name] = option.choices[0].name
      }
    })
    setSelectedOptions(initialOptions)

    setSelectedExtras([])
  }

  const handleCloseItem = () => {
    setSelectedItem(null)
  }

  const handleOptionChange = (optionName: string, choiceName: string) => {
    setSelectedOptions((prev) => ({
      ...prev,
      [optionName]: choiceName,
    }))
  }

  const handleExtraToggle = (extraName: string) => {
    setSelectedExtras((prev) =>
      prev.includes(extraName) ? prev.filter((name) => name !== extraName) : [...prev, extraName],
    )
  }

  const getOptionPrice = (optionName: string, choiceName: string) => {
    const option = selectedItem?.options?.find((o) => o.name === optionName)
    const choice = option?.choices.find((c) => c.name === choiceName)
    return choice?.price || 0
  }

  const getExtraPrice = (extraName: string) => {
    return selectedItem?.extras?.find((e) => e.name === extraName)?.price || 0
  }

  const calculateTotalPrice = () => {
    if (!selectedItem) return 0

    let total = selectedItem.price * quantity

    // Add option prices
    Object.entries(selectedOptions).forEach(([optionName, choiceName]) => {
      total += getOptionPrice(optionName, choiceName)
    })

    // Add extras prices
    selectedExtras.forEach((extraName) => {
      total += getExtraPrice(extraName)
    })

    return total.toFixed(2)
  }

  const handleAddToCart = () => {
    if (!selectedItem) return

    // Format selected options and extras for display
    const optionsText = Object.entries(selectedOptions).map(([option, choice]) => `${option}: ${choice}`)

    const extrasText = selectedExtras.map((extra) => `Extra: ${extra}`)

    const allOptions = [...optionsText, ...extrasText]

    addItem({
      id: selectedItem._id,
      name: selectedItem.name,
      price: Number.parseFloat(calculateTotalPrice()),
      quantity,
      image: selectedItem.image,
      restaurantId,
      restaurantName,
      options: allOptions,
    })

    handleCloseItem()
  }

  // Group items by category
  const itemsByCategory: Record<string, MenuItem[]> = {}
  items.forEach((item) => {
    if (!itemsByCategory[item.category]) {
      itemsByCategory[item.category] = []
    }
    itemsByCategory[item.category].push(item)
  })

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Menu</h2>

      {Object.entries(itemsByCategory).map(([category, categoryItems]) => (
        <div key={category} className="mb-8">
          <h3 className="text-xl font-semibold mb-4" id={category.toLowerCase().replace(/\s+/g, "-")}>
            {category}
          </h3>
          <div className="grid grid-cols-1 gap-4">
            {categoryItems.map((item) => (
              <Card key={item._id} className="overflow-hidden">
                <CardContent className="p-0">
                  <div className="flex cursor-pointer p-4" onClick={() => handleOpenItem(item)}>
                    <div className="flex-grow pr-4">
                      <div className="flex items-center mb-1">
                        <h3 className="font-bold">{item.name}</h3>
                        {item.popular && <Badge className="ml-2 bg-primary">Popular</Badge>}
                        {item.vegetarian && <Badge className="ml-2 bg-green-500">Vegetarian</Badge>}
                      </div>
                      <p className="text-sm text-muted-foreground mb-2 line-clamp-2">{item.description}</p>
                      <p className="font-medium">${item.price.toFixed(2)}</p>
                    </div>
                    <div className="relative h-20 w-20 rounded-md overflow-hidden">
                      <Image
                        src={item.image || "/images/food-placeholder.png"}
                        alt={item.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      ))}

      {/* Item Detail Dialog */}
      <Dialog open={!!selectedItem} onOpenChange={(open) => !open && handleCloseItem()}>
        <DialogContent className="sm:max-w-md">
          {selectedItem && (
            <>
              <DialogHeader>
                <DialogTitle>{selectedItem.name}</DialogTitle>
                <DialogDescription>{selectedItem.description}</DialogDescription>
              </DialogHeader>

              <div className="relative h-48 w-full rounded-md overflow-hidden mb-4">
                <Image
                  src={selectedItem.image || "/images/food-placeholder.png"}
                  alt={selectedItem.name}
                  fill
                  className="object-cover"
                />
              </div>

              <Separator className="my-4" />

              <div className="space-y-4">
                {/* Options */}
                {selectedItem.options && selectedItem.options.length > 0 && (
                  <div className="space-y-4">
                    {selectedItem.options.map((option) => (
                      <div key={option.name}>
                        <h4 className="font-medium mb-2">{option.name}</h4>
                        <RadioGroup
                          value={selectedOptions[option.name] || ""}
                          onValueChange={(value) => handleOptionChange(option.name, value)}
                        >
                          {option.choices.map((choice) => (
                            <div key={choice.name} className="flex items-center justify-between">
                              <div className="flex items-center space-x-2">
                                <RadioGroupItem value={choice.name} id={`option-${option.name}-${choice.name}`} />
                                <Label htmlFor={`option-${option.name}-${choice.name}`}>{choice.name}</Label>
                              </div>
                              {choice.price > 0 && <span>+${choice.price.toFixed(2)}</span>}
                            </div>
                          ))}
                        </RadioGroup>
                      </div>
                    ))}
                  </div>
                )}

                {/* Extras */}
                {selectedItem.extras && selectedItem.extras.length > 0 && (
                  <div>
                    <h4 className="font-medium mb-2">Extra Toppings</h4>
                    {selectedItem.extras.map((extra) => (
                      <div key={extra.name} className="flex items-center justify-between mb-2">
                        <div className="flex items-center space-x-2">
                          <Checkbox
                            id={`extra-${extra.name}`}
                            checked={selectedExtras.includes(extra.name)}
                            onCheckedChange={() => handleExtraToggle(extra.name)}
                          />
                          <Label htmlFor={`extra-${extra.name}`}>{extra.name}</Label>
                        </div>
                        <span>+${extra.price.toFixed(2)}</span>
                      </div>
                    ))}
                  </div>
                )}

                <div>
                  <h4 className="font-medium mb-2">Quantity</h4>
                  <div className="flex items-center">
                    <Button variant="outline" size="icon" onClick={() => setQuantity(Math.max(1, quantity - 1))}>
                      <Minus className="h-4 w-4" />
                    </Button>
                    <span className="mx-4 font-medium">{quantity}</span>
                    <Button variant="outline" size="icon" onClick={() => setQuantity(quantity + 1)}>
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>

              <div className="mt-6">
                <Button className="w-full" onClick={handleAddToCart}>
                  Add to Cart - ${calculateTotalPrice()}
                </Button>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
