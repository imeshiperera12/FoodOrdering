"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { User, ShoppingBag, CreditCard, MapPin, Heart, Settings, LogOut } from "lucide-react"
import { cn } from "@/lib/utils"

const menuItems = [
  {
    href: "/profile",
    label: "Personal Info",
    icon: <User className="h-5 w-5 mr-2" />,
  },
  {
    href: "/profile/orders",
    label: "Order History",
    icon: <ShoppingBag className="h-5 w-5 mr-2" />,
  },
  {
    href: "/profile/payment",
    label: "Payment Methods",
    icon: <CreditCard className="h-5 w-5 mr-2" />,
  },
  {
    href: "/profile/addresses",
    label: "Saved Addresses",
    icon: <MapPin className="h-5 w-5 mr-2" />,
  },
  {
    href: "/profile/favorites",
    label: "Favorites",
    icon: <Heart className="h-5 w-5 mr-2" />,
  },
  {
    href: "/profile/settings",
    label: "Account Settings",
    icon: <Settings className="h-5 w-5 mr-2" />,
  },
]

export function ProfileSidebar() {
  const pathname = usePathname()

  return (
    <div className="space-y-6">
      <div className="bg-card rounded-lg border p-4">
        <nav className="space-y-1">
          {menuItems.map((item) => (
            <Link key={item.href} href={item.href}>
              <Button variant="ghost" className={cn("w-full justify-start", pathname === item.href && "bg-muted")}>
                {item.icon}
                {item.label}
              </Button>
            </Link>
          ))}
        </nav>
      </div>

      <Button variant="outline" className="w-full justify-start text-destructive">
        <LogOut className="h-5 w-5 mr-2" />
        Logout
      </Button>
    </div>
  )
}
