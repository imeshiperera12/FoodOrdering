"use client"

import { useState } from "react"
import Link from "next/link"
import { format, formatDistanceToNow } from "date-fns"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useNotifications, type Notification } from "@/context/notification-context"
import { Bell, Check, Package, Truck, Gift, Info } from "lucide-react"

export default function NotificationSidebar() {
  const { notifications, unreadCount, markNotificationAsRead, markAllAsRead } = useNotifications()
  const [open, setOpen] = useState(false)

  // Filter notifications by type
  const orderNotifications = notifications.filter((n) => n.type === "order_update")
  const deliveryNotifications = notifications.filter((n) => n.type === "delivery_update")
  const promotionNotifications = notifications.filter((n) => n.type === "promotion")
  const systemNotifications = notifications.filter((n) => n.type === "system")

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-xs text-primary-foreground">
              {unreadCount > 99 ? "99+" : unreadCount}
            </span>
          )}
        </Button>
      </SheetTrigger>
      <SheetContent className="w-full sm:max-w-md">
        <SheetHeader className="flex flex-row items-center justify-between">
          <SheetTitle>Notifications</SheetTitle>
          <Button variant="ghost" size="sm" onClick={markAllAsRead}>
            Mark all as read
          </Button>
        </SheetHeader>

        <Tabs defaultValue="all" className="mt-4">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="orders">Orders</TabsTrigger>
            <TabsTrigger value="delivery">Delivery</TabsTrigger>
            <TabsTrigger value="promo">Promos</TabsTrigger>
            <TabsTrigger value="system">System</TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="mt-4">
            <NotificationList
              notifications={notifications}
              onMarkAsRead={markNotificationAsRead}
              onClose={() => setOpen(false)}
            />
          </TabsContent>

          <TabsContent value="orders" className="mt-4">
            <NotificationList
              notifications={orderNotifications}
              onMarkAsRead={markNotificationAsRead}
              onClose={() => setOpen(false)}
            />
          </TabsContent>

          <TabsContent value="delivery" className="mt-4">
            <NotificationList
              notifications={deliveryNotifications}
              onMarkAsRead={markNotificationAsRead}
              onClose={() => setOpen(false)}
            />
          </TabsContent>

          <TabsContent value="promo" className="mt-4">
            <NotificationList
              notifications={promotionNotifications}
              onMarkAsRead={markNotificationAsRead}
              onClose={() => setOpen(false)}
            />
          </TabsContent>

          <TabsContent value="system" className="mt-4">
            <NotificationList
              notifications={systemNotifications}
              onMarkAsRead={markNotificationAsRead}
              onClose={() => setOpen(false)}
            />
          </TabsContent>
        </Tabs>
      </SheetContent>
    </Sheet>
  )
}

interface NotificationListProps {
  notifications: Notification[]
  onMarkAsRead: (id: string) => Promise<void>
  onClose: () => void
}

function NotificationList({ notifications, onMarkAsRead, onClose }: NotificationListProps) {
  if (notifications.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <Bell className="h-12 w-12 text-muted-foreground mb-4" />
        <h3 className="text-lg font-medium">No notifications</h3>
        <p className="text-sm text-muted-foreground mt-1">You're all caught up!</p>
      </div>
    )
  }

  return (
    <ScrollArea className="h-[calc(100vh-10rem)]">
      <div className="space-y-4 pr-3">
        {notifications.map((notification) => (
          <NotificationItem
            key={notification._id}
            notification={notification}
            onMarkAsRead={onMarkAsRead}
            onClose={onClose}
          />
        ))}
      </div>
    </ScrollArea>
  )
}

interface NotificationItemProps {
  notification: Notification
  onMarkAsRead: (id: string) => Promise<void>
  onClose: () => void
}

function NotificationItem({ notification, onMarkAsRead, onClose }: NotificationItemProps) {
  const handleClick = async () => {
    if (!notification.read) {
      await onMarkAsRead(notification._id)
    }
  }

  const getNotificationIcon = () => {
    switch (notification.type) {
      case "order_update":
        return <Package className="h-5 w-5" />
      case "delivery_update":
        return <Truck className="h-5 w-5" />
      case "promotion":
        return <Gift className="h-5 w-5" />
      case "system":
        return <Info className="h-5 w-5" />
      default:
        return <Bell className="h-5 w-5" />
    }
  }

  const getNotificationLink = () => {
    if (notification.type === "order_update" && notification.data?.orderId) {
      return `/orders/${notification.data.orderId}`
    }
    if (notification.type === "delivery_update" && notification.data?.orderId) {
      return `/orders/${notification.data.orderId}/track`
    }
    if (notification.type === "promotion" && notification.data?.restaurantId) {
      return `/restaurants/${notification.data.restaurantId}`
    }
    return "#"
  }

  const timeAgo = formatDistanceToNow(new Date(notification.createdAt), { addSuffix: true })
  const formattedDate = format(new Date(notification.createdAt), "MMM d, yyyy 'at' h:mm a")

  return (
    <div
      className={`relative rounded-lg border p-4 transition-colors ${
        notification.read ? "bg-background" : "bg-muted/50"
      }`}
    >
      <div className="flex items-start gap-4">
        <div className={`rounded-full p-2 ${getNotificationTypeColor(notification.type)}`}>{getNotificationIcon()}</div>
        <div className="flex-1">
          <Link
            href={getNotificationLink()}
            onClick={() => {
              handleClick()
              onClose()
            }}
            className="block"
          >
            <h4 className="font-medium">{notification.title}</h4>
            <p className="text-sm text-muted-foreground mt-1">{notification.message}</p>
            <p className="text-xs text-muted-foreground mt-2" title={formattedDate}>
              {timeAgo}
            </p>
          </Link>
        </div>
        {!notification.read && (
          <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full" onClick={handleClick}>
            <Check className="h-4 w-4" />
            <span className="sr-only">Mark as read</span>
          </Button>
        )}
      </div>
    </div>
  )
}

function getNotificationTypeColor(type: string) {
  switch (type) {
    case "order_update":
      return "bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-300"
    case "delivery_update":
      return "bg-green-100 text-green-600 dark:bg-green-900 dark:text-green-300"
    case "promotion":
      return "bg-purple-100 text-purple-600 dark:bg-purple-900 dark:text-purple-300"
    case "system":
      return "bg-orange-100 text-orange-600 dark:bg-orange-900 dark:text-orange-300"
    default:
      return "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-300"
  }
}
