import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { ProfileSidebar } from "@/components/profile/profile-sidebar"
import { OrderHistory } from "@/components/profile/order-history"

export default function OrdersPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">Your Orders</h1>
        <div className="flex flex-col md:flex-row gap-8">
          <div className="w-full md:w-1/4">
            <ProfileSidebar />
          </div>
          <div className="w-full md:w-3/4">
            <OrderHistory />
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
