import { CheckCircle, Clock, UtensilsCrossed, Truck, Package, X } from "lucide-react"

interface OrderTimelineProps {
  order: any
  delivery?: any
}

export default function OrderTimeline({ order, delivery }: OrderTimelineProps) {
  if (!order) return null

  // Prepare timeline events
  const events = []

  // Order placed
  events.push({
    title: "Order Placed",
    description: "Your order has been received",
    icon: <Clock className="h-4 w-4" />,
    timestamp: order.createdAt,
    completed: true,
  })

  // Order confirmed
  if (order.status !== "cancelled" && (order.status !== "pending" || order.confirmedAt)) {
    events.push({
      title: "Order Confirmed",
      description: "Restaurant has confirmed your order",
      icon: <CheckCircle className="h-4 w-4" />,
      timestamp: order.confirmedAt || null,
      completed: order.status !== "pending",
    })
  }

  // Order preparation
  if (["preparing", "ready", "picked_up", "delivering", "delivered"].includes(order.status)) {
    events.push({
      title: "Preparing Order",
      description: "The restaurant is preparing your food",
      icon: <UtensilsCrossed className="h-4 w-4" />,
      timestamp: order.preparingAt || null,
      completed: ["ready", "picked_up", "delivering", "delivered"].includes(order.status),
    })
  }

  // Order ready
  if (["ready", "picked_up", "delivering", "delivered"].includes(order.status)) {
    events.push({
      title: "Order Ready",
      description: "Your order is ready for pickup",
      icon: <Package className="h-4 w-4" />,
      timestamp: order.readyAt || null,
      completed: ["picked_up", "delivering", "delivered"].includes(order.status),
    })
  }

  // Order picked up
  if (delivery && ["picked_up", "delivering", "delivered"].includes(delivery.status)) {
    events.push({
      title: "Order Picked Up",
      description: "Delivery partner has picked up your order",
      icon: <Truck className="h-4 w-4" />,
      timestamp: delivery.pickedUpAt || null,
      completed: ["delivering", "delivered"].includes(delivery.status),
    })
  }

  // Order delivering
  if (delivery && ["delivering", "delivered"].includes(delivery.status)) {
    events.push({
      title: "On the Way",
      description: "Your order is on the way to your location",
      icon: <Truck className="h-4 w-4" />,
      timestamp: delivery.deliveringAt || null,
      completed: delivery.status === "delivered",
    })
  }

  // Order delivered
  if (delivery && delivery.status === "delivered") {
    events.push({
      title: "Delivered",
      description: "Your order has been delivered",
      icon: <CheckCircle className="h-4 w-4" />,
      timestamp: delivery.deliveredAt || null,
      completed: true,
    })
  }

  // Order cancelled
  if (order.status === "cancelled") {
    events.push({
      title: "Cancelled",
      description: order.cancellationReason || "Order was cancelled",
      icon: <X className="h-4 w-4" />,
      timestamp: order.cancelledAt || null,
      completed: true,
      cancelled: true,
    })
  }

  return (
    <div className="space-y-4">
      {events.map((event, index) => (
        <div key={index} className="flex">
          <div className="mr-4 flex flex-col items-center">
            <div
              className={`flex h-8 w-8 items-center justify-center rounded-full ${
                event.cancelled
                  ? "bg-red-100 text-red-600"
                  : event.completed
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted text-muted-foreground"
              }`}
            >
              {event.icon}
            </div>
            {index < events.length - 1 && (
              <div className={`h-full w-0.5 ${event.completed ? "bg-primary" : "bg-muted"}`} />
            )}
          </div>
          <div className="pb-8">
            <div className="flex items-baseline justify-between">
              <p className="font-medium">{event.title}</p>
              {event.timestamp && (
                <p className="text-xs text-muted-foreground">
                  {new Date(event.timestamp).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </p>
              )}
            </div>
            <p className="text-sm text-muted-foreground">{event.description}</p>
          </div>
        </div>
      ))}
    </div>
  )
}
