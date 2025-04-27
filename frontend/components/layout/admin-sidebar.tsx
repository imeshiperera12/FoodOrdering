"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { BarChart4, ShoppingBag, Users, Store, Truck, Settings, LogOut, Home } from "lucide-react"
import { Button } from "@/components/ui/button"

const sidebarItems = [
  {
    title: "Dashboard",
    href: "/admin",
    icon: <Home className="h-5 w-5" />,
  },
  {
    title: "Restaurants",
    href: "/admin/restaurants",
    icon: <Store className="h-5 w-5" />,
  },
  {
    title: "Orders",
    href: "/admin/orders",
    icon: <ShoppingBag className="h-5 w-5" />,
  },
  {
    title: "Users",
    href: "/admin/users",
    icon: <Users className="h-5 w-5" />,
  },
  {
    title: "Drivers",
    href: "/admin/drivers",
    icon: <Truck className="h-5 w-5" />,
  },
  {
    title: "Analytics",
    href: "/admin/analytics",
    icon: <BarChart4 className="h-5 w-5" />,
  },
  {
    title: "Settings",
    href: "/admin/settings",
    icon: <Settings className="h-5 w-5" />,
  },
]

export function AdminSidebar() {
  const pathname = usePathname()

  return (
    <aside className="hidden md:flex flex-col w-64 bg-card border-r min-h-screen">
      <div className="p-6">
        <Link href="/admin" className="flex items-center space-x-2">
          <span className="text-2xl font-bold text-primary">FoodHub</span>
          <span className="text-xs bg-primary text-white px-2 py-0.5 rounded">Admin</span>
        </Link>
      </div>

      <nav className="flex-1 p-4 space-y-1">
        {sidebarItems.map((item) => (
          <Link key={item.href} href={item.href}>
            <Button variant="ghost" className={cn("w-full justify-start", pathname === item.href && "bg-muted")}>
              {item.icon}
              <span className="ml-2">{item.title}</span>
            </Button>
          </Link>
        ))}
      </nav>

      <div className="p-4 border-t">
        <Button variant="ghost" className="w-full justify-start text-red-500">
          <LogOut className="h-5 w-5 mr-2" />
          Logout
        </Button>
      </div>
    </aside>
  )
}
