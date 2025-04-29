"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/context/auth-context"
import { UtensilsCrossed, Home, Package, ShoppingBag, Users, Settings, LogOut, Bell, Menu, X } from "lucide-react"

export default function DashboardLayout({ children }) {
  const { user, logout } = useAuth()
  const pathname = usePathname()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  const isActive = (path) => {
    return pathname === path || pathname?.startsWith(`${path}/`)
  }

  const getNavItems = () => {
    if (user?.role === "admin") {
      return [
        { href: "/dashboard/admin", label: "Dashboard", icon: Home },
        { href: "/dashboard/admin/orders", label: "Orders", icon: Package },
        { href: "/dashboard/admin/restaurants", label: "Restaurants", icon: ShoppingBag },
        { href: "/dashboard/admin/users", label: "Users", icon: Users },
        { href: "/dashboard/analytics", label: "Analytics", icon: Users },
        { href: "/dashboard/admin/settings", label: "Settings", icon: Settings },
      ]
    } else if (user?.role === "restaurant_admin") {
      return [
        { href: "/dashboard/restaurant", label: "Dashboard", icon: Home },
        { href: "/dashboard/restaurant/orders", label: "Orders", icon: Package },
        { href: "/dashboard/restaurant/menu", label: "Menu", icon: ShoppingBag },
        { href: "/dashboard/analytics", label: "Analytics", icon: Users },
        { href: "/dashboard/restaurant/settings", label: "Settings", icon: Settings },
      ]
    } else if (user?.role === "delivery_person") {
      return [
        { href: "/dashboard/delivery", label: "Dashboard", icon: Home },
        { href: "/dashboard/delivery/active", label: "Active Deliveries", icon: Package },
        { href: "/dashboard/delivery/history", label: "History", icon: ShoppingBag },
        { href: "/dashboard/delivery/settings", label: "Settings", icon: Settings },
      ]
    } else {
      return [
        { href: "/dashboard", label: "Dashboard", icon: Home },
        { href: "/orders", label: "Orders", icon: Package },
        { href: "/profile", label: "Profile", icon: Users },
      ]
    }
  }

  const navItems = getNavItems()

  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
            <Link href="/" className="flex items-center gap-2">
              <UtensilsCrossed className="h-6 w-6" />
              <span className="text-xl font-bold">FoodHub</span>
            </Link>
          </div>
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon">
              <Bell className="h-5 w-5" />
            </Button>
            <div className="hidden md:flex items-center gap-2">
              <span className="text-sm font-medium">{user?.name}</span>
              <Button variant="ghost" size="sm" onClick={logout}>
                <LogOut className="h-4 w-4 mr-2" />
                Log out
              </Button>
            </div>
          </div>
        </div>
      </header>
      <div className="flex flex-1">
        {/* Mobile sidebar */}
        {isMobileMenuOpen && (
          <div className="fixed inset-0 z-40 bg-background/80 backdrop-blur-sm md:hidden">
            <div className="fixed inset-y-0 left-0 z-50 w-3/4 max-w-xs bg-background p-6 shadow-lg">
              <div className="flex flex-col gap-6">
                <div className="flex items-center justify-between">
                  <Link href="/" className="flex items-center gap-2">
                    <UtensilsCrossed className="h-6 w-6" />
                    <span className="text-xl font-bold">FoodHub</span>
                  </Link>
                  <Button variant="ghost" size="icon" onClick={() => setIsMobileMenuOpen(false)}>
                    <X className="h-5 w-5" />
                  </Button>
                </div>
                <nav className="flex flex-col gap-2">
                  {navItems.map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium ${
                        isActive(item.href)
                          ? "bg-primary text-primary-foreground"
                          : "hover:bg-muted hover:text-foreground"
                      }`}
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      <item.icon className="h-5 w-5" />
                      {item.label}
                    </Link>
                  ))}
                </nav>
                <div className="mt-auto">
                  <Button variant="ghost" className="w-full justify-start" onClick={logout}>
                    <LogOut className="h-5 w-5 mr-2" />
                    Log out
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Desktop sidebar */}
        <div className="hidden md:flex w-64 flex-col border-r bg-muted/40">
          <div className="flex flex-col gap-2 p-4">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                  isActive(item.href) ? "bg-primary text-primary-foreground" : "hover:bg-muted hover:text-foreground"
                }`}
              >
                <item.icon className="h-5 w-5" />
                {item.label}
              </Link>
            ))}
          </div>
        </div>

        <main className="flex-1 overflow-auto p-6">{children}</main>
      </div>
    </div>
  )
}
