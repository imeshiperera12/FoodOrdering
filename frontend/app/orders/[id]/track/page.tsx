import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { OrderTracker } from "@/components/orders/order-tracker"
import { OrderDetails } from "@/components/orders/order-details"
import { DeliveryMap } from "@/components/orders/delivery-map"

export default function TrackOrderPage({ params }: { params: { id: string } }) {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">Track Your Order</h1>
        <div className="flex flex-col lg:flex-row gap-8">
          <div className="w-full lg:w-1/2">
            <OrderTracker orderId={params.id} />
            <OrderDetails orderId={params.id} />
          </div>
          <div className="w-full lg:w-1/2">
            <DeliveryMap orderId={params.id} />
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
