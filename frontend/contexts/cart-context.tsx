"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"
import { useToast } from "@/components/ui/use-toast"

type CartItem = {
  id: string
  name: string
  price: number
  quantity: number
  image?: string
  restaurantId: string
  restaurantName: string
  options?: string[]
}

type CartContextType = {
  items: CartItem[]
  addItem: (item: CartItem) => void
  removeItem: (id: string) => void
  updateQuantity: (id: string, quantity: number) => void
  clearCart: () => void
  getCartTotal: () => number
  getItemCount: () => number
  getRestaurantInfo: () => { id: string; name: string } | null
}

const CartContext = createContext<CartContextType | undefined>(undefined)

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([])
  const { toast } = useToast()

  // Load cart from localStorage on mount
  useEffect(() => {
    const savedCart = localStorage.getItem("cart")
    if (savedCart) {
      try {
        setItems(JSON.parse(savedCart))
      } catch (error) {
        console.error("Failed to parse cart from localStorage:", error)
      }
    }
  }, [])

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(items))
  }, [items])

  const addItem = (item: CartItem) => {
    // Check if we already have items from a different restaurant
    if (items.length > 0 && items[0].restaurantId !== item.restaurantId) {
      // Ask user if they want to clear the cart
      if (
        !confirm(
          `Your cart contains items from ${items[0].restaurantName}. Adding items from ${item.restaurantName} will clear your current cart. Continue?`,
        )
      ) {
        return
      }
      setItems([item])
      toast({
        title: "Cart cleared",
        description: `Your cart has been cleared and now contains items from ${item.restaurantName}`,
      })
      return
    }

    setItems((prevItems) => {
      // Check if item already exists in cart
      const existingItemIndex = prevItems.findIndex((i) => i.id === item.id)

      if (existingItemIndex >= 0) {
        // Update quantity of existing item
        const updatedItems = [...prevItems]
        updatedItems[existingItemIndex] = {
          ...updatedItems[existingItemIndex],
          quantity: updatedItems[existingItemIndex].quantity + item.quantity,
        }
        return updatedItems
      } else {
        // Add new item
        return [...prevItems, item]
      }
    })

    toast({
      title: "Item added to cart",
      description: `${item.quantity} x ${item.name} added to your cart`,
    })
  }

  const removeItem = (id: string) => {
    setItems((prevItems) => prevItems.filter((item) => item.id !== id))
    toast({
      title: "Item removed",
      description: "Item has been removed from your cart",
    })
  }

  const updateQuantity = (id: string, quantity: number) => {
    if (quantity < 1) return

    setItems((prevItems) => prevItems.map((item) => (item.id === id ? { ...item, quantity } : item)))
  }

  const clearCart = () => {
    setItems([])
    toast({
      title: "Cart cleared",
      description: "All items have been removed from your cart",
    })
  }

  const getCartTotal = () => {
    return items.reduce((total, item) => total + item.price * item.quantity, 0)
  }

  const getItemCount = () => {
    return items.reduce((count, item) => count + item.quantity, 0)
  }

  const getRestaurantInfo = () => {
    if (items.length === 0) return null
    return {
      id: items[0].restaurantId,
      name: items[0].restaurantName,
    }
  }

  return (
    <CartContext.Provider
      value={{
        items,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
        getCartTotal,
        getItemCount,
        getRestaurantInfo,
      }}
    >
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const context = useContext(CartContext)
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider")
  }
  return context
}
