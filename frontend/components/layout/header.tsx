"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { ShoppingCart, User, Menu, X, MapPin } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useMobile } from "@/hooks/use-mobile"
import { useAuth } from "@/contexts/auth-context"
import { useCart } from "@/contexts/cart-context"
import { Badge } from "@/components/ui/badge"

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const pathname = usePathname()
  const isMobile = useMobile()
  const { user, isAuthenticated, logout } = useAuth()
  const { getItemCount } = useCart()
  const itemCount = getItemCount()

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen)
  }

  const navLinks = [
    { href: "/", label: "Home" },
    { href: "/restaurants", label: "Restaurants" },
  ]

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <span className="text-2xl font-bold text-primary">FoodHub</span>
          </Link>

          {/* Location selector - desktop */}
          {!isMobile && (
            <div className="hidden md:flex items-center ml-8">
              <Button variant="ghost" className="flex items-center text-sm">
                <MapPin className="h-4 w-4 mr-1" />
                <span>New York, NY</span>
              </Button>
            </div>
          )}

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-6 mx-6">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`text-sm font-medium transition-colors hover:text-primary ${
                  pathname === link.href ? "text-primary" : "text-muted-foreground"
                }`}
              >
                {link.label}
              </Link>
            ))}
            {user?.role === "admin" && (
              <Link
                href="/admin"
                className="text-sm font-medium transition-colors hover:text-primary ml-4 flex items-center"
              >
                <span className="bg-primary text-primary-foreground text-xs px-1.5 py-0.5 rounded mr-1">Admin</span>
                Portal
              </Link>
            )}
          </nav>

          {/* Desktop Right Section */}
          <div className="hidden md:flex items-center space-x-4">
            <Link href="/cart" className="relative">
              <Button variant="ghost" size="icon">
                <ShoppingCart className="h-5 w-5" />
                {itemCount > 0 && (
                  <Badge className="absolute -top-1 -right-1 h-5 w-5 p-0 flex items-center justify-center">
                    {itemCount}
                  </Badge>
                )}
              </Button>
            </Link>

            {isAuthenticated ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <User className="h-5 w-5" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem asChild>
                    <Link href="/profile">Profile</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/profile/orders">Orders</Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={logout}>Logout</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <div className="flex items-center space-x-2">
                <Button variant="ghost" asChild>
                  <Link href="/auth/login">Login</Link>
                </Button>
                <Button asChild>
                  <Link href="/auth/register">Sign Up</Link>
                </Button>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center">
            <Link href="/cart" className="relative mr-2">
              <Button variant="ghost" size="icon">
                <ShoppingCart className="h-5 w-5" />
                {itemCount > 0 && (
                  <Badge className="absolute -top-1 -right-1 h-5 w-5 p-0 flex items-center justify-center">
                    {itemCount}
                  </Badge>
                )}
              </Button>
            </Link>
            <Button variant="ghost" size="icon" onClick={toggleMenu}>
              {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden py-4">
            <div className="flex items-center space-x-2 mb-4">
              <MapPin className="h-4 w-4" />
              <span className="text-sm">New York, NY</span>
            </div>

            <nav className="flex flex-col space-y-4">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`text-sm font-medium transition-colors hover:text-primary ${
                    pathname === link.href ? "text-primary" : "text-muted-foreground"
                  }`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  {link.label}
                </Link>
              ))}

              {user?.role === "admin" && (
                <Link
                  href="/admin"
                  className="text-sm font-medium transition-colors hover:text-primary flex items-center"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <span className="bg-primary text-primary-foreground text-xs px-1.5 py-0.5 rounded mr-1">Admin</span>
                  Portal
                </Link>
              )}

              {isAuthenticated ? (
                <>
                  <Link href="/profile" className="text-sm font-medium" onClick={() => setIsMenuOpen(false)}>
                    Profile
                  </Link>
                  <Link href="/profile/orders" className="text-sm font-medium" onClick={() => setIsMenuOpen(false)}>
                    Orders
                  </Link>
                  <Button variant="ghost" className="justify-start px-0" onClick={logout}>
                    Logout
                  </Button>
                </>
              ) : (
                <div className="flex flex-col space-y-2">
                  <Button variant="outline" asChild>
                    <Link href="/auth/login" onClick={() => setIsMenuOpen(false)}>
                      Login
                    </Link>
                  </Button>
                  <Button asChild>
                    <Link href="/auth/register" onClick={() => setIsMenuOpen(false)}>
                      Sign Up
                    </Link>
                  </Button>
                </div>
              )}
            </nav>
          </div>
        )}
      </div>
    </header>
  )
}
