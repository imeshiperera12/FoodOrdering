"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { useAuth } from "@/context/auth-context"
import { useCart } from "@/context/cart-context"
import { UtensilsCrossed, Menu, ShoppingCart, User, LogOut, Home, Package, Settings, ChevronDown } from "lucide-react"
import NotificationSidebar from "@/components/notification-sidebar"

export default function Header() {
  const { user, isAuthenticated, logout } = useAuth()
  const { items } = useCart()
  const pathname = usePathname()
  const [isMounted, setIsMounted] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)

  // Handle scroll effect for header
  useEffect(() => {
    setIsMounted(true)

    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10)
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  if (!isMounted) return null

  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0)

  const getDashboardLink = () => {
    if (!user) return "/login"

    switch (user.role) {
      case "admin":
        return "/dashboard/admin"
      case "restaurant_admin":
        return "/dashboard/restaurant"
      case "delivery_person":
        return "/dashboard/delivery"
      default:
        return "/profile"
    }
  }

  return (
    <header
      className={`sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 transition-shadow ${
        isScrolled ? "shadow-md" : ""
      }`}
    >
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-2">
          <Link href="/" className="flex items-center gap-2">
            <UtensilsCrossed className="h-6 w-6" />
            <span className="text-xl font-bold">FoodHub</span>
          </Link>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex gap-6">
          <Link
            href="/restaurants"
            className={`text-sm font-medium ${pathname === "/restaurants" ? "text-primary" : ""}`}
          >
            Restaurants
          </Link>
          {isAuthenticated && (
            <Link href="/orders" className={`text-sm font-medium ${pathname === "/orders" ? "text-primary" : ""}`}>
              Orders
            </Link>
          )}
          <Link href="/about" className={`text-sm font-medium ${pathname === "/about" ? "text-primary" : ""}`}>
            About
          </Link>
          <Link href="/contact" className={`text-sm font-medium ${pathname === "/contact" ? "text-primary" : ""}`}>
            Contact
          </Link>
        </nav>

        <div className="flex items-center gap-4">
          {/* Cart Button and Notifications */}
          <div className="flex items-center gap-2">
            <NotificationSidebar />
            <Link href="/cart">
              <Button variant="ghost" size="icon" className="relative">
                <ShoppingCart className="h-5 w-5" />
                {totalItems > 0 && (
                  <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-xs text-primary-foreground">
                    {totalItems}
                  </span>
                )}
              </Button>
            </Link>
          </div>

          {/* User Menu - Desktop */}
          {isAuthenticated ? (
            <div className="hidden md:block">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="flex items-center gap-2">
                    {user?.image ? (
                      <Image
                        src={user.image || "/placeholder.svg"}
                        alt={user.name}
                        width={24}
                        height={24}
                        className="rounded-full"
                      />
                    ) : (
                      <User className="h-5 w-5" />
                    )}
                    <span className="max-w-[100px] truncate">{user?.name}</span>
                    <ChevronDown className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>
                    <div className="flex flex-col">
                      <span>{user?.name}</span>
                      <span className="text-xs text-muted-foreground">{user?.email}</span>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link href={getDashboardLink()} className="cursor-pointer">
                      <Home className="mr-2 h-4 w-4" />
                      <span>{user?.role === "customer" ? "Profile" : "Dashboard"}</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/orders" className="cursor-pointer">
                      <Package className="mr-2 h-4 w-4" />
                      <span>Orders</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/profile/settings" className="cursor-pointer">
                      <Settings className="mr-2 h-4 w-4" />
                      <span>Settings</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={logout} className="cursor-pointer">
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Log out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          ) : (
            <div className="hidden md:flex items-center gap-4">
              <Link href="/login">
                <Button variant="outline" size="sm">
                  Log in
                </Button>
              </Link>
              <Link href="/register">
                <Button size="sm">Sign up</Button>
              </Link>
            </div>
          )}

          {/* Mobile Menu */}
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden">
                <Menu className="h-6 w-6" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right">
              <div className="flex flex-col h-full">
                <div className="flex items-center gap-2 mb-8">
                  <UtensilsCrossed className="h-6 w-6" />
                  <span className="text-xl font-bold">FoodHub</span>
                </div>

                {isAuthenticated && (
                  <div className="flex items-center gap-3 mb-6 p-3 bg-muted rounded-lg">
                    {user?.image ? (
                      <Image
                        src={user.image || "/placeholder.svg"}
                        alt={user.name}
                        width={40}
                        height={40}
                        className="rounded-full"
                      />
                    ) : (
                      <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                        <User className="h-5 w-5" />
                      </div>
                    )}
                    <div className="flex flex-col">
                      <span className="font-medium">{user?.name}</span>
                      <span className="text-xs text-muted-foreground">{user?.email}</span>
                    </div>
                  </div>
                )}

                <nav className="flex flex-col gap-2">
                  <Link href="/" className="flex items-center gap-2 px-2 py-2 rounded-md hover:bg-muted">
                    <Home className="h-5 w-5" />
                    <span>Home</span>
                  </Link>
                  <Link href="/restaurants" className="flex items-center gap-2 px-2 py-2 rounded-md hover:bg-muted">
                    <UtensilsCrossed className="h-5 w-5" />
                    <span>Restaurants</span>
                  </Link>
                  {isAuthenticated && (
                    <Link href="/orders" className="flex items-center gap-2 px-2 py-2 rounded-md hover:bg-muted">
                      <Package className="h-5 w-5" />
                      <span>Orders</span>
                    </Link>
                  )}
                  <Link href="/cart" className="flex items-center gap-2 px-2 py-2 rounded-md hover:bg-muted">
                    <ShoppingCart className="h-5 w-5" />
                    <span>Cart</span>
                    {totalItems > 0 && (
                      <span className="ml-auto flex h-5 w-5 items-center justify-center rounded-full bg-primary text-xs text-primary-foreground">
                        {totalItems}
                      </span>
                    )}
                  </Link>
                  {isAuthenticated ? (
                    <>
                      <Link
                        href={getDashboardLink()}
                        className="flex items-center gap-2 px-2 py-2 rounded-md hover:bg-muted"
                      >
                        <User className="h-5 w-5" />
                        <span>{user?.role === "customer" ? "Profile" : "Dashboard"}</span>
                      </Link>
                      <button
                        onClick={logout}
                        className="flex items-center gap-2 px-2 py-2 rounded-md hover:bg-muted text-left"
                      >
                        <LogOut className="h-5 w-5" />
                        <span>Log out</span>
                      </button>
                    </>
                  ) : (
                    <div className="flex flex-col gap-2 mt-4">
                      <Link href="/login">
                        <Button variant="outline" className="w-full">
                          Log in
                        </Button>
                      </Link>
                      <Link href="/register">
                        <Button className="w-full">Sign up</Button>
                      </Link>
                    </div>
                  )}
                </nav>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  )
}
