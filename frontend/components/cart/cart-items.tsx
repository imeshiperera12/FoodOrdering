"use client"

import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Trash2, Plus, Minus } from "lucide-react"
import { useCart } from "@/contexts/cart-context"

export function CartItems() {
  const { items, updateQuantity, removeItem, getRestaurantInfo } = useCart()
  const restaurantInfo = getRestaurantInfo()

  if (items.length === 0) {
    return null
  }

  return (
    <div className="space-y-4">
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold">Items from {restaurantInfo?.name}</h3>
          </div>

          <div className="space-y-4">
            {items.map((item) => (
              <div key={item.id} className="flex border-b pb-4 last:border-0 last:pb-0">
                <div className="relative h-20 w-20 rounded-md overflow-hidden">
                  <Image
                    src={item.image || "/images/food-placeholder.png"}
                    alt={item.name}
                    fill
                    className="object-cover"
                  />
                </div>

                <div className="ml-4 flex-grow">
                  <div className="flex justify-between">
                    <h4 className="font-medium">{item.name}</h4>
                    <span className="font-medium">${(item.price * item.quantity).toFixed(2)}</span>
                  </div>

                  {item.options && item.options.length > 0 && (
                    <div className="text-sm text-muted-foreground mb-2">{item.options.join(", ")}</div>
                  )}

                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      >
                        <Minus className="h-3 w-3" />
                      </Button>
                      <span className="mx-2 w-6 text-center">{item.quantity}</span>
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      >
                        <Plus className="h-3 w-3" />
                      </Button>
                    </div>

                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-muted-foreground hover:text-destructive"
                      onClick={() => removeItem(item.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
