"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"

interface CartItem {
  id: string
  name: string
  price: number
  quantity: number
  restaurantId: string
  restaurantName: string
}

interface CartContextType {
  items: CartItem[]
  totalAmount: number
  addToCart: (item: Omit<CartItem, "quantity">) => void
  removeFromCart: (itemId: string) => void
  clearCart: () => void
  getItemQuantity: (itemId: string) => number
}

const CartContext = createContext<CartContextType | undefined>(undefined)

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([])
  const [totalAmount, setTotalAmount] = useState(0)

  // Load cart from localStorage on mount
  useEffect(() => {
    const savedCart = localStorage.getItem("cart")
    if (savedCart) {
      const parsedCart = JSON.parse(savedCart)
      setItems(parsedCart)
      calculateTotal(parsedCart)
    }
  }, [])

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(items))
    calculateTotal(items)
  }, [items])

  const calculateTotal = (cartItems: CartItem[]) => {
    const total = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0)
    setTotalAmount(total)
  }

  const addToCart = (item: Omit<CartItem, "quantity">) => {
    setItems((prevItems) => {
      const existingItemIndex = prevItems.findIndex((i) => i.id === item.id)

      if (existingItemIndex >= 0) {
        // Item exists, increment quantity
        const updatedItems = [...prevItems]
        updatedItems[existingItemIndex] = {
          ...updatedItems[existingItemIndex],
          quantity: updatedItems[existingItemIndex].quantity + 1,
        }
        return updatedItems
      } else {
        // Item doesn't exist, add it with quantity 1
        return [...prevItems, { ...item, quantity: 1 }]
      }
    })
  }

  const removeFromCart = (itemId: string) => {
    setItems((prevItems) => {
      const existingItemIndex = prevItems.findIndex((i) => i.id === itemId)

      if (existingItemIndex >= 0) {
        const updatedItems = [...prevItems]
        if (updatedItems[existingItemIndex].quantity === 1) {
          // If quantity is 1, remove the item
          return updatedItems.filter((item) => item.id !== itemId)
        } else {
          // Otherwise, decrement quantity
          updatedItems[existingItemIndex] = {
            ...updatedItems[existingItemIndex],
            quantity: updatedItems[existingItemIndex].quantity - 1,
          }
          return updatedItems
        }
      }
      return prevItems
    })
  }

  const clearCart = () => {
    setItems([])
  }

  const getItemQuantity = (itemId: string) => {
    const item = items.find((i) => i.id === itemId)
    return item ? item.quantity : 0
  }

  return (
    <CartContext.Provider
      value={{
        items,
        totalAmount,
        addToCart,
        removeFromCart,
        clearCart,
        getItemQuantity,
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
