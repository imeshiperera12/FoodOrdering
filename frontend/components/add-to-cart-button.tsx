"use client"
import { Button } from "@/components/ui/button"
import { useCart } from "@/context/cart-context"
import { Minus, Plus, ShoppingCart } from "lucide-react"

interface MenuItem {
  id: string
  name: string
  price: number
  restaurantId: string
  restaurantName: string
}

export default function AddToCartButton({ item }: { item: MenuItem }) {
  const { addToCart, removeFromCart, getItemQuantity } = useCart()
  const quantity = getItemQuantity(item.id)

  const handleAddToCart = () => {
    addToCart(item)
  }

  const handleRemoveFromCart = () => {
    removeFromCart(item.id)
  }

  if (quantity === 0) {
    return (
      <Button onClick={handleAddToCart} size="sm" className="w-full">
        <ShoppingCart className="mr-2 h-4 w-4" />
        Add to Cart
      </Button>
    )
  }

  return (
    <div className="flex items-center justify-between">
      <Button variant="outline" size="icon" className="h-8 w-8" onClick={handleRemoveFromCart}>
        <Minus className="h-4 w-4" />
      </Button>
      <span className="mx-2 font-medium">{quantity}</span>
      <Button variant="outline" size="icon" className="h-8 w-8" onClick={handleAddToCart}>
        <Plus className="h-4 w-4" />
      </Button>
    </div>
  )
}
